import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'

async function OnboardingMediaKitSetupPageContent() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return <OnboardingFlow step="media-kit-setup" />
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}

export default function OnboardingMediaKitSetupPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OnboardingMediaKitSetupPageContent />
    </Suspense>
  )
}
