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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const action = searchParams.get('action') || undefined

    // Build query
    let query = supabase
      .from('point_transactions')
      .select('*')
      .eq('userId', user.id)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by action if provided
    if (action) {
      query = query.eq('action', action)
    }

    const { data: transactions, error: transactionsError, count } = await query

    if (transactionsError) {
      console.error('Points history error:', transactionsError)
      return NextResponse.json(
        { error: 'Failed to fetch points history' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        transactions: transactions || [],
        total: count || 0,
        limit,
        offset,
      },
    })
  } catch (error) {
    console.error('Error fetching points history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch points history' },
      { status: 500 }
    )
  }
}
