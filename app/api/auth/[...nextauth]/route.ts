import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Only include Google provider if credentials are configured
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
      if (account?.provider === 'google') {
        try {
          // Check if user exists, if not create with default role
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })
          
          if (!existingUser) {
            // Create user with Google OAuth
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || '',
                image: user.image || '',
                role: 'TRAVELER',
                emailVerified: new Date(),
              }
            })
            
            // Create default traveler profile
            await prisma.travelerProfile.create({
              data: {
                userId: newUser.id,
                preferences: {
                  travelStyle: [],
                  interests: [],
                  budgetRange: null,
                  accommodationTypes: []
                }
              }
            })
          }
        } catch (error) {
          console.error('Error in Google signIn callback:', error)
          return false
        }
      }
      
      return true
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
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

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
