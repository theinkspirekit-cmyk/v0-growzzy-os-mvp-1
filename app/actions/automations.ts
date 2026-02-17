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

const MOCK_AUTOMATIONS: any[] = [] // Removed mocks to force DB usage

export async function getAutomations() {
    const session = await auth()
    if (!session?.user?.id) return []

    try {
        const dbAutos = await prisma.automation.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" }
        })
        return JSON.parse(JSON.stringify(dbAutos))
    } catch (e) {
        console.error("Get Automations Error", e)
        return []
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

        // Simulate Deployment Latency
        await new Promise(resolve => setTimeout(resolve, 800))

        const automation = await prisma.automation.create({
            data: {
                userId: session.user.id,
                name: validated.name,
                triggerType: validated.triggerType,
                actionType: validated.actionType,
                trigger: { type: validated.triggerType }, // Store simplified logic
                action: { type: validated.actionType },
                status: "active",
                runCount: 0
            }
        })
        revalidatePath("/dashboard/automations")
        return { success: true, automation: JSON.parse(JSON.stringify(automation)) }

    } catch (e: any) {
        return { error: e.message || "Deployment Failed" }
    }
}

export async function testAutomation(id: string) {
    // Simulate Logic Execution
    await new Promise(resolve => setTimeout(resolve, 1500))
    const impact = `Projected Savings: $${Math.floor(Math.random() * 500) + 50}/day`
    return { success: true, impact }
}

export async function toggleAutomation(id: string, currentState: boolean) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        // currentState passed from frontend might be based on old boolean logic or new string logic
        // But the function signature says boolean. 
        // Let's ignore currentState arg and just flip based on DB or pass the target status string.
        // Actually, to be safe, I'll fetch the current one or just trust the intent.
        // The frontend sends `!isActive` (boolean). 
        // If frontend sends `true` (meaning "make active"), I set "active".
        // If `false` (meaning "make paused"), I set "paused".

        const targetStatus = currentState ? "active" : "paused"

        await prisma.automation.update({
            where: { id, userId: session.user.id },
            data: { status: targetStatus }
        })
        revalidatePath("/dashboard/automations")
        return { success: true }
    } catch (e) {
        return { error: "Toggle failed" }
    }
}

export async function deleteAutomation(id: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        await prisma.automation.delete({
            where: { id, userId: session.user.id }
        })
        revalidatePath("/dashboard/automations")
        return { success: true }
    } catch {
        return { error: "Delete failed" }
    }
}

export async function getAutomationDetails(id: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const automation = await prisma.automation.findFirst({
            where: { id, userId: session.user.id }
        })

        if (!automation) {
            return { error: "Automation not found" }
        }

        // Get execution history
        const executions = await prisma.automationExecution.findMany({
            where: { automationId: id },
            orderBy: { executedAt: "desc" },
            take: 20
        })

        return {
            automation: JSON.parse(JSON.stringify(automation)),
            executions: JSON.parse(JSON.stringify(executions))
        }
    } catch (e: any) {
        return { error: e.message || "Failed to fetch automation" }
    }
}

export async function updateAutomationRules(id: string, rules: any) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const automation = await prisma.automation.update({
            where: { id, userId: session.user.id },
            data: {
                trigger: rules.trigger,
                action: rules.action,
                conditions: rules.conditions
            }
        })

        revalidatePath("/dashboard/automations")
        return { success: true, automation: JSON.parse(JSON.stringify(automation)) }
    } catch (e: any) {
        return { error: e.message || "Failed to update rules" }
    }
}

export async function getAutomationStats() {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const automations = await prisma.automation.findMany({
            where: { userId: session.user.id }
        })

        const activeCount = automations.filter(a => a.status === "active").length
        const totalRuns = automations.reduce((sum, a) => sum + (a.runCount || 0), 0)

        // Get executions for this month
        const monthStart = new Date()
        monthStart.setDate(1)

        const monthExecutions = await prisma.automationExecution.count({
            where: {
                automation: { userId: session.user.id },
                executedAt: { gte: monthStart }
            }
        })

        return {
            totalAutomations: automations.length,
            activeAutomations: activeCount,
            totalRuns,
            monthExecutions,
            savePercentage: 15 + Math.random() * 25 // Mock percentage
        }
    } catch (e: any) {
        return { error: e.message || "Failed to fetch stats" }
    }
}

export async function cloneAutomation(id: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const original = await prisma.automation.findFirst({
            where: { id, userId: session.user.id }
        })

        if (!original) {
            return { error: "Automation not found" }
        }

        const cloned = await prisma.automation.create({
            data: {
                userId: session.user.id,
                name: `${original.name} (Copy)`,
                triggerType: original.triggerType,
                actionType: original.actionType,
                trigger: original.trigger,
                action: original.action,
                conditions: original.conditions,
                status: "draft",
                runCount: 0
            }
        })

        revalidatePath("/dashboard/automations")
        return { success: true, automation: JSON.parse(JSON.stringify(cloned)) }
    } catch (e: any) {
        return { error: e.message || "Failed to clone automation" }
    }
}
