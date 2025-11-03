import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PostCard } from '@/components/post-card'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { SearchHeaderImproved } from '@/components/search-header-improved'
import { NotificationsHeader } from '@/components/notifications-header'
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

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
          role: true,
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
      role: post.author.role,
    },
    property: post.property ? { id: post.property.id, title: post.property.title } : undefined,
    likes: post._count.likes,
    comments: post._count.comments,
    isLiked: post.likes && post.likes.length > 0,
  }))

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(60, 20, 90)"
          gradientBackgroundEnd="rgb(90, 30, 120)"
          firstColor="232, 121, 249"
          secondColor="160, 100, 255"
          thirdColor="80, 47, 122"
          fourthColor="232, 121, 249"
          fifthColor="160, 100, 255"
          pointerColor="232, 121, 249"
          size="80%"
          blendingValue="hard-light"
          interactive={true}
        />
      </div>

      {/* Hero Search Section */}
      <section className="relative pt-6 pb-3 z-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <SearchHeaderImproved />
            </div>
            {session && <NotificationsHeader />}
          </div>
        </div>
      </section>

      {/* Main Feed */}
      <section className="pt-3 pb-8 px-4 relative">
        <div className="max-w-[600px] mx-auto space-y-6">
          {/* Sign up banner for unauthenticated users */}
          {!session && (
            <Card className="bg-card dark:bg-secondary/40 border border-primary/30 shadow-lg shadow-primary/20 backdrop-blur-sm rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-semibold mb-1 text-foreground">Join the Nomadiqe Community</h3>
                    <p className="text-sm text-muted-foreground">
                      Sign up to share your adventures, connect with travelers, and discover unique stays
                    </p>
                  </div>
                  <div className="flex gap-3 flex-shrink-0">
                    <Button 
                      asChild 
                      className="bg-muted hover:bg-muted/80 text-foreground rounded-lg px-4 py-2 font-medium transition-all shadow-md hover:shadow-lg"
                    >
                      <Link href="/auth/signin">Sign In</Link>
                    </Button>
                    <Button 
                      asChild 
                      className="bg-primary hover:bg-primary/90 text-white rounded-lg px-4 py-2 font-medium transition-all shadow-lg hover:shadow-xl"
                    >
                      <Link href="/auth/signup">Sign Up</Link>
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
            <Card className="bg-card dark:bg-secondary/40 border border-primary/30 shadow-lg shadow-primary/20 backdrop-blur-sm rounded-xl border-dashed">
              <CardContent className="p-12 text-center">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">No Posts Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {session
                    ? 'Be the first to share your travel story! Create your first post to get started.'
                    : 'The community feed is empty right now. Check back soon for travel stories and experiences!'}
                </p>
                {session && (
                  <Button 
                    asChild
                    className="bg-primary hover:bg-primary/90 text-white rounded-lg px-6 py-2 font-medium transition-all shadow-lg hover:shadow-xl"
                  >
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

    </div>
  )
}