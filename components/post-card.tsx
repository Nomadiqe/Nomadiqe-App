"use client"

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Heart, 
  MessageCircle, 
  MapPin, 
  MoreHorizontal 
} from 'lucide-react'

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

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
    // TODO: Implement actual like functionality
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
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href={`/profile/${author.id}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nomadiqe-500 to-nomadiqe-700 flex items-center justify-center">
              {author.image ? (
                <img 
                  src={author.image} 
                  alt={author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-medium text-sm">
                  {author.name.charAt(0)}
                </span>
              )}
            </div>
          </Link>
          <div>
            <Link href={`/profile/${author.id}`}>
              <h3 className="font-medium text-foreground hover:text-primary transition-colors">
                {author.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground">{formatDate(createdAt)}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <p className="text-foreground leading-relaxed">{content}</p>
        
        {location && (
          <div className="flex items-center space-x-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location}</span>
          </div>
        )}

        {property && (
          <div className="bg-accent/50 rounded-md p-3 border border-border">
            <Link href={`/property/${property.id}`}>
              <p className="text-sm text-muted-foreground">Featured Property</p>
              <h4 className="font-medium text-foreground hover:text-primary transition-colors">
                {property.title}
              </h4>
            </Link>
          </div>
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
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center space-x-2 ${
              liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            <span className="text-sm">{likeCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{comments}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
