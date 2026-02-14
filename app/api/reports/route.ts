import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateReportMetrics } from '@/lib/report-metrics'
import { generateAIInsights } from '@/lib/report-insights'
import { generateActionPlan } from '@/lib/report-action-plan'

export const dynamic = 'force-dynamic'

// ============================================
// GET — List all reports
// ============================================
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = { userId: session.user.id }
    if (status) where.status = status

    const reports = await prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ ok: true, data: { reports } })
  } catch (error: any) {
    console.error('[Reports] GET error:', error)
    return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
  }
}

// ============================================
// POST — Create report + generate data + AI summary
// ============================================
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 })
    }

    const body = await request.json()
    const { name, type, startDate, endDate, platforms, schedule, config } = body

    if (!name || !type || !startDate || !endDate) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'name, type, startDate, endDate are required' } }, { status: 400 })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    // 1. Create report with status 'generating'
    const report = await prisma.report.create({
      data: {
        userId: session.user.id,
        name,
        type,
        startDate: start,
        endDate: end,
        platforms: platforms || ['meta', 'google'],
        schedule: schedule || null,
        config: config || null,
        status: 'generating',
      },
    })

    // 2. Perform comprehensive analysis
    console.log(`[Reports] Generating analysis for report ${report.id}`)

    // a. Calculate metrics
    const metrics = await calculateReportMetrics(session.user.id, { from: start, to: end })

    // b. Generate AI Insights
    const insights = await generateAIInsights(metrics)

    // c. Generate Action Plan
    const actionPlan = await generateActionPlan(metrics, insights)

    // 3. Generate legacy AI summary for compatibility
    const aiSummary = insights.wins.slice(0, 2).join(". ") + ". " + insights.concerns.slice(0, 1).join(". ");

    // 4. Finalize report with all data
    const updated = await prisma.report.update({
      where: { id: report.id },
      data: {
        metrics: metrics as any,
        insights: insights as any,
        recommendations: actionPlan as any,
        aiSummary,
        status: 'completed',
        lastRunAt: new Date(),
      },
    })

    return NextResponse.json({ ok: true, data: { report: updated } })
  } catch (error: any) {
    console.error('[Reports] POST error:', error)
    return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
  }
}

// ============================================
// PATCH — Update report (schedule, config)
// ============================================
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 })
    }

    const body = await request.json()
    const { id, schedule, name, config } = body

    if (!id) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Report ID required' } }, { status: 400 })
    }

    const report = await prisma.report.update({
      where: { id, userId: session.user.id },
      data: {
        ...(schedule !== undefined && { schedule, status: schedule ? 'scheduled' : 'completed' }),
        ...(name && { name }),
        ...(config && { config }),
      },
    })

    return NextResponse.json({ ok: true, data: { report } })
  } catch (error: any) {
    console.error('[Reports] PATCH error:', error)
    return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
  }
}

// ============================================
// DELETE — Delete report
// ============================================
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Report ID required' } }, { status: 400 })
    }

    await prisma.report.delete({ where: { id, userId: session.user.id } })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('[Reports] DELETE error:', error)
    return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
  }
}
