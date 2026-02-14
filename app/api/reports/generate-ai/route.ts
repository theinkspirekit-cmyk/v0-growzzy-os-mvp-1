export const dynamic = 'force-dynamic'
import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      (process.env.NEXT_PUBLIC_SUPABASE_URL || ''),
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''),
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { period = "weekly" } = await request.json()

    // Fetch campaign data
    const { data: campaigns } = await supabase.from("campaigns").select("*").eq("user_id", user.id)

    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json({
        error: "No campaign data available",
      })
    }

    // Calculate metrics
    const totalSpend = campaigns.reduce((sum: number, c: any) => sum + (Number(c.spend) || 0), 0)
    const totalRevenue = campaigns.reduce((sum: number, c: any) => sum + (Number(c.revenue) || 0), 0)
    const totalImpressions = campaigns.reduce((sum: number, c: any) => sum + (c.impressions || 0), 0)
    const totalClicks = campaigns.reduce((sum: number, c: any) => sum + (c.clicks || 0), 0)
    const totalConversions = campaigns.reduce((sum: number, c: any) => sum + (c.conversions || 0), 0)

    const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
    const cpc = totalClicks > 0 ? totalSpend / totalClicks : 0

    // Use AI to generate insights
    const { text: insights } = await generateText({
      model: "openai/gpt-4-mini",
      prompt: `Analyze these marketing campaign metrics and provide 3-5 key insights:
      - Total Spend: $${totalSpend.toFixed(2)}
      - Total Revenue: $${totalRevenue.toFixed(2)}
      - ROAS: ${roas.toFixed(2)}
      - Total Impressions: ${totalImpressions}
      - Total Clicks: ${totalClicks}
      - CTR: ${ctr.toFixed(2)}%
      - CPC: $${cpc.toFixed(2)}
      - Total Conversions: ${totalConversions}
      
      Campaigns: ${campaigns.map((c: any) => `${c.name} (${c.platform}): $${c.spend} spent, ${c.revenue} revenue`).join("; ")}
      
      Provide actionable insights to improve performance.`,
    })

    const { text: recommendations } = await generateText({
      model: "openai/gpt-4-mini",
      prompt: `Based on these metrics, provide 3-5 specific recommendations to improve ROI:
      - ROAS: ${roas.toFixed(2)}
      - CTR: ${ctr.toFixed(2)}%
      - CPC: $${cpc.toFixed(2)}
      
      Focus on practical, immediately actionable recommendations.`,
    })

    // Save report
    const reportData = {
      user_id: user.id,
      title: `${period.charAt(0).toUpperCase() + period.slice(1)} Performance Report - ${new Date().toLocaleDateString()}`,
      type: "performance",
      status: "completed",
      metrics: JSON.stringify({
        totalSpend: Number(totalSpend.toFixed(2)),
        totalRevenue: Number(totalRevenue.toFixed(2)),
        roas: Number(roas.toFixed(2)),
        totalImpressions,
        totalClicks,
        ctr: Number(ctr.toFixed(2)),
        cpc: Number(cpc.toFixed(2)),
        totalConversions,
      }),
      insights: insights,
      recommendations: recommendations,
      period_start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      period_end: new Date().toISOString().split("T")[0],
      generated_at: new Date().toISOString(),
    }

    const { data: report, error } = await supabase.from("reports").insert(reportData).select().single()

    if (error) throw error

    return NextResponse.json(report, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Report generation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

