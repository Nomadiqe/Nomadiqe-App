import { Metadata } from 'next'
import Link from 'next/link'
import { BackButton } from '@/components/back-button'

export const metadata: Metadata = {
  title: 'Privacy Policy | Nomadiqe',
  description: 'Privacy Policy for Nomadiqe - Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <BackButton label="Back" variant="ghost" size="sm" />
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Welcome to Nomadiqe (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This Privacy Policy complies with the General Data Protection Regulation (GDPR), the Italian Data Protection Code, and other applicable data protection laws. By using Nomadiqe, you consent to the data practices described in this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Data Controller</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The data controller responsible for your personal information is:
            </p>
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="text-sm">
                Nomadiqe<br />
                Email: privacy@nomadiqe.com<br />
                Address: [Company Address to be added]
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Information We Collect</h2>

            <h3 className="text-xl font-semibold mb-3">3.1 Information You Provide to Us</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We collect personal information that you voluntarily provide when you:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li><strong>Create an Account:</strong> Name, email address, password, profile picture, phone number</li>
              <li><strong>Complete Your Profile:</strong> Bio, location, interests, social media links</li>
              <li><strong>List a Property:</strong> Property details, photos, availability, pricing, house rules</li>
              <li><strong>Make a Booking:</strong> Check-in/check-out dates, number of guests, payment information</li>
              <li><strong>Communicate with Us:</strong> Messages, support inquiries, feedback</li>
              <li><strong>Verify Your Identity:</strong> Government-issued ID, verification documents (for hosts)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3.2 Information Collected Automatically</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you use our Platform, we automatically collect certain information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Usage Data:</strong> Pages viewed, time spent on pages, links clicked, search queries</li>
              <li><strong>Location Data:</strong> Approximate location based on IP address (with your consent, precise location from device GPS)</li>
              <li><strong>Cookies and Tracking:</strong> See Section 8 for detailed information</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3.3 Information from Third Parties</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may receive information about you from:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Social Media:</strong> When you sign up using Google, Facebook, or Apple, we receive basic profile information</li>
              <li><strong>Payment Processors:</strong> Stripe provides us with payment confirmation and transaction details</li>
              <li><strong>Verification Services:</strong> Identity verification providers may share verification status</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use your personal information for the following purposes (legal bases under GDPR):
            </p>

            <h3 className="text-xl font-semibold mb-3">4.1 Contract Performance</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Creating and managing your account</li>
              <li>Processing bookings and payments</li>
              <li>Facilitating communication between hosts and guests</li>
              <li>Managing influencer collaborations</li>
              <li>Providing customer support</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">4.2 Legitimate Interests</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Improving and personalizing your experience</li>
              <li>Detecting and preventing fraud, spam, and abuse</li>
              <li>Conducting analytics and research</li>
              <li>Marketing our services (subject to opt-out rights)</li>
              <li>Enforcing our Terms of Service</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">4.3 Legal Obligations</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Complying with applicable laws and regulations</li>
              <li>Responding to legal requests and court orders</li>
              <li>Tax reporting and record-keeping</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">4.4 Consent</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Sending promotional emails and newsletters (you can opt out anytime)</li>
              <li>Using precise location data for location-based features</li>
              <li>Displaying targeted advertisements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. How We Share Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may share your personal information in the following circumstances:
            </p>

            <h3 className="text-xl font-semibold mb-3">5.1 With Other Users</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you make a booking or collaboration, we share necessary information with the host/influencer (name, profile picture, contact details).
            </p>

            <h3 className="text-xl font-semibold mb-3">5.2 With Service Providers</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We work with third-party service providers who process data on our behalf:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li><strong>Payment Processing:</strong> Stripe (for processing payments)</li>
              <li><strong>Cloud Hosting:</strong> Vercel, Supabase (for hosting and database services)</li>
              <li><strong>Email Services:</strong> Resend (for transactional emails)</li>
              <li><strong>Analytics:</strong> Google Analytics (with anonymized IP addresses)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">5.3 For Legal Reasons</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may disclose your information if required by law or to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Comply with legal obligations or court orders</li>
              <li>Protect our rights, property, or safety</li>
              <li>Investigate fraud or security issues</li>
              <li>Enforce our Terms of Service</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">5.4 Business Transfers</h3>
            <p className="text-muted-foreground leading-relaxed">
              If we merge with, are acquired by, or sell assets to another company, your information may be transferred as part of that transaction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. International Data Transfers</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Your information may be transferred to and processed in countries outside the European Economic Area (EEA), including the United States. We ensure appropriate safeguards are in place:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Standard Contractual Clauses approved by the European Commission</li>
              <li>Data Processing Agreements with GDPR-compliant service providers</li>
              <li>Adequacy decisions for certain countries</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We retain your personal information for as long as necessary to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Provide our services and maintain your account</li>
              <li>Comply with legal obligations (e.g., tax records for 10 years)</li>
              <li>Resolve disputes and enforce agreements</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              When you close your account, we will delete or anonymize your personal information within 90 days, except where we must retain it for legal reasons.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li><strong>Essential Cookies:</strong> Required for the Platform to function (login sessions, security)</li>
              <li><strong>Performance Cookies:</strong> Help us understand how users interact with the Platform</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Advertising Cookies:</strong> Deliver relevant ads based on your interests (with consent)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              You can control cookies through your browser settings. Note that disabling cookies may affect Platform functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Your Rights Under GDPR</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              As a user in the EU/EEA, you have the following rights:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li><strong>Right of Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your data (&quot;right to be forgotten&quot;)</li>
              <li><strong>Right to Restriction:</strong> Limit how we process your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for consent-based processing</li>
              <li><strong>Right to Lodge a Complaint:</strong> File a complaint with your national data protection authority</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              To exercise these rights, contact us at privacy@nomadiqe.com. We will respond within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Encryption in transit (HTTPS/TLS) and at rest</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection</li>
              <li>Incident response and breach notification procedures</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              While we strive to protect your data, no method of transmission over the internet is 100% secure. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Children&apos;s Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nomadiqe is not intended for children under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes by email or through a prominent notice on the Platform. Your continued use after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have questions, concerns, or wish to exercise your rights, please contact us:
            </p>
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="text-sm">
                <strong>Email:</strong> privacy@nomadiqe.com<br />
                <strong>Data Protection Officer:</strong> [Name and contact to be added]<br />
                <strong>Address:</strong> [Company Address to be added]
              </p>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              You also have the right to lodge a complaint with the Italian Data Protection Authority (Garante per la protezione dei dati personali) at{' '}
              <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                www.garanteprivacy.it
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Additional Information for California Residents (CCPA)</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Right to know what personal information we collect, use, and share</li>
              <li>Right to delete personal information (subject to exceptions)</li>
              <li>Right to opt-out of the sale of personal information (we do not sell your data)</li>
              <li>Right to non-discrimination for exercising your rights</li>
            </ul>
          </section>

          <div className="mt-12 p-6 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> This is a template document. Before going live, this should be reviewed and customized by a qualified attorney specializing in data protection law to ensure full compliance with GDPR, Italian law, CCPA, and any other applicable regulations. Consider appointing a Data Protection Officer (DPO) if required under GDPR Article 37.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}