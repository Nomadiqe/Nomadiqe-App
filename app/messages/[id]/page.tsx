'use client'

import { useState, useEffect, useRef } from 'react'
import { useSupabase } from '@/components/providers/supabase-auth-provider'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Send } from 'lucide-react'

export default function ChatPage() {
  const { user } = useSupabase()
  const router = useRouter()
  const params = useParams()
  const chatId = params?.id as string
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [otherUser, setOtherUser] = useState<any>(null)

  useEffect(() => {
    if (!user?.id) {
      router.push('/auth/signin')
      return
    }

    // Fetch user and messages from API
    fetchMessages()
    fetchOtherUser()
  }, [user, router, chatId])

  const fetchOtherUser = async () => {
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(chatId)}`)
      if (response.ok) {
        const data = await response.json()
        const u = (data.users || []).find((x: any) => x.id === chatId) || null
        setOtherUser(u)
      } else {
        setOtherUser(null)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setOtherUser(null)
    }
  }

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/messages/with/${chatId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      } else {
        setMessages([])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !user?.id) return

    const tempMessage = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: user.id,
      createdAt: new Date().toISOString()
    }

    // Optimistic update
    setMessages([...messages, tempMessage])
    setNewMessage('')

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: chatId, content: tempMessage.content }),
      })
      if (!response.ok) throw new Error('Failed to send message')
      scrollToBottom()
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove optimistic message on error
      setMessages(messages.filter(m => m.id !== tempMessage.id))
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours === 1) return '1 hour ago'
    if (diffHours < 24) return `${diffHours} hours ago`
    return date.toLocaleDateString()
  }

  const isOwnMessage = (senderId: string) => {
    return senderId === user?.id
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherUser?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {otherUser?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-semibold">{otherUser?.name || 'User'}</h2>
              {otherUser?.username && (
                <p className="text-xs text-muted-foreground">@{otherUser.username}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = isOwnMessage(message.senderId)
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isOwn
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border p-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || loading}
            size="icon"
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

