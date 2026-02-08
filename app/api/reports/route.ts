import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const runtime = "nodejs"

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const query = supabase.from("reports").select("*").eq("user_id", user.id).order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error("[v0] Database error fetching reports:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ reports: data || [] })
  } catch (error: any) {
    console.error("[v0] Reports GET error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  try {
    const { type, dateRange, platforms } = await request.json()

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!type || !dateRange) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: campaigns, error: campaignsError } = await supabase
      .from("campaigns")
      .select("*")
      .eq("user_id", user.id)

    if (campaignsError) {
      console.error("[v0] Error fetching campaigns:", campaignsError)
      return NextResponse.json(
        {
          error: "No campaigns connected. Please connect platforms to generate reports.",
        },
        { status: 200 },
      )
    }

    const campaignData = campaigns || []

    if (campaignData.length === 0) {
      return NextResponse.json(
        {
          error: "No campaign data available. Connect platforms and run campaigns to generate reports.",
        },
        { status: 200 },
      )
    }

    const totalSpend = campaignData.reduce((sum: number, c: any) => sum + (Number(c.spend) || Number(c.budget) || 0), 0)
    const totalRevenue = campaignData.reduce((sum: number, c: any) => sum + (Number(c.revenue) || 0), 0)
    const totalConversions = campaignData.reduce((sum: number, c: any) => sum + (c.conversions || 0), 0)
    const blendedRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0
    const avgCTR = campaignData.reduce((sum: number, c: any) => sum + (Number(c.ctr) || 0), 0) / campaignData.length
    const avgCPC = campaignData.reduce((sum: number, c: any) => sum + (Number(c.cpc) || 0), 0) / campaignData.length

    const topCampaign =
      campaignData.reduce(
        (top: any, c: any) => ((Number(c.revenue) || 0) > (Number(top.revenue) || 0) ? c : top),
        campaignData[0],
      )?.name || "N/A"

    const platformCounts = campaignData.reduce(
      (acc: any, c: any) => {
        acc[c.platform] = (acc[c.platform] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topPlatform = Object.entries(platformCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"

    const metrics = {
      totalSpend: Number(totalSpend.toFixed(2)),
      totalRevenue: Number(totalRevenue.toFixed(2)),
      blendedRoas: Number(blendedRoas.toFixed(2)),
      totalConversions,
      avgCTR: Number(avgCTR.toFixed(2)),
      avgCPC: Number(avgCPC.toFixed(2)),
      topCampaign,
      topPlatform,
    }

    const reportData = {
      user_id: user.id,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${new Date().toLocaleDateString()}`,
      type,
      status: "completed",
      metrics: JSON.stringify(metrics),
      period_start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      period_end: new Date().toISOString().split("T")[0],
    }

    const { data, error: insertError } = await supabase.from("reports").insert(reportData).select().single()

    if (insertError) {
      console.error("[v0] Failed to insert report:", insertError)
      return NextResponse.json(
        {
          error: "Failed to generate report. Please try again.",
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        ...data,
        generatedAt: data.created_at,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Reports POST error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate report. Please ensure you have connected platforms.",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing report ID" }, { status: 400 })
    }

    const { data: existingReport, error: fetchError } = await supabase
      .from("reports")
      .select("user_id")
      .eq("id", id)
      .single()

    if (fetchError || !existingReport) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    if (existingReport.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { error } = await supabase.from("reports").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Reports DELETE error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
