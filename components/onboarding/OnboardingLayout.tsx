'use client'

import { ReactNode } from 'react'
import { useOnboarding } from '@/contexts/OnboardingContext'
import { getStepProgress, getStepTitle, getStepDescription } from '@/lib/onboarding'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

interface OnboardingLayoutProps {
  children: ReactNode
  showBackButton?: boolean
  showHomeButton?: boolean
  onBack?: () => void
}

export default function OnboardingLayout({ 
  children, 
  showBackButton = false,
  showHomeButton = true,
  onBack 
}: OnboardingLayoutProps) {
  const { currentStep, completedSteps, role, isLoading } = useOnboarding()

  const progress = role ? getStepProgress(currentStep, completedSteps, role) : 0
  const stepTitle = getStepTitle(currentStep)
  const stepDescription = getStepDescription(currentStep)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-10" style={{ WebkitBackdropFilter: 'blur(8px)' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-primary">Nomadiqe</h1>
                <span className="text-sm text-muted-foreground">Getting Started</span>
              </div>
            </div>
            
            {showHomeButton && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <Home className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
          
          {/* Progress bar */}
          {role && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Progress
                </span>
                <span className="text-xs text-muted-foreground">
                  {progress}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground">
                {stepTitle}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {stepDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {children}
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="p-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-sm font-medium">Processing...</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
