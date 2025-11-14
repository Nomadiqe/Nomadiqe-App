import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user points balance
    const { data: userPoints, error: pointsError } = await supabase
      .from('user_points')
      .select('totalPoints, currentPoints, lifetimeEarned, lifetimeRedeemed')
      .eq('userId', user.id)
      .maybeSingle()

    if (pointsError) {
      console.error('Points stats error:', pointsError)
      return NextResponse.json(
        { error: 'Failed to fetch points stats' },
        { status: 500 }
      )
    }

    // TODO: Implement streak tracking in a separate table or columns
    // For now, return default streak values
    const currentStreak = 0
    const longestStreak = 0
    const lastCheckIn = null
    const checkedInToday = false

    return NextResponse.json({
      success: true,
      data: {
        balance: {
          totalPoints: userPoints?.totalPoints || 0,
          currentPoints: userPoints?.currentPoints || 0,
          lifetimeEarned: userPoints?.lifetimeEarned || 0,
          lifetimeRedeemed: userPoints?.lifetimeRedeemed || 0,
        },
        streak: {
          currentStreak,
          longestStreak,
          lastCheckIn,
          checkedInToday,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching points stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch points stats' },
      { status: 500 }
    )
  }
}
