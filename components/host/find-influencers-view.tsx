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
      <div className="min-h-screen relative overflow-hidden pb-20">
        {/* Modern Gradient Background with Glow Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-300/30 via-purple-400/40 to-purple-600/50 -z-10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl -z-10" />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Caricamento creatori KOL&BED...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      {/* Modern Gradient Background with Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-300/30 via-purple-400/40 to-purple-600/50 -z-10" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-8 h-8 text-pink-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            KOL&BED Creators
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Scopri i creatori digitali che hanno aderito al programma KOL&BED. Offrili soggiorni gratuiti in cambio di contenuti promozionali esclusivi su Nomadiqe.
          </p>
        </div>

        {/* Search */}
        <Card className="mb-6 bg-gray-800/90 border border-blue-400/30 shadow-lg shadow-blue-500/20 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cerca per nome, username, bio o nicchia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {filteredInfluencers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInfluencers.map((influencer) => (
              <Card key={influencer.id} className="bg-gray-800/90 border border-blue-400/30 shadow-lg shadow-blue-500/20 backdrop-blur-sm hover:border-blue-400/50 transition-all">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 border-2 border-pink-500/50">
                      <AvatarImage src={influencer.image || undefined} />
                      <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xl">
                        {influencer.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg font-bold truncate text-white">
                          {influencer.name}
                        </CardTitle>
                        {influencer.verificationStatus === 'VERIFIED' && (
                          <CheckCircle className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                        )}
                      </div>
                      {influencer.username && (
                        <p className="text-xs text-gray-400 mb-2">@{influencer.username}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-pink-400" />
                        <span className="font-semibold text-white">
                          {formatFollowers(influencer.totalFollowers)}
                        </span>
                        <span className="text-gray-400 text-xs">followers</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {influencer.bio && (
                    <p className="text-sm text-gray-300 line-clamp-2">{influencer.bio}</p>
                  )}

                  {influencer.contentNiches.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {influencer.contentNiches.slice(0, 3).map((niche, index) => (
                        <Badge key={index} className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs">
                          {niche}
                        </Badge>
                      ))}
                      {influencer.contentNiches.length > 3 && (
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs">
                          +{influencer.contentNiches.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Social Connections */}
                  {influencer.socialConnections.length > 0 && (
                    <div className="bg-gray-700/50 rounded-lg p-3 space-y-2">
                      <p className="text-xs text-gray-400 font-medium mb-2">Connected Platforms:</p>
                      <div className="space-y-1.5">
                        {influencer.socialConnections.map((social, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              {getPlatformIcon(social.platform)}
                              <span className="text-gray-300 capitalize">{social.platform.toLowerCase()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {social.username && (
                                <span className="text-gray-400">@{social.username}</span>
                              )}
                              {social.followerCount && (
                                <Badge className="bg-blue-500/20 text-blue-300 text-[10px] px-1.5 py-0">
                                  {formatFollowers(social.followerCount)}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium shadow-lg hover:shadow-xl" 
                    onClick={() => handleOpenMessageDialog(influencer)}
                  >
                    <Sparkles className="h-4 w-4" />
                    KOL&BED Request
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-800/90 border border-blue-400/30 shadow-lg shadow-blue-500/20 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Sparkles className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">Nessun creatore trovato</h3>
              <p className="text-sm text-gray-300 text-center">
                {searchQuery ? 'Prova a modificare i termini di ricerca' : 'Nessun creatore KOL&BED disponibile al momento'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* KOL&BED Request Dialog */}
        <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-gray-800/95 border border-blue-400/30 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                Richiesta Collaborazione KOL&BED
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Invia una proposta di collaborazione a {selectedInfluencer?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedInfluencer && (
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-400/20">
                  <Avatar className="h-12 w-12 border-2 border-pink-500/50">
                    <AvatarImage src={selectedInfluencer.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                      {selectedInfluencer.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-white">{selectedInfluencer.name}</p>
                    <p className="text-sm text-gray-300">
                      {formatFollowers(selectedInfluencer.totalFollowers)} followers
                    </p>
                    {selectedInfluencer.socialConnections.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        {selectedInfluencer.socialConnections.map((social, idx) => (
                          <span key={idx} className="text-gray-400">
                            {getPlatformIcon(social.platform)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
                <p className="text-xs text-gray-300 leading-relaxed">
                  ⚠️ <strong className="text-white">Importante:</strong> Il creatore dovrà promuovere la tua proprietà ESCLUSIVAMENTE tramite il link Nomadiqe. Ogni contenuto deve includere il link alla tua struttura sull&apos;app.
                </p>
              </div>
              <Textarea
                placeholder="Descrivi la tua proposta di collaborazione KOL&BED (es. date del soggiorno, tipo di contenuto richiesto, etc.)..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={6}
                className="resize-none bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setMessageDialogOpen(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              >
                Annulla
              </Button>
              <Button 
                onClick={handleSendMessage} 
                disabled={sending || !messageContent.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              >
                {sending ? 'Invio...' : 'Invia Richiesta'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
