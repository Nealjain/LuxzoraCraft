'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { Product } from '@/types/product'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addItem } = useCart()
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link href={`/product/${product.slug}`}>
        <div 
          className="relative overflow-hidden rounded-lg aspect-square mb-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${product.images[0]})` }}
          />
          
          {/* Overlay */}
          <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isHovered ? 'opacity-40' : 'opacity-0'}`} />
          
          {/* Quick actions */}
          <div className={`absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              onClick={handleAddToCart}
              className="bg-accent text-primary p-3 rounded-full hover:bg-accent-light transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingBag size={20} />
            </button>
            
            <button 
              onClick={() => window.location.href = `/product/${product.slug}`}
              className="bg-white text-primary p-3 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Quick view"
            >
              <Eye size={20} />
            </button>
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-white group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        
        <p className="text-accent font-medium mt-1">
          {formatPrice(product.price)}
        </p>
      </Link>
    </motion.div>
  )
}