'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/shop/ProductCard'
import { Product } from '@/types/product'
import { createClient } from '@/utils/supabase/client';

interface RelatedProductsProps {
  category: string
  currentProductId: string
}

export default function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        // Fetch products from Supabase
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', category)
          .neq('id', currentProductId)
          .limit(4);

        if (error) {
          throw error;
        }

        const relatedProducts = data || [];
        
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