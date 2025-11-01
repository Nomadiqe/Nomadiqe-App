'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ShareCommentCardProps {
  isOpen: boolean
  onClose: () => void
  onSend: (message: string) => void
  selectedUser: {
    id: string
    name?: string
    fullName?: string
    username?: string
    image?: string
    profilePictureUrl?: string
  }
  post: {
    id: string
    content: string
    images: string[]
  }
}

export function ShareCommentCard({
  isOpen,
  onClose,
  onSend,
  selectedUser,
  post,
}: ShareCommentCardProps) {
  const [comment, setComment] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSendClick = async () => {
    setIsSending(true)
    await onSend(comment)
    setIsSending(false)
    setComment('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Condividi Post con {selectedUser.fullName || selectedUser.name || selectedUser.username || 'Utente'}</DialogTitle>
          <DialogDescription>
            Aggiungi un messaggio personale da inviare insieme a questo post.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedUser.image || selectedUser.profilePictureUrl} alt={selectedUser.fullName || selectedUser.name || selectedUser.username || 'User'} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {(selectedUser.fullName || selectedUser.name || selectedUser.username || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{selectedUser.fullName || selectedUser.name || selectedUser.username || 'User'}</p>
              {selectedUser.username && (selectedUser.fullName || selectedUser.name) && <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>}
            </div>
          </div>
          <div className="border rounded-md p-3 bg-muted/20">
            <p className="text-sm font-medium line-clamp-2">{post.content}</p>
            {post.images && post.images.length > 0 && (
              <img src={post.images[0]} alt="Post image" className="mt-2 rounded-md max-h-24 object-cover w-full" />
            )}
          </div>
          <Textarea
            placeholder="Aggiungi il tuo commento o pensiero..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annulla
          </Button>
          <Button onClick={handleSendClick} disabled={isSending || comment.trim() === ''}>
            {isSending ? 'Invio...' : 'Invia Messaggio'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

