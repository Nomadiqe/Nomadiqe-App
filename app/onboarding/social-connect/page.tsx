import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'

async function OnboardingSocialConnectPageContent() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return <OnboardingFlow step="social-connect" />
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  )
}

export default function OnboardingSocialConnectPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OnboardingSocialConnectPageContent />
    </Suspense>
  )
}
