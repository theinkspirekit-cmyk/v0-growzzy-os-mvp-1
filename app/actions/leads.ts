"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { OpenAIService } from "@/lib/openai-service"

const LeadSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    company: z.string().optional(),
    phone: z.string().optional(),
    estimatedValue: z.number().optional().default(0),
    source: z.string().optional().default("Manual"),
    status: z.string().optional().default("new")
})

export type LeadState = {
    message?: string
    error?: string
    success?: boolean
    lead?: any
}

export async function createLead(data: any): Promise<LeadState> {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { error: "Unauthorized" }
        }

        const validated = LeadSchema.parse(data)

        let aiScore = Math.floor(Math.random() * (98 - 65) + 65)
        try {
            if (process.env.OPENAI_API_KEY) {
                const assessment = await OpenAIService.scoreLead({
                    company: validated.company,
                    email: validated.email,
                    value: validated.estimatedValue
                })
                if (assessment.score) aiScore = assessment.score
            }
        } catch (e) { console.warn("AI Scoring Failed", e) }

        // Simulate "Hub Synchronization" delay involved in webhook
        // In production this would be a real fetch to Zapier/Make
        await new Promise(resolve => setTimeout(resolve, 800))

        const lead = await prisma.lead.create({
            data: {
                ...validated,
                userId: session.user.id,
                aiScore: aiScore,
                status: "new"
            }
        })

        revalidatePath("/dashboard/leads")
        revalidatePath("/dashboard/leads")
        return { success: true, lead: JSON.parse(JSON.stringify(lead)) }
    } catch (err: any) {
        console.error("Create Lead Error:", err)
        return { error: err.message || "Failed to create lead" }
    }
}

export async function getLeads() {
    const session = await auth()
    if (!session?.user?.id) return []

    const leads = await prisma.lead.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" }
    })
    return JSON.parse(JSON.stringify(leads))
}

export async function importLeads(csvData: string): Promise<LeadState> {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    // Simple CSV parsing (Production would use 'csv-parse' or similar)
    const lines = csvData.split('\n').filter(l => l.trim().length > 0)
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())

    // Basic mapping logic
    const emailIdx = headers.findIndex(h => h.includes('email'))
    const nameIdx = headers.findIndex(h => h.includes('name'))
    const companyIdx = headers.findIndex(h => h.includes('company'))

    if (emailIdx === -1) return { error: "CSV must contain an 'email' column" }

    let count = 0

    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim())
        if (cols.length < headers.length) continue

        const email = cols[emailIdx]
        const name = nameIdx > -1 ? cols[nameIdx] : email.split('@')[0]
        const company = companyIdx > -1 ? cols[companyIdx] : undefined

        if (email) {
            try {
                await prisma.lead.create({
                    data: {
                        userId: session.user.id,
                        email,
                        name,
                        company,
                        source: "Import",
                        status: "new",
                        aiScore: 50 // Default
                    }
                })
                count++
            } catch (e) {
                // Ignore duplicates or errors
            }
        }
    }

    revalidatePath("/dashboard/leads")
    return { success: true, message: `Imported ${count} leads` }
}

export async function syncLeadsToHub() {
    // Mock Sync
    await new Promise(resolve => setTimeout(resolve, 1500))
    return { success: true }
}
