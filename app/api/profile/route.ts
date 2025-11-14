import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const profileUpdateSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  username: z.string().regex(/^[a-zA-Z0-9_]+$/).min(3).max(30).optional(),
  bio: z.string().max(500).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  profilePicture: z.string().url().optional(),
  coverPhoto: z.string().url().optional(),
})

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await req.json()
    const data = profileUpdateSchema.parse(body)

    // Check if username is already taken
    if (data.username) {
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('username', data.username)
        .single()
      
      if (existing && existing.id !== user.id) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 })
      }
    }

    // Update user profile
    const { data: updated, error } = await supabase
      .from('users')
      .update({
        fullName: data.fullName,
        username: data.username,
        bio: data.bio ?? undefined,
        location: data.location ?? undefined,
        phone: data.phone ?? undefined,
        profilePictureUrl: data.profilePicture,
        coverPhotoUrl: data.coverPhoto,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ success: true, userId: updated.id })
  } catch (err: any) {
    console.error('Profile update error:', err)
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues?.[0]?.message || 'Invalid input' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


