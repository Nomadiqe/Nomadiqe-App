"use client"

import { PostCard } from '@/components/post-card'
import { Camera, Home, Image, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

interface ProfileTabsProps {
  posts: any[]
  properties?: any[]
  userRole: string
  isOwnProfile: boolean
  userName: string
}

export function ProfileTabs({ posts, properties = [], userRole, isOwnProfile, userName }: ProfileTabsProps) {
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

  return (
    <Tabs defaultValue="posts" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList className="grid w-full max-w-md grid-cols-3 lg:grid-cols-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          {userRole === 'HOST' && <TabsTrigger value="properties">Properties</TabsTrigger>}
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <div className="ml-4">
          <ThemeToggle />
        </div>
      </div>

      <TabsContent value="posts" className="mt-6 space-y-6">
        {posts.length > 0 ? (
          posts.map((post: any) => <PostCard key={post.id} {...post} />)
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
          {/* Add Property Button - Always visible for hosts */}
          {isOwnProfile && (
            <div className="mb-6">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/host/create-property">
                  <Home className="w-4 h-4 mr-2" />
                  Add Property
                </Link>
              </Button>
            </div>
          )}

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property: any) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{property.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {property.currency} {property.price}/night
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{property.averageRating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({property.reviewsCount})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{property.maxGuests} guests</span>
                      <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                      <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
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

      <TabsContent value="photos" className="mt-6">
        <EmptyState
          icon={Image}
          title="No photos yet"
          description={
            isOwnProfile
              ? 'Share photos from your travels!'
              : `${userName} hasn't shared any photos yet.`
          }
          actionLabel={isOwnProfile ? 'Upload Photos' : undefined}
          actionHref="/create-post"
        />
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description={
            isOwnProfile
              ? 'Reviews from your stays will appear here.'
              : `${userName} hasn't received any reviews yet.`
          }
        />
      </TabsContent>
    </Tabs>
  )
}