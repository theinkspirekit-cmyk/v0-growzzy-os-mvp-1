"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Types
export type RevenueTrend = { date: string; revenue: number; spend: number }
export type ChannelBreakdown = { channel: string; roas: number; spend: number; conversions: number }

// Generate Mock Data for Analytics
const generateMockTrend = (days = 30): RevenueTrend[] => {
    const data: RevenueTrend[] = []
    const now = new Date()
    for (let i = days; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        const spend = Math.floor(Math.random() * (5000 - 1000) + 1000)
        const revenue = Math.floor(spend * (Math.random() * (4.5 - 2.1) + 2.1))
        data.push({ date: dateStr, revenue, spend })
    }
    return data
}

const MOCK_CHANNELS: ChannelBreakdown[] = [
    { channel: "Meta Ads", roas: 3.8, spend: 12450, conversions: 342 },
    { channel: "Google Search", roas: 4.2, spend: 18200, conversions: 512 },
    { channel: "TikTok", roas: 2.1, spend: 5600, conversions: 128 },
    { channel: "LinkedIn", roas: 3.1, spend: 3200, conversions: 45 },
    { channel: "Email", roas: 12.5, spend: 450, conversions: 89 },
]

export async function getAnalyticsOverview() {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    try {
        // Fetch real performance metrics from database
        const metrics = await prisma.performanceMetric.findMany({
            where: { userId: session.user.id },
            take: 100,
            orderBy: { periodDate: "desc" }
        })

        // Get campaigns for context
        const campaigns = await prisma.campaign.findMany({
            where: { userId: session.user.id, status: "active" },
            take: 10
        })

        // Simulating aggregation delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // If we have real data, aggregate it; otherwise use mock
        if (metrics.length > 0) {
            const revenueTotal = metrics
                .filter(m => m.metricName === "revenue")
                .reduce((sum, m) => sum + m.metricValue, 0)
            const spendTotal = metrics
                .filter(m => m.metricName === "spend")
                .reduce((sum, m) => sum + m.metricValue, 0)

            return {
                trend: generateMockTrend(),
                channels: MOCK_CHANNELS,
                campaigns: campaigns.map(c => ({
                    id: c.id,
                    name: c.name,
                    status: c.status,
                    spend: c.budget,
                    revenue: c.expectedRevenue || 0
                })),
                kpi: {
                    revenue: { value: revenueTotal, change: 12.5 },
                    spend: { value: spendTotal, change: 8.2 },
                    roas: { value: revenueTotal / spendTotal || 0, change: 4.1 },
                    conversionRate: { value: 3.2, change: -0.5 },
                    cpa: { value: spendTotal > 0 ? spendTotal / 100 : 0, change: -1.2 }
                }
            }
        }

        return {
            trend: generateMockTrend(),
            channels: MOCK_CHANNELS,
            kpi: {
                revenue: { value: 245890, change: 12.5 },
                spend: { value: 65400, change: 8.2 },
                roas: { value: 3.76, change: 4.1 },
                conversionRate: { value: 3.2, change: -0.5 },
                cpa: { value: 42.15, change: -1.2 }
            }
        }
    } catch (error) {
        console.error("Analytics overview error:", error)
        return { error: "Failed to fetch analytics" }
    }
}

// Fetch analytics for a specific time period and filters
export async function getFilteredAnalytics(filters: {
    dateRange?: { from: Date; to: Date }
    platforms?: string[]
    campaigns?: string[]
    metrics?: string[]
}) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    try {
        const where: any = { userId: session.user.id }

        if (filters.dateRange) {
            where.periodDate = {
                gte: filters.dateRange.from,
                lte: filters.dateRange.to
            }
        }

        if (filters.metrics && filters.metrics.length > 0) {
            where.metricName = { in: filters.metrics }
        }

        const metrics = await prisma.performanceMetric.findMany({
            where,
            orderBy: { periodDate: "desc" },
            take: 500
        })

        return { metrics }
    } catch (error) {
        console.error("Filtered analytics error:", error)
        return { error: "Failed to fetch filtered analytics" }
    }
}

// Get campaign-specific analytics
export async function getCampaignAnalytics(campaignId: string) {
    const session = await auth()
    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    try {
        const campaign = await prisma.campaign.findFirst({
            where: { id: campaignId, userId: session.user.id }
        })

        if (!campaign) {
            return { error: "Campaign not found" }
        }

        const metrics = await prisma.performanceMetric.findMany({
            where: {
                userId: session.user.id,
                entityType: "campaign",
                entityId: campaignId
            },
            orderBy: { periodDate: "asc" },
            take: 90
        })

        return { campaign, metrics }
    } catch (error) {
        console.error("Campaign analytics error:", error)
        return { error: "Failed to fetch campaign analytics" }
    }
}
