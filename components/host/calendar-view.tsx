'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Unlock,
  Home,
  CheckCircle,
  Clock
} from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, addMonths, subMonths } from 'date-fns'
import { it } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface Booking {
  id: string
  checkIn: Date | string
  checkOut: Date | string
  guests: number
  totalPrice: number
  status: string
  traveler: {
    id: string
    name: string
    fullName: string | null
  }
}

interface Availability {
  id: string
  date: Date | string
  isAvailable: boolean
}

interface Property {
  id: string
  title: string
  city: string
  country: string
  bookings: Booking[]
  availability: Availability[]
  [key: string]: any // Allow additional properties
}

interface HostCalendarViewProps {
  properties: Property[]
}

export function HostCalendarView({ properties }: HostCalendarViewProps) {
  const router = useRouter()
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [selectedProperty, setSelectedProperty] = useState<string | null>(
    properties.length > 0 ? properties[0].id : null
  )

  const currentProperty = properties.find(p => p.id === selectedProperty)

  const monthDays = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(selectedMonth),
      end: endOfMonth(selectedMonth)
    })
  }, [selectedMonth])

  const getDateStatus = (date: Date) => {
    if (!currentProperty) return { type: 'default', label: 'N/A' }

    const dateStr = format(date, 'yyyy-MM-dd')
    const availability = currentProperty.availability.find(a => 
      isSameDay(new Date(a.date), date)
    )

    // Check if date has a booking
    const hasBooking = currentProperty.bookings.some(booking => {
      const checkIn = new Date(booking.checkIn)
      const checkOut = new Date(booking.checkOut)
      return date >= checkIn && date < checkOut
    })

    if (hasBooking) {
      return { type: 'booked', label: 'Prenotato' }
    }

    if (availability) {
      if (availability.isAvailable) {
        return { type: 'available', label: 'Disponibile' }
      } else {
        return { type: 'blocked', label: 'Bloccato' }
      }
    }

    // Default: available if no availability record exists
    return { type: 'available', label: 'Disponibile' }
  }

  const toggleDateAvailability = async (date: Date) => {
    if (!currentProperty) return

    const status = getDateStatus(date)
    
    // Don't allow toggling booked dates
    if (status.type === 'booked') {
      alert('Non puoi bloccare o sbloccare date con prenotazioni attive')
      return
    }

    const isBlocked = status.type === 'blocked'

    try {
      const response = await fetch('/api/host/availability', {
        method: isBlocked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: currentProperty.id,
          date: format(date, 'yyyy-MM-dd'),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update availability')
      }

      // Refresh the page to update the calendar
      router.refresh()
    } catch (error) {
      console.error('Error updating availability:', error)
      alert('Errore durante l\'aggiornamento della disponibilità')
    }
  }

  const previousMonth = () => {
    setSelectedMonth(subMonths(selectedMonth, 1))
  }

  const nextMonth = () => {
    setSelectedMonth(addMonths(selectedMonth, 1))
  }

  if (properties.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Home className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nessuna proprietà</h3>
            <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
              Devi avere almeno una proprietà per gestire il calendario.
            </p>
            <Button asChild>
              <a href="/host/create-property">Crea una proprietà</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Calendario Proprietà</h1>
          <p className="text-muted-foreground">
            Gestisci la disponibilità delle tue proprietà e visualizza le prenotazioni
          </p>
        </div>

        {/* Property Selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Seleziona Proprietà</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((property) => (
                <Button
                  key={property.id}
                  variant={selectedProperty === property.id ? 'default' : 'outline'}
                  className="h-auto p-4 flex flex-col items-start justify-start"
                  onClick={() => setSelectedProperty(property.id)}
                >
                  <div className="font-semibold mb-1">{property.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {property.city}, {property.country}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {property.bookings.length} prenotazioni attive
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {currentProperty && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Calendario - {currentProperty.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={previousMonth}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-semibold min-w-[180px] text-center">
                      {format(selectedMonth, 'MMMM yyyy', { locale: it })}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextMonth}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map((date) => {
                    const status = getDateStatus(date)
                    const isToday = isSameDay(date, new Date())
                    const isPast = isBefore(date, new Date()) && !isToday

                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => !isPast && toggleDateAvailability(date)}
                        disabled={isPast || status.type === 'booked'}
                        className={cn(
                          'h-12 rounded-md text-sm font-medium transition-colors relative',
                          'hover:bg-accent hover:text-accent-foreground',
                          isPast && 'opacity-50 cursor-not-allowed',
                          status.type === 'booked' && 'cursor-not-allowed',
                          status.type === 'available' && 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800',
                          status.type === 'blocked' && 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800',
                          status.type === 'booked' && 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800',
                          isToday && 'ring-2 ring-primary'
                        )}
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          <span className={cn(
                            isToday && 'font-bold'
                          )}>
                            {format(date, 'd')}
                          </span>
                          {status.type === 'booked' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
                          )}
                          {status.type === 'blocked' && (
                            <Lock className="h-3 w-3 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded" />
                    <span>Disponibile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded" />
                    <span>Bloccato</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded" />
                    <span>Prenotato</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary rounded" />
                    <span>Oggi</span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-muted-foreground">
                  <p>💡 Clicca su una data disponibile per bloccarla, o su una data bloccata per sbloccarla.</p>
                  <p>Le date con prenotazioni attive non possono essere modificate.</p>
                </div>
              </CardContent>
            </Card>

            {/* Bookings List */}
            <Card>
              <CardHeader>
                <CardTitle>Prenotazioni Attive</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentProperty.bookings.length > 0 ? (
                  currentProperty.bookings.map((booking) => {
                    const checkIn = new Date(booking.checkIn)
                    const checkOut = new Date(booking.checkOut)
                    const travelerName = booking.traveler.fullName || booking.traveler.name || 'Ospite'

                    return (
                      <div
                        key={booking.id}
                        className="p-4 border rounded-lg space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">{travelerName}</div>
                          <Badge
                            variant={
                              booking.status === 'CONFIRMED'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {booking.status === 'CONFIRMED' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {booking.status === 'CONFIRMED' ? 'Confermata' : 'In attesa'}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div>Check-in: {format(checkIn, 'dd/MM/yyyy')}</div>
                          <div>Check-out: {format(checkOut, 'dd/MM/yyyy')}</div>
                          <div>{booking.guests} ospiti</div>
                          <div className="font-semibold text-foreground mt-1">
                            €{booking.totalPrice.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nessuna prenotazione attiva</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
