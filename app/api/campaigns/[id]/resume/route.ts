import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPlatformConnector } from '@/lib/platform-connector'

export const dynamic = 'force-dynamic'

/**
 * POST /api/campaigns/[id]/resume
 * Resumes a paused campaign both in database and on the ad platform
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 })
        }

        const { id: campaignId } = await params

        const campaign = await prisma.campaign.findFirst({
            where: { id: campaignId, userId: session.user.id },
            include: { platform: true },
        })

        if (!campaign) {
            return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Campaign not found' } }, { status: 404 })
        }

        if (campaign.status === 'active' || campaign.status === 'running') {
            return NextResponse.json({ ok: true, data: { campaign, message: 'Campaign is already active' } })
        }

        // Sync with platform connector
        let platformResult: any = null
        if (campaign.externalId) {
            const platformKey = campaign.platformName || campaign.platform?.name || 'mock'
            const connector = getPlatformConnector(platformKey)
            try {
                platformResult = await connector.resumeCampaign(campaign.externalId)
            } catch (syncError: any) {
                console.warn('[Resume Campaign] Platform sync warning:', syncError.message)
            }
        }

        const updatedCampaign = await prisma.campaign.update({
            where: { id: campaignId },
            data: { status: 'active' },
            include: { platform: { select: { name: true, accountName: true } } },
        })

        return NextResponse.json({
            ok: true,
            data: {
                campaign: updatedCampaign,
                message: 'Campaign resumed successfully',
                platformResult,
            },
        })
    } catch (error: any) {
        console.error('[Resume Campaign] Error:', error)
        return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
    }
}
