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
      .eq('status', 'active')
      .order('connected_at', { ascending: false })

    if (error) throw error

    console.log('[v0] Found', accounts?.length || 0, 'active accounts for user', user.id)

    return NextResponse.json({
      accounts: accounts || [],
      total: accounts?.length || 0,
    })
  } catch (error: any) {
    console.error('[v0] Get accounts error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('id')

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('ad_accounts')
      .update({ status: 'disconnected' })
      .eq('id', accountId)
      .eq('user_id', user.id)

    if (error) throw error

    console.log('[v0] Disconnected account:', accountId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[v0] Disconnect account error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
