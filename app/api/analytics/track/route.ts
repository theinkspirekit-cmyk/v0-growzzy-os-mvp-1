import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/analytics/track
 * Generic endpoint for tracking events (clicks, conversions, impressions)
 * Used by webhooks or client-side trackers.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            platform,
            eventType,
            eventValue,
            campaignId,
            userId,
            metadata,
            date
        } = body;

        if (!platform || !eventType) {
            return NextResponse.json({ ok: false, error: "Platform and eventType are required" }, { status: 400 });
        }

        // Determine target user (from body or session if available)
        // For many webhooks, the userId might be encoded in the URL or payload
        const targetUserId = userId; // In production, verify this with a signature or token

        if (!targetUserId) {
            return NextResponse.json({ ok: false, error: "userId is required for tracking" }, { status: 400 });
        }

        // Create the event record
        const event = await prisma.analyticsEvent.create({
            data: {
                userId: targetUserId,
                platform,
                campaignId,
                date: date ? new Date(date) : new Date(),
                impressions: eventType === 'impression' ? (eventValue || 1) : 0,
                clicks: eventType === 'click' ? (eventValue || 1) : 0,
                conversions: eventType === 'conversion' ? (eventValue || 1) : 0,
                spend: eventType === 'spend' ? (eventValue || 0) : 0,
                revenue: eventType === 'revenue' ? (eventValue || 0) : 0,
                metadata: metadata || null,
            }
        });

        console.log(`[Track] Recorded ${eventType} for ${platform} (${targetUserId})`);

        // Optional: Real-time aggregation into the Analytics table for performance
        // For now, we'll let the GET /overview API handle aggregation from raw events

        return NextResponse.json({ ok: true, data: { id: event.id } });
    } catch (error: any) {
        console.error("[Track] Error:", error);
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
}
