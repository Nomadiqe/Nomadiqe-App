import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user with onboarding progress
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        onboardingProgress: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const progress = user.onboardingProgress
    const completedSteps = progress?.completedSteps 
      ? JSON.parse(progress.completedSteps as string)
      : []

    return NextResponse.json({
      currentStep: user.onboardingStep || 'profile-setup',
      completedSteps,
      role: user.role,
      onboardingStatus: user.onboardingStatus,
      metadata: progress?.metadata || {},
      startedAt: progress?.startedAt,
      completedAt: progress?.completedAt,
      userData: {
        fullName: user.fullName,
        username: user.username,
        profilePictureUrl: user.profilePictureUrl,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Progress fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
