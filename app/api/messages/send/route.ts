import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { recipientId, content, postId } = await request.json()
    if (!recipientId || typeof recipientId !== 'string') {
      return NextResponse.json({ error: 'recipientId required' }, { status: 400 })
    }

    const currentUserId = user.id
    const userAId = currentUserId < recipientId ? currentUserId : recipientId
    const userBId = currentUserId < recipientId ? recipientId : currentUserId

    // Check if conversation exists
    let { data: conversation } = await supabase
      .from('conversations')
      .select('*')
      .eq('userAId', userAId)
      .eq('userBId', userBId)
      .single()

    // Create conversation if it doesn't exist
    if (!conversation) {
      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert({ userAId, userBId })
        .select()
        .single()
      
      if (convError) {
        console.error('Conversation creation error:', convError)
        return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
      }
      conversation = newConversation
    }

    // Create message
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .insert({
        conversationId: conversation.id,
        senderId: currentUserId,
        content: content || null,
        postId: postId || null,
      })
      .select()
      .single()

    if (msgError) {
      console.error('Message creation error:', msgError)
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }

    return NextResponse.json({ conversationId: conversation.id, message })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
