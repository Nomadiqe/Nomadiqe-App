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

  if (!user || !['GUEST', 'TRAVELER'].includes(user.role)) {
    redirect('/dashboard')
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
