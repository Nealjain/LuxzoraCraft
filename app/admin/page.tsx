'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/admin')
      return
    }
    
    // Check if user is admin
    if (session && session.user && !session.user.isAdmin) {
      router.push('/')
    }
  }, [status, session, router])
  
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading-logo">
          <img src="/images/logo.png" alt="Loading" width={100} height={100} />
        </div>
      </div>
    )
  }
  
  if (!session || !session.user.isAdmin) {
    return null
  }
  
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  )
}