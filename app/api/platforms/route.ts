import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const platforms = await prisma.platform.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ success: true, platforms })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const { name, accountName, accessToken, refreshToken } = body

        if (!name || !accountName) return NextResponse.json({ error: 'Parameter mismatch' }, { status: 400 })

        const platform = await prisma.platform.create({
            data: {
                userId: session.user.id,
                name,
                accountName,
                accessToken: accessToken || 'demo_token',
                refreshToken: refreshToken || 'demo_refresh'
            }
        })

        return NextResponse.json({ success: true, platform })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        await prisma.platform.delete({ where: { id, userId: session.user.id } })
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
