"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const CampaignSchema = z.object({
    name: z.string().min(1, "Name is required"),
    platformId: z.string().optional(),
    status: z.string().default("draft"),
    budget: z.number().min(0, "Budget must be positive"),
    objective: z.string().optional().default("conversions"),
})

export type CampaignState = {
    error?: string
    success?: boolean
    campaign?: any
}

export async function getCampaigns() {
    const session = await auth()
    if (!session?.user?.id) return []

    const campaigns = await prisma.campaign.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: { platform: true }
    })
    return JSON.parse(JSON.stringify(campaigns))
}

export async function createCampaign(data: any): Promise<CampaignState> {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const validated = CampaignSchema.parse({
            name: data.name,
            budget: typeof data.budget === 'string' ? parseFloat(data.budget) : data.budget,
            status: data.status,
            objective: data.objective
        })

        // Simulate network for realism
        await new Promise(resolve => setTimeout(resolve, 600))

        const campaign = await prisma.campaign.create({
            data: {
                userId: session.user.id,
                name: validated.name,
                dailyBudget: validated.budget,
                status: validated.status,
                objective: validated.objective,
                roas: 0,
                totalSpend: 0,
                totalRevenue: 0
            }
        })

        revalidatePath("/dashboard/campaigns")
        return { success: true, campaign: JSON.parse(JSON.stringify(campaign)) }
    } catch (e: any) {
        if (e instanceof z.ZodError) {
            return { error: e.errors[0].message }
        }
        return { error: e.message || "Failed to create campaign" }
    }
}

export async function updateCampaignStatus(id: string, status: string): Promise<CampaignState> {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const campaign = await prisma.campaign.update({
            where: { id, userId: session.user.id },
            data: { status }
        })

        revalidatePath("/dashboard/campaigns")
        return { success: true, campaign: JSON.parse(JSON.stringify(campaign)) }
    } catch (e: any) {
        return { error: e.message || "Failed to update campaign" }
    }
}

export async function pauseCampaign(id: string): Promise<CampaignState> {
    return updateCampaignStatus(id, "paused")
}

export async function resumeCampaign(id: string): Promise<CampaignState> {
    return updateCampaignStatus(id, "active")
}

export async function endCampaign(id: string): Promise<CampaignState> {
    return updateCampaignStatus(id, "ended")
}

export async function deleteCampaign(id: string): Promise<CampaignState> {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        // Delete related records first
        await prisma.performanceMetric.deleteMany({
            where: { entityId: id, entityType: "campaign" }
        })

        await prisma.aIInsight.deleteMany({
            where: { entityId: id, entityType: "campaign" }
        })

        // Delete campaign
        await prisma.campaign.delete({
            where: { id, userId: session.user.id }
        })

        revalidatePath("/dashboard/campaigns")
        return { success: true }
    } catch (e: any) {
        return { error: e.message || "Failed to delete campaign" }
    }
}

export async function updateCampaignBudget(
    id: string,
    dailyBudget: number,
    totalBudget?: number
): Promise<CampaignState> {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const campaign = await prisma.campaign.update({
            where: { id, userId: session.user.id },
            data: {
                dailyBudget,
                budget: totalBudget || dailyBudget * 30
            }
        })

        revalidatePath("/dashboard/campaigns")
        return { success: true, campaign: JSON.parse(JSON.stringify(campaign)) }
    } catch (e: any) {
        return { error: e.message || "Failed to update budget" }
    }
}

export async function getCampaignDetails(id: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const campaign = await prisma.campaign.findFirst({
            where: { id, userId: session.user.id }
        })

        if (!campaign) {
            return { error: "Campaign not found" }
        }

        // Fetch recent metrics
        const metrics = await prisma.performanceMetric.findMany({
            where: {
                userId: session.user.id,
                entityId: id,
                entityType: "campaign"
            },
            take: 30,
            orderBy: { periodDate: "desc" }
        })

        // Fetch insights
        const insights = await prisma.aIInsight.findMany({
            where: {
                userId: session.user.id,
                entityId: id,
                entityType: "campaign"
            },
            take: 10,
            orderBy: { createdAt: "desc" }
        })

        return {
            campaign: JSON.parse(JSON.stringify(campaign)),
            metrics: JSON.parse(JSON.stringify(metrics)),
            insights: JSON.parse(JSON.stringify(insights))
        }
    } catch (e: any) {
        return { error: e.message || "Failed to fetch campaign details" }
    }
}

export async function getCampaignsByPlatform(platform: string) {
    const session = await auth()
    if (!session?.user?.id) return []

    try {
        const campaigns = await prisma.campaign.findMany({
            where: {
                userId: session.user.id,
                platform: platform
            },
            orderBy: { createdAt: "desc" }
        })

        return JSON.parse(JSON.stringify(campaigns))
    } catch {
        return []
        revalidatePath("/dashboard/campaigns")
        return { success: true }
    } catch (e) {
        return { error: "Update failed" }
    }
}

export async function deleteCampaign(id: string): Promise<CampaignState> {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        await prisma.campaign.delete({
            where: { id, userId: session.user.id }
        })
        revalidatePath("/dashboard/campaigns")
        return { success: true }
    } catch (e) {
        return { error: "Delete failed" }
    }
}
