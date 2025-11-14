import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { startOfDay } from 'date-fns'

// POST: Block a date (set isAvailable to false)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { propertyId, date } = body

    if (!propertyId || !date) {
      return NextResponse.json(
        { error: 'Missing propertyId or date' },
        { status: 400 }
      )
    }

    // Verify user owns the property
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id, hostId')
      .eq('id', propertyId)
      .single()

    if (propertyError || !property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    if (property.hostId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only manage your own properties' },
        { status: 403 }
      )
    }

    // Check if there's an existing booking for this date
    const dateObj = new Date(date)
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('propertyId', propertyId)
      .in('status', ['PENDING', 'CONFIRMED'])
      .lte('checkIn', dateObj.toISOString())
      .gt('checkOut', dateObj.toISOString())
      .maybeSingle()

    if (existingBooking) {
      return NextResponse.json(
        { error: 'Cannot block date with active booking' },
        { status: 400 }
      )
    }

    // Create or update availability record to block the date
    const startDate = startOfDay(dateObj).toISOString()

    const { data: availability, error: availError } = await supabase
      .from('availability')
      .upsert(
        {
          propertyId,
          date: startDate,
          isAvailable: false,
        },
        {
          onConflict: 'propertyId,date'
        }
      )
      .select()
      .single()

    if (availError) {
      console.error('Availability upsert error:', availError)
      return NextResponse.json(
        { error: 'Failed to block date' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      availability,
    })
  } catch (error) {
    console.error('Error blocking date:', error)
    return NextResponse.json(
      { error: 'Failed to block date' },
      { status: 500 }
    )
  }
}

// DELETE: Unblock a date (remove availability record or set isAvailable to true)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { propertyId, date } = body

    if (!propertyId || !date) {
      return NextResponse.json(
        { error: 'Missing propertyId or date' },
        { status: 400 }
      )
    }

    // Verify user owns the property
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id, hostId')
      .eq('id', propertyId)
      .single()

    if (propertyError || !property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    if (property.hostId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only manage your own properties' },
        { status: 403 }
      )
    }

    const dateObj = new Date(date)
    const startDate = startOfDay(dateObj).toISOString()

    // Delete the availability record (unblocking the date)
    const { error: deleteError } = await supabase
      .from('availability')
      .delete()
      .eq('propertyId', propertyId)
      .eq('date', startDate)

    if (deleteError) {
      console.error('Availability delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to unblock date' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Date unblocked successfully',
    })
  } catch (error) {
    console.error('Error unblocking date:', error)
    return NextResponse.json(
      { error: 'Failed to unblock date' },
      { status: 500 }
    )
  }
}

// GET: Get availability for a property
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Missing propertyId' },
        { status: 400 }
      )
    }

    // Verify user owns the property
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id, hostId')
      .eq('id', propertyId)
      .single()

    if (propertyError || !property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    if (property.hostId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only view your own properties' },
        { status: 403 }
      )
    }

    const { data: availability, error: availError } = await supabase
      .from('availability')
      .select('*')
      .eq('propertyId', propertyId)
      .order('date', { ascending: true })

    if (availError) {
      console.error('Availability fetch error:', availError)
      return NextResponse.json(
        { error: 'Failed to fetch availability' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      availability,
    })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}
