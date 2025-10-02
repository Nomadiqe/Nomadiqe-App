import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Users, TrendingUp, MapPin, Heart, Camera } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PostCard } from '@/components/post-card'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  let posts: any[] = []

  // If user is authenticated, fetch posts for their feed
  if (session?.user?.id) {
    // For now, fetch all posts. Later we can filter by following/interests
    const postsData = await prisma.post.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 20, // Limit to 20 most recent posts
      include: {
        author: {
          select: {
            id: true,
            name: true,
            fullName: true,
            image: true,
            profilePictureUrl: true,
          }
        },
        property: {
          select: {
            id: true,
            title: true,
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          }
        },
        likes: {
          where: { userId: session.user.id },
          select: { id: true }
        }
      }
    })

    posts = postsData.map((post: any) => ({
      id: post.id,
      content: post.content,
      images: post.images as string[],
      location: post.location || undefined,
      createdAt: post.createdAt.toISOString(),
      author: {
        id: post.author.id,
        name: post.author.fullName || post.author.name || 'User',
        image: post.author.image || post.author.profilePictureUrl || undefined,
      },
      property: post.property ? { id: post.property.id, title: post.property.title } : undefined,
      likes: post._count.likes,
      comments: post._count.comments,
      isLiked: post.likes.length > 0,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-card border-b border-border py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {session ? 'Your Feed' : 'Discover Your Next Adventure'}
              </h1>
              <p className="text-muted-foreground">
                {session
                  ? 'See the latest posts from the community'
                  : 'Join the community of travelers sharing authentic experiences and unique stays worldwide'}
              </p>
            </div>
            {session && (
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/create-post" className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Post</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Main Feed */}
      <section className="py-6 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {session ? (
            // Authenticated user: Show posts feed
            posts.length > 0 ? (
              <>
                {posts.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))}
              </>
            ) : (
              // No posts yet - show empty state
              <Card className="border-dashed">
                <CardContent className="p-12 text-center">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Your Feed is Empty</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Start following other users or create your first post to get started!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild variant="outline">
                      <Link href="/search">Discover Users</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/create-post">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Post
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          ) : (
            /* Not authenticated: Show welcome content */
            <div className="space-y-8">
              {/* Welcome Card */}
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-nomadiqe-500 to-nomadiqe-700 p-8 text-white">
                  <h2 className="text-3xl font-bold mb-4">Welcome to Nomadiqe</h2>
                  <p className="text-lg mb-6 text-white/90">
                    Your gateway to authentic travel experiences and unique stays around the world.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Discover Unique Stays</p>
                        <p className="text-white/80">Find properties shared by local hosts</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Users className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Connect with Community</p>
                        <p className="text-white/80">Share experiences with fellow travelers</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Camera className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Collaborate as Creator</p>
                        <p className="text-white/80">Partner with hosts for content</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Get Started Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">I&apos;m a Traveler</h3>
                    <p className="text-muted-foreground mb-4">
                      Find unique places to stay and connect with local hosts.
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/search">Browse Properties</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">I&apos;m a Host</h3>
                    <p className="text-muted-foreground mb-4">
                      List your property and welcome travelers from around the world.
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/host">Become a Host</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <Camera className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">I&apos;m a Creator</h3>
                    <p className="text-muted-foreground mb-4">
                      Partner with hosts to create content and grow your audience.
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/onboarding/role-selection">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Call to Action */}
              <Card className="border-dashed">
                <CardContent className="p-12 text-center">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Join the Community</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Sign up to share your travel experiences, discover unique stays, and connect with travelers worldwide.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild variant="outline">
                      <Link href="/auth/signin">Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/auth/signup">
                        Get Started
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Quick Links Footer - Only show for non-authenticated users */}
      {!session && (
        <section className="py-12 px-4 border-t border-border bg-card/50">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h3 className="text-xl font-semibold">Ready to Start Your Journey?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you&apos;re looking for unique places to stay, planning your next trip, or want to share your travel experiences with like-minded explorers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <Link href="/search">Browse Unique Stays</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/about">How It Works</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/auth/signup">Start Exploring</Link>
              </Button>
            </div>

            {/* Policy Links Footer */}
            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-muted-foreground">
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                © 2024 Nomadiqe. All rights reserved.
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}