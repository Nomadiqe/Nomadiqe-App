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

  if (!user || user.role !== 'INFLUENCER') {
    redirect('/dashboard')
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
