import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/analytics/dashboard
 * Returns real aggregated analytics data for the dashboard
 * Includes: KPIs, period comparisons, platform breakdown
 */
export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const period = searchParams.get('period') || '30' // days
        const periodDays = parseInt(period)

        const userId = session.user.id

        // Calculate date ranges
        const now = new Date()
        const currentPeriodStart = new Date(now)
        currentPeriodStart.setDate(now.getDate() - periodDays)

        const previousPeriodStart = new Date(currentPeriodStart)
        previousPeriodStart.setDate(currentPeriodStart.getDate() - periodDays)

        // Fetch analytics data for current period
        const currentAnalytics = await prisma.analytics.findMany({
            where: {
                platform: {
                    userId: userId
                },
                metricDate: {
                    gte: currentPeriodStart,
                    lte: now
                }
            }
        })

        // Fetch analytics data for previous period  
        const previousAnalytics = await prisma.analytics.findMany({
            where: {
                platform: {
                    userId: userId
                },
                metricDate: {
                    gte: previousPeriodStart,
                    lt: currentPeriodStart
                }
            }
        })

        // Fetch campaigns
        const campaigns = await prisma.campaign.findMany({
            where: { userId },
            include: {
                platform: {
                    select: { name: true }
                }
            }
        })

        // Fetch leads
        const leads = await prisma.lead.findMany({
            where: {
                userId,
                createdAt: {
                    gte: currentPeriodStart
                }
            }
        })

        const previousLeads = await prisma.lead.findMany({
            where: {
                userId,
                createdAt: {
                    gte: previousPeriodStart,
                    lt: currentPeriodStart
                }
            }
        })

        // Calculate current period metrics
        const currentMetrics = calculateMetrics(currentAnalytics)
        const previousMetrics = calculateMetrics(previousAnalytics)

        // Calculate percentage changes
        const changes = {
            revenue: calculateChange(currentMetrics.revenue, previousMetrics.revenue),
            spend: calculateChange(currentMetrics.spend, previousMetrics.spend),
            roas: calculateChange(currentMetrics.roas, previousMetrics.roas),
            leads: calculateChange(leads.length, previousLeads.length),
            conversionRate: calculateChange(currentMetrics.conversionRate, previousMetrics.conversionRate),
            cpc: calculateChange(currentMetrics.cpc, previousMetrics.cpc),
        }

        // Platform breakdown
        const platformBreakdown = calculatePlatformBreakdown(currentAnalytics)

        // Active campaigns
        const activeCampaigns = campaigns.filter(c => c.status === 'active').length
        const totalCampaigns = campaigns.length

        // Lead statistics
        const convertedLeads = leads.filter(l => l.status === 'won').length
        const leadConversionRate = leads.length > 0 ? (convertedLeads / leads.length) * 100 : 0

        // Response
        return NextResponse.json({
            success: true,
            data: {
                kpis: {
                    revenue: {
                        value: currentMetrics.revenue,
                        change: changes.revenue,
                        formatted: formatCurrency(currentMetrics.revenue)
                    },
                    spend: {
                        value: currentMetrics.spend,
                        change: changes.spend,
                        formatted: formatCurrency(currentMetrics.spend)
                    },
                    roas: {
                        value: currentMetrics.roas,
                        change: changes.roas,
                        formatted: currentMetrics.roas.toFixed(2) + 'x'
                    },
                    leads: {
                        value: leads.length,
                        change: changes.leads,
                        formatted: leads.length.toString()
                    },
                    conversionRate: {
                        value: currentMetrics.conversionRate,
                        change: changes.conversionRate,
                        formatted: currentMetrics.conversionRate.toFixed(2) + '%'
                    },
                    cpc: {
                        value: currentMetrics.cpc,
                        change: changes.cpc,
                        formatted: formatCurrency(currentMetrics.cpc)
                    }
                },
                campaigns: {
                    active: activeCampaigns,
                    total: totalCampaigns,
                    paused: campaigns.filter(c => c.status === 'paused').length,
                    draft: campaigns.filter(c => c.status === 'draft').length
                },
                leads: {
                    total: leads.length,
                    converted: convertedLeads,
                    conversionRate: leadConversionRate,
                    new: leads.filter(l => l.status === 'new').length,
                    contacted: leads.filter(l => l.status === 'contacted').length,
                    qualified: leads.filter(l => l.status === 'qualified').length
                },
                platformBreakdown,
                period: {
                    days: periodDays,
                    start: currentPeriodStart.toISOString(),
                    end: now.toISOString()
                }
            }
        })
    } catch (error: any) {
        console.error('[Dashboard API] Error:', error)
        return NextResponse.json({
            error: error.message || 'Failed to fetch dashboard data'
        }, { status: 500 })
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function calculateMetrics(analytics: any[]) {
    const totalSpend = analytics.reduce((sum, a) => sum + a.spend, 0)
    const totalRevenue = analytics.reduce((sum, a) => sum + a.revenue, 0)
    const totalClicks = analytics.reduce((sum, a) => sum + a.clicks, 0)
    const totalConversions = analytics.reduce((sum, a) => sum + a.conversions, 0)
    const totalImpressions = analytics.reduce((sum, a) => sum + a.impressions, 0)

    return {
        spend: totalSpend,
        revenue: totalRevenue,
        roas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
        clicks: totalClicks,
        conversions: totalConversions,
        impressions: totalImpressions,
        cpc: totalClicks > 0 ? totalSpend / totalClicks : 0,
        conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
    }
}

function calculateChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
}

function calculatePlatformBreakdown(analytics: any[]) {
    const platforms = new Map()

    analytics.forEach(a => {
        if (!a.platformId) return

        if (!platforms.has(a.platformId)) {
            platforms.set(a.platformId, {
                spend: 0,
                revenue: 0,
                clicks: 0,
                conversions: 0,
                impressions: 0
            })
        }

        const platform = platforms.get(a.platformId)
        platform.spend += a.spend
        platform.revenue += a.revenue
        platform.clicks += a.clicks
        platform.conversions += a.conversions
        platform.impressions += a.impressions
    })

    return Array.from(platforms.entries()).map(([platformId, metrics]) => ({
        platformId,
        ...metrics,
        roas: metrics.spend > 0 ? metrics.revenue / metrics.spend : 0,
        cpc: metrics.clicks > 0 ? metrics.spend / metrics.clicks : 0
    }))
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount)
}
