export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  pauseGoogleAdsCampaign,
  pauseMetaAdsCampaign,
  pauseLinkedInAdsCampaign,
  resumeGoogleAdsCampaign,
  resumeMetaAdsCampaign,
  resumeLinkedInAdsCampaign
} from '@/lib/platforms'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Define function tools for OpenAI
const TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "pause_campaigns",
      description: "Pause one or more campaigns based on criteria",
      parameters: {
        type: "object",
        properties: {
          campaignIds: {
            type: "array",
            items: { type: "string" },
            description: "Array of campaign IDs to pause"
          },
          criteria: {
            type: "object",
            description: "Criteria for selecting campaigns (e.g. ROAS < 1.5)"
          }
        },
        required: ["criteria"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "resume_campaigns",
      description: "Resume paused campaigns",
      parameters: {
        type: "object",
        properties: {
          campaignIds: {
            type: "array",
            items: { type: "string" },
            description: "Array of campaign IDs to resume"
          }
        },
        required: ["campaignIds"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "fetch_campaign_analytics",
      description: "Fetch detailed analytics for campaigns",
      parameters: {
        type: "object",
        properties: {
          period: {
            type: "string",
            enum: ["7", "30", "60", "90"],
            description: "Number of days to analyze"
          }
        }
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "adjust_campaign_budget",
      description: "Adjust daily budget for campaigns",
      parameters: {
        type: "object",
        properties: {
          campaignId: {
            type: "string",
            description: "Campaign ID to adjust"
          },
          newBudget: {
            type: "number",
            description: "New daily budget amount"
          },
          adjustment: {
            type: "string",
            enum: ["increase", "decrease"],
            description: "Type of adjustment"
          },
          percentage: {
            type: "number",
            description: "Percentage to adjust by"
          }
        }
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "generate_performance_report",
      description: "Generate a performance report for specified period",
      parameters: {
        type: "object",
        properties: {
          period: {
            type: "string",
            enum: ["weekly", "monthly", "quarterly"],
            description: "Report period"
          }
        },
        required: ["period"]
      }
    }
  }
]

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { messages, context } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.log("[Copilot] OpenAI API key not configured")
      return NextResponse.json({ error: "OpenAI not configured" }, { status: 500 })
    }

    // Fetch user's campaigns for context
    const campaigns = await prisma.campaign.findMany({
      where: { userId: session.user.id },
      include: {
        platform: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    const systemPrompt = `You are an AI Marketing Co-Pilot for GROWZZY OS, an enterprise-grade marketing operations platform.

You have full access to campaign management capabilities. You can:
1. Analyze campaign performance and provide insights
2. Pause underperforming campaigns
3. Resume paused campaigns
4. Adjust campaign budgets
5. Generate performance reports
6. Provide actionable recommendations

Current campaigns:
${JSON.stringify(campaigns.map(c => ({
      id: c.id,
      name: c.name,
      platform: c.platform?.name,
      status: c.status,
      budget: c.dailyBudget,
      spend: c.totalSpend,
      revenue: c.totalRevenue,
      roas: c.roas
    })), null, 2)}

When the user requests an action (pause campaign, adjust budget, etc.), use the appropriate function tool to execute it.
Always explain what you're doing before performing actions that modify campaigns.`

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m: any) => ({ role: m.role, content: m.content })),
      ],
      tools: TOOLS,
      temperature: 0.7,
    })

    const message = response.choices[0]?.message

    // Handle function calls
    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolCall = message.tool_calls[0]
      const functionName = toolCall.function.name
      const args = JSON.parse(toolCall.function.arguments)

      let functionResult: any

      switch (functionName) {
        case "pause_campaigns":
          functionResult = await pauseCampaigns(session.user.id, args)
          break
        case "resume_campaigns":
          functionResult = await resumeCampaigns(session.user.id, args)
          break
        case "fetch_campaign_analytics":
          functionResult = await fetchCampaignAnalytics(session.user.id, args)
          break
        case "adjust_campaign_budget":
          functionResult = await adjustCampaignBudget(session.user.id, args)
          break
        case "generate_performance_report":
          functionResult = await generatePerformanceReport(session.user.id, args)
          break
        default:
          functionResult = { error: "Unknown function" }
      }

      // Call OpenAI again with function result
      const followUpResponse = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m: any) => ({ role: m.role, content: m.content })),
          message,
          {
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(functionResult)
          }
        ],
        temperature: 0.7,
      })

      return NextResponse.json({
        response: followUpResponse.choices[0]?.message?.content,
        actionTaken: {
          function: functionName,
          arguments: args,
          result: functionResult
        }
      })
    }

    return NextResponse.json({ response: message.content })
  } catch (error: any) {
    console.error("[Copilot] Error:", error)
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 })
  }
}

// ============================================
// FUNCTION IMPLEMENTATIONS
// ============================================

async function pauseCampaigns(userId: string, args: any) {
  const { campaignIds, criteria } = args
  const paused = []

  // If specific IDs provided
  if (campaignIds && campaignIds.length > 0) {
    for (const id of campaignIds) {
      const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: { platform: true }
      })

      if (campaign && campaign.userId === userId) {
        // Pause on platform
        try {
          if (campaign.platform && campaign.externalId) {
            const platformType = campaign.platform.name.toLowerCase()
            if (platformType.includes('google')) {
              await pauseGoogleAdsCampaign(campaign.platform.id, campaign.externalId)
            } else if (platformType.includes('meta')) {
              await pauseMetaAdsCampaign(campaign.platform.id, campaign.externalId)
            } else if (platformType.includes('linkedin')) {
              await pauseLinkedInAdsCampaign(campaign.platform.id, campaign.externalId)
            }
          }
        } catch (error) {
          console.error('[Copilot] Platform pause error:', error)
        }

        // Update in database
        await prisma.campaign.update({
          where: { id },
          data: { status: 'paused' }
        })

        paused.push({ id, name: campaign.name })
      }
    }
  }
  // If criteria provided (e.g., ROAS < 1.5)
  else if (criteria) {
    const campaigns = await prisma.campaign.findMany({
      where: { userId, status: 'active' },
      include: { platform: true }
    })

    for (const campaign of campaigns) {
      let shouldPause = false

      // Check criteria
      if (criteria.maxROAS && campaign.roas && campaign.roas < criteria.maxROAS) {
        shouldPause = true
      }
      if (criteria.minSpend && campaign.totalSpend > criteria.minSpend && !campaign.totalRevenue) {
        shouldPause = true
      }

      if (shouldPause) {
        try {
          if (campaign.platform && campaign.externalId) {
            const platformType = campaign.platform.name.toLowerCase()
            if (platformType.includes('google')) {
              await pauseGoogleAdsCampaign(campaign.platform.id, campaign.externalId)
            } else if (platformType.includes('meta')) {
              await pauseMetaAdsCampaign(campaign.platform.id, campaign.externalId)
            } else if (platformType.includes('linkedin')) {
              await pauseLinkedInAdsCampaign(campaign.platform.id, campaign.externalId)
            }
          }
        } catch (error) {
          console.error('[Copilot] Platform pause error:', error)
        }

        await prisma.campaign.update({
          where: { id: campaign.id },
          data: { status: 'paused' }
        })

        paused.push({ id: campaign.id, name: campaign.name, roas: campaign.roas })
      }
    }
  }

  return {
    success: true,
    paused: paused.length,
    campaigns: paused
  }
}

async function resumeCampaigns(userId: string, args: any) {
  const { campaignIds } = args
  const resumed = []

  for (const id of campaignIds) {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: { platform: true }
    })

    if (campaign && campaign.userId === userId) {
      // Resume on platform
      try {
        if (campaign.platform && campaign.externalId) {
          const platformType = campaign.platform.name.toLowerCase()
          if (platformType.includes('google')) {
            await resumeGoogleAdsCampaign(campaign.platform.id, campaign.externalId)
          } else if (platformType.includes('meta')) {
            await resumeMetaAdsCampaign(campaign.platform.id, campaign.externalId)
          } else if (platformType.includes('linkedin')) {
            await resumeLinkedInAdsCampaign(campaign.platform.id, campaign.externalId)
          }
        }
      } catch (error) {
        console.error('[Copilot] Platform resume error:', error)
      }

      // Update in database
      await prisma.campaign.update({
        where: { id },
        data: { status: 'active' }
      })

      resumed.push({ id, name: campaign.name })
    }
  }

  return {
    success: true,
    resumed: resumed.length,
    campaigns: resumed
  }
}

async function fetchCampaignAnalytics(userId: string, args: any) {
  const period = parseInt(args.period || '30')
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - period)

  const campaigns = await prisma.campaign.findMany({
    where: { userId },
    include: { platform: true }
  })

  const analytics = await prisma.analytics.findMany({
    where: {
      platform: {
        userId: userId
      },
      metricDate: {
        gte: startDate
      }
    }
  })

  const totalSpend = analytics.reduce((sum, a) => sum + a.spend, 0)
  const totalRevenue = analytics.reduce((sum, a) => sum + a.revenue, 0)
  const totalLeads = analytics.reduce((sum, a) => sum + a.leads, 0)

  return {
    period: `${period} days`,
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalSpend,
    totalRevenue,
    roas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
    totalLeads,
    costPerLead: totalLeads > 0 ? totalSpend / totalLeads : 0
  }
}

async function adjustCampaignBudget(userId: string, args: any) {
  const { campaignId, newBudget, adjustment, percentage } = args

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId }
  })

  if (!campaign || campaign.userId !== userId) {
    return { error: 'Campaign not found' }
  }

  let updatedBudget = newBudget

  if (adjustment && percentage && campaign.dailyBudget) {
    if (adjustment === 'increase') {
      updatedBudget = campaign.dailyBudget * (1 + percentage / 100)
    } else {
      updatedBudget = campaign.dailyBudget * (1 - percentage / 100)
    }
  }

  await prisma.campaign.update({
    where: { id: campaignId },
    data: { dailyBudget: updatedBudget }
  })

  return {
    success: true,
    campaignId,
    campaignName: campaign.name,
    previousBudget: campaign.dailyBudget,
    newBudget: updatedBudget,
    change: updatedBudget - (campaign.dailyBudget || 0)
  }
}

async function generatePerformanceReport(userId: string, args: any) {
  const { period } = args
  let days = 7

  if (period === 'monthly') days = 30
  if (period === 'quarterly') days = 90

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const campaigns = await prisma.campaign.findMany({
    where: { userId }
  })

  const analytics = await prisma.analytics.findMany({
    where: {
      platform: {
        userId: userId
      },
      metricDate: { gte: startDate }
    }
  })

  const leads = await prisma.lead.findMany({
    where: {
      userId,
      createdAt: { gte: startDate }
    }
  })

  return {
    period,
    dateRange: {
      from: startDate.toISOString(),
      to: new Date().toISOString()
    },
    summary: {
      totalSpend: analytics.reduce((sum, a) => sum + a.spend, 0),
      totalRevenue: analytics.reduce((sum, a) => sum + a.revenue, 0),
      totalLeads: leads.length,
      activeCampaigns: campaigns.filter(c => c.status === 'active').length
    }
  }
}

