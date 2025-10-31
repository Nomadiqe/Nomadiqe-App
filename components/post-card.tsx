"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  MessageCircle,
  MapPin,
  MoreHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Send,
  Repeat
} from 'lucide-react'
import { PostComments } from '@/components/post-comments'
import { UserMentionSearch } from '@/components/user-mention-search'
import { ShareCommentCard } from '@/components/share-comment-card'

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
    city?: string
    country?: string
    price?: number
    currency?: string
    images?: string[]
  }
  likes: number
  comments: number
  isLiked?: boolean
  layout?: 'discover' | 'profile' // New prop to determine layout
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
  isLiked = false,
  layout = 'discover' // Default to discover layout
}: PostCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [liked, setLiked] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(likes)
  const [commentCount, setCommentCount] = useState(comments)
  const [showComments, setShowComments] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [showUserSearch, setShowUserSearch] = useState(false)
  const [showCommentCard, setShowCommentCard] = useState(false)
  const [selectedUserForShare, setSelectedUserForShare] = useState<any>(null)
  const [captionExpanded, setCaptionExpanded] = useState(false)

  const handleLike = async () => {
    // Check if user is authenticated
    if (!session?.user?.id) {
      router.push('/auth/signin')
      return
    }

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

  const handleCommentClick = () => {
    // Check if user is authenticated
    if (!session?.user?.id) {
      router.push('/auth/signin')
      return
    }
    setShowComments(true)
  }

  const handleShare = () => {
    if (!session?.user?.id) {
      router.push('/auth/signin')
      return
    }
    setShareOpen(true)
  }

  const handleSendMessage = () => {
    setShareOpen(false)
    setShowUserSearch(true)
  }

  const handleSelectUser = (user: any) => {
    setSelectedUserForShare(user)
    setShowUserSearch(false)
    setShowCommentCard(true)
  }

  const handleSendSharedMessage = async (message: string) => {
    try {
      if (!selectedUserForShare?.id) return
      await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: selectedUserForShare.id, postId: id, content: message }),
      })
      // Close and reset, stay on page
      setShowCommentCard(false)
      setSelectedUserForShare(null)
    } catch (error) {
      console.error('Errore durante l\'invio del messaggio:', error)
    }
  }

  const handleRepost = () => {
    // TODO: Implement repost functionality
    console.log('Repost post:', id)
    setShareOpen(false)
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
    <Card className="overflow-hidden border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href={`/profile/${author.id}`}>
              <div className="h-11 w-11 cursor-pointer hover:ring-2 hover:ring-primary/30 hover:ring-offset-2 hover:ring-offset-background transition-all duration-200 rounded-full overflow-hidden flex items-center justify-center bg-primary/10">
                {author.image && !imageError ? (
                  <Image 
                    src={author.image} 
                    alt={author.name}
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                    unoptimized
                  />
                ) : (
                  <span className="text-primary font-semibold text-lg">
                    {author.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </Link>
            <div>
              <Link href={`/profile/${author.id}`}>
                <h3 className="font-semibold text-sm hover:text-primary transition-colors hover:underline decoration-primary/30">
                  {author.name}
                </h3>
              </Link>
              <p className="text-xs text-muted-foreground">{formatDate(createdAt)}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/80">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Content */}
        <div className="space-y-3">
          <p className="text-sm leading-relaxed">{content}</p>

          {location && (
            <Link
              href={`/search?location=${encodeURIComponent(location)}`}
              className="flex items-center gap-1.5 hover:text-primary transition-colors group w-fit"
              onClick={(e) => e.stopPropagation()}
            >
              <MapPin className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm text-muted-foreground group-hover:text-primary group-hover:underline transition-colors">{location}</span>
            </Link>
          )}

          {property && (
            <Link href={`/property/${property.id}`}>
              <Card className="bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer border-primary/20">
                <CardContent className="p-0">
                  <div className="flex gap-3">
                    {/* Property Image */}
                    {property.images && property.images.length > 0 && (
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover rounded-l-lg"
                        />
                      </div>
                    )}

                    {/* Property Details */}
                    <div className="flex-1 py-3 pr-3">
                      <Badge variant="secondary" className="mb-1.5 text-xs">Featured Property</Badge>
                      <h4 className="font-semibold text-sm hover:text-primary transition-colors line-clamp-1">
                        {property.title}
                      </h4>
                      {property.city && property.country && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {property.city}, {property.country}
                          </span>
                        </div>
                      )}
                      {property.price && (
                        <p className="text-sm font-semibold text-primary mt-1.5">
                          {property.currency || 'EUR'} {property.price}/night
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>

      {/* Images */}
      {images.length > 0 && (
        <div className="space-y-2 -mx-6">
          {images.length === 1 ? (
            <div
              className={`relative group overflow-hidden cursor-pointer ${layout === 'discover' ? 'aspect-[4/5]' : 'aspect-square'}`}
              onClick={() => {
                setLightboxIndex(0)
                setLightboxOpen(true)
              }}
            >
              <img
                src={images[0]}
                alt="Post image"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1">
              {images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className={`relative group overflow-hidden cursor-pointer ${layout === 'discover' ? 'aspect-[4/5]' : 'aspect-square'}`}
                  onClick={() => {
                    setLightboxIndex(index)
                    setLightboxOpen(true)
                  }}
                >
                  <img
                    src={image}
                    alt={`Post image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {index === 3 && images.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center group-hover:bg-black/70 transition-colors">
                      <span className="text-white font-semibold text-lg">
                        +{images.length - 4}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`gap-2 transition-all duration-200 hover:scale-105 ${
                liked ? 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20' : 'hover:bg-muted/80'
              }`}
            >
              <Heart className={`h-4 w-4 transition-all ${liked ? 'fill-current scale-110' : ''}`} />
              <span className="text-sm font-medium">{likeCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCommentClick}
              className="gap-2 transition-all duration-200 hover:scale-105 hover:bg-primary/10 hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{commentCount}</span>
            </Button>
          </div>
          
          {/* Share Button */}
          <div className="relative">
            <Popover open={shareOpen} onOpenChange={setShareOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 hover:bg-muted/80"
                >
                  <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="end">
                <div className="py-2">
                  <button
                    onClick={handleSendMessage}
                    className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-3 transition-colors"
                  >
                    <Send className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">send by message</span>
                  </button>
                  <button
                    onClick={handleRepost}
                    className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-3 transition-colors"
                  >
                    <Repeat className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* User Search */}
            {showUserSearch && (
              <UserMentionSearch
                onSelectUser={handleSelectUser}
                onClose={() => setShowUserSearch(false)}
              />
            )}
          </div>
        </div>
      </CardContent>

      {/* Share Comment Card */}
      {showCommentCard && selectedUserForShare && (
        <ShareCommentCard
          isOpen={showCommentCard}
          onClose={() => {
            setShowCommentCard(false)
            setSelectedUserForShare(null)
          }}
          onSend={handleSendSharedMessage}
          selectedUser={selectedUserForShare}
          post={{ id, content, images }}
        />
      )}

      {/* Comments Panel */}
      <PostComments
        postId={id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        onCommentAdded={() => setCommentCount(commentCount + 1)}
      />

      {/* Image Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 z-[1200] bg-black flex flex-col"
          onClick={() => {
            setLightboxOpen(false)
            setCaptionExpanded(false)
          }}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Top Bar with Close Button */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
            <div></div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightboxOpen(false)
                setCaptionExpanded(false)
              }}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex items-center justify-center relative">
            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                  }}
                  className="absolute left-4 z-50 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                  }}
                  className="absolute right-4 z-50 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image with Swipe Support */}
            <div
              className="relative w-full h-full flex items-center justify-center px-16"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => {
                const touch = e.touches[0]
                const startX = touch.clientX
                
                const handleTouchEnd = (e: TouchEvent) => {
                  const touch = e.changedTouches[0]
                  const endX = touch.clientX
                  const diffX = startX - endX
                  
                  // Swipe threshold (50px)
                  if (Math.abs(diffX) > 50 && images.length > 1) {
                    if (diffX > 0) {
                      // Swipe left - next image
                      setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                    } else {
                      // Swipe right - previous image
                      setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                    }
                  }
                  
                  document.removeEventListener('touchend', handleTouchEnd)
                }
                
                document.addEventListener('touchend', handleTouchEnd)
              }}
            >
              <img
                src={images[lightboxIndex]}
                alt={`Image ${lightboxIndex + 1}`}
                className="max-w-full max-h-full object-contain select-none"
                draggable={false}
              />
            </div>
          </div>

          {/* Bottom Bar with Caption and Actions */}
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 via-black/80 to-transparent p-6">
            {/* Caption with expand/collapse */}
            <div className="max-w-3xl mx-auto mb-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setCaptionExpanded(!captionExpanded)
                }}
                className="w-full text-left"
              >
                <p className={`text-white text-sm leading-relaxed ${captionExpanded ? '' : 'line-clamp-2'}`}>
                  {content}
                </p>
              </button>
            </div>

            {/* Actions */}
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLike()
                  }}
                  className={`gap-2 text-white hover:bg-white/20 ${
                    liked ? 'text-red-400 hover:text-red-300' : ''
                  }`}
                >
                  <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                  <span className="font-medium">{likeCount}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightboxOpen(false)
                    setCaptionExpanded(false)
                    handleCommentClick()
                  }}
                  className="gap-2 text-white hover:bg-white/20"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-medium">{commentCount}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleShare()
                  }}
                  className="gap-2 text-white hover:bg-white/20"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Image Counter */}
              {images.length > 1 && (
                <div className="px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                  {lightboxIndex + 1} / {images.length}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
