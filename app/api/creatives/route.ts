import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// ============================================
// GET — List all creatives for the user
// ============================================
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 })
    }

    const creatives = await prisma.creative.findMany({
      where: { userId: session.user.id },
      include: { campaign: { select: { id: true, name: true, status: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ ok: true, data: { creatives } })
  } catch (error: any) {
    console.error('[API] GET /api/creatives error:', error)
    return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
  }
}

// ============================================
// POST — Create a creative (manual, not AI gen)
// ============================================
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 })
    }

    const body = await request.json()
    const { name, headline, bodyText, ctaText, type, format, campaignId, imageUrl } = body

    if (!name || !type || !format) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Name, type, and format are required' } }, { status: 400 })
    }

    const creative = await prisma.creative.create({
      data: {
        userId: session.user.id,
        name,
        headline,
        bodyText,
        ctaText,
        type: type || 'image',
        format: format || 'feed',
        imageUrl: imageUrl || null,
        campaignId: campaignId || null,
        status: 'draft',
        aiGenerated: false,
      },
    })

    return NextResponse.json({ ok: true, data: { creative } })
  } catch (error: any) {
    console.error('[API] POST /api/creatives error:', error)
    return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
  }
}

// ============================================
// PATCH — Update a creative
// ============================================
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Creative ID is required' } }, { status: 400 })
    }

    const creative = await prisma.creative.update({
      where: { id, userId: session.user.id },
      data: updates,
    })

    return NextResponse.json({ ok: true, data: { creative } })
  } catch (error: any) {
    console.error('[API] PATCH /api/creatives error:', error)
    return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
  }
}

// ============================================
// DELETE — Delete a creative
// ============================================
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ ok: false, error: { code: 'VALIDATION', message: 'Creative ID required' } }, { status: 400 })
    }

    await prisma.creative.delete({
      where: { id, userId: session.user.id },
    })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('[API] DELETE /api/creatives error:', error)
    return NextResponse.json({ ok: false, error: { code: 'INTERNAL', message: error.message } }, { status: 500 })
  }
}
