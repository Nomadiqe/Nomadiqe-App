'use client'

import { useState } from 'react'
import { useOnboarding, useOnboardingApi } from '@/contexts/OnboardingContext'
import { UserRole } from '@/lib/onboarding'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Home, Instagram, Users, Camera, Building2, MoreHorizontal, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface RoleOption {
  id: UserRole
  title: string
  description: string
  icon: React.ComponentType<any>
  features: string[]
  isPopular?: boolean
}

const roleOptions: RoleOption[] = [
  {
    id: 'GUEST',
    title: 'Guest',
    description: 'Discover and book unique stays',
    icon: MapPin,
    features: [
      'Browse and book properties',
      'Personalized recommendations',
      'Save favorites',
      'Leave reviews',
      'Connect with hosts'
    ],
    isPopular: true
  },
  {
    id: 'HOST',
    title: 'Host',
    description: 'List your property and welcome guests',
    icon: Home,
    features: [
      'List your properties',
      'Manage bookings',
      'Set your own prices',
      'Collaborate with influencers',
      'Earn referral bonuses'
    ]
  },
  {
    id: 'INFLUENCER',
    title: 'Influencer/Creator',
    description: 'Collaborate with hosts and share experiences',
    icon: Instagram,
    features: [
      'Connect social accounts',
      'Collaborate with hosts',
      'Create content',
      'Build your portfolio',
      'Get verified status'
    ]
  }
]

export default function RoleSelection() {
  const { setRole, setStep, completeStep, error } = useOnboarding()
  const { selectRole } = useOnboardingApi()
  const router = useRouter()
  
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showInfluencerOption, setShowInfluencerOption] = useState(false)

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleSubmit = async () => {
    if (!selectedRole) return

    setIsSubmitting(true)

    try {
      const result = await selectRole(selectedRole)
      
      if (result.success) {
        setRole(selectedRole)
        completeStep('role-selection')
        setStep(result.nextStep)
        router.push(`/onboarding/${result.nextStep}`)
      }
    } catch (error) {
      // Error already handled by the API hook
      console.error('Role selection error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Primary Role Options */}
      <div className="grid gap-4 md:gap-6">
        {roleOptions
          .filter(option => option.id !== 'INFLUENCER' || showInfluencerOption)
          .map((option) => {
            const Icon = option.icon
            const isSelected = selectedRole === option.id
            
            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'ring-2 ring-blue-500 border-blue-500 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleRoleSelect(option.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${
                        isSelected
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {option.title}
                          {option.isPopular && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              Popular
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {option.description}
                        </CardDescription>
                      </div>
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
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}

        {/* Show Influencer Option Toggle */}
        {!showInfluencerOption && (
          <Card
            className="cursor-pointer transition-all duration-200 hover:shadow-md border-gray-200 hover:border-gray-300 border-dashed"
            onClick={() => setShowInfluencerOption(true)}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-3">
                <div className="p-3 rounded-lg bg-gray-100 text-gray-600">
                  <Plus className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">More Options</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Are you a content creator or influencer?
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Special Note for Influencer */}
      {selectedRole === 'INFLUENCER' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <p className="text-sm text-orange-700 flex items-start">
              <Camera className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Note:</strong> The Influencer role is currently in beta. 
                You&#39;ll need to connect at least one social media account and have a minimum of 1,000 followers.
              </span>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={() => router.push('/onboarding/profile-setup')}
          disabled={isSubmitting}
        >
          Back
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={!selectedRole || isSubmitting}
          className="px-8"
          size="lg"
        >
          {isSubmitting ? 'Continuing...' : 'Continue as ' + (selectedRole ? roleOptions.find(r => r.id === selectedRole)?.title : '')}
        </Button>
      </div>

      {/* Help Text */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-start">
            <Users className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Don&#39;t worry, you can switch later!</p>
              <p>
                You can always change your role or add additional roles in your account settings. 
                Many users start as guests and become hosts over time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
