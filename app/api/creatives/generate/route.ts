import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'stub-key',
})

/**
 * POST /api/creatives/generate
 * Generates ad creatives (copy + optional image) using OpenAI and persists to DB
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 })
        }

        const body = await request.json()
        const {
            platform,
            objective,
            productName,
            targetAudience,
            keyBenefits,
            tone,
            campaignId,
            generateImage,
        } = body

        if (!productName || !targetAudience || !platform) {
            return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'productName, targetAudience, and platform are required' } }, { status: 400 })
        }

        // ---- Step 1: Generate ad copy ----
        let generatedCopy: any
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'stub-key') {
            generatedCopy = getMockCreatives(platform, productName)
        } else {
            const systemPrompt = `You are an elite direct-response copywriter.
Generate high-converting ad copy for ${platform} Ads.

Platform Best Practices:
- Meta (Facebook/Instagram): Conversational hooks, pattern-interrupt, strong CTAs. Max 125 chars headline.
- Google Search: Keyword-rich, concise, benefit-driven. Max 30 chars headline, 90 chars description.
- LinkedIn: Professional, industry-focused, value-driven. Max 150 chars headline.

Return JSON: {
  "headlines": ["string" x5],
  "primaryText": ["string" x3],
  "descriptions": ["string" x3],
  "suggestedCTA": "string",
  "performanceScore": number (0-100)
}`

            const userPrompt = `
Product: ${productName}
Objective: ${objective || 'conversions'}
Target Audience: ${targetAudience}
Key Benefits: ${keyBenefits || 'Not specified'}
Tone: ${tone || 'Professional yet persuasive'}

Generate 5 headlines, 3 primary texts, 3 descriptions, a CTA, and a predicted performance score.`

            const response = await openai.chat.completions.create({
                model: "gpt-4-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                response_format: { type: "json_object" },
                temperature: 0.8,
            })

            const content = response.choices[0]?.message?.content
            if (!content) throw new Error('Failed to generate creative content')
            generatedCopy = JSON.parse(content)
        }

        // ---- Step 2: Generate image (optional) ----
        let imageUrl: string | null = null
        if (generateImage && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'stub-key') {
            try {
                const imagePrompt = `Professional marketing ad image for: ${productName}. Style: clean, modern, high-contrast, suitable for ${platform} advertising. Target audience: ${targetAudience}. Photorealistic, premium feel.`
                const imageResponse = await openai.images.generate({
                    model: "dall-e-3",
                    prompt: imagePrompt,
                    n: 1,
                    size: "1024x1024",
                    quality: "standard",
                })
                imageUrl = imageResponse.data[0]?.url || null
            } catch (imgError: any) {
                console.warn('[Creative Generator] Image generation failed:', imgError.message)
                // Continue without image — don't fail the whole request
            }
        }

        // ---- Step 3: Persist the creative to the database ----
        const creative = await prisma.creative.create({
            data: {
                userId: session.user.id,
                name: `${productName} - ${platform} Ad`,
                type: 'image',
                format: platform === 'google' ? 'search' : 'feed',
                headline: generatedCopy.headlines?.[0] || `${productName} Ad`,
                bodyText: generatedCopy.primaryText?.[0] || '',
                ctaText: generatedCopy.suggestedCTA || 'Learn More',
                imageUrl,
                campaignId: campaignId || null,
                aiGenerated: true,
                aiScore: generatedCopy.performanceScore || 78,
                aiPrompt: JSON.stringify({ platform, objective, productName, targetAudience, keyBenefits, tone }),
                status: 'draft',
            },
        })

        return NextResponse.json({
            ok: true,
            data: {
                creative,
                generatedCopy,
                imageUrl,
                meta: {
                    platform,
                    predictedPerformance: generatedCopy.performanceScore || 78,
                    aiModel: 'gpt-4-turbo',
                    imageModel: imageUrl ? 'dall-e-3' : null,
                },
            },
        })
    } catch (error: any) {
        console.error('[Creative Generator] Error:', error)
        return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
    }
}

function getMockCreatives(platform: string, product: string) {
    return {
        headlines: [
            `Stop Wasting Time on ${product}`,
            `The #1 Secret to Better ${product}`,
            `Get ${product} Results in 30 Days`,
            `Why Experts Love ${product}`,
            `Transform Your Workflow with ${product}`
        ],
        primaryText: [
            `Tired of struggling with ${product}? We have the solution. Trusted by 10,000+ users.`,
            `Unlock the full potential of your business with ${product}. Try it risk-free today.`,
            `Discover why ${product} is the top-rated solution for professionals.`
        ],
        descriptions: [
            `Join 10,000+ happy customers`,
            `Limited time offer — get 30% off`,
            `Free shipping on your first order`
        ],
        suggestedCTA: 'Get Started Free',
        performanceScore: 82,
    }
}
