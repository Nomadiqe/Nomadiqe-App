import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { HostCalendarView } from '@/components/host/calendar-view'

export default async function HostCalendarPage() {
  const supabase = await createClient()

  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

  if (authError || !authUser) {
    redirect('/auth/signin')
  }

  // Get user with role check
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, role')
    .eq('id', authUser.id)
    .single()

  if (userError || !user) {
    redirect('/auth/signin')
  }

  if (user.role !== 'HOST') {
    // Redirect based on actual role
    if (user.role === 'GUEST' || user.role === 'TRAVELER') {
      redirect('/dashboard/guest')
    } else if (user.role === 'INFLUENCER') {
      redirect('/dashboard/influencer')
    } else {
      redirect('/dashboard')
    }
  }

  // Calculate date range for availability
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  const sixMonthsFromNow = new Date()
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)

  // Get properties with bookings and availability
  const { data: properties, error: propertiesError } = await supabase
    .from('properties')
    .select(`
      *,
      bookings:bookings(
        id, checkIn, checkOut, guests, totalPrice, status,
        traveler:users!travelerId(
          id, name, fullName
        )
      ),
      availability:availability(
        id, date, isAvailable
      )
    `)
    .eq('hostId', user.id)
    .eq('isActive', true)
    .in('bookings.status', ['PENDING', 'CONFIRMED'])
    .gte('availability.date', oneMonthAgo.toISOString())
    .lte('availability.date', sixMonthsFromNow.toISOString())

  if (propertiesError) {
    console.error('Error fetching properties:', propertiesError)
  }

  // Serialize dates to ISO strings for client component (dates are already ISO strings from Supabase)
  const serializedProperties = (properties || []).map((property: any) => ({
    ...property,
    bookings: (property.bookings || []).map((booking: any) => ({
      ...booking,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    })),
    availability: (property.availability || []).map((avail: any) => ({
      ...avail,
      date: avail.date,
    })),
  }))

  return <HostCalendarView properties={serializedProperties} />
}
