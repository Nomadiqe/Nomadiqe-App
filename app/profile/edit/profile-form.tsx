'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SingleImageUpload } from '@/components/ui/single-image-upload'
import { useToast } from '@/hooks/use-toast'
import { X } from 'lucide-react'

type EditableUser = {
  id: string
  email: string
  name?: string | null
  fullName?: string | null
  username?: string | null
  image?: string | null
  profilePictureUrl?: string | null
  coverPhotoUrl?: string | null
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
  const [coverPhoto, setCoverPhoto] = useState<string | null>(user.coverPhotoUrl || null)

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
            coverPhoto: coverPhoto || undefined,
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Modern Gradient Background with Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-300/30 via-purple-400/40 to-purple-600/50 -z-10" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl -z-10" />

      <section className="max-w-3xl mx-auto px-4 py-8 relative">
        <Card className="bg-gray-800/90 border border-blue-400/30 shadow-lg shadow-blue-500/20 backdrop-blur-sm rounded-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-white">Edit Profile</CardTitle>
            <CardDescription className="text-gray-300">Update your profile information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Cover Photo Upload */}
              <div>
                <label className="block text-sm text-gray-300 mb-2 font-medium">Cover Photo</label>
                <div className="relative">
                  {coverPhoto ? (
                    <div className="relative h-40 rounded-lg overflow-hidden border border-blue-400/30">
                      <img
                        src={coverPhoto}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setCoverPhoto(null)}
                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-40 rounded-lg border-2 border-dashed border-gray-600 bg-gray-700/30 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700/50 transition-all">
                      <SingleImageUpload
                        value={coverPhoto || undefined}
                        onChange={(url) => setCoverPhoto(url)}
                        variant="banner"
                        placeholder="Upload cover photo"
                        className="border-0"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Profile Picture with Neon Border */}
                <div className="relative mx-auto md:mx-0">
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 opacity-60 blur-xl"></div>
                  <div className="relative">
                    <div className="rounded-full p-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 [&>*]:border-0 [&>*]:rounded-full">
                      <SingleImageUpload
                        value={avatar || undefined}
                        onChange={(url) => setAvatar(url)}
                        variant="avatar"
                        size="xl"
                        placeholder="Upload avatar"
                        className="border-0"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-4 w-full md:w-auto">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2 font-medium">Full name</label>
                    <Input 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      placeholder="Your name"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2 font-medium">Username</label>
                    <Input 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      placeholder="username"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2 font-medium">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell others about you"
                  className="flex min-h-24 w-full rounded-md border border-gray-600 bg-gray-700/50 px-3 py-2 text-sm text-white placeholder:text-gray-400 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2 font-medium">Location</label>
                  <Input 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    placeholder="City, Country"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2 font-medium">Phone</label>
                  <Input 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="Phone number"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  onClick={() => router.back()} 
                  disabled={isPending}
                  className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-6 py-2 font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg px-6 py-2 font-medium transition-all shadow-lg hover:shadow-xl"
                >
                  {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}


