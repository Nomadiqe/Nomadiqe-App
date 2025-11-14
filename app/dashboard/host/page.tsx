import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import HostDashboard from '@/components/dashboard/HostDashboard'

async function HostDashboardPageContent() {
  const supabase = await createClient()

  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

  if (authError || !authUser) {
    redirect('/auth/signin')
  }

  // Get user with host profile and properties
  const { data: user, error: userError } = await supabase
    .from('users')
    .select(`
      *,
      hostProfile:host_profiles(*),
      properties:properties(
        *,
        bookings:bookings(
          *,
          traveler:users!travelerId(
            id, name, image, email
          )
        ),
        reviews:property_reviews(
          *,
          reviewer:users!reviewerId(
            id, name, image
          )
        )
      )
    `)
    .eq('id', authUser.id)
    .single()

  // If user doesn't exist in DB, redirect to sign in
  if (userError || !user) {
    redirect('/auth/signin')
  }

  // Only redirect if the user's role is explicitly NOT HOST
  if (user.role !== 'HOST') {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'GUEST') {
      redirect('/dashboard/guest')
    } else if (user.role === 'INFLUENCER') {
      redirect('/dashboard/influencer')
    } else {
      // Fallback to general dashboard
      redirect('/dashboard')
    }
  }

  return <HostDashboard user={user} />
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}

export default function HostDashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HostDashboardPageContent />
    </Suspense>
  )
}
