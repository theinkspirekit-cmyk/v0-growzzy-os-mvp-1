import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

/**
 * POST /api/creatives/generate
 * Generates conversion-focused ad creatives using OpenAI
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const {
            platform,
            objective,
            productName,
            targetAudience,
            keyBenefits,
            tone,
            campaignId
        } = body

        if (!productName || !targetAudience || !platform) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        if (!process.env.OPENAI_API_KEY) {
            // Mock response if API key is missing
            return NextResponse.json({
                success: true,
                data: getMockCreatives(platform, productName)
            })
        }

        const systemPrompt = `You are an elite direct-response copywriter for a top-tier marketing agency.
Your task is to generate high-converting ad copy for ${platform} Ads.
Focus on persuasion, psychology, and platform-specific best practices.

Platform Rules:
- Meta (Facebook/Instagram): Conversational, pattern-interrupt hooks, strong CTAs.
- Google Search: Keyword-rich, concise, benefit-driven.
- LinkedIn: Professional, industry-focused, value-driven.

Output Format: JSON with 'headlines' (array), 'primaryText' (array), 'descriptions' (array).`

        const userPrompt = `
        Product: ${productName}
        Objective: ${objective}
        Target Audience: ${targetAudience}
        Key Benefits: ${keyBenefits}
        Tone: ${tone || 'Professional yet persuasive'}
        
        Generate:
        - 5 Headlines (High CTR hooks)
        - 3 Primary Texts (Body copy)
        - 3 Link Descriptions (For feed ads)
        `

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

        const generatedData = JSON.parse(content)

        // Store the generation request/result in database if needed, 
        // or just return to UI for the user to select/edit before saving.

        // Return the generated creatives
        return NextResponse.json({
            success: true,
            data: generatedData,
            meta: {
                platform,
                predictedPerformance: 'High', // Placeholder for scoring model
                aiModel: 'gpt-4-turbo'
            }
        })

    } catch (error: any) {
        console.error('[Creative Generator] Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
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
            `Limited time offer`,
            `Free shipping on first order`
        ]
    }
}
