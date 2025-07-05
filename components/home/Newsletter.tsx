'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Please enter your email address')
      return
    }
    
    setIsSubmitting(true)
    setError('')
    
    // Simulate API call
    try {
      // In a real app, this would be an API call to subscribe the user
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSuccess(true)
      setEmail('')
    } catch (err) {
      setError('Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <section ref={sectionRef} className="py-16">
      <div className="glass-panel p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-serif gold-text mb-4"
          >
            Subscribe to Our Newsletter
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-300 mb-8"
          >
            Stay updated with our latest collections, exclusive offers, and jewelry care tips.
          </motion.p>
          
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-accent/20 border border-accent text-white p-4 rounded-md"
            >
              <p>Thank you for subscribing to our newsletter!</p>
            </motion.div>
          ) : (
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-grow">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 px-4 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                />
                {error && <p className="text-red-400 text-sm mt-1 text-left">{error}</p>}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary whitespace-nowrap"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  )
}