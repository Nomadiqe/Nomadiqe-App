"use client"

import { PostCard } from '@/components/post-card'
import { PropertyCard } from '@/components/property-card'
import { Camera, Home, Image, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
// Theme toggle removed here since it's available in the main navigation menu

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
      <div className="flex items-center justify-between mb-3">
        <TabsList className="grid w-full max-w-md grid-cols-3 lg:grid-cols-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          {userRole === 'HOST' && <TabsTrigger value="properties">Properties</TabsTrigger>}
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        {/* Theme toggle removed */}
      </div>

      <TabsContent value="posts" className="mt-6 space-y-4 md:space-y-6 w-full md:max-w-[600px] md:mx-auto">
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