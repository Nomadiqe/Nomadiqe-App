import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function OnboardingIndexPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Get user's current onboarding progress from database (fresh data)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      onboardingProgress: true
    }
  })

  if (!user) {
    redirect('/auth/signin')
  }

  // If onboarding is complete, redirect to role-specific dashboard
  if (user.onboardingStatus === 'COMPLETED') {
    const dashboardUrl = user.role === 'HOST' ? '/dashboard/host'
      : user.role === 'INFLUENCER' ? '/dashboard/influencer'
      : user.role === 'GUEST' ? '/dashboard/guest'
      : '/dashboard'
    redirect(dashboardUrl)
  }

  // Route to the current step based on database state
  // This ensures users continue from where they left off
  const currentStep = user.onboardingStep || 'profile-setup'
  
  // Map database step names to route paths
  const stepRoutes: Record<string, string> = {
    'profile-setup': '/onboarding/profile-setup',
    'role-selection': '/onboarding/role-selection',
    'interest-selection': '/onboarding/interest-selection',
    'listing-creation': '/onboarding/listing-creation',
    'collaboration-setup': '/onboarding/collaboration-setup',
    'social-connect': '/onboarding/social-connect',
    'media-kit-setup': '/onboarding/media-kit-setup',
    'identity-verification': '/onboarding/identity-verification',
    'complete': '/onboarding/complete'
  }

  const targetRoute = stepRoutes[currentStep] || '/onboarding/profile-setup'
  redirect(targetRoute)
}
