/**
 * Platform Connector Interface
 * All platform adapters (Meta, Google, LinkedIn, TikTok, Shopify) implement this interface.
 * Mock implementations are provided for development/staging without real API keys.
 */

export interface PlatformMetrics {
    impressions: number
    clicks: number
    spend: number
    conversions: number
    revenue: number
    ctr: number
    cpc: number
    roas: number
}

export interface PlatformCampaignResult {
    success: boolean
    externalId?: string
    status?: string
    error?: string
}

export interface IPlatformConnector {
    readonly platform: string

    // Campaign lifecycle
    createCampaign(campaign: any): Promise<PlatformCampaignResult>
    updateCampaign(externalId: string, updates: any): Promise<PlatformCampaignResult>
    pauseCampaign(externalId: string): Promise<PlatformCampaignResult>
    resumeCampaign(externalId: string): Promise<PlatformCampaignResult>
    deleteCampaign(externalId: string): Promise<PlatformCampaignResult>

    // Creative publishing
    publishCreative(creative: any, campaignExternalId: string): Promise<PlatformCampaignResult>

    // Metrics ingestion
    fetchMetrics(externalId: string, dateRange: { start: Date; end: Date }): Promise<PlatformMetrics>
    getCampaigns(accountId: string): Promise<any[]>

    // Auth
    isConnected(): Promise<boolean>
    getAuthUrl(): string
    handleCallback(code: string): Promise<{ accessToken: string; refreshToken?: string }>
}

// ============================================================
// Mock Connector — used in development and when platform not connected
// ============================================================
export class MockPlatformConnector implements IPlatformConnector {
    constructor(public readonly platform: string) { }

    async createCampaign(campaign: any): Promise<PlatformCampaignResult> {
        console.log(`[MockConnector:${this.platform}] createCampaign`, campaign.name)
        return {
            success: true,
            externalId: `mock_${this.platform}_${Date.now()}`,
            status: 'active',
        }
    }

    async updateCampaign(externalId: string, updates: any): Promise<PlatformCampaignResult> {
        console.log(`[MockConnector:${this.platform}] updateCampaign`, externalId, updates)
        return { success: true, externalId }
    }

    async pauseCampaign(externalId: string): Promise<PlatformCampaignResult> {
        console.log(`[MockConnector:${this.platform}] pauseCampaign`, externalId)
        return { success: true, externalId, status: 'paused' }
    }

    async resumeCampaign(externalId: string): Promise<PlatformCampaignResult> {
        console.log(`[MockConnector:${this.platform}] resumeCampaign`, externalId)
        return { success: true, externalId, status: 'active' }
    }

    async deleteCampaign(externalId: string): Promise<PlatformCampaignResult> {
        console.log(`[MockConnector:${this.platform}] deleteCampaign`, externalId)
        return { success: true }
    }

    async publishCreative(creative: any, campaignExternalId: string): Promise<PlatformCampaignResult> {
        console.log(`[MockConnector:${this.platform}] publishCreative`, creative.id, '→', campaignExternalId)
        return { success: true, externalId: `mock_creative_${Date.now()}` }
    }

    async fetchMetrics(externalId: string, dateRange: { start: Date; end: Date }): Promise<PlatformMetrics> {
        // Generate realistic-looking mock metrics
        const days = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24)) || 1
        const impressions = Math.round(1000 + Math.random() * 50000 * days)
        const clicks = Math.round(impressions * (0.01 + Math.random() * 0.08))
        const spend = Math.round((100 + Math.random() * 2000) * days * 100) / 100
        const conversions = Math.round(clicks * (0.02 + Math.random() * 0.15))
        const revenue = Math.round(conversions * (20 + Math.random() * 200) * 100) / 100

        return {
            impressions,
            clicks,
            spend,
            conversions,
            revenue,
            ctr: Math.round((clicks / impressions) * 10000) / 100,
            cpc: Math.round((spend / (clicks || 1)) * 100) / 100,
            roas: Math.round((revenue / (spend || 1)) * 100) / 100,
        }
    }

    async getCampaigns(accountId: string): Promise<any[]> {
        console.log(`[MockConnector:${this.platform}] getCampaigns for ${accountId}`)
        // Return some dummy campaigns
        return [
            { id: `${this.platform}_cp_1`, name: `${this.platform.toUpperCase()} - Retargeting Q4`, status: 'active', spend: 4500.20, roas: 3.2, budget: 150.0 },
            { id: `${this.platform}_cp_2`, name: `${this.platform.toUpperCase()} - Awareness Brand`, status: 'active', spend: 1200.50, roas: 1.5, budget: 50.0 },
            { id: `${this.platform}_cp_3`, name: `${this.platform.toUpperCase()} - Conversion Lookalike`, status: 'paused', spend: 8900.00, roas: 0.8, budget: 300.0 },
        ]
    }

    async isConnected(): Promise<boolean> {
        return true // Mock is always "connected"
    }

    getAuthUrl(): string {
        return `/api/oauth/${this.platform}/connect?mock=true`
    }

    async handleCallback(code: string): Promise<{ accessToken: string; refreshToken?: string }> {
        return { accessToken: `mock_token_${this.platform}_${Date.now()}`, refreshToken: `mock_refresh_${Date.now()}` }
    }
}

// ============================================================
// Connector Factory — returns real connector if configured, mock otherwise
// ============================================================
const connectorCache = new Map<string, IPlatformConnector>()

export function getPlatformConnector(platform: string): IPlatformConnector {
    const key = platform.toLowerCase()
    if (connectorCache.has(key)) return connectorCache.get(key)!

    // TODO: Check for real API keys and return real connector
    // For now, always return mock connectors
    let connector: IPlatformConnector

    switch (key) {
        case 'meta':
        case 'facebook':
        case 'instagram':
            // if (process.env.META_APP_ID && process.env.META_APP_SECRET) {
            //   connector = new MetaAdsConnector()
            // } else {
            connector = new MockPlatformConnector('meta')
            // }
            break
        case 'google':
            connector = new MockPlatformConnector('google')
            break
        case 'linkedin':
            connector = new MockPlatformConnector('linkedin')
            break
        case 'tiktok':
            connector = new MockPlatformConnector('tiktok')
            break
        case 'shopify':
            connector = new MockPlatformConnector('shopify')
            break
        default:
            connector = new MockPlatformConnector(key)
    }

    connectorCache.set(key, connector)
    return connector
}
