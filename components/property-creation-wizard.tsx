'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PROPERTY_AMENITIES } from '@/lib/onboarding'
import { Home, MapPin, Camera, Euro, Wifi, Car, Utensils, AlertCircle, Check, Plus, Minus } from 'lucide-react'
import { PropertyImageUpload } from '@/components/property-image-upload'

type PropertyType = 'APARTMENT' | 'HOUSE' | 'VILLA' | 'BNB' | 'HOTEL' | 'HOSTEL' | 'CABIN' | 'TENT' | 'OTHER'

interface FormData {
  title: string
  description: string
  location: {
    address: string
    city: string
    country: string
  }
  propertyType: PropertyType
  maxGuests: number
  bedrooms: number
  bathrooms: number
  amenities: Record<string, boolean>
  photos: string[]
  pricing: {
    basePrice: number
    cleaningFee: number
    currency: string
  }
  rules: string[]
}

interface FormErrors {
  [key: string]: string
}

const propertyTypes = [
  { id: 'APARTMENT' as PropertyType, label: 'Apartment', icon: Home },
  { id: 'HOUSE' as PropertyType, label: 'House', icon: Home },
  { id: 'VILLA' as PropertyType, label: 'Villa', icon: Home },
  { id: 'BNB' as PropertyType, label: 'Bed & Breakfast', icon: Home },
  { id: 'HOTEL' as PropertyType, label: 'Hotel Room', icon: Home },
  { id: 'HOSTEL' as PropertyType, label: 'Hostel', icon: Home },
  { id: 'CABIN' as PropertyType, label: 'Cabin', icon: Home },
  { id: 'TENT' as PropertyType, label: 'Tent/Camping', icon: Home },
  { id: 'OTHER' as PropertyType, label: 'Other', icon: Home }
]

const defaultRules = [
  'No smoking inside',
  'No parties or events',
  'Check-in after 3:00 PM',
  'Check-out before 11:00 AM',
  'Quiet hours: 10:00 PM - 8:00 AM'
]

interface PropertyCreationWizardProps {
  onComplete?: () => void
}

export default function PropertyCreationWizard({ onComplete }: PropertyCreationWizardProps) {
  const router = useRouter()
  
  const [currentStep, setCurrentStep] = useState<'basic' | 'location' | 'details' | 'amenities' | 'photos' | 'pricing'>('basic')
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    location: {
      address: '',
      city: '',
      country: ''
    },
    propertyType: 'APARTMENT',
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: Object.keys(PROPERTY_AMENITIES).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
    photos: [], // Start with no photos
    pricing: {
      basePrice: 100,
      cleaningFee: 25,
      currency: 'EUR'
    },
    rules: [...defaultRules]
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const updateNestedData = (key: keyof FormData, nestedKey: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] as any),
        [nestedKey]: value
      }
    }))
  }

  const validateCurrentStep = (): boolean => {
    const newErrors: FormErrors = {}

    switch (currentStep) {
      case 'basic':
        if (!formData.title.trim()) newErrors.title = 'Title is required'
        else if (formData.title.length < 10) newErrors.title = 'Title must be at least 10 characters'
        
        if (!formData.description.trim()) newErrors.description = 'Description is required'
        else if (formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters'
        break
        
      case 'location':
        if (!formData.location.address.trim()) newErrors.address = 'Address is required'
        if (!formData.location.city.trim()) newErrors.city = 'City is required'
        if (!formData.location.country.trim()) newErrors.country = 'Country is required'
        break
        
      case 'pricing':
        if (formData.pricing.basePrice <= 0) newErrors.basePrice = 'Base price must be greater than 0'
        if (formData.pricing.cleaningFee < 0) newErrors.cleaningFee = 'Cleaning fee cannot be negative'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateCurrentStep()) return

    const steps: (typeof currentStep)[] = ['basic', 'location', 'details', 'amenities', 'photos', 'pricing']
    const currentIndex = steps.indexOf(currentStep)
    
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    const steps: (typeof currentStep)[] = ['basic', 'location', 'details', 'amenities', 'photos', 'pricing']
    const currentIndex = steps.indexOf(currentStep)
    
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/onboarding/host/create-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        if (onComplete) {
          onComplete()
        } else {
          router.push('/dashboard')
        }
      } else {
        setErrors({ general: result.error || 'Failed to create listing' })
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Property Title</label>
              <Input
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                placeholder="e.g., Cozy Mountain Cabin with Stunning Views"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                placeholder="Describe your property, its features, and what makes it special..."
                className="w-full h-32 p-3 border border-border rounded-md resize-none"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Property Type</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {propertyTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => updateFormData({ propertyType: type.id })}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        formData.propertyType === type.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <div className="text-sm font-medium">{type.label}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )

      case 'location':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <Input
                value={formData.location.address}
                onChange={(e) => updateNestedData('location', 'address', e.target.value)}
                placeholder="Street address"
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <Input
                  value={formData.location.city}
                  onChange={(e) => updateNestedData('location', 'city', e.target.value)}
                  placeholder="City"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <Input
                  value={formData.location.country}
                  onChange={(e) => updateNestedData('location', 'country', e.target.value)}
                  placeholder="Country"
                  className={errors.country ? 'border-red-500' : ''}
                />
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>
            </div>
          </div>
        )

      case 'details':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Max Guests</label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateFormData({ maxGuests: Math.max(1, formData.maxGuests - 1) })}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center">{formData.maxGuests}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateFormData({ maxGuests: Math.min(50, formData.maxGuests + 1) })}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bedrooms</label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateFormData({ bedrooms: Math.max(1, formData.bedrooms - 1) })}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center">{formData.bedrooms}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateFormData({ bedrooms: Math.min(20, formData.bedrooms + 1) })}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bathrooms</label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateFormData({ bathrooms: Math.max(1, formData.bathrooms - 1) })}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center">{formData.bathrooms}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateFormData({ bathrooms: Math.min(20, formData.bathrooms + 1) })}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'amenities':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(PROPERTY_AMENITIES).map(([key, amenity]) => {
                const Icon = amenity.icon
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => updateNestedData('amenities', key, !formData.amenities[key])}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      formData.amenities[key]
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-2" />
                    <div className="text-sm font-medium">{amenity.label}</div>
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 'photos':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Property Photos</label>
              <p className="text-sm text-muted-foreground mb-4">
                Upload property photos - first image will be your main photo
              </p>
              
              <PropertyImageUpload
                images={formData.photos}
                onImagesChange={(photos) => updateFormData({ photos })}
                maxFiles={10}
                className="w-full"
              />

              <ul className="text-sm text-muted-foreground mt-4 space-y-1">
                <li>• Upload high-quality photos that showcase your property</li>
                <li>• Include photos of all main areas (bedrooms, living room, kitchen, bathroom)</li>
                <li>• Take photos during the day with natural lighting</li>
                <li>• The first photo will be your main listing image</li>
              </ul>
            </div>

            {/* Show uploaded photos */}
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Property photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'pricing':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Base Price (per night)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    €
                  </span>
                  <Input
                    type="number"
                    value={formData.pricing.basePrice}
                    onChange={(e) => updateNestedData('pricing', 'basePrice', parseFloat(e.target.value) || 0)}
                    className={`pl-8 ${errors.basePrice ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.basePrice && <p className="text-red-500 text-sm mt-1">{errors.basePrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cleaning Fee</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    €
                  </span>
                  <Input
                    type="number"
                    value={formData.pricing.cleaningFee}
                    onChange={(e) => updateNestedData('pricing', 'cleaningFee', parseFloat(e.target.value) || 0)}
                    className={`pl-8 ${errors.cleaningFee ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.cleaningFee && <p className="text-red-500 text-sm mt-1">{errors.cleaningFee}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">House Rules</label>
              <div className="space-y-2">
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={rule}
                      onChange={(e) => {
                        const newRules = [...formData.rules]
                        newRules[index] = e.target.value
                        updateFormData({ rules: newRules })
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newRules = formData.rules.filter((_, i) => i !== index)
                        updateFormData({ rules: newRules })
                      }}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateFormData({ rules: [...formData.rules, ''] })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const steps = [
    { id: 'basic', label: 'Basic Info', icon: Home },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'details', label: 'Details', icon: Utensils },
    { id: 'amenities', label: 'Amenities', icon: Wifi },
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'pricing', label: 'Pricing', icon: Euro }
  ]

  const currentStepIndex = steps.findIndex(step => step.id === currentStep)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStepIndex
            const isCompleted = index < currentStepIndex
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive 
                    ? 'border-primary bg-primary text-primary-foreground' 
                    : isCompleted 
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-muted-foreground text-muted-foreground'
                }`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="ml-3 hidden md:block">
                  <div className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.label}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-muted'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {steps[currentStepIndex] && (() => {
              const Icon = steps[currentStepIndex].icon
              return <Icon className="w-5 h-5" />
            })()}
            {steps[currentStepIndex]?.label}
          </CardTitle>
          <CardDescription>
            Step {currentStepIndex + 1} of {steps.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700">{errors.general}</p>
              </div>
            </div>
          )}

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
            >
              Previous
            </Button>
            
            <Button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : currentStepIndex === steps.length - 1 ? 'Create Listing' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
