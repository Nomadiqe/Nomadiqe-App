import { createClient } from '@/lib/supabase/server'
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
    const supabase = await createClient()
    
    // Build query
    let query = supabase
      .from('properties')
      .select(`
        id,
        title,
        city,
        country,
        latitude,
        longitude,
        price,
        currency,
        maxGuests,
        bedrooms,
        images,
        type,
        amenities,
        reviews:reviews(rating)
      `)
      .eq('isActive', true)

    // Location filter
    if (searchParams.location) {
      query = query.or(`city.ilike.%${searchParams.location}%,country.ilike.%${searchParams.location}%,title.ilike.%${searchParams.location}%`)
    }

    // Guests filter
    if (searchParams.guests) {
      const guestCount = parseInt(searchParams.guests)
      if (!isNaN(guestCount)) {
        query = query.gte('maxGuests', guestCount)
      }
    }

    // Price range filter
    if (searchParams.priceRange && searchParams.priceRange !== 'any') {
      if (searchParams.priceRange.includes('+')) {
        const min = parseInt(searchParams.priceRange.replace('+', ''))
        query = query.gte('price', min)
      } else if (searchParams.priceRange.includes('-')) {
        const [min, max] = searchParams.priceRange.split('-').map(Number)
        if (!isNaN(min)) query = query.gte('price', min)
        if (!isNaN(max)) query = query.lte('price', max)
      }
    }

    // Property type filter
    if (searchParams.propertyType && searchParams.propertyType !== 'any') {
      query = query.eq('type', searchParams.propertyType as any)
    }

    // Note: Amenities filter would need to be handled differently in Supabase
    // For now, we'll filter in memory after fetching

    query = query.order('created_at', { ascending: false })

    const { data: properties, error } = await query

    if (error) {
      throw error
    }

    // Process properties and calculate ratings
    let filteredProperties = (properties || []).map((property: any) => {
      const reviews = property.reviews || []
      return {
        ...property,
        averageRating:
          reviews.length > 0
            ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length
            : 0,
      }
    })

    // Amenities filter (in memory)
    if (searchParams.amenities && searchParams.amenities !== 'any') {
      const amenitiesList = searchParams.amenities.split(',')
      filteredProperties = filteredProperties.filter((p: any) => {
        const propertyAmenities = Array.isArray(p.amenities) ? p.amenities : []
        return amenitiesList.every(amenity => propertyAmenities.includes(amenity))
      })
    }

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
    <div className="h-[calc(100vh-8rem)] sm:min-h-screen flex flex-col bg-background">

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
