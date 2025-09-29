import { getServerSession } from "next-auth"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import AppleProvider from "next-auth/providers/apple"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Social Authentication Providers
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    ...(process.env.APPLE_ID && process.env.APPLE_SECRET ? [
      AppleProvider({
        clientId: process.env.APPLE_ID,
        clientSecret: process.env.APPLE_SECRET,
      })
    ] : []),
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET ? [
      FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      })
    ] : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase()
            }
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          }
        } catch (error) {
          console.error('Error in authorize:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role
      }
      
      // Handle OAuth account linking
      if (account?.provider === 'google') {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email! }
          })
          if (dbUser) {
            token.role = dbUser.role
          }
        } catch (error) {
          console.error('Error fetching user role:', error)
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider && ['google', 'apple', 'facebook'].includes(account.provider)) {
        try {
          // Check if user exists, if not create with default role
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })
          
          if (!existingUser) {
            // Create user with social OAuth - start with GUEST role and onboarding
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || '',
                image: user.image || '',
                role: 'GUEST',
                emailVerified: new Date(),
                onboardingStatus: 'PENDING'
              }
            })
          }
        } catch (error) {
          console.error(`Error in ${account.provider} signIn callback:`, error)
          return false
        }
      }
      
      return true
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    newUser: "/onboarding/profile-setup", // Redirect new users to onboarding
  },
  events: {
    async signIn(message) {
      console.log('User signed in:', message.user.email)
    },
    async signOut(message) {
      console.log('User signed out:', message.token?.email)
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        bio: true,
        location: true,
        phone: true,
        isVerified: true,
        createdAt: true,
        hostProfile: true,
        travelerProfile: true,
      },
    })

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions')
  }
  return user
}

export async function requireHost() {
  return requireRole(['HOST', 'ADMIN'])
}

export async function requireAdmin() {
  return requireRole(['ADMIN'])
}
