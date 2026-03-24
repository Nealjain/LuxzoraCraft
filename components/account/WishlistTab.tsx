'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, X } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { Product } from '@/types/product'
import { formatPrice } from '@/lib/utils'

export default function WishlistTab() {
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const { addItem } = useCart()
  
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockWishlist: Product[] = [
          {
            id: '3',
            name: 'Crystal Drop Earrings',
            slug: 'crystal-drop-earrings',
            description: 'Stunning drop earrings featuring sparkling crystals that catch the light beautifully.',
            price: 1499,
            images: ['/images/products/earrings-1.jpg'],
            category: 'earrings',
            stock: 12,
            featured: true,
          },
          {
            id: '5',
            name: 'Statement Collar Necklace',
            slug: 'statement-collar-necklace',
            description: 'A bold and elegant collar necklace that makes a statement with any outfit.',
            price: 1899,
            images: ['/images/products/necklace-2.jpg'],
            category: 'necklaces',
            stock: 10,
            featured: false,
          },
        ]
        
        setWishlist(mockWishlist)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching wishlist:', error)
        setIsLoading(false)
      }
    }
    
    fetchWishlist()
  }, [])
  
  const handleRemoveFromWishlist = (productId: string) => {
    setWishlist(wishlist.filter(item => item.id !== productId))
  }
  
  const handleAddToCart = (product: Product) => {
    addItem(product)
  }
  
  if (isLoading) {
    return (
      <div className="card p-6">
        <h3 className="text-xl font-serif text-white mb-6">My Wishlist</h3>
        <div className="flex justify-center items-center h-64">
          <div className="loading-logo">
            <img src="/images/logo.png" alt="Loading" width={60} height={60} />
          </div>
        </div>
      </div>
    )
  }
  
  if (wishlist.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-xl font-serif text-white mb-6">My Wishlist</h3>
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Your wishlist is empty.</p>
          <Link href="/shop" className="btn btn-primary">
            Discover Products
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="card p-6">
      <h3 className="text-xl font-serif text-white mb-6">My Wishlist</h3>
      
      <div className="grid grid-cols-1 gap-6">
        {wishlist.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col sm:flex-row items-center border border-white/10 rounded-lg p-4"
          >
            <div className="w-24 h-24 rounded-md overflow-hidden mb-4 sm:mb-0 sm:mr-6">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-grow text-center sm:text-left">
              <Link 
                href={`/product/${product.slug}`}
                className="text-lg text-white hover:text-accent transition-colors"
              >
                {product.name}
              </Link>
              <p className="text-accent font-medium mt-1">
                {formatPrice(product.price)}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
              <button
                onClick={() => handleAddToCart(product)}
                className="btn btn-primary flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingBag size={16} />
                Add to Cart
              </button>
              
              <button
                onClick={() => handleRemoveFromWishlist(product.id)}
                className="text-gray-400 hover:text-red-400 transition-colors"
                aria-label="Remove from wishlist"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}