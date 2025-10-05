"use client"

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  MessageCircle,
  MapPin,
  MoreHorizontal
} from 'lucide-react'
import { PostComments } from '@/components/post-comments'

interface PostCardProps {
  id: string
  content: string
  images: string[]
  location?: string
  createdAt: string
  author: {
    id: string
    name: string
    image?: string
  }
  property?: {
    id: string
    title: string
  }
  likes: number
  comments: number
  isLiked?: boolean
}

export function PostCard({
  id,
  content,
  images,
  location,
  createdAt,
  author,
  property,
  likes,
  comments,
  isLiked = false
}: PostCardProps) {
  const [liked, setLiked] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(likes)
  const [commentCount, setCommentCount] = useState(comments)
  const [showComments, setShowComments] = useState(false)

  const handleLike = async () => {
    // Optimistic update
    const wasLiked = liked
    const previousCount = likeCount
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)

    try {
      const response = await fetch(`/api/posts/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to update like')
      }

      const data = await response.json()

      // Update with server response
      setLiked(data.liked)
      setLikeCount(data.likeCount)
    } catch (error) {
      // Revert optimistic update on error
      console.error('Error updating like:', error)
      setLiked(wasLiked)
      setLikeCount(previousCount)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href={`/profile/${author.id}`}>
              <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage src={author.image} alt={author.name} />
                <AvatarFallback className="bg-gradient-to-br from-nomadiqe-primary to-nomadiqe-700 text-white">
                  {author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link href={`/profile/${author.id}`}>
                <h3 className="font-semibold text-sm hover:text-primary transition-colors">
                  {author.name}
                </h3>
              </Link>
              <p className="text-xs text-muted-foreground">{formatDate(createdAt)}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Content */}
        <div className="space-y-3">
          <p className="text-sm leading-relaxed">{content}</p>

          {location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{location}</span>
            </div>
          )}

          {property && (
            <Card className="bg-muted/50">
              <CardContent className="p-3">
                <Link href={`/property/${property.id}`}>
                  <Badge variant="secondary" className="mb-1 text-xs">Featured Property</Badge>
                  <h4 className="font-medium text-sm hover:text-primary transition-colors">
                    {property.title}
                  </h4>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

      {/* Images */}
      {images.length > 0 && (
        <div className="space-y-2">
          {images.length === 1 ? (
            <img
              src={images[0]}
              alt="Post image"
              className="w-full h-64 object-cover rounded-md"
            />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {images.slice(0, 4).map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Post image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  {index === 3 && images.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                      <span className="text-white font-medium">
                        +{images.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`gap-2 ${
              liked ? 'text-red-500 hover:text-red-600' : ''
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likeCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(true)}
            className="gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{commentCount}</span>
          </Button>
        </div>
      </CardContent>

      {/* Comments Panel */}
      <PostComments
        postId={id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        onCommentAdded={() => setCommentCount(commentCount + 1)}
      />
    </Card>
  )
}
