'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Filter, X } from 'lucide-react'

// Category data
const categories = [
  { id: 'necklaces', name: 'Necklaces' },
  { id: 'rings', name: 'Rings' },
  { id: 'earrings', name: 'Earrings' },
  { id: 'bracelets', name: 'Bracelets' },
]

// Price ranges
const priceRanges = [
  { id: '0-500', name: 'Under ₹500' },
  { id: '500-1000', name: '₹500 - ₹1,000' },
  { id: '1000-2000', name: '₹1,000 - ₹2,000' },
  { id: '2000-5000', name: '₹2,000 - ₹5,000' },
  { id: '5000-999999', name: 'Above ₹5,000' },
]

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null)
  
  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get('category')
    const priceRange = searchParams.get('price')
    
    setSelectedCategory(category)
    setSelectedPriceRange(priceRange)
  }, [searchParams])
  
  const applyFilters = () => {
    const params = new URLSearchParams()
    
    // Preserve search query if exists
    const search = searchParams.get('search')
    if (search) {
      params.set('search', search)
    }
    
    // Add category filter if selected
    if (selectedCategory) {
      params.set('category', selectedCategory)
    }
    
    // Add price filter if selected
    if (selectedPriceRange) {
      params.set('price', selectedPriceRange)
    }
    
    router.push(`/shop?${params.toString()}`)
    setIsMobileFilterOpen(false)
  }
  
  const clearFilters = () => {
    const params = new URLSearchParams()
    
    // Preserve search query if exists
    const search = searchParams.get('search')
    if (search) {
      params.set('search', search)
    }
    
    setSelectedCategory(null)
    setSelectedPriceRange(null)
    
    router.push(`/shop?${params.toString()}`)
  }
  
  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="w-full py-2 px-4 bg-gray-dark rounded-md flex items-center justify-center gap-2"
        >
          <Filter size={18} />
          <span>Filter Products</span>
        </button>
      </div>
      
      {/* Mobile Filter Sidebar */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setIsMobileFilterOpen(false)} />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-0 bottom-0 w-80 bg-gray-dark overflow-y-auto p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif text-white">Filters</h3>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-white hover:text-accent"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Filter content - same as desktop */}
            <div className="space-y-8">
              {/* Categories */}
              <div>
                <h4 className="text-lg font-medium text-white mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="form-radio text-accent border-accent/50 focus:ring-accent"
                      />
                      <span className="ml-2 text-gray-300">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div>
                <h4 className="text-lg font-medium text-white mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.id} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange === range.id}
                        onChange={() => setSelectedPriceRange(range.id)}
                        className="form-radio text-accent border-accent/50 focus:ring-accent"
                      />
                      <span className="ml-2 text-gray-300">{range.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col space-y-3 pt-4">
                <button
                  onClick={applyFilters}
                  className="btn btn-primary w-full"
                >
                  Apply Filters
                </button>
                
                <button
                  onClick={clearFilters}
                  className="btn btn-outline w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Desktop Filter Sidebar */}
      <div className="hidden md:block">
        <div className="card p-6 sticky top-24">
          <h3 className="text-xl font-serif text-white mb-6">Filters</h3>
          
          <div className="space-y-8">
            {/* Categories */}
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Categories</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category.id}
                      onChange={() => setSelectedCategory(category.id)}
                      className="form-radio text-accent border-accent/50 focus:ring-accent"
                    />
                    <span className="ml-2 text-gray-300">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Price Range</h4>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label key={range.id} className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={selectedPriceRange === range.id}
                      onChange={() => setSelectedPriceRange(range.id)}
                      className="form-radio text-accent border-accent/50 focus:ring-accent"
                    />
                    <span className="ml-2 text-gray-300">{range.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 pt-4">
              <button
                onClick={applyFilters}
                className="btn btn-primary w-full"
              >
                Apply Filters
              </button>
              
              <button
                onClick={clearFilters}
                className="btn btn-outline w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}