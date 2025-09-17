import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const verificationSchema = z.object({
  documentType: z.enum(['passport', 'drivers_license', 'national_id']),
  documentNumber: z.string().min(1, 'Document number is required'),
  // In production, you would integrate with a service like Jumio or Onfido
  // For now, we'll simulate the verification process
  skipVerification: z.boolean().optional()
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

    // Verify user is a host
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { hostProfile: true }
    })

    if (!user || user.role !== 'HOST' || !user.hostProfile) {
      return NextResponse.json(
        { error: 'This endpoint is only for hosts' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = verificationSchema.parse(body)

    // In production, integrate with identity verification service
    // For demo purposes, we'll allow skipping verification or simulate success
    const verificationId = `verify_${Date.now()}_${Math.random().toString(36).substring(7)}`
    
    let verificationStatus: 'PENDING' | 'VERIFIED' = 'PENDING'
    let identityVerified = false

    if (validatedData.skipVerification) {
      verificationStatus = 'VERIFIED'
      identityVerified = true
    }

    // Update host profile
    await prisma.hostProfile.update({
      where: { userId: session.user.id },
      data: {
        verificationStatus,
        identityVerified,
        verificationDate: identityVerified ? new Date() : null
      }
    })

    // Update user onboarding step
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        onboardingStep: 'listing-creation'
      }
    })

    // Update progress
    const progress = await prisma.onboardingProgress.findUnique({
      where: { userId: session.user.id }
    })

    if (progress) {
      const completedSteps = JSON.parse(progress.completedSteps as string)
      if (identityVerified) {
        completedSteps.push('identity-verification')
      }
      
      await prisma.onboardingProgress.update({
        where: { userId: session.user.id },
        data: {
          currentStep: 'listing-creation',
          completedSteps: JSON.stringify(completedSteps),
          metadata: {
            ...progress.metadata as object,
            verificationId
          }
        }
      })
    }

    return NextResponse.json({
      verificationId,
      status: verificationStatus,
      message: identityVerified 
        ? 'Identity verification completed successfully'
        : 'Identity verification initiated. You will be notified once complete.',
      nextStep: 'listing-creation'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid verification data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Host identity verification error:', error)
    return NextResponse.json(
      { error: 'Identity verification failed', code: 'ONBOARDING_003' },
      { status: 500 }
    )
  }
}
