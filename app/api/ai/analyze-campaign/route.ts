export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AIAnalysis } from '@/lib/ai'
import { MetricsCalculator } from '@/lib/metrics'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { campaignId } = await req.json()

    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 })
    }

    // Fetch campaign
    const campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, userId: session.user.id }
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Fetch performance metrics for the last 30 days
    const metrics = await prisma.performanceMetric.findMany({
      where: {
        userId: session.user.id,
        entityId: campaignId,
        entityType: 'campaign',
        periodDate: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: { periodDate: 'desc' },
      take: 90
    })

    if (metrics.length === 0) {
      return NextResponse.json({
        success: true,
        insights: [],
        message: 'No performance data available for analysis'
      })
    }

    // Aggregate metrics
    const spend = metrics
      .filter(m => m.metricName === 'spend')
      .reduce((sum, m) => sum + m.metricValue, 0)
    const revenue = metrics
      .filter(m => m.metricName === 'revenue')
      .reduce((sum, m) => sum + m.metricValue, 0)
    const clicks = metrics
      .filter(m => m.metricName === 'clicks')
      .reduce((sum, m) => sum + m.metricValue, 0)
    const impressions = metrics
      .filter(m => m.metricName === 'impressions')
      .reduce((sum, m) => sum + m.metricValue, 0)
    const conversions = metrics
      .filter(m => m.metricName === 'conversions')
      .reduce((sum, m) => sum + m.metricValue, 0)

    // Calculate KPIs
    const cpc = MetricsCalculator.calculateCPC(spend, clicks)
    const ctr = MetricsCalculator.calculateCTR(clicks, impressions)
    const cpa = MetricsCalculator.calculateCPA(spend, conversions)
    const roas = MetricsCalculator.calculateROAS(revenue, spend)
    const roi = MetricsCalculator.calculateROI(revenue, spend)

    // Call AI analysis
    const analysisText = await AIAnalysis.analyzeCampaign({
      name: campaign.name,
      spend,
      revenue,
      clicks,
      impressions,
      conversions,
      cpc,
      ctr,
      roas,
      cpa
    })

    // Parse insights
    let insights = []
    try {
      const parsed = JSON.parse(analysisText || '[]')
      insights = Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      insights = [{ insight: analysisText, severity: 'medium' }]
    }

    // Store insights in database
    const savedInsights = []
    for (const insight of insights) {
      const saved = await prisma.aIInsight.create({
        data: {
          userId: session.user.id,
          entityType: 'campaign',
          entityId: campaignId,
          insightType: insight.severity === 'high' ? 'risk' : 'opportunity',
          title: insight.insight?.substring(0, 100) || 'Campaign Insight',
          description: insight.insight || '',
          recommendation: insight.recommendation || insight.actionable_recommendation,
          confidence: 80,
          data: {
            metrics: { spend, revenue, clicks, impressions, conversions, cpc, ctr, roas, cpa, roi },
            fullInsight: insight
          }
        }
      })
      savedInsights.push(saved)
    }

    // Record analytics event
    await prisma.analyticsEvent.create({
      data: {
        userId: session.user.id,
        eventType: 'campaign_analyzed',
        eventData: {
          campaignId,
          insightCount: insights.length,
          metrics: { spend, revenue, roas, roi },
          timestamp: new Date().toISOString()
        }
      }
    })

    return NextResponse.json({
      success: true,
      campaign: {
        id: campaign.id,
        name: campaign.name,
        platform: campaign.platform
      },
      metrics: {
        spend: Number(spend.toFixed(2)),
        revenue: Number(revenue.toFixed(2)),
        clicks,
        impressions,
        conversions,
        cpc: Number(cpc.toFixed(2)),
        ctr: Number(ctr.toFixed(2)),
        cpa: Number(cpa.toFixed(2)),
        roas: Number(roas.toFixed(2)),
        roi: Number(roi.toFixed(2))
      },
      insights: savedInsights.map(i => ({
        id: i.id,
        title: i.title,
        description: i.description,
        recommendation: i.recommendation,
        type: i.insightType,
        confidence: i.confidence
      }))
    })
  } catch (error: any) {
    console.error('[v0] Campaign analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze campaign' },
      { status: 500 }
    )
  }
}
