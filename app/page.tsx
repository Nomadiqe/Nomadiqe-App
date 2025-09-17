import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/post-card'
import { AdCard } from '@/components/ad-card'
import { Plus, Users, TrendingUp } from 'lucide-react'

export default function HomePage() {
  // Mock data - in real app, this would come from the database
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
      author: {
        id: 'user1',
        name: 'Alex Johnson',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
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
      content: 'Barcelona never fails to amaze me! From the stunning architecture to the vibrant street life, this city has my heart. Currently exploring the Gothic Quarter and discovering hidden gems around every corner. 🏛️✨',
      images: [
        'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      location: 'Barcelona, Spain',
      createdAt: '2024-01-14T16:45:00Z',
      author: {
        id: 'user2',
        name: 'Sophie Chen',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b332c7e0?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      likes: 18,
      comments: 3,
      isLiked: true
    }
  ]

  const ads = [
    {
      id: 'ad1',
      title: 'Featured: Alpine Mountain Cabin',
      description: 'Experience the Swiss Alps like never before! Book now for 20% off your first stay.',
      images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      property: {
        id: 'prop1',
        title: 'Cozy Mountain Cabin',
        city: 'Zermatt',
        country: 'Switzerland',
        price: 120,
        currency: 'EUR',
        maxGuests: 4,
        bedrooms: 2
      }
    },
    {
      id: 'ad2',
      title: 'Paradise Found: Bali Villa',
      description: 'Escape to tropical bliss with private beach access and luxury amenities.',
      images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      property: {
        id: 'prop3',
        title: 'Beachfront Villa',
        city: 'Ubud',
        country: 'Bali',
        price: 200,
        currency: 'EUR',
        maxGuests: 6,
        bedrooms: 3
      }
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-card border-b border-border py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome to Nomadiqe</h1>
              <p className="text-muted-foreground">Connect, explore, and share your travel experiences</p>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/create-post" className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Post</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      {/* <section className="py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-nomadiqe-500" />
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-sm text-muted-foreground">Active travelers</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-nomadiqe-500" />
              <p className="text-2xl font-bold">3,891</p>
              <p className="text-sm text-muted-foreground">Properties shared</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="w-6 h-6 mx-auto mb-2 bg-gradient-to-br from-nomadiqe-500 to-nomadiqe-700 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">N</span>
              </div>
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-muted-foreground">Countries covered</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Main Feed */}
      <section className="py-6 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Render posts and ads mixed together */}
          <PostCard {...posts[0]} />
          
          <AdCard {...ads[0]} />
          
          <PostCard {...posts[1]} />
          
          {/* More posts would be loaded here */}
          <PostCard
            id="3"
            content="Sunset from our beachfront villa in Bali 🌅 There's something magical about the way the light dances on the water here. Grateful to share this slice of paradise with travelers from around the world."
            images={[
              'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ]}
            location="Ubud, Bali"
            createdAt="2024-01-13T18:20:00Z"
            author={{
              id: 'user3',
              name: 'Raj Patel',
              image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
            }}
            property={{
              id: 'prop3',
              title: 'Beachfront Villa'
            }}
            likes={32}
            comments={8}
            isLiked={false}
          />

          <AdCard {...ads[1]} />

          <PostCard
            id="4"
            content="Photography tip of the day: Golden hour lighting makes every travel photo 10x better! 📸 Currently capturing the magic of European countryside and loving every moment of this nomadic lifestyle."
            images={[
              'https://images.unsplash.com/photo-1516680224141-86bc862537ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ]}
            location="Tuscany, Italy"
            createdAt="2024-01-12T14:15:00Z"
            author={{
              id: 'user4',
              name: 'Emma Wilson',
              image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
            }}
            likes={15}
            comments={2}
            isLiked={true}
          />

          {/* Load More */}
          <div className="text-center pt-8">
            <Button variant="outline" size="lg">
              Load More Posts
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Links Footer */}
      <section className="py-12 px-4 border-t border-border bg-card/50">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h3 className="text-xl font-semibold">New to Nomadiqe?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/about">Learn About Us</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/search">Find Properties</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/auth/signup">Join Community</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
