import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify user is an influencer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { influencerProfile: true }
    })

    if (!user || user.role !== 'INFLUENCER' || !user.influencerProfile) {
      return NextResponse.json(
        { error: 'This endpoint is only for influencers' },
        { status: 403 }
      )
    }

    // Fetch all social connections for the user
    const connections = await prisma.socialConnection.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        platform: true,
        username: true,
        followerCount: true,
        isPrimary: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      connections,
      count: connections.length
    })

  } catch (error) {
    console.error('Fetch social connections error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social connections' },
      { status: 500 }
    )
  }
}
