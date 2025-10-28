import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    role?: string
    onboardingStatus?: string
    onboardingStep?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string
      image?: string
      role: string
      onboardingStatus?: string
      onboardingStep?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    onboardingStatus?: string
    onboardingStep?: string
  }
}
