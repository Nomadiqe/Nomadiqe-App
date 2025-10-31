import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const targetUserId = params.id
    const followerId = session.user.id

    if (targetUserId === followerId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: targetUserId,
        },
      },
    })

    if (existingFollow) {
      return NextResponse.json(
        { error: 'Already following this user' },
        { status: 400 }
      )
    }

    // Create follow relationship
    await prisma.follow.create({
      data: {
        followerId,
        followingId: targetUserId,
      },
    })

    // Award points for following (if not following yourself)
    if (followerId !== targetUserId) {
      try {
        const { awardPoints } = await import('@/lib/services/points-service')
        await awardPoints({
          userId: followerId,
          action: 'follow_user',
          referenceId: targetUserId,
          referenceType: 'user',
          description: `Started following ${targetUser.name || targetUser.username || 'a user'}`,
        })
      } catch (pointsError) {
        // Points award failed, but follow should still succeed
        console.error('Error awarding points for follow:', pointsError)
      }
    }

    // Award points to the user being followed
    try {
      const { awardPoints } = await import('@/lib/services/points-service')
      await awardPoints({
        userId: targetUserId,
        action: 'follower_gained',
        referenceId: followerId,
        referenceType: 'user',
        description: `${session.user.name || 'Someone'} started following you`,
      })
    } catch (pointsError) {
      // Points award failed, but follow should still succeed
      console.error('Error awarding points for follower gained:', pointsError)
    }

    // Get updated follower/following counts
    const [followersCount, followingCount] = await Promise.all([
      prisma.follow.count({ where: { followingId: targetUserId } }),
      prisma.follow.count({ where: { followerId: targetUserId } }),
    ])

    return NextResponse.json({
      success: true,
      isFollowing: true,
      followersCount,
      followingCount,
    })
  } catch (error) {
    console.error('Error following user:', error)
    return NextResponse.json(
      { error: 'Failed to follow user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const targetUserId = params.id
    const followerId = session.user.id

    // Check if follow relationship exists
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: targetUserId,
        },
      },
    })

    if (!existingFollow) {
      return NextResponse.json(
        { error: 'Not following this user' },
        { status: 400 }
      )
    }

    // Delete follow relationship
    await prisma.follow.delete({
      where: {
        id: existingFollow.id,
      },
    })

    // Get updated follower/following counts
    const [followersCount, followingCount] = await Promise.all([
      prisma.follow.count({ where: { followingId: targetUserId } }),
      prisma.follow.count({ where: { followerId: targetUserId } }),
    ])

    return NextResponse.json({
      success: true,
      isFollowing: false,
      followersCount,
      followingCount,
    })
  } catch (error) {
    console.error('Error unfollowing user:', error)
    return NextResponse.json(
      { error: 'Failed to unfollow user' },
      { status: 500 }
    )
  }
}

// GET to check if current user is following this user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const targetUserId = params.id
    const followerId = session.user.id

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: targetUserId,
        },
      },
    })

    return NextResponse.json({
      isFollowing: !!existingFollow,
    })
  } catch (error) {
    console.error('Error checking follow status:', error)
    return NextResponse.json(
      { error: 'Failed to check follow status' },
      { status: 500 }
    )
  }
}
