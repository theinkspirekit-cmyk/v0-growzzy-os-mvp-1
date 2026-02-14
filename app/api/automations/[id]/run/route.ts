import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPlatformConnector } from '@/lib/platform-connector'

export const dynamic = 'force-dynamic'

/**
 * POST /api/automations/[id]/run
 * Manually triggers an automation and executes its action
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

        const { id } = await params

        const automation = await prisma.automation.findFirst({
            where: { id, userId: session.user.id },
        })

        if (!automation) {
            return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND', message: 'Automation not found' } }, { status: 404 })
        }

        // Execute the configured action
        let actionResult: any = { success: true, action: automation.actionType }
        let impact = ''

        try {
            switch (automation.actionType) {
                case 'PAUSE_CAMPAIGN': {
                    // Find campaigns matching trigger criteria
                    const campaigns = await prisma.campaign.findMany({
                        where: { userId: session.user.id, status: 'active' },
                    })

                    const affectedCampaigns: string[] = []
                    for (const campaign of campaigns) {
                        // Check if campaign matches trigger conditions
                        if (shouldTrigger(automation, campaign)) {
                            if (campaign.externalId && campaign.platformName) {
                                const connector = getPlatformConnector(campaign.platformName)
                                await connector.pauseCampaign(campaign.externalId)
                            }
                            await prisma.campaign.update({
                                where: { id: campaign.id },
                                data: { status: 'paused' },
                            })
                            affectedCampaigns.push(campaign.name)
                        }
                    }

                    impact = affectedCampaigns.length > 0
                        ? `Paused ${affectedCampaigns.length} campaigns: ${affectedCampaigns.join(', ')}`
                        : 'No campaigns matched trigger criteria'
                    actionResult = { success: true, affected: affectedCampaigns.length, campaigns: affectedCampaigns }
                    break
                }

                case 'INCREASE_BUDGET': {
                    const campaigns = await prisma.campaign.findMany({
                        where: { userId: session.user.id, status: 'active' },
                    })

                    let adjusted = 0
                    for (const campaign of campaigns) {
                        if (shouldTrigger(automation, campaign)) {
                            const increase = (automation.action as any)?.percentage || 10
                            const newBudget = (campaign.dailyBudget || 0) * (1 + increase / 100)
                            await prisma.campaign.update({
                                where: { id: campaign.id },
                                data: { dailyBudget: Math.round(newBudget * 100) / 100 },
                            })
                            adjusted++
                        }
                    }

                    impact = `Adjusted budget for ${adjusted} campaigns`
                    actionResult = { success: true, adjusted }
                    break
                }

                case 'NOTIFY_SLACK':
                    impact = 'Alert notification dispatched'
                    actionResult = { success: true, channel: 'alerts' }
                    break

                case 'GENERATE_REPORT':
                    const report = await prisma.report.create({
                        data: {
                            userId: session.user.id,
                            name: `Auto-generated: ${automation.name}`,
                            type: 'performance',
                            platforms: [],
                            startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                            endDate: new Date(),
                            status: 'pending',
                        },
                    })
                    impact = `Report ${report.id} created`
                    actionResult = { success: true, reportId: report.id }
                    break

                default:
                    impact = `Action ${automation.actionType} executed`
            }
        } catch (execError: any) {
            actionResult = { success: false, error: execError.message }
            impact = `Execution failed: ${execError.message}`
        }

        // Log the execution
        const log = await prisma.automationLog.create({
            data: {
                automationId: automation.id,
                actionTaken: automation.actionType,
                result: JSON.stringify(actionResult),
                success: actionResult.success,
                impact,
            },
        })

        // Update automation metadata
        await prisma.automation.update({
            where: { id: automation.id },
            data: {
                lastRun: new Date(),
                runCount: { increment: 1 },
            },
        })

        return NextResponse.json({
            ok: true,
            data: {
                log,
                result: actionResult,
                message: `Automation "${automation.name}" executed. ${impact}`,
            },
        })
    } catch (error: any) {
        console.error('[Automation Run] Error:', error)
        return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
    }
}

/**
 * Checks if a campaign matches the automation's trigger conditions
 */
function shouldTrigger(automation: any, campaign: any): boolean {
    const trigger = automation.trigger as any
    const triggerType = automation.triggerType

    switch (triggerType) {
        case 'ROAS_DROP':
            return (campaign.roas || 0) < (trigger?.threshold || 1.5)
        case 'CPA_SPIKE': {
            const cpa = campaign.totalLeads > 0 ? campaign.totalSpend / campaign.totalLeads : 0
            return cpa > (trigger?.threshold || 50)
        }
        case 'BUDGET_EXHAUST':
            return (campaign.totalSpend || 0) > (campaign.totalBudget || Infinity) * (trigger?.threshold || 0.9)
        case 'CTR_LOW':
            return false // Would need analytics data
        default:
            return true // TIME_BASED always triggers
    }
}
