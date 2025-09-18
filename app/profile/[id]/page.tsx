import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/post-card'
import { 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  UserPlus,
  MessageCircle,
  Star,
  Camera,
  Settings
} from 'lucide-react'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await getServerSession(authOptions)

  const dbUser = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      email: true,
      name: true,
      fullName: true,
      username: true,
      image: true,
      profilePictureUrl: true,
      bio: true,
      location: true,
      phone: true,
      isVerified: true,
      role: true,
      createdAt: true,
    }
  })

  if (!dbUser) {
    notFound()
  }

  const [postsRaw, postsCount, followersCount, followingCount, propertiesCount] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: dbUser.id, isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        property: { select: { id: true, title: true } },
        ...(session?.user?.id ? { likes: { where: { userId: session.user.id }, select: { id: true } } } : {}),
        _count: { select: { likes: true, comments: true } },
      },
    }),
    prisma.post.count({ where: { authorId: dbUser.id, isActive: true } }),
    prisma.follow.count({ where: { followingId: dbUser.id } }),
    prisma.follow.count({ where: { followerId: dbUser.id } }),
    prisma.property.count({ where: { hostId: dbUser.id, isActive: true } }),
  ])

  const displayName = dbUser.fullName || dbUser.name || (dbUser.email ? dbUser.email.split('@')[0] : 'User')
  const avatarUrl = dbUser.image || dbUser.profilePictureUrl || undefined
  const isOwnProfile = session?.user?.id === dbUser.id

  const posts = postsRaw.map((p: any) => ({
    id: p.id,
    content: p.content,
    images: p.images as string[],
    location: p.location || undefined,
    createdAt: p.createdAt.toISOString(),
    author: {
      id: dbUser.id,
      name: displayName,
      image: avatarUrl,
    },
    property: p.property ? { id: p.property.id, title: p.property.title } : undefined,
    likes: p._count?.likes || 0,
    comments: p._count?.comments || 0,
    isLiked: Array.isArray(p.likes) ? p.likes.length > 0 : false,
  }))

  const user = {
    id: dbUser.id,
    name: displayName,
    image: avatarUrl,
    bio: dbUser.bio || '',
    location: dbUser.location || '',
    phone: dbUser.phone || '',
    email: dbUser.email,
    role: dbUser.role,
    joinedDate: dbUser.createdAt.toISOString(),
    isVerified: dbUser.isVerified,
    stats: {
      posts: postsCount,
      followers: followersCount,
      following: followingCount,
      properties: propertiesCount,
    },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header */}
      <section className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={user.image}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-background"
              />
              {user.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-nomadiqe-500 text-white rounded-full p-2">
                  <Star className="w-4 h-4 fill-current" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-3xl font-bold flex items-center space-x-2">
                    <span>{user.name}</span>
                    {user.isVerified && (
                      <Star className="w-6 h-6 text-nomadiqe-500 fill-current" />
                    )}
                  </h1>
                  <p className="text-muted-foreground capitalize">{user.role.toLowerCase()}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  {isOwnProfile ? (
                    <>
                      <Button asChild variant="outline">
                        <Link href="/profile/edit" className="flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </Link>
                      </Button>
                      <Button className="bg-nomadiqe-600 hover:bg-nomadiqe-700 flex items-center space-x-2">
                        <Camera className="w-4 h-4" />
                        <span>Add Photo</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="flex items-center space-x-2">
                        <UserPlus className="w-4 h-4" />
                        <span>Follow</span>
                      </Button>
                      <Button className="bg-nomadiqe-600 hover:bg-nomadiqe-700 flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4" />
                        <span>Message</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Bio */}
              <p className="text-foreground leading-relaxed">{user.bio}</p>

              {/* Contact Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {user.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                {isOwnProfile && user.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {isOwnProfile && user.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{user.stats.posts}</p>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{user.stats.followers}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{user.stats.following}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
                {user.role === 'HOST' && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{user.stats.properties}</p>
                    <p className="text-sm text-muted-foreground">Properties</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="border-b border-border mb-8">
          <div className="flex items-center space-x-8">
            <button className="pb-4 border-b-2 border-nomadiqe-500 text-nomadiqe-500 font-medium">
              Posts
            </button>
            {user.role === 'HOST' && (
              <button className="pb-4 text-muted-foreground hover:text-foreground transition-colors">
                Properties
              </button>
            )}
            <button className="pb-4 text-muted-foreground hover:text-foreground transition-colors">
              Photos
            </button>
            <button className="pb-4 text-muted-foreground hover:text-foreground transition-colors">
              Reviews
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-8">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
          
          {posts.length === 0 && (
            <div className="text-center py-12">
              <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">No posts yet</h3>
              <p className="text-muted-foreground">
                {isOwnProfile ? 'Share your first travel experience!' : `${user.name} hasn't shared any posts yet.`}
              </p>
              {isOwnProfile && (
                <Button className="mt-4 bg-nomadiqe-600 hover:bg-nomadiqe-700">
                  Create Your First Post
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
