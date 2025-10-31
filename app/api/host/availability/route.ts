import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { startOfDay } from 'date-fns'

// POST: Block a date (set isAvailable to false)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { propertyId, date } = body

    if (!propertyId || !date) {
      return NextResponse.json(
        { error: 'Missing propertyId or date' },
        { status: 400 }
      )
    }

    // Verify user owns the property
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, hostId: true },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    if (property.hostId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only manage your own properties' },
        { status: 403 }
      )
    }

    // Check if there's an existing booking for this date
    const dateObj = new Date(date)
    const existingBooking = await prisma.booking.findFirst({
      where: {
        propertyId,
        status: {
          in: ['PENDING', 'CONFIRMED']
        },
        OR: [
          {
            checkIn: { lte: dateObj },
            checkOut: { gt: dateObj },
          },
        ],
      },
    })

    if (existingBooking) {
      return NextResponse.json(
        { error: 'Cannot block date with active booking' },
        { status: 400 }
      )
    }

    // Create or update availability record to block the date
    const availability = await prisma.availability.upsert({
      where: {
        propertyId_date: {
          propertyId,
          date: startOfDay(dateObj),
        },
      },
      update: {
        isAvailable: false,
      },
      create: {
        propertyId,
        date: startOfDay(dateObj),
        isAvailable: false,
      },
    })

    return NextResponse.json({
      success: true,
      availability,
    })
  } catch (error) {
    console.error('Error blocking date:', error)
    return NextResponse.json(
      { error: 'Failed to block date' },
      { status: 500 }
    )
  }
}

// DELETE: Unblock a date (remove availability record or set isAvailable to true)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { propertyId, date } = body

    if (!propertyId || !date) {
      return NextResponse.json(
        { error: 'Missing propertyId or date' },
        { status: 400 }
      )
    }

    // Verify user owns the property
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, hostId: true },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    if (property.hostId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only manage your own properties' },
        { status: 403 }
      )
    }

    const dateObj = new Date(date)

    // Delete the availability record (unblocking the date)
    await prisma.availability.deleteMany({
      where: {
        propertyId,
        date: startOfDay(dateObj),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Date unblocked successfully',
    })
  } catch (error) {
    console.error('Error unblocking date:', error)
    return NextResponse.json(
      { error: 'Failed to unblock date' },
      { status: 500 }
    )
  }
}

// GET: Get availability for a property
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Missing propertyId' },
        { status: 400 }
      )
    }

    // Verify user owns the property
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, hostId: true },
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    if (property.hostId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only view your own properties' },
        { status: 403 }
      )
    }

    const availability = await prisma.availability.findMany({
      where: {
        propertyId,
      },
      orderBy: {
        date: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      availability,
    })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}
