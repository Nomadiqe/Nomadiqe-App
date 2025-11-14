import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id

    // Fetch conversations with related data
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        *,
        userA:users!userAId (id, name, fullName, username, image, profilePictureUrl),
        userB:users!userBId (id, name, fullName, username, image, profilePictureUrl),
        messages (content, postId, createdAt)
      `)
      .or(`userAId.eq.${userId},userBId.eq.${userId}`)
      .order('updatedAt', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 })
    }

    // Process conversations
    const chats = await Promise.all((conversations || []).map(async (c: any) => {
      const other = c.userAId === userId ? c.userB : c.userA
      
      // Get unread count
      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversationId', c.id)
        .neq('senderId', userId)
        .eq('isRead', false)
      
      // Get latest message
      const { data: latestMessages } = await supabase
        .from('messages')
        .select('content, postId, createdAt')
        .eq('conversationId', c.id)
        .order('createdAt', { ascending: false })
        .limit(1)
      
      const last = latestMessages?.[0]
      
      return {
        id: c.id,
        userId: other.id,
        name: other.fullName || other.name || other.username || 'User',
        avatar: other.profilePictureUrl || other.image || undefined,
        lastMessage: last?.content || (last?.postId ? 'Shared a post' : ''),
        lastMessageTime: last?.createdAt ?? c.updatedAt,
        unreadCount: unreadCount || 0,
        type: 'user',
      }
    }))

    return NextResponse.json({ chats })
  } catch (error) {
    console.error('Chats error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
