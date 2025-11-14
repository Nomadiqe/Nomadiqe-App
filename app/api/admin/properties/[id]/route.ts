import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PATCH - Toggle property active status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await req.json()
    const { isActive, isVerified, latitude, longitude } = body

    // Build update data object
    const updateData: any = {}

    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive
    }

    if (typeof isVerified === 'boolean') {
      updateData.isVerified = isVerified
    }

    // Allow admin to manually set coordinates
    if (typeof latitude === 'number' && typeof longitude === 'number') {
      updateData.latitude = latitude
      updateData.longitude = longitude
      updateData.geocodingAccuracy = 'exact' // Admin-set coordinates are considered exact
      updateData.geocodingFailed = false // Reset failed flag
    }

    // Update property status
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        host:users!hostId (
          id, name, fullName, email
        )
      `)
      .single()

    if (propertyError) {
      console.error('Property update error:', propertyError)
      return NextResponse.json(
        { error: 'Failed to update property' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      property: {
        id: property.id,
        title: property.title,
        isActive: property.isActive,
        isVerified: property.isVerified,
        latitude: property.latitude,
        longitude: property.longitude,
        geocodingAccuracy: property.geocodingAccuracy,
        geocodingFailed: property.geocodingFailed,
        host: property.host,
      }
    })

  } catch (error) {
    console.error('Update property error:', error)
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

// DELETE - Delete property (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Delete the property
    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('Property delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete property' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully'
    })

  } catch (error) {
    console.error('Delete property error:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}
