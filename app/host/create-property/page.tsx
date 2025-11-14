'use client'

import { useSupabase } from '@/components/providers/supabase-auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ListingWizard from '@/components/onboarding/steps/host/ListingWizard'
import { OnboardingProvider } from '@/contexts/OnboardingContext'

export default function CreatePropertyPage() {
  const { user, isLoading } = useSupabase()
  const router = useRouter()
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-2 border-pink-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <OnboardingProvider>
      <div className="min-h-screen relative overflow-hidden pb-20">
        {/* Modern Gradient Background with Glow Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-300/30 via-purple-400/40 to-purple-600/50 -z-10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              List Your Property
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Share your space with travelers and start earning
            </p>
          </div>

          <ListingWizard onComplete={() => {
            // Redirect to profile after completion
            router.push(`/profile/${user.id}`)
          }} />
        </div>
      </div>
    </OnboardingProvider>
  )
}


