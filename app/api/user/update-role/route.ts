import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateRoleSchema = z.object({
  role: z.enum(['TRAVELER', 'HOST', 'DIGITAL_CREATOR']),
})

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await req.json()
    const data = updateRoleSchema.parse(body)

    // Update user role and create appropriate profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        role: data.role,
      },
      select: {
        id: true,
        role: true,
      }
    })

    // Create appropriate profile based on role
    if (data.role === 'HOST') {
      await prisma.hostProfile.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          businessName: null,
          businessType: null,
          businessRegistration: null,
          taxId: null,
          identityVerified: false,
          businessVerified: false,
        },
        update: {}
      })
    } else if (data.role === 'DIGITAL_CREATOR') {
      await prisma.digitalCreatorProfile.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          contentTypes: [],
          platforms: [],
          portfolioImages: [],
          collaborationTypes: [],
          languages: [],
          specialties: [],
          equipment: [],
        },
        update: {}
      })
    }
    // TRAVELER profile is already created during signup

    return NextResponse.json({ 
      success: true, 
      user: updatedUser 
    })
  } catch (err: any) {
    console.error('Role update error:', err)
    if (err instanceof z.ZodError) {
      return NextResponse.json({ 
        error: err.issues?.[0]?.message || 'Invalid role' 
      }, { status: 400 })
    }
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
