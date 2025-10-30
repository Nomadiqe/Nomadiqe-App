'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin, Calendar, Users, ChevronDown } from 'lucide-react'
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
  const [openPopover, setOpenPopover] = useState<'checkIn' | 'checkOut' | 'guests' | null>(null)

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

  // Show next step based on completed fields
  const canShowCheckIn = location.trim() !== ''
  const canShowCheckOut = canShowCheckIn && checkIn !== undefined
  const canShowGuests = canShowCheckOut && checkOut !== undefined

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card border border-border rounded-2xl shadow-lg p-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Location - Always visible */}
          <div className="flex-1 min-w-[200px] relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Where are you going?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 h-12 border-0 bg-muted/30 focus-visible:ring-1"
            />
          </div>

          {/* Divider - appears after location */}
          {canShowCheckIn && (
            <>
              <div className="h-8 w-px bg-border hidden sm:block" />
              
              {/* Check-in */}
              <Popover open={openPopover === 'checkIn'} onOpenChange={(open) => setOpenPopover(open ? 'checkIn' : null)}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="justify-start text-left font-normal h-12 px-3 bg-muted/30 hover:bg-muted/50 border-0 min-w-[140px]"
                  >
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className={checkIn ? 'text-foreground' : 'text-muted-foreground'}>
                      {checkIn ? format(checkIn, 'MMM dd') : 'Check-in'}
                    </span>
                    <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={checkIn}
                    onSelect={(date) => {
                      setCheckIn(date)
                      setOpenPopover('checkOut')
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </>
          )}

          {/* Divider - appears after check-in */}
          {canShowCheckOut && (
            <>
              <div className="h-8 w-px bg-border hidden sm:block" />
              
              {/* Check-out */}
              <Popover open={openPopover === 'checkOut'} onOpenChange={(open) => setOpenPopover(open ? 'checkOut' : null)}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="justify-start text-left font-normal h-12 px-3 bg-muted/30 hover:bg-muted/50 border-0 min-w-[140px]"
                  >
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className={checkOut ? 'text-foreground' : 'text-muted-foreground'}>
                      {checkOut ? format(checkOut, 'MMM dd') : 'Check-out'}
                    </span>
                    <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={checkOut}
                    onSelect={(date) => {
                      setCheckOut(date)
                      setOpenPopover('guests')
                    }}
                    initialFocus
                    disabled={(date) => checkIn ? date < checkIn : false}
                  />
                </PopoverContent>
              </Popover>
            </>
          )}

          {/* Divider - appears after check-out */}
          {canShowGuests && (
            <>
              <div className="h-8 w-px bg-border hidden sm:block" />
              
              {/* Guests */}
              <Popover open={openPopover === 'guests'} onOpenChange={(open) => setOpenPopover(open ? 'guests' : null)}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="justify-start text-left font-normal h-12 px-3 bg-muted/30 hover:bg-muted/50 border-0"
                  >
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {guests} {guests === 1 ? 'guest' : 'guests'}
                    </span>
                    <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="start">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Guests</label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        disabled={guests <= 1}
                        className="h-8 w-8"
                      >
                        -
                      </Button>
                      <span className="w-8 text-center font-medium">{guests}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setGuests(Math.min(16, guests + 1))}
                        disabled={guests >= 16}
                        className="h-8 w-8"
                      >
                        +
                      </Button>
                    </div>
                    <Button 
                      onClick={() => setOpenPopover(null)} 
                      className="w-full bg-nomadiqe-600 hover:bg-nomadiqe-700"
                    >
                      Done
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}

          {/* Search Button */}
          <Button 
            onClick={handleSearch} 
            className="h-12 px-6 bg-nomadiqe-600 hover:bg-nomadiqe-700 flex-shrink-0"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
