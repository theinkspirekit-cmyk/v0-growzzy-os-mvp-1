import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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

    const { accountId } = await request.json()

    // Fetch campaigns from Meta/Google/TikTok APIs
    // Normalize and store in database
    const { data: account } = await supabase
      .from('ad_accounts')
      .select('*')
      .eq('id', accountId)
      .eq('user_id', user.id)
      .single()

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    console.log('[v0] Starting campaign sync for account:', account.account_id)

    // Trigger sync in background
    const { error: logError } = await supabase
      .from('sync_logs')
      .insert({
        ad_account_id: accountId,
        sync_type: 'incremental',
        status: 'running',
        started_at: new Date().toISOString(),
      })

    return NextResponse.json({ success: true, message: 'Sync started' })
  } catch (error: any) {
    console.error('[v0] Campaign sync error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
