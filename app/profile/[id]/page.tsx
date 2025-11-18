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
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProfileActions } from '@/components/profile-actions'
import { ProfileTabs } from '@/components/profile-tabs'
import { ProfileImageViewer } from '@/components/profile-image-viewer'
import { WalletDialog } from '@/components/wallet-dialog'

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const supabase = await createClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()

  const { data: dbUser, error: userError } = await supabase
    .from('users')
    .select(`
      id, email, name, fullName, username, image, profilePictureUrl,
      coverPhotoUrl, bio, location, phone, isVerified, role, createdAt
    `)
    .eq('id', params.id)
    .single()

  if (userError || !dbUser) {
    notFound()
  }

  // Fetch posts with likes and counts
  const { data: postsRaw } = await supabase
    .from('posts')
    .select(`
      *,
      property:properties(id, title),
      likes(id),
      comments:post_comments(count)
    `)
    .eq('authorId', dbUser.id)
    .eq('isActive', true)
    .order('createdAt', { ascending: false })

  // Count posts
  const { count: postsCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('authorId', dbUser.id)
    .eq('isActive', true)

  // Count followers
  const { count: followersCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('followingId', dbUser.id)

  // Count following
  const { count: followingCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('followerId', dbUser.id)

  // Count properties
  const { count: propertiesCount } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('hostId', dbUser.id)
    .eq('isActive', true)

  // Fetch properties if user is a host
  let propertiesRaw = null
  if (dbUser.role === 'HOST') {
    const { data } = await supabase
      .from('properties')
      .select(`
        id, title, description, type, city, country, price, currency, images,
        bookings(count),
        reviews:property_reviews(count)
      `)
      .eq('hostId', dbUser.id)
      .eq('isActive', true)
      .order('createdAt', { ascending: false })

    propertiesRaw = data
  }

  // Fetch influencer profile if user is an influencer
  let influencerProfile = null
  if (dbUser.role === 'INFLUENCER') {
    const { data } = await supabase
      .from('influencer_profiles')
      .select('*')
      .eq('userId', dbUser.id)
      .single()

    influencerProfile = data
  }

  // Fetch comments made by this user
  const { data: userCommentsRaw } = await supabase
    .from('post_comments')
    .select(`
      *,
      post:posts(
        id, content, images,
        author:users!authorId(
          id, name, fullName, image, profilePictureUrl
        )
      )
    `)
    .eq('authorId', dbUser.id)
    .order('createdAt', { ascending: false })

  const displayName = dbUser.fullName || dbUser.name || (dbUser.email ? dbUser.email.split('@')[0] : 'User')
  const avatarUrl = dbUser.profilePictureUrl || dbUser.image || undefined
  const isOwnProfile = authUser?.id === dbUser.id

  const posts = (postsRaw || []).map((p: any) => ({
    id: p.id,
    content: p.content,
    images: p.images as string[],
    location: p.location || undefined,
    createdAt: p.createdAt,
    author: {
      id: dbUser.id,
      name: displayName,
      image: avatarUrl,
      role: dbUser.role,
    },
    property: p.property ? { id: p.property.id, title: p.property.title } : undefined,
    likes: Array.isArray(p.likes) ? p.likes.length : 0,
    comments: Array.isArray(p.comments) ? p.comments.length : 0,
    isLiked: authUser?.id ? (Array.isArray(p.likes) ? p.likes.some((like: any) => like.userId === authUser.id) : false) : false,
  }))

  const userComments = (userCommentsRaw || []).map((c: any) => ({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt,
    postId: c.post.id,
    postContent: c.post.content,
    postImages: c.post.images as string[],
    postAuthor: {
      id: c.post.author.id,
      name: c.post.author.fullName || c.post.author.name || 'User',
      image: c.post.author.image || c.post.author.profilePictureUrl || undefined,
    }
  }))

  const user = {
    id: dbUser.id,
    name: displayName,
    image: avatarUrl,
    coverPhoto: dbUser.coverPhotoUrl || undefined,
    bio: dbUser.bio || '',
    location: dbUser.location || '',
    phone: dbUser.phone || '',
    email: dbUser.email,
    role: dbUser.role,
    joinedDate: dbUser.createdAt,
    isVerified: dbUser.isVerified,
    stats: {
      posts: postsCount,
      followers: followersCount,
      following: followingCount,
      properties: propertiesCount,
    },
  }

  const statsCols = user.role === 'HOST' ? 'grid-cols-4' : 'grid-cols-3'

  // Extract hashtags from bio if present (format: #tag1 #tag2)
  const hashtagsMatch = user.bio?.match(/#[\w]+/g)
  const hashtags = hashtagsMatch || []
  const bioWithoutHashtags = user.bio?.replace(/#[\w]+/g, '').trim() || ''

  return (
    <div className="min-h-screen relative overflow-x-hidden w-full bg-background">
      {/* Modern Gradient Background with Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-secondary/30 to-primary/30 -z-10" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />
      
      {/* Profile Header */}
      <section className="relative w-full overflow-x-hidden">
        {/* Cover Photo Banner */}
        {user.coverPhoto && (
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={user.coverPhoto}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-secondary/50"></div>
          </div>
        )}
        
        <div className={`max-w-4xl mx-auto px-4 ${user.coverPhoto ? '-mt-16' : 'py-6'} w-full`}>
          <div className="flex flex-col items-center space-y-4">
            {/* Profile Image with Neon Border */}
            <div className="relative">
              <ProfileImageViewer 
                imageUrl={user.image || '/placeholder-avatar.png'}
                userName={user.name}
              />
              {user.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-full p-1.5 shadow-lg border-2 border-white z-10">
                  <Star className="w-4 h-4 fill-current text-yellow-600" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex flex-col items-center space-y-2 w-full max-w-md mx-auto px-2">
              {/* Name */}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                {user.name}
              </h1>

              {/* Location */}
              {user.location && (
                <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 text-xs">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{user.location}</span>
                </div>
              )}

              {/* Hashtags */}
              {hashtags.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                  {hashtags.map((tag: string, idx: number) => (
                    <span key={idx}>{tag}</span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-1 w-full justify-center flex-wrap px-2">
                <ProfileActions
                  isOwnProfile={isOwnProfile}
                  userId={user.id}
                  userName={user.name}
                />
              </div>

              {/* Stats Cards */}
              <div className={`grid ${statsCols} gap-2 w-full mt-4 px-2`}>
                <div className="rounded-md bg-card dark:bg-secondary/40 border border-primary/30 shadow-sm shadow-primary/10 px-1 py-2 backdrop-blur-sm min-w-0">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{user.stats.posts}</p>
                    <p className="text-[9px] text-muted-foreground font-medium">Posts</p>
                  </div>
                </div>
                <div className="rounded-md bg-card dark:bg-secondary/40 border border-primary/30 shadow-sm shadow-primary/10 px-1 py-2 backdrop-blur-sm min-w-0">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{user.stats.followers}</p>
                    <p className="text-[9px] text-muted-foreground font-medium">Followers</p>
                  </div>
                </div>
                <div className="rounded-md bg-card dark:bg-secondary/40 border border-primary/30 shadow-sm shadow-primary/10 px-1 py-2 backdrop-blur-sm min-w-0">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{user.stats.following}</p>
                    <p className="text-[9px] text-muted-foreground font-medium">Following</p>
                  </div>
                </div>
                {user.role === 'HOST' && (
                  <div className="rounded-md bg-card dark:bg-secondary/40 border border-primary/30 shadow-sm shadow-primary/10 px-1 py-2 backdrop-blur-sm min-w-0">
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{user.stats.properties}</p>
                      <p className="text-[9px] text-muted-foreground font-medium whitespace-nowrap">Properties</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Wallet Button */}
              {isOwnProfile && (
                <div className="w-full mt-4 px-2">
                  <WalletDialog userRole={user.role} userName={user.name} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="max-w-4xl mx-auto px-4 py-4 w-full overflow-x-hidden">
        <ProfileTabs
          posts={posts}
          properties={propertiesRaw || []}
          userComments={userComments}
          userRole={user.role}
          isOwnProfile={isOwnProfile}
          userName={user.name}
          influencerProfile={influencerProfile}
        />
      </section>
    </div>
  )
}
