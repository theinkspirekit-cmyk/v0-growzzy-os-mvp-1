
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { automationId, action, campaignId, params } = await request.json()

    console.log("[v0] Executing automation:", automationId, "action:", action)

    // Get campaign details via Prisma
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId }
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 400 })
    }

    // Execute action on platform (Mock or Real platform API call)
    let result: any

    switch (action) {
      case "pause_campaign":
        console.log(`[v0] Pausing campaign ${campaignId} on ${campaign.platformName}`)
        await prisma.campaign.update({
          where: { id: campaignId },
          data: { status: 'paused' }
        })
        result = { success: true, action: "paused" }
        break

      case "increase_budget":
        console.log(`[v0] Increasing budget for campaign ${campaignId} by ${params.increase}%`)
        const currentBudget = campaign.dailyBudget || 0
        const newBudget = currentBudget * (1 + params.increase / 100)
        await prisma.campaign.update({
          where: { id: campaignId },
          data: { dailyBudget: newBudget }
        })
        result = { success: true, newBudget }
        break

      case "change_bid":
        console.log(`[v0] Changing bid for campaign ${campaignId} to ${params.newBid}`)
        // Bids might be stored in targeting or metadata
        result = { success: true, newBid: params.newBid }
        break

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 })
    }

    // Log automation execution via Prisma
    await prisma.automationLog.create({
      data: {
        automationId,
        actionTaken: action,
        success: true,
        impact: `Campaign ${campaign.name} ${action}`,
        result: JSON.stringify(result)
      }
    })

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    console.error("[v0] Automation execution error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
