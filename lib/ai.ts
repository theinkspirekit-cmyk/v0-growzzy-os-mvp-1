import OpenAI from "openai"
import Anthropic from "@anthropic-ai/sdk"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface AIMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export async function generateAIResponse(messages: AIMessage[]): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not set")
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages.map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    })),
    temperature: 0.7,
  })

  return response.choices[0]?.message?.content || "(no response)"
}

// AI Analysis Functions for marketing data
export const AIAnalysis = {
  // Analyze campaign performance and generate insights
  async analyzeCampaign(campaignData: {
    name: string
    spend: number
    revenue: number
    clicks: number
    impressions: number
    conversions: number
    cpc: number
    ctr: number
    roas: number
    cpa: number
  }) {
    try {
      const prompt = `Analyze the following campaign performance metrics and provide 3-5 key insights and recommendations:

Campaign: ${campaignData.name}
Spend: $${campaignData.spend.toFixed(2)}
Revenue: $${campaignData.revenue.toFixed(2)}
Clicks: ${campaignData.clicks}
Impressions: ${campaignData.impressions}
Conversions: ${campaignData.conversions}
CPC: $${campaignData.cpc.toFixed(2)}
CTR: ${campaignData.ctr.toFixed(2)}%
ROAS: ${campaignData.roas.toFixed(2)}x
CPA: $${campaignData.cpa.toFixed(2)}

Provide insights as a JSON array with objects containing: insight, severity (low/medium/high), recommendation`

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      })

      return response.choices[0]?.message?.content
    } catch (error) {
      console.error("Error analyzing campaign:", error)
      throw error
    }
  },

  // Score leads using AI
  async scoreLeads(leads: Array<{
    name: string
    email: string
    company?: string
    source: string
  }>) {
    try {
      const leadsText = leads
        .map((l) => `Name: ${l.name}, Email: ${l.email}, Company: ${l.company || "N/A"}, Source: ${l.source}`)
        .join("\n")

      const prompt = `Score each lead on a scale of 0-100 based on likelihood to convert. Consider company size, email quality, and source quality.

Leads:
${leadsText}

Respond with a JSON array with: email, score (0-100), reason`

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 1000,
      })

      return response.choices[0]?.message?.content
    } catch (error) {
      console.error("Error scoring leads:", error)
      throw error
    }
  },

  // Generate creative copy variations
  async generateCreativeVariations(
    brief: string,
    type: "headline" | "ad_copy" | "cta"
  ): Promise<string | null> {
    try {
      const prompts = {
        headline: `Generate 5 compelling and diverse ad headlines for: ${brief}\n\nProvide only the headlines as a JSON array of strings.`,
        ad_copy: `Generate 5 different ad copy variations for: ${brief}\n\nEach should be 1-2 sentences. Provide as JSON array of strings.`,
        cta: `Generate 5 different call-to-action buttons for: ${brief}\n\nProvide only the CTAs as a JSON array of strings.`,
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompts[type] }],
        temperature: 0.8,
        max_tokens: 500,
      })

      return response.choices[0]?.message?.content
    } catch (error) {
      console.error("Error generating creative variations:", error)
      throw error
    }
  },

  // Generate performance recommendations using Claude
  async generateRecommendations(data: Record<string, any>): Promise<string | null> {
    try {
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Based on the following marketing performance data, provide 3-5 strategic recommendations to improve performance:\n\n${JSON.stringify(data, null, 2)}`,
          },
        ],
      })

      return message.content[0]?.type === "text" ? message.content[0].text : null
    } catch (error) {
      console.error("Error generating recommendations:", error)
      throw error
    }
  },
}
