export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AIAnalysis } from '@/lib/ai'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const generateCreativeSchema = z.object({
  type: z.enum(['headline', 'ad_copy', 'cta']),
  brief: z.string().min(10, 'Brief must be at least 10 characters'),
  platform: z.enum(['meta', 'google', 'linkedin', 'shopify']).optional(),
  campaignId: z.string().optional(),
  tone: z.enum(['professional', 'casual', 'urgent', 'educational']).optional()
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validated = generateCreativeSchema.parse(body)

    // If campaign specified, verify ownership
    if (validated.campaignId) {
      const campaign = await prisma.campaign.findFirst({
        where: { id: validated.campaignId, userId: session.user.id }
      })
      if (!campaign) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
      }
    }

    // Generate creative variations
    const variationsText = await AIAnalysis.generateCreativeVariations(
      validated.brief,
      validated.type
    )

    // Parse variations
    let variations: string[] = []
    try {
      const parsed = JSON.parse(variationsText || '[]')
      variations = Array.isArray(parsed) ? parsed : typeof parsed === 'string' ? [parsed] : []
    } catch {
      // Fallback: try to split by common delimiters
      variations = variationsText
        ?.split(/\n(?:\d+\.|-)/)
        .filter(v => v.trim().length > 0)
        .map(v => v.trim()) || [validated.brief]
    }

    // Save to content library
    const libraryEntry = await prisma.contentLibrary.create({
      data: {
        userId: session.user.id,
        name: `${validated.type} - ${validated.brief.substring(0, 40)}`,
        category: validated.type,
        contentType: 'generated',
        content: variations.join('\n---\n'),
        tags: [
          validated.type,
          'generated',
          validated.tone,
          validated.platform
        ].filter(Boolean) as string[],
        context: {
          brief: validated.brief,
          type: validated.type,
          platform: validated.platform,
          tone: validated.tone,
          campaignId: validated.campaignId,
          timestamp: new Date().toISOString()
        }
      }
    })

    // Record analytics event
    await prisma.analyticsEvent.create({
      data: {
        userId: session.user.id,
        eventType: 'creative_generated',
        eventData: {
          type: validated.type,
          platform: validated.platform,
          campaignId: validated.campaignId,
          variationCount: variations.length,
          timestamp: new Date().toISOString()
        }
      }
    })

    return NextResponse.json({
      success: true,
      libraryId: libraryEntry.id,
      type: validated.type,
      brief: validated.brief,
      variations: variations.slice(0, 5).map((v, i) => ({
        id: `${libraryEntry.id}-${i}`,
        content: v.trim(),
        order: i + 1
      })),
      total: variations.length,
      metadata: {
        platform: validated.platform,
        tone: validated.tone,
        campaignId: validated.campaignId,
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('[v0] Creative generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate creatives' },
      { status: 500 }
    )
  }
}
