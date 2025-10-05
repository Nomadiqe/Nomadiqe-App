"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Search,
  User,
  LogOut,
  Heart,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function Navigation() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50" style={{ WebkitBackdropFilter: 'blur(12px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/nomadiqe-logo-transparent.png"
              alt="Nomadiqe Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-xl font-bold text-primary">Nomadiqe</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/search"
              className="text-foreground hover:text-primary transition-colors"
            >
              Explore
            </Link>
            {session?.user?.role !== 'INFLUENCER' && (
              <Link
                href="/host"
                className="text-foreground hover:text-primary transition-colors"
              >
                Become a Host
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            {session ? (
              <>
                <Link href="/favorites" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                </Link>

                <div className="hidden md:block relative group">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{session.user?.name}</span>
                  </Button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <Link href="/dashboard">
                        <div className="block px-4 py-2 text-sm text-foreground hover:bg-accent">
                          Dashboard
                        </div>
                      </Link>
                      <Link href={`/profile/${session.user.id}`}>
                        <div className="block px-4 py-2 text-sm text-foreground hover:bg-accent">
                          Profile
                        </div>
                      </Link>
                      <div className="px-4 py-2">
                        <ThemeToggle />
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-3">
            <div className="flex flex-col space-y-1 px-2">
              <Link
                href="/search"
                className="text-foreground hover:text-primary transition-colors py-2.5 px-3 rounded-md hover:bg-accent flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Search className="h-4 w-4 mr-3" />
                Explore
              </Link>
              {session?.user?.role !== 'INFLUENCER' && (
                <Link
                  href="/host"
                  className="text-foreground hover:text-primary transition-colors py-2.5 px-3 rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Become a Host
                </Link>
              )}
              {session ? (
                <>
                  <Link
                    href="/favorites"
                    className="text-foreground hover:text-primary transition-colors py-2.5 px-3 rounded-md hover:bg-accent flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart className="h-4 w-4 mr-3" />
                    Favorites
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-foreground hover:text-primary transition-colors py-2.5 px-3 rounded-md hover:bg-accent flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Dashboard
                  </Link>
                  <Link
                    href={`/profile/${session.user.id}`}
                    className="text-foreground hover:text-primary transition-colors py-2.5 px-3 rounded-md hover:bg-accent flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </Link>
                  <div className="py-2.5 px-3">
                    <ThemeToggle />
                  </div>
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
                <div className="flex flex-col space-y-2 pt-2">
                  <div className="px-2">
                    <ThemeToggle />
                  </div>
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
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
