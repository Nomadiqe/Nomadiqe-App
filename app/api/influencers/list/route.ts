import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all influencers with their social connections
    const influencers = await prisma.user.findMany({
      where: {
        role: 'INFLUENCER',
        influencerProfile: {
          isNot: null,
        },
      },
      select: {
        id: true,
        name: true,
        fullName: true,
        username: true,
        image: true,
        profilePictureUrl: true,
        bio: true,
        location: true,
        influencerProfile: {
          select: {
            id: true,
            contentNiches: true,
            verificationStatus: true,
            portfolioUrl: true,
          },
        },
        socialConnections: {
          select: {
            platform: true,
            username: true,
            followerCount: true,
            isPrimary: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Format influencers with total follower count
    const formattedInfluencers = influencers.map((influencer) => {
      const totalFollowers = influencer.socialConnections.reduce(
        (acc, conn) => acc + (conn.followerCount || 0),
        0
      )

      const primarySocial = influencer.socialConnections.find(conn => conn.isPrimary) ||
        influencer.socialConnections[0]

      return {
        id: influencer.id,
        name: influencer.fullName || influencer.name || influencer.username || 'Influencer',
        username: influencer.username,
        image: influencer.profilePictureUrl || influencer.image,
        bio: influencer.bio,
        location: influencer.location,
        contentNiches: influencer.influencerProfile?.contentNiches || [],
        verificationStatus: influencer.influencerProfile?.verificationStatus,
        portfolioUrl: influencer.influencerProfile?.portfolioUrl,
        totalFollowers,
        primaryPlatform: primarySocial?.platform,
        primaryUsername: primarySocial?.username,
        socialConnections: influencer.socialConnections,
      }
    })

    return NextResponse.json({ influencers: formattedInfluencers })
  } catch (error) {
    console.error('Error fetching influencers:', error)
    return NextResponse.json({ error: 'Failed to fetch influencers' }, { status: 500 })
  }
}
