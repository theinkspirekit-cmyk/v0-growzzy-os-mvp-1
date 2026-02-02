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

    console.log('[v0] Generating AI insights for account:', accountId)

    // Generate mock insights
    const insights = [
      {
        type: 'scaling_opportunity',
        title: 'High-ROAS Campaign Ready to Scale',
        description: 'Campaign XYZ is performing at 3.2x ROAS. Consider increasing budget by 25-30%.',
        confidence: 0.92,
      },
      {
        type: 'cost_control',
        title: 'CPA Rising - Consider Pausing',
        description: 'Ad set ABC showing 45% CPA increase. Recommend pause and optimization.',
        confidence: 0.87,
      },
      {
        type: 'creative_fatigue',
        title: 'Creative Fatigue Detected',
        description: 'Creative ID 123 showing frequency fatigue. Recommend fresh creative.',
        confidence: 0.78,
      },
    ]

    return NextResponse.json({ insights })
  } catch (error: any) {
    console.error('[v0] Generate insights error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
