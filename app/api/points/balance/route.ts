import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPointsBalance } from '@/lib/services/points-service'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const balance = await getPointsBalance(session.user.id)

    return NextResponse.json({
      success: true,
      data: balance,
    })
  } catch (error) {
    console.error('Error fetching points balance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch points balance' },
      { status: 500 }
    )
  }
}
