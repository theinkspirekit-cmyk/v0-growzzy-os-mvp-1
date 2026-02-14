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
    // In production, aggregate real data from DB
    // const realData = await prisma.analytics.findMany(...)

    // Simulating aggregation delay
    await new Promise(resolve => setTimeout(resolve, 800))

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
}
