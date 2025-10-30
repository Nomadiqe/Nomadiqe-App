"use client"

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  User,
  LogOut,
  Heart,
  Menu,
  X,
  Home,
  Compass,
  Shield,
  Search,
  Plus,
  Moon,
  Sun,
  Briefcase
} from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import PointsDisplay from './points/PointsDisplay'
import DailyCheckIn from './points/DailyCheckIn'

export function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  // Hide navigation on auth pages (signin, signup, etc.)
  const isAuthPage = pathname?.startsWith('/auth/')
  if (isAuthPage) {
    return null
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  // Get the appropriate home URL based on user role
  const getHomeHref = () => {
    if (!session) return '/'
    switch (session.user.role) {
      case 'HOST':
        return '/dashboard/host'
      case 'GUEST':
        return '/dashboard/guest'
      case 'INFLUENCER':
        return '/dashboard/influencer'
      case 'TRAVELER':
      default:
        return '/dashboard'
    }
  }

  // Desktop navigation items - filter based on authentication
  const navItems = session ? [
    { href: getHomeHref(), label: 'Home', icon: Home },
    { href: '/', label: 'Discover', icon: Compass },
    { href: '/search', label: 'Explore', icon: Search },
    { href: `/profile/${session.user.id}`, label: 'Profile', icon: User },
  ] : [
    { href: '/', label: 'Discover', icon: Compass },
    { href: '/search', label: 'Explore', icon: Search },
  ]

  // Mobile navigation items - filter based on authentication
  const mobileNavItems = session ? [
    { href: getHomeHref(), label: 'Home', icon: Home },
    { href: '/', label: 'Discover', icon: Compass },
  ] : [
    { href: '/', label: 'Discover', icon: Compass },
  ]

  const mobileNavItemsRight = session ? [
    { href: '/search', label: 'Explore', icon: Search },
    { href: `/profile/${session.user.id}`, label: 'Profile', icon: User },
  ] : [
    { href: '/search', label: 'Explore', icon: Search },
  ]

  return (
    <>
      {/* Desktop Header Navigation */}
      <nav className="hidden md:block bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50" style={{ WebkitBackdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/nomadiqe-logo-transparent.png"
                alt="Nomadiqe Logo"
                className="w-8 h-auto object-contain"
              />
              <span className="text-xl font-bold text-primary">
                Nomadiqe
                <sup className="text-[0.5em] ml-1 font-semibold text-muted-foreground">BETA</sup>
              </span>
            </Link>

            {/* Desktop Navigation Items */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:text-primary hover:bg-accent"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
              {session && (
                <Link
                  href="/create-post"
                  className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Create Post</span>
                </Link>
              )}
            </div>

            {/* Desktop Right Menu */}
            <div className="flex items-center space-x-3">
              {session ? (
                <>
                  <PointsDisplay />
                  <div className="relative group">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <Menu className="w-4 h-4" />
                    </Button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-1">
                        {session.user?.role === 'ADMIN' && (
                          <Link href="/admin">
                            <div className="block px-4 py-2 text-sm text-foreground hover:bg-accent flex items-center">
                              <Shield className="h-4 w-4 mr-3" />
                              Admin
                            </div>
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent flex items-center"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[1100] bg-background border-t border-border">
        <div className="flex items-center justify-between h-16 px-2">
          {/* Left Navigation Items */}
          <div className="flex items-center justify-around flex-1">
            {mobileNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-md transition-colors min-w-[60px]",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Center Create Post Button */}
          {session && (
            <Link
              href="/create-post"
              className="flex items-center justify-center w-14 h-14 -mt-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </Link>
          )}

          {/* Right Navigation Items */}
          <div className="flex items-center justify-around flex-1">
            {mobileNavItemsRight.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-md transition-colors min-w-[60px]",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar with Logo and Menu */}
      <nav className="md:hidden bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-40" style={{ WebkitBackdropFilter: 'blur(12px)' }}>
        <div className="flex justify-between items-center h-16 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nomadiqe-logo-transparent.png"
              alt="Nomadiqe Logo"
              className="w-8 h-auto object-contain"
            />
            <span className="text-xl font-bold text-primary">Nomadiqe</span>
          </Link>

          {/* Mobile Right Menu */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-border py-3">
            <div className="flex flex-col space-y-1 px-2">
              {session ? (
                <>
                  {session.user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="text-foreground hover:text-primary transition-colors py-2.5 px-3 rounded-md hover:bg-accent flex items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Shield className="h-4 w-4 mr-3" />
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/host"
                    className="text-foreground hover:text-primary transition-colors py-2.5 px-3 rounded-md hover:bg-accent flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Briefcase className="h-4 w-4 mr-3" />
                    Host Mode
                  </Link>
                  <button
                    onClick={() => {
                      setTheme(theme === 'light' ? 'dark' : 'light')
                      setIsMobileMenuOpen(false)
                    }}
                    className="text-left text-foreground hover:text-primary transition-colors py-2.5 px-3 rounded-md hover:bg-accent w-full flex items-center"
                  >
                    {theme === 'light' ? (
                      <>
                        <Moon className="h-4 w-4 mr-3" />
                        Dark Mode
                      </>
                    ) : (
                      <>
                        <Sun className="h-4 w-4 mr-3" />
                        Light Mode
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMobileMenuOpen(false)
                    }}
                    className="text-left text-foreground hover:text-primary transition-colors py-2.5 px-3 rounded-md hover:bg-accent w-full flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/host"
                    className="text-foreground hover:text-primary transition-colors py-2.5 px-3 rounded-md hover:bg-accent flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Briefcase className="h-4 w-4 mr-3" />
                    Host Mode
                  </Link>
                  <button
                    onClick={() => {
                      setTheme(theme === 'light' ? 'dark' : 'light')
                      setIsMobileMenuOpen(false)
                    }}
                    className="text-left text-foreground hover:text-primary transition-colors py-2.5 px-3 rounded-md hover:bg-accent w-full flex items-center"
                  >
                    {theme === 'light' ? (
                      <>
                        <Moon className="h-4 w-4 mr-3" />
                        Dark Mode
                      </>
                    ) : (
                      <>
                        <Sun className="h-4 w-4 mr-3" />
                        Light Mode
                      </>
                    )}
                  </button>
                  <div className="flex flex-col space-y-2 pt-2">
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

    </>
  )
}
