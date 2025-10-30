import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { awardPoints } from '@/lib/services/points-service'

const profileSetupSchema = z.object({
  contentNiches: z.array(z.string()).min(1, 'At least one content niche is required').max(5, 'Maximum 5 niches allowed'),
  deliverables: z.object({
    instagramPost: z.number().min(0).max(10).optional(),
    instagramStory: z.number().min(0).max(20).optional(),
    tiktokVideo: z.number().min(0).max(10).optional(),
    youtubeVideo: z.number().min(0).max(5).optional(),
    blogPost: z.boolean().default(false),
    customDeliverables: z.array(z.string()).max(5).optional()
  }).optional(),
  portfolioUrl: z.string().url().optional(),
  collaborationTerms: z.string().min(10, 'Collaboration terms must be at least 10 characters').optional()
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
  'nature',
  'tech',
  'fitness',
  'beauty',
  'art'
]

const generateProfileLink = (username: string, userId: string): string => {
  const baseLink = username.toLowerCase().replace(/[^a-z0-9]/g, '')
  const uniqueSuffix = userId.substring(0, 8)
  return `${baseLink}-${uniqueSuffix}`
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify user is an influencer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { 
        influencerProfile: true,
        socialConnections: true
      }
    })

    if (!user || user.role !== 'INFLUENCER' || !user.influencerProfile) {
      return NextResponse.json(
        { error: 'This endpoint is only for influencers' },
        { status: 403 }
      )
    }

    // Verify at least one social connection exists
    if (user.socialConnections.length === 0) {
      return NextResponse.json(
        { error: 'At least one social media account must be connected first' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const validatedData = profileSetupSchema.parse(body)

    // Validate niches are from allowed list
    const invalidNiches = validatedData.contentNiches.filter(
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

    // Generate unique profile link
    const profileLink = generateProfileLink(user.username || user.name || 'influencer', user.id)

    // Check if profile link already exists and make it unique if needed
    let uniqueProfileLink = profileLink
    let counter = 1
    while (await prisma.influencerProfile.findFirst({ where: { profileLink: uniqueProfileLink } })) {
      uniqueProfileLink = `${profileLink}-${counter}`
      counter++
    }

    // Prepare deliverables data
    const deliverables = validatedData.deliverables ? {
      standard: validatedData.deliverables,
      terms: validatedData.collaborationTerms || 'Standard collaboration terms apply'
    } : null

    // Update influencer profile
    await prisma.influencerProfile.update({
      where: { userId: session.user.id },
      data: {
        contentNiches: validatedData.contentNiches.map(n => n.toLowerCase()),
        deliverables,
        portfolioUrl: validatedData.portfolioUrl,
        profileLink: uniqueProfileLink
      }
    })

    // Complete onboarding for influencer
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        onboardingStatus: 'COMPLETED',
        onboardingStep: null
      }
    })

    // Award onboarding completion points
    await awardPoints({
      userId: session.user.id,
      action: 'onboarding_complete',
      description: 'Influencer onboarding completed successfully!',
    })

    // Update progress
    const progress = await prisma.onboardingProgress.findUnique({
      where: { userId: session.user.id }
    })

    if (progress) {
      const completedSteps = JSON.parse(progress.completedSteps as string)
      completedSteps.push('media-kit-setup')
      
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
      profileLink: `https://nomadiqe.com/profile/${uniqueProfileLink}`,
      onboardingComplete: true,
      redirectTo: '/dashboard/influencer',
      message: 'Influencer profile setup completed successfully! Welcome to Nomadiqe.',
      profile: {
        contentNiches: validatedData.contentNiches,
        profileLink: uniqueProfileLink,
        connectedPlatforms: user.socialConnections.map((conn: any) => ({
          platform: conn.platform,
          username: conn.username,
          followerCount: conn.followerCount
        }))
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Influencer profile setup error:', error)
    return NextResponse.json(
      { error: 'Failed to setup influencer profile' },
      { status: 500 }
    )
  }
}
