
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { generateAdCreatives } from "@/lib/creative-generator-service"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productName, productDescription, benefits, targetAudience, campaignGoal, platform } = await request.json()

    if (!productName || !productDescription) {
      return NextResponse.json({ error: "Product name and description required" }, { status: 400 })
    }

    // This service call presumably uses OpenAI under the hood
    const creatives = await generateAdCreatives({
      name: productName,
      description: productDescription,
      benefits: benefits || [],
      targetAudience: targetAudience || "General audience",
      goal: campaignGoal || "Drive conversions",
      platform: platform || "Meta",
    })

    // Save to database via Prisma
    const savedCreatives = []
    if (creatives.length > 0) {
      for (const creative of creatives) {
        const saved = await prisma.creative.create({
          data: {
            userId: session.user.id,
            name: `${productName} - ${creative.psychologicalTrigger || "Variation"}`,
            type: "generated",
            headline: creative.headline,
            bodyText: creative.primaryText || creative.description,
            ctaText: creative.cta,
            aiGenerated: true,
            aiScore: creative.score || 85,
            status: "draft",
          },
        })
        savedCreatives.push(saved)
      }
    }

    return NextResponse.json({
      success: true,
      creatives: savedCreatives,
      count: savedCreatives.length,
    })
  } catch (error: any) {
    console.error("[v0] Creative generation error:", error)
    return NextResponse.json({ error: error.message || "Failed to generate creatives" }, { status: 500 })
  }
}
