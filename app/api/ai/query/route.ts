import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'stub-key' })

/**
 * POST /api/ai/query
 * AI Copilot — accepts natural language, returns structured response with optional actions
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 })
        }

        const body = await request.json()
        const { prompt, conversationId, context } = body

        if (!prompt) {
            return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Prompt is required' } }, { status: 400 })
        }

        // ---- Gather context from the database ----
        const [campaigns, recentLeads, automations] = await Promise.all([
            prisma.campaign.findMany({
                where: { userId: session.user.id },
                select: { id: true, name: true, status: true, totalSpend: true, totalRevenue: true, roas: true, dailyBudget: true, platformId: true },
                take: 20,
                orderBy: { updatedAt: 'desc' },
            }),
            prisma.lead.findMany({
                where: { userId: session.user.id },
                select: { id: true, name: true, status: true, source: true, aiScore: true, estimatedValue: true },
                take: 10,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.automation.findMany({
                where: { userId: session.user.id },
                select: { id: true, name: true, isActive: true, triggerType: true, actionType: true, runCount: true },
                take: 10,
            }),
        ])

        // ---- Build system prompt with real data context ----
        const systemPrompt = `You are the AI Copilot for Growzzy OS, an enterprise marketing automation platform.
You have access to the user's real data (provided below). Be concise, actionable, and data-driven.

USER DATA CONTEXT:
- Active Campaigns: ${JSON.stringify(campaigns)}
- Recent Leads: ${JSON.stringify(recentLeads)}
- Automations: ${JSON.stringify(automations)}

CAPABILITIES (actions you can suggest):
- pause_campaign: {campaignId} — Pause a specific campaign
- resume_campaign: {campaignId} — Resume a paused campaign
- create_report: {type, dateRange} — Generate a report
- generate_creative: {platform, productName} — Generate ad creative
- run_automation: {automationId} — Manually trigger an automation
- score_leads: {} — Re-score all leads with AI
- adjust_budget: {campaignId, newBudget} — Change campaign budget

RESPONSE FORMAT (strict JSON):
{
  "type": "insight" | "action" | "analysis" | "question",
  "answer": "Your detailed response text",
  "dataPoints": [{"label": "string", "value": "string", "trend": "up"|"down"|"neutral"}],
  "actions": [{"id": "string", "type": "pause_campaign|resume_campaign|create_report|generate_creative|run_automation|score_leads|adjust_budget", "label": "Human readable label", "params": {}, "risk": "low"|"medium"|"high"}],
  "confidence": 0.0-1.0,
  "sources": ["description of data sources used"]
}

Always return valid JSON. If no actions are needed, return empty actions array.
If the user asks something you can't answer with the data, say so clearly.`

        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'stub-key') {
            // Mock response when no API key
            return NextResponse.json({
                ok: true,
                data: getMockCopilotResponse(prompt, campaigns, recentLeads),
            })
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                ...(context?.messages || []),
                { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.4,
            max_tokens: 2000,
        })

        const content = completion.choices[0]?.message?.content
        if (!content) throw new Error('Failed to get AI response')

        const parsed = JSON.parse(content)

        // Save conversation
        if (conversationId) {
            const existing = await prisma.conversation.findUnique({ where: { id: conversationId } })
            if (existing) {
                const messages = (existing.messages as any[]) || []
                messages.push({ role: 'user', content: prompt })
                messages.push({ role: 'assistant', content: parsed.answer, actions: parsed.actions })
                await prisma.conversation.update({
                    where: { id: conversationId },
                    data: { messages, updatedAt: new Date() },
                })
            }
        } else {
            await prisma.conversation.create({
                data: {
                    userId: session.user.id,
                    title: prompt.substring(0, 80),
                    messages: [
                        { role: 'user', content: prompt },
                        { role: 'assistant', content: parsed.answer, actions: parsed.actions },
                    ],
                },
            })
        }

        return NextResponse.json({ ok: true, data: parsed })
    } catch (error: any) {
        console.error('[AI Copilot] Error:', error)
        return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
    }
}

function getMockCopilotResponse(prompt: string, campaigns: any[], leads: any[]) {
    const lowerPrompt = prompt.toLowerCase()

    if (lowerPrompt.includes('roas') || lowerPrompt.includes('performance')) {
        return {
            type: 'analysis',
            answer: `Based on your ${campaigns.length} active campaigns, here's a performance summary:\n\n${campaigns.slice(0, 3).map(c => `• **${c.name}**: ROAS ${c.roas || 'N/A'}x, Spend $${c.totalSpend?.toLocaleString() || '0'}`).join('\n')}\n\nOverall portfolio is performing ${campaigns.some(c => (c.roas || 0) > 3) ? 'above' : 'below'} benchmark. Consider reallocating budget from underperforming campaigns.`,
            dataPoints: campaigns.slice(0, 3).map(c => ({
                label: c.name,
                value: `${c.roas || 0}x ROAS`,
                trend: (c.roas || 0) > 2 ? 'up' : 'down',
            })),
            actions: campaigns.filter(c => (c.roas || 0) < 1.5 && c.status === 'active').map(c => ({
                id: `pause_${c.id}`,
                type: 'pause_campaign',
                label: `Pause "${c.name}" (ROAS: ${c.roas || 0}x)`,
                params: { campaignId: c.id },
                risk: 'medium',
            })),
            confidence: 0.85,
            sources: ['Campaign performance data', 'ROAS calculations'],
        }
    }

    if (lowerPrompt.includes('pause') || lowerPrompt.includes('stop')) {
        const activeCampaigns = campaigns.filter(c => c.status === 'active')
        return {
            type: 'action',
            answer: `I found ${activeCampaigns.length} active campaigns. Which would you like to pause? I've suggested the lowest-performing ones below.`,
            dataPoints: activeCampaigns.map(c => ({ label: c.name, value: c.status, trend: 'neutral' })),
            actions: activeCampaigns.slice(0, 3).map(c => ({
                id: `pause_${c.id}`,
                type: 'pause_campaign',
                label: `Pause "${c.name}"`,
                params: { campaignId: c.id },
                risk: 'medium',
            })),
            confidence: 0.9,
            sources: ['Active campaigns list'],
        }
    }

    if (lowerPrompt.includes('lead') || lowerPrompt.includes('score')) {
        return {
            type: 'insight',
            answer: `You have ${leads.length} recent leads. Top-scoring leads:\n\n${leads.filter(l => l.aiScore && l.aiScore > 70).slice(0, 3).map(l => `• **${l.name}** — Score: ${l.aiScore}, Value: $${l.estimatedValue?.toLocaleString() || '0'}`).join('\n') || 'No high-score leads found yet.'}\n\nI recommend re-scoring all leads to update their AI scores based on latest engagement data.`,
            dataPoints: leads.slice(0, 5).map(l => ({ label: l.name, value: `Score: ${l.aiScore || 'Unscored'}`, trend: (l.aiScore || 0) > 70 ? 'up' : 'neutral' })),
            actions: [{ id: 'rescore', type: 'score_leads', label: 'Re-score all leads with AI', params: {}, risk: 'low' }],
            confidence: 0.8,
            sources: ['Lead database', 'AI scoring model'],
        }
    }

    return {
        type: 'insight',
        answer: `I'm the Growzzy OS Copilot. I can help you analyze campaigns, manage leads, generate creatives, and automate workflows. Here's a quick summary:\n\n• **${campaigns.length}** campaigns tracked\n• **${leads.length}** recent leads\n• Ask me anything about your marketing performance!`,
        dataPoints: [
            { label: 'Active Campaigns', value: campaigns.filter(c => c.status === 'active').length.toString(), trend: 'neutral' },
            { label: 'Total Leads', value: leads.length.toString(), trend: 'up' },
        ],
        actions: [],
        confidence: 0.95,
        sources: ['Platform overview'],
    }
}
