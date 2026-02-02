import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function GET(request: NextRequest) {
  try {
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

    const { data: accounts, error } = await supabase
      .from('ad_accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('connected_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ accounts: accounts || [] })
  } catch (error: any) {
    console.error('[v0] List accounts error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json()
    const { platform } = body

    if (!platform) {
      return NextResponse.json({ error: 'Platform required' }, { status: 400 })
    }

    let authUrl = ''
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/${platform}/callback`

    if (platform === 'meta') {
      const clientId = process.env.NEXT_PUBLIC_META_APP_ID
      authUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth')
      authUrl.searchParams.append('client_id', clientId || '')
      authUrl.searchParams.append('redirect_uri', redirectUri)
      authUrl.searchParams.append('state', Math.random().toString(36).substring(7))
      authUrl.searchParams.append('scope', 'ads_management,pages_read_engagement')
      authUrl.searchParams.append('response_type', 'code')
    } else if (platform === 'tiktok') {
      const clientId = process.env.NEXT_PUBLIC_TIKTOK_APP_ID
      authUrl = new URL('https://ads.tiktok.com/marketing_api/v3/tt_web/oauth2/authorize')
      authUrl.searchParams.append('app_id', clientId || '')
      authUrl.searchParams.append('state', Math.random().toString(36).substring(7))
      authUrl.searchParams.append('redirect_uri', redirectUri)
    } else if (platform === 'google') {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID
      authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
      authUrl.searchParams.append('client_id', clientId || '')
      authUrl.searchParams.append('redirect_uri', redirectUri)
      authUrl.searchParams.append('response_type', 'code')
      authUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/adwords')
      authUrl.searchParams.append('state', Math.random().toString(36).substring(7))
    }

    return NextResponse.json({ authUrl: authUrl.toString() })
  } catch (error: any) {
    console.error('[v0] Connect account error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
