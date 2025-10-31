import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { HostCalendarView } from '@/components/host/calendar-view'

export default async function HostCalendarPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      properties: {
        where: { isActive: true },
        include: {
          bookings: {
            where: {
              status: {
                in: ['PENDING', 'CONFIRMED']
              }
            },
            select: {
              id: true,
              checkIn: true,
              checkOut: true,
              guests: true,
              totalPrice: true,
              status: true,
              traveler: {
                select: {
                  id: true,
                  name: true,
                  fullName: true,
                }
              }
            }
          },
          availability: {
            where: {
              date: {
                gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                lte: new Date(new Date().setMonth(new Date().getMonth() + 6)),
              }
            },
            select: {
              id: true,
              date: true,
              isAvailable: true,
            }
          }
        }
      }
    }
  })

  if (!user) {
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

  // Serialize dates to ISO strings for client component
  const serializedProperties = user.properties.map((property: any) => ({
    ...property,
    bookings: property.bookings.map((booking: any) => ({
      ...booking,
      checkIn: booking.checkIn.toISOString(),
      checkOut: booking.checkOut.toISOString(),
    })),
    availability: property.availability.map((avail: any) => ({
      ...avail,
      date: avail.date.toISOString(),
    })),
  }))

  return <HostCalendarView properties={serializedProperties} />
}
