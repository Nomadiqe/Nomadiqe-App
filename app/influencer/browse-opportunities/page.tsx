import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BackButton } from '@/components/back-button'
import {
  MapPin,
  Calendar,
  DollarSign,
  Camera,
  Users,
  Star,
  ArrowLeft,
  Filter,
  Search,
  Heart
} from 'lucide-react'
import Link from 'next/link'

export default async function BrowseOpportunitiesPage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/auth/signin')
  }

  // For now, we don't have real collaboration opportunities in the database
  // This page will show an empty state until the collaboration system is built
  const opportunities: any[] = []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackButton label="Back" variant="ghost" size="sm" icon="arrow" />
              <div>
                <h1 className="text-2xl font-bold">Browse Collaboration Opportunities</h1>
                <p className="text-muted-foreground">Discover properties looking for content creators</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {opportunities.length > 0 ? (
          <div className="grid gap-6">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                          <div className="flex items-center text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{opportunity.location}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Hosted by {opportunity.host}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-2">{opportunity.category}</Badge>
                          <p className="text-sm text-muted-foreground">Posted {opportunity.posted}</p>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{opportunity.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium">Compensation</p>
                          <p className="text-lg font-bold text-primary">{opportunity.compensation}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Duration</p>
                          <p className="text-muted-foreground">{opportunity.duration}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Requirements</p>
                          <p className="text-muted-foreground">{opportunity.requirements}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{opportunity.applicants} applied</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-500" />
                            <span>{opportunity.hostRating}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Heart className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button size="sm">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No Opportunities Available Yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Collaboration opportunities will appear here when hosts are looking for content creators.
                Check back soon or create an amazing profile to attract hosts!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link href="/profile/edit">
                    Complete Your Profile
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/search">
                    Browse Properties
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">1. Browse available opportunities</p>
              <p className="text-sm text-muted-foreground">2. Apply with your profile</p>
              <p className="text-sm text-muted-foreground">3. Connect with hosts</p>
              <p className="text-sm text-muted-foreground">4. Create amazing content</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What Hosts Look For</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">• High-quality content portfolio</p>
              <p className="text-sm text-muted-foreground">• Engaged audience</p>
              <p className="text-sm text-muted-foreground">• Professional communication</p>
              <p className="text-sm text-muted-foreground">• Relevant niche alignment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tips for Success</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">• Complete your profile 100%</p>
              <p className="text-sm text-muted-foreground">• Add your best work samples</p>
              <p className="text-sm text-muted-foreground">• Respond quickly to hosts</p>
              <p className="text-sm text-muted-foreground">• Be clear about deliverables</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}