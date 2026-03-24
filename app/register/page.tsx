'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'

function RegisterContent() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [dob, setDob] = useState('')
  const [address, setAddress] = useState('')
  const [roomNumber, setRoomNumber] = useState('')
  const [buildingName, setBuildingName] = useState('')
  const [location, setLocation] = useState('')
  const [isLocating, setIsLocating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLocateMe = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
          setIsLocating(false);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError('Unable to retrieve your location.');
          setIsLocating(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setIsLocating(false);
    }
  };
  
  useEffect(() => {
    if (status === 'authenticated') {
      router.push(redirect)
    }
  }, [status, router, redirect])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, dob, address, roomNumber, buildingName, location, phoneNumber }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }
      
      // Sign in after successful registration
      await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      
      router.push(redirect)
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
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
            <h1 className="text-3xl font-serif mb-6 text-center gold-text">Create Account</h1>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 text-sm">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input w-full"
                  required
                />
              </div>
              
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
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-accent mt-1 focus:outline-none"
                >
                  {showPassword ? 'Hide' : 'Show'} Password
                </button>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block mb-1 text-sm">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input w-full"
                  required
                  minLength={6}
                />
              </div>





              <div>
                <label htmlFor="phoneNumber" className="block mb-1 text-sm">Phone Number</label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label htmlFor="dob" className="block mb-1 text-sm">Date of Birth</label>
                <input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block mb-1 text-sm">Street Address</label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="roomNumber" className="block mb-1 text-sm">Room Number / Apartment</label>
                <input
                  id="roomNumber"
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="input w-full"
                />
              </div>

              <div>
                <label htmlFor="buildingName" className="block mb-1 text-sm">Building Name (Optional)</label>
                <input
                  id="buildingName"
                  type="text"
                  value={buildingName}
                  onChange={(e) => setBuildingName(e.target.value)}
                  className="input w-full"
                />
              </div>

              <div>
                <label htmlFor="location" className="block mb-1 text-sm">Location</label>
                <div className="flex items-center space-x-2">
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input w-full"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleLocateMe}
                    className="btn btn-secondary flex-shrink-0"
                    disabled={isLocating}
                  >
                    {isLocating ? 'Locating...' : 'Locate Me'}
                  </button>
                </div>
              </div>
              
              <div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-300">
                Already have an account?{' '}
                <Link href="/login" className="text-accent hover:underline">
                  Sign in
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

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-accent">Loading...</div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
