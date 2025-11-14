import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - List all properties (admin only)
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify user is an admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || userData.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get filter parameters
    const { searchParams } = new URL(req.url)
    const statusFilter = searchParams.get('status') // 'active', 'inactive', 'all'

    // Build query
    let query = supabase
      .from('properties')
      .select(`
        *,
        host:users!hostId (id, name, fullName, email)
      `)

    // Apply filter
    if (statusFilter === 'active') {
      query = query.eq('isActive', true)
    } else if (statusFilter === 'inactive') {
      query = query.eq('isActive', false)
    }

    const { data: properties, error: propertiesError } = await query.order('createdAt', { ascending: false })

    if (propertiesError) {
      console.error('Fetch properties error:', propertiesError)
      return NextResponse.json(
        { error: 'Failed to fetch properties' },
        { status: 500 }
      )
    }

    // Get counts for each property
    const propertiesWithCounts = await Promise.all(
      (properties || []).map(async (p: any) => {
        const { count: bookingsCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('propertyId', p.id)

        const { count: reviewsCount } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .eq('propertyId', p.id)

        return {
          id: p.id,
          title: p.title,
          city: p.city,
          country: p.country,
          price: p.price,
          currency: p.currency,
          maxGuests: p.maxGuests,
          bedrooms: p.bedrooms,
          images: p.images,
          isActive: p.isActive,
          isVerified: p.isVerified,
          latitude: p.latitude,
          longitude: p.longitude,
          geocodingAccuracy: p.geocodingAccuracy,
          geocodingFailed: p.geocodingFailed,
          createdAt: p.createdAt,
          host: p.host,
          bookingsCount: bookingsCount || 0,
          reviewsCount: reviewsCount || 0,
        }
      })
    )

    return NextResponse.json({
      success: true,
      properties: propertiesWithCounts
    })

  } catch (error) {
    console.error('Fetch properties error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}
