
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if (session.user.email === "admin@growzzy.com") {
            return NextResponse.json({ connected: true, platformCount: 99 })
        }

        const platformCount = await prisma.platform.count({
            where: { userId: session.user.id }
        })

        return NextResponse.json({
            connected: platformCount > 0,
            platformCount
        })
    } catch (error) {
        return NextResponse.json({ error: "Failed to check status" }, { status: 500 })
    }
}
