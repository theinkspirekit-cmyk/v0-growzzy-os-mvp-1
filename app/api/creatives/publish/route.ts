import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * POST /api/creatives/publish
 * Save a generated creative to the database and associate with a campaign
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const {
            campaignId,
            headline,
            bodyText,
            description,
            platform,
            imageUrl
        } = body

        if (!campaignId || !headline) {
            return NextResponse.json({ error: 'Campaign ID and Headline required' }, { status: 400 })
        }

        // Verify campaign ownership
        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId }
        })

        if (!campaign || campaign.userId !== session.user.id) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
        }

        // Create Creative record
        const creative = await prisma.creative.create({
            data: {
                userId: session.user.id,
                campaignId,
                name: `${headline.substring(0, 30)}...`,
                type: 'text', // defaulting to text for now
                format: platform || 'feed',
                headline,
                bodyText,
                ctaText: 'Learn More', // Default CTA
                imageUrl,
                aiGenerated: true,
                status: 'active'
            }
        })

        // TODO: In a real implementation, we would also push this creative to the Ad Platform via API
        // similar to how we adjust budgets or pause campaigns.
        // For now, we just save to DB.

        return NextResponse.json({
            success: true,
            creative
        })

    } catch (error: any) {
        console.error('[Creative Publish] Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
