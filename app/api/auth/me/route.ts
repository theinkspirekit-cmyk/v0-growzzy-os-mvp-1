import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase/server'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = getSupabaseServer()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user || error) {
      console.log('[v0] Auth/me - No user found, error:', error?.message)
      return NextResponse.json({ user: null }, { status: 401 })
    }

    console.log('[v0] Auth check passed for user:', user.id)

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('[v0] Auth check error:', error.message)
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
