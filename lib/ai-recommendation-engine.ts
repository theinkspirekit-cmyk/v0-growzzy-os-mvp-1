/**
 * AI Recommendation Engine
 * Generates real recommendations based on actual platform data and executes them
 * Updated to use Prisma instead of Supabase
 */

import { prisma } from '@/lib/prisma'
import { analyzeCampaign } from '@/lib/openai'

export interface AIRecommendation {
  id: string
  title: string
  description: string
  action: string
  impact: "high" | "medium" | "low"
  campaignId: string
  platform: string
  estimatedImprovement: string
}

export async function generateAIRecommendations(userId: string): Promise<AIRecommendation[]> {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        platformName: true,
        status: true,
        dailyBudget: true,
        totalSpend: true,
        totalRevenue: true,
        totalLeads: true,
        roas: true,
      },
    })

    if (campaigns.length === 0) return []

    const recommendations: AIRecommendation[] = []

    for (const campaign of campaigns) {
      const recommendation = await analyzeAndRecommend(campaign)
      if (recommendation) recommendations.push(recommendation)
    }

    return recommendations
  } catch (error) {
    console.error("[AI Recommendation Engine] Error:", error)
    return []
  }
}

async function analyzeAndRecommend(campaign: any): Promise<AIRecommendation | null> {
  try {
    const analysis = await analyzeCampaign(campaign)

    if (!analysis.success) return null

    const roas = campaign.roas || 0
    let action = 'optimize'
    let impact: 'high' | 'medium' | 'low' = 'medium'
    let title = `Optimize ${campaign.name}`
    let estimatedImprovement = '+5-10% performance'

    if (roas < 1) {
      action = 'pause'
      impact = 'high'
      title = `Consider pausing "${campaign.name}" — negative ROAS`
      estimatedImprovement = `Save $${campaign.totalSpend?.toFixed(0) || '0'}/month`
    } else if (roas > 4) {
      action = 'increase_budget'
      impact = 'high'
      title = `Scale "${campaign.name}" — ${roas}x ROAS`
      estimatedImprovement = '+25-40% revenue potential'
    } else if (roas < 2) {
      action = 'adjust_targeting'
      impact = 'medium'
      title = `Refine targeting for "${campaign.name}"`
      estimatedImprovement = '+15-25% efficiency'
    }

    return {
      id: `rec_${campaign.id}_${Date.now()}`,
      title,
      description: analysis.data?.recommendations || `Optimize ${campaign.name}`,
      action,
      impact,
      campaignId: campaign.id,
      platform: campaign.platformName || 'unknown',
      estimatedImprovement,
    }
  } catch (error) {
    console.error("[AI Recommendation] Analysis error:", error)
    return null
  }
}

export async function applyAIRecommendation(recommendationId: string, userId: string): Promise<boolean> {
  try {
    // Parse campaign ID from recommendation ID
    const parts = recommendationId.split('_')
    const campaignId = parts.length > 1 ? parts[1] : recommendationId

    const campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, userId },
    })

    if (!campaign) throw new Error("Campaign not found for recommendation")

    // Execute based on recommendation type
    if (recommendationId.includes('pause')) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'paused' },
      })
    } else if (recommendationId.includes('budget')) {
      const newBudget = (campaign.dailyBudget || 0) * 1.3
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { dailyBudget: Math.round(newBudget * 100) / 100 },
      })
    }

    return true
  } catch (error) {
    console.error("[AI Recommendation] Apply error:", error)
    throw error
  }
}
