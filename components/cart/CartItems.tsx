'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Minus, Plus, X } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/utils'

export default function CartItems() {
  const { items, updateItemQuantity, removeItem } = useCart()
  
  if (items.length === 0) {
    return <EmptyCart />
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="card p-6"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/10">
            <tr>
              <th className="text-left py-4 px-2">Product</th>
              <th className="text-center py-4 px-2">Price</th>
              <th className="text-center py-4 px-2">Quantity</th>
              <th className="text-center py-4 px-2">Total</th>
              <th className="text-right py-4 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-white/10">
                <td className="py-4 px-2">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
                      <img 
                        src={item.images[0]} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <Link 
                        href={`/product/${item.slug}`}
                        className="text-white hover:text-accent transition-colors"
                      >
                        {item.name}
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-2 text-center">
                  {formatPrice(item.price)}
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 bg-gray-dark flex items-center justify-center rounded-l-md disabled:opacity-50"
                    >
                      <Minus size={14} />
                    </button>
                    
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="w-12 h-8 bg-gray-dark text-center border-x border-white/10"
                    />
                    
                    <button
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 bg-gray-dark flex items-center justify-center rounded-r-md disabled:opacity-50"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </td>
                <td className="py-4 px-2 text-center text-accent font-medium">
                  {formatPrice(item.price * item.quantity)}
                </td>
                <td className="py-4 px-2 text-right">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    aria-label="Remove item"
                  >
                    <X size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

function EmptyCart() {
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