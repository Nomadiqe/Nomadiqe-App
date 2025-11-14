import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 1) {
      return NextResponse.json({ users: [] })
    }

    // Search for users by username (case-insensitive)
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, fullName, username, image, profilePictureUrl')
      .ilike('username', `%${query}%`)
      .order('username', { ascending: true })
      .limit(20)

    if (error) {
      throw error
    }

    return NextResponse.json({ users: users || [] })
  } catch (error) {
    console.error('Error searching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

