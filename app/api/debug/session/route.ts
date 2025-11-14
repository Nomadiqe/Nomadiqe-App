import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      return NextResponse.json({
        hasSession: false,
        session: null,
        user: null,
        error: authError.message,
        timestamp: new Date().toISOString()
      }, { status: 200 })
    }

    // Get full user data from database if authenticated
    let dbUser = null
    if (user) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      dbUser = data
    }

    return NextResponse.json({
      hasSession: !!user,
      session: { user: dbUser },
      user: dbUser,
      authUser: user,
      timestamp: new Date().toISOString()
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to get session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

