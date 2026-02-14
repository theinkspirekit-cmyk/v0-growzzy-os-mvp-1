
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { platformName } = await req.json()

    // Simulate OAuth connection by creating a Platform record
    await prisma.platform.create({
      data: {
        userId: session.user.id,
        name: platformName, // "Meta Ads", "Google Ads", "LinkedIn"
        accountId: `acct_${Math.random().toString(36).substring(7)}`,
        accountName: `${session.user.name}'s ${platformName} Account`,
        accessToken: "dummy_access_token_" + Date.now(),
        isActive: true,
        lastSynced: new Date()
      }
    })

    // Also update user's onboarding status if strictly tracking that field (though we rely on platform count now)
    // await prisma.user.update(...)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Connect error:", error)
    return NextResponse.json({ error: "Failed to connect platform" }, { status: 500 })
  }
}
