'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SingleImageUpload } from '@/components/ui/single-image-upload'
import { useToast } from '@/hooks/use-toast'

type EditableUser = {
  id: string
  email: string
  name?: string | null
  fullName?: string | null
  username?: string | null
  image?: string | null
  profilePictureUrl?: string | null
  backgroundPictureUrl?: string | null
  bio?: string | null
  location?: string | null
  phone?: string | null
}

interface EditProfileFormProps {
  user: EditableUser
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const [fullName, setFullName] = useState<string>(user.fullName || user.name || '')
  const [username, setUsername] = useState<string>(user.username || '')
  const [bio, setBio] = useState<string>(user.bio || '')
  const [location, setLocation] = useState<string>(user.location || '')
  const [phone, setPhone] = useState<string>(user.phone || '')
  const [avatar, setAvatar] = useState<string | null>(user.profilePictureUrl || user.image || null)
  const [backgroundImage, setBackgroundImage] = useState<string | null>(user.backgroundPictureUrl || null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        const res = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName,
            username,
            bio,
            location,
            phone,
            profilePicture: avatar || undefined,
            backgroundPicture: backgroundImage || undefined,
          })
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to update profile')

        toast({ title: 'Profile updated' })
        router.push(`/profile/${user.id}`)
      } catch (err: any) {
        toast({ title: 'Update failed', description: err.message, variant: 'destructive' })
      }
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="max-w-3xl mx-auto px-4 py-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your profile information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="flex items-center gap-6">
                <SingleImageUpload
                  value={avatar || undefined}
                  onChange={(url) => setAvatar(url)}
                  variant="avatar"
                  size="xl"
                  placeholder="Upload avatar"
                />
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Full name</label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Username</label>
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Background Picture</label>
                <SingleImageUpload
                  value={backgroundImage || undefined}
                  onChange={(url) => setBackgroundImage(url)}
                  variant="cover"
                  size="lg"
                  placeholder="Upload background image"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell others about you"
                  className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Location</label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Phone</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>Cancel</Button>
                <Button type="submit" disabled={isPending} className="bg-nomadiqe-600 hover:bg-nomadiqe-700">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}


