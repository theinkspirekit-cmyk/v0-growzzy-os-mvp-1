
import { prisma } from "@/lib/prisma"
import { analyzeCampaign } from "@/lib/openai"

// Types for the Optimization Engine
export interface OptimizationMetric {
    current: number
    previous: number
    delta: number // percentage
    trend: "up" | "down" | "flat"
}

export interface OptimizationInsight {
    id: string
    title: string
    description: string
    metric: string
    impact: "high" | "medium" | "low"
    type: "success" | "warning" | "danger" | "info"
    recommendation: string
    actionType?: "pause" | "scale" | "adjust_bid" | "creative_refresh"
    confidence: number // 0-100
}

export interface OptimizationReport {
    campaignId: string
    campaignName: string
    metrics: {
        roas7d: OptimizationMetric
        roas30d: OptimizationMetric
        ctr: OptimizationMetric
        cpc: OptimizationMetric
    }
    insights: OptimizationInsight[]
    healthScore: number // 0-100
}

/**
 * THE OPTIMIZATION ENGINE (CORE BRAIN)
 * Calculates trends, detects anomalies, and generates actionable insights.
 */
export class OptimizationEngine {

    /**
     * Run full optimization analysis for a specific user
     */
    static async runOptimizationMission(userId: string): Promise<{ success: boolean, report: OptimizationReport[] }> {
        try {
            // 1. Fetch active campaigns
            const campaigns = await prisma.campaign.findMany({
                where: { userId, status: "active" },
                include: {
                    analytics: {
                        orderBy: { metricDate: 'desc' },
                        take: 30 // Last 30 days of data
                    }
                }
            })

            if (campaigns.length === 0) return { success: true, report: [] }

            const reports: OptimizationReport[] = []

            // 2. Analyze each campaign
            for (const campaign of campaigns) {
                const report = await this.analyzeCampaign(campaign)
                reports.push(report)
            }

            return { success: true, report: reports }

        } catch (error) {
            console.error("[Optimization Engine] Mission Failed:", error)
            return { success: false, report: [] }
        }
    }

    /**
     * Analyze a single campaign's performance
     */
    private static async analyzeCampaign(campaign: any): Promise<OptimizationReport> {
        const analytics = campaign.analytics || []

        // 1. Calculate Metrics (7d vs 30d)
        const last7Days = analytics.slice(0, 7)
        const last30Days = analytics

        // Helper to sum metrics
        const sum = (data: any[], key: string) => data.reduce((acc, curr) => acc + (curr[key] || 0), 0)
        const avg = (data: any[], key: string) => data.length ? sum(data, key) / data.length : 0

        // ROAS
        const roas7d = avg(last7Days, 'roas')
        const roas30d = avg(last30Days, 'roas')
        const roasDelta = this.calculateDelta(roas7d, roas30d)

        // CTR
        const ctr7d = avg(last7Days, 'ctr')
        const ctr30d = avg(last30Days, 'ctr')
        const ctrDelta = this.calculateDelta(ctr7d, ctr30d)

        // CPC
        const cpc7d = avg(last7Days, 'cpc')
        const cpc30d = avg(last30Days, 'cpc')
        const cpcDelta = this.calculateDelta(cpc7d, cpc30d)

        // 2. Generate Insights
        const insights: OptimizationInsight[] = []
        let healthScore = 70 // Base score

        // Rule 1: ROAS Decay (Trend Detection)
        if (roasDelta.delta < -15) {
            insights.push({
                id: `roas_decay_${campaign.id}`,
                title: "ROAS Velocity Drop",
                description: `ROAS has dropped by ${Math.abs(roasDelta.delta).toFixed(1)}% over the last 7 days compared to 30-day average.`,
                metric: "ROAS",
                impact: "high",
                type: "danger",
                recommendation: "Review search terms or creative fatigue immediately.",
                actionType: "pause",
                confidence: 90
            })
            healthScore -= 20
        }

        // Rule 2: High Performer (Scale Opportunity)
        if (roas7d > 3.0 && roasDelta.trend === 'up') {
            insights.push({
                id: `scale_opp_${campaign.id}`,
                title: "Scale Opportunity Detected",
                description: `Campaign is performing at ${roas7d.toFixed(2)}x ROAS with upward velocity.`,
                metric: "Revenue",
                impact: "high",
                type: "success",
                recommendation: "Increase daily budget by 20% to capture available impression share.",
                actionType: "scale",
                confidence: 85
            })
            healthScore += 15
        }

        // Rule 3: Creative Fatigue (CTR Drop)
        if (ctrDelta.delta < -20) {
            insights.push({
                id: `fatigue_${campaign.id}`,
                title: "Creative Fatigue Warning",
                description: `CTR has decreased by ${Math.abs(ctrDelta.delta).toFixed(1)}%, indicating ad blindness.`,
                metric: "CTR",
                impact: "medium",
                type: "warning",
                recommendation: "Refresh ad creatives with new visual angles.",
                actionType: "creative_refresh",
                confidence: 80
            })
            healthScore -= 10
        }

        // Rule 4: CPC Inflation (Cost Efficiency)
        if (cpcDelta.delta > 25) {
            insights.push({
                id: `cpc_inflation_${campaign.id}`,
                title: "CPC Inflation Alert",
                description: `Cost per click has risen by ${cpcDelta.delta.toFixed(1)}%. Competition may be increasing.`,
                metric: "CPC",
                impact: "medium",
                type: "warning",
                recommendation: "Refine audience targeting or exclude expensive placements.",
                actionType: "adjust_bid",
                confidence: 75
            })
            healthScore -= 10
        }

        // 3. Construct Report
        return {
            campaignId: campaign.id,
            campaignName: campaign.name,
            metrics: {
                roas7d: roasDelta,
                roas30d: { current: roas30d, previous: 0, delta: 0, trend: 'flat' },
                ctr: ctrDelta,
                cpc: cpcDelta
            },
            insights,
            healthScore: Math.max(0, Math.min(100, healthScore))
        }
    }

    private static calculateDelta(current: number, previous: number): OptimizationMetric {
        if (!previous) return { current, previous: 0, delta: 0, trend: 'flat' }
        const delta = ((current - previous) / previous) * 100
        return {
            current,
            previous,
            delta,
            trend: delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat'
        }
    }
}
