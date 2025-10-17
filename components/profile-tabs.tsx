"use client"

import { PostCard } from '@/components/post-card'
import { Camera, Home, Image, Star, Users, Bed, Bath, MapPin, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

interface ProfileTabsProps {
  posts: any[]
  properties: any[]
  userRole: string
  isOwnProfile: boolean
  userName: string
}

export function ProfileTabs({ posts, properties, userRole, isOwnProfile, userName }: ProfileTabsProps) {
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
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map((property: any) => (
                <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/property/${property.id}`}>
                    <div className="relative">
                      {property.image ? (
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-muted flex items-center justify-center">
                          <Camera className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex gap-2">
                        {property.isVerified && (
                          <Badge className="bg-green-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <Badge variant={property.isActive ? 'default' : 'secondary'}>
                          {property.isActive ? 'Active' : 'Under Review'}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{property.location}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{property.maxGuests}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            <span>{property.bedrooms}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            <span>{property.bathrooms}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold">
                            {property.currency === 'EUR' ? '€' : '$'}{property.price}
                          </span>
                          <span className="text-sm text-muted-foreground"> / night</span>
                        </div>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Link>
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
              actionHref="/onboarding/listing-creation"
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