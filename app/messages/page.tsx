'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Search, MessageCircle, User, Hash } from 'lucide-react'
import Link from 'next/link'

export default function MessagesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredChats, setFilteredChats] = useState<any[]>([])
  const [incomingMessages, setIncomingMessages] = useState<any[]>([])
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [searchMode, setSearchMode] = useState<'users' | 'groups'>('users')

  useEffect(() => {
    if (!session?.user?.id) {
      router.push('/auth/signin')
      return
    }
    
    // TODO: Fetch actual messages and chat history from API
    // For now, using mock data
    fetchChatHistory()
  }, [session, router])

  const fetchChatHistory = async () => {
    try {
      const response = await fetch('/api/messages/chats')
      if (response.ok) {
        const data = await response.json()
        setChatHistory(data.chats || [])
        setFilteredChats(data.chats || [])
      } else {
        setChatHistory([])
        setFilteredChats([])
      }
    } catch (error) {
      console.error('Error fetching chat history:', error)
      setChatHistory([])
      setFilteredChats([])
    }
  }

  const handleChatClick = async (chatId: string, unreadCount: number) => {
    // If there are unread messages, mark them as read
    if (unreadCount > 0) {
      try {
        // TODO: Implement API call to mark messages as read
        // await fetch(`/api/messages/${chatId}/mark-read`, { method: 'POST' })
        
        // Update local state to remove unread count
        setChatHistory(chatHistory.map(chat => 
          chat.id === chatId 
            ? { ...chat, unreadCount: 0 }
            : chat
        ))
      } catch (error) {
        console.error('Error marking messages as read:', error)
      }
    }
  }

  useEffect(() => {
    // Detect search mode based on query
    if (searchQuery.startsWith('#')) {
      setSearchMode('groups')
      searchGroups(searchQuery.substring(1))
    } else if (searchQuery.length > 0) {
      setSearchMode('users')
      searchUsers(searchQuery)
    } else {
      setFilteredChats(chatHistory)
    }
  }, [searchQuery, chatHistory])

  const searchUsers = async (query: string) => {
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        // Filter to show only users from chat history (for now)
        setFilteredChats(data.users || [])
      }
    } catch (error) {
      console.error('Error searching users:', error)
      setFilteredChats([])
    }
  }

  const searchGroups = async (query: string) => {
    // TODO: Implement group search
    // const response = await fetch(`/api/groups/search?q=${encodeURIComponent(query)}`)
    console.log('Searching groups:', query)
    setFilteredChats([])
  }

  const displayChats = chatHistory

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Messaggi</h1>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.back()}
            >
              Indietro
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={searchMode === 'groups' ? 'Cerca gruppi con #nome' : 'Cerca utenti o scrivi # per gruppi'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchMode === 'groups' && (
              <Hash className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            )}
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {displayChats.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nessun Messaggio</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? `Nessun risultato per "${searchQuery}"`
                  : 'Inizia una conversazione o cerca utenti o gruppi'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {displayChats.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => handleChatClick(chat.id, chat.unreadCount || 0)}
              >
                <Link 
                  href={`/messages/${chat.userId || chat.id}`}
                  className="block"
                >
                  <Card className="hover:bg-accent transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={chat.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {chat.type === 'group' ? (
                              <Hash className="h-6 w-6" />
                            ) : (
                              <User className="h-6 w-6" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm truncate">
                              {chat.name}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {chat.lastMessageTime}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {chat.lastMessage}
                          </p>
                        </div>
                        {chat.unreadCount > 0 && (
                          <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {chat.unreadCount}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

