import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { performDailyCheckIn } from '@/lib/services/points-service'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await performDailyCheckIn(session.user.id)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        points: result.points,
        streakCount: result.streakCount,
        bonusPoints: result.bonusPoints,
        message: result.message,
      },
    })
  } catch (error) {
    console.error('Error performing check-in:', error)
    return NextResponse.json(
      { error: 'Failed to perform check-in' },
      { status: 500 }
    )
  }
}
