'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import ProductCard from '@/components/shop/ProductCard'
import { Product } from '@/types/product'

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Gold-Plated Pendant Necklace',
            slug: 'gold-plated-pendant-necklace',
            description: 'Elegant pendant necklace with a delicate chain, perfect for any occasion.',
            price: 1299,
            images: ['/images/products/necklace-1.jpg'],
            category: 'necklaces',
            stock: 15,
            featured: true,
          },
          {
            id: '2',
            name: 'Twisted Band Ring',
            slug: 'twisted-band-ring',
            description: 'A beautiful twisted band ring that adds a touch of sophistication to your look.',
            price: 899,
            images: ['/images/products/ring-1.jpg'],
            category: 'rings',
            stock: 20,
            featured: true,
          },
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
            id: '4',
            name: 'Layered Chain Bracelet',
            slug: 'layered-chain-bracelet',
            description: 'A stylish layered chain bracelet that adds elegance to any outfit.',
            price: 999,
            images: ['/images/products/bracelet-1.jpg'],
            category: 'bracelets',
            stock: 18,
            featured: true,
          },
        ]
        
        setProducts(mockProducts)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching featured products:', error)
        setIsLoading(false)
      }
    }
    
    fetchFeaturedProducts()
  }, [])
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }
  
  return (
    <section ref={sectionRef} className="py-16">
      <div className="text-center mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-serif gold-text mb-4"
        >
          Featured Collection
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-300 max-w-2xl mx-auto"
        >
          Discover our handpicked selection of premium jewelry pieces, crafted with attention to detail and designed for elegance.
        </motion.p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading-logo">
            <img src="/images/logo.png" alt="Loading" width={60} height={60} />
          </div>
        </div>
      ) : (
        <>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
          
          <div className="text-center mt-12">
            <Link href="/shop" className="btn btn-outline">
              View All Products
            </Link>
          </div>
        </>
      )}
    </section>
  )
}