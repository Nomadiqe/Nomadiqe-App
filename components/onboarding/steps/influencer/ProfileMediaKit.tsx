'use client'

import { useState } from 'react'
import { useOnboarding, useOnboardingApi } from '@/contexts/OnboardingContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CONTENT_NICHES } from '@/lib/onboarding'
import { User, Camera, Link as LinkIcon, Check, AlertCircle, ExternalLink, Star, Hash } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FormData {
  contentNiches: string[]
  deliverables: {
    instagramPost?: number
    instagramStory?: number
    tiktokVideo?: number
    youtubeVideo?: number
    blogPost: boolean
    customDeliverables: string[]
  }
  portfolioUrl: string
  collaborationTerms: string
}

interface FormErrors {
  [key: string]: string
}

const deliverableOptions = [
  { key: 'instagramPost', label: 'Instagram Posts', max: 10, unit: 'posts' },
  { key: 'instagramStory', label: 'Instagram Stories', max: 20, unit: 'stories' },
  { key: 'tiktokVideo', label: 'TikTok Videos', max: 10, unit: 'videos' },
  { key: 'youtubeVideo', label: 'YouTube Videos', max: 5, unit: 'videos' }
]

interface ProfileMediaKitProps {
  onComplete?: () => void
}

export default function ProfileMediaKit({ onComplete }: ProfileMediaKitProps) {
  const { completeStep, setStep } = useOnboarding()
  const router = useRouter()
  
  const [formData, setFormData] = useState<FormData>({
    contentNiches: [],
    deliverables: {
      instagramPost: 2,
      instagramStory: 5,
      tiktokVideo: 1,
      youtubeVideo: 0,
      blogPost: false,
      customDeliverables: []
    },
    portfolioUrl: '',
    collaborationTerms: 'I create high-quality, authentic content that showcases travel experiences in an engaging way. I ensure all content aligns with brand values and includes proper attribution and hashtags.'
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customDeliverable, setCustomDeliverable] = useState('')

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const updateDeliverables = (updates: Partial<FormData['deliverables']>) => {
    setFormData(prev => ({
      ...prev,
      deliverables: { ...prev.deliverables, ...updates }
    }))
  }

  const toggleNiche = (niche: string) => {
    const currentNiches = formData.contentNiches
    const updatedNiches = currentNiches.includes(niche)
      ? currentNiches.filter(n => n !== niche)
      : [...currentNiches, niche]
    
    updateFormData({ contentNiches: updatedNiches })
  }

  const addCustomDeliverable = () => {
    if (!customDeliverable.trim()) return
    
    const currentCustom = formData.deliverables.customDeliverables
    if (!currentCustom.includes(customDeliverable.trim())) {
      updateDeliverables({
        customDeliverables: [...currentCustom, customDeliverable.trim()]
      })
    }
    setCustomDeliverable('')
  }

  const removeCustomDeliverable = (deliverable: string) => {
    updateDeliverables({
      customDeliverables: formData.deliverables.customDeliverables.filter(d => d !== deliverable)
    })
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (formData.contentNiches.length === 0) {
      newErrors.contentNiches = 'At least one content niche is required'
    } else if (formData.contentNiches.length > 5) {
      newErrors.contentNiches = 'Maximum 5 niches allowed'
    }

    if (!formData.collaborationTerms.trim()) {
      newErrors.collaborationTerms = 'Collaboration terms are required'
    } else if (formData.collaborationTerms.length < 10) {
      newErrors.collaborationTerms = 'Collaboration terms must be at least 10 characters'
    }

    if (formData.portfolioUrl && !isValidUrl(formData.portfolioUrl)) {
      newErrors.portfolioUrl = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/onboarding/influencer/setup-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentNiches: formData.contentNiches,
          deliverables: formData.deliverables,
          portfolioUrl: formData.portfolioUrl || undefined,
          collaborationTerms: formData.collaborationTerms
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        completeStep('profile-setup')
        setStep('complete')
        
        if (onComplete) {
          onComplete()
        } else {
          router.push('/dashboard/influencer')
        }
      } else {
        setErrors({ general: result.error || 'Failed to setup profile' })
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mb-4">
          <User className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Complete Your Profile
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Set up your media kit and collaboration preferences to attract the right host partnerships.
        </p>
      </div>

      {/* Content Niches */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Content Niches *</h4>
          <p className="text-sm text-gray-600 mb-4">
            Select up to 5 niches that best describe your content style and audience interests.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {CONTENT_NICHES.map((niche) => (
            <Card
              key={niche}
              className={`cursor-pointer transition-all ${
                formData.contentNiches.includes(niche)
                  ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleNiche(niche)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{niche}</span>
                  {formData.contentNiches.includes(niche) && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {formData.contentNiches.length}/5 niches selected
          </p>
          {formData.contentNiches.length >= 5 && (
            <p className="text-sm text-amber-600">Maximum niches selected</p>
          )}
        </div>

        {errors.contentNiches && (
          <p className="text-sm text-red-600">{errors.contentNiches}</p>
        )}
      </div>

      {/* Standard Deliverables */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Standard Deliverables</h4>
          <p className="text-sm text-gray-600 mb-4">
            Define your typical collaboration package. Hosts will see this when considering partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deliverableOptions.map((option) => (
            <Card key={option.key} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">{option.label}</h5>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const current = formData.deliverables[option.key as keyof typeof formData.deliverables] as number || 0
                        updateDeliverables({ [option.key]: Math.max(0, current - 1) })
                      }}
                      disabled={!formData.deliverables[option.key as keyof typeof formData.deliverables]}
                    >
                      -
                    </Button>
                    <span className="font-medium min-w-[2rem] text-center">
                      {formData.deliverables[option.key as keyof typeof formData.deliverables] || 0}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const current = formData.deliverables[option.key as keyof typeof formData.deliverables] as number || 0
                        if (current < option.max) {
                          updateDeliverables({ [option.key]: current + 1 })
                        }
                      }}
                      disabled={(formData.deliverables[option.key as keyof typeof formData.deliverables] as number || 0) >= option.max}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Max {option.max} {option.unit}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Blog Post Toggle */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Blog Post/Article</h5>
                <p className="text-sm text-gray-600">Written content for blog or website</p>
              </div>
              <Button
                type="button"
                variant={formData.deliverables.blogPost ? "default" : "outline"}
                size="sm"
                onClick={() => updateDeliverables({ blogPost: !formData.deliverables.blogPost })}
              >
                {formData.deliverables.blogPost ? 'Included' : 'Add'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Custom Deliverables */}
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Custom Deliverables</CardTitle>
            <CardDescription className="text-xs">
              Add any additional services you offer
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center space-x-2 mb-3">
              <Input
                value={customDeliverable}
                onChange={(e) => setCustomDeliverable(e.target.value)}
                placeholder="e.g., Reels, Stories highlight, etc."
                className="flex-1"
              />
              <Button
                type="button"
                size="sm"
                onClick={addCustomDeliverable}
                disabled={!customDeliverable.trim()}
              >
                Add
              </Button>
            </div>

            {formData.deliverables.customDeliverables.length > 0 && (
              <div className="space-y-2">
                {formData.deliverables.customDeliverables.map((deliverable, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                    <span className="text-sm">{deliverable}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomDeliverable(deliverable)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Portfolio URL */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Portfolio Link (Optional)</h4>
          <p className="text-sm text-gray-600 mb-4">
            Share a link to your portfolio, media kit, or website to showcase your work.
          </p>
        </div>

        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={formData.portfolioUrl}
            onChange={(e) => updateFormData({ portfolioUrl: e.target.value })}
            placeholder="https://yourportfolio.com"
            className={`pl-10 ${errors.portfolioUrl ? 'border-red-500' : ''}`}
          />
        </div>
        
        {errors.portfolioUrl && (
          <p className="text-sm text-red-600">{errors.portfolioUrl}</p>
        )}
      </div>

      {/* Collaboration Terms */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Collaboration Terms *</h4>
          <p className="text-sm text-gray-600 mb-4">
            Describe your collaboration style, content quality standards, and any special requirements.
          </p>
        </div>

        <textarea
          value={formData.collaborationTerms}
          onChange={(e) => updateFormData({ collaborationTerms: e.target.value })}
          placeholder="Describe your collaboration approach, content quality, turnaround times, etc."
          rows={4}
          className={`w-full px-3 py-2 border rounded-md resize-none ${
            errors.collaborationTerms ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {formData.collaborationTerms.length}/10 characters minimum
          </p>
          {errors.collaborationTerms && (
            <p className="text-sm text-red-600">{errors.collaborationTerms}</p>
          )}
        </div>
      </div>

      {/* General Error */}
      {errors.general && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-sm text-red-700 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {errors.general}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={() => router.push('/onboarding/social-connect')}
          disabled={isSubmitting}
        >
          Back to Social Connect
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8"
        >
          {isSubmitting ? 'Completing Setup...' : 'Complete Influencer Setup'}
        </Button>
      </div>

      {/* Success Preview */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-800 flex items-center">
            <Hash className="h-4 w-4 mr-2" />
            Your Unique Profile Link
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-green-700 mb-2">
            After completing setup, you&#39;ll receive a unique link to share on your social media:
          </p>
          <div className="bg-white px-3 py-2 rounded border border-green-200">
            <code className="text-xs text-green-800">
              https://nomadiqe.com/profile/your-unique-link
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-800 flex items-center">
            <Star className="h-4 w-4 mr-2" />
            Profile Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-sm text-purple-700 space-y-1">
            <p>• Be authentic in your collaboration terms and expectations</p>
            <p>• Showcase your best work in your portfolio link</p>
            <p>• Be realistic with deliverable quantities and timelines</p>
            <p>• Update your profile regularly as your content evolves</p>
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
