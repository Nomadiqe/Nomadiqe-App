'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Filter, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const propertyTypes = ['Apartment', 'House', 'Villa', 'Cabin', 'Loft']
const amenitiesList = ['WiFi', 'Pool', 'Kitchen', 'Parking', 'Air Conditioning', 'Workspace']

export function SearchFiltersImproved() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [minRating, setMinRating] = useState<string>('')

  const activeFiltersCount =
    (selectedType ? 1 : 0) +
    selectedAmenities.length +
    (minRating ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== 500 ? 1 : 0)

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Price range
    if (priceRange[0] !== 0 || priceRange[1] !== 500) {
      if (priceRange[1] >= 500) {
        params.set('priceRange', `${priceRange[0]}+`)
      } else {
        params.set('priceRange', `${priceRange[0]}-${priceRange[1]}`)
      }
    } else {
      params.delete('priceRange')
    }

    // Property type
    if (selectedType) {
      params.set('propertyType', selectedType.toLowerCase())
    } else {
      params.delete('propertyType')
    }

    // Amenities
    if (selectedAmenities.length > 0) {
      params.set('amenities', selectedAmenities.join(','))
    } else {
      params.delete('amenities')
    }

    // Rating
    if (minRating) {
      params.set('rating', minRating)
    } else {
      params.delete('rating')
    }

    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    setPriceRange([0, 500])
    setSelectedType('')
    setSelectedAmenities([])
    setMinRating('')
    router.push('/search')
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Price Range</Label>
          <span className="text-sm text-muted-foreground">
            €{priceRange[0]} - €{priceRange[1] >= 500 ? '500+' : priceRange[1]}
          </span>
        </div>
        <Slider
          min={0}
          max={500}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          className="w-full"
        />
      </div>

      <Separator />

      {/* Property Type */}
      <div className="space-y-3">
        <Label>Property Type</Label>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="Any type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any type</SelectItem>
            {propertyTypes.map(type => (
              <SelectItem key={type} value={type.toLowerCase()}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Amenities */}
      <div className="space-y-3">
        <Label>Amenities</Label>
        <div className="grid grid-cols-2 gap-3">
          {amenitiesList.map(amenity => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              <label
                htmlFor={amenity}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div className="space-y-3">
        <Label>Minimum Rating</Label>
        <Select value={minRating} onValueChange={setMinRating}>
          <SelectTrigger>
            <SelectValue placeholder="Any rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any rating</SelectItem>
            <SelectItem value="4.5">4.5+ stars</SelectItem>
            <SelectItem value="4.0">4.0+ stars</SelectItem>
            <SelectItem value="3.5">3.5+ stars</SelectItem>
            <SelectItem value="3.0">3.0+ stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
        {activeFiltersCount > 0 && (
          <Button onClick={clearFilters} variant="outline">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile: Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full relative">
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Refine your search with these filters
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto max-h-[calc(85vh-8rem)]">
              <FiltersContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Inline */}
      <div className="hidden lg:block">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filters</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} active</Badge>
            )}
          </div>
          <FiltersContent />
        </div>
      </div>
    </>
  )
}
