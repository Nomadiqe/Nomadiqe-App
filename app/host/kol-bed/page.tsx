import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { KolBedDashboard } from '@/components/kol-bed/KolBedDashboard'

export default async function KolBedPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Check if user is a host
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
      hostProfile: true,
    }
  })

  if (!user || user.role !== 'HOST') {
    redirect('/dashboard')
  }

  // Get KOL$BED messages for this host
  const messages = await prisma.kolBedMessage.findMany({
    where: { receiverId: session.user.id },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          fullName: true,
          image: true,
          profilePictureUrl: true,
          influencerProfile: {
            select: {
              contentNiches: true,
              portfolioUrl: true,
            }
          },
          socialConnections: {
            select: {
              platform: true,
              username: true,
              followerCount: true,
              isPrimary: true,
            }
          }
        }
      },
      property: {
        select: {
          id: true,
          title: true,
          images: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Get all available creators (influencers) for the KOL$BED program
  const availableCreators = await prisma.user.findMany({
    where: {
      role: 'INFLUENCER',
      influencerProfile: {
        isNot: null
      }
    },
    include: {
      influencerProfile: {
        select: {
          contentNiches: true,
          portfolioUrl: true,
        }
      },
      socialConnections: {
        select: {
          platform: true,
          username: true,
          followerCount: true,
          isPrimary: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Get host's properties for context
  const properties = await prisma.property.findMany({
    where: { 
      hostId: session.user.id,
      isActive: true 
    },
    select: {
      id: true,
      title: true,
      images: true,
      city: true,
      country: true,
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">KOL$BED Dashboard</h1>
          <p className="text-muted-foreground">
            Manage creator collaborations and discover influencers for your properties
          </p>
        </div>

        <KolBedDashboard
          messages={messages}
          availableCreators={availableCreators}
          properties={properties}
          hostId={session.user.id}
        />
      </div>
    </div>
  )
}
