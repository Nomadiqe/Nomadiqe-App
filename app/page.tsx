import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PostCard } from '@/components/post-card'
import { SimpleSearchBar } from '@/components/simple-search-bar'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  // Get current user data if authenticated
  let currentUser = null
  if (session?.user?.id) {
    currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        image: true,
        profilePictureUrl: true,
      }
    })
  }

  let posts: any[] = []

  // Fetch posts for the feed (for both authenticated and unauthenticated users)
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
      likes: session?.user?.id ? {
        where: { userId: session.user.id },
        select: { id: true }
      } : false
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
    isLiked: post.likes && post.likes.length > 0,
  }))

  return (
    <div className="min-h-screen bg-background">
      {/* Main Feed */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Sign up banner for unauthenticated users */}
          {!session && (
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-semibold mb-1">Join the Nomadiqe Community</h3>
                    <p className="text-sm text-muted-foreground">
                      Sign up to share your adventures, connect with travelers, and discover unique stays
                    </p>
                  </div>
                  <div className="flex gap-3 flex-shrink-0">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/auth/signin">Sign In</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile picture reminder for authenticated users without avatar */}
          {session && currentUser && (!currentUser.image && !currentUser.profilePictureUrl) && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Complete Your Profile
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Add a profile picture to personalize your posts and connect better with the community
                    </p>
                  </div>
                  <div className="flex gap-3 flex-shrink-0">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/profile/edit">Add Photo</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="/profile">View Profile</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Posts Feed */}
          {posts.length > 0 ? (
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
                <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {session
                    ? 'Be the first to share your travel story! Create your first post to get started.'
                    : 'The community feed is empty right now. Check back soon for travel stories and experiences!'}
                </p>
                {session && (
                  <Button asChild>
                    <Link href="/create-post">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Post
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

             {/* Search Bar - Only show for authenticated users */}
             {session && <SimpleSearchBar />}
    </div>
  )
}