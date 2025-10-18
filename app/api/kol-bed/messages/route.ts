import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const messageCreateSchema = z.object({
  receiverId: z.string(),
  propertyId: z.string().optional(),
  message: z.string().min(10).max(1000)
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { receiverId, propertyId, message } = messageCreateSchema.parse(body)

    // Check if the sender is an influencer
    const sender = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { influencerProfile: true }
    })

    if (!sender || sender.role !== 'INFLUENCER' || !sender.influencerProfile) {
      return NextResponse.json(
        { error: 'Only influencers can send KOL$BED messages' },
        { status: 403 }
      )
    }

    // Check if the receiver is a host
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      include: { hostProfile: true }
    })

    if (!receiver || receiver.role !== 'HOST' || !receiver.hostProfile) {
      return NextResponse.json(
        { error: 'Can only send messages to hosts' },
        { status: 400 }
      )
    }

    // If propertyId is provided, verify it belongs to the receiver
    if (propertyId) {
      const property = await prisma.property.findUnique({
        where: { id: propertyId }
      })

      if (!property || property.hostId !== receiverId) {
        return NextResponse.json(
          { error: 'Property not found or does not belong to the receiver' },
          { status: 400 }
        )
      }
    }

    // Create the message
    const newMessage = await prisma.kolBedMessage.create({
      data: {
        senderId: session.user.id,
        receiverId,
        propertyId: propertyId || null,
        message,
        status: 'PENDING'
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            fullName: true,
            image: true,
            profilePictureUrl: true,
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            fullName: true,
          }
        },
        property: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: newMessage
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating KOL$BED message:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'sent' or 'received'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (type === 'sent') {
      where.senderId = session.user.id
    } else if (type === 'received') {
      where.receiverId = session.user.id
    } else {
      // Return both sent and received
      where.OR = [
        { senderId: session.user.id },
        { receiverId: session.user.id }
      ]
    }

    const messages = await prisma.kolBedMessage.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            fullName: true,
            image: true,
            profilePictureUrl: true,
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            fullName: true,
          }
        },
        property: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    })

    const total = await prisma.kolBedMessage.count({ where })

    return NextResponse.json({
      success: true,
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching KOL$BED messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
