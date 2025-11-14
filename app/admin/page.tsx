import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

  // Check if user is authenticated
  if (authError || !authUser) {
    redirect('/auth/signin?callbackUrl=/admin')
  }

  // Get user data with role
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (userError || !user) {
    redirect('/auth/signin?callbackUrl=/admin')
  }

  // Check if user is an admin
  if (user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return <AdminDashboard user={user} />
}
