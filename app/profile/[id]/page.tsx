import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/post-card'
import { PropertyCard } from '@/components/property-card'
import { 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  Users, 
  UserPlus,
  MessageCircle,
  Star,
  Home,
  Camera,
  Settings
} from 'lucide-react'

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  // Mock data - in real app, this would come from the database based on params.id
  const user = {
    id: params.id,
    name: 'Alex Johnson',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Digital nomad and adventure seeker. Love exploring new cultures and sharing travel experiences.',
    location: 'Currently in Europe',
    phone: '+1 555 123 4567',
    email: 'alex@example.com',
    role: 'TRAVELER',
    joinedDate: '2023-06-15',
    isVerified: true,
    stats: {
      posts: 24,
      followers: 186,
      following: 92,
      properties: 0
    }
  }

  const posts = [
    {
      id: '1',
      content: 'Just had the most incredible stay at this mountain cabin! The views were absolutely breathtaking and the fresh Alpine air was exactly what I needed. Thanks @Marco for being such an amazing host! 🏔️',
      images: [
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      location: 'Zermatt, Switzerland',
      createdAt: '2024-01-15T10:30:00Z',
      author: user,
      property: {
        id: 'prop1',
        title: 'Cozy Mountain Cabin'
      },
      likes: 24,
      comments: 5,
      isLiked: false
    },
    {
      id: '2',
      content: 'Amazing weekend in Prague! The architecture here is absolutely stunning and the local food scene is incredible. Already planning my next visit! 🏰',
      images: [
        'https://images.unsplash.com/photo-1541849546-216549ae216d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      location: 'Prague, Czech Republic',
      createdAt: '2024-01-10T14:20:00Z',
      author: user,
      likes: 31,
      comments: 8,
      isLiked: true
    }
  ]

  const isOwnProfile = true // In real app, check if current user is viewing their own profile

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
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Edit Profile</span>
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
