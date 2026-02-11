import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { exchangeCodeForTokens } from '@/lib/oauth'

export const dynamic = 'force-dynamic'

export async function GET(
    request: NextRequest,
    { params }: { params: { platform: string } }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth?error=unauthorized`)
        }

        const { searchParams } = new URL(request.url)
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        if (error) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=${error}`
            )
        }

        if (!code) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=no_code`
            )
        }

        const platform = params.platform as 'google' | 'meta' | 'linkedin'

        // Exchange code for tokens
        const tokenData = await exchangeCodeForTokens(platform, code)

        // Get account info based on platform
        let accountId = ''
        let accountName = ''

        if (platform === 'google') {
            // Fetch Google Ads customer ID
            const accountInfo = await fetchGoogleAdsAccount(tokenData.access_token)
            accountId = accountInfo.customerId
            accountName = accountInfo.name
        } else if (platform === 'meta') {
            // Fetch Meta Ad Account
            const accountInfo = await fetchMetaAdAccount(tokenData.access_token)
            accountId = accountInfo.id
            accountName = accountInfo.name
        } else if (platform === 'linkedin') {
            // Fetch LinkedIn Ad Account
            const accountInfo = await fetchLinkedInAdAccount(tokenData.access_token)
            accountId = accountInfo.id
            accountName = accountInfo.name
        }

        // Store in database
        await prisma.platform.upsert({
            where: {
                userId_name_accountId: {
                    userId: session.user.id,
                    name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Ads`,
                    accountId,
                },
            },
            create: {
                userId: session.user.id,
                name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Ads`,
                accountId,
                accountName,
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token || null,
                expiresAt: tokenData.expires_in
                    ? new Date(Date.now() + tokenData.expires_in * 1000)
                    : null,
                isActive: true,
            },
            update: {
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token || null,
                expiresAt: tokenData.expires_in
                    ? new Date(Date.now() + tokenData.expires_in * 1000)
                    : null,
                isActive: true,
            },
        })

        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=connected`
        )
    } catch (error: any) {
        console.error(`[OAuth] ${params.platform} callback error:`, error)
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=${encodeURIComponent(error.message)}`
        )
    }
}

// ============================================
// Platform-specific account fetchers
// ============================================

async function fetchGoogleAdsAccount(accessToken: string) {
    // Using Google Ads API
    const response = await fetch(
        'https://googleads.googleapis.com/v15/customers:listAccessibleCustomers',
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
            },
        }
    )

    const data = await response.json()

    // Get first accessible customer
    if (data.resourceNames && data.resourceNames.length > 0) {
        const customerId = data.resourceNames[0].split('/')[1]

        // Fetch customer details
        const customerResponse = await fetch(
            `https://googleads.googleapis.com/v15/customers/${customerId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
                },
            }
        )

        const customerData = await customerResponse.json()

        return {
            customerId,
            name: customerData.descriptiveName || 'Google Ads Account',
        }
    }

    throw new Error('No accessible Google Ads accounts found')
}

async function fetchMetaAdAccount(accessToken: string) {
    // Get user's ad accounts
    const response = await fetch(
        `https://graph.facebook.com/v18.0/me/adaccounts?fields=id,name,account_status&access_token=${accessToken}`
    )

    const data = await response.json()

    if (data.data && data.data.length > 0) {
        const account = data.data[0]
        return {
            id: account.id.replace('act_', ''),
            name: account.name,
        }
    }

    throw new Error('No Meta Ad Accounts found')
}

async function fetchLinkedInAdAccount(accessToken: string) {
    // Get user's ad accounts
    const response = await fetch(
        'https://api.linkedin.com/v2/adAccountsV2?q=search&search.type.values[0]=BUSINESS&search.status.values[0]=ACTIVE',
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'LinkedIn-Version': '202401',
            },
        }
    )

    const data = await response.json()

    if (data.elements && data.elements.length > 0) {
        const account = data.elements[0]
        return {
            id: account.id.toString(),
            name: account.name || 'LinkedIn Ad Account',
        }
    }

    throw new Error('No LinkedIn Ad Accounts found')
}
