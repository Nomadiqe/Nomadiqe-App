import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EditProfileForm from './profile-form'

export default async function EditProfilePage() {
  const supabase = await createClient()
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !authUser) {
    redirect('/auth/signin')
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select(`
      id,
      email,
      fullName,
      username,
      profilePictureUrl,
      coverPhotoUrl,
      bio,
      location,
      phone
    `)
    .eq('id', authUser.id)
    .single()

  if (userError || !user) {
    redirect('/auth/signin')
  }

  return <EditProfileForm user={user} />
}



