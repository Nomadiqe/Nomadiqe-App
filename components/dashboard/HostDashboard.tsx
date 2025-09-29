'use client'

/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Home, 
  Calendar, 
  Users, 
  Euro, 
  Star, 
  TrendingUp, 
  Plus, 
  Share2, 
  Camera, 
  Settings,
  Eye,
  Edit,
  MessageSquare,
  Gift,
  Copy,
  CheckCircle,
  Clock,
  MapPin,
  Wifi,
  Car,
  Heart
} from 'lucide-react'
import Link from 'next/link'

interface HostDashboardProps {
  user: any // User with hostProfile and properties
}

export default function HostDashboard({ user }: HostDashboardProps) {
  const [copiedReferral, setCopiedReferral] = useState(false)
  
  const hostProfile = user.hostProfile
  const properties = user.properties || []
  const activeProperties = properties.filter((p: any) => p.isActive)

  // Calculate real statistics from user data
  const allBookings = properties.flatMap((p: any) => p.bookings || [])
  const confirmedBookings = allBookings.filter((b: any) => b.status === 'CONFIRMED')
  const completedBookings = allBookings.filter((b: any) => b.status === 'COMPLETED')
  const allReviews = properties.flatMap((p: any) => p.reviews || [])

  const stats = {
    totalProperties: activeProperties.length,
    totalBookings: allBookings.length,
    totalRevenue: completedBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0),
    totalReviews: allReviews.length
  }

  // Get real upcoming bookings from user data
  const now = new Date()
  const upcomingBookings = allBookings
    .filter((b: any) => new Date(b.checkIn) > now && (b.status === 'CONFIRMED' || b.status === 'PENDING'))
    .sort((a: any, b: any) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
    .slice(0, 5)
    .map((booking: any) => {
      const property = properties.find((p: any) => p.id === booking.propertyId)
      return {
        id: booking.id,
        property: property?.title || 'Property',
        guest: booking.traveler?.name || 'Guest',
        checkIn: new Date(booking.checkIn).toLocaleDateString(),
        checkOut: new Date(booking.checkOut).toLocaleDateString(),
        guests: booking.guests || 1,
        total: booking.totalAmount || 0,
        status: booking.status?.toLowerCase() || 'pending'
      }
    })

  // Get real collaboration requests (for now, empty until we have collaboration data)
  const collaborationRequests: any[] = [] // Will be populated when collaboration system is built

  const copyReferralCode = () => {
    navigator.clipboard.writeText(`https://nomadiqe.com/invite/${hostProfile?.referralCode}`)
    setCopiedReferral(true)
    setTimeout(() => setCopiedReferral(false), 2000)
  }

  const isNewHost = !properties.length || properties.every((p: any) => new Date(p.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {user.fullName || user.name}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                {isNewHost ? 'Thanks for joining as a host! Here\'s your dashboard.' : 'Manage your properties and bookings'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link href="/profile">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <Button asChild>
                <Link href="/host/create-property">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* New Host Welcome Banner */}
        {isNewHost && (
          <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">🎉 Welcome to Nomadiqe Host Community!</h2>
                  <p className="text-blue-100 mb-4">
                    Your account is set up and ready. Your first property listing is under review and will be published soon.
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-blue-100">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Onboarding Complete
                    </div>
                    <div className="flex items-center text-blue-100">
                      <Clock className="h-4 w-4 mr-2" />
                      Listing Under Review
                    </div>
                    <div className="flex items-center text-blue-100">
                      <Gift className="h-4 w-4 mr-2" />
                      Referral Code Ready
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="text-xs text-blue-100 mb-1">Your Referral Code</p>
                    <p className="font-bold text-lg">{hostProfile?.referralCode}</p>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={copyReferralCode}
                      className="mt-2"
                    >
                      {copiedReferral ? 'Copied!' : 'Copy Link'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview - Only showing real data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Properties</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProperties}</div>
              <p className="text-xs text-muted-foreground">
                Listed on platform
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From completed bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reviews</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
              <p className="text-xs text-muted-foreground">
                Guest feedback
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Upcoming Bookings
                  </CardTitle>
                  <CardDescription>Your next few reservations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingBookings.map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {booking.guest.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{booking.guest}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">€{booking.total}</p>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/host/bookings">
                      View All Bookings
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Collaboration Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Collaboration Requests
                  </CardTitle>
                  <CardDescription>Influencers interested in your property</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {collaborationRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={request.avatar}
                          alt={request.influencer}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{request.influencer}</p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Camera className="h-3 w-3 mr-1" />
                            {request.followers} on {request.platform}
                          </p>
                          <p className="text-xs text-gray-500">{request.niche} • {request.requested}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                        <Button size="sm">
                          Respond
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/host/collaborations">
                      View All Requests
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2" asChild>
                    <Link href="/host/create-property">
                      <Plus className="h-6 w-6" />
                      <span className="text-sm">Add Property</span>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2" asChild>
                    <Link href="/host/calendar">
                      <Calendar className="h-6 w-6" />
                      <span className="text-sm">Manage Calendar</span>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2" asChild>
                    <Link href="/host/pricing">
                      <Euro className="h-6 w-6" />
                      <span className="text-sm">Update Pricing</span>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2" asChild>
                    <Link href="/host/analytics">
                      <TrendingUp className="h-6 w-6" />
                      <span className="text-sm">View Analytics</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Your Properties</h2>
                <p className="text-muted-foreground">Manage your listings and availability</p>
              </div>
              <Button asChild>
                <Link href="/host/create-property">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Property
                </Link>
              </Button>
            </div>

            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property: any) => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={property.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'}
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant={property.isActive ? 'default' : 'secondary'}>
                          {property.isActive ? 'Published' : 'Under Review'}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                            {stats.avgRating}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.city}, {property.country}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-gray-600">
                          {property.maxGuests} guests • {property.bedrooms} bedrooms
                        </div>
                        <div className="font-bold text-lg">
                          €{property.price}/night
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-4">
                        {property.amenities.slice(0, 3).map((amenity: string) => (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            {amenity === 'wifi' && <Wifi className="h-3 w-3 mr-1" />}
                            {amenity === 'parking' && <Car className="h-3 w-3 mr-1" />}
                            {amenity}
                          </Badge>
                        ))}
                        {property.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{property.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={`/host/property/${property.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={`/host/property/${property.id}/edit`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center p-12">
                <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Properties Yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't added any properties yet. Create your first listing to start welcoming guests!
                </p>
                <Button asChild>
                  <Link href="/host/create-property">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Property
                  </Link>
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Booking Management</h2>
                <p className="text-gray-600">View and manage your reservations</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/host/calendar">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Link>
              </Button>
            </div>

            <div className="grid gap-6">
              {upcomingBookings.map((booking: any) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                          {booking.guest.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{booking.guest}</h3>
                          <p className="text-gray-600">{booking.property}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-1" />
                              {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">€{booking.total}</p>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="mt-2">
                          {booking.status}
                        </Badge>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          {booking.status === 'pending' && (
                            <Button size="sm">
                              Accept
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Collaborations Tab */}
          <TabsContent value="collaborations" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Influencer Collaborations</h2>
                <p className="text-gray-600">Manage partnerships with content creators</p>
              </div>
              <Button asChild>
                <Link href="/host/find-influencers">
                  <Users className="h-4 w-4 mr-2" />
                  Find Influencers
                </Link>
              </Button>
            </div>

            {/* Collaboration Setup Summary */}
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-800">
                  <Gift className="h-5 w-5 mr-2" />
                  Your Standard Offer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-purple-800">Offer Type</p>
                    <p className="text-purple-700">Free Stay</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-800">Duration</p>
                    <p className="text-purple-700">2-7 nights</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-800">Min. Followers</p>
                    <p className="text-purple-700">10,000+</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-purple-800 mb-2">Expected Deliverables</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Instagram posts (1-3)</Badge>
                    <Badge variant="outline">Instagram stories (5-10)</Badge>
                    <Badge variant="outline">Google/TripAdvisor review</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Requests */}
            <div className="space-y-4">
              {collaborationRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={request.avatar}
                          alt={request.influencer}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{request.influencer}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Camera className="h-4 w-4 mr-1" />
                              {request.followers} followers
                            </div>
                            <Badge variant="outline">{request.platform}</Badge>
                            <Badge variant="outline">{request.niche}</Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Requested {request.requested}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline">
                          View Portfolio
                        </Button>
                        <Button variant="outline">
                          Decline
                        </Button>
                        <Button>
                          Accept Collaboration
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Referral Program */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <Share2 className="h-5 w-5 mr-2" />
                  Referral Program
                </CardTitle>
                <CardDescription className="text-green-700">
                  Invite other hosts and earn rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-800 mb-1">Your Referral Code</p>
                    <code className="bg-white px-3 py-2 rounded border text-green-800 font-mono">
                      {hostProfile?.referralCode}
                    </code>
                    <p className="text-sm text-green-700 mt-2">
                      Earn €50 for each host that joins and gets their first booking!
                    </p>
                  </div>
                  <div className="text-center">
                    <Button onClick={copyReferralCode} className="mb-2">
                      <Copy className="h-4 w-4 mr-2" />
                      {copiedReferral ? 'Copied!' : 'Copy Link'}
                    </Button>
                    <p className="text-xs text-green-600">0 referrals so far</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
