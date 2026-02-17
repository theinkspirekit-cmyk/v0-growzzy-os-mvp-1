
export const dynamic = 'force-dynamic'

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AIAnalysis } from "@/lib/ai"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Fetch unread insights from database
        const dbInsights = await prisma.aIInsight.findMany({
            where: {
                userId: session.user.id,
                readAt: null,
                dismissedAt: null
            },
            orderBy: { createdAt: "desc" },
            take: 10
        })

        // Format insights for response
        const formattedInsights = dbInsights.map(insight => ({
            id: insight.id,
            title: insight.title,
            description: insight.description,
            type: insight.insightType === "risk" ? "warning" : insight.insightType === "opportunity" ? "success" : "info",
            metric: insight.entityType,
            recommendation: insight.recommendation,
            confidence: insight.confidence,
            impact: insight.confidence && insight.confidence > 80 ? "+25% Impact" : "+10% Impact",
            entityType: insight.entityType,
            entityId: insight.entityId,
            createdAt: insight.createdAt
        }))

        // If no insights in DB, fetch active campaigns and generate insights
        if (formattedInsights.length === 0) {
            const campaigns = await prisma.campaign.findMany({
                where: { userId: session.user.id, status: "active" },
                take: 5
            })

            if (campaigns.length === 0) {
                return NextResponse.json([
                    {
                        title: "System Ready",
                        description: "AI Intelligence protocols are active. Create your first campaign to begin insights generation.",
                        metric: "Status",
                        recommendation: "Navigate to Campaigns to create a new campaign.",
                        type: "info",
                        impact: "Setup Required"
                    }
                ])
            }

            // Generate insights for each campaign
            const newInsights = []
            for (const campaign of campaigns) {
                try {
                    // Fetch campaign metrics
                    const metrics = await prisma.performanceMetric.findMany({
                        where: {
                            userId: session.user.id,
                            entityId: campaign.id,
                            entityType: "campaign"
                        },
                        take: 30,
                        orderBy: { periodDate: "desc" }
                    })

                    if (metrics.length > 0) {
                        const totalSpend = metrics.filter(m => m.metricName === "spend").reduce((sum, m) => sum + m.metricValue, 0)
                        const totalRevenue = metrics.filter(m => m.metricName === "revenue").reduce((sum, m) => sum + m.metricValue, 0)
                        const totalClicks = metrics.filter(m => m.metricName === "clicks").reduce((sum, m) => sum + m.metricValue, 0)
                        const totalImpressions = metrics.filter(m => m.metricName === "impressions").reduce((sum, m) => sum + m.metricValue, 0)
                        const totalConversions = metrics.filter(m => m.metricName === "conversions").reduce((sum, m) => sum + m.metricValue, 0)

                        const campaignData = {
                            name: campaign.name,
                            spend: totalSpend,
                            revenue: totalRevenue,
                            clicks: totalClicks,
                            impressions: totalImpressions,
                            conversions: totalConversions,
                            cpc: totalClicks > 0 ? totalSpend / totalClicks : 0,
                            ctr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
                            roas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
                            cpa: totalConversions > 0 ? totalSpend / totalConversions : 0
                        }

                        const insightText = await AIAnalysis.analyzeCampaign(campaignData)
                        newInsights.push({
                            title: `${campaign.name} Performance Analysis`,
                            description: insightText || "Campaign analysis generated",
                            type: "info",
                            metric: campaign.name,
                            recommendation: "Review recommendations to optimize performance",
                            impact: "+15% Impact"
                        })
                    }
                } catch (err) {
                    console.warn(`Failed to generate insight for campaign ${campaign.id}:`, err)
                }
            }

            return NextResponse.json(newInsights.length > 0 ? newInsights : formattedInsights)
        }

        return NextResponse.json(formattedInsights)

    } catch (error) {
        console.error("Insights API Error:", error)
        return NextResponse.json([
            {
                title: "Data Stream Interrupted",
                description: "Unable to process insights. Please try again.",
                metric: "Connectivity",
                recommendation: "Check your connection or contact support.",
                type: "danger",
                impact: "Offline"
            }
        ], { status: 500 })
    }
}

// Mark insight as read
export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { insightId, action } = await req.json()

        if (action === "read") {
            await prisma.aIInsight.update({
                where: { id: insightId },
                data: { readAt: new Date() }
            })
        } else if (action === "dismiss") {
            await prisma.aIInsight.update({
                where: { id: insightId },
                data: { dismissedAt: new Date() }
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Insight action error:", error)
        return NextResponse.json({ error: "Failed to process action" }, { status: 500 })
    }
}
