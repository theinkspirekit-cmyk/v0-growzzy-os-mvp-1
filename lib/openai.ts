import OpenAI from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

// ============================================
// AI COPILOT - Chat Completion
// ============================================

export async function chatWithAI(messages: { role: "user" | "assistant" | "system"; content: string }[]) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: messages as any,
            temperature: 0.7,
            max_tokens: 1500,
        })

        return {
            success: true,
            message: response.choices[0].message.content,
            usage: response.usage,
        }
    } catch (error: any) {
        console.error("[OpenAI] Chat error:", error)
        return {
            success: false,
            error: error.message || "AI service unavailable",
        }
    }
}

// ============================================
// AI ANALYTICS INSIGHTS
// ============================================

export async function generateAnalyticsInsights(analyticsData: any) {
    try {
        const prompt = `You are an expert marketing analyst. Analyze the following marketing data and provide 3-5 key insights with actionable recommendations:

Data:
${JSON.stringify(analyticsData, null, 2)}

Provide insights in this JSON format:
{
  "insights": [
    {
      "type": "warning" | "success" | "info",
      "title": "Brief title",
      "description": "Detailed insight",
      "priority": "High" | "Medium" | "Low"
    }
  ],
  "recommendations": [
    {
      "title": "Action title",
      "description": "Why and how to do it",
      "impact": "Estimated impact"
    }
  ]
}`

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role:

                        "system", content: "You are a senior marketing analyst specializing in paid advertising optimization."
                },
                { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
        })

        const result = JSON.parse(response.choices[0].message.content || "{}")
        return { success: true, data: result }
    } catch (error: any) {
        console.error("[OpenAI] Analytics insights error:", error)
        return { success: false, error: error.message }
    }
}

// ============================================
// AI AD CREATIVE GENERATION
// ============================================

export async function generateAdCreative(params: {
    platform: string
    format: string
    objective: string
    targetAudience: string
    keyBenefit: string
    brandVoice?: string
}) {
    try {
        const prompt = `Generate 3 high-converting ad creative variations for:

Platform: ${params.platform}
Format: ${params.format}
Objective: ${params.objective}
Target Audience: ${params.targetAudience}
Key Benefit/Hook: ${params.keyBenefit}
Brand Voice: ${params.brandVoice || "Professional and persuasive"}

For each variation, provide:
1. Headline (attention-grabbing, max 40 characters)
2. Body copy (compelling, max 125 characters)
3. Call-to-action (clear, actionable)
4. Visual suggestion (what image/video would work best)
5. Predicted conversion score (0-100)

Return in JSON format:
{
  "creatives": [
    {
      "headline": "...",
      "body": "...",
      "cta": "...",
      "visualSuggestion": "...",
      "predictionScore": 85,
      "reasoning": "Why this will work"
    }
  ]
}`

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: "You are a world-class copywriter and performance marketer specializing in high-converting ad creatives." },
                { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.8,
        })

        const result = JSON.parse(response.choices[0].message.content || "{}")
        return { success: true, data: result }
    } catch (error: any) {
        console.error("[OpenAI] Creative generation error:", error)
        return { success: false, error: error.message }
    }
}

// ============================================
// AI LEAD SCORING
// ============================================

export async function scoreLeads(leads: any[]) {
    try {
        const prompt = `You are a lead qualification AI. Score these leads from 0-100 based on quality indicators:

Leads:
${JSON.stringify(leads, null, 2)}

Return JSON:
{
  "scores": [
    {
      "id": "lead_id",
      "score": 85,
      "reasoning": "Why this score",
      "nextBestAction": "Recommended next step"
    }
  ]
}`

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.2,
        })

        const result = JSON.parse(response.choices[0].message.content || "{}")
        return { success: true, data: result }
    } catch (error: any) {
        console.error("[OpenAI] Lead scoring error:", error)
        return { success: false, error: error.message }
    }
}

// ============================================
// AI CAMPAIGN OPTIMIZATION
// ============================================

export async function analyzeCampaign(campaignData: any) {
    try {
        const prompt = `Analyze this ad campaign and provide optimization recommendations:

Campaign Data:
${JSON.stringify(campaignData, null, 2)}

Provide:
1. Health assessment ("excellent", "good", "fair", "poor")
2. Top 3 issues (if any)
3. Top 3 opportunities
4. Specific action items

Return JSON format.`

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: "You are a PPC campaign optimization expert." },
                { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
        })

        const result = JSON.parse(response.choices[0].message.content || "{}")
        return { success: true, data: result }
    } catch (error: any) {
        console.error("[OpenAI] Campaign analysis error:", error)
        return { success: false, error: error.message }
    }
}

// ============================================
// AI REPORT GENERATION
// ============================================

export async function generateReportSummary(reportData: any) {
    try {
        const prompt = `Generate an executive summary for this marketing performance report:

Data:
${JSON.stringify(reportData, null, 2)}

Write a professional, insight-driven summary in 3-4 paragraphs highlighting:
1. Overall performance
2. Key wins
3. Areas of concern
4. Strategic recommendations

Keep it concise and actionable.`

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
            max_tokens: 800,
        })

        return {
            success: true,
            summary: response.choices[0].message.content,
        }
    } catch (error: any) {
        console.error("[OpenAI] Report summary error:", error)
        return { success: false, error: error.message }
    }
}

export default openai
