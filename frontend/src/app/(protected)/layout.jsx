import DashboardLayout from '@/app/(protected)/dashboard/components/DashboardLayout'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'

export default async function Layout({ children }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect('/login')
  }
  return <DashboardLayout>{children}</DashboardLayout>
}
