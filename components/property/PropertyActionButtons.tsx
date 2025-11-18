"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Heart, Share2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

interface PropertyActionButtonsProps {
  propertyId: string
  propertyTitle: string
  propertyUrl?: string
}

export function PropertyActionButtons({
  propertyId,
  propertyTitle,
  propertyUrl
}: PropertyActionButtonsProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const handleShare = async () => {
    const url = propertyUrl || `${window.location.origin}/property/${propertyId}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: propertyTitle,
          url: url,
        })
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard(url)
        }
      }
    } else {
      copyToClipboard(url)
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "Link copiato!",
      description: "Il link della proprietà è stato copiato negli appunti.",
    })
  }

  const handleSave = async () => {
    setIsLoading(true)

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Accedi per salvare",
          description: "Devi effettuare l'accesso per salvare questa proprietà.",
          variant: "destructive",
        })
        router.push('/auth/signin')
        return
      }

      // TODO: Implement favorites/wishlist functionality
      // For now, just toggle the state and show a message
      setIsSaved(!isSaved)

      toast({
        title: isSaved ? "Rimosso dai preferiti" : "Salvato nei preferiti",
        description: isSaved
          ? "La proprietà è stata rimossa dai tuoi preferiti."
          : "La proprietà è stata aggiunta ai tuoi preferiti.",
      })

    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile salvare la proprietà. Riprova.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSave}
        disabled={isLoading}
      >
        <Heart
          className={`w-4 h-4 mr-2 ${isSaved ? 'fill-red-500 text-red-500' : ''}`}
        />
        Save
      </Button>
    </div>
  )
}
