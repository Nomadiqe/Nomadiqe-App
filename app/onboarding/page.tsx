import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function OnboardingIndexPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Get user's current onboarding progress
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      onboardingProgress: true
    }
  })

  if (!user) {
    redirect('/auth/signin')
  }

  // If onboarding is complete, redirect to dashboard
  if (user.onboardingStatus === 'COMPLETED') {
    const dashboardUrl = user.role === 'HOST' ? '/dashboard/host'
      : user.role === 'INFLUENCER' ? '/dashboard/influencer'
      : '/dashboard'
    redirect(dashboardUrl)
  }

  // For users in onboarding, always start at the beginning
  // Individual steps will handle their own validation and forward/backward navigation
  redirect('/onboarding/profile-setup')
}
