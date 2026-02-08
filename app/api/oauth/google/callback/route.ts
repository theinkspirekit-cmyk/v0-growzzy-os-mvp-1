import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { encrypt } from "@/lib/crypto"

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code")
    const state = request.nextUrl.searchParams.get("state")

    if (!code) {
      throw new Error("No authorization code")
    }

    const cookieStore = await cookies()
    const storedState = cookieStore.get("google_oauth_state")?.value

    if (state !== storedState) {
      throw new Error("Invalid state parameter")
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/google/callback`,
        grant_type: "authorization_code",
      }).toString(),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      throw new Error("Failed to get access token")
    }

    // Get user info
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + tokenData.access_token,
    )
    const userData = await userResponse.json()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
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
      throw new Error("Unauthorized")
    }

    await supabase.from("platform_connections").insert({
      user_id: user.id,
      platform: "google",
      account_id: userData.id,
      account_name: userData.name,
      access_token: encrypt(tokenData.access_token),
      refresh_token: tokenData.refresh_token ? encrypt(tokenData.refresh_token) : null,
      expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      is_active: true,
    })

    cookieStore.delete("google_oauth_state")

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?tab=integrations&success=google_connected`,
    )
  } catch (error: any) {
    console.error("[v0] Google OAuth error:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?tab=integrations&error=${error.message}`,
    )
  }
}
