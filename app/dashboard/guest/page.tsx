import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import GuestDashboard from '@/components/dashboard/GuestDashboard'

async function GuestDashboardPageContent() {
  const supabase = await createClient()

  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

  if (authError || !authUser) {
    redirect('/auth/signin')
  }

  // Get user with guest preferences
  const { data: user, error: userError } = await supabase
    .from('users')
    .select(`
      *,
      guestPreferences:guest_preferences(*)
    `)
    .eq('id', authUser.id)
    .single()

  // If user doesn't exist in DB, redirect to sign in
  if (userError || !user) {
    redirect('/auth/signin')
  }

  // Only redirect if the user's role is explicitly NOT a guest/traveler
  if (!['GUEST', 'TRAVELER'].includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'HOST') {
      redirect('/dashboard/host')
    } else if (user.role === 'INFLUENCER') {
      redirect('/dashboard/influencer')
    } else {
      // Fallback to general dashboard
      redirect('/dashboard')
    }
  }

  return <GuestDashboard user={user} />
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}

export default function GuestDashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <GuestDashboardPageContent />
    </Suspense>
  )
}
