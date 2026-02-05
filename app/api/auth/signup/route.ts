import { NextResponse } from 'next/server'
import { registerUser, loginUser } from '@/lib/auth-simple'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    console.log('[v0] Signup attempt for:', email)

    // Register user
    const user = await registerUser(email, password, name || 'User')

    console.log('[v0] User registered:', user.id)

    // Log user in automatically
    const loggedInUser = await loginUser(email, password)
    if (!loggedInUser) {
      throw new Error('Login failed after signup')
    }

    console.log('[v0] Auto-login successful after signup')

    // Return success - Supabase auth session is already set via cookies
    return NextResponse.json(
      {
        success: true,
        user: {
          id: loggedInUser.id,
          email: loggedInUser.email,
          full_name: loggedInUser.full_name,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[v0] Signup error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Signup failed' },
      { status: 500 }
    )
  }
}
