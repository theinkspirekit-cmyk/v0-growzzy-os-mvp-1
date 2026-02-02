import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  return createClient(url, key)
}

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase()
    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('ad_accounts')
      .select('*')
      .eq('user_id', userId)
      .order('connected_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ connections: data || [] })
  } catch (error: any) {
    console.error('[v0] Get connections error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch connections' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = getSupabase()
    const connectionId = req.nextUrl.searchParams.get('id')
    if (!connectionId) {
      return NextResponse.json({ error: 'Connection ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('ad_accounts')
      .delete()
      .eq('id', connectionId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[v0] Delete connection error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete connection' },
      { status: 500 }
    )
  }
}
