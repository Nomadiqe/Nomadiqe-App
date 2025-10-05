'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { PropertyCard } from '@/components/property-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Map, Grid3x3, SlidersHorizontal } from 'lucide-react'
import { SearchFiltersContent } from '@/components/search-filters-improved'

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
  const [viewMode, setViewMode] = useState<'grid' | 'split'>('split')
  const validMapProperties = properties.filter(p => p.latitude && p.longitude)
  const searchParams = useSearchParams()

  // Calculate active filters count
  const activeFiltersCount =
    (searchParams.get('priceRange') ? 1 : 0) +
    (searchParams.get('propertyType') ? 1 : 0) +
    (searchParams.get('amenities') ? searchParams.get('amenities')!.split(',').length : 0) +
    (searchParams.get('rating') ? 1 : 0)

  return (
    <div className="h-full flex flex-col">
      {/* Header - Compact */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-4">
          {/* Desktop Filters Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hidden lg:flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your search with these filters
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
                <SearchFiltersContent />
              </div>
            </SheetContent>
          </Sheet>

          <h2 className="text-lg font-semibold">
            {properties.length === 0 ? 'No properties found' : `${properties.length} ${properties.length === 1 ? 'property' : 'properties'}`}
          </h2>
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

      {/* Results - Takes remaining height */}
      {properties.length === 0 ? (
        <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-lg">
          <div className="text-center">
            <p className="text-muted-foreground text-lg mb-2">No properties match your filters</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="flex-1 overflow-y-auto">
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
        </div>
      ) : (
        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Map - 50% - Hidden on mobile */}
          <div className="hidden sm:block w-1/2 rounded-lg overflow-hidden border border-border">
            <PropertyMap properties={properties} />
          </div>

          {/* List - 50% on desktop, full width on mobile */}
          <div className="w-full sm:w-1/2 overflow-y-auto">
            <div className="grid gap-4 pr-2">
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
                  variant="list"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
