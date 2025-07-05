'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from './ProductCard'
import { Product } from '@/types/product'

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      
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
        
        // Filter by category if provided
        let filteredProducts = mockProducts
        if (category) {
          filteredProducts = mockProducts.filter(p => p.category === category)
        }
        
        // Filter by search if provided
        if (search) {
          const searchLower = search.toLowerCase()
          filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchLower) || 
            p.description.toLowerCase().includes(searchLower)
          )
        }
        
        setProducts(filteredProducts)
        setTotalPages(Math.ceil(filteredProducts.length / 8))
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setIsLoading(false)
      }
    }
    
    fetchProducts()
  }, [category, search])
  
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
  
  // Pagination
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
      
      {/* Pagination */}
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