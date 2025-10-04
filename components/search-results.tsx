'use client'

import dynamic from 'next/dynamic'
import { PropertyCard } from '@/components/property-card'

// Dynamically import PropertyMap to avoid SSR issues with Leaflet
const PropertyMap = dynamic(() => import('@/components/property-map').then(mod => ({ default: mod.PropertyMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] lg:h-[calc(100vh-200px)] bg-muted rounded-lg flex items-center justify-center">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
})

interface Property {
  id: string
  title: string
  city: string
  country: string
  latitude?: number | null
  longitude?: number | null
  price: number
  currency: string
  maxGuests: number
  bedrooms: number
  images: string[]
  averageRating: number
}

interface SearchResultsProps {
  properties: Property[]
}

export function SearchResults({ properties }: SearchResultsProps) {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Available Properties</h2>
        <p className="text-muted-foreground">{properties.length} properties found</p>
      </div>

      {/* Results */}
      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No properties found</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map - Left on desktop, Top on mobile */}
          <div className="w-full lg:w-2/5 lg:sticky lg:top-24 lg:self-start">
            <PropertyMap properties={properties} />
          </div>

          {/* Grid - Right on desktop, Bottom on mobile */}
          <div className="w-full lg:w-3/5">
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property) => (
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
          </div>
        </div>
      )}
    </div>
  )
}
