export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AIAnalysis } from '@/lib/ai'
import { MetricsCalculator } from '@/lib/metrics'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all active campaigns
    const campaigns = await prisma.campaign.findMany({
      where: { userId: session.user.id, status: 'active' },
      take: 10
    })

    if (campaigns.length === 0) {
      return NextResponse.json({
        success: true,
        recommendations: [],
        message: 'No active campaigns to analyze'
      })
    }

    const recommendations = []

    // Analyze each campaign
    for (const campaign of campaigns) {
      try {
        const metrics = await prisma.performanceMetric.findMany({
          where: {
            userId: session.user.id,
            entityId: campaign.id,
            entityType: 'campaign',
            periodDate: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
            }
          },
          take: 30
        })

        if (metrics.length === 0) continue

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

        // Calculate metrics
        const data = {
          campaignName: campaign.name,
          platform: campaign.platform,
          spend,
          revenue,
          clicks,
          impressions,
          conversions,
          cpc: MetricsCalculator.calculateCPC(spend, clicks),
          ctr: MetricsCalculator.calculateCTR(clicks, impressions),
          cpa: MetricsCalculator.calculateCPA(spend, conversions),
          roas: MetricsCalculator.calculateROAS(revenue, spend),
          roi: MetricsCalculator.calculateROI(revenue, spend)
        }

        // Get AI recommendations
        const recommendationsText = await AIAnalysis.generateRecommendations(data)

        if (recommendationsText) {
          recommendations.push({
            campaignId: campaign.id,
            campaignName: campaign.name,
            platform: campaign.platform,
            recommendations: recommendationsText,
            metrics: data,
            priority:
              data.roas < 2
                ? 'high'
                : data.roas < 3
                  ? 'medium'
                  : 'low'
          })
        }
      } catch (err) {
        console.warn(`Failed to generate recommendations for campaign ${campaign.id}:`, err)
      }
    }

    // Save recommendations to database
    for (const rec of recommendations) {
      try {
        await prisma.aIInsight.create({
          data: {
            userId: session.user.id,
            entityType: 'campaign',
            entityId: rec.campaignId,
            insightType: 'opportunity',
            title: `${rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority Recommendations`,
            description: rec.recommendations,
            recommendation: rec.recommendations,
            confidence: 85,
            data: {
              metrics: rec.metrics,
              priority: rec.priority
            }
          }
        })
      } catch (err) {
        console.warn(`Failed to save recommendation for campaign ${rec.campaignId}:`, err)
      }
    }

    return NextResponse.json({
      success: true,
      count: recommendations.length,
      recommendations: recommendations.map(r => ({
        campaignId: r.campaignId,
        campaignName: r.campaignName,
        platform: r.platform,
        priority: r.priority,
        recommendations: r.recommendations,
        metrics: {
          roas: Number(r.metrics.roas.toFixed(2)),
          roi: Number(r.metrics.roi.toFixed(2)),
          spend: Number(r.metrics.spend.toFixed(2)),
          revenue: Number(r.metrics.revenue.toFixed(2))
        }
      }))
    })
  } catch (error: any) {
    console.error('[v0] Recommendations error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}

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

    // Verify campaign ownership
    const campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, userId: session.user.id }
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Get recent metrics
    const metrics = await prisma.performanceMetric.findMany({
      where: {
        userId: session.user.id,
        entityId: campaignId,
        entityType: 'campaign',
        periodDate: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      take: 30
    })

    if (metrics.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No performance data available'
      })
    }

    // Aggregate and generate recommendations
    const spend = metrics
      .filter(m => m.metricName === 'spend')
      .reduce((sum, m) => sum + m.metricValue, 0)
    const revenue = metrics
      .filter(m => m.metricName === 'revenue')
      .reduce((sum, m) => sum + m.metricValue, 0)

    const data = {
      campaign: campaign.name,
      spend,
      revenue,
      roas: spend > 0 ? revenue / spend : 0
    }

    const recommendationsText = await AIAnalysis.generateRecommendations(data)

    // Save to insights
    const insight = await prisma.aIInsight.create({
      data: {
        userId: session.user.id,
        entityType: 'campaign',
        entityId: campaignId,
        insightType: 'opportunity',
        title: `AI Recommendations for ${campaign.name}`,
        description: recommendationsText || 'No specific recommendations at this time',
        recommendation: recommendationsText,
        confidence: 80,
        data: { campaign: campaign.name }
      }
    })

    return NextResponse.json({
      success: true,
      insightId: insight.id,
      recommendations: recommendationsText
    })
  } catch (error: any) {
    console.error('[v0] Recommendation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate recommendation' },
      { status: 500 }
    )
  }
}
