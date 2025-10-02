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
                  ? 'bg-nomadiqe-success text-white'
                  : isCurrent
                  ? 'bg-primary text-primary-foreground'
                  : isPast
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-background text-muted-foreground border-2 border-border'
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
                isCurrent ? 'text-primary' : isCompleted ? 'text-nomadiqe-success' : 'text-muted-foreground'
              }`}>
                {getStepTitle(step)}
              </div>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`hidden md:block w-12 h-0.5 mx-2 ${
                  isPast || isCompleted ? 'bg-nomadiqe-success' : 'bg-muted'
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
    <div className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-10" style={{ WebkitBackdropFilter: 'blur(8px)' }}>
      <div className="container mx-auto px-4 py-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-primary">Nomadiqe</h1>
            <div className="hidden md:block w-px h-6 bg-muted"></div>
            <span className="text-sm font-medium text-muted-foreground">Setup Wizard</span>
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
              <span className="text-sm font-medium text-foreground">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{progress}% Complete</span>
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
            <h2 className="text-3xl font-bold text-foreground mb-2">{stepTitle}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{stepDescription}</p>
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
  }, [fetchProgress])

  // Error boundary for runtime errors
  if (hasError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-destructive mb-4">
              <AlertCircle className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-4">
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
    <div className="min-h-screen bg-background">
      {/* Wizard Header */}
      <WizardHeader 
        currentStep={currentStep} 
        role={role} 
        completedSteps={completedSteps} 
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-border bg-card">
            <CardContent className="p-8">
              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
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
            <p className="text-sm text-muted-foreground">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@nomadiqe.com" className="text-primary hover:text-primary/80">
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-sm font-medium">Loading...</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
