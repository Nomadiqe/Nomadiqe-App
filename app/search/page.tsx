import { prisma } from '@/lib/db'
import { SearchHeaderImproved } from '@/components/search-header-improved'
import { SearchFiltersImproved } from '@/components/search-filters-improved'
import { SearchResultsImproved } from '@/components/search-results-improved'

// Disable caching for this page to always show latest properties
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface SearchParams {
  location?: string
  checkIn?: string
  checkOut?: string
  guests?: string
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

    // Location filter
    if (searchParams.location) {
      where.OR = [
        { city: { contains: searchParams.location, mode: 'insensitive' as const } },
        { country: { contains: searchParams.location, mode: 'insensitive' as const } },
        { title: { contains: searchParams.location, mode: 'insensitive' as const } },
      ]
    }

    // Guests filter
    if (searchParams.guests) {
      const guestCount = parseInt(searchParams.guests)
      if (!isNaN(guestCount)) {
        where.maxGuests = { gte: guestCount }
      }
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
    <div className="h-[calc(100vh-8rem)] sm:min-h-screen flex flex-col relative overflow-hidden">
      {/* Modern Gradient Background with Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-300/30 via-purple-400/40 to-purple-600/50 -z-10" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl -z-10" />

      {/* Search Header - Desktop only */}
      <section className="hidden sm:block relative py-6 shrink-0">
        <div className="max-w-[1600px] mx-auto px-4">
          {/* Search Bar */}
          <SearchHeaderImproved />
        </div>
      </section>

      {/* Main Content - Takes remaining height, accounting for mobile nav */}
      <section className="flex-1 overflow-hidden sm:px-4 sm:py-4 relative">
        <div className="max-w-[1600px] mx-auto h-full">
          {/* Search Results with Integrated Filters */}
          <SearchResultsImproved properties={properties} />
        </div>
      </section>
    </div>
  )
}
