import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  profilePicture: z.string().url().optional()
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = profileSchema.parse(body)

    // Check if username is already taken
    const existingUser = await prisma.user.findUnique({
      where: { username: validatedData.username }
    })

    if (existingUser && existingUser.id !== session.user.id) {
      return NextResponse.json(
        { error: 'Username already taken', code: 'ONBOARDING_001' },
        { status: 400 }
      )
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        fullName: validatedData.fullName,
        username: validatedData.username,
        profilePictureUrl: validatedData.profilePicture,
        onboardingStatus: 'IN_PROGRESS',
        onboardingStep: 'role-selection'
      }
    })

    // Update or create onboarding progress
    await prisma.onboardingProgress.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        currentStep: 'role-selection',
        completedSteps: JSON.stringify(['profile-setup'])
      },
      update: {
        currentStep: 'role-selection',
        completedSteps: JSON.stringify(['profile-setup'])
      }
    })

    return NextResponse.json({
      success: true,
      nextStep: 'role-selection',
      user: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        username: updatedUser.username,
        profilePictureUrl: updatedUser.profilePictureUrl
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Profile setup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
