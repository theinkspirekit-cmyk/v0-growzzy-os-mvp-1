import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateReportSummary } from '@/lib/openai'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const reports = await prisma.report.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, reports })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { name, type, startDate, endDate, platforms } = body

    if (!name || !type || !startDate || !endDate) {
      return NextResponse.json({ error: 'Report parameters incomplete' }, { status: 400 })
    }

    // 1. Create Placeholder
    const report = await prisma.report.create({
      data: {
        userId: session.user.id,
        name,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        platforms: platforms || ["GOOGLE", "META"],
        status: 'generating'
      }
    })

    // 2. Mocking Data Retrieval (In real, we'd query Analytics model here)
    const mockSnap = {
      spend: 4200,
      revenue: 12400,
      leads: 142,
      roas: 2.95
    }

    // 3. AI Summary Generator
    const aiResult = await generateReportSummary(mockSnap, type)

    // 4. Finalize Report
    const updated = await prisma.report.update({
      where: { id: report.id },
      data: {
        data: mockSnap,
        aiSummary: aiResult || "Strategic analysis completed. Metrics indicate stable growth within current allocation.",
        status: 'ready'
      }
    })

    return NextResponse.json({ success: true, report: updated })
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

    await prisma.report.delete({ where: { id, userId: session.user.id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
