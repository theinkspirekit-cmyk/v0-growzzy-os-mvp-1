export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { eventType, platform, payload, response: responseText, statusCode, success, error } = await req.json()

    if (!eventType) {
      return NextResponse.json({ error: 'Event type is required' }, { status: 400 })
    }

    // Log webhook event
    const log = await prisma.webhookLog.create({
      data: {
        userId: session.user.id,
        eventType,
        platform: platform || null,
        payload: payload || {},
        response: responseText || null,
        statusCode: statusCode || null,
        success: success ?? false,
        error: error || null,
        processedAt: new Date()
      }
    })

    return NextResponse.json({ success: true, logId: log.id })
  } catch (error: any) {
    console.error('[v0] Webhook logging error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to log webhook' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const eventType = searchParams.get('eventType')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = { userId: session.user.id }
    if (eventType) {
      where.eventType = eventType
    }

    const logs = await prisma.webhookLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100)
    })

    return NextResponse.json({ logs })
  } catch (error: any) {
    console.error('[v0] Fetch webhook logs error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch logs' },
      { status: 500 }
    )
  }
}
