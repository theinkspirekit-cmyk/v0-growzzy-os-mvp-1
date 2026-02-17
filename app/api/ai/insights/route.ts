
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { OpenAIService } from "@/lib/openai-service"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const campaigns = await prisma.campaign.findMany({
            where: { userId: session.user.id, status: "active" },
            select: {
                id: true,
                name: true,
                roas: true,
                totalSpend: true,
                totalRevenue: true,
                createdAt: true,
                dailyBudget: true
            },
            orderBy: { totalSpend: "desc" },
            take: 20
        })

        const campaignsData = campaigns.map(c => ({
            name: c.name,
            spend: Number(c.totalSpend || 0),
            revenue: Number(c.totalRevenue || 0),
            roas: Number(c.roas || 0)
        }));

        // Use real AI to generate insights
        const aiResponse = await OpenAIService.generateInsights({
            campaigns: campaignsData,
            metrics: {
                totalSpend: campaignsData.reduce((acc: number, c: any) => acc + c.spend, 0),
                totalRevenue: campaignsData.reduce((acc: number, c: any) => acc + c.revenue, 0),
                averageRoas: campaignsData.length > 0 ? campaignsData.reduce((acc: number, c: any) => acc + c.roas, 0) / campaignsData.length : 0
            },
            timeframe: "Last 30 Days"
        });

        const insights = (aiResponse.insights || []).map((ins: any) => ({
            title: ins.title,
            description: ins.description,
            metric: ins.metric,
            recommendation: ins.recommendation,
            type: (ins.type || 'info').toLowerCase() === 'warning' ? 'warning' : (ins.type || '').toLowerCase() === 'opportunity' ? 'success' : 'info',
            impact: ins.severity === 'HIGH' ? '+25% Impact' : '+10% Impact'
        }));

        // Fallback if AI returned nothing
        if (insights.length === 0) {
            insights.push({
                title: "System Initialization",
                description: "AI Intelligence protocols are active. Connect ad platforms to begin neural optimization.",
                metric: "Status",
                recommendation: "Navigate to Settings > Integrations to connect Meta or Google Ads.",
                type: "info",
                impact: "Setup Required"
            });
        }

        return NextResponse.json(insights);

    } catch (error) {
        console.error("Insights API Error:", error);
        return NextResponse.json([
            {
                title: "Data Stream Interrupted",
                description: "Unable to reach the neural core (Database). Retrying connection...",
                metric: "Connectivity",
                recommendation: "Check your internet connection or contact support if persistence continues.",
                type: "danger",
                impact: "Offline"
            }
        ]);
    }
}
