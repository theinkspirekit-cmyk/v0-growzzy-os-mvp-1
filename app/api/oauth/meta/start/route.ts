import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { redirectUrl } = await request.json()

    const clientId = process.env.NEXT_PUBLIC_META_APP_ID
    const state = Math.random().toString(36).substring(7)

    // Store state in session for validation
    const authUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth')
    authUrl.searchParams.append('client_id', clientId || '')
    authUrl.searchParams.append('redirect_uri', redirectUrl || '')
    authUrl.searchParams.append('state', state)
    authUrl.searchParams.append('scope', 'ads_management,pages_read_engagement,pages_read_user_content')
    authUrl.searchParams.append('response_type', 'code')

    console.log('[v0] Meta OAuth start URL:', authUrl.toString())

    return NextResponse.json({
      authUrl: authUrl.toString(),
      state,
    })
  } catch (error: any) {
    console.error('[v0] Meta OAuth start error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
