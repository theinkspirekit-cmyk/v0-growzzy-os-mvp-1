import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json({ error: 'No authorization code' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('sb-access-token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(supabaseUrl!, supabaseAnonKey!)
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://ads.tiktok.com/open_api/v1.3/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: process.env.NEXT_PUBLIC_TIKTOK_APP_ID,
        secret: process.env.TIKTOK_APP_SECRET,
        auth_code: code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok || !tokenData.data?.access_token) {
      console.error('[v0] TikTok token exchange error:', tokenData)
      return NextResponse.json({ error: 'Failed to exchange code' }, { status: 400 })
    }

    // Get advertiser info
    const accountId = tokenData.data.advertiser_ids?.[0] || 'unknown'

    // Store in database
    const { error: dbError } = await supabase
      .from('ad_accounts')
      .insert({
        user_id: user.id,
        platform: 'tiktok',
        account_id: accountId,
        account_name: accountId,
        access_token: tokenData.data.access_token,
        refresh_token: tokenData.data.refresh_token || null,
        token_expires_at: tokenData.data.expires_in ? new Date(Date.now() + tokenData.data.expires_in * 1000) : null,
        status: 'active',
        connected_at: new Date().toISOString(),
      })

    if (dbError) {
      console.error('[v0] Error storing TikTok account:', dbError)
      return NextResponse.json({ error: 'Failed to store account' }, { status: 500 })
    }

    console.log('[v0] TikTok account connected for user:', user.id)

    return NextResponse.redirect(new URL('/dashboard/connections?success=true', request.url))
  } catch (error: any) {
    console.error('[v0] TikTok callback error:', error)
    return NextResponse.redirect(new URL('/dashboard/connections?error=true', request.url))
  }
}
