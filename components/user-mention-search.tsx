'use client'

import { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { User } from 'lucide-react'

interface UserMentionSearchProps {
  onSelectUser: (user: any) => void
  onClose: () => void
}

export function UserMentionSearch({ onSelectUser, onClose }: UserMentionSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length < 1) {
        setUsers([])
        return
      }

      // Rimuovi il simbolo @ se presente
      const cleanQuery = searchQuery.replace(/@/g, '')
      
      if (cleanQuery.length < 1) {
        setUsers([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(cleanQuery)}`)
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users || [])
        }
      } catch (error) {
        console.error('Error searching users:', error)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchUsers, 200)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const handleSelectUser = (user: any) => {
    onSelectUser(user)
    onClose()
  }

  return (
    <div ref={containerRef} className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-3 w-80 z-50">
      <div className="mb-3">
        <Input
          placeholder="Cerca per username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
          autoFocus
        />
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {loading && searchQuery && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Caricamento...
          </div>
        )}
        
        {!loading && searchQuery.length >= 1 && users.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Nessun utente trovato
          </div>
        )}
        
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => handleSelectUser(user)}
            className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.image || user.profilePictureUrl} />
              <AvatarFallback className="bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              {user.username && (
                <p className="text-sm font-medium truncate">
                  @{user.username}
                </p>
              )}
              {(user.fullName || user.name) && (
                <p className="text-xs text-muted-foreground truncate">
                  {user.fullName || user.name}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

