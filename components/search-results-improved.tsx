'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { PropertyCard } from '@/components/property-card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Map, Grid3x3 } from 'lucide-react'

// Dynamically import PropertyMap to avoid SSR issues with Leaflet
const PropertyMap = dynamic(() => import('@/components/property-map').then(mod => ({ default: mod.PropertyMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[70vh] bg-muted rounded-lg flex items-center justify-center">
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

export function SearchResultsImproved({ properties }: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'split'>('grid')
  const validMapProperties = properties.filter(p => p.latitude && p.longitude)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            {properties.length === 0 ? 'No properties found' : `${properties.length} ${properties.length === 1 ? 'property' : 'properties'}`}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Discover your perfect stay
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="hidden sm:flex items-center gap-2"
          >
            <Grid3x3 className="w-4 h-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'split' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('split')}
            className="hidden sm:flex items-center gap-2"
            disabled={validMapProperties.length === 0}
          >
            <Map className="w-4 h-4" />
            Split View
          </Button>

          {/* Mobile Map Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="sm:hidden"
                disabled={validMapProperties.length === 0}
              >
                <Map className="w-4 h-4 mr-2" />
                Map
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] w-full h-[85vh]">
              <DialogHeader>
                <DialogTitle>Property Locations</DialogTitle>
                <DialogDescription>
                  {validMapProperties.length} {validMapProperties.length === 1 ? 'property' : 'properties'} with location data
                </DialogDescription>
              </DialogHeader>
              <div className="h-[calc(85vh-6rem)] mt-4">
                <PropertyMap properties={properties} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Results */}
      {properties.length === 0 ? (
        <div className="text-center py-24 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground text-lg mb-2">No properties match your filters</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      ) : (
        <div className="flex gap-6">
          {/* Map - 35% */}
          <div className="w-[35%] sticky top-24 self-start">
            <PropertyMap properties={properties} />
          </div>

          {/* Grid - 65% */}
          <div className="w-[65%]">
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
