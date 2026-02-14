
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { OpenAIService } from "@/lib/openai-service"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { messages } = await req.json()

        // 1. Fetch Real Context Data
        const campaigns = await prisma.campaign.findMany({
            where: { userId: session.user.id },
            select: {
                name: true, status: true, totalSpend: true, totalRevenue: true, roas: true, budgetType: true, dailyBudget: true
            },
            take: 10
        })

        const recentLeads = await prisma.lead.count({
            where: { userId: session.user.id, createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }
        })

        const totalSpend = campaigns.reduce((acc, c) => acc + (c.totalSpend || 0), 0)
        const totalRevenue = campaigns.reduce((acc, c) => acc + (c.totalRevenue || 0), 0)
        const avgRoas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : "0.00"

        const context = {
            summary: {
                total_active_campaigns: campaigns.filter(c => c.status === 'active').length,
                total_spend_30d: totalSpend,
                total_revenue_30d: totalRevenue,
                account_roas: avgRoas,
                new_leads_30d: recentLeads
            },
            campaigns_snapshot: campaigns.map(c => ({
                name: c.name,
                status: c.status,
                spend: c.totalSpend,
                roas: c.roas,
                budget: c.dailyBudget
            }))
        }

        // 2. Get AI Response
        const response = await OpenAIService.chat(messages, context)
        const assistantMessage = response.choices[0]?.message

        // 3. Save Conversation (Optional, good for history)
        // await prisma.conversation.create(...)

        return NextResponse.json({
            message: assistantMessage,
            context_used: true
        })

    } catch (error: any) {
        console.error("AI Assistant Error:", error)
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
    }
}
