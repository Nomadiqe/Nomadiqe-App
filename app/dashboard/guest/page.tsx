import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import GuestDashboard from '@/components/dashboard/GuestDashboard'

async function GuestDashboardPageContent() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Get user with guest preferences
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      guestPreferences: true
    }
  })

  // If user doesn't exist in DB, redirect to sign in
  if (!user) {
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
