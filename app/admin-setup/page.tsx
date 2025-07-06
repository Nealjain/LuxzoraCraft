'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, User, CheckCircle, AlertCircle } from 'lucide-react'

export default function AdminSetupPage() {
  const [email, setEmail] = useState('')
  const [secret, setSecret] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/promote-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, secret }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setIsSuccess(true)
        setEmail('')
        setSecret('')
      } else {
        setMessage(data.message)
        setIsSuccess(false)
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
      setIsSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-dark rounded-lg p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-serif text-accent mb-2">
              LuxZoraCraft Admin Setup
            </h1>
            <p className="text-gray-300 text-sm">
              Promote a user to admin status
            </p>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-6 p-4 rounded-lg flex items-center ${
                isSuccess
                  ? 'bg-green-900/50 border border-green-500 text-green-300'
                  : 'bg-red-900/50 border border-red-500 text-red-300'
              }`}
            >
              {isSuccess ? (
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              )}
              <span className="text-sm">{message}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-accent-light mb-2">
                User Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-primary border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-white placeholder-gray-400"
                  placeholder="admin@luxzoracraft.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="secret" className="block text-sm font-medium text-accent-light mb-2">
                Admin Secret
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="secret"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-primary border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-white placeholder-gray-400"
                  placeholder="Enter admin secret"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Default: luxzora-admin-secret-2024
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent hover:bg-accent-light text-primary py-3 px-4 rounded-md font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Promoting User...' : 'Promote to Admin'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-primary rounded-lg border border-accent/20">
            <h3 className="text-sm font-semibold text-accent mb-2">Instructions:</h3>
            <ol className="text-xs text-gray-300 space-y-1">
              <li>1. Register/login with the email you want to make admin</li>
              <li>2. Enter that email address above</li>
              <li>3. Use the default secret or set ADMIN_PROMOTION_SECRET in .env</li>
              <li>4. Click "Promote to Admin"</li>
              <li>5. Login again to access admin dashboard at /admin</li>
            </ol>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-accent hover:text-accent-light transition-colors"
            >
              ← Back to LuxZoraCraft
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
