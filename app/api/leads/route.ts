export const dynamic = 'force-dynamic'
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

  try {
    let query = supabase.from("leads").select("*").order("created_at", { ascending: false })

    if (user) {
      query = query.eq("user_id", user.id)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Database error fetching leads:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (err: any) {
    console.error("[v0] Leads GET error:", err)
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
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
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { name, email, phone = "", company = "", value = 0, source = "Manual", status = "new" } = body

    if (!name || !email) {
      return NextResponse.json({ error: "Name & email required" }, { status: 400 })
    }

    let parsedValue = Number.parseFloat(value)
    if (isNaN(parsedValue)) {
      parsedValue = 0
    }
    parsedValue = Math.min(Math.max(parsedValue, 0), 99999999.99)
    parsedValue = Math.round(parsedValue * 100) / 100

    const { data, error } = await supabase
      .from("leads")
      .insert({
        user_id: user?.id || null, // Include user_id from authenticated user
        name,
        email,
        phone,
        company,
        value: parsedValue,
        source,
        status,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error inserting lead:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    console.error("[v0] Leads POST error:", err)
    return NextResponse.json({ error: err.message || "Failed to create lead" }, { status: 500 })
  }
}

