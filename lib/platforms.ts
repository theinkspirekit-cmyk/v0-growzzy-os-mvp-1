// Platform API Integration for creating campaigns and fetching analytics

import { prisma } from './prisma'
import { refreshAccessToken } from './oauth'

// ============================================
// GOOGLE ADS API
// ============================================

export async function createGoogleAdsCampaign(platformId: string, campaignData: any) {
    const platform = await prisma.platform.findUnique({ where: { id: platformId } })
    if (!platform) throw new Error('Platform not found')

    const accessToken = await ensureValidToken(platform)

    const response = await fetch(
        `https://googleads.googleapis.com/v15/customers/${platform.accountId}/campaigns:mutate`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operations: [
                    {
                        create: {
                            name: campaignData.name,
                            advertisingChannelType: 'SEARCH',
                            status: campaignData.status === 'active' ? 'ENABLED' : 'PAUSED',
                            biddingStrategyType: 'TARGET_CPA',
                            campaignBudget: {
                                amountMicros: (campaignData.dailyBudget || 50) * 1000000,
                                deliveryMethod: 'STANDARD',
                            },
                        },
                    },
                ],
            }),
        }
    )

    const result = await response.json()
    if (result.error) throw new Error(result.error.message)

    return {
        externalId: result.results[0].resourceName.split('/')[3],
        platform: 'Google Ads',
    }
}

export async function fetchGoogleAdsAnalytics(platformId: string, startDate: string, endDate: string) {
    const platform = await prisma.platform.findUnique({ where: { id: platformId } })
    if (!platform) throw new Error('Platform not found')

    const accessToken = await ensureValidToken(platform)

    const query = `
    SELECT
      campaign.id,
      campaign.name,
      metrics.impressions,
      metrics.clicks,
      metrics.conversions,
      metrics.cost_micros,
      metrics.conversions_value,
      segments.date
    FROM campaign
    WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
  `

    const response = await fetch(
        `https://googleads.googleapis.com/v15/customers/${platform.accountId}/googleAds:searchStream`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        }
    )

    const data = await response.json()
    return parseGoogleAdsData(data)
}

// ============================================
// META ADS API
// ============================================

export async function createMetaAdsCampaign(platformId: string, campaignData: any) {
    const platform = await prisma.platform.findUnique({ where: { id: platformId } })
    if (!platform) throw new Error('Platform not found')

    const accessToken = await ensureValidToken(platform)

    const response = await fetch(
        `https://graph.facebook.com/v18.0/act_${platform.accountId}/campaigns`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: campaignData.name,
                objective: campaignData.objective || 'OUTCOME_LEADS',
                status: campaignData.status === 'active' ? 'ACTIVE' : 'PAUSED',
                daily_budget: (campaignData.dailyBudget || 50) * 100, // cents
                access_token: accessToken,
            }),
        }
    )

    const result = await response.json()
    if (result.error) throw new Error(result.error.message)

    return {
        externalId: result.id,
        platform: 'Meta Ads',
    }
}

export async function fetchMetaAdsAnalytics(platformId: string, startDate: string, endDate: string) {
    const platform = await prisma.platform.findUnique({ where: { id: platformId } })
    if (!platform) throw new Error('Platform not found')

    const accessToken = await ensureValidToken(platform)

    const response = await fetch(
        `https://graph.facebook.com/v18.0/act_${platform.accountId}/insights?` +
        new URLSearchParams({
            time_range: JSON.stringify({ since: startDate, until: endDate }),
            fields: 'impressions,clicks,spend,conversions,revenue,ctr,cpc',
            level: 'account',
            access_token: accessToken,
        })
    )

    const data = await response.json()
    return parseMetaAdsData(data)
}

// ============================================
// LINKEDIN ADS API
// ============================================

export async function createLinkedInAdsCampaign(platformId: string, campaignData: any) {
    const platform = await prisma.platform.findUnique({ where: { id: platformId } })
    if (!platform) throw new Error('Platform not found')

    const accessToken = await ensureValidToken(platform)

    const response = await fetch('https://api.linkedin.com/v2/adCampaignsV2', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'LinkedIn-Version': '202401',
        },
        body: JSON.stringify({
            account: `urn:li:sponsoredAccount:${platform.accountId}`,
            name: campaignData.name,
            type: 'SPONSORED_UPDATES',
            costType: 'CPM',
            dailyBudget: {
                amount: (campaignData.dailyBudget || 50).toString(),
                currencyCode: 'USD',
            },
            status: campaignData.status === 'active' ? 'ACTIVE' : 'PAUSED',
        }),
    })

    const result = await response.json()
    if (result.status >= 400) throw new Error(result.message)

    return {
        externalId: result.id,
        platform: 'LinkedIn Ads',
    }
}

export async function fetchLinkedInAdsAnalytics(platformId: string, startDate: string, endDate: string) {
    const platform = await prisma.platform.findUnique({ where: { id: platformId } })
    if (!platform) throw new Error('Platform not found')

    const accessToken = await ensureValidToken(platform)

    const response = await fetch(
        `https://api.linkedin.com/v2/adAnalyticsV2?` +
        new URLSearchParams({
            q: 'analytics',
            'pivot': 'ACCOUNT',
            'dateRange.start.day': startDate.split('-')[2],
            'dateRange.start.month': startDate.split('-')[1],
            'dateRange.start.year': startDate.split('-')[0],
            'dateRange.end.day': endDate.split('-')[2],
            'dateRange.end.month': endDate.split('-')[1],
            'dateRange.end.year': endDate.split('-')[0],
            fields: 'impressions,clicks,costInLocalCurrency,conversions',
        }),
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'LinkedIn-Version': '202401',
            },
        }
    )

    const data = await response.json()
    return parseLinkedInAdsData(data)
}

// ============================================
// CAMPAIGN CONTROL - PAUSE/RESUME
// ============================================

export async function pauseGoogleAdsCampaign(platformId: string, externalId: string) {
    const platform = await prisma.platform.findUnique({ where: { id: platformId } })
    if (!platform) throw new Error('Platform not found')

    const accessToken = await ensureValidToken(platform)

    const response = await fetch(
        `https://googleads.googleapis.com/v15/customers/${platform.accountId}/campaigns:mutate`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operations: [{
                    update: {
                        resourceName: `customers/${platform.accountId}/campaigns/${externalId}`,
                        status: 'PAUSED',
                    },
                    updateMask: 'status',
                }],
            }),
        }
    )

    const result = await response.json()
    if (result.error) throw new Error(result.error.message)
    return { success: true, platform: 'Google Ads' }
}

export async function resumeGoogleAdsCampaign(platformId: string, externalId: string) {
    const platform = await prisma.platform.findUnique({ where: { id: platformId } })
    if (!platform) throw new Error('Platform not found')

    const accessToken = await ensureValidToken(platform)

    const response = await fetch(
        `https://googleads.googleapis.com/v15/customers/${platform.accountId}/campaigns:mutate`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operations: [{
                    update: {
                        resourceName: `customers/${platform.accountId}/campaigns/${externalId}`,
                        status: 'ENABLED',
                    },
                    updateMask: 'status',
                }],
            }),
        }
    )

    const result = await response.json()
    if (result.error) throw new Error(result.error.message)
    return { success: true, platform: 'Google Ads' }
}

export async function pauseMetaAdsCampaign(platformId: string, externalId: string) {
    const platform = await prisma.platform.findUnique({ where: { id: platformId } })
    if (!platform) throw new Error('Platform not found')

    const accessToken = await ensureValidToken(platform)

    const response = await fetch(
        `https://graph.facebook.com/v18.0/${externalId}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'PAUSED',
                access_token: accessToken,
            }),
        }
    )

    const result = await response.json()
    if (result.error) throw new Error(result.error.message)
    return { success: true, platform: 'Meta Ads' }
}

export async function resumeMetaAdsCampaign(platformId: string, externalId: string) {
    const platform = await prisma.platform.findUnique({ where: { id: platformId } })
    if (!platform) throw new Error('Platform not found')

    const accessToken = await ensureValidToken(platform)

    const response = await fetch(
        `https://graph.facebook.com/v18.0/${externalId}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'ACTIVE',
                access_token: accessToken,
            }),
        }
    )

    const result = await response.json()
    if (result.error) throw new Error(result.error.message)
    return { success: true, platform: 'Meta Ads' }
}

export async function pauseLinkedInAdsCampaign(platformId: string, externalId: string) {
    const platform = await prisma.platform.findUnique({ where: { id: platformId } })
    if (!platform) throw new Error('Platform not found')

    const accessToken = await ensureValidToken(platform)

    const response = await fetch(
        `https://api.linkedin.com/v2/adCampaignsV2/${externalId}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'LinkedIn-Version': '202401',
            },
            body: JSON.stringify({
                patch: {
                    $set: {
                        status: 'PAUSED',
                    },
                },
            }),
        }
    )

    const result = await response.json()
    if (result.status >= 400) throw new Error(result.message)
    return { success: true, platform: 'LinkedIn Ads' }
}

export async function resumeLinkedInAdsCampaign(platformId: string, externalId: string) {
    const platform = await prisma.platform.findUnique({ where: { id: platformId } })
    if (!platform) throw new Error('Platform not found')

    const accessToken = await ensureValidToken(platform)

    const response = await fetch(
        `https://api.linkedin.com/v2/adCampaignsV2/${externalId}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'LinkedIn-Version': '202401',
            },
            body: JSON.stringify({
                patch: {
                    $set: {
                        status: 'ACTIVE',
                    },
                },
            }),
        }
    )

    const result = await response.json()
    if (result.status >= 400) throw new Error(result.message)
    return { success: true, platform: 'LinkedIn Ads' }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

async function ensureValidToken(platform: any) {
    // Check if token is expired
    if (platform.expiresAt && new Date(platform.expiresAt) < new Date()) {
        const platformName = platform.name.toLowerCase().split(' ')[0] as 'google' | 'meta' | 'linkedin'
        const newTokens = await refreshAccessToken(platformName, platform.refreshToken)

        await prisma.platform.update({
            where: { id: platform.id },
            data: {
                accessToken: newTokens.access_token,
                expiresAt: newTokens.expires_in
                    ? new Date(Date.now() + newTokens.expires_in * 1000)
                    : null,
            },
        })

        return newTokens.access_token
    }

    return platform.accessToken
}

function parseGoogleAdsData(data: any) {
    // Parse Google Ads response
    const rows = data.results || []
    return rows.map((row: any) => ({
        date: row.segments?.date,
        impressions: parseInt(row.metrics?.impressions || '0'),
        clicks: parseInt(row.metrics?.clicks || '0'),
        conversions: parseFloat(row.metrics?.conversions || '0'),
        spend: parseFloat(row.metrics?.costMicros || '0') / 1000000,
        revenue: parseFloat(row.metrics?.conversionsValue || '0'),
    }))
}

function parseMetaAdsData(data: any) {
    const insights = data.data || []
    return insights.map((insight: any) => ({
        date: insight.date_start,
        impressions: parseInt(insight.impressions || '0'),
        clicks: parseInt(insight.clicks || '0'),
        conversions: parseFloat(insight.conversions || '0'),
        spend: parseFloat(insight.spend || '0'),
        revenue: parseFloat(insight.revenue || '0'),
    }))
}

function parseLinkedInAdsData(data: any) {
    const elements = data.elements || []
    return elements.map((el: any) => ({
        date: el.dateRange?.start,
        impressions: parseInt(el.impressions || 0),
        clicks: parseInt(el.clicks || 0),
        conversions: parseFloat(el.conversions || 0),
        spend: parseFloat(el.costInLocalCurrency || 0),
        revenue: 0, // LinkedIn doesn't provide revenue directly
    }))
}
