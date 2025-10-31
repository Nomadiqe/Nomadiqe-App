'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { 
  Search, 
  MessageCircle, 
  Instagram, 
  Youtube, 
  Music,
  CheckCircle,
  Sparkles,
  Users,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Influencer {
  id: string
  name: string
  username: string | null
  image: string | null
  bio: string | null
  location: string | null
  contentNiches: string[]
  verificationStatus: string
  portfolioUrl: string | null
  totalFollowers: number
  primaryPlatform: string | null
  primaryUsername: string | null
  socialConnections: Array<{
    platform: string
    username: string | null
    followerCount: number | null
    isPrimary: boolean
  }>
}

export function FindInfluencersView() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [filteredInfluencers, setFilteredInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null)
  const [messageContent, setMessageContent] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchInfluencers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredInfluencers(influencers)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = influencers.filter(influencer =>
        influencer.name.toLowerCase().includes(query) ||
        influencer.username?.toLowerCase().includes(query) ||
        influencer.bio?.toLowerCase().includes(query) ||
        influencer.contentNiches.some(niche => niche.toLowerCase().includes(query))
      )
      setFilteredInfluencers(filtered)
    }
  }, [searchQuery, influencers])

  const fetchInfluencers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/influencers/list')
      if (!response.ok) throw new Error('Failed to fetch influencers')
      const data = await response.json()
      setInfluencers(data.influencers)
      setFilteredInfluencers(data.influencers)
    } catch (error) {
      console.error('Error fetching influencers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenMessageDialog = (influencer: Influencer) => {
    setSelectedInfluencer(influencer)
    setMessageContent('')
    setMessageDialogOpen(true)
  }

  const handleSendMessage = async () => {
    if (!selectedInfluencer || !messageContent.trim()) return

    try {
      setSending(true)
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: selectedInfluencer.id,
          content: messageContent,
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      // Close dialog and reset
      setMessageDialogOpen(false)
      setSelectedInfluencer(null)
      setMessageContent('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Errore durante l\'invio del messaggio')
    } finally {
      setSending(false)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'INSTAGRAM':
        return <Instagram className="h-4 w-4" />
      case 'YOUTUBE':
        return <Youtube className="h-4 w-4" />
      case 'TIKTOK':
        return <Music className="h-4 w-4" />
      default:
        return null
    }
  }

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <p className="text-muted-foreground">Caricamento influencer...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
            Find Influencers
          </h1>
          <p className="text-muted-foreground">
            Connettiti con creator di contenuti per promuovere le tue proprietà
          </p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca per nome, username, bio o nicchia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {filteredInfluencers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInfluencers.map((influencer) => (
              <Card key={influencer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={influencer.image || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                        {influencer.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg font-bold truncate" style={{ fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
                          {influencer.name}
                        </CardTitle>
                        {influencer.verificationStatus === 'VERIFIED' && (
                          <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-2 mb-2">
                        {influencer.primaryPlatform && getPlatformIcon(influencer.primaryPlatform)}
                        {influencer.primaryUsername && <span>@{influencer.primaryUsername}</span>}
                      </CardDescription>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">
                          {formatFollowers(influencer.totalFollowers)} followers
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {influencer.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{influencer.bio}</p>
                  )}

                  {influencer.contentNiches.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {influencer.contentNiches.slice(0, 3).map((niche, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {niche}
                        </Badge>
                      ))}
                      {influencer.contentNiches.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{influencer.contentNiches.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <Button 
                    className="w-full gap-2" 
                    onClick={() => handleOpenMessageDialog(influencer)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Invia Messaggio
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Sparkles className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nessun influencer trovato</h3>
              <p className="text-sm text-muted-foreground text-center">
                {searchQuery ? 'Prova a modificare i termini di ricerca' : 'Nessun influencer disponibile al momento'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Message Dialog */}
        <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Invia Messaggio</DialogTitle>
              <DialogDescription>
                Scrivi un messaggio a {selectedInfluencer?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedInfluencer && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedInfluencer.image || undefined} />
                    <AvatarFallback>
                      {selectedInfluencer.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedInfluencer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFollowers(selectedInfluencer.totalFollowers)} followers
                    </p>
                  </div>
                </div>
              )}
              <Textarea
                placeholder="Scrivi il tuo messaggio..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
                Annulla
              </Button>
              <Button 
                onClick={handleSendMessage} 
                disabled={sending || !messageContent.trim()}
              >
                {sending ? 'Invio...' : 'Invia'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
