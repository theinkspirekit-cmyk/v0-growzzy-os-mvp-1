export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AIAnalysis } from '@/lib/ai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { leadIds, campaignId } = await req.json()

    if (!leadIds || !Array.isArray(leadIds)) {
      return NextResponse.json({ error: 'Invalid lead IDs' }, { status: 400 })
    }

    // Fetch leads
    const leads = await prisma.lead.findMany({
      where: {
        userId: session.user.id,
        id: { in: leadIds }
      },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        source: true
      }
    })

    if (leads.length === 0) {
      return NextResponse.json({ error: 'No leads found' }, { status: 404 })
    }

    // Score leads using AI
    const leadData = leads.map(l => ({
      name: l.name,
      email: l.email,
      company: l.company || '',
      source: l.source || 'unknown'
    }))

    const scoresText = await AIAnalysis.scoreLeads(leadData)
    let scores = []

    try {
      const parsed = JSON.parse(scoresText || '[]')
      scores = Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      scores = leads.map(l => ({ email: l.email, score: 50, reason: 'Auto-scored' }))
    }

    // Update leads with scores
    const updates = []
    for (const score of scores) {
      const lead = leads.find(l => l.email === score.email)
      if (lead) {
        updates.push(
          prisma.lead.update({
            where: { id: lead.id },
            data: {
              aiScore: Math.min(100, Math.max(0, Math.round(score.score)))
            }
          })
        )
      }
    }

    await Promise.all(updates)

    // Save scoring event
    if (campaignId) {
      await prisma.analyticsEvent.create({
        data: {
          userId: session.user.id,
          eventType: 'lead_scored',
          eventData: {
            leadCount: leads.length,
            campaignId,
            timestamp: new Date().toISOString()
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      scoredCount: scores.length,
      scores: scores.map((s, i) => ({
        email: s.email,
        score: Math.round(s.score),
        reason: s.reason || 'AI-scored'
      }))
    })
  } catch (error: any) {
    console.error('[v0] Lead scoring error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to score leads' },
      { status: 500 }
    )
  }
}
