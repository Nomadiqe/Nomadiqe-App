import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const interestsSchema = z.object({
  interests: z.array(z.string().min(1)).max(20, 'Too many interests selected').default([])
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

    // Verify user is a guest
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (userError || !userData || userData.role !== 'GUEST') {
      return NextResponse.json(
        { error: 'This endpoint is only for guests' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = interestsSchema.parse(body)

    // Update or create guest preferences (upsert)
    const { error: upsertError } = await supabase
      .from('guest_preferences')
      .upsert({
        userId: user.id,
        travelInterests: validatedData.interests
      }, {
        onConflict: 'userId'
      })

    if (upsertError) {
      console.error('Failed to update guest preferences:', upsertError)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }

    // Complete onboarding for guest
    await supabase
      .from('users')
      .update({
        onboardingStatus: 'COMPLETED',
        onboardingStep: null
      })
      .eq('id', user.id)

    // Award onboarding completion points via RPC
    await supabase.rpc('award_points', {
      p_user_id: user.id,
      p_action: 'onboarding_complete',
      p_points: 50,
      p_description: 'Onboarding completed successfully!'
    })

    // Update progress
    const { data: progress } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('userId', user.id)
      .single()

    if (progress) {
      const completedSteps = JSON.parse(progress.completedSteps as string || '[]')
      completedSteps.push('interest-selection')

      await supabase
        .from('onboarding_progress')
        .update({
          currentStep: 'completed',
          completedSteps: JSON.stringify(completedSteps),
          completedAt: new Date().toISOString()
        })
        .eq('userId', user.id)
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
