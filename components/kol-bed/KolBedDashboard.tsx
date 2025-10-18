"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SocialLinks } from '@/components/social-icons'
import { Separator } from '@/components/ui/separator'
import { 
  MessageSquare, 
  Users, 
  Calendar, 
  MapPin, 
  ExternalLink,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Star
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Message {
  id: string
  message: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED'
  createdAt: string
  sender: {
    id: string
    name: string
    fullName: string
    image?: string
    profilePictureUrl?: string
    influencerProfile?: {
      contentNiches: string[]
      portfolioUrl?: string
    }
    socialConnections: Array<{
      platform: string
      username?: string
      followerCount?: number
      isPrimary: boolean
    }>
  }
  property?: {
    id: string
    title: string
    images: string[]
  }
}

interface Creator {
  id: string
  name: string
  fullName: string
  image?: string
  profilePictureUrl?: string
  influencerProfile?: {
    contentNiches: string[]
    portfolioUrl?: string
  }
  socialConnections: Array<{
    platform: string
    username?: string
    followerCount?: number
    isPrimary: boolean
  }>
}

interface Property {
  id: string
  title: string
  images: string[]
  city: string
  country: string
}

interface KolBedDashboardProps {
  messages: Message[]
  availableCreators: Creator[]
  properties: Property[]
  hostId: string
}

export function KolBedDashboard({ messages, availableCreators, properties, hostId }: KolBedDashboardProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'ACCEPTED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getTotalFollowers = (socialConnections: any[]) => {
    return socialConnections.reduce((total, connection) => {
      return total + (connection.followerCount || 0)
    }, 0)
  }

  const handleMessageAction = async (messageId: string, action: 'ACCEPTED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/kol-bed/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }),
      })

      if (response.ok) {
        // Refresh the page or update state
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating message status:', error)
    }
  }

  return (
    <Tabs defaultValue="messages" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="messages" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Messages ({messages.length})
        </TabsTrigger>
        <TabsTrigger value="creators" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Available Creators ({availableCreators.length})
        </TabsTrigger>
        <TabsTrigger value="properties" className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          My Properties ({properties.length})
        </TabsTrigger>
      </TabsList>

      {/* Messages Tab */}
      <TabsContent value="messages" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Collaboration Requests
              </CardTitle>
              <CardDescription>
                Messages from creators interested in your properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Messages Yet</h3>
                  <p className="text-muted-foreground">
                    When creators reach out about your properties, their messages will appear here.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedMessage?.id === message.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={message.sender.image || message.sender.profilePictureUrl} />
                        <AvatarFallback>
                          {message.sender.name?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold truncate">
                            {message.sender.fullName || message.sender.name}
                          </h4>
                          <Badge className={getStatusColor(message.status)}>
                            {message.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {message.message}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                          </span>
                          {message.property && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {message.property.title}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Message Detail */}
          <Card>
            <CardHeader>
              <CardTitle>Message Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMessage ? (
                <div className="space-y-6">
                  {/* Creator Info */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedMessage.sender.image || selectedMessage.sender.profilePictureUrl} />
                      <AvatarFallback>
                        {selectedMessage.sender.name?.charAt(0) || 'C'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {selectedMessage.sender.fullName || selectedMessage.sender.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(selectedMessage.status)}>
                          {selectedMessage.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {getTotalFollowers(selectedMessage.sender.socialConnections).toLocaleString()} total followers
                        </span>
                      </div>
                      <SocialLinks 
                        socialConnections={selectedMessage.sender.socialConnections} 
                        size="sm" 
                        showCount={true}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Message Content */}
                  <div>
                    <h4 className="font-semibold mb-2">Message</h4>
                    <p className="text-sm leading-relaxed">{selectedMessage.message}</p>
                  </div>

                  {/* Property Info */}
                  {selectedMessage.property && (
                    <div>
                      <h4 className="font-semibold mb-2">Property</h4>
                      <div className="flex items-center gap-3">
                        {selectedMessage.property.images[0] && (
                          <img
                            src={selectedMessage.property.images[0]}
                            alt={selectedMessage.property.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{selectedMessage.property.title}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {selectedMessage.status === 'PENDING' && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleMessageAction(selectedMessage.id, 'ACCEPTED')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleMessageAction(selectedMessage.id, 'REJECTED')}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a message to view details and take action.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Available Creators Tab */}
      <TabsContent value="creators" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Available Creators
            </CardTitle>
            <CardDescription>
              Discover influencers who can promote your properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCreators.map((creator) => (
                <Card key={creator.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={creator.image || creator.profilePictureUrl} />
                        <AvatarFallback>
                          {creator.name?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {creator.fullName || creator.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {getTotalFollowers(creator.socialConnections).toLocaleString()} followers
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <SocialLinks 
                        socialConnections={creator.socialConnections} 
                        size="sm" 
                        showCount={true}
                      />

                      {creator.influencerProfile?.contentNiches && (
                        <div>
                          <p className="text-sm font-medium mb-1">Content Niches:</p>
                          <div className="flex flex-wrap gap-1">
                            {creator.influencerProfile.contentNiches.map((niche, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {niche}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Send className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                        {creator.influencerProfile?.portfolioUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={creator.influencerProfile.portfolioUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Properties Tab */}
      <TabsContent value="properties" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Your Properties
            </CardTitle>
            <CardDescription>
              Properties available for creator collaborations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Card key={property.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {property.images[0] && (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold mb-1">{property.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {property.city}, {property.country}
                        </p>
                      </div>
                      <Button size="sm" className="w-full">
                        Share with Creators
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
