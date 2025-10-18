import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import PropertyCreationWizard from '@/components/property-creation-wizard'

async function CreatePropertyPageContent() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  // Check if user is a host
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { hostProfile: true }
  })

  if (!user || user.role !== 'HOST' || !user.hostProfile) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            List Your Property
          </h1>
          <p className="text-muted-foreground">
            Create a new property listing to start hosting guests
          </p>
        </div>
        
        <PropertyCreationWizard onComplete={() => {
          // Redirect to dashboard after completion
          window.location.href = '/dashboard'
        }} />
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  )
}

export default function CreatePropertyPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CreatePropertyPageContent />
    </Suspense>
  )
}
