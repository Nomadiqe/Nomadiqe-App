import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  // Check if user is authenticated
  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/admin')
  }

  // Check if user is an admin
  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return <AdminDashboard user={session.user} />
}
