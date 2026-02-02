import { NextRequest, NextResponse } from 'next/server'

interface Automation {
  id: string
  userId: string
  name: string
  trigger: string
  triggerValue: number
  action: string
  enabled: boolean
  lastExecuted?: string
}

const automations: Automation[] = []

export async function GET() {
  return NextResponse.json({ automations }, { status: 200 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const automation: Automation = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'user_1',
      name: body.name,
      trigger: body.trigger,
      triggerValue: body.triggerValue,
      action: body.action,
      enabled: body.enabled,
    }

    automations.push(automation)

    return NextResponse.json({ automation }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create automation' }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const index = automations.findIndex((a) => a.id === body.id)

    if (index === -1) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 })
    }

    automations[index] = { ...automations[index], ...body }

    return NextResponse.json({ automation: automations[index] }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update automation' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Automation ID required' }, { status: 400 })
    }

    const index = automations.findIndex((a) => a.id === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 })
    }

    const deleted = automations.splice(index, 1)

    return NextResponse.json({ deleted: deleted[0] }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete automation' }, { status: 400 })
  }
}
