export const dynamic = 'force-dynamic'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const preferenceSchema = z.object({
  channel: z.enum(['email', 'slack', 'in_app']),
  eventType: z.enum(['automation_executed', 'alert', 'report_ready', 'sync_failed']),
  enabled: z.boolean(),
  frequency: z.enum(['immediate', 'daily', 'weekly']).optional(),
  quietHours: z.object({ start: z.string(), end: z.string() }).optional()
})

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const preferences = await prisma.notificationPreference.findMany({
      where: { userId: session.user.id },
      orderBy: [{ channel: 'asc' }, { eventType: 'asc' }]
    })

    return NextResponse.json({ preferences })
  } catch (error: any) {
    console.error('[v0] Fetch preferences error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch preferences' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validated = preferenceSchema.parse(body)

    // Upsert preference
    const preference = await prisma.notificationPreference.upsert({
      where: {
        userId_channel_eventType: {
          userId: session.user.id,
          channel: validated.channel,
          eventType: validated.eventType
        }
      },
      update: {
        enabled: validated.enabled,
        frequency: validated.frequency,
        quietHours: validated.quietHours
      },
      create: {
        userId: session.user.id,
        channel: validated.channel,
        eventType: validated.eventType,
        enabled: validated.enabled,
        frequency: validated.frequency,
        quietHours: validated.quietHours
      }
    })

    return NextResponse.json({ success: true, preference })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('[v0] Update preferences error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update preferences' },
      { status: 500 }
    )
  }
}
