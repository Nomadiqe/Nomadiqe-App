'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, User, MapPin, Hash, Building, Sparkles, Send, ChevronDown, Trophy, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { BackButton } from '@/components/back-button'

export default function AISearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'all' | 'users' | 'places' | 'hashtags' | 'properties' | 'influencers'>('all')
  const [isSearching, setIsSearching] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState<{ question: string; answer: string } | null>(null)

  const searchCategories = [
    { type: 'all' as const, label: 'All', icon: Search },
    { type: 'users' as const, label: 'Users', icon: User },
    { type: 'places' as const, label: 'Places', icon: MapPin },
    { type: 'hashtags' as const, label: 'Hashtags', icon: Hash },
    { type: 'properties' as const, label: 'BnB', icon: Building },
    { type: 'influencers' as const, label: 'Creators', icon: Sparkles },
  ]

  const aiAnswers: { [key: string]: string } = {
    "How do I earn points on Nomadiqe?": "Puoi guadagnare punti su Nomadiqe in diversi modi:\n\n📝 Crea post (15 punti) - massimo 5 al giorno\n❤️ Metti like ai post (1 punto) - massimo 50 al giorno\n💬 Commenta i post (3 punti) - massimo 10 al giorno\n📅 Check-in giornaliero (10 punti base + bonus streak)\n✅ Completa il tuo profilo (20 punti) - una tantum\n🎯 Completa l'onboarding (75 punti) - una tantum\n📚 Prenota un alloggio (50 punti)\n⭐ Scrivi una recensione (25 punti)\n\nI punti possono essere riscattati per sconti, vantaggi premium e molto altro!",
    "Find luxury villas in Sicily": "Per trovare ville di lusso in Sicilia:\n\n1. Vai alla sezione 'Explore' (icona mondo 🌍)\n2. Inserisci 'Sicily' o 'Sicilia' nella barra di ricerca\n3. Applica i filtri:\n   - Property Type: Villa\n   - Price Range: €200+\n   - Rating: 4.5+ stars\n4. Usa la vista mappa per esplorare le diverse località\n\nLe migliori zone in Sicilia:\n🏖️ Taormina - Vista mare mozzafiato\n🌋 Etna - Ville con vista vulcano\n🏛️ Siracusa - Bellezze storiche\n🍇 Agrigento - Campagne e mare",
    "Show me top-rated hosts": "Per trovare i migliori host:\n\n1. Cerca nella barra 'Search' con @ seguito dal nome\n2. Filtra per utenti con il badge verificato ⭐\n3. Controlla le statistiche del profilo:\n   - Numero di proprietà\n   - Recensioni ricevute\n   - Follower e engagement\n\nI top host offrono:\n✓ Risposta rapida\n✓ Proprietà verificate\n✓ Esperienze uniche\n✓ Assistenza locale\n\nPuoi anche vedere i loro post per conoscere meglio il loro stile di hosting!",
    "What features does Nomadiqe offer?": "Nomadiqe offre diverse funzionalità:\n\n🏠 HOST MODE:\n- Lista proprietà (BnB, ville, appartamenti)\n- Gestione prenotazioni\n- Dashboard analytics\n- Programma KOL&BED per collaborazioni\n\n👤 GUEST MODE:\n- Cerca e prenota alloggi unici\n- Sistema punti e rewards\n- Check-in giornaliero\n- Feed social di esperienze\n\n✨ CREATOR MODE (KOL&BED):\n- Ricevi soggiorni gratuiti\n- Collabora con host\n- Crea contenuti per proprietà\n- Monetizza il tuo seguito\n\n📱 SOCIAL FEATURES:\n- Condividi post e foto\n- Commenta e interagisci\n- Messaggi privati\n- Segui altri viaggiatori",
    "Find influencers for collaboration": "🤝 PROGRAMMA KOL&BED\n\nCome funziona:\n1. Host offrono soggiorni GRATUITI ai creatori\n2. Creatori creano contenuti per le strutture\n3. REGOLA IMPORTANTE: Promozione SOLO tramite link Nomadiqe\n\n⚠️ REGOLE PER CREATORI:\n✓ Promuovi su tutti i social (IG, TikTok, YouTube, etc.)\n✓ USA SEMPRE il link Nomadiqe della proprietà\n✗ NON promuovere la struttura fuori dall'app\n✗ NON condividere link diretti della struttura\n\n💡 TROVARE CREATORI:\n1. Vai su 'Search' → filtro 'Creators'\n2. Controlla:\n   - Follower count\n   - Engagement rate\n   - Contenuti precedenti\n3. Contattali via messaggio\n\n🎯 VANTAGGI:\n- Visibilità organica\n- Promozione di Nomadiqe\n- Partnership verificate",
    "What is KOL&BED program?": "🌟 PROGRAMMA KOL&BED (Key Opinion Leaders & BED)\n\nIl cuore di Nomadiqe! Una collaborazione win-win:\n\n🏠 PER GLI HOST:\n- Offri soggiorni gratuiti ai creatori\n- Ricevi contenuti professionali\n- Aumenta la visibilità della tua proprietà\n- Attrai più prenotazioni\n\n✨ PER I CREATORI:\n- Soggiorni gratuiti in strutture uniche\n- Monetizza il tuo seguito\n- Crea contenuti autentici\n- Collaborazioni esclusive\n\n⚠️ REGOLA FONDAMENTALE:\nI creatori DEVONO promuovere SOLO tramite il link Nomadiqe della proprietà. È vietato promuovere la struttura al di fuori dell'app. Questo garantisce che ogni promozione porti beneficio sia alla proprietà che a Nomadiqe.\n\n📱 Social permessi:\nInstagram, TikTok, YouTube, LinkedIn, Facebook, Snapchat, X - ma sempre con link Nomadiqe!",
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    
    // Check if query matches a pre-defined answer
    const matchedAnswer = aiAnswers[searchQuery]
    
    if (matchedAnswer) {
      setTimeout(() => {
        setCurrentAnswer({ question: searchQuery, answer: matchedAnswer })
        setShowAnswer(true)
        setIsSearching(false)
      }, 800)
    } else {
      // Generic response for other queries
      setTimeout(() => {
        setCurrentAnswer({
          question: searchQuery,
          answer: "La tua richiesta è stata registrata! Al momento stiamo lavorando per espandere le capacità del nostro assistente AI. Nel frattempo, prova una delle domande suggerite oppure esplora l'app usando i filtri di ricerca.\n\nSe hai bisogno di aiuto specifico, contatta il nostro supporto dal menu principale."
        })
        setShowAnswer(true)
        setIsSearching(false)
      }, 800)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    handleSearchWithQuery(suggestion)
  }

  const handleSearchWithQuery = async (query: string) => {
    setIsSearching(true)
    const matchedAnswer = aiAnswers[query]
    
    setTimeout(() => {
      setCurrentAnswer({ 
        question: query, 
        answer: matchedAnswer || "Risposta in elaborazione..." 
      })
      setShowAnswer(true)
      setIsSearching(false)
    }, 800)
  }

  const aiSuggestions = [
    "What is KOL&BED program?",
    "How do I earn points on Nomadiqe?",
    "Find influencers for collaboration",
    "What features does Nomadiqe offer?",
    "Find luxury villas in Sicily",
  ]

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      {/* Modern Gradient Background with Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-300/30 via-purple-400/40 to-purple-600/50 -z-10" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-4">
          <BackButton />
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Search className="w-8 h-8 text-pink-500" />
            <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Search & Discover
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Find users, places, properties, or ask our AI assistant for help
          </p>
        </div>

        {/* Search Input */}
        <Card className="bg-gray-800/90 border border-blue-400/30 shadow-lg shadow-blue-500/20 backdrop-blur-sm mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search anything or ask AI for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
              />
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
              >
                {isSearching ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Answer Card - Dropdown */}
        {showAnswer && currentAnswer && (
          <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-cyan-400/40 shadow-lg shadow-cyan-500/20 backdrop-blur-sm mb-6 animate-in slide-in-from-top duration-500">
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
                    AI Assistant
                    <Badge className="bg-cyan-500 text-white text-[10px] px-2">BETA</Badge>
                  </h3>
                  <p className="text-xs text-gray-300 italic">&ldquo;{currentAnswer.question}&rdquo;</p>
                </div>
                <button
                  onClick={() => setShowAnswer(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronDown className="w-5 h-5 rotate-180" />
                </button>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 border border-blue-400/20">
                <div className="text-white text-sm whitespace-pre-line leading-relaxed">
                  {currentAnswer.answer}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-600">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                  onClick={() => {
                    setSearchQuery('')
                    setShowAnswer(false)
                  }}
                >
                  New Search
                </Button>
                <span className="text-xs text-gray-400 ml-auto">Powered by Nomadiqe AI</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Categories */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {searchCategories.map((category) => {
              const Icon = category.icon
              const isActive = searchType === category.type
              return (
                <Button
                  key={category.type}
                  onClick={() => setSearchType(category.type)}
                  variant="outline"
                  size="sm"
                  className={`${
                    isActive
                      ? 'bg-pink-500 hover:bg-pink-600 text-white border-pink-500'
                      : 'bg-gray-800/90 border-blue-400/30 text-white hover:bg-gray-700/90'
                  } transition-all shadow-md`}
                >
                  <Icon className="w-3.5 h-3.5 mr-1.5" />
                  {category.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* AI Suggestions */}
        <Card className="bg-gray-800/90 border border-blue-400/30 shadow-lg shadow-blue-500/20 backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">AI Assistant Suggestions</h2>
            </div>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 text-white text-sm transition-all border border-gray-600 hover:border-blue-400/50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-gray-800/90 border border-blue-400/30 shadow-lg shadow-blue-500/20 backdrop-blur-sm mt-6">
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold text-white mb-3">How to use Nomadiqe</h2>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">KOL&BED Program</p>
                  <p className="text-gray-400 text-xs">Host offer free stays to creators who promote via Nomadiqe links only</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-pink-500/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Find Users</p>
                  <p className="text-gray-400 text-xs">Search by name or @username to connect with travelers and hosts</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Explore Places</p>
                  <p className="text-gray-400 text-xs">Discover destinations and unique stays around the world</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Hash className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Follow Hashtags</p>
                  <p className="text-gray-400 text-xs">Use #hashtags to find trending topics and communities</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Earn Points & Rewards</p>
                  <p className="text-gray-400 text-xs">Complete actions to earn points and unlock exclusive benefits</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

