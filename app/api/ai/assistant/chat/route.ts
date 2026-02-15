import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { OpenAIService } from "@/lib/openai-service"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { messages } = await req.json()

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
        }

        // Fetch basic context (optional, can be optimized)
        // To improve responsiveness, we can fetch this in parallel or limit the data size
        const [campaignsCount, leadsCount] = await Promise.all([
            prisma.campaign.count({ where: { userId: session.user.id } }),
            prisma.lead.count({ where: { userId: session.user.id } })
        ])

        const context = {
            userId: session.user.id,
            campaignsRunning: campaignsCount,
            totalLeads: leadsCount,
            // Add more metrics here if needed
        }

        const response = await OpenAIService.chat(messages, context)
        const content = response.choices[0]?.message?.content

        return NextResponse.json({
            message: {
                role: "assistant",
                content: content || "I'm sorry, I couldn't generate a response."
            }
        })

    } catch (error: any) {
        console.error("AI Assistant Chat Error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to process chat request" },
            { status: 500 }
        )
    }
}
