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

    const { accountId, dateRange } = await request.json()

    const { data: account } = await supabase
      .from('ad_accounts')
      .select('*')
      .eq('id', accountId)
      .eq('user_id', user.id)
      .single()

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    console.log('[v0] Fetching performance metrics for account:', account.account_id)

    // In production, fetch from platform APIs and normalize
    // For now, return mock metrics
    const mockMetrics = {
      spend: 1250.00,
      revenue: 4200.00,
      impressions: 50000,
      clicks: 1250,
      conversions: 85,
      cpa: 14.71,
      roas: 3.36,
    }

    return NextResponse.json({ metrics: mockMetrics })
  } catch (error: any) {
    console.error('[v0] Metrics sync error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
