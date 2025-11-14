import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FindInfluencersView } from '@/components/host/find-influencers-view'

export default async function FindInfluencersPage() {
  const supabase = await createClient()

  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

  if (authError || !authUser) {
    redirect('/auth/signin')
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, role')
    .eq('id', authUser.id)
    .single()

  if (userError || !user) {
    redirect('/auth/signin')
  }

  if (user.role !== 'HOST') {
    redirect('/dashboard')
  }

  return <FindInfluencersView />
}

