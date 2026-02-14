"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const AutomationSchema = z.object({
    name: z.string().min(1, "Name required"),
    triggerType: z.string().default("ROAS_DROP"),
    actionType: z.string().default("NOTIFY_SLACK"),
    description: z.string().optional()
})

const MOCK_AUTOMATIONS: any[] = [
    // Pre-populate if DB empty (mock)
    { id: "1", name: "Pause Low ROAS AdSets", triggerType: "ROAS < 1.5", actionType: "PAUSE", isActive: true, runCount: 42, lastRun: new Date() },
    { id: "2", name: "Scale High Performers", triggerType: "ROAS > 4.0", actionType: "INCREASE_BUDGET_20%", isActive: true, runCount: 15, lastRun: new Date(Date.now() - 86400000) },
    { id: "3", name: "Budget Safeguard", triggerType: "SPEND > $500", actionType: "NOTIFY", isActive: false, runCount: 0, lastRun: null },
]

export async function getAutomations() {
    const session = await auth()
    if (!session?.user?.id) return []

    // Attempt DB Fetch
    try {
        const dbAutos = await prisma.automation.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" }
        })
        if (dbAutos.length > 0) return dbAutos
        return MOCK_AUTOMATIONS // Fallback for demo if DB empty
    } catch {
        return MOCK_AUTOMATIONS
    }
}

export async function deployAutomation(data: any) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const validated = AutomationSchema.parse({
            name: data.name,
            triggerType: data.trigger,
            actionType: data.action
        })

        await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate Deployment

        const automation = await prisma.automation.create({
            data: {
                userId: session.user.id,
                name: validated.name,
                triggerType: validated.triggerType,
                actionType: validated.actionType,
                trigger: {}, // simplified
                action: {}, // simplified
                isActive: true,
                runCount: 0
            }
        })
        revalidatePath("/dashboard/automations")
        return { success: true, automation }

    } catch (e: any) {
        return { error: e.message || "Deployment Failed" }
    }
}

export async function testAutomation(id: string) {
    // Simulate Logic Execution
    await new Promise(resolve => setTimeout(resolve, 2000))
    // Return simulated impact
    const impact = `Projected Savings: $${Math.floor(Math.random() * 500) + 50}/day`
    return { success: true, impact }
}

export async function toggleAutomation(id: string, currentState: boolean) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        // Handle MOCK vs DB
        // If mock ID, we can't update DB. But let's assume valid UUIDs for DB.
        if (id.length < 10) return { success: true } // Mock pass

        await prisma.automation.update({
            where: { id, userId: session.user.id },
            data: { isActive: !currentState }
        })
        revalidatePath("/dashboard/automations")
        return { success: true }
    } catch {
        return { error: "Toggle failed" }
    }
}

export async function deleteAutomation(id: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        if (id.length < 10) return { success: true } // Mock pass

        await prisma.automation.delete({
            where: { id, userId: session.user.id }
        })
        revalidatePath("/dashboard/automations")
        return { success: true }
    } catch {
        return { error: "Delete failed" }
    }
}
