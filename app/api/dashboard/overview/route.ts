
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Mock data for demo user
const DEMO_KPI = [
    { label: "Total Revenue", value: "$412,850", change: "+12.5%", trend: "up", metric: "revenue" },
    { label: "Ad Spend", value: "$82,300", change: "+5.2%", trend: "up", metric: "spend" },
    { label: "Active Leads", value: "8,240", change: "+15.3%", trend: "up", metric: "leads" },
    { label: "Return on Ad Spend", value: "5.02x", change: "-2.1%", trend: "down", metric: "roas" },
]

const DEMO_CHART = [
    { name: "Mon", value: 4000 },
    { name: "Tue", value: 3000 },
    { name: "Wed", value: 5000 },
    { name: "Thu", value: 4500 },
    { name: "Fri", value: 6000 },
    { name: "Sat", value: 5500 },
    { name: "Sun", value: 7000 },
]

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Demo Account Logic
        if (session.user.email === "admin@growzzy.com") {
            return NextResponse.json({
                kpi: DEMO_KPI,
                chart: DEMO_CHART,
                isDemo: true
            })
        }

        // Real User Logic - Fetch from DB
        // For now, calculating sums from Analytics or Campaigns. 
        // Since we likely don't have real ingestion yet, we return Zeros or summed values from manual entries.

        // Example: Sum of estimatedValue from Leads
        const leadsCount = await prisma.lead.count({ where: { userId: session.user.id } })

        // Verify if platforms connected
        const platforms = await prisma.platform.count({ where: { userId: session.user.id } })

        if (platforms === 0) {
            // Absolutely fresh
            return NextResponse.json({
                kpi: [
                    { label: "Total Revenue", value: "$0.00", change: "0%", trend: "neutral", metric: "revenue" },
                    { label: "Ad Spend", value: "$0.00", change: "0%", trend: "neutral", metric: "spend" },
                    { label: "Active Leads", value: leadsCount.toString(), change: "0%", trend: "neutral", metric: "leads" },
                    { label: "Return on Ad Spend", value: "0.00x", change: "0%", trend: "neutral", metric: "roas" },
                ],
                chart: [],
                isDemo: false
            })
        }

        // If platforms connected but no real data (simulated state), usually we'd fetch from 3rd party.
        // Here we can return 0s or maybe "Simulated" data if we wanted to fake "sync"
        // The user requirement: "dummy data should not be thee". So we return 0s.

        return NextResponse.json({
            kpi: [
                { label: "Total Revenue", value: "$0.00", change: "0%", trend: "neutral", metric: "revenue" },
                { label: "Ad Spend", value: "$0.00", change: "0%", trend: "neutral", metric: "spend" },
                { label: "Active Leads", value: leadsCount.toString(), change: "0%", trend: "neutral", metric: "leads" },
                { label: "Return on Ad Spend", value: "0.00x", change: "0%", trend: "neutral", metric: "roas" },
            ],
            chart: Array(7).fill(0).map((_, i) => ({ name: `Day ${i + 1}`, value: 0 })),
            isDemo: false
        })

    } catch (error) {
        console.error("Dashboard overview error:", error)
        return NextResponse.json({ kpi: [], chart: [], error: "Failed to fetch data" }, { status: 500 })
    }
}
