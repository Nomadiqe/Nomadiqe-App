import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow manifest files (must not be intercepted or redirected)
  if (pathname === '/manifest.webmanifest' || pathname === '/manifest.json') {
    return NextResponse.next()
  }

  // Update the session (this refreshes expired tokens)
  let response = await updateSession(request)

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth',
    '/search',
    '/experiences',
    '/property',
    '/terms',
    '/privacy',
  ]

  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // Skip auth check for public routes, API routes, static files, and auth callbacks
  if (
    isPublicRoute ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/auth/callback') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return response
  }

  // Create supabase client to check auth
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // If not authenticated and trying to access protected route, redirect to signin
  if (!user) {
    const redirectUrl = new URL('/auth/signin', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Fetch user profile to check onboarding status and role
  const { data: profile } = await supabase
    .from('users')
    .select('onboardingStatus, role')
    .eq('id', user.id)
    .single()

  if (profile) {
    // Redirect completed users away from onboarding pages
    if (pathname.startsWith('/onboarding') && profile.onboardingStatus === 'COMPLETED') {
      const dashboardUrl = profile.role === 'HOST' ? '/dashboard/host'
        : profile.role === 'INFLUENCER' ? '/dashboard/influencer'
        : '/dashboard'
      return NextResponse.redirect(new URL(dashboardUrl, request.url))
    }

    // Redirect uncompleted users to onboarding (except for public pages)
    if (
      profile.onboardingStatus !== 'COMPLETED' && 
      !pathname.startsWith('/onboarding') && 
      !pathname.startsWith('/api/')
    ) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // Check if user is trying to access admin routes
    if (pathname.startsWith('/admin') && profile.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Check if user is trying to access host routes without being a host
    if (pathname.startsWith('/host') && !['HOST', 'ADMIN'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

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
    '/((?!api|_next/static|_next/image|favicon|manifest\\.webmanifest|manifest\\.json|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf)).*)',
  ],
}
