
import { auth } from "@/lib/auth"
import { OptimizationEngine } from "@/lib/optimization-engine"
import { NextResponse } from "next/server"

export async function POST() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Run the Optimization Mission
        const results = await OptimizationEngine.runOptimizationMission(session.user.id)

        if (!results.success) {
            return NextResponse.json({ error: "Optimization Mission Failed" }, { status: 500 })
        }

        return NextResponse.json({
            missionId: `mission_${Date.now()}`,
            status: "COMPLETED",
            timestamp: new Date().toISOString(),
            reports: results.report,
            healthScore: results.report.reduce((acc, r) => acc + r.healthScore, 0) / (results.report.length || 1),
            insightsCount: results.report.reduce((acc, r) => acc + r.insights.length, 0)
        })

    } catch (error) {
        console.error("[Optimization Mission API] Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
