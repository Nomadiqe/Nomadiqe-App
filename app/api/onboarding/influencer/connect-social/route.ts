import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const socialConnectionSchema = z.object({
  platform: z.enum(['INSTAGRAM', 'TIKTOK', 'YOUTUBE']),
  authCode: z.string().min(1, 'Authorization code is required'),
  // For demo purposes - in production these would come from API responses
  mockData: z.object({
    username: z.string(),
    followerCount: z.number().min(1000, 'Minimum 1000 followers required'),
    platformUserId: z.string()
  }).optional()
})

// Mock social media API integration
// In production, you would integrate with actual APIs:
// - Instagram Basic Display API
// - TikTok Login Kit
// - YouTube Data API
const mockSocialMediaIntegration = async (platform: string, authCode: string, mockData?: any) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  if (mockData) {
    return {
      success: true,
      profile: {
        platformUserId: mockData.platformUserId,
        username: mockData.username,
        followerCount: mockData.followerCount,
        accessToken: `mock_token_${Date.now()}`,
        refreshToken: `mock_refresh_${Date.now()}`,
        tokenExpiresAt: new Date(Date.now() + 3600000) // 1 hour
      }
    }
  }

  // Mock successful connection
  return {
    success: true,
    profile: {
      platformUserId: `${platform.toLowerCase()}_user_${Math.random().toString(36).substring(7)}`,
      username: `demo_${platform.toLowerCase()}_user`,
      followerCount: Math.floor(Math.random() * 50000) + 1000,
      accessToken: `mock_token_${Date.now()}`,
      refreshToken: `mock_refresh_${Date.now()}`,
      tokenExpiresAt: new Date(Date.now() + 3600000)
    }
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
    const validatedData = socialConnectionSchema.parse(body)

    // Check if platform is already connected
    const { data: existingConnection } = await supabase
      .from('social_connections')
      .select('*')
      .eq('userId', user.id)
      .eq('platform', validatedData.platform)
      .single()

    if (existingConnection) {
      return NextResponse.json(
        { error: 'Platform already connected' },
        { status: 400 }
      )
    }

    // Simulate social media API integration
    const socialResult = await mockSocialMediaIntegration(
      validatedData.platform,
      validatedData.authCode,
      validatedData.mockData
    )

    if (!socialResult.success) {
      return NextResponse.json(
        { error: 'Failed to connect social media account', code: 'ONBOARDING_004' },
        { status: 400 }
      )
    }

    // Create social connection record
    const { data: socialConnection, error: connectionError } = await supabase
      .from('social_connections')
      .insert({
        userId: user.id,
        platform: validatedData.platform,
        platformUserId: socialResult.profile.platformUserId,
        username: socialResult.profile.username,
        followerCount: socialResult.profile.followerCount,
        accessToken: socialResult.profile.accessToken, // Should be encrypted in production
        refreshToken: socialResult.profile.refreshToken, // Should be encrypted in production
        tokenExpiresAt: socialResult.profile.tokenExpiresAt.toISOString(),
        isPrimary: true // First connection is primary
      })
      .select()
      .single()

    if (connectionError) {
      console.error('Failed to create social connection:', connectionError)
      return NextResponse.json(
        { error: 'Failed to connect social media account', code: 'ONBOARDING_004' },
        { status: 500 }
      )
    }

    // Check if this is the first social connection
    const { count } = await supabase
      .from('social_connections')
      .select('*', { count: 'exact', head: true })
      .eq('userId', user.id)

    // Update user onboarding step
    await supabase
      .from('users')
      .update({
        onboardingStep: 'media-kit-setup'
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
      if (count === 1) {
        completedSteps.push('social-connect')
      }

      await supabase
        .from('onboarding_progress')
        .update({
          currentStep: 'media-kit-setup',
          completedSteps: JSON.stringify(completedSteps)
        })
        .eq('userId', user.id)
    }

    return NextResponse.json({
      connected: true,
      profile: {
        platform: validatedData.platform,
        username: socialResult.profile.username,
        followerCount: socialResult.profile.followerCount,
        isPrimary: socialConnection.isPrimary
      },
      nextStep: 'media-kit-setup',
      message: `Successfully connected ${validatedData.platform} account`
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid social connection data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Social connection error:', error)
    return NextResponse.json(
      { error: 'Failed to connect social media account', code: 'ONBOARDING_004' },
      { status: 500 }
    )
  }
}
