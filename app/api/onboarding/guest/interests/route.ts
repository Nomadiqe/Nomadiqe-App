import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const interestsSchema = z.object({
  interests: z.array(z.string().min(1)).max(20, 'Too many interests selected')
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

    // Verify user is a guest
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || user.role !== 'GUEST') {
      return NextResponse.json(
        { error: 'This endpoint is only for guests' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = interestsSchema.parse(body)

    // Update guest preferences
    await prisma.guestPreferences.update({
      where: { userId: session.user.id },
      data: {
        travelInterests: validatedData.interests
      }
    })

    // Complete onboarding for guest
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        onboardingStatus: 'COMPLETED',
        onboardingStep: null
      }
    })

    // Update progress
    const progress = await prisma.onboardingProgress.findUnique({
      where: { userId: session.user.id }
    })

    if (progress) {
      const completedSteps = JSON.parse(progress.completedSteps as string)
      completedSteps.push('interest-selection')
      
      await prisma.onboardingProgress.update({
        where: { userId: session.user.id },
        data: {
          currentStep: 'completed',
          completedSteps: JSON.stringify(completedSteps),
          completedAt: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      onboardingComplete: true,
      redirectTo: '/dashboard/guest'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Guest interests error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
