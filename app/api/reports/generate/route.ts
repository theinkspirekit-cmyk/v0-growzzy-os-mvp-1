import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * POST /api/reports/generate
 * Creates a new report record, fetches data, and generates AI summary
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, type, startDate, endDate, platformId } = body

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Start and End dates required' }, { status: 400 })
    }

    // 1. Fetch Analytics Data
    const analytics = await prisma.analytics.findMany({
      where: {
        platform: {
          userId: session.user.id,
          ...(platformId ? { id: platformId } : {})
        },
        metricDate: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        platform: { select: { name: true } }
      },
      orderBy: { metricDate: 'asc' }
    })

    if (analytics.length === 0) {
      return NextResponse.json({ error: 'No data found for this period' }, { status: 404 })
    }

    // Aggregate Metrics
    const totals = analytics.reduce((acc: any, curr: any) => {
      acc.spend += curr.spend || 0
      acc.revenue += curr.revenue || 0
      acc.impressions += curr.impressions || 0
      acc.clicks += curr.clicks || 0
      acc.conversions += curr.conversions || 0
      acc.leads += curr.leads || 0
      return acc
    }, { spend: 0, revenue: 0, impressions: 0, clicks: 0, conversions: 0, leads: 0 })

    totals.roas = totals.spend > 0 ? totals.revenue / totals.spend : 0
    totals.cpc = totals.clicks > 0 ? totals.spend / totals.clicks : 0
    totals.ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0

    // 2. Generate AI Executive Summary
    let aiSummary = "Automatic summary generation unavailable."

    if (process.env.OPENAI_API_KEY) {
      try {
        const prompt = `
                You are a senior marketing analyst. Write an executive summary for a performance report.
                Period: ${startDate} to ${endDate}
                
                Data:
                - Total Spend: $${totals.spend.toFixed(2)}
                - Total Revenue: $${totals.revenue.toFixed(2)}
                - ROAS: ${totals.roas.toFixed(2)}x
                - Conversions: ${totals.conversions}
                - Leads: ${totals.leads}
                
                Key trend: Analyze the data above and provide 3 bullet points on performance, 1 major win, and 1 area for optimization. Keep it professional and concise.
                `

        const response = await openai.chat.completions.create({
          model: "gpt-4-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        })

        aiSummary = response.choices[0]?.message?.content || aiSummary
      } catch (err) {
        console.error("OpenAI Error:", err)
      }
    }

    // 3. Save Report to Database
    const report = await prisma.report.create({
      data: {
        userId: session.user.id,
        name: name || `Report ${new Date().toLocaleDateString()}`,
        type: type || 'custom',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        format: 'pdf',
        status: 'ready',
        data: {
          totals,
          daily: analytics,
          meta: { generatedAt: new Date() }
        },
        aiSummary: aiSummary
      }
    })

    return NextResponse.json({
      success: true,
      reportId: report.id,
      summary: aiSummary,
      totals
    })

  } catch (error: any) {
    console.error('[Report Generator] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
