import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - List all properties (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify user is an admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get filter parameters
    const { searchParams } = new URL(req.url)
    const statusFilter = searchParams.get('status') // 'active', 'inactive', 'all'

    const where: any = {}
    if (statusFilter === 'active') {
      where.isActive = true
    } else if (statusFilter === 'inactive') {
      where.isActive = false
    }

    // Fetch all properties with host information
    const properties = await prisma.property.findMany({
      where,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            fullName: true,
            email: true,
          }
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      properties: properties.map((p: any) => ({
        id: p.id,
        title: p.title,
        city: p.city,
        country: p.country,
        price: p.price,
        currency: p.currency,
        maxGuests: p.maxGuests,
        bedrooms: p.bedrooms,
        images: p.images,
        isActive: p.isActive,
        isVerified: p.isVerified,
        createdAt: p.createdAt,
        host: p.host,
        bookingsCount: p._count.bookings,
        reviewsCount: p._count.reviews,
      }))
    })

  } catch (error) {
    console.error('Fetch properties error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}
