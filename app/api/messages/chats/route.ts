import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const conversations = await prisma.conversation.findMany({
      where: { OR: [{ userAId: userId }, { userBId: userId }] },
      include: {
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        userA: { select: { id: true, name: true, fullName: true, username: true, image: true, profilePictureUrl: true } },
        userB: { select: { id: true, name: true, fullName: true, username: true, image: true, profilePictureUrl: true } },
      },
      orderBy: { updatedAt: 'desc' },
    })

    const chats = await Promise.all(conversations.map(async (c: any) => {
      const other = c.userAId === userId ? c.userB : c.userA
      const unreadCount = await prisma.message.count({
        where: { conversationId: c.id, senderId: { not: userId }, isRead: false },
      })
      const last = c.messages[0]
      return {
        id: c.id,
        userId: other.id,
        name: other.fullName || other.name || other.username || 'User',
        avatar: other.profilePictureUrl || other.image || undefined,
        lastMessage: last?.content || (last?.postId ? 'Shared a post' : ''),
        lastMessageTime: last?.createdAt ?? c.updatedAt,
        unreadCount,
        type: 'user',
      }
    }))

    return NextResponse.json({ chats })
  } catch (error) {
    console.error('Chats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
