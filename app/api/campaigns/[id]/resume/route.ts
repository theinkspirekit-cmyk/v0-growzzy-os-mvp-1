import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
    resumeGoogleAdsCampaign,
    resumeMetaAdsCampaign,
    resumeLinkedInAdsCampaign
} from '@/lib/platforms'

export const dynamic = 'force-dynamic'

/**
 * POST /api/campaigns/[id]/resume
 * Resumes a paused campaign both in database and on the ad platform
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

        if (campaign.status === 'active') {
            return NextResponse.json({
                success: true,
                message: 'Campaign already active',
                campaign
            })
        }

        // Resume on actual platform
        let platformResult
        if (campaign.platform && campaign.externalId) {
            const platformType = campaign.platform.name.toLowerCase()

            try {
                if (platformType.includes('google')) {
                    platformResult = await resumeGoogleAdsCampaign(
                        campaign.platform.id,
                        campaign.externalId
                    )
                } else if (platformType.includes('meta')) {
                    platformResult = await resumeMetaAdsCampaign(
                        campaign.platform.id,
                        campaign.externalId
                    )
                } else if (platformType.includes('linkedin')) {
                    platformResult = await resumeLinkedInAdsCampaign(
                        campaign.platform.id,
                        campaign.externalId
                    )
                }
            } catch (platformError: any) {
                console.error('[Resume Campaign] Platform error:', platformError)
                // Continue with DB update even if platform fails
            }
        }

        // Update in database
        const updatedCampaign = await prisma.campaign.update({
            where: { id: campaignId },
            data: {
                status: 'active',
                updatedAt: new Date()
            },
            include: {
                platform: { select: { name: true, accountName: true } }
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Campaign resumed successfully',
            campaign: updatedCampaign,
            platformResult
        })
    } catch (error: any) {
        console.error('[Resume Campaign] Error:', error)
        return NextResponse.json({
            error: error.message || 'Failed to resume campaign'
        }, { status: 500 })
    }
}
