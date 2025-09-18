"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ui/image-upload'
import { 
  MapPin, 
  Image as ImageIcon, 
  X, 
  Home,
  ArrowLeft 
} from 'lucide-react'

export default function CreatePostPage() {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [location, setLocation] = useState('')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock properties for linking
  const userProperties = [
    { id: '1', title: 'Cozy Mountain Cabin', location: 'Zermatt, Switzerland' },
    { id: '2', title: 'City Loft', location: 'Barcelona, Spain' }
  ]


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In real app, submit to API
    console.log('Post submitted:', {
      content,
      location,
      images: uploadedImages,
      selectedProperty
    })

    setIsSubmitting(false)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-card border-b border-border py-4">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.back()}
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

            {/* Property Link */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Link a property (optional)</span>
              </label>
              <select
                value={selectedProperty || ''}
                onChange={(e) => setSelectedProperty(e.target.value || null)}
                className="w-full p-3 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-nomadiqe-500"
              >
                <option value="">Select a property...</option>
                {userProperties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.title} - {property.location}
                  </option>
                ))}
              </select>
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
                onClick={() => router.back()}
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
