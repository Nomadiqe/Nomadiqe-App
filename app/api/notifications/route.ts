import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ notifications: [], unreadCount: 0 })
    }

    const userId = user.id

    // Fetch unread messages
    const { data: unreadMessages } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!senderId (id, name, fullName, username, image, profilePictureUrl),
        conversation:conversations (
          *,
          userA:users!userAId (id, name, fullName, username, image, profilePictureUrl),
          userB:users!userBId (id, name, fullName, username, image, profilePictureUrl)
        )
      `)
      .neq('senderId', userId)
      .eq('isRead', false)
      .order('createdAt', { ascending: false })
      .limit(10)

    // Fetch recent post likes (only for posts owned by this user)
    const { data: recentLikes } = await supabase
      .from('post_likes')
      .select(`
        *,
        user:users!userId (id, name, fullName, username, image, profilePictureUrl),
        post:posts!postId (id, content, authorId)
      `)
      .order('createdAt', { ascending: false })
      .limit(100) // Get more to filter

    const userLikes = (recentLikes || []).filter((like: any) => like.post?.authorId === userId).slice(0, 10)

    // Fetch recent comments (only for posts owned by this user)
    const { data: recentComments } = await supabase
      .from('post_comments')
      .select(`
        *,
        author:users!authorId (id, name, fullName, username, image, profilePictureUrl),
        post:posts!postId (id, content, authorId)
      `)
      .order('createdAt', { ascending: false })
      .limit(100) // Get more to filter

    const userComments = (recentComments || []).filter((comment: any) => comment.post?.authorId === userId).slice(0, 10)

    // Fetch recent followers
    const { data: recentFollowers } = await supabase
      .from('follows')
      .select(`
        *,
        follower:users!followerId (id, name, fullName, username, image, profilePictureUrl)
      `)
      .eq('followingId', userId)
      .order('createdAt', { ascending: false })
      .limit(10)

    // Fetch recent point transactions
    const { data: recentPoints } = await supabase
      .from('point_transactions')
      .select('*')
      .eq('userId', userId)
      .gt('points', 0)
      .order('createdAt', { ascending: false })
      .limit(10)

    // Transform notifications
    const notifications: any[] = []

    // Add unread messages
    ;(unreadMessages || []).forEach((msg: any) => {
      if (!msg.conversation) return
      const otherUser = msg.conversation.userAId === userId ? msg.conversation.userB : msg.conversation.userA
      if (!otherUser) return
      notifications.push({
        id: `msg-${msg.id}`,
        type: 'message',
        title: `New message from ${otherUser.fullName || otherUser.name || otherUser.username || 'User'}`,
        message: msg.content || 'Shared a post with you',
        avatar: otherUser.profilePictureUrl || otherUser.image,
        href: `/messages/${otherUser.id}`,
        createdAt: msg.createdAt,
        isRead: msg.isRead,
      })
    })

    // Add likes
    userLikes.forEach((like: any) => {
      notifications.push({
        id: `like-${like.id}`,
        type: 'like',
        title: `${like.user.fullName || like.user.name || like.user.username || 'User'} liked your post`,
        message: like.post.content ? like.post.content.substring(0, 50) + '...' : 'Your post',
        avatar: like.user.profilePictureUrl || like.user.image,
        href: `/post/${like.post.id}`,
        createdAt: like.createdAt,
        isRead: false,
      })
    })

    // Add comments
    userComments.forEach((comment: any) => {
      notifications.push({
        id: `comment-${comment.id}`,
        type: 'comment',
        title: `${comment.author.fullName || comment.author.name || comment.author.username || 'User'} commented on your post`,
        message: comment.content || '',
        avatar: comment.author.profilePictureUrl || comment.author.image,
        href: `/post/${comment.post.id}`,
        createdAt: comment.createdAt,
        isRead: false,
      })
    })

    // Add followers
    ;(recentFollowers || []).forEach((follow: any) => {
      notifications.push({
        id: `follow-${follow.id}`,
        type: 'follow',
        title: `${follow.follower.fullName || follow.follower.name || follow.follower.username || 'User'} started following you`,
        message: 'Check out their profile!',
        avatar: follow.follower.profilePictureUrl || follow.follower.image,
        href: `/profile/${follow.follower.id}`,
        createdAt: follow.createdAt,
        isRead: false,
      })
    })

    // Add point transactions
    ;(recentPoints || []).forEach((transaction: any) => {
      notifications.push({
        id: `points-${transaction.id}`,
        type: 'points',
        title: `+${transaction.points} points earned!`,
        message: transaction.description || `You earned points for ${transaction.action}`,
        avatar: undefined,
        href: '/dashboard',
        createdAt: transaction.createdAt,
        isRead: false,
      })
    })

    // Sort all notifications by createdAt (most recent first)
    notifications.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Limit to 20 most recent notifications
    const limitedNotifications = notifications.slice(0, 20)

    // Count unread notifications
    const unreadCount = notifications.filter((n: any) => !n.isRead).length

    return NextResponse.json({
      notifications: limitedNotifications,
      unreadCount,
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { notifications: [], unreadCount: 0 },
      { status: 500 }
    )
  }
}
