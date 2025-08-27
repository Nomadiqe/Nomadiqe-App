"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'

const errorMap = {
  Signin: 'Try signing in with a different account.',
  OAuthSignin: 'Try signing in with a different account.',
  OAuthCallback: 'Try signing in with a different account.',
  OAuthCreateAccount: 'Try signing in with a different account.',
  EmailCreateAccount: 'Try signing in with a different account.',
  Callback: 'Try signing in with a different account.',
  OAuthAccountNotLinked: 'To confirm your identity, sign in with the same account you used originally.',
  EmailSignin: 'The e-mail could not be sent.',
  CredentialsSignin: 'Sign in failed. Check the details you provided are correct.',
  SessionRequired: 'Please sign in to access this page.',
  default: 'Unable to sign in.',
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') as keyof typeof errorMap

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
            
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-foreground">Authentication Error</h1>
            <p className="text-muted-foreground mt-2">
              {error ? errorMap[error] : errorMap.default}
            </p>
          </div>

          {/* Error Details */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Error Code:</strong> {error}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/auth/signin">
                Try Again
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/signup">
                Create New Account
              </Link>
            </Button>
            
            <Button asChild variant="ghost" className="w-full">
              <Link href="/">
                Go to Homepage
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              If you continue to have problems, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
