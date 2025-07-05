'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Minus, Plus, ShoppingBag, Heart } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { Product } from '@/types/product'
import { formatPrice } from '@/lib/utils'

// Dynamically import Spline component to avoid SSR issues
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64 bg-gray-dark rounded-lg">
      <p className="text-gray-400">Loading 3D Model...</p>
    </div>
  ),
})

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [showSpline, setShowSpline] = useState(false)
  
  const { addItem } = useCart()
  
  const handleQuantityChange = (value: number) => {
    if (value < 1) return
    if (value > product.stock) return
    setQuantity(value)
  }
  
  const handleAddToCart = () => {
    addItem(product, quantity)
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {/* Product Images */}
      <div>
        <div className="mb-4 rounded-lg overflow-hidden aspect-square">
          {showSpline && product.spline_model ? (
            <Suspense fallback={<div className="h-full bg-gray-dark animate-pulse" />}>
              <Spline scene={product.spline_model} />
            </Suspense>
          ) : (
            <img 
              src={product.images[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className="flex space-x-4">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveImage(index)
                setShowSpline(false)
              }}
              className={`w-20 h-20 rounded-md overflow-hidden ${
                activeImage === index && !showSpline ? 'ring-2 ring-accent' : ''
              }`}
            >
              <img 
                src={image} 
                alt={`${product.name} - View ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
          
          {product.spline_model && (
            <button
              onClick={() => setShowSpline(true)}
              className={`w-20 h-20 rounded-md overflow-hidden bg-gray-dark flex items-center justify-center ${
                showSpline ? 'ring-2 ring-accent' : ''
              }`}
            >
              <span className="text-xs text-center text-accent">3D View</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Product Info */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-2">
            {product.name}
          </h1>
          
          <p className="text-2xl text-accent font-medium mb-6">
            {formatPrice(product.price)}
          </p>
          
          <div className="border-t border-b border-white/10 py-4 my-6">
            <p className="text-gray-300">
              {product.description}
            </p>
          </div>
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <p className="text-white mb-2">Quantity</p>
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="w-10 h-10 bg-gray-dark flex items-center justify-center rounded-l-md"
              >
                <Minus size={16} />
              </button>
              
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-16 h-10 bg-gray-dark text-center border-x border-white/10"
              />
              
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="w-10 h-10 bg-gray-dark flex items-center justify-center rounded-r-md"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          {/* Stock Status */}
          <p className="text-sm mb-6">
            {product.stock > 0 ? (
              <span className="text-green-400">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-400">Out of Stock</span>
            )}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              Add to Cart
            </button>
            
            <button className="btn btn-outline flex items-center justify-center gap-2">
              <Heart size={18} />
              Add to Wishlist
            </button>
          </div>
          
          {/* Additional Info */}
          <div className="mt-8 space-y-4">
            <div>
              <h3 className="text-white font-medium mb-1">Category</h3>
              <p className="text-gray-300 capitalize">{product.category}</p>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-1">SKU</h3>
              <p className="text-gray-300">{product.id}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}