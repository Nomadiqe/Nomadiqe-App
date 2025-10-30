import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import HostDashboard from '@/components/dashboard/HostDashboard'

async function HostDashboardPageContent() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Get user with host profile and properties
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      hostProfile: true,
      properties: {
        include: {
          bookings: {
            include: {
              traveler: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  email: true
                }
              }
            }
          },
          reviews: {
            include: {
              reviewer: {
                select: {
                  id: true,
                  name: true,
                  image: true
                }
              }
            }
          }
        }
      }
    }
  })

  // If user doesn't exist in DB, redirect to sign in
  if (!user) {
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
