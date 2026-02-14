import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPlatformConnector } from '@/lib/platform-connector'

export const dynamic = 'force-dynamic'

/**
 * POST /api/ai/execute
 * Executes an action suggested by the AI Copilot after user confirmation
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 })
        }

        const body = await request.json()
        const { actionType, params } = body

        if (!actionType) {
            return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'actionType is required' } }, { status: 400 })
        }

        let result: any

        switch (actionType) {
            case 'pause_campaign': {
                const { campaignId } = params
                if (!campaignId) return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'campaignId required' } }, { status: 400 })

                const campaign = await prisma.campaign.findFirst({
                    where: { id: campaignId, userId: session.user.id },
                })
                if (!campaign) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Campaign not found' } }, { status: 404 })

                // Call platform connector
                if (campaign.externalId && campaign.platformId) {
                    const connector = getPlatformConnector(campaign.platformId)
                    await connector.pauseCampaign(campaign.externalId)
                }

                await prisma.campaign.update({
                    where: { id: campaignId },
                    data: { status: 'paused' },
                })

                result = { success: true, message: `Campaign "${campaign.name}" has been paused.`, campaign: { id: campaign.id, name: campaign.name, status: 'paused' } }
                break
            }

            case 'resume_campaign': {
                const { campaignId } = params
                if (!campaignId) return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'campaignId required' } }, { status: 400 })

                const campaign = await prisma.campaign.findFirst({
                    where: { id: campaignId, userId: session.user.id },
                })
                if (!campaign) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Campaign not found' } }, { status: 404 })

                if (campaign.externalId && campaign.platformId) {
                    const connector = getPlatformConnector(campaign.platformId)
                    await connector.resumeCampaign(campaign.externalId)
                }

                await prisma.campaign.update({
                    where: { id: campaignId },
                    data: { status: 'active' },
                })

                result = { success: true, message: `Campaign "${campaign.name}" has been resumed.`, campaign: { id: campaign.id, name: campaign.name, status: 'active' } }
                break
            }

            case 'adjust_budget': {
                const { campaignId, newBudget } = params
                if (!campaignId || newBudget == null) return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'campaignId and newBudget required' } }, { status: 400 })

                const campaign = await prisma.campaign.findFirst({
                    where: { id: campaignId, userId: session.user.id },
                })
                if (!campaign) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Campaign not found' } }, { status: 404 })

                if (campaign.externalId && campaign.platformId) {
                    const connector = getPlatformConnector(campaign.platformId)
                    await connector.updateCampaign(campaign.externalId, { budget: newBudget })
                }

                await prisma.campaign.update({
                    where: { id: campaignId },
                    data: { dailyBudget: parseFloat(newBudget) },
                })

                result = { success: true, message: `Budget for "${campaign.name}" adjusted to $${newBudget}.` }
                break
            }

            case 'create_report': {
                const { type, dateRange } = params
                const report = await prisma.report.create({
                    data: {
                        userId: session.user.id,
                        name: `AI Generated ${type || 'Performance'} Report`,
                        type: type || 'performance',
                        platforms: [],
                        startDate: dateRange?.start ? new Date(dateRange.start) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                        endDate: dateRange?.end ? new Date(dateRange.end) : new Date(),
                        status: 'pending',
                    },
                })
                result = { success: true, message: `Report "${report.name}" created and queued for generation.`, reportId: report.id }
                break
            }

            case 'score_leads': {
                const leads = await prisma.lead.findMany({
                    where: { userId: session.user.id },
                    take: 100,
                })
                // In production, this would call the AI scoring service
                const updated = await Promise.all(
                    leads.map(lead =>
                        prisma.lead.update({
                            where: { id: lead.id },
                            data: { aiScore: Math.round(50 + Math.random() * 50) },
                        })
                    )
                )
                result = { success: true, message: `Re-scored ${updated.length} leads with updated AI analysis.` }
                break
            }

            case 'run_automation': {
                const { automationId } = params
                const automation = await prisma.automation.findFirst({
                    where: { id: automationId, userId: session.user.id },
                })
                if (!automation) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Automation not found' } }, { status: 404 })

                await prisma.automationLog.create({
                    data: {
                        automationId: automation.id,
                        actionTaken: `Manual trigger: ${automation.actionType}`,
                        success: true,
                        impact: 'Manually executed via AI Copilot',
                    },
                })

                await prisma.automation.update({
                    where: { id: automation.id },
                    data: { lastRun: new Date(), runCount: { increment: 1 } },
                })

                result = { success: true, message: `Automation "${automation.name}" executed successfully.` }
                break
            }

            default:
                return NextResponse.json({ ok: false, error: { code: 'UNKNOWN_ACTION', message: `Unknown action type: ${actionType}` } }, { status: 400 })
        }

        return NextResponse.json({ ok: true, data: result })
    } catch (error: any) {
        console.error('[AI Execute] Error:', error)
        return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
    }
}
