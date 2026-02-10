import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()

  // Mock Auth Bypass for Admin
  const isMockUser = session?.user?.email === "admin@growzzy.com"

  if (!session && !isMockUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session?.user?.id || "mock-user-id"

  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    // Fetch REAL campaigns from DB
    const campaigns = await prisma.campaign.findMany({
      where: {
        userId: userId,
        ...(status && status !== "ALL" ? { status } : {}),
      },
      orderBy: { lastUpdated: "desc" },
      include: {
        leads: {
          select: { id: true, value: true } // Include lead count/value for ROI calc
        }
      }
    })

    // If no campaigns found for mock user, seed functionality/return mock structure
    // This ensures dashboard NEVER looks empty during first run
    if (isMockUser && campaigns.length === 0) {
      return NextResponse.json({
        campaigns: [
          {
            id: "mock-1",
            name: "Q1 Logic Pro Promo - US",
            platform: "Meta",
            status: "ACTIVE",
            budget: 5000,
            spend: 1250.40,
            revenue: 4120.00,
            ctr: 1.8,
            cpc: 2.10,
            roas: 3.29,
            health: "Good",
            impressions: 45000,
            clicks: 850,
            conversions: 42
          },
          {
            id: "mock-2",
            name: "Retargeting - Cart Abandoners",
            platform: "Google",
            status: "PAUSED",
            budget: 2000,
            spend: 1800.00,
            revenue: 550.00,
            ctr: 0.9,
            cpc: 4.50,
            roas: 0.31,
            health: "Critical",
            impressions: 12000,
            clicks: 150,
            conversions: 5
          }
        ]
      })
    }

    // Format response
    const formattedCampaigns = campaigns.map(c => ({
      id: c.id,
      name: c.name,
      platform: c.platform,
      status: c.status,
      // Calculate derived metrics if needed, or use stored values
      spend: Number(c.spend),
      revenue: Number(c.revenue),
      roas: Number(c.roas) || 0,
      ctr: Number(c.ctr) || 0,
      cpc: Number(c.cpc) || 0,
      impressions: c.impressions,
      clicks: c.clicks,
      conversions: c.conversions,
      health: Number(c.roas) > 3 ? "Good" : Number(c.roas) < 1 ? "Critical" : "Fair", // Simple AI Rule
    }))

    return NextResponse.json({ campaigns: formattedCampaigns })

  } catch (error) {
    console.error("[CAMPAIGNS_GET_ERROR]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session && session?.user?.email !== "admin@growzzy.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    // Here you would connect to Meta/Google APIs to create real campaign
    // For now, save to DB simulating that connection

    const newCampaign = await prisma.campaign.create({
      data: {
        userId: session?.user?.id || "mock-user-id",
        name: body.name,
        platform: body.platform,
        status: "ACTIVE",
        connectionId: "mock-details", // Would link to real connection
        platformCampaignId: `mock-platform-${Date.now()}`,
        objective: body.objective || "CONVERSIONS",
        spend: 0,
        revenue: 0
      }
    })

    return NextResponse.json(newCampaign)

  } catch (error) {
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
  }
}
