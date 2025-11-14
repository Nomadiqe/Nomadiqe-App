import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const collaborationSchema = z.object({
  standardOffer: z.object({
    offerType: z.enum(['free_stay', 'discounted_stay', 'paid_collaboration']),
    discount: z.number().min(0).max(100).optional(),
    minNights: z.number().min(1, 'Minimum 1 night required').max(30).default(1),
    maxNights: z.number().min(1).max(30).default(7),
    deliverables: z.array(z.string()).min(1, 'At least one deliverable is required'),
    terms: z.string().min(10, 'Terms must be at least 10 characters')
  }),
  minFollowerCount: z.number().min(1000, 'Minimum follower count should be at least 1000').optional(),
  preferredNiches: z.array(z.string()).max(10, 'Maximum 10 niches allowed').optional()
})

const AVAILABLE_NICHES = [
  'travel',
  'lifestyle',
  'food',
  'fashion',
  'photography',
  'adventure',
  'luxury',
  'budget',
  'family',
  'couple',
  'solo',
  'business',
  'wellness',
  'culture',
  'nature'
]

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

    // Verify user is a host
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*, host_profiles(*)')
      .eq('id', user.id)
      .single()

    if (userError || !userData || userData.role !== 'HOST' || !userData.host_profiles) {
      return NextResponse.json(
        { error: 'This endpoint is only for hosts' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = collaborationSchema.parse(body)

    // Validate niches are from allowed list
    if (validatedData.preferredNiches) {
      const invalidNiches = validatedData.preferredNiches.filter(
        niche => !AVAILABLE_NICHES.includes(niche.toLowerCase())
      )

      if (invalidNiches.length > 0) {
        return NextResponse.json(
          {
            error: 'Invalid niches selected',
            details: { invalidNiches, availableNiches: AVAILABLE_NICHES }
          },
          { status: 400 }
        )
      }
    }

    // Update host profile with collaboration preferences
    const { error: updateError } = await supabase
      .from('host_profiles')
      .update({
        standardOffer: validatedData.standardOffer,
        minFollowerCount: validatedData.minFollowerCount,
        preferredNiches: validatedData.preferredNiches || []
      })
      .eq('userId', user.id)

    if (updateError) {
      console.error('Failed to update host profile:', updateError)
      return NextResponse.json(
        { error: 'Failed to update collaboration preferences' },
        { status: 500 }
      )
    }

    // Complete onboarding for host
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({
        onboardingStatus: 'COMPLETED',
        onboardingStep: null
      })
      .eq('id', user.id)

    if (userUpdateError) {
      console.error('Failed to update user onboarding status:', userUpdateError)
    }

    // Award onboarding completion points via RPC
    await supabase.rpc('award_points', {
      p_user_id: user.id,
      p_action: 'onboarding_complete',
      p_points: 50,
      p_description: 'Host onboarding completed successfully!'
    })

    // Update progress
    const { data: progress } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('userId', user.id)
      .single()

    if (progress) {
      const completedSteps = JSON.parse(progress.completedSteps as string || '[]')
      completedSteps.push('collaboration-setup')

      await supabase
        .from('onboarding_progress')
        .update({
          currentStep: 'completed',
          completedSteps: JSON.stringify(completedSteps),
          completedAt: new Date().toISOString()
        })
        .eq('userId', user.id)
    }

    // Get referral code from host profile
    const { data: hostProfile } = await supabase
      .from('host_profiles')
      .select('referralCode')
      .eq('userId', user.id)
      .single()

    return NextResponse.json({
      success: true,
      onboardingComplete: true,
      redirectTo: '/dashboard/host',
      message: 'Host onboarding completed successfully! Welcome to Nomadiqe.',
      referralCode: hostProfile?.referralCode
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid collaboration data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Collaboration setup error:', error)
    return NextResponse.json(
      { error: 'Failed to setup collaboration preferences' },
      { status: 500 }
    )
  }
}
