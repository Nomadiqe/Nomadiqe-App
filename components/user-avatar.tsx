"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Camera, User } from 'lucide-react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface UserAvatarProps {
  user: {
    id: string
    name: string
    image?: string
  }
  size?: 'sm' | 'md' | 'lg'
  showUploadButton?: boolean
  linkToProfile?: boolean
  className?: string
}

export function UserAvatar({ 
  user, 
  size = 'md', 
  showUploadButton = false,
  linkToProfile = true,
  className = ""
}: UserAvatarProps) {
  const { data: session } = useSession()
  const [isUploading, setIsUploading] = useState(false)
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-11 w-11',
    lg: 'h-16 w-16'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6'
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !session?.user?.id) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        
        // Update profile with new image
        const profileResponse = await fetch('/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profilePicture: url
          }),
        })

        if (profileResponse.ok) {
          // Refresh the page to show updated avatar
          window.location.reload()
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const avatar = (
    <Avatar className={`${sizeClasses[size]} cursor-pointer hover:ring-2 hover:ring-primary/30 hover:ring-offset-2 hover:ring-offset-background transition-all duration-200 ${className}`}>
      <AvatarImage src={user.image} alt={user.name} />
      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
        {user.name ? user.name.charAt(0).toUpperCase() : <User className={iconSizes[size]} />}
      </AvatarFallback>
    </Avatar>
  )

  return (
    <div className="relative group">
      {linkToProfile ? (
        <Link href={`/profile/${user.id}`}>
          {avatar}
        </Link>
      ) : (
        avatar
      )}
      
      {showUploadButton && session?.user?.id === user.id && (
        <div className="absolute -bottom-1 -right-1">
          <Button
            size="icon"
            className="h-6 w-6 rounded-full bg-primary hover:bg-primary/90"
            onClick={() => document.getElementById(`avatar-upload-${user.id}`)?.click()}
            disabled={isUploading}
          >
            <Camera className="h-3 w-3" />
          </Button>
          <input
            id={`avatar-upload-${user.id}`}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
}
