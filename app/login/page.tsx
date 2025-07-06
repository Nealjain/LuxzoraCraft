'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AddressCollection from '@/components/auth/AddressCollection'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [isFirstTimeGoogleUser, setIsFirstTimeGoogleUser] = useState(false)
  
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Check if this is a first-time Google user needing address collection
      const shouldCollectAddress = 
        !localStorage.getItem('address_collection_skipped') &&
        !localStorage.getItem('address_collected') &&
        isFirstTimeGoogleUser
      
      if (shouldCollectAddress) {
        setShowAddressModal(true)
      } else {
        router.push(redirect)
      }
    }
  }, [status, session, router, redirect, isFirstTimeGoogleUser])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    
    if (result?.error) {
      setError(result.error)
    } else if (result?.ok) {
      router.push(redirect)
    }
    setIsLoading(false)
  }
  
  const handleGoogleSignIn = () => {
    setIsFirstTimeGoogleUser(true)
    signIn('google', { callbackUrl: redirect })
  }
  
  const handleAddressSubmit = (address: any) => {
    localStorage.setItem('address_collected', 'true')
    setShowAddressModal(false)
    router.push(redirect)
  }
  
  const handleAddressModalClose = () => {
    setShowAddressModal(false)
    router.push(redirect)
  }
  
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading-logo">
          <img src="/images/logo.png" alt="Loading" width={100} height={100} />
        </div>
      </div>
    )
  }
  
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="card p-8">
            <h1 className="text-3xl font-serif mb-6 text-center gold-text">Login</h1>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-1 text-sm">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block mb-1 text-sm">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full"
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={handleGoogleSignIn}
                className="btn btn-outline w-full flex items-center justify-center"
              >
                <img src="/images/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
                Sign in with Google
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">Don't have an account? <Link href="/register" className="text-accent hover:underline">Register</Link></p>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
      
      {/* Address Collection Modal */}
      <AddressCollection
        isOpen={showAddressModal}
        onClose={handleAddressModalClose}
        onSubmit={handleAddressSubmit}
      />
    </main>
  )
}
