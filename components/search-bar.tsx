"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, MapPin, Users, Search } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export function SearchBar() {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState(1)
  const [checkInOpen, setCheckInOpen] = useState(false)
  const [checkOutOpen, setCheckOutOpen] = useState(false)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.append('location', location)
    if (checkIn) params.append('checkIn', checkIn.toISOString())
    if (checkOut) params.append('checkOut', checkOut.toISOString())
    params.append('guests', guests.toString())
    
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Location */}
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Where are you going?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 bg-white/20 border-white/20 text-white placeholder:text-gray-300 h-12"
            />
          </div>

          {/* Check-in Date */}
          <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal h-12 bg-white/20 border-white/20 text-white hover:bg-white/30",
                  !checkIn && "text-gray-300"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkIn ? format(checkIn, "PPP") : <span>Check-in</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={(date) => {
                  setCheckIn(date)
                  // Keep popover open after selection so user can change their mind
                }}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>

          {/* Check-out Date */}
          <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal h-12 bg-white/20 border-white/20 text-white hover:bg-white/30",
                  !checkOut && "text-gray-300"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOut ? format(checkOut, "PPP") : <span>Check-out</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={(date) => {
                  setCheckOut(date)
                  // Keep popover open after selection so user can change their mind
                }}
                initialFocus
                disabled={(date) =>
                  date < new Date() || (checkIn ? date <= checkIn : false)
                }
              />
            </PopoverContent>
          </Popover>

          {/* Guests */}
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="number"
              min="1"
              max="16"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              className="pl-10 bg-white/20 border-white/20 text-white h-12 w-24"
            />
          </div>

          {/* Search Button */}
          <Button 
            onClick={handleSearch}
            className="h-12 bg-nomadiqe-600 hover:bg-nomadiqe-700 text-white px-6"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
