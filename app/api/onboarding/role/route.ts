import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const roleSchema = z.object({
  role: z.enum(['GUEST', 'HOST', 'INFLUENCER'], {
    errorMap: () => ({ message: 'Invalid role selected' })
  })
})

const getNextStep = (role: string): string => {
  switch (role) {
    case 'GUEST':
      return 'interest-selection'
    case 'HOST':
      return 'listing-creation'
    case 'INFLUENCER':
      return 'social-connect'
    default:
      return 'complete'
  }
}

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

    const body = await req.json()
    const validatedData = roleSchema.parse(body)

    // Update user role
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        role: validatedData.role,
        onboardingStep: getNextStep(validatedData.role),
        updatedAt: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    // Update onboarding progress
    const { data: progress } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('userId', user.id)
      .single()

    if (progress) {
      const completedSteps = JSON.parse(progress.completedSteps as string || '[]')
      if (!completedSteps.includes('role-selection')) {
        completedSteps.push('role-selection')
      }
      
      await supabase
        .from('onboarding_progress')
        .update({
          currentStep: getNextStep(validatedData.role),
          completedSteps: JSON.stringify(completedSteps)
        })
        .eq('userId', user.id)
    }

    // Create role-specific profile if needed
    try {
      if (validatedData.role === 'HOST') {
        // Check if host profile already exists
        const { data: existingHostProfile } = await supabase
          .from('host_profiles')
          .select('id')
          .eq('userId', user.id)
          .single()
        
        if (!existingHostProfile) {
          // Generate unique referral code
          const referralCode = `HOST_${Math.random().toString(36).substring(2, 12).toUpperCase()}`
          
          await supabase
            .from('host_profiles')
            .insert({
              userId: user.id,
              referralCode,
              preferredNiches: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
        }
      } else if (validatedData.role === 'INFLUENCER') {
        // Check if influencer profile already exists
        const { data: existingInfluencerProfile } = await supabase
          .from('influencer_profiles')
          .select('id')
          .eq('userId', user.id)
          .single()
        
        if (!existingInfluencerProfile) {
          await supabase
            .from('influencer_profiles')
            .insert({
              userId: user.id,
              contentNiches: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
        }
      } else if (validatedData.role === 'GUEST') {
        // Check if guest preferences already exist
        const { data: existingGuestPrefs } = await supabase
          .from('guest_preferences')
          .select('id')
          .eq('userId', user.id)
          .single()
        
        if (!existingGuestPrefs) {
          await supabase
            .from('guest_preferences')
            .insert({
              userId: user.id,
              travelInterests: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
        }
      }
    } catch (profileError) {
      console.error('Error creating role-specific profile:', profileError)
      // Continue anyway - profile can be created later
    }

    return NextResponse.json({
      success: true,
      nextStep: getNextStep(validatedData.role),
      role: validatedData.role
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid role selected', code: 'ONBOARDING_006' },
        { status: 400 }
      )
    }

    console.error('Role selection error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
