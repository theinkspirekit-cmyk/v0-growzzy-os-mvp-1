import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
    pauseGoogleAdsCampaign,
    pauseMetaAdsCampaign,
    pauseLinkedInAdsCampaign
} from '@/lib/platforms'

export const dynamic = 'force-dynamic'

/**
 * POST /api/campaigns/[id]/pause
 * Pauses a campaign both in database and on the ad platform
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const campaignId = params.id

        // Get campaign with platform info
        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId },
            include: { platform: true }
        })

        if (!campaign || campaign.userId !== session.user.id) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
        }

        if (campaign.status === 'paused') {
            return NextResponse.json({
                success: true,
                message: 'Campaign already paused',
                campaign
            })
        }

        // Pause on actual platform
        let platformResult
        if (campaign.platform && campaign.externalId) {
            const platformType = campaign.platform.name.toLowerCase()

            try {
                if (platformType.includes('google')) {
                    platformResult = await pauseGoogleAdsCampaign(
                        campaign.platform.id,
                        campaign.externalId
                    )
                } else if (platformType.includes('meta')) {
                    platformResult = await pauseMetaAdsCampaign(
                        campaign.platform.id,
                        campaign.externalId
                    )
                } else if (platformType.includes('linkedin')) {
                    platformResult = await pauseLinkedInAdsCampaign(
                        campaign.platform.id,
                        campaign.externalId
                    )
                }
            } catch (platformError: any) {
                console.error('[Pause Campaign] Platform error:', platformError)
                // Continue with DB update even if platform fails
                // Log the error for manual resolution
            }
        }

        // Update in database
        const updatedCampaign = await prisma.campaign.update({
            where: { id: campaignId },
            data: {
                status: 'paused',
                updatedAt: new Date()
            },
            include: {
                platform: { select: { name: true, accountName: true } }
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Campaign paused successfully',
            campaign: updatedCampaign,
            platformResult
        })
    } catch (error: any) {
        console.error('[Pause Campaign] Error:', error)
        return NextResponse.json({
            error: error.message || 'Failed to pause campaign'
        }, { status: 500 })
    }
}
