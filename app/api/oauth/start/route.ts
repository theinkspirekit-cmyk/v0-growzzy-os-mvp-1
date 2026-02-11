export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const { platform } = await req.json()

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options) {
          cookieStore.set(name, value, options)
        },
        remove(name: string, options) {
          cookieStore.delete(name)
        },
      },
    },
  )

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // Generate session ID for tracking OAuth flow
  const sessionId = Math.random().toString(36).substring(7)

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "https://v0-growzzyos.vercel.app/"}/api/oauth/callback`

  let authUrl: string

  switch (platform) {
    case "meta":
      authUrl = new URL("https://www.facebook.com/v18.0/dialog/oauth")
      authUrl.searchParams.append("client_id", process.env.META_APP_ID || "")
      authUrl.searchParams.append("redirect_uri", redirectUri)
      authUrl.searchParams.append("scope", "ads_management,ads_read,pages_read_engagement")
      authUrl.searchParams.append("state", sessionId)
      authUrl.searchParams.append("response_type", "code")
      break

    case "google":
      authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
      authUrl.searchParams.append("client_id", process.env.GOOGLE_CLIENT_ID || "")
      authUrl.searchParams.append("redirect_uri", redirectUri)
      authUrl.searchParams.append(
        "scope",
        "https://www.googleapis.com/auth/adwords https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      )
      authUrl.searchParams.append("state", sessionId)
      authUrl.searchParams.append("response_type", "code")
      authUrl.searchParams.append("access_type", "offline")
      authUrl.searchParams.append("prompt", "consent")
      break

    case "linkedin":
      authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization")
      authUrl.searchParams.append("response_type", "code")
      authUrl.searchParams.append("client_id", process.env.LINKEDIN_CLIENT_ID || "")
      authUrl.searchParams.append("redirect_uri", redirectUri)
      authUrl.searchParams.append("state", sessionId)
      authUrl.searchParams.append("scope", "r_liteprofile,r_emailaddress,r_basicprofile")
      break

    case "shopify":
      // For Shopify, the shop domain will be provided by the client
      authUrl = new URL("https://shopify.com/") // Will be handled in callback
      break

    default:
      return NextResponse.json({ error: "Unsupported platform" }, { status: 400 })
  }

  try {
    await supabase.from("oauth_sessions").insert({
      session_id: sessionId,
      platform,
      user_id: user.id,
      status: "pending",
      created_at: new Date(),
    })
  } catch (err) {
    console.log("[v0] OAuth session table may not exist yet")
  }

  return NextResponse.json({
    authUrl: authUrl.toString(),
    sessionId,
  })
}

