import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ notifications: [], unreadCount: 0 })
    }

    const userId = session.user.id
    
    // Get pagination params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Fetch unread messages
    const unreadMessages = await prisma.message.findMany({
      where: {
        conversation: {
          OR: [{ userAId: userId }, { userBId: userId }],
        },
        senderId: { not: userId },
        isRead: false,
      },
      include: {
        sender: {
          select: { id: true, name: true, fullName: true, username: true, image: true, profilePictureUrl: true },
        },
        conversation: {
          include: {
            userA: { select: { id: true, name: true, fullName: true, username: true, image: true, profilePictureUrl: true } },
            userB: { select: { id: true, name: true, fullName: true, username: true, image: true, profilePictureUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Fetch recent post likes (only for posts owned by this user)
    const recentLikes = await prisma.postLike.findMany({
      where: {
        post: { authorId: userId },
      },
      include: {
        user: {
          select: { id: true, name: true, fullName: true, username: true, image: true, profilePictureUrl: true },
        },
        post: {
          select: { id: true, content: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Fetch recent comments (only for posts owned by this user)
    const recentComments = await prisma.postComment.findMany({
      where: {
        post: { authorId: userId },
      },
      include: {
        author: {
          select: { id: true, name: true, fullName: true, username: true, image: true, profilePictureUrl: true },
        },
        post: {
          select: { id: true, content: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Fetch recent followers
    const recentFollowers = await prisma.follow.findMany({
      where: {
        followingId: userId, // People who followed this user
      },
      include: {
        follower: {
          select: { id: true, name: true, fullName: true, username: true, image: true, profilePictureUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Fetch recent point transactions
    const recentPoints = await prisma.pointTransaction.findMany({
      where: {
        userId,
        points: { gt: 0 }, // Only positive points (earned)
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Transform notifications
    const notifications: any[] = []

    // Add unread messages
    unreadMessages.forEach((msg: any) => {
      const otherUser = msg.conversation.userAId === userId ? msg.conversation.userB : msg.conversation.userA
      notifications.push({
        id: `msg-${msg.id}`,
        type: 'message',
        title: `New message from ${otherUser.fullName || otherUser.name || otherUser.username || 'User'}`,
        message: msg.content || 'Shared a post with you',
        avatar: otherUser.profilePictureUrl || otherUser.image,
        href: `/messages/${otherUser.id}`,
        createdAt: msg.createdAt.toISOString(),
        isRead: msg.isRead,
      })
    })

    // Add likes
    recentLikes.forEach((like: any) => {
      notifications.push({
        id: `like-${like.id}`,
        type: 'like',
        title: `${like.user.fullName || like.user.name || like.user.username || 'User'} liked your post`,
        message: like.post.content ? like.post.content.substring(0, 50) + '...' : 'Your post',
        avatar: like.user.profilePictureUrl || like.user.image,
        href: `/post/${like.post.id}`,
        createdAt: like.createdAt.toISOString(),
        isRead: false,
      })
    })

    // Add comments
    recentComments.forEach((comment: any) => {
      notifications.push({
        id: `comment-${comment.id}`,
        type: 'comment',
        title: `${comment.author.fullName || comment.author.name || comment.author.username || 'User'} commented on your post`,
        message: comment.content || '',
        avatar: comment.author.profilePictureUrl || comment.author.image,
        href: `/post/${comment.post.id}`,
        createdAt: comment.createdAt.toISOString(),
        isRead: false,
      })
    })

    // Add followers
    recentFollowers.forEach((follow: any) => {
      notifications.push({
        id: `follow-${follow.id}`,
        type: 'follow',
        title: `${follow.follower.fullName || follow.follower.name || follow.follower.username || 'User'} started following you`,
        message: 'Check out their profile!',
        avatar: follow.follower.profilePictureUrl || follow.follower.image,
        href: `/profile/${follow.follower.id}`,
        createdAt: follow.createdAt.toISOString(),
        isRead: false,
      })
    })

    // Add point transactions
    recentPoints.forEach((transaction: any) => {
      notifications.push({
        id: `points-${transaction.id}`,
        type: 'points',
        title: `+${transaction.points} points earned!`,
        message: transaction.description || `You earned points for ${transaction.action}`,
        avatar: undefined,
        href: '/dashboard',
        createdAt: transaction.createdAt.toISOString(),
        isRead: false,
      })
    })

    // Sort all notifications by createdAt (most recent first)
    notifications.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Apply pagination
    const paginatedNotifications = notifications.slice(skip, skip + limit)

    // Count unread notifications (only for first page)
    const unreadCount = page === 1 ? notifications.filter((n: any) => !n.isRead).length : 0

    return NextResponse.json({
      notifications: paginatedNotifications,
      unreadCount,
      hasMore: skip + limit < notifications.length,
      total: notifications.length,
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { notifications: [], unreadCount: 0 },
      { status: 500 }
    )
  }
}




