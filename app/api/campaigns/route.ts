import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPlatformConnector } from '@/lib/platform-connector'
import { analyzeCampaign } from '@/lib/openai'

export const dynamic = 'force-dynamic'

// ============================================
// GET — Fetch all campaigns for user
// ============================================
export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const platformName = searchParams.get('platform')

        const where: any = { userId: session.user.id }
        if (status) where.status = status
        if (platformName) where.platformName = platformName

        const campaigns = await prisma.campaign.findMany({
            where,
            include: {
                platform: { select: { name: true, accountName: true } },
                creatives: { select: { id: true, name: true, status: true } },
                _count: { select: { creatives: true } },
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ ok: true, data: { campaigns } })
    } catch (error: any) {
        console.error('[API] GET /api/campaigns error:', error)
        return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
    }
}

// ============================================
// POST — Create campaign + platform sync
// ============================================
export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 })
        }

        const body = await request.json()
        const {
            name,
            platform: platformName,
            platformId,
            objective,
            dailyBudget,
            totalBudget,
            budgetType,
            targeting,
            startDate,
            endDate,
            status: requestedStatus
        } = body

        if (!name) {
            return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Campaign name is required' } }, { status: 400 })
        }

        // Determine the platform name
        const resolvedPlatform = platformName || 'meta'

        // Try platform connector sync (will use mock if not connected)
        let externalId: string | null = null
        const connector = getPlatformConnector(resolvedPlatform)

        try {
            const syncResult = await connector.createCampaign({
                name,
                objective,
                dailyBudget,
                totalBudget,
                targeting,
                startDate,
            })

            if (syncResult.success) {
                externalId = syncResult.externalId || null
            }
        } catch (syncError: any) {
            console.warn('[Campaign] Platform sync warning:', syncError.message)
            // Don't fail — save locally even if platform sync fails
        }

        // Save to database
        const campaign = await prisma.campaign.create({
            data: {
                userId: session.user.id,
                name,
                platformName: resolvedPlatform,
                platformId: platformId || null,
                objective: objective || 'conversions',
                status: requestedStatus || 'draft',
                dailyBudget: dailyBudget ? parseFloat(dailyBudget) : null,
                totalBudget: totalBudget ? parseFloat(totalBudget) : null,
                budgetType: budgetType || 'daily',
                targeting: targeting || null,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                externalId,
            },
            include: { platform: true },
        })

        return NextResponse.json({ ok: true, data: { campaign } })
    } catch (error: any) {
        console.error('[API] POST /api/campaigns error:', error)
        return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
    }
}

// ============================================
// PATCH — Update campaign (status, budget, etc)
// ============================================
export async function PATCH(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 })
        }

        const body = await request.json()
        const { id, status, dailyBudget, totalBudget, budgetType, ...updates } = body

        if (!id) {
            return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Campaign ID required' } }, { status: 400 })
        }

        const existing = await prisma.campaign.findFirst({
            where: { id, userId: session.user.id },
            include: { platform: true },
        })

        if (!existing) {
            return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Campaign not found' } }, { status: 404 })
        }

        // Platform connector sync for status changes
        const platformKey = existing.platformName || existing.platform?.name || 'mock'
        if (existing.externalId && status) {
            const connector = getPlatformConnector(platformKey)
            try {
                if (status === 'paused') {
                    await connector.pauseCampaign(existing.externalId)
                } else if (status === 'active' || status === 'running') {
                    await connector.resumeCampaign(existing.externalId)
                }
            } catch (syncError: any) {
                console.warn('[Campaign] Platform sync warning:', syncError.message)
            }
        }

        // Budget change sync
        if (existing.externalId && dailyBudget && dailyBudget !== existing.dailyBudget) {
            const connector = getPlatformConnector(platformKey)
            try {
                await connector.updateCampaign(existing.externalId, { dailyBudget })
            } catch (syncError: any) {
                console.warn('[Campaign] Budget sync warning:', syncError.message)
            }
        }

        const campaign = await prisma.campaign.update({
            where: { id },
            data: {
                ...updates,
                status: status || existing.status,
                dailyBudget: dailyBudget != null ? parseFloat(dailyBudget) : existing.dailyBudget,
                totalBudget: totalBudget != null ? parseFloat(totalBudget) : existing.totalBudget,
                budgetType: budgetType || existing.budgetType,
            },
        })

        // AI analysis on status activation
        if (status === 'active') {
            try {
                const analysis = await analyzeCampaign(campaign)
                if (analysis.success) {
                    await prisma.campaign.update({
                        where: { id },
                        data: {
                            aiHealth: analysis.data.health,
                            aiRecommendations: analysis.data,
                        },
                    })
                }
            } catch (aiError: any) {
                console.warn('[Campaign] AI analysis warning:', aiError.message)
            }
        }

        return NextResponse.json({ ok: true, data: { campaign } })
    } catch (error: any) {
        console.error('[API] PATCH /api/campaigns error:', error)
        return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
    }
}

// ============================================
// DELETE — Delete campaign + platform sync
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
            return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Campaign ID required' } }, { status: 400 })
        }

        const campaign = await prisma.campaign.findFirst({
            where: { id, userId: session.user.id },
        })

        if (!campaign) {
            return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Campaign not found' } }, { status: 404 })
        }

        // Platform sync — delete/pause on platform
        if (campaign.externalId && campaign.platformName) {
            const connector = getPlatformConnector(campaign.platformName)
            try {
                await connector.deleteCampaign(campaign.externalId)
            } catch (syncError: any) {
                console.warn('[Campaign] Platform delete warning:', syncError.message)
            }
        }

        await prisma.campaign.delete({ where: { id } })

        return NextResponse.json({ ok: true })
    } catch (error: any) {
        console.error('[API] DELETE /api/campaigns error:', error)
        return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
    }
}
