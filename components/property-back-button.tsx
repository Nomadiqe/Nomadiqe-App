'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export function PropertyBackButton() {
  const searchParams = useSearchParams()
  
  // Build back URL with search params if they exist
  const buildBackUrl = () => {
    const params = new URLSearchParams()
    
    // Get all relevant search params
    const checkIn = searchParams.get('checkIn')
    const checkOut = searchParams.get('checkOut')
    const guests = searchParams.get('guests')
    const location = searchParams.get('location')
    const priceRange = searchParams.get('priceRange')
    const propertyType = searchParams.get('propertyType')
    const amenities = searchParams.get('amenities')
    const rating = searchParams.get('rating')
    
    // Add them to the new URL if they exist
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    if (guests) params.set('guests', guests)
    if (location) params.set('location', location)
    if (priceRange) params.set('priceRange', priceRange)
    if (propertyType) params.set('propertyType', propertyType)
    if (amenities) params.set('amenities', amenities)
    if (rating) params.set('rating', rating)
    
    const queryString = params.toString()
    
    // If we have search params, return to search page with them
    // Otherwise return to home
    if (queryString) {
      return `/search?${queryString}`
    }
    return '/'
  }
  
  const backUrl = buildBackUrl()
  const hasSearchParams = searchParams.toString().length > 0
  
  return (
    <Link href={backUrl}>
      <Button variant="ghost" size="sm">
        <ChevronLeft className="w-4 h-4 mr-2" />
        {hasSearchParams ? 'Back to Search' : 'Back to Feed'}
      </Button>
    </Link>
  )
}

