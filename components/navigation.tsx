"use client"

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  Search, 
  User, 
  LogOut, 
  Settings, 
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
    <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-nomadiqe-primary to-nomadiqe-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xl font-bold nomadiqe-gradient-text">Nomadiqe</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/search" 
              className="text-foreground hover:text-primary transition-colors"
            >
              Explore
            </Link>
            <Link 
              href="/about" 
              className="text-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link 
              href="/host" 
              className="text-foreground hover:text-primary transition-colors"
            >
              Become a Host
            </Link>
          </div>

          {/* Search Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/search')}
            className="hidden sm:flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </Button>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/favorites">
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                </Link>
                
                <div className="relative group">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:block">{session.user?.name}</span>
                  </Button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <Link href="/dashboard">
                        <div className="block px-4 py-2 text-sm text-foreground hover:bg-accent">
                          Dashboard
                        </div>
                      </Link>
                      <Link href="/profile">
                        <div className="block px-4 py-2 text-sm text-foreground hover:bg-accent">
                          Profile
                        </div>
                      </Link>
                      <Link href="/settings">
                        <div className="block px-4 py-2 text-sm text-foreground hover:bg-accent">
                          Settings
                        </div>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
              <Link 
                href="/search" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Explore
              </Link>
              <Link 
                href="/about" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/host" 
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Become a Host
              </Link>
              {session ? (
                <>
                  <Link 
                    href="/favorites" 
                    className="text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Favorites
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMobileMenuOpen(false)
                    }}
                    className="text-left text-foreground hover:text-primary transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button variant="ghost" asChild>
                    <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild>
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
