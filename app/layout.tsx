import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/auth-provider'
import { Navigation } from '@/components/navigation'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Nomadiqe - Fairer Stays, Deeper Connections',
  description: 'Revolutionary travel booking platform with blockchain integration, low fees, and authentic local experiences.',
  keywords: 'travel, booking, blockchain, crypto, accommodation, local experiences',
  authors: [{ name: 'Nomadiqe Team' }],
  openGraph: {
    title: 'Nomadiqe - Fairer Stays, Deeper Connections',
    description: 'Revolutionary travel booking platform with blockchain integration, low fees, and authentic local experiences.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nomadiqe - Fairer Stays, Deeper Connections',
    description: 'Revolutionary travel booking platform with blockchain integration, low fees, and authentic local experiences.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navigation />
            <main>
              {children}
            </main>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
