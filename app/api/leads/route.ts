import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  // Mock Admin Bypass
  const userId = session?.user?.id || (session?.user?.email === "admin@growzzy.com" ? "mock-user-id" : null)

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const leads = await prisma.lead.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    })

    // Seed mock leads if empty for admin demo
    if (leads.length === 0 && userId === "mock-user-id") {
      return NextResponse.json({
        leads: [
          { id: "1", firstName: "Sarah", lastName: "Connor", company: "Cyberdyne", status: "New", value: 5000, score: 85 },
          { id: "2", firstName: "John", lastName: "Smith", company: "Matrix Inc", status: "Qualified", value: 12000, score: 92 },
        ]
      })
    }

    return NextResponse.json({ leads })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  const userId = session?.user?.id || (session?.user?.email === "admin@growzzy.com" ? "mock-user-id" : null)

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()

    // Create Real Lead
    const newLead = await prisma.lead.create({
      data: {
        userId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        company: body.company,
        status: "NEW",
        source: "Manual",
        score: Math.floor(Math.random() * 40) + 60, // Mock AI Score for now
        value: Number(body.value) || 0
      }
    })

    return NextResponse.json(newLead)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 })
  }
}
