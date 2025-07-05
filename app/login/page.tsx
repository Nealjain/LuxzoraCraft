'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
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
  
  useEffect(() => {
    if (status === 'authenticated') {
      router.push(redirect)
    }
  }, [status, router, redirect])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      
      if (result?.error) {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: redirect })
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
            <h1 className="text-3xl font-serif mb-6 text-center gold-text">Sign In</h1>
            
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
              
              <div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-300">Or sign in with</p>
              <button 
                onClick={handleGoogleSignIn}
                className="mt-2 btn btn-outline w-full flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
                Google
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-300">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-accent hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </main>
  )
}