import { Metadata } from 'next'
import Link from 'next/link'
import { BackButton } from '@/components/back-button'

export const metadata: Metadata = {
  title: 'Terms of Service | Nomadiqe',
  description: 'Terms of Service for Nomadiqe - Read our terms and conditions for using the Nomadiqe platform.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <BackButton label="Back" variant="ghost" size="sm" />
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              By accessing and using Nomadiqe (&quot;the Platform&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Platform.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nomadiqe is a platform that connects property hosts with guests, and facilitates collaborations between hosts and influencers for promotional purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
            <h3 className="text-xl font-semibold mb-3">2.1 Account Creation</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To use certain features of the Platform, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your password</li>
              <li>Accept all responsibility for activity that occurs under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">2.2 Account Types</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nomadiqe offers three types of accounts:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Guest:</strong> Users who book accommodations through the Platform</li>
              <li><strong>Host:</strong> Users who list properties for rent</li>
              <li><strong>Influencer:</strong> Content creators who collaborate with hosts for promotional purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Booking and Reservations</h2>
            <h3 className="text-xl font-semibold mb-3">3.1 For Guests</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>All bookings are subject to availability and host acceptance</li>
              <li>Payment is required at the time of booking</li>
              <li>Cancellation policies are set by individual hosts</li>
              <li>You agree to leave the property in the same condition as you found it</li>
              <li>You agree to comply with all house rules set by the host</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">3.2 For Hosts</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>You must have the legal right to rent the property you list</li>
              <li>All property listings must be accurate and not misleading</li>
              <li>You are responsible for setting your own prices and availability</li>
              <li>You agree to honor confirmed bookings</li>
              <li>You are responsible for compliance with local laws and regulations, including tax obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
            <h3 className="text-xl font-semibold mb-3">4.1 Service Fees</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nomadiqe charges service fees for facilitating bookings. These fees are clearly displayed before you confirm a booking and are non-refundable except as required by law.
            </p>

            <h3 className="text-xl font-semibold mb-3">4.2 Payment Processing</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Payments are processed through our third-party payment provider, Stripe. By making a payment, you agree to Stripe&apos;s terms of service and privacy policy.
            </p>

            <h3 className="text-xl font-semibold mb-3">4.3 Host Payouts</h3>
            <p className="text-muted-foreground leading-relaxed">
              Hosts will receive payment through Stripe Connect. Payouts are typically processed 24 hours after guest check-in, subject to Stripe&apos;s processing times and any applicable holds or disputes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Influencer Collaborations</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nomadiqe facilitates collaborations between hosts and influencers. Both parties agree to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Clearly define collaboration terms before acceptance</li>
              <li>Honor agreed-upon deliverables and timelines</li>
              <li>Disclose sponsored content in accordance with FTC guidelines and local advertising laws</li>
              <li>Maintain professional conduct throughout the collaboration</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. User Conduct</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful code or malware</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Attempt to circumvent the Platform for direct bookings or payments</li>
              <li>Create fake or misleading listings</li>
              <li>Engage in price manipulation or fraudulent activity</li>
              <li>Share login credentials or allow unauthorized access to your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Content and Intellectual Property</h2>
            <h3 className="text-xl font-semibold mb-3">7.1 User Content</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You retain ownership of content you upload to the Platform (photos, descriptions, reviews, etc.). By uploading content, you grant Nomadiqe a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content in connection with operating the Platform.
            </p>

            <h3 className="text-xl font-semibold mb-3">7.2 Platform Content</h3>
            <p className="text-muted-foreground leading-relaxed">
              The Nomadiqe name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Nomadiqe. You may not use such marks without our prior written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Privacy and Data Protection</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Your privacy is important to us. Please review our{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              {' '}to understand how we collect, use, and protect your personal information. By using the Platform, you consent to the collection and use of your data as described in our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Disclaimers and Limitation of Liability</h2>
            <h3 className="text-xl font-semibold mb-3">9.1 Platform &quot;As Is&quot;</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The Platform is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. Nomadiqe does not warrant that the Platform will be uninterrupted, error-free, or free of viruses or other harmful components.
            </p>

            <h3 className="text-xl font-semibold mb-3">9.2 Third-Party Services</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nomadiqe acts as a marketplace connecting hosts and guests. We are not responsible for the actual accommodation services, which are provided by independent hosts. We do not endorse or guarantee the quality, safety, or legality of any listings.
            </p>

            <h3 className="text-xl font-semibold mb-3">9.3 Limitation of Liability</h3>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, Nomadiqe shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to defend, indemnify, and hold harmless Nomadiqe and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your use of the Platform or violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We reserve the right to suspend or terminate your account and access to the Platform at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Upon termination, your right to use the Platform will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Dispute Resolution</h2>
            <h3 className="text-xl font-semibold mb-3">12.1 Governing Law</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              These Terms shall be governed by and construed in accordance with the laws of Italy, without regard to its conflict of law provisions.
            </p>

            <h3 className="text-xl font-semibold mb-3">12.2 Arbitration</h3>
            <p className="text-muted-foreground leading-relaxed">
              Any disputes arising out of or relating to these Terms or the Platform shall first be attempted to be resolved through good faith negotiations. If negotiations fail, disputes shall be resolved through binding arbitration in accordance with Italian arbitration rules.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by email or through a prominent notice on the Platform. Your continued use of the Platform after such modifications constitutes your acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                Email: legal@nomadiqe.com<br />
                Address: [Company Address to be added]<br />
                Phone: [Contact Number to be added]
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">15. Miscellaneous</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Severability:</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.</li>
              <li><strong>Waiver:</strong> No waiver of any term of these Terms shall be deemed a further or continuing waiver of such term or any other term.</li>
              <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and Nomadiqe regarding the use of the Platform.</li>
              <li><strong>Assignment:</strong> You may not assign or transfer these Terms without our prior written consent. We may assign our rights and obligations without restriction.</li>
            </ul>
          </section>

          <div className="mt-12 p-6 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> This is a template document. Before going live, this should be reviewed and customized by a qualified attorney to ensure compliance with all applicable laws and regulations, including Italian law, EU regulations (GDPR), and any other jurisdictions where Nomadiqe operates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}