import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  MapPin,
  Calendar,
  Phone,
  Mail,
  Star,
  CheckCircle
} from 'lucide-react'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProfileActions } from '@/components/profile-actions'
import { ProfileTabs } from '@/components/profile-tabs'

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
  const avatarUrl = dbUser.profilePictureUrl || dbUser.image || undefined
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

  const statsCols = user.role === 'HOST' ? 'grid-cols-4' : 'grid-cols-3'

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header */}
      <section className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={user.image || '/placeholder-avatar.png'}
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
              <h1 className="text-2xl font-bold flex items-center space-x-2">
                    <span>{user.name}</span>
                    {user.isVerified && (
                      <Star className="w-6 h-6 text-nomadiqe-500 fill-current" />
                    )}
                  </h1>
              <p className="text-muted-foreground capitalize text-sm">{user.role.toLowerCase()}</p>
                </div>

                {/* Action Buttons */}
                <ProfileActions
                  isOwnProfile={isOwnProfile}
                  userId={user.id}
                  userName={user.name}
                />
              </div>

              {/* Bio */}
              <p className="text-foreground leading-relaxed text-sm">{user.bio}</p>

              {/* Contact Info */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
              <div className={`grid ${statsCols} gap-3 pt-2 w-full`}>
                <Card className="px-3 py-2 w-full">
                  <div className="text-center">
                    <p className="text-base font-bold">{user.stats.posts}</p>
                    <p className="text-[10px] text-muted-foreground">Posts</p>
                  </div>
                </Card>
                <Card className="px-3 py-2 w-full">
                  <div className="text-center">
                    <p className="text-base font-bold">{user.stats.followers}</p>
                    <p className="text-[10px] text-muted-foreground">Followers</p>
                  </div>
                </Card>
                <Card className="px-3 py-2 w-full">
                  <div className="text-center">
                    <p className="text-base font-bold">{user.stats.following}</p>
                    <p className="text-[10px] text-muted-foreground">Following</p>
                  </div>
                </Card>
                {user.role === 'HOST' && (
                  <Card className="px-3 py-2 w-full">
                    <div className="text-center">
                      <p className="text-base font-bold">{user.stats.properties}</p>
                      <p className="text-[10px] text-muted-foreground">Properties</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <ProfileTabs
          posts={posts}
          userRole={user.role}
          isOwnProfile={isOwnProfile}
          userName={user.name}
        />
      </section>
    </div>
  )
}
