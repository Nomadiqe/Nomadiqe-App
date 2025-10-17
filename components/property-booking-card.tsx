'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

interface PropertyBookingCardProps {
  propertyId: string
  price: number
  currency: string
  maxGuests: number
  averageRating: number
  reviewsCount: number
  host: {
    id: string
    name: string | null
    image: string | null
  }
}

export function PropertyBookingCard({
  propertyId,
  price,
  currency,
  maxGuests,
  averageRating,
  reviewsCount,
  host,
}: PropertyBookingCardProps) {
  const searchParams = useSearchParams()
  
  // Read params from URL and set initial values
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)

  useEffect(() => {
    // Pre-fill form with search params if available
    const checkInParam = searchParams.get('checkIn')
    const checkOutParam = searchParams.get('checkOut')
    const guestsParam = searchParams.get('guests')

    if (checkInParam) {
      // Convert from ISO string to date input format (yyyy-MM-dd)
      try {
        const date = new Date(checkInParam)
        setCheckIn(format(date, 'yyyy-MM-dd'))
      } catch (e) {
        // If already in correct format
        setCheckIn(checkInParam)
      }
    }

    if (checkOutParam) {
      try {
        const date = new Date(checkOutParam)
        setCheckOut(format(date, 'yyyy-MM-dd'))
      } catch (e) {
        setCheckOut(checkOutParam)
      }
    }

    if (guestsParam) {
      const guestCount = parseInt(guestsParam)
      if (!isNaN(guestCount) && guestCount >= 1 && guestCount <= maxGuests) {
        setGuests(guestCount)
      }
    }
  }, [searchParams, maxGuests])

  const handleReserve = () => {
    // Handle reservation logic here
    console.log('Reservation details:', {
      propertyId,
      checkIn,
      checkOut,
      guests,
    })
  }

  return (
    <Card className="sticky top-24 shadow-lg">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold">
              {currency === "EUR" ? "€" : "$"}{price}
            </span>
            <span className="text-muted-foreground">/ night</span>
          </div>
          {reviewsCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {averageRating.toFixed(1)}
              </Badge>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{reviewsCount} reviews</span>
            </div>
          )}
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="check-in">Check-in</Label>
            <input
              id="check-in"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-4 py-2 border border-border rounded-md mt-2 bg-background"
            />
          </div>
          <div>
            <Label htmlFor="check-out">Check-out</Label>
            <input
              id="check-out"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-4 py-2 border border-border rounded-md mt-2 bg-background"
            />
          </div>
          <div>
            <Label htmlFor="guests">Guests</Label>
            <select 
              id="guests" 
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-border rounded-md mt-2 bg-background"
            >
              {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button className="w-full" size="lg" onClick={handleReserve}>
          Reserve
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          You won&apos;t be charged yet
        </p>

        <Separator className="my-6" />

        {/* Host Info */}
        <div>
          <h3 className="font-semibold mb-4">Hosted by</h3>
          <Link href={`/profile/${host.id}`}>
            <div className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Avatar className="h-12 w-12">
                <AvatarImage src={host.image || ''} alt={host.name || "Host"} />
                <AvatarFallback className="bg-gradient-to-br from-nomadiqe-primary to-nomadiqe-700 text-white p-1">
                  <Image 
                    src="/nomadiqe-logo-transparent.png" 
                    alt="Nomadiqe" 
                    width={44} 
                    height={44}
                    className="object-contain"
                  />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{host.name}</p>
                <p className="text-sm text-muted-foreground">View profile</p>
              </div>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

