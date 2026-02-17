
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { period = "weekly" } = await request.json()

    // Fetch campaigns via Prisma
    const campaigns = await prisma.campaign.findMany({
      where: { userId: session.user.id }
    })

    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json({
        error: "No campaign data available",
      })
    }

    // Fetch aggregated metrics from AnalyticsEvent
    const metricsAgg = await prisma.analyticsEvent.aggregate({
      where: { userId: session.user.id },
      _sum: {
        spend: true,
        revenue: true,
        impressions: true,
        clicks: true,
        conversions: true
      }
    })

    // Calculate metrics
    const totalSpend = metricsAgg._sum.spend || 0
    const totalRevenue = metricsAgg._sum.revenue || 0
    const totalImpressions = metricsAgg._sum.impressions || 0
    const totalClicks = metricsAgg._sum.clicks || 0
    const totalConversions = metricsAgg._sum.conversions || 0

    const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
    const cpc = totalClicks > 0 ? totalSpend / totalClicks : 0

    // Use OpenAI to generate insights
    const insightsResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a senior marketing performance analyst."
        },
        {
          role: "user",
          content: `Analyze these marketing campaign metrics and provide 3-5 key insights:
          - Total Spend: $${totalSpend.toFixed(2)}
          - Total Revenue: $${totalRevenue.toFixed(2)}
          - ROAS: ${roas.toFixed(2)}
          - Total Impressions: ${totalImpressions}
          - Total Clicks: ${totalClicks}
          - CTR: ${ctr.toFixed(2)}%
          - CPC: $${cpc.toFixed(2)}
          - Total Conversions: ${totalConversions}
          
          Campaigns Overview: ${campaigns.map(c => `${c.name}: $${c.totalSpend} spent, ${c.totalRevenue} revenue`).join("; ")}`
        }
      ]
    })

    const insights = insightsResponse.choices[0]?.message?.content || "No insights generated."

    const recommendationsResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a senior marketing strategist."
        },
        {
          role: "user",
          content: `Based on these metrics, provide 3-5 specific recommendations to improve ROI:
          - ROAS: ${roas.toFixed(2)}
          - CTR: ${ctr.toFixed(2)}%
          - CPC: $${cpc.toFixed(2)}`
        }
      ]
    })

    const recommendations = recommendationsResponse.choices[0]?.message?.content || "No recommendations generated."

    // Save report via Prisma
    const report = await prisma.report.create({
      data: {
        userId: session.user.id,
        name: `${period.charAt(0).toUpperCase() + period.slice(1)} Performance Report - ${new Date().toLocaleDateString()}`,
        type: "performance",
        status: "completed",
        metrics: {
          totalSpend: Number(totalSpend.toFixed(2)),
          totalRevenue: Number(totalRevenue.toFixed(2)),
          roas: Number(roas.toFixed(2)),
          totalImpressions,
          totalClicks,
          ctr: Number(ctr.toFixed(2)),
          cpc: Number(cpc.toFixed(2)),
          totalConversions,
        } as any,
        insights: [insights] as any,
        recommendations: [recommendations] as any,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      },
    })

    return NextResponse.json(report, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Report generation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
