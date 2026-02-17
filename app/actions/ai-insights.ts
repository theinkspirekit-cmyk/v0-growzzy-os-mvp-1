"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AIAnalysis } from "@/lib/ai"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export async function generateCampaignInsights(campaignId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    // Fetch campaign
    const campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, userId: session.user.id }
    })

    if (!campaign) {
      return { error: "Campaign not found" }
    }

    // Fetch recent metrics
    const metrics = await prisma.performanceMetric.findMany({
      where: {
        userId: session.user.id,
        entityId: campaignId,
        entityType: "campaign"
      },
      orderBy: { periodDate: "desc" },
      take: 30
    })

    // Calculate aggregates
    const totalSpend = metrics
      .filter(m => m.metricName === "spend")
      .reduce((sum, m) => sum + m.metricValue, 0)
    const totalRevenue = metrics
      .filter(m => m.metricName === "revenue")
      .reduce((sum, m) => sum + m.metricValue, 0)
    const totalClicks = metrics
      .filter(m => m.metricName === "clicks")
      .reduce((sum, m) => sum + m.metricValue, 0)
    const totalImpressions = metrics
      .filter(m => m.metricName === "impressions")
      .reduce((sum, m) => sum + m.metricValue, 0)
    const totalConversions = metrics
      .filter(m => m.metricName === "conversions")
      .reduce((sum, m) => sum + m.metricValue, 0)

    // Calculate metrics
    const cpc = totalClicks > 0 ? totalSpend / totalClicks : 0
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
    const cpa = totalConversions > 0 ? totalSpend / totalConversions : 0
    const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0

    const campaignData = {
      name: campaign.name,
      spend: totalSpend,
      revenue: totalRevenue,
      clicks: totalClicks,
      impressions: totalImpressions,
      conversions: totalConversions,
      cpc,
      ctr,
      roas,
      cpa
    }

    // Generate insights using AI
    const insightText = await AIAnalysis.analyzeCampaign(campaignData)

    // Parse AI response
    let insights = []
    try {
      const parsed = JSON.parse(insightText || "[]")
      insights = Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      insights = [{ insight: insightText, severity: "medium" }]
    }

    // Save insights to database
    for (const insight of insights) {
      await prisma.aIInsight.create({
        data: {
          userId: session.user.id,
          entityType: "campaign",
          entityId: campaignId,
          insightType: insight.severity === "high" ? "risk" : "opportunity",
          title: insight.insight || "Campaign Performance Insight",
          description: insight.insight || "",
          recommendation: insight.recommendation || insight.actionable_recommendation,
          confidence: 75,
          data: {
            metrics: campaignData,
            fullInsight: insight
          }
        }
      })
    }

    revalidatePath(`/dashboard/analytics`)
    return { success: true, insights, metrics: campaignData }
  } catch (error: any) {
    console.error("Generate insights error:", error)
    return { error: error.message || "Failed to generate insights" }
  }
}

export async function scoreLeadsBatch(leads: Array<{
  id: string
  name: string
  email: string
  company?: string
  source: string
}>) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    // Generate scores using AI
    const scoreText = await AIAnalysis.scoreLeads(leads)

    // Parse AI response
    let scores = []
    try {
      const parsed = JSON.parse(scoreText || "[]")
      scores = Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      scores = leads.map(l => ({ email: l.email, score: 50, reason: "Scoring failed" }))
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
              aiScore: Math.min(100, Math.max(0, score.score))
            }
          })
        )
      }
    }

    await Promise.all(updates)

    revalidatePath("/dashboard/leads")
    return { success: true, scores }
  } catch (error: any) {
    console.error("Score leads error:", error)
    return { error: error.message || "Failed to score leads" }
  }
}

export async function generateCreativeVariations(
  brief: string,
  type: "headline" | "ad_copy" | "cta",
  campaignId: string
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    // Verify campaign ownership
    const campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, userId: session.user.id }
    })

    if (!campaign) {
      return { error: "Campaign not found" }
    }

    // Generate variations
    const variationText = await AIAnalysis.generateCreativeVariations(brief, type)

    // Parse AI response
    let variations = []
    try {
      const parsed = JSON.parse(variationText || "[]")
      variations = Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      variations = [brief]
    }

    // Save to content library
    const libraryEntry = await prisma.contentLibrary.create({
      data: {
        userId: session.user.id,
        name: `${type} - ${brief.substring(0, 30)}`,
        category: type,
        contentType: "generated",
        content: variations.join("\n---\n"),
        tags: [campaign.name, type, "generated"],
        context: {
          campaignId,
          brief,
          type,
          timestamp: new Date().toISOString()
        }
      }
    })

    revalidatePath("/dashboard/creatives")
    return { success: true, variations, libraryId: libraryEntry.id }
  } catch (error: any) {
    console.error("Generate creative error:", error)
    return { error: error.message || "Failed to generate creative" }
  }
}

export async function getRecommendations(campaignId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    // Fetch campaign and metrics
    const campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, userId: session.user.id }
    })

    if (!campaign) {
      return { error: "Campaign not found" }
    }

    const metrics = await prisma.performanceMetric.findMany({
      where: {
        userId: session.user.id,
        entityId: campaignId
      },
      take: 30
    })

    const aggregatedData = {
      campaign: campaign.name,
      platform: campaign.platform,
      status: campaign.status,
      budget: campaign.budget,
      metrics: metrics.map(m => ({
        name: m.metricName,
        value: m.metricValue,
        date: m.periodDate
      }))
    }

    // Generate recommendations using Claude
    const recommendations = await AIAnalysis.generateRecommendations(aggregatedData)

    return { success: true, recommendations }
  } catch (error: any) {
    console.error("Get recommendations error:", error)
    return { error: error.message || "Failed to get recommendations" }
  }
}

export async function dismissInsight(insightId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    await prisma.aIInsight.update({
      where: { id: insightId },
      data: { dismissedAt: new Date() }
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Dismiss insight error:", error)
    return { error: error.message || "Failed to dismiss insight" }
  }
}

export async function getUnreadInsights() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { error: "Unauthorized" }
    }

    const insights = await prisma.aIInsight.findMany({
      where: {
        userId: session.user.id,
        readAt: null,
        dismissedAt: null
      },
      orderBy: { createdAt: "desc" },
      take: 10
    })

    return { insights }
  } catch (error: any) {
    console.error("Get unread insights error:", error)
    return { error: error.message || "Failed to fetch insights" }
  }
}
