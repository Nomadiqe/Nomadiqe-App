import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import InfluencerDashboard from '@/components/dashboard/InfluencerDashboard'

async function InfluencerDashboardPageContent() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Get user with influencer profile and social connections
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      influencerProfile: true,
      socialConnections: true
    }
  })

  // If user doesn't exist in DB, redirect to sign in
  if (!user) {
    redirect('/auth/signin')
  }

  // Only redirect if the user's role is explicitly NOT INFLUENCER
  if (user.role !== 'INFLUENCER') {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'GUEST') {
      redirect('/dashboard/guest')
    } else if (user.role === 'HOST') {
      redirect('/dashboard/host')
    } else {
      // Fallback to general dashboard
      redirect('/dashboard')
    }
  }

  return <InfluencerDashboard user={user} />
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}

export default function InfluencerDashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <InfluencerDashboardPageContent />
    </Suspense>
  )
}
