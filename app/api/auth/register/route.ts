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
    const body = await req.json()
    const { email, password, name } = body

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields (email, password, name)" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Site URL for email verification redirect
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://v0-growzzyos.vercel.app"

    // Create user in Supabase Auth with email confirmation required
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Require email verification
      user_metadata: {
        full_name: name,
      },
      app_metadata: {
        provider: "email",
        providers: ["email"],
      },
    })

    if (authError) {
      console.error("[v0] Supabase auth error:", authError)
      
      // Handle specific error cases
      if (authError.message.includes("already registered") || authError.message.includes("already exists")) {
        return NextResponse.json(
          { error: "Email already registered. Please sign in instead." },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: authError.message || "Failed to create account" },
        { status: 500 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      )
    }

    // Send email verification
    const { error: emailError } = await supabaseAdmin.auth.resend({
      type: 'signup',
      email,
      options: {
        email_redirect_to: `${siteUrl}/auth/callback`,
      },
    })

    if (emailError) {
      console.error("[v0] Failed to send verification email:", emailError)
      // Don't fail the registration, just log the error
    }

    console.log("[v0] User registered successfully:", authData.user.id)

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully! Please check your email to verify your account before signing in.",
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json(
      { error: error.message || "Registration failed. Please try again." },
      { status: 500 }
    )
  }
}
