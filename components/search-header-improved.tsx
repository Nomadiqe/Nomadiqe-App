'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin, Calendar, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format } from 'date-fns'

export function SearchHeaderImproved() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState(parseInt(searchParams.get('guests') || '1'))

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (location) {
      params.set('location', location)
    } else {
      params.delete('location')
    }

    if (checkIn) {
      params.set('checkIn', format(checkIn, 'yyyy-MM-dd'))
    } else {
      params.delete('checkIn')
    }

    if (checkOut) {
      params.set('checkOut', format(checkOut, 'yyyy-MM-dd'))
    } else {
      params.delete('checkOut')
    }

    if (guests > 1) {
      params.set('guests', guests.toString())
    } else {
      params.delete('guests')
    }

    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card border border-border rounded-2xl shadow-lg p-2">
        <div className="flex flex-col md:flex-row gap-2">
          {/* Location */}
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Where are you going?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 h-12 border-0 bg-muted/30 focus-visible:ring-1"
            />
          </div>

          {/* Check-in */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="justify-start text-left font-normal h-12 px-3 bg-muted/30 hover:bg-muted/50 border-0 min-w-[140px]"
              >
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className={checkIn ? 'text-foreground' : 'text-muted-foreground'}>
                  {checkIn ? format(checkIn, 'MMM dd') : 'Check-in'}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Check-out */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="justify-start text-left font-normal h-12 px-3 bg-muted/30 hover:bg-muted/50 border-0 min-w-[140px]"
              >
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className={checkOut ? 'text-foreground' : 'text-muted-foreground'}>
                  {checkOut ? format(checkOut, 'MMM dd') : 'Check-out'}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                initialFocus
                disabled={(date) => checkIn ? date < checkIn : false}
              />
            </PopoverContent>
          </Popover>

          {/* Guests */}
          <div className="flex items-center gap-2 bg-muted/30 rounded-md px-3 h-12 min-w-[120px]">
            <Users className="w-4 h-4 text-muted-foreground" />
            <Input
              type="number"
              min="1"
              max="16"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              className="border-0 bg-transparent h-auto p-0 focus-visible:ring-0 w-12"
            />
            <span className="text-sm text-muted-foreground">guests</span>
          </div>

          {/* Search Button */}
          <Button onClick={handleSearch} className="h-12 px-6 bg-nomadiqe-600 hover:bg-nomadiqe-700">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
