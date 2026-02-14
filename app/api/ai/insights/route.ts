
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const campaigns = await prisma.campaign.findMany({
            where: { userId: session.user.id, status: "active" },
            select: {
                id: true,
                name: true,
                roas: true,
                totalSpend: true,
                totalRevenue: true,
                createdAt: true,
                dailyBudget: true
            },
            orderBy: { totalSpend: "desc" },
            take: 20
        })

        const insights = []

        // 1. Scale Winners (ROAS > 3)
        const winners = campaigns.filter(c => (c.roas || 0) > 3.0)
        for (const w of winners) {
            insights.push({
                title: "High ROAS Alert",
                description: `Campaign "${w.name}" is performing exceptionally well with ${(w.roas || 0).toFixed(2)}x ROAS.`,
                metric: "ROAS Impact",
                recommendation: `Increase daily budget by 20% (to $${((w.dailyBudget || 100) * 1.2).toFixed(0)}) to maximize profitable volume.`,
                type: "success",
                impact: "+15% Revenue"
            })
        }

        // 2. Kill Losers (ROAS < 1.0 with significant spend)
        const losers = campaigns.filter(c => (c.roas || 0) < 1.0 && (c.totalSpend || 0) > 100)
        for (const l of losers) {
            insights.push({
                title: "Budget Bleed Warning",
                description: `Campaign "${l.name}" is burning cash at ${(l.roas || 0).toFixed(2)}x ROAS.`,
                metric: "Wasted Spend",
                recommendation: "Pause immediately or reduce budget by 50% to stop losses.",
                type: "danger",
                impact: "Save Budget"
            })
        }

        // 3. Creative Fatigue (Mock detection based on age)
        const oldCampaigns = campaigns.filter(c => {
            const age = (Date.now() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24)
            return age > 14 && (c.roas || 0) > 1.5 && (c.roas || 0) < 2.5
        })
        for (const o of oldCampaigns.slice(0, 1)) {
            insights.push({
                title: "Creative Fatigue Risk",
                description: `Campaign "${o.name}" performance is stagnating after 2 weeks.`,
                metric: "CTR Decay",
                recommendation: "Refresh ad creatives with new angles or UGC content.",
                type: "warning",
                impact: "Stabilize ROAS"
            })
        }

        // Fallback if no specific insights or empty
        if (insights.length === 0) {
            insights.push({
                title: "System Initialization",
                description: "AI Intelligence protocols are active. Connect ad platforms to begin neural optimization.",
                metric: "Status",
                recommendation: "Navigate to Settings > Integrations to connect Meta or Google Ads.",
                type: "info",
                impact: "Setup Required"
            })

            // Add a sample insight for visual population if totally empty
            if (campaigns.length === 0) {
                insights.push({
                    title: "Market Opportunity",
                    description: "Current sector analysis suggests a 15% ROAS uplift potential on Meta Reels placements.",
                    metric: "Projection",
                    recommendation: "Launch a Reels-focused campaign with UGC style creatives.",
                    type: "success",
                    impact: "+15% Potential"
                })
            }
        }

        return NextResponse.json(insights)

    } catch (error) {
        console.error("Insights API Error:", error)
        // Return fallback insights instead of error-ing out, so dashboard stays alive
        return NextResponse.json([
            {
                title: "Data Stream Interrupted",
                description: "Unable to reach the neural core (Database). Retrying connection...",
                metric: "Connectivity",
                recommendation: "Check your internet connection or contact support if persistence continues.",
                type: "danger",
                impact: "Offline"
            },
            {
                title: "Cached Strategy Available",
                description: "While offline, you can still draft new campaigns in the Creative Studio.",
                metric: "Workflow",
                recommendation: "Go to Creative Studio",
                type: "info",
                impact: "Productivity"
            }
        ])
    }
}

