import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncAllUserConnections } from "@/lib/background-sync";

export const dynamic = "force-dynamic";

/**
 * GET /api/cron/sync
 * System-wide sync trigger. 
 * In production, this should be protected by a secret header (CRON_SECRET)
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Cron] Starting system-wide platform sync");

    // Get all users with active platforms
    const usersWithPlatforms = await prisma.user.findMany({
      where: {
        platforms: {
          some: {
            isActive: true,
          },
        },
      },
      select: {
        id: true,
      },
    });

    console.log(`[Cron] Found ${usersWithPlatforms.length} users with active platforms`);

    const results = [];
    for (const user of usersWithPlatforms) {
      try {
        const stats = await syncAllUserConnections(user.id);
        results.push({ userId: user.id, ...stats });
      } catch (err: any) {
        console.error(`[Cron] Sync failed for user ${user.id}:`, err.message);
        results.push({ userId: user.id, success: false, error: err.message });
      }
    }

    return NextResponse.json({
      ok: true,
      data: {
        processedUsers: usersWithPlatforms.length,
        results,
      },
    });
  } catch (error: any) {
    console.error("[Cron] Global sync error:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
