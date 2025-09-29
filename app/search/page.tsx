"use client"

import { useState } from 'react'
import { SearchBar } from '@/components/search-bar'
import { PropertyCard } from '@/components/property-card'
import { Button } from '@/components/ui/button'
import { Filter, MapIcon } from 'lucide-react'

export default function SearchPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
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

          {/* Filters */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              className="flex items-center space-x-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2"
              onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
            >
              <MapIcon className="w-4 h-4" />
              <span>{viewMode === 'grid' ? 'Map View' : 'Grid View'}</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <section className="bg-muted py-6 border-b border-border">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                  <option>Any price</option>
                  <option>$0 - $50</option>
                  <option>$50 - $100</option>
                  <option>$100 - $200</option>
                  <option>$200+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Property Type</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                  <option>Any type</option>
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Villa</option>
                  <option>Cabin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Amenities</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                  <option>Any amenities</option>
                  <option>WiFi</option>
                  <option>Pool</option>
                  <option>Kitchen</option>
                  <option>Parking</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                  <option>Any rating</option>
                  <option>4.5+ stars</option>
                  <option>4.0+ stars</option>
                  <option>3.5+ stars</option>
                </select>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search Results */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Available Properties</h2>
            <p className="text-muted-foreground">312 properties found</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Sample search results - in real app, these would come from the database based on search */}
            <PropertyCard
              id="1"
              title="Cozy Mountain Cabin"
              location="Swiss Alps"
              price={120}
              rating={4.8}
              image="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              guests={4}
              bedrooms={2}
            />
            <PropertyCard
              id="2"
              title="Modern City Loft"
              location="Barcelona, Spain"
              price={85}
              rating={4.9}
              image="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              guests={2}
              bedrooms={1}
            />
            <PropertyCard
              id="3"
              title="Beachfront Villa"
              location="Bali, Indonesia"
              price={200}
              rating={4.7}
              image="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              guests={6}
              bedrooms={3}
            />
            <PropertyCard
              id="4"
              title="Urban Studio"
              location="New York, USA"
              price={95}
              rating={4.6}
              image="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              guests={2}
              bedrooms={1}
            />
            <PropertyCard
              id="5"
              title="Countryside Cottage"
              location="Cotswolds, UK"
              price={110}
              rating={4.8}
              image="https://images.unsplash.com/photo-1520637836862-4d197d17c90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              guests={4}
              bedrooms={2}
            />
            <PropertyCard
              id="6"
              title="Desert Oasis"
              location="Marrakech, Morocco"
              price={75}
              rating={4.5}
              image="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              guests={3}
              bedrooms={2}
            />
            <PropertyCard
              id="7"
              title="Lakeside Retreat"
              location="Lake Como, Italy"
              price={180}
              rating={4.9}
              image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              guests={5}
              bedrooms={3}
            />
            <PropertyCard
              id="8"
              title="Tokyo Apartment"
              location="Shibuya, Japan"
              price={65}
              rating={4.7}
              image="https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              guests={2}
              bedrooms={1}
            />
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                console.log('Loading more properties...')
                // In real app, this would load more data
              }}
            >
              Load More Properties
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
