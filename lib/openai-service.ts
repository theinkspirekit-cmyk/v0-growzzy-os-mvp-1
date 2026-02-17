import OpenAI from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
})

// Tool definitions for function calling
const TOOLS = [
    {
        type: "function" as const,
        function: {
            name: "analyze_campaign_performance",
            description: "Analyze campaign performance data and provide insights",
            parameters: {
                type: "object",
                properties: {
                    metrics: {
                        type: "object",
                        description: "Campaign metrics to analyze",
                    },
                    timeframe: {
                        type: "string",
                        description: "Time period for analysis",
                    },
                },
            },
        },
    },
    {
        type: "function" as const,
        function: {
            name: "pause_campaigns",
            description: "Pause underperforming campaigns based on criteria",
            parameters: {
                type: "object",
                properties: {
                    criteria: {
                        type: "object",
                        description: "Criteria for pausing campaigns (e.g., ROAS < 1.0)",
                    },
                },
            },
        },
    },
    {
        type: "function" as const,
        function: {
            name: "adjust_campaign_budget",
            description: "Adjust budget for campaigns",
            parameters: {
                type: "object",
                properties: {
                    campaignId: { type: "string" },
                    adjustment: { type: "number", description: "Percentage to adjust" },
                },
            },
        },
    },
    {
        type: "function" as const,
        function: {
            name: "generate_report",
            description: "Generate a performance report",
            parameters: {
                type: "object",
                properties: {
                    type: { type: "string", enum: ["daily", "weekly", "monthly"] },
                    dateRange: { type: "object" },
                },
            },
        },
    },
]

export class OpenAIService {
    /**
     * Chat with AI Copilot using function calling
     */
    static async chat(messages: { role: string; content: string }[], context?: any) {
        try {
            const systemMessage = {
                role: "system",
                content: `You are an expert marketing AI assistant for GrowzzyOS.
                
Current Context & Data:
${context ? JSON.stringify(context, null, 2) : "No specific data provided."}

Your Goal:
Provide actionable, data-driven answers based ONLY on the context provided.
If the user asks about campaign performance, look at the data.
If the user asks to "optimize", suggest specific changes based on ROAS/CPA.
Keep answers concise and professional.`
            }

            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [systemMessage, ...messages] as any,
                tools: TOOLS,
                tool_choice: "auto",
                temperature: 0.7,
            })

            return response
        } catch (error) {
            console.error("[OPENAI_CHAT_ERROR]", error)
            throw new Error("Failed to get AI response")
        }
    }

    /**
     * Generate AI insights from campaign data
     */
    static async generateInsights(data: {
        campaigns: any[]
        metrics: any
        timeframe: string
    }) {
        try {
            const prompt = `You are an expert marketing analyst. Analyze this campaign data and provide 3-5 actionable insights.

Data:
- Total Campaigns: ${data.campaigns.length}
- Metrics: ${JSON.stringify(data.metrics)}
- Timeframe: ${data.timeframe}

Campaign Details:
${data.campaigns.map((c, i) => `${i + 1}. ${c.name}: Spend $${c.spend}, Revenue $${c.revenue}, ROAS ${c.roas}x`).join("\n")}

Provide insights in this JSON format:
{
  "insights": [
    {
      "title": "Brief title",
      "description": "Detailed insight",
      "type": "WARNING | OPPORTUNITY | INFO",
      "severity": "HIGH | MEDIUM | LOW",
      "metric": "affected metric",
      "recommendation": "What to do"
    }
  ]
}`

            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0.3,
            })

            const content = response.choices[0]?.message?.content
            return content ? JSON.parse(content) : { insights: [] }
        } catch (error) {
            console.error("[OPENAI_INSIGHTS_ERROR]", error)
            return { insights: [] }
        }
    }

    /**
     * Generate AI-powered ad creatives
     */
    static async generateAdCreative(params: {
        platform: string
        objective: string
        targetAudience: string
        keyBenefit: string
        tone?: string
    }) {
        try {
            const prompt = `You are an expert copywriter specializing in high-converting ${params.platform} ads.

Create 3 ad variations with these details:
- Platform: ${params.platform}
- Objective: ${params.objective}
- Target Audience: ${params.targetAudience}
- Key Benefit: ${params.keyBenefit}
- Tone: ${params.tone || "Professional yet engaging"}

For each variation, provide:
1. Headline (attention-grabbing, max 40 chars)
2. Primary Text (compelling copy, 125-150 chars)
3. Call-to-Action (strong CTA)
4. Predicted Performance Score (0-100)

Return JSON format:
{
  "creatives": [
    {
      "headline": "...",
      "primaryText": "...",
      "cta": "...",
      "predictedScore": 85,
      "reasoning": "Why this will perform well"
    }
  ]
}`

            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0.8,
            })

            const content = response.choices[0]?.message?.content
            return content ? JSON.parse(content) : { creatives: [] }
        } catch (error) {
            console.error("[OPENAI_CREATIVE_ERROR]", error)
            return { creatives: [] }
        }
    }

    /**
     * Generate executive report summary
     */
    static async generateReportSummary(data: {
        metrics: any
        campaigns: any[]
        dateRange: { from: string; to: string }
    }) {
        try {
            const prompt = `You are a marketing strategist writing an executive summary.

Performance Data (${data.dateRange.from} to ${data.dateRange.to}):
- Total Spend: $${data.metrics.totalSpend}
- Total Revenue: $${data.metrics.totalRevenue}
- Overall ROAS: ${data.metrics.roas}x
- Total Leads: ${data.metrics.totalLeads}
- Top Campaign: ${data.campaigns[0]?.name}

Write a concise 3-paragraph executive summary covering:
1. Overall performance vs goals
2. Key wins and challenges
3. Strategic recommendations for next period

Keep it professional, data-driven, and actionable.`

            const response = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.5,
            })

            return response.choices[0]?.message?.content || ""
        } catch (error) {
            console.error("[OPENAI_REPORT_ERROR]", error)
            return "Report summary unavailable."
        }
    }

    /**
     * AI Lead Scoring
     */
    static async scoreLead(lead: {
        company?: string
        email?: string
        source?: string
        value?: number
    }) {
        try {
            const prompt = `Score this lead from 0-100 based on conversion likelihood:

Lead Data:
- Company: ${lead.company || "Unknown"}
- Email Domain: ${lead.email?.split("@")[1] || "Unknown"}
- Source: ${lead.source || "Unknown"}
- Estimated Value: $${lead.value || 0}

Consider:
- Email domain quality (corporate vs free email)
- Company presence
- Source reliability
- Value potential

Return JSON: { "score": 85, "reasoning": "Why this score" }`

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0.3,
            })

            const content = response.choices[0]?.message?.content
            const result = content ? JSON.parse(content) : { score: 50, reasoning: "Default" }
            return result
        } catch (error) {
            console.error("[OPENAI_LEAD_SCORE_ERROR]", error)
            return { score: 50, reasoning: "Auto-assigned default score" }
        }
    }
}
