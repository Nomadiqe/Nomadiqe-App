import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const otherUserId = params.id
    const currentUserId = user.id

    const userAId = currentUserId < otherUserId ? currentUserId : otherUserId
    const userBId = currentUserId < otherUserId ? otherUserId : currentUserId

    // Upsert conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .upsert(
        { userAId, userBId },
        { onConflict: 'userAId,userBId' }
      )
      .select()
      .single()

    if (convError) {
      console.error('Error upserting conversation:', convError)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    // Fetch messages
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversationId', conversation.id)
      .order('createdAt', { ascending: true })

    if (messagesError) {
      console.error('Error fetching messages:', messagesError)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    // Mark others' messages as read
    await supabase
      .from('messages')
      .update({ isRead: true })
      .eq('conversationId', conversation.id)
      .neq('senderId', currentUserId)
      .eq('isRead', false)

    return NextResponse.json({ conversationId: conversation.id, messages: messages || [] })
  } catch (error) {
    console.error('Fetch messages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
