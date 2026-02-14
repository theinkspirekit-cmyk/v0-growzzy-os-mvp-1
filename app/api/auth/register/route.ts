export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    // Check if user already exists
    let existingUser = null
    try {
      existingUser = await prisma.user.findUnique({
        where: { email }
      })
    } catch (dbError: any) {
      console.error("[register] Database connection error:", dbError.message)
      if (dbError.message.includes("reaching") || dbError.message.includes("authentication") || dbError.message.includes("reach")) {
        return NextResponse.json({
          error: "Unable to reach the database. This usually means the DATABASE_URL in .env.local is incorrect or the DB is in sleep mode. Please verify your Supabase credentials.",
          details: dbError.message
        }, { status: 503 })
      }
      throw dbError // Re-throw if it's an unexpected error
    }

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user in database
    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          emailVerified: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        message: "Account created successfully",
        userId: user.id,
      })
    } catch (createError: any) {
      console.error("[register] Create user error:", createError.message)
      return NextResponse.json({
        error: "Failed to create user record. The database might be offline or using restricted credentials.",
        details: createError.message
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 })
  }
}

