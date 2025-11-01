import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const profileUpdateSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  username: z.string().regex(/^[a-zA-Z0-9_]+$/).min(3).max(30).optional(),
  bio: z.string().max(500).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  profilePicture: z.string().url().optional(),
  coverPhoto: z.string().url().optional(),
})

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await req.json()
    const data = profileUpdateSchema.parse(body)

    if (data.username) {
      const existing = await prisma.user.findUnique({ where: { username: data.username } })
      if (existing && existing.id !== session.user.id) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
      }
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        fullName: data.fullName,
        username: data.username,
        bio: data.bio ?? undefined,
        location: data.location ?? undefined,
        phone: data.phone ?? undefined,
        profilePictureUrl: data.profilePicture,
        coverPhotoUrl: data.coverPhoto,
      }
    })

    return NextResponse.json({ success: true, userId: updated.id })
  } catch (err: any) {
    console.error('Profile update error:', err)
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues?.[0]?.message || 'Invalid input' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


