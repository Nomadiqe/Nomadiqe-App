'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Calendar } from 'lucide-react'

interface ComingSoonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
}

export function ComingSoonDialog({ 
  open, 
  onOpenChange,
  title = 'Coming Soon',
  description = 'Questa funzionalità sarà presto disponibile. Resta sintonizzato!'
}: ComingSoonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-0 shadow-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold" style={{ fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground/80 pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
