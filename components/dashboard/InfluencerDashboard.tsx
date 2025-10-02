'use client'

/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Instagram, 
  Music,
  Youtube,
  Users, 
  Star, 
  TrendingUp, 
  Plus, 
  Share2, 
  Camera, 
  Settings,
  Eye,
  Edit,
  MessageSquare,
  Gift,
  Copy,
  CheckCircle,
  Clock,
  MapPin,
  Heart,
  ExternalLink,
  Zap,
  Award,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

interface InfluencerDashboardProps {
  user: any // User with influencerProfile and socialConnections
}

export default function InfluencerDashboard({ user }: InfluencerDashboardProps) {
  const [copiedProfileLink, setCopiedProfileLink] = useState(false)
  const [appliedOpportunities, setAppliedOpportunities] = useState<string[]>([])
  
  const influencerProfile = user.influencerProfile
  const socialConnections = user.socialConnections || []
  
  // Real statistics from actual database data
  const stats = {
    socialAccounts: socialConnections.length,
    totalFollowers: socialConnections.reduce((acc: number, conn: any) => acc + (conn.followerCount || 0), 0),
    profileViews: 0, // Will be tracked when analytics are implemented
    contentPieces: 0, // Will count posts when content creation is linked
    monthlyGrowth: 0, // Will be calculated when historical data is available
    engagementRate: 0, // Will be calculated from post engagement metrics
    avgEngagement: 0, // Average engagement rate across all platforms
    completedProjects: 0 // Will count completed collaboration opportunities
  }

  // Real collaboration opportunities would come from database
  // For now, showing empty state until API integration
  const collaborationOpportunities: any[] = []

  // Real active collaborations from user data
  const activeCollaborations = user.collaborations?.filter((c: any) => c.status === 'active') || []

  const copyProfileLink = () => {
    navigator.clipboard.writeText(`https://nomadiqe.com/profile/${influencerProfile?.profileLink}`)
    setCopiedProfileLink(true)
    setTimeout(() => setCopiedProfileLink(false), 2000)
  }

  const handleApplyToOpportunity = (opportunityId: string, opportunityTitle: string) => {
    if (appliedOpportunities.includes(opportunityId)) {
      return
    }

    setAppliedOpportunities(prev => [...prev, opportunityId])

    // Show success feedback (in real app, this would be a toast notification)
    alert(`Application submitted for "${opportunityTitle}"! The host will review your profile and get back to you soon.`)

    // In real app, this would make an API call to submit the application
    console.log('Applied to opportunity:', opportunityId)
  }

  const handleViewOpportunity = (opportunityId: string) => {
    // In real app, this would navigate to a detailed view
    console.log('Viewing opportunity details:', opportunityId)
    alert('Opportunity details coming soon! This would show more information about the collaboration.')
  }

  const isNewInfluencer = !activeCollaborations.length

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return Instagram
      case 'tiktok': return Music
      case 'youtube': return Youtube
      default: return Camera
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome, {user.fullName || user.name}! ✨
              </h1>
              <p className="text-muted-foreground mt-1">
                {isNewInfluencer ? 'Your influencer profile is ready! Start exploring collaborations.' : 'Manage your collaborations and content'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                <Link href="/profile">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/influencer/browse-opportunities">
                  <Plus className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Find </span>Opportunities
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* New Influencer Welcome Banner */}
        {isNewInfluencer && (
          <Card className="mb-8 bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">🌟 Your Influencer Profile is Live!</h2>
                  <p className="text-purple-100 mb-4">
                    You're all set to start collaborating with amazing hosts worldwide.
                    Share your unique profile link to attract partnership opportunities.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center text-purple-100">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Profile Complete
                    </div>
                    <div className="flex items-center text-purple-100">
                      <Camera className="h-4 w-4 mr-2" />
                      {socialConnections.length} Platform{socialConnections.length > 1 ? 's' : ''} Connected
                    </div>
                    <div className="flex items-center text-purple-100">
                      <Gift className="h-4 w-4 mr-2" />
                      Ready for Collaborations
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <p className="text-xs text-purple-100 mb-1">Your Profile Link</p>
                    <p className="font-bold text-sm break-all">nomadiqe.com/profile/{influencerProfile?.profileLink}</p>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={copyProfileLink}
                      className="mt-2"
                    >
                      {copiedProfileLink ? 'Copied!' : 'Copy Link'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview - Only showing real data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected Platforms</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.socialAccounts}</div>
              <p className="text-xs text-muted-foreground">
                Social accounts linked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalFollowers > 0
                  ? stats.totalFollowers >= 1000
                    ? `${(stats.totalFollowers / 1000).toFixed(1)}K`
                    : stats.totalFollowers.toString()
                  : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all platforms
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.profileViews}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Content Created</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.contentPieces}</div>
              <p className="text-xs text-muted-foreground">
                Posts shared
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="opportunities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="collaborations">My Collaborations</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Collaboration Opportunities</h2>
                <p className="text-muted-foreground">Discover amazing properties looking for content creators</p>
              </div>
              <Button asChild>
                <Link href="/search">
                  <Eye className="h-4 w-4 mr-2" />
                  Browse All
                </Link>
              </Button>
            </div>

            {collaborationOpportunities.length > 0 ? (
              <div className="grid gap-6">
                {collaborationOpportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={opportunity.image}
                          alt={opportunity.property}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold mb-2">{opportunity.property}</h3>
                              <div className="flex items-center text-gray-600 mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="text-sm">{opportunity.location}</span>
                              </div>
                              <p className="text-sm text-gray-600">Hosted by {opportunity.host}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="mb-2">{opportunity.category}</Badge>
                              <p className="text-sm text-gray-500">Posted {opportunity.posted}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Offer</p>
                              <p className="text-lg font-bold text-green-600">{opportunity.offer}</p>
                              <p className="text-xs text-gray-500">Value: {opportunity.value}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Deliverables</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {opportunity.deliverables.map((deliverable: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {deliverable}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Deadline</p>
                              <p className="text-sm text-orange-600 font-medium">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {opportunity.deadline} to apply
                              </p>
                            </div>
                          </div>

                          <div className="flex space-x-3">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleViewOpportunity(opportunity.id)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button
                              className="flex-1"
                              onClick={() => handleApplyToOpportunity(opportunity.id, opportunity.property)}
                              disabled={appliedOpportunities.includes(opportunity.id)}
                            >
                              {appliedOpportunities.includes(opportunity.id) ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Applied
                                </>
                              ) : (
                                <>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Apply Now
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center p-12">
                <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Opportunities Available</h3>
                <p className="text-gray-600 mb-6">
                  Collaboration opportunities will appear here when hosts are looking for content creators.
                  Meanwhile, you can explore amazing properties and connect with hosts directly!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href="/search">
                      <Eye className="h-4 w-4 mr-2" />
                      Explore Properties
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/profile/edit">
                      <Edit className="h-4 w-4 mr-2" />
                      Complete Profile
                    </Link>
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Collaborations Tab */}
          <TabsContent value="collaborations" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">My Collaborations</h2>
                <p className="text-muted-foreground">Track your active and completed partnerships</p>
              </div>
            </div>

            {activeCollaborations.length > 0 ? (
              <div className="space-y-4">
                {activeCollaborations.map((collab: any) => (
                  <Card key={collab.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{collab.property}</h3>
                          <p className="text-gray-600">Hosted by {collab.host}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-1" />
                              {collab.dates}
                            </div>
                            <Badge variant="default">{collab.status}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-2">Expected:</p>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {collab.deliverables.map((deliverable: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {deliverable}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-blue-600 mt-2 font-medium">{collab.progress}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center p-12">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Collaborations</h3>
                <p className="text-gray-600 mb-6">
                  Ready to start your first collaboration? Browse available opportunities and connect with hosts!
                </p>
                <Button asChild>
                  <Link href="/influencer/browse">
                    <Eye className="h-4 w-4 mr-2" />
                    Browse Opportunities
                  </Link>
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Profile Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {(user.fullName || user.name).charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{user.fullName || user.name}</h3>
                      <p className="text-gray-600">@{user.username}</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline">Verified Creator</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Content Niches</p>
                    <div className="flex flex-wrap gap-2">
                      {influencerProfile?.contentNiches?.map((niche: string) => (
                        <Badge key={niche} variant="secondary" className="capitalize">
                          {niche}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Profile Link</p>
                    <div className="flex items-center space-x-2">
                      <code className="bg-gray-100 px-3 py-2 rounded text-sm flex-1">
                        nomadiqe.com/profile/{influencerProfile?.profileLink}
                      </code>
                      <Button size="sm" onClick={copyProfileLink}>
                        {copiedProfileLink ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/profile/edit">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Connected Platforms */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Connected Platforms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {socialConnections.map((connection: any) => {
                    const IconComponent = getPlatformIcon(connection.platform)
                    return (
                      <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-medium">@{connection.username}</p>
                            <p className="text-sm text-gray-600 capitalize">{connection.platform.toLowerCase()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{connection.followerCount?.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">followers</p>
                          {connection.isPrimary && (
                            <Badge variant="outline" className="mt-1 text-xs">Primary</Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/profile/social-accounts">
                      <Plus className="h-4 w-4 mr-2" />
                      Connect More Platforms
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Media Kit Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Your Media Kit
                </CardTitle>
                <CardDescription>
                  This is what hosts see when they view your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Standard Collaboration Package</h4>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Standard Deliverables</p>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Instagram className="h-4 w-4 mr-2 text-pink-500" />
                          2 Instagram Posts
                        </div>
                        <div className="flex items-center text-sm">
                          <Instagram className="h-4 w-4 mr-2 text-pink-500" />
                          5 Instagram Stories
                        </div>
                        <div className="flex items-center text-sm">
                          <Music className="h-4 w-4 mr-2 text-black" />
                          1 TikTok Video
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Portfolio</p>
                      {influencerProfile?.portfolioUrl ? (
                        <Button variant="outline" size="sm" asChild>
                          <a href={influencerProfile.portfolioUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Portfolio
                          </a>
                        </Button>
                      ) : (
                        <p className="text-sm text-gray-500">No portfolio link added</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Performance Analytics</h2>
                <p className="text-gray-600">Track your collaboration success</p>
              </div>
            </div>

            <Card className="text-center p-12">
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analytics Coming Soon</h3>
              <p className="text-gray-600 mb-6">
                We're building comprehensive analytics to help you track your collaboration performance, 
                engagement rates, and growth metrics.
              </p>
              <div className="flex justify-center space-x-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.monthlyGrowth}%</p>
                  <p className="text-sm text-gray-600">Growth Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.avgEngagement}%</p>
                  <p className="text-sm text-gray-600">Avg Engagement</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{stats.completedProjects}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Promotion Banner */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  <Zap className="h-5 w-5 inline mr-2" />
                  Share Your Profile & Grow Your Network
                </h3>
                <p className="text-green-700 mb-4">
                  Use your unique Nomadiqe profile link to attract collaboration opportunities 
                  on your social media channels.
                </p>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" onClick={copyProfileLink}>
                    <Share2 className="h-4 w-4 mr-2" />
                    {copiedProfileLink ? 'Link Copied!' : 'Copy Profile Link'}
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/influencer/promotion-toolkit">
                      <Camera className="h-4 w-4 mr-2" />
                      Promotion Toolkit
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white">
                  <Share2 className="h-16 w-16" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
