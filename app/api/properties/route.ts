import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Disable caching to always fetch latest properties
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all active properties
    const { data: properties, error } = await supabase
      .from('properties')
      .select('id, title, city, country')
      .eq('isActive', true)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
    }

    // Format the response
    const formattedProperties = properties?.map((property) => ({
      id: property.id,
      title: property.title,
      location: `${property.city}, ${property.country}`,
    })) || []

    return NextResponse.json(formattedProperties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}
