'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Wallet, Calendar, Heart, MapPin, TrendingUp, Plus, Search, FileText, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import PointsDisplay from '@/components/points/PointsDisplay'
import DailyCheckIn from '@/components/points/DailyCheckIn'

interface WalletDialogProps {
  userRole: string
  userName: string
}

export function WalletDialog({ userRole, userName }: WalletDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isHost = userRole === 'HOST'
  const isTraveler = ['GUEST', 'TRAVELER'].includes(userRole)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full bg-accent hover:bg-accent/90 text-white rounded-lg px-4 py-2.5 font-bold transition-all shadow-sm hover:shadow-md"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Bentornato, {userName}!
          </DialogTitle>
          <p className="text-muted-foreground text-sm mt-2">
            {isHost ? 'Gestisci le tue proprietà e prenotazioni' : 'Scopri la tua prossima avventura'}
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Points and Daily Check-in */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-muted rounded-lg border border-border">
            <div className="flex items-center gap-3 flex-wrap">
              <PointsDisplay />
              <DailyCheckIn />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted border border-border rounded-lg p-4">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-primary" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-foreground/70">
                    {isHost ? 'Prenotazioni Attive' : 'Viaggi in Programma'}
                  </p>
                  <p className="text-xl font-bold text-foreground">0</p>
                </div>
              </div>
            </div>

            <div className="bg-muted border border-border rounded-lg p-4">
              <div className="flex items-center">
                <Heart className="h-6 w-6 text-primary" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-foreground/70">
                    {isHost ? 'Visualizzazioni Proprietà' : 'Proprietà Salvate'}
                  </p>
                  <p className="text-xl font-bold text-foreground">0</p>
                </div>
              </div>
            </div>

            <div className="bg-muted border border-border rounded-lg p-4">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 text-primary" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-foreground/70">
                    {isHost ? 'Proprietà Pubblicate' : 'Luoghi Visitati'}
                  </p>
                  <p className="text-xl font-bold text-foreground">0</p>
                </div>
              </div>
            </div>

            <div className="bg-muted border border-border rounded-lg p-4">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-primary" />
                <div className="ml-3">
                  <p className="text-xs font-medium text-foreground/70">
                    {isHost ? 'Guadagni Totali' : 'Totale Risparmiato'}
                  </p>
                  <p className="text-xl font-bold text-foreground">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-muted border border-border rounded-lg p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">Azioni Rapide</h2>
            <div className="space-y-3">
              {isTraveler && (
                <>
                  <Button 
                    asChild 
                    className="w-full justify-start bg-accent hover:bg-accent/90 text-white font-bold shadow-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/search">
                      <MapPin className="w-4 h-4 mr-2" />
                      Cerca Proprietà
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full justify-start border-primary text-primary hover:bg-primary/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/host">
                      <Plus className="w-4 h-4 mr-2" />
                      Diventa Host
                    </Link>
                  </Button>
                </>
              )}
              
              {isHost && (
                <>
                  <Button 
                    asChild 
                    className="w-full justify-start bg-accent hover:bg-accent/90 text-white font-bold shadow-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/host/create-property">
                      <Plus className="w-4 h-4 mr-2" />
                      Aggiungi Nuova Proprietà
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full justify-start border-primary text-primary hover:bg-primary/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/search">
                      <Search className="w-4 h-4 mr-2" />
                      Esplora Proprietà
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full justify-start border-border text-foreground hover:bg-muted"
                    onClick={() => setIsOpen(false)}
                  >
                    <a 
                      href="https://alloggiatiweb.poliziadistato.it/PortaleAlloggiati/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Alloggiati
                    </a>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full justify-start border-border text-foreground hover:bg-muted"
                    onClick={() => setIsOpen(false)}
                  >
                    <a 
                      href="https://osservatorioturistico.regione.sicilia.it/public/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Osservatorio
                    </a>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

