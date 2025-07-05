'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/shop/ProductCard'
import { Product } from '@/types/product'

interface RelatedProductsProps {
  category: string
  currentProductId: string
}

export default function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchRelatedProducts = async () => {
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
          {
            id: '6',
            name: 'Minimalist Stacking Rings Set',
            slug: 'minimalist-stacking-rings-set',
            description: 'Set of three minimalist rings that can be worn together or separately.',
            price: 1299,
            images: ['/images/products/ring-2.jpg'],
            category: 'rings',
            stock: 25,
            featured: false,
          },
          {
            id: '7',
            name: 'Geometric Hoop Earrings',
            slug: 'geometric-hoop-earrings',
            description: 'Modern geometric hoop earrings with a unique design.',
            price: 1199,
            images: ['/images/products/earrings-2.jpg'],
            category: 'earrings',
            stock: 15,
            featured: false,
          },
          {
            id: '8',
            name: 'Beaded Charm Bracelet',
            slug: 'beaded-charm-bracelet',
            description: 'Elegant beaded bracelet with delicate charms.',
            price: 1099,
            images: ['/images/products/bracelet-2.jpg'],
            category: 'bracelets',
            stock: 20,
            featured: false,
          },
        ]
        
        // Filter by category and exclude current product
        const relatedProducts = mockProducts
          .filter(p => p.category === category && p.id !== currentProductId)
          .slice(0, 4)
        
        setProducts(relatedProducts)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching related products:', error)
        setIsLoading(false)
      }
    }
    
    fetchRelatedProducts()
  }, [category, currentProductId])
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-logo">
          <img src="/images/logo.png" alt="Loading" width={60} height={60} />
        </div>
      </div>
    )
  }
  
  if (products.length === 0) {
    return null
  }
  
  return (
    <section className="mt-16 pt-16 border-t border-white/10">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-serif gold-text mb-8"
      >
        You May Also Like
      </motion.h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}