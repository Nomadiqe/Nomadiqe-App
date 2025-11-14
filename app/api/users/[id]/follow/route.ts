import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const targetUserId = params.id
    const followerId = user.id

    if (targetUserId === followerId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    // Check if user exists
    const { data: targetUser, error: userError } = await supabase
      .from('users')
      .select('id, name, username')
      .eq('id', targetUserId)
      .single()

    if (userError || !targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already following
    const { data: existingFollow } = await supabase
      .from('follows')
      .select('id')
      .eq('followerId', followerId)
      .eq('followingId', targetUserId)
      .single()

    if (existingFollow) {
      return NextResponse.json(
        { error: 'Already following this user' },
        { status: 400 }
      )
    }

    // Create follow relationship
    await supabase
      .from('follows')
      .insert({
        followerId,
        followingId: targetUserId,
        createdAt: new Date().toISOString(),
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
      const { data: currentUser } = await supabase
        .from('users')
        .select('name')
        .eq('id', followerId)
        .single()
        
      await awardPoints({
        userId: targetUserId,
        action: 'follower_gained',
        referenceId: followerId,
        referenceType: 'user',
        description: `${currentUser?.name || 'Someone'} started following you`,
      })
    } catch (pointsError) {
      // Points award failed, but follow should still succeed
      console.error('Error awarding points for follower gained:', pointsError)
    }

    // Get updated follower/following counts
    const [{ count: followersCount }, { count: followingCount }] = await Promise.all([
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('followingId', targetUserId),
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('followerId', targetUserId),
    ])

    return NextResponse.json({
      success: true,
      isFollowing: true,
      followersCount: followersCount || 0,
      followingCount: followingCount || 0,
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
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const targetUserId = params.id
    const followerId = user.id

    // Check if follow relationship exists
    const { data: existingFollow } = await supabase
      .from('follows')
      .select('id')
      .eq('followerId', followerId)
      .eq('followingId', targetUserId)
      .single()

    if (!existingFollow) {
      return NextResponse.json(
        { error: 'Not following this user' },
        { status: 400 }
      )
    }

    // Delete follow relationship
    await supabase
      .from('follows')
      .delete()
      .eq('id', existingFollow.id)

    // Get updated follower/following counts
    const [{ count: followersCount }, { count: followingCount }] = await Promise.all([
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('followingId', targetUserId),
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('followerId', targetUserId),
    ])

    return NextResponse.json({
      success: true,
      isFollowing: false,
      followersCount: followersCount || 0,
      followingCount: followingCount || 0,
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
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const targetUserId = params.id
    const followerId = user.id

    const { data: existingFollow } = await supabase
      .from('follows')
      .select('id')
      .eq('followerId', followerId)
      .eq('followingId', targetUserId)
      .single()

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
