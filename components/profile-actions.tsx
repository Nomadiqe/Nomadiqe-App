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
        title: data.isFollowing ? 'Following' : 'Unfollowed',
        description: data.isFollowing
          ? `You are now following ${userName}`
          : `You unfollowed ${userName}`,
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
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <Button 
          asChild 
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-md px-3 py-1.5 text-xs font-medium transition-all shadow-md hover:shadow-lg"
        >
          <Link href="/profile/edit" className="flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </Link>
        </Button>
        <div className="relative">
          <Button 
            asChild 
            className="bg-pink-500 hover:bg-pink-600 text-white rounded-md px-3 py-1.5 text-xs font-medium transition-all shadow-md hover:shadow-lg"
          >
            <Link href="/messages" className="flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Messages</span>
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
          className="bg-blue-700 hover:bg-blue-800 text-white rounded-md px-3 py-1.5 text-xs font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-1.5"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      <Button
        onClick={handleFollow}
        disabled={isLoading}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md px-3 py-1.5 text-xs font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
      >
        <UserPlus className="w-3.5 h-3.5" />
        <span>{isLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}</span>
      </Button>
      <Button
        onClick={handleMessage}
        className="bg-pink-500 hover:bg-pink-600 text-white rounded-md px-3 py-1.5 text-xs font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-1.5"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>Message</span>
      </Button>
      <Button
        onClick={handleCopyProfileLink}
        className="bg-blue-700 hover:bg-blue-800 text-white rounded-md px-3 py-1.5 text-xs font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-1.5"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5" />
        ) : (
          <Share className="w-3.5 h-3.5" />
        )}
        <span>{copied ? 'Copied!' : 'Share'}</span>
      </Button>
    </div>
  )
}