'use client'

import { useState } from 'react'
import { useOnboarding, useOnboardingApi } from '@/contexts/OnboardingContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CONTENT_NICHES } from '@/lib/onboarding'
import { Users, Gift, Star, Check, AlertCircle, Hash, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FormData {
  standardOffer: {
    offerType: 'free_stay' | 'discounted_stay' | 'paid_collaboration'
    discount?: number
    minNights: number
    maxNights: number
    deliverables: string[]
    terms: string
  }
  minFollowerCount?: number
  preferredNiches: string[]
}

interface FormErrors {
  [key: string]: string
}

const offerTypes = [
  {
    id: 'free_stay' as const,
    title: 'Free Stay',
    description: 'Complimentary accommodation in exchange for content',
    icon: Gift,
    popular: true
  },
  {
    id: 'discounted_stay' as const,
    title: 'Discounted Stay',
    description: 'Reduced rate accommodation for influencer partnerships',
    icon: Star,
    popular: false
  },
  {
    id: 'paid_collaboration' as const,
    title: 'Paid Collaboration',
    description: 'Paid partnership with content creation requirements',
    icon: Users,
    popular: false
  }
]

const deliverableOptions = [
  'Instagram posts (1-3)',
  'Instagram stories (5-10)',
  'TikTok video',
  'YouTube video',
  'Blog post/article',
  'Google/TripAdvisor review',
  'Social media mentions',
  'Photography package'
]

interface CollaborationSetupProps {
  onComplete?: () => void
}

export default function CollaborationSetup({ onComplete }: CollaborationSetupProps) {
  const { completeStep, setStep } = useOnboarding()
  const router = useRouter()
  
  const [formData, setFormData] = useState<FormData>({
    standardOffer: {
      offerType: 'free_stay',
      minNights: 2,
      maxNights: 7,
      deliverables: ['Instagram posts (1-3)', 'Instagram stories (5-10)'],
      terms: 'Stay must be promoted on social media during and after visit. All content should tag our property and use our branded hashtags.'
    },
    minFollowerCount: 10000,
    preferredNiches: []
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const updateStandardOffer = (updates: Partial<FormData['standardOffer']>) => {
    setFormData(prev => ({
      ...prev,
      standardOffer: { ...prev.standardOffer, ...updates }
    }))
  }

  const toggleDeliverable = (deliverable: string) => {
    const currentDeliverables = formData.standardOffer.deliverables
    const updatedDeliverables = currentDeliverables.includes(deliverable)
      ? currentDeliverables.filter(d => d !== deliverable)
      : [...currentDeliverables, deliverable]
    
    updateStandardOffer({ deliverables: updatedDeliverables })
  }

  const toggleNiche = (niche: string) => {
    const currentNiches = formData.preferredNiches
    const updatedNiches = currentNiches.includes(niche)
      ? currentNiches.filter(n => n !== niche)
      : [...currentNiches, niche]
    
    updateFormData({ preferredNiches: updatedNiches })
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (formData.standardOffer.deliverables.length === 0) {
      newErrors.deliverables = 'At least one deliverable is required'
    }

    if (!formData.standardOffer.terms.trim()) {
      newErrors.terms = 'Collaboration terms are required'
    } else if (formData.standardOffer.terms.length < 10) {
      newErrors.terms = 'Terms must be at least 10 characters'
    }

    if (formData.standardOffer.offerType === 'discounted_stay' && !formData.standardOffer.discount) {
      newErrors.discount = 'Discount percentage is required'
    }

    if (formData.minFollowerCount && formData.minFollowerCount < 1000) {
      newErrors.minFollowerCount = 'Minimum follower count should be at least 1000'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/onboarding/host/collaboration-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        completeStep('collaboration-setup')
        setStep('complete')
        
        if (onComplete) {
          onComplete()
        } else {
          router.push('/dashboard/host')
        }
      } else {
        setErrors({ general: result.error || 'Failed to save collaboration preferences' })
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
          <Users className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Collaboration Preferences
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Set up your standard collaboration offer for influencers and content creators.
        </p>
      </div>

      {/* Offer Type Selection */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Standard Offer Type *</h4>
        
        <div className="grid gap-4">
          {offerTypes.map((offer) => {
            const Icon = offer.icon
            const isSelected = formData.standardOffer.offerType === offer.id
            
            return (
              <Card
                key={offer.id}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => updateStandardOffer({ offerType: offer.id })}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className={`font-semibold ${
                          isSelected ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {offer.title}
                        </h5>
                        {offer.popular && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{offer.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Discount Input for Discounted Stay */}
        {formData.standardOffer.offerType === 'discounted_stay' && (
          <div className="ml-4">
            <label className="text-sm font-medium text-gray-700">Discount Percentage *</label>
            <div className="flex items-center mt-1">
              <Input
                type="number"
                value={formData.standardOffer.discount || ''}
                onChange={(e) => updateStandardOffer({ discount: Number(e.target.value) })}
                placeholder="20"
                className={`w-24 ${errors.discount ? 'border-red-500' : ''}`}
                min="5"
                max="100"
              />
              <span className="ml-2 text-gray-500">% off regular rate</span>
            </div>
            {errors.discount && <p className="text-sm text-red-600 mt-1">{errors.discount}</p>}
          </div>
        )}
      </div>

      {/* Stay Duration */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Stay Duration</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Minimum Nights</label>
            <div className="flex items-center mt-1">
              <Input
                type="number"
                value={formData.standardOffer.minNights}
                onChange={(e) => updateStandardOffer({ minNights: Math.max(1, Number(e.target.value)) })}
                className="w-20"
                min="1"
                max="30"
              />
              <Calendar className="h-4 w-4 ml-2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Maximum Nights</label>
            <div className="flex items-center mt-1">
              <Input
                type="number"
                value={formData.standardOffer.maxNights}
                onChange={(e) => updateStandardOffer({ maxNights: Math.max(formData.standardOffer.minNights, Number(e.target.value)) })}
                className="w-20"
                min={formData.standardOffer.minNights}
                max="30"
              />
              <Calendar className="h-4 w-4 ml-2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Deliverables */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Expected Deliverables *</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {deliverableOptions.map((deliverable) => (
            <Card
              key={deliverable}
              className={`cursor-pointer transition-all ${
                formData.standardOffer.deliverables.includes(deliverable)
                  ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleDeliverable(deliverable)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{deliverable}</span>
                  {formData.standardOffer.deliverables.includes(deliverable) && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {errors.deliverables && (
          <p className="text-sm text-red-600">{errors.deliverables}</p>
        )}
      </div>

      {/* Minimum Followers */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Minimum Follower Count</h4>
        <div className="flex items-center space-x-2">
          <Hash className="h-4 w-4 text-gray-400" />
          <Input
            type="number"
            value={formData.minFollowerCount || ''}
            onChange={(e) => updateFormData({ minFollowerCount: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="10000"
            className={`w-32 ${errors.minFollowerCount ? 'border-red-500' : ''}`}
            min="1000"
          />
          <span className="text-sm text-gray-500">followers (optional)</span>
        </div>
        {errors.minFollowerCount && (
          <p className="text-sm text-red-600">{errors.minFollowerCount}</p>
        )}
        <p className="text-xs text-gray-500">
          Leave empty to accept influencers with any follower count
        </p>
      </div>

      {/* Preferred Niches */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Preferred Content Niches (Optional)</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {CONTENT_NICHES.slice(0, 12).map((niche) => (
            <Card
              key={niche}
              className={`cursor-pointer transition-all ${
                formData.preferredNiches.includes(niche)
                  ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleNiche(niche)}
            >
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium capitalize">{niche}</span>
                  {formData.preferredNiches.includes(niche) && (
                    <Check className="h-3 w-3 text-blue-600" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          Select content niches that align with your property. Leave empty to accept all niches.
        </p>
      </div>

      {/* Collaboration Terms */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Collaboration Terms *</h4>
        <textarea
          value={formData.standardOffer.terms}
          onChange={(e) => updateStandardOffer({ terms: e.target.value })}
          placeholder="Describe your collaboration expectations, posting requirements, hashtags to use, etc."
          rows={4}
          className={`w-full px-3 py-2 border rounded-md resize-none ${
            errors.terms ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.terms && (
          <p className="text-sm text-red-600">{errors.terms}</p>
        )}
        <p className="text-xs text-gray-500">
          {formData.standardOffer.terms.length}/10 characters minimum
        </p>
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
          onClick={() => router.push('/onboarding/listing-creation')}
          disabled={isSubmitting}
        >
          Back to Listing
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8"
        >
          {isSubmitting ? 'Completing Setup...' : 'Complete Host Setup'}
        </Button>
      </div>

      {/* Info Card */}
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-800 flex items-center">
            <Star className="h-4 w-4 mr-2" />
            Collaboration Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-sm text-purple-700 space-y-1">
            <p>• Be clear about your expectations and deliverables</p>
            <p>• Consider offering unique experiences, not just accommodation</p>
            <p>• Respond quickly to collaboration requests</p>
            <p>• Build long-term relationships with quality creators</p>
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
