'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from './ProductCard'
import { Product } from '@/types/product'

interface ProductsResponse {
  products: Product[]
  total: number
  totalPages: number
  currentPage: number
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      
      try {
        // Build query parameters
        const params = new URLSearchParams()
        params.set('page', currentPage.toString())
        params.set('limit', '8')
        
        if (category) {
          params.set('category', category)
        }
        
        if (search) {
          params.set('search', search)
        }
        
        const response = await fetch(`/api/products?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data: ProductsResponse = await response.json()
        
        setProducts(data.products)
        setTotalPages(data.totalPages)
        setTotal(data.total)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
        setTotalPages(1)
        setTotal(0)
        setIsLoading(false)
      }
    }
    
    fetchProducts()
  }, [category, search, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-white mb-4">No products found</h3>
        <p className="text-gray-400">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    )
  }
  
  const startIndex = (currentPage - 1) * 8
  const endIndex = startIndex + 8
  const currentProducts = products.slice(startIndex, endIndex)
  
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
                  currentPage === index + 1
                    ? 'bg-accent text-primary'
                    : 'bg-gray-dark text-white hover:bg-gray-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
