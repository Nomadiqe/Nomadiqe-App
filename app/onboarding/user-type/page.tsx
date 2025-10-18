"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  MapPin, 
  Home, 
  Camera, 
  ArrowRight,
  Check
} from 'lucide-react'

export default function UserTypeSelectionPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  const handleUserTypeSelect = async (userType: string) => {
    if (!session?.user?.id) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/user/update-role', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: userType.toUpperCase(),
        }),
      })

      if (response.ok) {
        // Redirect to next onboarding step based on user type
        switch (userType) {
          case 'traveler':
            router.push('/onboarding/profile-setup')
            break
          case 'host':
            router.push('/onboarding/host-setup')
            break
          case 'digital-creator':
            router.push('/onboarding/creator-setup')
            break
          default:
            router.push('/onboarding/profile-setup')
        }
      } else {
        console.error('Failed to update user role')
      }
    } catch (error) {
      console.error('Error updating user role:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Welcome to Nomadiqe!</h1>
            <p className="text-muted-foreground mt-2">
              First, let's get to know you better. What brings you here?
            </p>
          </div>
        </div>
      </div>

      {/* User Type Selection */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Traveler */}
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedType === 'traveler' 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => setSelectedType('traveler')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Traveler</h3>
              <p className="text-muted-foreground text-sm mb-4">
                I'm looking for unique places to stay and amazing experiences around the world.
              </p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-3 h-3" />
                  <span>Discover unique accommodations</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-3 h-3" />
                  <span>Share travel experiences</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-3 h-3" />
                  <span>Connect with locals</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Host */}
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedType === 'host' 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => setSelectedType('host')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Home className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Host</h3>
              <p className="text-muted-foreground text-sm mb-4">
                I have a property or space I want to share with travelers and guests.
              </p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-3 h-3" />
                  <span>List your property</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-3 h-3" />
                  <span>Manage bookings</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-3 h-3" />
                  <span>Earn from hosting</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Digital Creator */}
          <Card 
            className={`cursor-pointer transition-all duration-*

                : 'hover:border-primary/50'
            }`}
            onClick={() => setSelectedType('digital-creator')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Digital Creator</h3>
              <p className="text-muted-foreground text-sm mb-4">
                I create content and want to collaborate with properties and brands.
              </p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-3 h-3" />
                  <span>Create amazing content</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-3 h-3" />
                  <span>Collaborate with brands</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Check className="w-3 h-3" />
                  <span>Grow your audience</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="text-center mt-8">
          <Button
            onClick={() => selectedType && handleUserTypeSelect(selectedType)}
            disabled={!selectedType || isLoading}
            className="px-8 py-3"
            size="lg"
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
            ) : (
              <ArrowRight className="w-4 h-4 mr-2" />
            )}
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
