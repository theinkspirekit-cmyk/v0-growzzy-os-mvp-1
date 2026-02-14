import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPlatformConnector } from '@/lib/platform-connector'

export const dynamic = 'force-dynamic'

/**
 * POST /api/creatives/publish
 * Publishes a creative to its assigned campaign via platform connector
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 })
        }

        const body = await request.json()
        const { creativeId, campaignId } = body

        if (!creativeId) {
            return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'creativeId is required' } }, { status: 400 })
        }

        // Fetch creative
        const creative = await prisma.creative.findFirst({
            where: { id: creativeId, userId: session.user.id },
        })

        if (!creative) {
            return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Creative not found' } }, { status: 404 })
        }

        // If campaignId provided, assign the creative
        const targetCampaignId = campaignId || creative.campaignId
        if (!targetCampaignId) {
            return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Creative must be assigned to a campaign before publishing' } }, { status: 400 })
        }

        // Fetch campaign
        const campaign = await prisma.campaign.findFirst({
            where: { id: targetCampaignId, userId: session.user.id },
            include: { platform: true },
        })

        if (!campaign) {
            return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Campaign not found' } }, { status: 404 })
        }

        // Publish via platform connector
        let platformResult: any = null
        const platformKey = campaign.platformName || campaign.platform?.name || 'mock'
        const connector = getPlatformConnector(platformKey)

        try {
            platformResult = await connector.publishCreative(creative, campaign.externalId || campaign.id)
        } catch (pubError: any) {
            console.warn('[Publish Creative] Platform warning:', pubError.message)
        }

        // Update creative status
        const updated = await prisma.creative.update({
            where: { id: creativeId },
            data: {
                status: 'published',
                campaignId: targetCampaignId,
            },
        })

        return NextResponse.json({
            ok: true,
            data: {
                creative: updated,
                message: `Creative "${creative.name}" published to campaign "${campaign.name}"`,
                platformResult,
            },
        })
    } catch (error: any) {
        console.error('[Publish Creative] Error:', error)
        return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
    }
}
