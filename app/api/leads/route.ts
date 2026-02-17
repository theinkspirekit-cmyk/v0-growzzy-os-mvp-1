import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { scoreLeads } from '@/lib/openai'
import { parse } from 'papaparse'

export const dynamic = 'force-dynamic'

// ============================================
// GET - Fetch all leads for user
// ============================================

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const source = searchParams.get('source')

        const where: any = { userId: session.user.id }
        if (status) where.status = status
        if (source) where.source = source

        const leads = await prisma.lead.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ success: true, leads })
    } catch (error: any) {
        console.error('[API] Get leads error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// ============================================
// POST - Add single lead or import CSV
// ============================================

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const action = body.action || 'add'
        const data = body.data || body

        // Single Lead Add
        if (action === 'add') {
            const { name, email, phone, company, position, source, estimatedValue } = data

            if (!name || !email) {
                return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
            }

            const lead = await prisma.lead.create({
                data: {
                    userId: session.user.id,
                    name,
                    email,
                    phone,
                    company,
                    position,
                    source: source || 'Manual',
                    estimatedValue: estimatedValue ? parseFloat(estimatedValue) : null,
                    status: 'new',
                },
            })

            // AI Score the lead
            const scoreResult = await scoreLeads([lead])
            if (scoreResult.success && scoreResult.data.scores[0]) {
                const aiData = scoreResult.data.scores[0]
                await prisma.lead.update({
                    where: { id: lead.id },
                    data: {
                        aiScore: aiData.score,
                        aiInsights: aiData.reasoning,
                    },
                })
            }

            return NextResponse.json({ success: true, lead })
        }

        // CSV Import
        if (action === 'import') {
            const { csvData } = data

            if (!csvData) {
                return NextResponse.json({ error: 'CSV data required' }, { status: 400 })
            }

            // Parse CSV
            const parseResult = parse(csvData, {
                header: true,
                skipEmptyLines: true,
            })

            if (parseResult.errors.length > 0) {
                return NextResponse.json({ error: 'Invalid CSV format' }, { status: 400 })
            }

            const rows = parseResult.data as any[]
            const imported: any[] = []

            for (const row of rows) {
                if (!row.name || !row.email) continue

                try {
                    const lead = await prisma.lead.create({
                        data: {
                            userId: session.user.id,
                            name: row.name,
                            email: row.email,
                            phone: row.phone || null,
                            company: row.company || null,
                            position: row.position || null,
                            source: row.source || 'Import',
                            estimatedValue: row.estimatedValue ? parseFloat(row.estimatedValue) : null,
                            status: 'new',
                        },
                    })
                    imported.push(lead)
                } catch (err) {
                    console.error('[Import] Lead creation failed:', err)
                }
            }

            // Batch AI scoring
            if (imported.length > 0) {
                const scoreResult = await scoreLeads(imported)
                if (scoreResult.success && scoreResult.data.scores) {
                    for (const score of scoreResult.data.scores) {
                        await prisma.lead.update({
                            where: { id: score.id },
                            data: {
                                aiScore: score.score,
                                aiInsights: score.reasoning,
                            },
                        }).catch(() => { })
                    }
                }
            }

            return NextResponse.json({ success: true, imported: imported.length })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    } catch (error: any) {
        console.error('[API] Add/Import leads error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// ============================================
// PATCH - Update lead
// ============================================

export async function PATCH(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { id, ...updates } = body

        if (!id) {
            return NextResponse.json({ error: 'Lead ID required' }, { status: 400 })
        }

        const lead = await prisma.lead.update({
            where: { id, userId: session.user.id },
            data: updates,
        })

        return NextResponse.json({ success: true, lead })
    } catch (error: any) {
        console.error('[API] Update lead error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// ============================================
// DELETE - Delete lead
// ============================================

export async function DELETE(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Lead ID required' }, { status: 400 })
        }

        await prisma.lead.delete({
            where: { id, userId: session.user.id },
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('[API] Delete lead error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
