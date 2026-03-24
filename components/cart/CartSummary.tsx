'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/utils'

export default function CartSummary() {
  const { items, getTotalPrice } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  
  const subtotal = getTotalPrice()
  const shipping = subtotal > 0 ? 99 : 0
  const discount = couponApplied ? couponDiscount : 0
  const total = subtotal + shipping - discount
  
  const handleApplyCoupon = () => {
    if (!couponCode) {
      setCouponError('Please enter a coupon code')
      return
    }
    
    // In a real app, this would be an API call to validate the coupon
    // For now, we'll use a mock coupon code
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setCouponApplied(true)
      setCouponDiscount(subtotal * 0.1) // 10% discount
      setCouponError('')
    } else {
      setCouponApplied(false)
      setCouponDiscount(0)
      setCouponError('Invalid coupon code')
    }
  }
  
  const handleCheckout = () => {
    if (!session) {
      router.push('/login?redirect=/checkout')
    } else {
      router.push('/checkout')
    }
  }
  
  if (items.length === 0) {
    return null
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card p-6"
    >
      <h3 className="text-xl font-serif text-white mb-6">Order Summary</h3>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-300">Subtotal</span>
          <span className="text-white">{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-300">Shipping</span>
          <span className="text-white">{shipping > 0 ? formatPrice(shipping) : 'Free'}</span>
        </div>
        
        {couponApplied && (
          <div className="flex justify-between text-green-400">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        
        <div className="border-t border-white/10 pt-4 flex justify-between">
          <span className="text-lg text-white">Total</span>
          <span className="text-lg text-accent font-medium">{formatPrice(total)}</span>
        </div>
      </div>
      
      {/* Coupon Code */}
      <div className="mb-6">
        <label htmlFor="coupon" className="block text-sm text-gray-300 mb-2">
          Apply Coupon Code
        </label>
        <div className="flex">
          <input
            type="text"
            id="coupon"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-grow py-2 px-3 bg-gray-dark border border-accent/30 rounded-l-md focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            onClick={handleApplyCoupon}
            className="bg-accent text-primary py-2 px-4 rounded-r-md hover:bg-accent-light transition-colors"
          >
            Apply
          </button>
        </div>
        {couponError && (
          <p className="text-red-400 text-sm mt-1">{couponError}</p>
        )}
        {couponApplied && (
          <p className="text-green-400 text-sm mt-1">Coupon applied successfully!</p>
        )}
      </div>
      
      <button
        onClick={handleCheckout}
        className="btn btn-primary w-full"
      >
        Proceed to Checkout
      </button>
    </motion.div>
  )
}