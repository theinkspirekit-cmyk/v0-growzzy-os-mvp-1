import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// Use a simple import for Prisma Client
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        emailVerified: true // Set to true by default for now to match current flow
      }
    })

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      userId: user.id,
    })
  } catch (error: any) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 })
  }
}
