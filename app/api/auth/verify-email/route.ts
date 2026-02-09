import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = 'force-dynamic'

// Create Supabase admin client for server-side operations
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase configuration missing: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required')
  }

  return createClient(supabaseUrl, serviceRoleKey)
}

export async function POST(req: Request) {
  try {
    const { code } = await req.json()

    if (!code) {
      return NextResponse.json(
        { error: "Verification code is required" },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Exchange the code for a session
    const { data, error } = await supabaseAdmin.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("[v0] Email verification error:", error)
      return NextResponse.json(
        { error: error.message || "Invalid or expired verification code" },
        { status: 400 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "Failed to verify email" },
        { status: 500 }
      )
    }

    console.log("[v0] Email verified for user:", data.user.id)

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    })
  } catch (error: any) {
    console.error("[v0] Verification error:", error)
    return NextResponse.json(
      { error: error.message || "Verification failed" },
      { status: 500 }
    )
  }
}
