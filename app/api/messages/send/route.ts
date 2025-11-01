import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { recipientId, content, postId } = await request.json()
    if (!recipientId || typeof recipientId !== 'string') {
      return NextResponse.json({ error: 'recipientId required' }, { status: 400 })
    }

    const currentUserId = session.user.id
    const userAId = currentUserId < recipientId ? currentUserId : recipientId
    const userBId = currentUserId < recipientId ? recipientId : currentUserId

    const conversation = await prisma.conversation.upsert({
      where: { userAId_userBId: { userAId, userBId } },
      update: {},
      create: { userAId, userBId },
    })

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: currentUserId,
        content: content || null,
        postId: postId || null,
      },
    })

    return NextResponse.json({ conversationId: conversation.id, message })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
