"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/auth/password/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Request failed')
      toast({ title: 'Controlla la tua email', description: "Se un account esiste, riceverai un link di reset." })
      router.push('/auth/signin')
    } catch (err) {
      toast({ title: 'Errore', description: 'Impossibile elaborare la richiesta. Riprova più tardi.', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-2">Password dimenticata</h1>
          <p className="text-sm text-muted-foreground mb-6">Inserisci la tua email e ti invieremo un link per reimpostare la password.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Invio in corso...' : 'Invia link di reset'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <button 
              onClick={() => router.back()} 
              className="text-primary hover:underline cursor-pointer"
            >
              Indietro
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
