import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { MapPin, Star, Users, Bed, Bath } from 'lucide-react'

export default async function ExplorePage() {
  const session = await getServerSession(authOptions)

  // Fetch properties for exploration
  const properties = await prisma.property.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 12,
    include: {
      host: {
        select: {
          id: true,
          name: true,
          fullName: true,
          image: true,
          profilePictureUrl: true,
        }
      },
      reviews: {
        select: {
          rating: true,
        }
      },
      _count: {
        select: {
          reviews: true,
        }
      }
    }
  })

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'EUR',
    }).format(price)
  }

  const getAverageRating = (reviews: any[]) => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Explore Unique Stays</h1>
              <p className="text-muted-foreground mt-2">
                Discover amazing properties and experiences around the world
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Sign up banner for unauthenticated users */}
          {!session && (
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-semibold mb-1">Join the Nomadiqe Community</h3>
                    <p className="text-sm text-muted-foreground">
                      Sign up to book these amazing properties, share your adventures, and connect with travelers
                    </p>
                  </div>
                  <div className="flex gap-3 flex-shrink-0">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/auth/signin">Sign In</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Properties Grid */}
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-white/90 text-black">
                        {property.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg leading-tight mb-1">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{property.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {getAverageRating(property.reviews)}
                          </span>
                          <span className="text-muted-foreground">
                            ({property._count.reviews} reviews)
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {formatPrice(property.price, property.currency)}
                          </div>
                          <div className="text-xs text-muted-foreground">per night</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{property.maxGuests} guests</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          <span>{property.bedrooms} bedrooms</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          <span>{property.bathrooms} bathrooms</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        {session ? (
                          <Button asChild className="w-full">
                            <Link href={`/property/${property.id}`}>
                              View Details
                            </Link>
                          </Button>
                        ) : (
                          <Button asChild className="w-full" variant="outline">
                            <Link href="/auth/signin">
                              Sign In to Book
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground">
                Check back later for new amazing stays!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
