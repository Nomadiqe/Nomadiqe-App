'use client'

import { createClient } from './client'

export const signOut = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
}

export const signInWithEmail = async (email: string, password: string) => {
  const supabase = createClient()
  return supabase.auth.signInWithPassword({ email, password })
}

export const signUpWithEmail = async (email: string, password: string, userData?: {
  name?: string
  username?: string
  fullName?: string
}) => {
  const supabase = createClient()
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: userData?.name || userData?.fullName,
        full_name: userData?.fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
    },
  })
}

export const signInWithOAuth = async (provider: 'google' | 'facebook' | 'apple') => {
  const supabase = createClient()
  return supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
    },
  })
}

export const resetPassword = async (email: string) => {
  const supabase = createClient()
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/reset-password`,
  })
}

export const updatePassword = async (newPassword: string) => {
  const supabase = createClient()
  return supabase.auth.updateUser({ password: newPassword })
}

