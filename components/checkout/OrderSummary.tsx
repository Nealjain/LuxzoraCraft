'use client'

import { motion } from 'framer-motion'
import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/utils'

export default function OrderSummary() {
  const { items, getTotalPrice } = useCart()
  
  const subtotal = getTotalPrice()
  const shipping = subtotal > 0 ? 99 : 0
  const total = subtotal + shipping
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card p-6"
    >
      <h3 className="text-xl font-serif text-white mb-6">Order Summary</h3>
      
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                <img 
                  src={item.images[0]} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-white">{item.name}</p>
                <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
              </div>
            </div>
            <span className="text-accent">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>
      
      <div className="border-t border-white/10 pt-4 space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-300">Subtotal</span>
          <span className="text-white">{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-300">Shipping</span>
          <span className="text-white">{shipping > 0 ? formatPrice(shipping) : 'Free'}</span>
        </div>
        
        <div className="border-t border-white/10 pt-4 flex justify-between">
          <span className="text-lg text-white">Total</span>
          <span className="text-lg text-accent font-medium">{formatPrice(total)}</span>
        </div>
      </div>
    </motion.div>
  )
}