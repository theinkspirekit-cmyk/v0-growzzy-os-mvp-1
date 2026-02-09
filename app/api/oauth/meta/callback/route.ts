export const dynamic = 'force-dynamic'
import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { encrypt } from "@/lib/crypto"

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code")
    const state = request.nextUrl.searchParams.get("state")

    if (!code) {
      return NextResponse.json({ error: "No authorization code" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const storedState = cookieStore.get("meta_oauth_state")?.value

    if (state !== storedState) {
      return NextResponse.json({ error: "Invalid state parameter" }, { status: 400 })
    }

    // Exchange code for access token
    const tokenUrl = new URL("https://graph.instagram.com/v18.0/oauth/access_token")
    tokenUrl.searchParams.append("client_id", process.env.META_APP_ID || "")
    tokenUrl.searchParams.append("client_secret", process.env.META_APP_SECRET || "")
    tokenUrl.searchParams.append(
      "redirect_uri",
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/meta/callback`,
    )
    tokenUrl.searchParams.append("code", code)

    const tokenResponse = await fetch(tokenUrl.toString())
    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      throw new Error("Failed to get access token")
    }

    // Get account information
    const accountResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${tokenData.access_token}`,
    )
    const accountData = await accountResponse.json()

    // Initialize Supabase client
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.from("platform_connections").insert({
      user_id: user.id,
      platform: "meta",
      account_id: accountData.id,
      account_name: accountData.name,
      access_token: encrypt(tokenData.access_token),
      refresh_token: null,
      expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true,
    })

    if (error) throw error

    // Clear state cookie
    cookieStore.delete("meta_oauth_state")

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?tab=integrations&success=meta_connected`,
    )
  } catch (error: any) {
    console.error("[v0] Meta OAuth error:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?tab=integrations&error=${error.message}`,
    )
  }
}

