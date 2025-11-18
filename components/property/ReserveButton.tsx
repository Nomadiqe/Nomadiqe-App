"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

interface ReserveButtonProps {
  propertyId: string
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
}

export function ReserveButton({
  propertyId,
  className,
  size = "lg"
}: ReserveButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleReserve = async () => {
    setIsLoading(true)

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Accedi per prenotare",
          description: "Devi effettuare l'accesso per prenotare questa proprietà.",
        })
        router.push('/auth/signin')
        return
      }

      // TODO: Once booking system is implemented, redirect to booking page
      // For now, show a placeholder message
      toast({
        title: "Sistema di prenotazione in arrivo",
        description: "La funzionalità di prenotazione sarà disponibile a breve.",
      })

      // When booking system is ready, use this:
      // router.push(`/booking/${propertyId}`)

    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile avviare la prenotazione. Riprova.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      className={className}
      size={size}
      onClick={handleReserve}
      disabled={isLoading}
    >
      {isLoading ? 'Caricamento...' : 'Reserve'}
    </Button>
  )
}
