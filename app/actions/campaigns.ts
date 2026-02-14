"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const CampaignSchema = z.object({
    name: z.string().min(1, "Name is required"),
    platformId: z.string().optional(),
    status: z.string().default("draft"),
    budget: z.number().min(0).default(0),
    objective: z.string().optional(),
})

export async function getCampaigns() {
    const session = await auth()
    if (!session?.user?.id) return []

    return await prisma.campaign.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: { platform: true }
    })
}

export async function createCampaign(data: any) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const validated = CampaignSchema.parse({
            name: data.name,
            budget: typeof data.budget === 'string' ? parseFloat(data.budget) : data.budget,
            status: data.status,
            objective: data.objective
        })

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
        return { success: true, campaign }
    } catch (e: any) {
        return { error: e.message || "Failed to create campaign" }
    }
}

export async function updateCampaignStatus(id: string, status: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        await prisma.campaign.update({
            where: { id, userId: session.user.id },
            data: { status }
        })
        revalidatePath("/dashboard/campaigns")
        return { success: true }
    } catch (e) {
        return { error: "Update failed" }
    }
}

export async function deleteCampaign(id: string) {
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
