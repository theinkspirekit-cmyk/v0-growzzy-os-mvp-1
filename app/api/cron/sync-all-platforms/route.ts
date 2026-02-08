import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { syncAllPlatforms } from "@/lib/platform-sync"

export async function POST(request: Request) {
  if (request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    console.log("[v0] Starting cron platform sync...")

    // Get all users with active connections
    const { data: users, error: usersError } = await supabaseAdmin
      .from("platform_connections")
      .select("user_id")
      .eq("is_active", true)
      .then((res) => ({
        data: [...new Set((res.data || []).map((c: any) => c.user_id))],
        error: res.error,
      }))

    if (usersError) throw usersError

    if (!users || users.length === 0) {
      return NextResponse.json({ synced: 0, message: "No users with active connections" })
    }

    let totalSynced = 0

    // Sync for each user
    for (const userId of users) {
      try {
        const result = await syncAllPlatforms(userId)
        totalSynced += result.synced
        console.log(`[v0] Synced ${result.synced} campaigns for user ${userId}`)
      } catch (error) {
        console.error(`[v0] Error syncing user ${userId}:`, error)
      }
    }

    console.log(`[v0] Cron sync complete. Total synced: ${totalSynced}`)

    return NextResponse.json({
      success: true,
      users: users.length,
      synced: totalSynced,
    })
  } catch (error: any) {
    console.error("[v0] Cron sync error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
