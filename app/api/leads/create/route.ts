
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { scoreLeads } from "@/lib/openai"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, company, position, source, estimatedValue } = body

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    const lead = await prisma.lead.create({
      data: {
        userId: session.user.id,
        name,
        email,
        phone,
        company,
        position,
        source: source || 'Manual',
        estimatedValue: estimatedValue ? parseFloat(estimatedValue) : null,
        status: 'new',
      },
    })

    // AI Score the lead
    try {
      const scoreResult = await scoreLeads([lead])
      if (scoreResult.success && scoreResult.data.scores[0]) {
        const aiData = scoreResult.data.scores[0]
        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            aiScore: aiData.score,
            aiInsights: aiData.reasoning,
          },
        })
      }
    } catch (aiError) {
      console.warn("AI scoring failed for new lead, skipping.", aiError)
    }

    return NextResponse.json(lead)

  } catch (error: any) {
    console.error('[API] Create lead error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
