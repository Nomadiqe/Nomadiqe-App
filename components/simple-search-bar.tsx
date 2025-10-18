"use client"

import { useState, useRef, useEffect } from 'react'
import { Search, Bot, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface User {
  id: string
  name: string
  fullName: string
  username: string
  image: string
  profilePictureUrl: string
  bio: string
  location: string
  role: string
  isVerified: boolean
  _count: {
    followers: number
    posts: number
    properties: number
  }
}

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export function SimpleSearchBar() {
  console.log('SimpleSearchBar component is rendering!')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAIMode, setIsAIMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isAILoading, setIsAILoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.users || [])
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleAISubmit = async (message: string) => {
    if (!message.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setSearchQuery('')
    setIsAILoading(true)

    try {
      const response = await fetch('/api/chat/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })

      if (response.ok) {
        const data = await response.json()
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: data.response,
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, aiMessage])
      }
    } catch (error) {
      console.error('AI chat error:', error)
    } finally {
      setIsAILoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    
    if (!isAIMode) {
      // Debounce search for user search
      const timeoutId = setTimeout(() => {
        handleSearch(value)
      }, 300)
      return () => clearTimeout(timeoutId)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isAIMode) {
        handleAISubmit(searchQuery)
      }
    } else if (e.key === 'Escape') {
      setIsExpanded(false)
      setSearchQuery('')
      setSearchResults([])
      setChatMessages([])
    }
  }

  const toggleAIMode = () => {
    setIsAIMode(!isAIMode)
    setSearchQuery('')
    setSearchResults([])
    setChatMessages([])
  }

  const closeSearch = () => {
    setIsExpanded(false)
    setIsAIMode(false)
    setSearchQuery('')
    setSearchResults([])
    setChatMessages([])
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[9999] md:left-auto md:w-80 md:right-4">
      {!isExpanded ? (
        // Collapsed state - search button (mobile: full width, desktop: fixed width)
        <div className="w-full md:w-auto">
          <Button
            onClick={() => {
              console.log('Search button clicked!')
              setIsExpanded(true)
            }}
            className="w-full h-12 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 bg-blue-500 hover:bg-blue-600 text-white border-2 border-white md:w-12"
            size="icon"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        // Expanded state - search bar (mobile: full width, desktop: fixed width)
        <Card className="w-full shadow-2xl border-2 md:w-80">
          <CardContent className="p-3">
            <div className="space-y-3">
              {/* Search Input - Mobile Layout */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    placeholder={isAIMode ? "Ask AI anything..." : "Search users..."}
                    className="pl-10 pr-4 h-10 w-full"
                  />
                </div>
                <Button
                  onClick={toggleAIMode}
                  variant={isAIMode ? "default" : "outline"}
                  size="sm"
                  className="h-10 px-3 flex-shrink-0"
                >
                  {isAIMode ? <Bot className="h-4 w-4" /> : "AI"}
                </Button>
                <Button
                  onClick={closeSearch}
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Results Area */}
              <div className="max-h-64 overflow-y-auto">
                {isAIMode ? (
                  // AI Chat Mode
                  <div className="space-y-3">
                    {chatMessages.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground">
                        <Bot className="h-6 w-6 mx-auto mb-2" />
                        <p className="text-sm">Start a conversation with AI</p>
                      </div>
                    )}
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {isAILoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4" />
                            <span>AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  // User Search Mode
                  <div className="space-y-2">
                    {isSearching && (
                      <div className="text-center py-4 text-muted-foreground">
                        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                        <p className="text-sm">Searching...</p>
                      </div>
                    )}
                    {!isSearching && searchResults.length === 0 && searchQuery && (
                      <div className="text-center py-4 text-muted-foreground">
                        <p className="text-sm">No users found</p>
                      </div>
                    )}
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => {
                          window.location.href = `/profile/${user.id}`
                        }}
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-primary">
                            {(user.fullName || user.name || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="font-medium text-sm truncate">
                              {user.fullName || user.name}
                            </p>
                            {user.isVerified && (
                              <div className="w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-[8px] text-primary-foreground">✓</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            @{user.username || user.name?.toLowerCase()}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-muted-foreground">
                            {user._count.followers} followers
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
