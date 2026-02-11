import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
    createGoogleAdsCampaign,
    createMetaAdsCampaign,
    createLinkedInAdsCampaign,
} from '@/lib/platforms'
import { analyzeCampaign } from '@/lib/openai'

export const dynamic = 'force-dynamic'

// ============================================
// GET - Fetch all campaigns
// ============================================

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const campaigns = await prisma.campaign.findMany({
            where: { userId: session.user.id },
            include: {
                platform: { select: { name: true, accountName: true } },
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ success: true, campaigns })
    } catch (error: any) {
        console.error('[API] Get campaigns error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// ============================================
// POST - Create campaign on real platform
// ============================================

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { platformId, name, objective, dailyBudget, totalBudget, targeting, startDate, status } = body

        if (!platformId || !name) {
            return NextResponse.json({ error: 'Platform and name required' }, { status: 400 })
        }

        // Get platform info
        const platform = await prisma.platform.findUnique({ where: { id: platformId } })
        if (!platform || platform.userId !== session.user.id) {
            return NextResponse.json({ error: 'Platform not found' }, { status: 404 })
        }

        // Create campaign on the actual ad platform
        let externalCampaign: any
        const platformType = platform.name.toLowerCase()

        try {
            if (platformType.includes('google')) {
                externalCampaign = await createGoogleAdsCampaign(platformId, {
                    name,
                    dailyBudget,
                    status,
                })
            } else if (platformType.includes('meta')) {
                externalCampaign = await createMetaAdsCampaign(platformId, {
                    name,
                    objective,
                    dailyBudget,
                    status,
                })
            } else if (platformType.includes('linkedin')) {
                externalCampaign = await createLinkedInAdsCampaign(platformId, {
                    name,
                    dailyBudget,
                    status,
                })
            } else {
                throw new Error('Unsupported platform')
            }
        } catch (platformError: any) {
            console.error('[Campaign] Platform creation error:', platformError)
            return NextResponse.json(
                { error: `Failed to create campaign on ${platform.name}: ${platformError.message}` },
                { status: 500 }
            )
        }

        // Save to our database
        const campaign = await prisma.campaign.create({
            data: {
                userId: session.user.id,
                platformId,
                name,
                objective,
                status: status || 'draft',
                dailyBudget: dailyBudget ? parseFloat(dailyBudget) : null,
                totalBudget: totalBudget ? parseFloat(totalBudget) : null,
                targeting: targeting || null,
                startDate: startDate ? new Date(startDate) : null,
                externalId: externalCampaign.externalId,
            },
            include: {
                platform: true,
            },
        })

        return NextResponse.json({ success: true, campaign })
    } catch (error: any) {
        console.error('[API] Create campaign error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// ============================================
// PATCH - Update campaign (pause/activate)
// ============================================

export async function PATCH(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { id, status, dailyBudget, ...updates } = body

        if (!id) {
            return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 })
        }

        // Get existing campaign
        const existing = await prisma.campaign.findUnique({
            where: { id },
            include: { platform: true },
        })

        if (!existing || existing.userId !== session.user.id) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
        }

        // TODO: Update campaign on actual platform via API
        // For now, just update in our database

        const campaign = await prisma.campaign.update({
            where: { id },
            data: {
                ...updates,
                status: status || existing.status,
                dailyBudget: dailyBudget ? parseFloat(dailyBudget) : existing.dailyBudget,
            },
        })

        // Get AI analysis
        if (status === 'active') {
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
        }

        return NextResponse.json({ success: true, campaign })
    } catch (error: any) {
        console.error('[API] Update campaign error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// ============================================
// DELETE - Delete campaign
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
            return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 })
        }

        await prisma.campaign.delete({
            where: { id, userId: session.user.id },
        })

        // TODO: Also delete/pause on actual platform

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('[API] Delete campaign error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
