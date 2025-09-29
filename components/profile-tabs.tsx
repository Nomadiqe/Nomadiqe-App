"use client"

import { useState } from 'react'
import { PostCard } from '@/components/post-card'
import { Camera, Home, Image, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ProfileTabsProps {
  posts: any[]
  userRole: string
  isOwnProfile: boolean
  userName: string
}

export function ProfileTabs({ posts, userRole, isOwnProfile, userName }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'properties' | 'photos' | 'reviews'>('posts')

  const tabs = [
    { id: 'posts', label: 'Posts' },
    ...(userRole === 'HOST' ? [{ id: 'properties', label: 'Properties' }] : []),
    { id: 'photos', label: 'Photos' },
    { id: 'reviews', label: 'Reviews' }
  ]

  return (
    <>
      <div className="border-b border-border mb-8">
        <div className="flex items-center space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 font-medium transition-all ${
                activeTab === tab.id
                  ? 'border-b-2 border-nomadiqe-500 text-nomadiqe-500'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {activeTab === 'posts' && (
          <>
            {posts.map((post: any) => (
              <PostCard key={post.id} {...post} />
            ))}

            {posts.length === 0 && (
              <div className="text-center py-12">
                <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium text-foreground mb-2">No posts yet</h3>
                <p className="text-muted-foreground">
                  {isOwnProfile ? 'Share your first travel experience!' : `${userName} hasn't shared any posts yet.`}
                </p>
                {isOwnProfile && (
                  <Button asChild className="mt-4 bg-nomadiqe-600 hover:bg-nomadiqe-700">
                    <Link href="/create-post">
                      Create Your First Post
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === 'properties' && (
          <div className="text-center py-12">
            <Home className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">No properties listed</h3>
            <p className="text-muted-foreground">
              {isOwnProfile ? 'List your first property to start hosting!' : `${userName} hasn't listed any properties yet.`}
            </p>
            {isOwnProfile && (
              <Button asChild className="mt-4 bg-nomadiqe-600 hover:bg-nomadiqe-700">
                <Link href="/host/create-property">
                  List Your Property
                </Link>
              </Button>
            )}
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="text-center py-12">
            <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">No photos yet</h3>
            <p className="text-muted-foreground">
              {isOwnProfile ? 'Share photos from your travels!' : `${userName} hasn't shared any photos yet.`}
            </p>
            {isOwnProfile && (
              <Button asChild className="mt-4 bg-nomadiqe-600 hover:bg-nomadiqe-700">
                <Link href="/create-post">
                  Upload Photos
                </Link>
              </Button>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="text-center py-12">
            <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">No reviews yet</h3>
            <p className="text-muted-foreground">
              {isOwnProfile ? 'Reviews from your stays will appear here.' : `${userName} hasn't received any reviews yet.`}
            </p>
          </div>
        )}
      </div>
    </>
  )
}