import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user with onboarding progress
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        onboarding_progress:onboarding_progress(*)
      `)
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const progress = Array.isArray(userData.onboarding_progress) 
      ? userData.onboarding_progress[0] 
      : userData.onboarding_progress
    
    const completedSteps = progress?.completed_steps 
      ? (typeof progress.completed_steps === 'string' 
          ? JSON.parse(progress.completed_steps) 
          : progress.completed_steps)
      : []

    return NextResponse.json({
      currentStep: userData.onboardingStep || 'profile-setup',
      completedSteps,
      role: userData.role,
      onboardingStatus: userData.onboardingStatus,
      metadata: progress?.metadata || {},
      startedAt: progress?.started_at || progress?.startedAt,
      completedAt: progress?.completed_at || progress?.completedAt,
      userData: {
        fullName: userData.fullName,
        username: userData.username,
        profilePictureUrl: userData.profilePictureUrl,
        email: userData.email
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
