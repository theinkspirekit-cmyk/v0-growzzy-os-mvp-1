import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('sb-access-token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, campaignId, severity, title, message, channels } = await req.json()

    console.log('[v0] Creating alert:', { type, severity, title })

    // Mock alert creation - in production this would save to database
    const alert = {
      id: `alert_${Date.now()}`,
      type,
      severity,
      campaignId,
      title,
      message,
      channels: channels || ['in_app'],
      read: false,
      acknowledged: false,
      createdAt: new Date().toISOString(),
    }

    // In production, you would:
    // 1. Save to database
    // 2. Send to configured channels (email, Slack, SMS)
    // 3. Trigger webhooks

    return NextResponse.json(alert)
  } catch (error) {
    console.error('[v0] Alert creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('sb-access-token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    // Mock alerts - in production fetch from database
    const mockAlerts = [
      {
        id: 'alert_1',
        type: 'roas_drop',
        severity: 'high',
        title: 'ROAS Drop Detected',
        message: 'Campaign "Summer Sale 2024" ROAS dropped from 3.2x to 2.1x',
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'alert_2',
        type: 'budget_remaining',
        severity: 'medium',
        title: 'Budget Alert',
        message: 'Your Meta budget will be exhausted in 2 days at current spend rate',
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'alert_3',
        type: 'creative_fatigue',
        severity: 'low',
        title: 'Creative Fatigue Warning',
        message: '"Product Launch 2024" ad creative running 35 days, CTR declining 18%',
        read: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    const alerts = unreadOnly ? mockAlerts.filter(a => !a.read) : mockAlerts

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error('[v0] Error fetching alerts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}
