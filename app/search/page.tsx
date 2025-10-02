import { prisma } from '@/lib/db'
import { SearchBar } from '@/components/search-bar'
import { PropertyCard } from '@/components/property-card'
import { SearchFilters } from '@/components/search-filters'

interface SearchParams {
  priceRange?: string
  propertyType?: string
  amenities?: string
  rating?: string
}

async function getProperties(searchParams: SearchParams) {
  try {
    // Build where clause based on filters
    const where: any = {
      isActive: true,
    }

    // Price range filter
    if (searchParams.priceRange && searchParams.priceRange !== 'any') {
      const priceRanges: Record<string, { min?: number; max?: number }> = {
        '0-50': { max: 50 },
        '50-100': { min: 50, max: 100 },
        '100-200': { min: 100, max: 200 },
        '200+': { min: 200 },
      }
      const range = priceRanges[searchParams.priceRange]
      if (range) {
        where.price = {}
        if (range.min !== undefined) where.price.gte = range.min
        if (range.max !== undefined) where.price.lte = range.max
      }
    }

    // Property type filter
    if (searchParams.propertyType && searchParams.propertyType !== 'any') {
      where.type = {
        equals: searchParams.propertyType,
        mode: 'insensitive' as const,
      }
    }

    // Amenities filter
    if (searchParams.amenities && searchParams.amenities !== 'any') {
      where.amenities = {
        has: searchParams.amenities,
      }
    }

    const properties = await prisma.property.findMany({
      where,
      select: {
        id: true,
        title: true,
        city: true,
        country: true,
        price: true,
        currency: true,
        maxGuests: true,
        bedrooms: true,
        images: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      take: 20,
      orderBy: {
        createdAt: 'desc',
      },
    })

    let filteredProperties = properties.map((property: any) => ({
      ...property,
      averageRating:
        property.reviews.length > 0
          ? property.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / property.reviews.length
          : 0,
    }))

    // Rating filter (applied after fetching since it's calculated)
    if (searchParams.rating && searchParams.rating !== 'any') {
      const minRating = parseFloat(searchParams.rating)
      filteredProperties = filteredProperties.filter(
        (p: any) => p.averageRating >= minRating
      )
    }

    return filteredProperties
  } catch (error) {
    console.error('Error fetching properties:', error)
    return []
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const properties = await getProperties(searchParams)
  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <section className="bg-card border-b border-border py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Find Your Perfect Stay</h1>
            <p className="text-muted-foreground">
              Discover unique properties and experiences around the world
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <SearchBar />
          </div>

          {/* Filters - Removed for now, using SearchFilters component later */}
        </div>
      </section>

      {/* Filters Panel */}
      <SearchFilters />

      {/* Search Results */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Available Properties</h2>
            <p className="text-muted-foreground">{properties.length} properties found</p>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No properties found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property: any) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  location={`${property.city}, ${property.country}`}
                  price={property.price}
                  rating={property.averageRating}
                  image={property.images[0] || '/placeholder-property.jpg'}
                  guests={property.maxGuests}
                  bedrooms={property.bedrooms}
                  currency={property.currency}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
