'use client'

import { ReactNode, useState, useEffect } from 'react'
import { useOnboarding, useOnboardingApi } from '@/contexts/OnboardingContext'
import { getStepProgress, getStepTitle, getStepDescription, getNextStep, getPreviousStep, ONBOARDING_STEPS } from '@/lib/onboarding'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, Check, Home, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface OnboardingWizardProps {
  children: ReactNode
  canProceed?: boolean
  onNext?: () => Promise<void> | void
  onPrevious?: () => Promise<void> | void
  showNavigation?: boolean
  isLastStep?: boolean
  customActions?: ReactNode
}

interface StepIndicatorProps {
  steps: string[]
  currentStep: string
  completedSteps: string[]
  role?: string
}

function StepIndicator({ steps, currentStep, completedSteps, role }: StepIndicatorProps) {
  const currentIndex = steps.indexOf(currentStep)
  
  return (
    <div className="flex items-center space-x-2 mb-8">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step)
        const isCurrent = step === currentStep
        const isPast = index < currentIndex
        const isFuture = index > currentIndex
        
        return (
          <div key={step} className="flex items-center">
            {/* Step Circle */}
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                isCompleted
                  ? 'bg-green-500 text-white'
                  : isCurrent
                  ? 'bg-blue-500 text-white'
                  : isPast
                  ? 'bg-gray-300 text-gray-600'
                  : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
              }`}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            
            {/* Step Label */}
            <div className="hidden md:block ml-2 mr-4">
              <div className={`text-xs font-medium ${
                isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
              }`}>
                {getStepTitle(step)}
              </div>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`hidden md:block w-12 h-0.5 mx-2 ${
                  isPast || isCompleted ? 'bg-green-300' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function WizardHeader({ currentStep, role, completedSteps }: { currentStep: string, role?: string, completedSteps: string[] }) {
  // Safely get steps for the role, with fallback to common steps
  const getRoleSteps = (userRole?: string): string[] => {
    if (!userRole) return [...ONBOARDING_STEPS.common]
    
    const validRoles = ['GUEST', 'HOST', 'INFLUENCER'] as const
    const normalizedRole = userRole.toUpperCase()
    
    if (validRoles.includes(normalizedRole as any)) {
      const roleSteps = ONBOARDING_STEPS[normalizedRole as keyof typeof ONBOARDING_STEPS]
      return [...ONBOARDING_STEPS.common, ...roleSteps]
    }
    
    // Fallback for invalid roles
    return [...ONBOARDING_STEPS.common]
  }
  
  const allSteps = getRoleSteps(role)
  const progress = role && ['GUEST', 'HOST', 'INFLUENCER'].includes(role.toUpperCase()) 
    ? getStepProgress(currentStep, completedSteps, role.toUpperCase() as any) 
    : 0
  const stepTitle = getStepTitle(currentStep)
  const stepDescription = getStepDescription(currentStep)

  return (
    <div className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-blue-600">Nomadiqe</h1>
            <div className="hidden md:block w-px h-6 bg-gray-300"></div>
            <span className="text-sm font-medium text-gray-600">Setup Wizard</span>
          </div>
          
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          {/* Overall Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-500">{progress}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicator */}
          {role && allSteps.length > 0 && (
            <StepIndicator
              steps={allSteps}
              currentStep={currentStep}
              completedSteps={completedSteps}
              role={role}
            />
          )}

          {/* Current Step Info */}
          <div className="text-center py-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{stepTitle}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{stepDescription}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OnboardingWizard({
  children,
  canProceed = true,
  onNext,
  onPrevious,
  showNavigation = true,
  isLastStep = false,
  customActions
}: OnboardingWizardProps) {
  const { currentStep, completedSteps, role, isLoading, error } = useOnboarding()
  const { fetchProgress } = useOnboardingApi()
  const [isNavigating, setIsNavigating] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Load progress on mount
  useEffect(() => {
    fetchProgress().catch((err) => {
      console.error('Failed to fetch progress:', err)
      setHasError(true)
    })
  }, [])

  // Error boundary for runtime errors
  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">
              We encountered an error loading the onboarding wizard. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleNext = async () => {
    if (!canProceed || isNavigating) return
    
    setIsNavigating(true)
    try {
      if (onNext) {
        await onNext()
      }
    } catch (error) {
      console.error('Navigation error:', error)
    } finally {
      setIsNavigating(false)
    }
  }

  const handlePrevious = async () => {
    if (isNavigating) return
    
    setIsNavigating(true)
    try {
      if (onPrevious) {
        await onPrevious()
      }
    } catch (error) {
      console.error('Navigation error:', error)
    } finally {
      setIsNavigating(false)
    }
  }

  const canGoBack = currentStep !== 'welcome' && currentStep !== 'profile-setup'
  const showPrevious = canGoBack && showNavigation
  const showNext = !isLastStep && showNavigation

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Wizard Header */}
      <WizardHeader 
        currentStep={currentStep} 
        role={role} 
        completedSteps={completedSteps} 
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Step Content */}
              <div className="mb-8">
                {children}
              </div>

              {/* Navigation */}
              {(showNavigation || customActions) && (
                <div className="flex items-center justify-between pt-6 border-t">
                  <div>
                    {showPrevious && (
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={isLoading || isNavigating}
                        className="flex items-center"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    {customActions}
                    
                    {showNext && (
                      <Button
                        onClick={handleNext}
                        disabled={!canProceed || isLoading || isNavigating}
                        className="flex items-center px-6"
                      >
                        {isNavigating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            {isLastStep ? 'Complete' : 'Continue'}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@nomadiqe.com" className="text-blue-600 hover:text-blue-700">
                support@nomadiqe.com
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Global Loading Overlay */}
      {isLoading && !isNavigating && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">Loading...</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
