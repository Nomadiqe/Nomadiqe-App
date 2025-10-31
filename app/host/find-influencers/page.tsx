import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { FindInfluencersView } from '@/components/host/find-influencers-view'

export default async function FindInfluencersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  })

  if (!user) {
    redirect('/auth/signin')
  }

  if (user.role !== 'HOST') {
    redirect('/dashboard')
  }

  return <FindInfluencersView />
}

