import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { redirectUrl } = await request.json()

    const clientId = process.env.NEXT_PUBLIC_TIKTOK_APP_ID
    const state = Math.random().toString(36).substring(7)

    const authUrl = new URL('https://ads.tiktok.com/marketing_api/v3/tt_web/oauth2/authorize')
    authUrl.searchParams.append('app_id', clientId || '')
    authUrl.searchParams.append('state', state)
    authUrl.searchParams.append('redirect_uri', redirectUrl || '')

    console.log('[v0] TikTok OAuth start URL:', authUrl.toString())

    return NextResponse.json({
      authUrl: authUrl.toString(),
      state,
    })
  } catch (error: any) {
    console.error('[v0] TikTok OAuth start error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
