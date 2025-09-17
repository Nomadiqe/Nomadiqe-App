'use client'

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

interface GuestDashboardProps {
  user: any // User with guestPreferences
}

export default function GuestDashboard({ user }: GuestDashboardProps) {
  const guestPreferences = user.guestPreferences
  const interests = guestPreferences?.travelInterests || []
  
  // Demo recommended properties based on interests
  const recommendedProperties = [
    {
      id: '1',
      title: 'Beachfront Villa in Santorini',
      location: 'Santorini, Greece',
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
      price: 180,
      rating: 4.9,
      reviews: 127,
      host: 'Maria K.',
      tags: ['Beach', 'Luxury', 'Romance'],
      distance: '2.3km from center'
    },
    {
      id: '2',
      title: 'Mountain Cabin in Swiss Alps',
      location: 'Zermatt, Switzerland',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
      price: 120,
      rating: 4.8,
      reviews: 89,
      host: 'Hans M.',
      tags: ['Nature', 'Adventure', 'Wellness'],
      distance: 'Mountain view'
    },
    {
      id: '3',
      title: 'Historic Apartment in Rome',
      location: 'Rome, Italy',
      image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800',
      price: 95,
      rating: 4.7,
      reviews: 203,
      host: 'Giuseppe R.',
      tags: ['Culture', 'History', 'City Breaks'],
      distance: '0.5km from Colosseum'
    }
  ]

  // Demo saved properties
  const savedProperties = [
    {
      id: '1',
      title: 'Artist Loft in Barcelona',
      location: 'Barcelona, Spain',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      price: 75,
      rating: 4.6,
      savedDate: '2 days ago'
    }
  ]

  const isNewGuest = interests.length === 0 || new Date(user.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user.fullName || user.name}! 🌍
              </h1>
              <p className="text-gray-600 mt-1">
                {isNewGuest ? 'Ready to discover amazing places? Let\'s find your perfect stay!' : 'Discover your next adventure'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link href="/profile">
                  <Users className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button asChild>
                <Link href="/search">
                  <Search className="h-4 w-4 mr-2" />
                  Search Properties
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* New Guest Welcome Banner */}
        {isNewGuest && (
          <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">🎉 Welcome to the Nomadiqe Community!</h2>
                  <p className="text-blue-100 mb-4">
                    Your profile is set up and ready. Start exploring unique properties and amazing experiences 
                    curated just for you{interests.length > 0 ? ' based on your interests' : ''}.
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-blue-100">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Profile Complete
                    </div>
                    {interests.length > 0 && (
                      <div className="flex items-center text-blue-100">
                        <Heart className="h-4 w-4 mr-2" />
                        {interests.length} Interest{interests.length > 1 ? 's' : ''} Selected
                      </div>
                    )}
                    <div className="flex items-center text-blue-100">
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

        {/* Quick Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Find Your Perfect Stay</h2>
              <Button variant="outline" asChild>
                <Link href="/search/advanced">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Search
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Destination</label>
                <div className="mt-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Check-in</label>
                <div className="mt-1">
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Interests */}
        {interests.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Your Travel Interests
              </CardTitle>
              <CardDescription>We'll recommend properties based on these preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest: string) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link href="/profile/interests">
                  <Plus className="h-4 w-4 mr-2" />
                  Update Interests
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Recommended Properties */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recommended for You</h2>
              <Button variant="outline" asChild>
                <Link href="/search">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {recommendedProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-2/5">
                      <div className="relative">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-3 right-3 bg-white/90 hover:bg-white"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="md:w-3/5">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{property.title}</h3>
                          <div className="text-right">
                            <p className="font-bold text-lg">€{property.price}</p>
                            <p className="text-xs text-gray-500">per night</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{property.location}</span>
                        </div>

                        <div className="flex items-center mb-3">
                          <div className="flex items-center mr-4">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">{property.rating}</span>
                            <span className="text-sm text-gray-500 ml-1">({property.reviews} reviews)</span>
                          </div>
                          <span className="text-xs text-gray-500">{property.distance}</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {property.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1" asChild>
                            <Link href={`/property/${property.id}`}>
                              View Details
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Saved Properties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bookmark className="h-5 w-5 mr-2" />
                  Saved Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedProperties.length > 0 ? (
                  <div className="space-y-3">
                    {savedProperties.map((property) => (
                      <div key={property.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{property.title}</p>
                          <p className="text-xs text-gray-600">{property.location}</p>
                          <p className="text-xs text-gray-500">Saved {property.savedDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">€{property.price}</p>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-xs">{property.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      View All Saved
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Bookmark className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No saved properties yet</p>
                    <p className="text-xs text-gray-500">Save properties to view them here</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/experiences">
                    <Camera className="h-4 w-4 mr-2" />
                    Local Experiences
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/host/become">
                    <Plus className="h-4 w-4 mr-2" />
                    Become a Host
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/trips">
                    <Calendar className="h-4 w-4 mr-2" />
                    My Trips
                  </Link>
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
                
                <Button variant="outline" size="sm" className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Explore Trending
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Interest-Based Recommendations */}
        {interests.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">More {interests[0]} Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedProperties.slice(0, 3).map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-3 left-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                          {property.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-gray-600">
                        Hosted by {property.host}
                      </div>
                      <div className="font-bold text-lg">
                        €{property.price}/night
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {property.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full" asChild>
                      <Link href={`/property/${property.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Become a Host CTA */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  <Plus className="h-5 w-5 inline mr-2" />
                  Ready to Become a Host?
                </h3>
                <p className="text-green-700 mb-4">
                  Share your space with travelers from around the world and start earning. 
                  It's easy to get started and you're in control of your availability and pricing.
                </p>
                <div className="flex items-center space-x-4">
                  <Button asChild>
                    <Link href="/host/learn-more">
                      Learn More
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/onboarding/role-selection">
                      <Plus className="h-4 w-4 mr-2" />
                      Become a Host
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white">
                  <Users className="h-16 w-16" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
