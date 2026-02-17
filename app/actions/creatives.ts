"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { OpenAIService } from "@/lib/openai-service"

const GenerateSchema = z.object({
    product_name: z.string().min(1),
    target_audience: z.string().optional(),
    goal: z.string().optional(),
    platform: z.string().optional(),
    format: z.string().optional(),
    aspect: z.string().optional(),
    cta: z.string().optional(),
    tone: z.string().optional(),
    style: z.string().optional()
})

const MOCK_IMAGES = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80"
]

export async function getCreatives() {
    const session = await auth()
    if (!session?.user?.id) return []
    const creatives = await prisma.creative.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" }
    })
    return JSON.parse(JSON.stringify(creatives))
}


export async function generateCreative(data: any) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const validated = GenerateSchema.parse(data)

        // Try Real AI first
        let aiResult = null
        try {
            if (process.env.OPENAI_API_KEY) {
                const response = await OpenAIService.generateAdCreative({
                    platform: validated.platform || 'General',
                    objective: validated.goal || 'Conversions',
                    targetAudience: validated.target_audience || 'General Audience',
                    keyBenefit: `Promote ${validated.product_name} effectively. Tone: ${validated.tone || 'Professional'}. Style: ${validated.style || 'Modern'}`,
                })
                if (response.creatives && response.creatives.length > 0) {
                    aiResult = response.creatives[0]
                }
            }
        } catch (scanError) {
            console.warn("OpenAI Generation Failed, using backup:", scanError)
        }

        // Fallback simulation if AI failed or no key
        if (!aiResult) {
            await new Promise(resolve => setTimeout(resolve, 2000))
        }

        const randomImage = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)]

        const creative = await prisma.creative.create({
            data: {
                userId: session.user.id,
                name: `${validated.product_name} - ${validated.platform || 'General'}`,
                type: "image",
                format: "feed",
                headline: aiResult?.headline || `Experience the best of ${validated.product_name}`,
                bodyText: aiResult?.primaryText || `Unlock your potential with ${validated.product_name}. Designed for ${validated.target_audience || 'visionaries'}.`,
                ctaText: aiResult?.cta || "Shop Now",
                imageUrl: randomImage,
                aiGenerated: true,
                aiScore: aiResult?.predictedScore || (Math.floor(Math.random() * 20) + 80),
                status: "draft"
            }
        })

        revalidatePath("/dashboard/creatives")
        // Serialize to prevent "Client-side exception" with Dates
        return { success: true, creative: JSON.parse(JSON.stringify(creative)) }

    } catch (e: any) {
        return { error: e.message || "Generation failed" }
    }
}

export async function deleteCreative(id: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        await prisma.creative.delete({
            where: { id, userId: session.user.id }
        })
        revalidatePath("/dashboard/creatives")
        return { success: true }
    } catch (e) {
        return { error: "Delete failed" }
    }
}

export async function saveContent(data: { title: string, content: string, type: string }) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const creative = await prisma.creative.create({
            data: {
                userId: session.user.id,
                name: data.title,
                type: "text",
                format: data.type.toLowerCase().includes("video") ? "script" : "article",
                bodyText: data.content,
                aiGenerated: true,
                status: "draft",
                headline: data.title // Use title as headline for reference
            }
        })
        revalidatePath("/dashboard/creatives")
        return { success: true, creative: JSON.parse(JSON.stringify(creative)) }
    } catch (e: any) {
        console.error("Save Content Failed", e)
        return { error: "Failed to save content" }
    }
}

export async function updateCreative(id: string, data: any) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const creative = await prisma.creative.update({
            where: { id, userId: session.user.id },
            data: {
                name: data.name,
                headline: data.headline,
                bodyText: data.bodyText,
                ctaText: data.ctaText
            }
        })

        revalidatePath("/dashboard/creatives")
        return { success: true, creative: JSON.parse(JSON.stringify(creative)) }
    } catch (e: any) {
        return { error: e.message || "Failed to update creative" }
    }
}

export async function publishCreative(id: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const creative = await prisma.creative.update({
            where: { id, userId: session.user.id },
            data: { status: "published" }
        })

        revalidatePath("/dashboard/creatives")
        return { success: true, creative: JSON.parse(JSON.stringify(creative)) }
    } catch (e: any) {
        return { error: e.message || "Failed to publish creative" }
    }
}

export async function getCreativesByPlatform(platform: string) {
    const session = await auth()
    if (!session?.user?.id) return []

    try {
        const creatives = await prisma.creative.findMany({
            where: {
                userId: session.user.id,
                platform: platform
            },
            orderBy: { createdAt: "desc" }
        })

        return JSON.parse(JSON.stringify(creatives))
    } catch {
        return []
    }
}

export async function getCreativesByStatus(status: string) {
    const session = await auth()
    if (!session?.user?.id) return []

    try {
        const creatives = await prisma.creative.findMany({
            where: {
                userId: session.user.id,
                status: status
            },
            orderBy: { createdAt: "desc" }
        })

        return JSON.parse(JSON.stringify(creatives))
    } catch {
        return []
    }
}

export async function getCreativePerformance(id: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const creative = await prisma.creative.findFirst({
            where: { id, userId: session.user.id }
        })

        if (!creative) {
            return { error: "Creative not found" }
        }

        // Fetch performance metrics
        const metrics = await prisma.performanceMetric.findMany({
            where: {
                userId: session.user.id,
                entityId: id,
                entityType: "creative"
            },
            orderBy: { periodDate: "desc" },
            take: 30
        })

        return {
            creative: JSON.parse(JSON.stringify(creative)),
            metrics: JSON.parse(JSON.stringify(metrics))
        }
    } catch (e: any) {
        return { error: e.message || "Failed to fetch performance" }
    }
}
