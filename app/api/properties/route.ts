import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all active properties
    const properties = await prisma.property.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        city: true,
        country: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Format the response
    const formattedProperties = properties.map((property) => ({
      id: property.id,
      title: property.title,
      location: `${property.city}, ${property.country}`,
    }))

    return NextResponse.json(formattedProperties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}
