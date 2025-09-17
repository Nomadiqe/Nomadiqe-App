'use client'

import { useState } from 'react'
import { useOnboarding, useOnboardingApi } from '@/contexts/OnboardingContext'
import { TRAVEL_INTERESTS } from '@/lib/onboarding'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, Heart, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface InterestItemProps {
  interest: string
  isSelected: boolean
  onToggle: (interest: string) => void
}

function InterestItem({ interest, isSelected, onToggle }: InterestItemProps) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected
          ? 'ring-2 ring-primary border-primary bg-primary/10'
          : 'border-border hover:border-border/80'
      }`}
      onClick={() => onToggle(interest)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              <Heart className="h-4 w-4" />
            </div>
            <span className={`font-medium ${
              isSelected ? 'text-primary' : 'text-foreground'
            }`}>
              {interest}
            </span>
          </div>
          
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            isSelected
              ? 'border-primary bg-primary'
              : 'border-border'
          }`}>
            {isSelected && <Check className="h-3 w-3 text-white" />}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface InterestSelectionProps {
  onComplete?: (interests: string[]) => void
}

export default function InterestSelection({ onComplete }: InterestSelectionProps) {
  const { completeStep, setStep } = useOnboarding()
  const { submitGuestInterests } = useOnboardingApi()
  const router = useRouter()
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleSubmit = async () => {
    if (selectedInterests.length === 0) return
    
    setIsSubmitting(true)

    try {
      const result = await submitGuestInterests(selectedInterests)
      
      if (result.success) {
        completeStep('interest-selection')
        setStep('complete')
        
        if (onComplete) {
          onComplete(selectedInterests)
        } else {
          router.push('/dashboard/guest')
        }
      }
    } catch (error) {
      console.error('Interest submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = async () => {
    // Submit with empty interests
    await handleSubmit()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mb-4">
          <MapPin className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          What interests you most when traveling?
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Select your travel interests to help us personalize your experience. 
          You can always change these later.
        </p>
      </div>

      {/* Interest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {TRAVEL_INTERESTS.map((interest) => (
          <InterestItem
            key={interest}
            interest={interest}
            isSelected={selectedInterests.includes(interest)}
            onToggle={handleInterestToggle}
          />
        ))}
      </div>

      {/* Selection Counter */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {selectedInterests.length > 0 
            ? `${selectedInterests.length} interest${selectedInterests.length > 1 ? 's' : ''} selected`
            : 'Select at least one interest to continue'
          }
        </p>
      </div>

      {/* Quick Select Options */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedInterests(['Adventure', 'Nature', 'Photography'])}
        >
          Adventure Seeker
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedInterests(['Culture', 'History', 'Food & Drink'])}
        >
          Culture Lover
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedInterests(['Relaxation', 'Beach', 'Wellness'])}
        >
          Relaxation Focus
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedInterests(['Luxury', 'Romance', 'City Breaks'])}
        >
          Luxury Traveler
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => router.push('/onboarding/role-selection')}
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={isSubmitting}
          >
            Skip for now
          </Button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={selectedInterests.length === 0 || isSubmitting}
          className="px-8"
        >
          {isSubmitting ? 'Saving...' : 'Complete Setup'}
        </Button>
      </div>

      {/* Help Text */}
      <Card className="bg-primary/10 border-primary/20">
        <CardContent className="p-4">
          <p className="text-sm text-primary">
            <strong>💡 Tip:</strong> Your interests help us show you the most relevant properties 
            and experiences. You can update these anytime in your profile settings.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
