import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all influencers with their social connections
    const { data: influencers, error: influencersError } = await supabase
      .from('users')
      .select(`
        id,
        name,
        fullName,
        username,
        image,
        profilePictureUrl,
        bio,
        location,
        influencer_profiles (
          id,
          contentNiches,
          verificationStatus,
          portfolioUrl
        ),
        social_connections (
          platform,
          username,
          followerCount,
          isPrimary
        )
      `)
      .eq('role', 'INFLUENCER')
      .not('influencer_profiles', 'is', null)
      .order('createdAt', { ascending: false })

    if (influencersError) {
      console.error('Error fetching influencers:', influencersError)
      return NextResponse.json({ error: 'Failed to fetch influencers' }, { status: 500 })
    }

    // Format influencers with total follower count
    const formattedInfluencers = (influencers || []).map((influencer: any) => {
      const totalFollowers = (influencer.social_connections || []).reduce(
        (acc: number, conn: any) => acc + (conn.followerCount || 0),
        0
      )

      const primarySocial = (influencer.social_connections || []).find((conn: any) => conn.isPrimary) ||
        influencer.social_connections?.[0]

      return {
        id: influencer.id,
        name: influencer.fullName || influencer.name || influencer.username || 'Influencer',
        username: influencer.username,
        image: influencer.profilePictureUrl || influencer.image,
        bio: influencer.bio,
        location: influencer.location,
        contentNiches: influencer.influencer_profiles?.contentNiches || [],
        verificationStatus: influencer.influencer_profiles?.verificationStatus,
        portfolioUrl: influencer.influencer_profiles?.portfolioUrl,
        totalFollowers,
        primaryPlatform: primarySocial?.platform,
        primaryUsername: primarySocial?.username,
        socialConnections: influencer.social_connections || [],
      }
    })

    return NextResponse.json({ influencers: formattedInfluencers })
  } catch (error) {
    console.error('Error fetching influencers:', error)
    return NextResponse.json({ error: 'Failed to fetch influencers' }, { status: 500 })
  }
}
