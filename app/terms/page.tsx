import { BackButton } from '@/components/back-button'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-4">
          <BackButton />
        </div>
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p className="text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Nomadiqe (&ldquo;the Service&rdquo;), you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on Nomadiqe&apos;s website for personal, non-commercial transitory viewing only.
          </p>

          <h2>3. Disclaimer</h2>
          <p>
            The materials on Nomadiqe&apos;s website are provided on an &apos;as is&apos; basis. Nomadiqe makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2>4. Limitations</h2>
          <p>
            In no event shall Nomadiqe or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Nomadiqe&apos;s website.
          </p>

          <h2>5. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at legal@nomadiqe.com.
          </p>
        </div>
      </div>
    </div>
  )
}