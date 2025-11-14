import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const verificationSchema = z.object({
  documentType: z.enum(['passport', 'drivers_license', 'national_id']),
  documentNumber: z.string().min(1, 'Document number is required'),
  skipVerification: z.boolean().optional()
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify user is an influencer
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*, influencer_profiles(*)')
      .eq('id', user.id)
      .single()

    if (userError || !userData || userData.role !== 'INFLUENCER' || !userData.influencer_profiles) {
      return NextResponse.json(
        { error: 'This endpoint is only for influencers' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = verificationSchema.parse(body)

    const verificationId = `verify_inf_${Date.now()}_${Math.random().toString(36).substring(7)}`

    let verificationStatus: 'PENDING' | 'VERIFIED' = 'PENDING'
    let identityVerified = false

    if (validatedData.skipVerification) {
      verificationStatus = 'VERIFIED'
      identityVerified = true
    }

    // Update influencer profile
    const { error: updateError } = await supabase
      .from('influencer_profiles')
      .update({
        verificationStatus,
        identityVerified,
        verificationDate: identityVerified ? new Date().toISOString() : null
      })
      .eq('userId', user.id)

    if (updateError) {
      console.error('Failed to update influencer profile:', updateError)
      return NextResponse.json(
        { error: 'Identity verification failed', code: 'ONBOARDING_003' },
        { status: 500 }
      )
    }

    // Update user onboarding step
    await supabase
      .from('users')
      .update({
        onboardingStep: 'social-connect'
      })
      .eq('id', user.id)

    // Update progress
    const { data: progress } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('userId', user.id)
      .single()

    if (progress) {
      const completedSteps = JSON.parse(progress.completedSteps as string || '[]')
      if (identityVerified) {
        completedSteps.push('identity-verification')
      }

      const metadata = (progress.metadata as object || {})

      await supabase
        .from('onboarding_progress')
        .update({
          currentStep: 'social-connect',
          completedSteps: JSON.stringify(completedSteps),
          metadata: {
            ...metadata,
            verificationId
          }
        })
        .eq('userId', user.id)
    }

    return NextResponse.json({
      verificationId,
      status: verificationStatus,
      message: identityVerified
        ? 'Identity verification completed successfully'
        : 'Identity verification initiated. You will be notified once complete.',
      nextStep: 'social-connect'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid verification data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Influencer identity verification error:', error)
    return NextResponse.json(
      { error: 'Identity verification failed', code: 'ONBOARDING_003' },
      { status: 500 }
    )
  }
}
