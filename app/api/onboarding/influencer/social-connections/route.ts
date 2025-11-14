import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    // Verify user is an influencer
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*, influencer_profiles(*)')
      .eq('id', user.id)
      .single()

    if (userError || !userData || userData.role !== 'INFLUENCER' || !userData.influencer_profiles) {
      return NextResponse.json(
        { error: 'This endpoint is only for influencers' },
        { status: 403 }
      )
    }

    // Fetch all social connections for the user
    const { data: connections, error: connectionsError } = await supabase
      .from('social_connections')
      .select('id, platform, username, followerCount, isPrimary, createdAt')
      .eq('userId', user.id)
      .order('createdAt', { ascending: false })

    if (connectionsError) {
      console.error('Failed to fetch social connections:', connectionsError)
      return NextResponse.json(
        { error: 'Failed to fetch social connections' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      connections: connections || [],
      count: connections?.length || 0
    })

  } catch (error) {
    console.error('Fetch social connections error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social connections' },
      { status: 500 }
    )
  }
}
