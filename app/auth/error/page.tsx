'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import { Suspense } from 'react'

const errorMessages: { [key: string]: string } = {
  AccessDenied: 'Access was denied. You may not have permission to sign in.',
  Configuration: 'There is a problem with the server configuration.',
  Verification: 'The verification token has expired or has already been used.',
  Default: 'An error occurred during authentication.',
}

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'Default'
  
  const errorMessage = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-dark rounded-lg p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-serif text-white mb-4">
            Authentication Error
          </h1>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            {errorMessage}
          </p>
          
          <div className="space-y-3">
            <Link 
              href="/login"
              className="w-full bg-accent hover:bg-accent-light text-primary py-3 px-4 rounded-md font-semibold transition-colors duration-300 flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </Link>
            
            <Link 
              href="/"
              className="w-full bg-transparent border border-accent text-accent hover:bg-accent hover:text-primary py-3 px-4 rounded-md font-semibold transition-colors duration-300 flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
          </div>
          
          {error === 'AccessDenied' && (
            <div className="mt-6 p-4 bg-yellow-900/50 border border-yellow-500 rounded-lg">
              <p className="text-yellow-300 text-sm">
                <strong>Tip:</strong> Make sure you're using the correct Google account and that your email is registered with us.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-accent">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}
