"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Instagram,
  Youtube,
  ExternalLink,
  Camera,
  Video,
  FileText,
  Check
} from 'lucide-react'

interface DeliverableData {
  instagramPost?: number
  instagramStory?: number
  tiktokVideo?: number
  youtubeVideo?: number
  blogPost?: boolean
  customDeliverables?: string[]
}

interface MediaKitDisplayProps {
  contentNiches?: string[]
  deliverables?: DeliverableData | null
  portfolioUrl?: string | null
  verificationStatus?: string
  isVerified?: boolean
}

export function MediaKitDisplay({
  contentNiches = [],
  deliverables,
  portfolioUrl,
  verificationStatus,
  isVerified = false
}: MediaKitDisplayProps) {
  const deliverablesList = deliverables ? [
    {
      key: 'instagramPost',
      label: 'Instagram Posts',
      value: deliverables.instagramPost,
      icon: Instagram,
      color: 'text-pink-500'
    },
    {
      key: 'instagramStory',
      label: 'Instagram Stories',
      value: deliverables.instagramStory,
      icon: Instagram,
      color: 'text-purple-500'
    },
    {
      key: 'tiktokVideo',
      label: 'TikTok Videos',
      value: deliverables.tiktokVideo,
      icon: Video,
      color: 'text-black dark:text-white'
    },
    {
      key: 'youtubeVideo',
      label: 'YouTube Videos',
      value: deliverables.youtubeVideo,
      icon: Youtube,
      color: 'text-red-500'
    },
    {
      key: 'blogPost',
      label: 'Blog Posts',
      value: deliverables.blogPost ? 1 : 0,
      icon: FileText,
      color: 'text-blue-500'
    },
  ].filter(d => d.value && d.value > 0) : []

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Verification Badge */}
      {isVerified && (
        <Card className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Check className="w-5 h-5" />
              <span className="font-medium">Verified Creator</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Niches */}
      {contentNiches && contentNiches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Niches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {contentNiches.map((niche, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm"
                >
                  {niche}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deliverables */}
      {deliverablesList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Content Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {deliverablesList.map((deliverable) => {
                const Icon = deliverable.icon
                return (
                  <div
                    key={deliverable.key}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <Icon className={`w-5 h-5 ${deliverable.color}`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{deliverable.label}</p>
                      {(deliverable.value ?? 0) > 1 && (
                        <p className="text-xs text-muted-foreground">
                          Up to {deliverable.value} per collaboration
                        </p>
                      )}
                    </div>
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Deliverables */}
      {deliverables?.customDeliverables && deliverables.customDeliverables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {deliverables.customDeliverables.map((item, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-3 py-1.5"
                >
                  <Check className="w-3 h-3 mr-1 text-green-500" />
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio */}
      {portfolioUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              asChild
            >
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View Portfolio
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {contentNiches.length === 0 && deliverablesList.length === 0 && !portfolioUrl && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Camera className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Media Kit Yet</h3>
            <p className="text-sm text-muted-foreground text-center">
              This creator hasn&apos;t set up their media kit yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
