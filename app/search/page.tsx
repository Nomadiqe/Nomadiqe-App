import { prisma } from '@/lib/db'
import { SearchHeaderImproved } from '@/components/search-header-improved'
import { SearchFiltersImproved } from '@/components/search-filters-improved'
import { SearchResultsImproved } from '@/components/search-results-improved'

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

    // Price range filter (handles formats like "0-100", "200+", etc.)
    if (searchParams.priceRange && searchParams.priceRange !== 'any') {
      where.price = {}
      if (searchParams.priceRange.includes('+')) {
        // Format: "200+"
        const min = parseInt(searchParams.priceRange.replace('+', ''))
        where.price.gte = min
      } else if (searchParams.priceRange.includes('-')) {
        // Format: "0-100"
        const [min, max] = searchParams.priceRange.split('-').map(Number)
        if (!isNaN(min)) where.price.gte = min
        if (!isNaN(max)) where.price.lte = max
      }
    }

    // Property type filter
    if (searchParams.propertyType && searchParams.propertyType !== 'any') {
      where.type = {
        equals: searchParams.propertyType,
        mode: 'insensitive' as const,
      }
    }

    // Amenities filter (handles comma-separated values)
    if (searchParams.amenities && searchParams.amenities !== 'any') {
      const amenitiesList = searchParams.amenities.split(',')
      where.amenities = {
        hasEvery: amenitiesList,
      }
    }

    const properties = await prisma.property.findMany({
      where,
      select: {
        id: true,
        title: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true,
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
      <section className="bg-gradient-to-br from-nomadiqe-600/5 via-purple-500/5 to-pink-500/5 border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-nomadiqe-600 to-purple-600 bg-clip-text text-transparent">
              Find Your Perfect Stay
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover unique properties and experiences around the world
            </p>
          </div>

          {/* Search Bar */}
          <SearchHeaderImproved />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filters - Desktop */}
            <aside className="w-full lg:w-80 lg:sticky lg:top-24 lg:self-start">
              <SearchFiltersImproved />
            </aside>

            {/* Search Results */}
            <main className="flex-1 min-w-0">
              <SearchResultsImproved properties={properties} />
            </main>
          </div>
        </div>
      </section>
    </div>
  )
}
