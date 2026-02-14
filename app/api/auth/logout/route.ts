export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      (process.env.NEXT_PUBLIC_SUPABASE_URL || ''),
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''),
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      },
    )

    // Sign out from Supabase
    await supabase.auth.signOut()

    console.log('[v0] User logged out successfully')

    return NextResponse.json({ success: true, message: 'Logged out successfully' })
  } catch (error: any) {
    console.error('[v0] Logout error:', error.message)
    return NextResponse.json(
      { error: 'Logout failed', details: error.message },
      { status: 500 }
    )
  }
}

