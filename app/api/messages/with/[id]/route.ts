import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const otherUserId = params.id
    const currentUserId = session.user.id

    const userAId = currentUserId < otherUserId ? currentUserId : otherUserId
    const userBId = currentUserId < otherUserId ? otherUserId : currentUserId

    const conversation = await prisma.conversation.upsert({
      where: { userAId_userBId: { userAId, userBId } },
      update: {},
      create: { userAId, userBId },
    })

    const messages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
    })

    // Mark others' messages as read
    await prisma.message.updateMany({
      where: { conversationId: conversation.id, senderId: { not: currentUserId }, isRead: false },
      data: { isRead: true },
    })

    return NextResponse.json({ conversationId: conversation.id, messages })
  } catch (error) {
    console.error('Fetch messages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
