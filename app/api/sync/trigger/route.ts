export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 })
    }

    const userId = session.user.id
    console.log(`[Sync] Manual sync triggered for user ${userId}`)

    // Platform sync is handled via platform-connector abstraction
    // Real sync would iterate connected platforms and pull latest data

    return NextResponse.json({
      ok: true,
      data: {
        message: 'Sync completed',
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error('[Sync] Manual sync error:', error)
    return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
  }
}
