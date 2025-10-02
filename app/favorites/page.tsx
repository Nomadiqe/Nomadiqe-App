import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/property-card'
import { Heart, Filter } from 'lucide-react'

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Mock favorites data - in real app, fetch from database
  const favorites = [
    {
      id: "1",
      title: "Cozy Mountain Cabin",
      location: "Swiss Alps",
      price: 120,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      guests: 4,
      bedrooms: 2,
    },
    {
      id: "2",
      title: "Beachfront Villa",
      location: "Bali, Indonesia",
      price: 200,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      guests: 6,
      bedrooms: 3,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-card border-b border-border py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-3">
                <Heart className="w-8 h-8 text-red-500 fill-current" />
                <span>Your Favorites</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Properties you&apos;ve saved for later
              </p>
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {favorites.length > 0 ? (
            <>
              <div className="mb-8">
                <p className="text-muted-foreground">
                  {favorites.length} favorite{favorites.length !== 1 ? 's' : ''} saved
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
              <p className="text-muted-foreground mb-6">
                Start exploring and save properties you love by clicking the heart icon
              </p>
              <Button asChild>
                <a href="/search">Browse Properties</a>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}