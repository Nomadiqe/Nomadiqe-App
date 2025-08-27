"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  User, 
  MapPin, 
  Heart, 
  Calendar, 
  Settings,
  Plus,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const isHost = session.user.role === 'HOST'
  const isTraveler = session.user.role === 'TRAVELER'

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            {isHost ? 'Manage your properties and bookings' : 'Discover your next adventure'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {isHost ? 'Active Bookings' : 'Upcoming Trips'}
                </p>
                <p className="text-2xl font-bold text-foreground">0</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {isHost ? 'Property Views' : 'Saved Properties'}
                </p>
                <p className="text-2xl font-bold text-foreground">0</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {isHost ? 'Properties Listed' : 'Places Visited'}
                </p>
                <p className="text-2xl font-bold text-foreground">0</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {isHost ? 'Total Earnings' : 'Total Saved'}
                </p>
                <p className="text-2xl font-bold text-foreground">€0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {isTraveler && (
                  <>
                    <Button asChild className="w-full justify-start">
                      <Link href="/search">
                        <MapPin className="w-4 h-4 mr-2" />
                        Search Properties
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href="/experiences">
                        <Calendar className="w-4 h-4 mr-2" />
                        Browse Experiences
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href="/host">
                        <Plus className="w-4 h-4 mr-2" />
                        Become a Host
                      </Link>
                    </Button>
                  </>
                )}
                
                {isHost && (
                  <>
                    <Button asChild className="w-full justify-start">
                      <Link href="/host/properties/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Property
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href="/host/properties">
                        <MapPin className="w-4 h-4 mr-2" />
                        Manage Properties
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href="/host/bookings">
                        <Calendar className="w-4 h-4 mr-2" />
                        View Bookings
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Account</h2>
              <div className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/profile">
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {isHost ? 'Recent Activity' : 'Recommended for You'}
              </h2>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {isHost 
                    ? "No recent activity to show. Start by adding your first property!"
                    : "Start exploring to get personalized recommendations!"
                  }
                </p>
                <Button asChild className="mt-4">
                  <Link href={isHost ? "/host/properties/new" : "/search"}>
                    {isHost ? "Add Property" : "Start Exploring"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion Reminder */}
        {(!session.user.image || !session.user.name) && (
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center">
              <User className="h-5 w-5 text-amber-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-amber-800">
                  Complete your profile
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  Add a profile picture and complete your information to get better recommendations.
                </p>
              </div>
              <Button asChild size="sm" className="ml-auto">
                <Link href="/profile">Complete Profile</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
