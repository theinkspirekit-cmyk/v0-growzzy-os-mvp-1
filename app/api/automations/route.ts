import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const automations = await prisma.automation.findMany({
      where: { userId: session.user.id },
      include: { logs: { take: 5, orderBy: { runTime: 'desc' } } },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, automations })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { name, triggerType, trigger, actionType, action, description } = body

    if (!name || !triggerType || !actionType) {
      return NextResponse.json({ error: 'Vital parameters missing' }, { status: 400 })
    }

    const automation = await prisma.automation.create({
      data: {
        userId: session.user.id,
        name,
        description,
        triggerType,
        trigger: trigger || {},
        actionType,
        action: action || {},
        isActive: true
      }
    })

    return NextResponse.json({ success: true, automation })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { id, isActive, name, ...updates } = body

    const automation = await prisma.automation.update({
      where: { id, userId: session.user.id },
      data: {
        isActive: isActive !== undefined ? isActive : undefined,
        name,
        ...updates
      }
    })

    return NextResponse.json({ success: true, automation })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await prisma.automation.delete({
      where: { id, userId: session.user.id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
