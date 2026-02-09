import { NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth-simple'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    console.log('[v0] Login attempt for:', email)

    const user = await loginUser(email, password)

    if (!user) {
      console.log('[v0] Login failed: invalid credentials')
      return NextResponse.json(
        { error: 'Invalid email or password. Don\'t have an account? Sign up first!' },
        { status: 401 }
      )
    }

    console.log('[v0] Login successful for user:', user.id)

    // Return success - Supabase auth session is already set via cookies
    return NextResponse.json(
      { success: true, user },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Login error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    )
  }
}
