'use client'

/* eslint-disable react/no-unescaped-entities */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  MapPin,
  Heart,
  Star,
  Calendar,
  Search,
  Plus,
  Compass,
  Camera,
  CheckCircle,
  Plane,
  Bookmark,
  Filter,
  TrendingUp,
  Users,
  Globe,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import InterestSelection from '@/components/onboarding/steps/guest/InterestSelection'
import PointsDisplay from '@/components/points/PointsDisplay'
import DailyCheckIn from '@/components/points/DailyCheckIn'

interface GuestDashboardProps {
  user: any // User with guestPreferences
}

export default function GuestDashboard({ user }: GuestDashboardProps) {
  const guestPreferences = user.guestPreferences
  const interests = guestPreferences?.travelInterests || []
  const router = useRouter()
  const [isInterestsDialogOpen, setIsInterestsDialogOpen] = useState(false)

  // For now, we'll show empty states until properties are added to database
  // In production, these would come from actual property listings
  const recommendedProperties: any[] = []

  // User's saved properties would come from database
  const savedProperties: any[] = []

  const isNewGuest = interests.length === 0 || new Date(user.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Welcome, {user.fullName || user.name}! 🌍
              </h1>
              <p className="text-muted-foreground mt-1 text-sm lg:text-base">
                {isNewGuest ? 'Ready to discover amazing places? Let&apos;s find your perfect stay!' : 'Discover your next adventure'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 w-full lg:w-auto">
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/profile">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Profile</span>
                  <span className="sm:hidden">Profile</span>
                </Link>
              </Button>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/search">
                  <Search className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Search Properties</span>
                  <span className="sm:hidden">Search</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Points and Daily Check-in */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              <PointsDisplay />
              <DailyCheckIn />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* New Guest Welcome Banner */}
        {isNewGuest && (
          <Card className="mb-8 nomadiqe-gradient-bg text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">🎉 Welcome to the Nomadiqe Community!</h2>
                  <p className="text-primary-foreground/80 mb-4">
                    Your profile is set up and ready. Start exploring unique properties and amazing experiences 
                    curated just for you{interests.length > 0 ? ' based on your interests' : ''}.
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-primary-foreground/80">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Profile Complete
                    </div>
                    {interests.length > 0 && (
                      <div className="flex items-center text-primary-foreground/80">
                        <Heart className="h-4 w-4 mr-2" />
                        {interests.length} Interest{interests.length > 1 ? 's' : ''} Selected
                      </div>
                    )}
                    <div className="flex items-center text-primary-foreground/80">
                      <Compass className="h-4 w-4 mr-2" />
                      Ready to Explore
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                    <Plane className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Your Interests */}
        {interests.length > 0 && (
          <Card className="mb-6 cursor-pointer" onClick={() => setIsInterestsDialogOpen(true)}>
            <CardHeader className="py-3 px-4">
              <CardTitle className="flex items-center text-base">
                <Heart className="h-4 w-4 mr-2" />
                Your Travel Interests
              </CardTitle>
              <CardDescription className="text-xs">We'll recommend properties based on these preferences</CardDescription>
            </CardHeader>
            <CardContent className="py-3 px-4">
              <div className="flex flex-wrap gap-1.5">
                {interests.map((interest: string) => (
                  <Badge key={interest} variant="secondary" className="px-2 py-0.5 text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-3 h-8 text-xs" onClick={(e) => { e.stopPropagation(); setIsInterestsDialogOpen(true) }}>
                <Plus className="h-3 w-3 mr-2" />
                Update Interests
              </Button>
            </CardContent>
          </Card>
        )}

        <Dialog open={isInterestsDialogOpen} onOpenChange={setIsInterestsDialogOpen}>
          <DialogContent className="sm:max-w-[640px]">
            <DialogHeader>
              <DialogTitle>Update Your Travel Interests</DialogTitle>
            </DialogHeader>
            <div className="mt-2">
              <InterestSelection onComplete={() => { setIsInterestsDialogOpen(false); router.refresh() }} />
            </div>
          </DialogContent>
        </Dialog>

        {/* Quick Actions */}
        <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => alert('Coming soon')}>
                  <Camera className="h-4 w-4 mr-2" />
                  Local Experiences
                </Button>
                
                <Button variant="outline" className="w-full justify-start" onClick={() => alert('Coming soon')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Become a Host
                </Button>
                
                <Button variant="outline" className="w-full justify-start" onClick={() => alert('Coming soon')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  My Trips
                </Button>
              </CardContent>
            </Card>

            {/* Travel Inspiration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Compass className="h-5 w-5 mr-2" />
                  Travel Inspiration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                  <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium text-blue-900">Trending Destinations</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Discover what's popular this season
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    <Badge variant="outline">Santorini</Badge>
                    <Badge variant="outline">Bali</Badge>
                    <Badge variant="outline">Tuscany</Badge>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full" onClick={() => alert('Coming soon')}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Explore Trending
                </Button>
              </CardContent>
            </Card>

      </div>
    </div>
  )
}
