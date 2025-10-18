"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ui/image-upload'
import { useToast } from '@/hooks/use-toast'
import {
  MapPin,
  Image as ImageIcon,
  X,
  ArrowLeft
} from 'lucide-react'


export default function CreatePostPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [content, setContent] = useState('')
  const [location, setLocation] = useState('')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user?.id) {
      toast({
        title: 'Error',
        description: 'You must be signed in to create a post',
        variant: 'destructive',
      })
      router.push('/auth/signin')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          location,
          images: uploadedImages,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post')
      }

      toast({
        title: 'Success',
        description: 'Your post has been shared!',
      })

      // Redirect to user's profile page
      router.push(`/profile/${session.user.id}`)
    } catch (error) {
      console.error('Error creating post:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create post',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-card border-b border-border py-4">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <h1 className="text-xl font-semibold">Create Post</h1>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>
      </section>

      {/* Create Post Form */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                What&#39;s on your mind?
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your travel experience, thoughts, or discoveries..."
                className="w-full h-32 p-4 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-nomadiqe-500"
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Location (optional)</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where are you?"
                className="w-full p-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-nomadiqe-500"
              />
            </div>


            {/* Images */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                <ImageIcon className="w-4 h-4" />
                <span>Add photos</span>
              </label>
              
              <ImageUpload
                multiple={true}
                maxFiles={5}
                maxSizeInMB={10}
                placeholder="Click to upload photos or drag and drop"
                onUploadComplete={(images) => {
                  const urls = images.map(img => img.url)
                  setUploadedImages(prev => [...prev, ...urls])
                }}
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="bg-nomadiqe-600 hover:bg-nomadiqe-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Posting...' : 'Share Post'}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-8 px-4 border-t border-border bg-card/50">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">Tips for great posts</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Share your genuine experiences and feelings</p>
            <p>• Add high-quality photos to make your post stand out</p>
            <p>• Use location tags to help others discover places</p>
            <p>• Link properties to give context to your experience</p>
            <p>• Be respectful and follow community guidelines</p>
          </div>
        </div>
      </section>
    </div>
  )
}
