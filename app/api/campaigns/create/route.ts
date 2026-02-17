
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getPlatformConnector } from "@/lib/platform-connector"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { campaignData, platform: platformName } = await request.json()

    if (!campaignData || !campaignData.name) {
      return NextResponse.json({ error: "Campaign name is required" }, { status: 400 })
    }

    // Try platform connector sync
    let externalId: string | null = null
    try {
      const connector = getPlatformConnector(platformName || 'meta')
      const syncResult = await connector.createCampaign(campaignData)
      if (syncResult.success) {
        externalId = syncResult.externalId
      }
    } catch (platformError) {
      console.warn("Platform sync failed during specialized creation flow", platformError)
    }

    // Save to database via Prisma
    const campaign = await prisma.campaign.create({
      data: {
        userId: session.user.id,
        name: campaignData.name,
        platformName: platformName || "meta",
        objective: campaignData.objective || "conversions",
        status: campaignData.status || "paused",
        dailyBudget: campaignData.dailyBudget ? parseFloat(campaignData.dailyBudget) : null,
        totalBudget: campaignData.totalBudget ? parseFloat(campaignData.totalBudget) : null,
        startDate: campaignData.startDate ? new Date(campaignData.startDate) : null,
        endDate: campaignData.endDate ? new Date(campaignData.endDate) : null,
        externalId: externalId
      },
    })

    return NextResponse.json({
      success: true,
      campaign,
      message: `Campaign created successfully`,
    })
  } catch (error: any) {
    console.error("[v0] Campaign creation error:", error)
    return NextResponse.json({ error: error.message || "Failed to create campaign" }, { status: 500 })
  }
}
