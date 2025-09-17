import { Suspense } from 'react'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'

function OnboardingWelcomePageContent() {
  return <OnboardingFlow step="welcome" />
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}

export default function OnboardingWelcomePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OnboardingWelcomePageContent />
    </Suspense>
  )
}
