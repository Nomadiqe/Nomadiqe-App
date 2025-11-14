import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = profileSchema.parse(body)

    // Check if username is already taken
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', validatedData.username)
      .single()

    if (existingUser && existingUser.id !== user.id) {
      return NextResponse.json(
        { error: 'Username already taken', code: 'ONBOARDING_001' },
        { status: 400 }
      )
    }

    // Update user profile
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        fullName: validatedData.fullName,
        username: validatedData.username,
        profilePictureUrl: validatedData.profilePicture,
        onboardingStatus: 'IN_PROGRESS',
        onboardingStep: 'role-selection',
        updatedAt: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    // Update or create onboarding progress
    const { data: existingProgress } = await supabase
      .from('onboarding_progress')
      .select('id')
      .eq('userId', user.id)
      .single()

    const completedSteps = ['profile-setup']

    if (existingProgress) {
      await supabase
        .from('onboarding_progress')
        .update({
          currentStep: 'role-selection',
          completedSteps: JSON.stringify(completedSteps),
        })
        .eq('userId', user.id)
    } else {
      await supabase
        .from('onboarding_progress')
        .insert({
          userId: user.id,
          currentStep: 'role-selection',
          completedSteps: JSON.stringify(completedSteps),
        })
    }

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
