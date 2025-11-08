"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ui/image-upload'
import { PropertySearch } from '@/components/ui/property-search'
import { useToast } from '@/hooks/use-toast'
import {
  MapPin,
  Image as ImageIcon,
  X,
  Home,
  ArrowLeft
} from 'lucide-react'

interface Property {
  id: string
  title: string
  location: string
}

export default function CreatePostPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [content, setContent] = useState('')
  const [location, setLocation] = useState('')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoadingProperties, setIsLoadingProperties] = useState(false)

  // Fetch properties from database
  useEffect(() => {
    const fetchProperties = async () => {
      if (!session?.user?.id) return

      setIsLoadingProperties(true)
      try {
        const response = await fetch('/api/properties')
        if (response.ok) {
          const data = await response.json()
          setProperties(data)
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setIsLoadingProperties(false)
      }
    }

    fetchProperties()
  }, [session?.user?.id])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user?.id) {
      toast({
        title: 'Errore',
        description: 'Devi effettuare l\'accesso per creare un post',
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
          propertyId: selectedProperty,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Impossibile creare il post')
      }

      toast({
        title: 'Successo',
        description: 'Il tuo post è stato condiviso!',
      })

      // Redirect to user's profile page
      router.push(`/profile/${session.user.id}`)
    } catch (error) {
      console.error('Error creating post:', error)
      toast({
        title: 'Errore',
        description: error instanceof Error ? error.message : 'Impossibile creare il post',
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
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Indietro</span>
            </Button>
            <h1 className="text-xl font-semibold">Crea Post</h1>
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
                A cosa stai pensando?
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Condividi la tua esperienza di viaggio, pensieri o scoperte..."
                className="w-full h-32 p-4 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-nomadiqe-500"
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Posizione (opzionale)</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Dove ti trovi?"
                className="w-full p-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-nomadiqe-500"
              />
            </div>

            {/* Property Link */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Collega una proprietà (opzionale)</span>
              </label>
              <PropertySearch
                properties={properties}
                value={selectedProperty}
                onChange={setSelectedProperty}
                disabled={isLoadingProperties}
                placeholder={isLoadingProperties ? 'Caricamento proprietà...' : 'Cerca proprietà...'}
              />
            </div>

            {/* Images */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                <ImageIcon className="w-4 h-4" />
                <span>Aggiungi foto</span>
              </label>
              
              <ImageUpload
                multiple={true}
                maxFiles={5}
                maxSizeInMB={10}
                placeholder="Clicca per caricare foto o trascina qui"
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
                Annulla
              </Button>
              <Button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="bg-nomadiqe-600 hover:bg-nomadiqe-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Pubblicazione...' : 'Condividi Post'}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-8 px-4 border-t border-border bg-card/50">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">Consigli per post fantastici</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Condividi le tue esperienze e sensazioni autentiche</p>
            <p>• Aggiungi foto di alta qualità per far risaltare il tuo post</p>
            <p>• Usa i tag di posizione per aiutare gli altri a scoprire luoghi</p>
            <p>• Collega le proprietà per dare contesto alla tua esperienza</p>
            <p>• Sii rispettoso e segui le linee guida della community</p>
          </div>
        </div>
      </section>
    </div>
  )
}
