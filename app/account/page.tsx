'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AccountTabs from '@/components/account/AccountTabs'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/account')
    }
  }, [status, router])
  
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading-logo">
          <img src="/images/logo.png" alt="Loading" width={100} height={100} />
        </div>
      </div>
    )
  }
  
  if (!session) {
    return null
  }
  
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif mb-8 gold-text">My Account</h1>
        <AccountTabs />
      </div>
      
      <Footer />
    </main>
  )
}