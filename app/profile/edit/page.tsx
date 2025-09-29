import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import EditProfileForm from './profile-form'

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      fullName: true,
      username: true,
      image: true,
      profilePictureUrl: true,
      bio: true,
      location: true,
      phone: true,
    }
  })

  if (!user) {
    redirect('/auth/signin')
  }

  return <EditProfileForm user={user} />
}



