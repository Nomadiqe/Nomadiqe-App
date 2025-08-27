"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'

interface AdCardProps {
  id: string
  title: string
  description?: string
  images: string[]
  link?: string
  property?: {
    id: string
    title: string
    city: string
    country: string
    price: number
    currency: string
    maxGuests: number
    bedrooms: number
  }
}

export function AdCard({
  id,
  title,
  description,
  images,
  link,
  property
}: AdCardProps) {
  const handleClick = () => {
    if (link) {
      window.location.href = link
    } else if (property) {
      window.location.href = `/property/${property.id}`
    }
  }

  return (
    <div className="bg-gradient-to-br from-nomadiqe-500/10 to-purple-500/10 border border-nomadiqe-200 rounded-lg p-6 space-y-4 relative">
      {/* Featured Badge */}
      <div className="absolute top-3 right-3">
        <div className="bg-nomadiqe-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          Featured
        </div>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>

      {/* Image */}
      {images.length > 0 && (
        <div className="relative overflow-hidden rounded-md">
          <img
            src={images[0]}
            alt={title}
            className="w-full h-48 object-cover transition-transform hover:scale-105"
          />
        </div>
      )}

      {/* Property Details (if linked to property) */}
      {property && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">{property.title}</h4>
              <p className="text-sm text-muted-foreground">
                {property.city}, {property.country}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-foreground">
                {property.currency}{property.price}
              </p>
              <p className="text-xs text-muted-foreground">per night</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{property.maxGuests} guests</span>
            <span>{property.bedrooms} bedrooms</span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>4.8</span>
            </div>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <Button 
        className="w-full bg-nomadiqe-600 hover:bg-nomadiqe-700"
        onClick={handleClick}
      >
        {property ? 'View Property' : 'Learn More'}
      </Button>
    </div>
  )
}
