import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Redirect completed users away from onboarding pages
    if (pathname.startsWith('/onboarding') && token?.onboardingStatus === 'COMPLETED') {
      const dashboardUrl = token.role === 'HOST' ? '/dashboard/host'
        : token.role === 'INFLUENCER' ? '/dashboard/influencer'
        : token.role === 'DIGITAL_CREATOR' ? '/dashboard/creator'
        : '/dashboard'
      return NextResponse.redirect(new URL(dashboardUrl, req.url))
    }

    // Skip middleware for onboarding-related API paths
    if (pathname.startsWith('/api/onboarding')) {
      return NextResponse.next()
    }

    // Check if authenticated user needs onboarding
    if (token && !pathname.startsWith('/onboarding')) {
      // Redirect to user type selection if user hasn't completed onboarding
      if (token.onboardingStatus !== 'COMPLETED') {
        // If user is on default TRAVELER role and hasn't been through user type selection
        if (token.role === 'TRAVELER' && !pathname.includes('/onboarding/user-type')) {
          return NextResponse.redirect(new URL('/onboarding/user-type', req.url))
        }
        // If user has completed user type selection but not profile setup
        else if (token.role !== 'TRAVELER' && !pathname.includes('/onboarding/profile-setup')) {
          return NextResponse.redirect(new URL('/onboarding/profile-setup', req.url))
        }
      }
    }

    // Check if user is trying to access admin routes
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Check if user is trying to access host routes without being a host
    if (pathname.startsWith('/host') && !['HOST', 'ADMIN'].includes(token?.role as string)) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Check if user is trying to access creator routes without being a creator
    if (pathname.startsWith('/creator') && !['DIGITAL_CREATOR', 'ADMIN'].includes(token?.role as string)) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow access to public routes
        if (
          pathname === '/' ||
          pathname.startsWith('/auth') ||
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/onboarding') ||
          pathname.startsWith('/api/onboarding') ||
          pathname.startsWith('/search') ||
          pathname.startsWith('/explore') ||
          pathname.startsWith('/experiences') ||
          pathname.startsWith('/property/') ||
          pathname.startsWith('/terms') ||
          pathname.startsWith('/privacy') ||
          pathname.startsWith('/_next') ||
          pathname.startsWith('/favicon')
        ) {
          return true
        }

        // Require authentication for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf)).*)',
  ],
}
