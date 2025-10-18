"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
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
  const [copied, setCopied] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

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

  const handleFollow = async () => {
    try {
      setIsFollowing(!isFollowing)
      toast({
        title: isFollowing ? 'Unfollowed' : 'Following',
        description: isFollowing
          ? `You unfollowed ${userName}`
          : `You are now following ${userName}`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update follow status.',
        variant: 'destructive',
      })
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

  if (isOwnProfile) {
    return (
      <div className="flex items-center space-x-3">
        <Button asChild variant="outline">
          <Link href="/profile/edit" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Edit Profile</span>
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyProfileLink}
          className="flex items-center space-x-2"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <Button
        variant="outline"
        className="flex items-center space-x-2"
        onClick={handleFollow}
      >
        <UserPlus className="w-4 h-4" />
        <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
      </Button>
      <Button
        onClick={handleMessage}
        className="bg-nomadiqe-600 hover:bg-nomadiqe-700 flex items-center space-x-2"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Message</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyProfileLink}
        className="flex items-center space-x-2"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Share className="w-4 h-4" />
        )}
        <span>{copied ? 'Copied!' : 'Share'}</span>
      </Button>
    </div>
  )
}