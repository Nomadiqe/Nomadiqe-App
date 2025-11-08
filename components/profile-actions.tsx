"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import {
  UserPlus,
  MessageCircle,
  Star,
  Camera,
  Settings,
  Copy,
  Check,
  Share
} from 'lucide-react'
import Link from 'next/link'

interface ProfileActionsProps {
  isOwnProfile: boolean
  userId: string
  userName: string
}

export function ProfileActions({ isOwnProfile, userId, userName }: ProfileActionsProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCopyProfileLink = async () => {
    try {
      const profileUrl = `${window.location.origin}/profile/${userId}`
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      toast({
        title: 'Link copied!',
        description: 'Profile link has been copied to clipboard.',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link to clipboard.',
        variant: 'destructive',
      })
    }
  }

  // Check initial follow status
  useEffect(() => {
    if (isOwnProfile) return

    const checkFollowStatus = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/follow`)
        if (response.ok) {
          const data = await response.json()
          setIsFollowing(data.isFollowing)
        }
      } catch (error) {
        console.error('Error checking follow status:', error)
      }
    }

    checkFollowStatus()
  }, [userId, isOwnProfile])

  const handleFollow = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const method = isFollowing ? 'DELETE' : 'POST'
      const response = await fetch(`/api/users/${userId}/follow`, {
        method,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update follow status')
      }

      const data = await response.json()
      setIsFollowing(data.isFollowing)

      toast({
        title: data.isFollowing ? 'Stai seguendo' : 'Non segui più',
        description: data.isFollowing
          ? `Ora stai seguendo ${userName}`
          : `Non segui più ${userName}`,
      })

      // Refresh the page to update follower/following counts
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update follow status.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMessage = () => {
    toast({
      title: 'Coming Soon',
      description: 'Messaging feature will be available soon!',
    })
  }

  const handleAddPhoto = () => {
    // Redirect to create post page for photo upload
    window.location.href = '/create-post'
  }

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)

  useEffect(() => {
    if (isOwnProfile) {
      const fetchUnreadMessagesCount = async () => {
        try {
          const response = await fetch('/api/messages/chats')
          if (response.ok) {
            const data = await response.json()
            // Sum up all unread counts from all chats
            const totalUnread = data.chats?.reduce((total: number, chat: any) => {
              return total + (chat.unreadCount || 0)
            }, 0) || 0
            setUnreadMessagesCount(totalUnread)
          }
        } catch (error) {
          console.error('Error fetching unread messages count:', error)
        }
      }
      fetchUnreadMessagesCount()
    }
  }, [isOwnProfile])

  if (isOwnProfile) {
    return (
      <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-full">
        <Button 
          asChild 
          className="bg-secondary hover:bg-secondary/90 text-white rounded-md px-2.5 py-1.5 text-xs font-medium transition-all shadow-md hover:shadow-lg flex-shrink-0"
        >
          <Link href="/profile/edit" className="flex items-center gap-1">
            <Settings className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap">Modifica Profilo</span>
          </Link>
        </Button>
        <div className="relative flex-shrink-0">
          <Button 
            asChild 
            className="bg-primary hover:bg-primary/90 text-white rounded-md px-2.5 py-1.5 text-xs font-medium transition-all shadow-md hover:shadow-lg"
          >
            <Link href="/messages" className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Messaggi</span>
            </Link>
          </Button>
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-white">
              {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
            </span>
          )}
        </div>
        <Button
          onClick={handleCopyProfileLink}
          className="bg-secondary/80 hover:bg-secondary text-white rounded-md px-2.5 py-1.5 text-xs font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-1 flex-shrink-0"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span className="whitespace-nowrap">{copied ? 'Copiato!' : 'Copia Link'}</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-full">
      <Button
        onClick={handleFollow}
        disabled={isLoading}
        className="bg-muted hover:bg-muted/80 text-foreground rounded-md px-2.5 py-1.5 text-xs font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-1 flex-shrink-0"
      >
        <UserPlus className="w-3.5 h-3.5" />
        <span className="whitespace-nowrap">{isLoading ? '...' : isFollowing ? 'Smetti di seguire' : 'Segui'}</span>
      </Button>
      <Button
        onClick={handleMessage}
        className="bg-primary hover:bg-primary/90 text-white rounded-md px-2.5 py-1.5 text-xs font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-1 flex-shrink-0"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span className="whitespace-nowrap">Message</span>
      </Button>
      <Button
        onClick={handleCopyProfileLink}
        className="bg-secondary/80 hover:bg-secondary text-white rounded-md px-2.5 py-1.5 text-xs font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-1 flex-shrink-0"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Share className="w-3.5 h-3.5" />
        )}
        <span className="whitespace-nowrap">{copied ? 'Copiato!' : 'Condividi'}</span>
      </Button>
    </div>
  )
}