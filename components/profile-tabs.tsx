"use client"

import { PostCard } from '@/components/post-card'
import { PropertyCard } from '@/components/property-card'
import { MessagesExpandableCard } from '@/components/messages-expandable-card'
import { Camera, Home, Star, Plus, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { useEffect, useState } from 'react'
// Theme toggle removed here since it's available in the main navigation menu

interface ProfileTabsProps {
  posts: any[]
  properties?: any[]
  userComments?: any[]
  userRole: string
  isOwnProfile: boolean
  userName: string
}

export function ProfileTabs({ posts, properties = [], userComments = [], userRole, isOwnProfile, userName }: ProfileTabsProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [messagesLoading, setMessagesLoading] = useState(false)

  useEffect(() => {
    if (isOwnProfile) {
      fetchMessages()
    }
  }, [isOwnProfile])

  const fetchMessages = async () => {
    setMessagesLoading(true)
    try {
      const response = await fetch('/api/messages/chats')
      if (response.ok) {
        const data = await response.json()
        setMessages(data.chats || [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setMessages([])
    } finally {
      setMessagesLoading(false)
    }
  }

  const EmptyState = ({ icon: Icon, title, description, actionLabel, actionHref }: any) => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Icon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
          {description}
        </p>
        {isOwnProfile && actionLabel && actionHref && (
          <Button asChild>
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )

  const tabCols = isOwnProfile 
    ? (userRole === 'HOST' ? 'grid-cols-4' : 'grid-cols-3')
    : (userRole === 'HOST' ? 'grid-cols-3' : 'grid-cols-2')

  return (
    <Tabs defaultValue="posts" className="w-full">
      <div className="flex items-center justify-center mb-6">
        <TabsList className={`grid w-full max-w-2xl ${tabCols} bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-1.5 backdrop-blur-sm`}>
          <TabsTrigger 
            value="posts"
            className="rounded-lg data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
          >
            Posts
          </TabsTrigger>
          {userRole === 'HOST' && (
            <TabsTrigger 
              value="properties"
              className="rounded-lg data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              Properties
            </TabsTrigger>
          )}
          <TabsTrigger 
            value="comments"
            className="rounded-lg data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
          >
            Comments
          </TabsTrigger>
          {isOwnProfile && (
            <TabsTrigger 
              value="messages"
              className="rounded-lg data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
            >
              Messages
            </TabsTrigger>
          )}
        </TabsList>
        {/* Theme toggle removed */}
      </div>

      <TabsContent value="posts" className="mt-6 space-y-6 max-w-[600px] mx-auto">
        {posts.length > 0 ? (
          posts.map((post: any) => <PostCard key={post.id} {...post} layout="profile" />)
        ) : (
          <EmptyState
            icon={Camera}
            title="No posts yet"
            description={
              isOwnProfile
                ? 'Share your first travel experience!'
                : `${userName} hasn't shared any posts yet.`
            }
            actionLabel={isOwnProfile ? 'Create Your First Post' : undefined}
            actionHref="/create-post"
          />
        )}
      </TabsContent>

      {userRole === 'HOST' && (
        <TabsContent value="properties" className="mt-6">
          {properties.length > 0 ? (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property: any) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    title={property.title}
                    location={`${property.city}, ${property.country}`}
                    price={property.price}
                    rating={0}
                    image={property.images[0] || '/placeholder-property.jpg'}
                    guests={0}
                    bedrooms={0}
                    currency={property.currency}
                  />
                ))}
              </div>
              {isOwnProfile && (
                <div className="flex justify-center pt-4">
                  <Button asChild className="gap-2">
                    <Link href="/host/create-property">
                      <Plus className="h-4 w-4" />
                      Add Property
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
          <EmptyState
            icon={Home}
            title="No properties listed"
            description={
              isOwnProfile
                ? 'List your first property to start hosting!'
                : `${userName} hasn't listed any properties yet.`
            }
            actionLabel={isOwnProfile ? 'List Your Property' : undefined}
            actionHref="/host/create-property"
          />
          )}
        </TabsContent>
      )}

      <TabsContent value="comments" className="mt-6 max-w-[600px] mx-auto">
        {userComments.length > 0 ? (
          <div className="space-y-4">
            {userComments.map((comment: any) => (
              <Card key={comment.id} className="bg-gray-800/90 border border-blue-400/30 shadow-lg shadow-blue-500/20 backdrop-blur-sm hover:border-blue-400/50 transition-all">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Comment Content */}
                    <p className="text-white text-sm">{comment.content}</p>
                    
                    {/* Post Preview */}
                    <Link 
                      href={`/post/${comment.postId}`}
                      className="block rounded-lg bg-gray-700/50 p-3 hover:bg-gray-700/70 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {comment.postImages && comment.postImages.length > 0 && (
                          <img 
                            src={comment.postImages[0]} 
                            alt="Post" 
                            className="w-16 h-16 rounded-md object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {comment.postAuthor.image && (
                              <img 
                                src={comment.postAuthor.image} 
                                alt={comment.postAuthor.name}
                                className="w-5 h-5 rounded-full"
                              />
                            )}
                            <span className="text-xs text-gray-300 font-medium">{comment.postAuthor.name}</span>
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-2">
                            {comment.postContent || 'View post'}
                          </p>
                        </div>
                      </div>
                    </Link>

                    {/* Timestamp */}
                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No comments yet"
            description={
              isOwnProfile
                ? 'Your comments on other posts will appear here.'
                : `${userName} hasn't commented on any posts yet.`
            }
          />
        )}
      </TabsContent>

      {isOwnProfile && (
        <TabsContent value="messages" className="mt-6">
          {messagesLoading ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No messages yet"
              description="Start a conversation with other users!"
            />
          ) : (
            <MessagesExpandableCard messages={messages} />
          )}
        </TabsContent>
      )}
    </Tabs>
  )
}