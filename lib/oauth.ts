// OAuth Configuration for Ad Platforms

export const OAUTH_CONFIG = {
    google: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        clientId: (process.env.GOOGLE_ADS_CLIENT_ID || ''),
        clientSecret: (process.env.GOOGLE_ADS_CLIENT_SECRET || ''),
        redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/google/callback`,
        scopes: [
            'https://www.googleapis.com/auth/adwords',
            'https://www.googleapis.com/auth/userinfo.email',
        ],
    },

    meta: {
        authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
        tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
        clientId: (process.env.META_APP_ID || ''),
        clientSecret: (process.env.META_APP_SECRET || ''),
        redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/meta/callback`,
        scopes: [
            'ads_management',
            'ads_read',
            'business_management',
            'pages_read_engagement',
            'leads_retrieval',
        ],
    },

    linkedin: {
        authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
        tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
        clientId: (process.env.LINKEDIN_CLIENT_ID || ''),
        clientSecret: (process.env.LINKEDIN_CLIENT_SECRET || ''),
        redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/linkedin/callback`,
        scopes: [
            'r_ads',
            'rw_ads',
            'r_ads_reporting',
            'r_organization_social',
            'w_organization_social',
        ],
    },
}

// Generate OAuth URL
export function getOAuthUrl(platform: 'google' | 'meta' | 'linkedin', state: string) {
    const config = OAUTH_CONFIG[platform]
    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        scope: config.scopes.join(' '),
        state,
        response_type: 'code',
        access_type: platform === 'google' ? 'offline' : undefined,
        prompt: platform === 'google' ? 'consent' : undefined,
    } as any)

    return `${config.authUrl}?${params.toString()}`
}

// Exchange code for tokens
export async function exchangeCodeForTokens(
    platform: 'google' | 'meta' | 'linkedin',
    code: string
) {
    const config = OAUTH_CONFIG[platform]

    const params = new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: config.redirectUri,
        grant_type: 'authorization_code',
    })

    const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    })

    if (!response.ok) {
        throw new Error(`Token exchange failed: ${await response.text()}`)
    }

    return await response.json()
}

// Refresh access token
export async function refreshAccessToken(
    platform: 'google' | 'meta' | 'linkedin',
    refreshToken: string
) {
    const config = OAUTH_CONFIG[platform]

    const params = new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
    })

    const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    })

    if (!response.ok) {
        throw new Error(`Token refresh failed: ${await response.text()}`)
    }

    return await response.json()
}
