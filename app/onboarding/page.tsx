import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function OnboardingIndexPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    console.error('Auth error:', error)
    redirect('/auth/signin')
  }

  // Get user's current onboarding progress from database (fresh data)
  let { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // If user doesn't exist in public.users, create them (fallback if trigger didn't fire)
  if (userError || !userData) {
    console.log('User not found in public.users, creating...', { userId: user.id, error: userError })
    
    // Try to create the user record
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        full_name: user.user_metadata?.full_name || user.user_metadata?.name,
        email_verified: user.email_confirmed_at ? true : false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (createError || !newUser) {
      console.error('Failed to create user:', createError)
      // Wait a bit and retry fetching (trigger might be delayed)
      await new Promise(resolve => setTimeout(resolve, 1000))
      const { data: retryUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (!retryUser) {
        console.error('User still not found after retry')
        redirect('/auth/signin')
      }
      userData = retryUser
    } else {
      userData = newUser
    }
  }

  // If onboarding is complete, redirect to role-specific dashboard
  const onboardingStatus = userData.onboardingStatus
  if (onboardingStatus === 'COMPLETED') {
    const dashboardUrl = userData.role === 'HOST' ? '/dashboard/host'
      : userData.role === 'INFLUENCER' ? '/dashboard/influencer'
      : userData.role === 'GUEST' ? '/dashboard/guest'
      : '/dashboard'
    redirect(dashboardUrl)
  }

  // Route to the current step based on database state
  // This ensures users continue from where they left off
  const currentStep = userData.onboardingStep || 'profile-setup'
  
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
