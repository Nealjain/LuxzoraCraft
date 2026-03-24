'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="card p-8 text-center"
    >
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 mb-6 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        
        <h3 className="text-xl font-serif text-white mb-2">Your cart is empty</h3>
        <p className="text-gray-400 mb-6">
          Looks like you haven't added any items to your cart yet.
        </p>
        
        <Link href="/shop" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    </motion.div>
  )
}