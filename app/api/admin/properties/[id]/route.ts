import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PATCH - Toggle property active status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await req.json()
    const { isActive, isVerified, latitude, longitude } = body

    // Build update data object
    const updateData: any = {}

    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive
    }

    if (typeof isVerified === 'boolean') {
      updateData.isVerified = isVerified
    }

    // Allow admin to manually set coordinates
    if (typeof latitude === 'number' && typeof longitude === 'number') {
      updateData.latitude = latitude
      updateData.longitude = longitude
      updateData.geocodingAccuracy = 'exact' // Admin-set coordinates are considered exact
      updateData.geocodingFailed = false // Reset failed flag
    }

    // Update property status
    const property = await prisma.property.update({
      where: { id: params.id },
      data: updateData,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            fullName: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      property: {
        id: property.id,
        title: property.title,
        isActive: property.isActive,
        isVerified: property.isVerified,
        latitude: property.latitude,
        longitude: property.longitude,
        geocodingAccuracy: property.geocodingAccuracy,
        geocodingFailed: property.geocodingFailed,
        host: property.host,
      }
    })

  } catch (error) {
    console.error('Update property error:', error)
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

// DELETE - Delete property (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Delete the property
    await prisma.property.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully'
    })

  } catch (error) {
    console.error('Delete property error:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}
