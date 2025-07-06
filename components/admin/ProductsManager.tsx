'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  Eye, 
  X, 
  Upload,
  Check,
  AlertTriangle
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Product } from '@/types/product'

type ProductFormData = {
  name: string
  slug: string
  description: string
  price: number
  category: string
  stock: number
  featured: boolean
}

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ProductFormData>()
  
  // Categories
  const categories = [
    { id: 'necklaces', name: 'Necklaces' },
    { id: 'rings', name: 'Rings' },
    { id: 'earrings', name: 'Earrings' },
    { id: 'bracelets', name: 'Bracelets' },
  ]
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        setProducts(data.products)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setIsLoading(false)
      }
    }
    
    fetchProducts()
  }, [])
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true
    
    return matchesSearch && matchesCategory
  })
  
  const handleAddProduct = async (data: ProductFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          images: uploadedImages.length > 0 ? uploadedImages : ['/images/products/placeholder.jpg'],
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to add product')
      }
      
      const newProduct = await response.json()
      setProducts([newProduct, ...products])
      setIsAddModalOpen(false)
      setUploadedImages([])
      reset()
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Failed to add product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleEditProduct = async (data: ProductFormData) => {
    if (!selectedProduct) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/products/${selectedProduct.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          images: uploadedImages.length > 0 ? uploadedImages : selectedProduct.images,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update product')
      }
      
      const updatedProduct = await response.json()
      
      const updatedProducts = products.map(product =>
        product.id === selectedProduct.id ? updatedProduct : product
      )
      
      setProducts(updatedProducts)
      setIsEditModalOpen(false)
      setSelectedProduct(null)
      setUploadedImages([])
      reset()
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/products/${selectedProduct.slug}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete product')
      }
      
      const updatedProducts = products.filter(product => product.id !== selectedProduct.id)
      
      setProducts(updatedProducts)
      setIsDeleteModalOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error('Error deleting product:', error)
      alert(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const openEditModal = (product: Product) => {
    setSelectedProduct(product)
    
    // Set form values
    setValue('name', product.name)
    setValue('slug', product.slug)
    setValue('description', product.description)
    setValue('price', product.price)
    setValue('category', product.category)
    setValue('stock', product.stock)
    setValue('featured', product.featured)
    
    setUploadedImages(product.images)
    setIsEditModalOpen(true)
  }
  
  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteModalOpen(true)
  }
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    // In a real app, you would upload these files to Supabase Storage
    // For now, we'll just create object URLs
    const newImages = Array.from(files).map(file => URL.createObjectURL(file))
    setUploadedImages([...uploadedImages, ...newImages])
  }
  
  const removeUploadedImage = (index: number) => {
    const newImages = [...uploadedImages]
    newImages.splice(index, 1)
    setUploadedImages(newImages)
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
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-serif gold-text">Products</h1>
        
        <button
          onClick={() => {
            reset()
            setUploadedImages([])
            setIsAddModalOpen(true)
          }}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Product
        </button>
      </div>
      
      <div className="card p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-dark">
            <tr>
              <th className="text-left py-4 px-4 rounded-tl-lg">Product</th>
              <th className="text-left py-4 px-4">Category</th>
              <th className="text-right py-4 px-4">Price</th>
              <th className="text-right py-4 px-4">Stock</th>
              <th className="text-center py-4 px-4">Featured</th>
              <th className="text-right py-4 px-4 rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr 
                key={product.id} 
                className={`border-b border-white/10 ${
                  index === filteredProducts.length - 1 ? 'rounded-b-lg overflow-hidden' : ''
                }`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md overflow-hidden mr-4">
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-sm text-gray-400 truncate max-w-xs">
                        {product.description.substring(0, 60)}...
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 capitalize">
                  {product.category}
                </td>
                <td className="py-4 px-4 text-right">
                  ₹{product.price.toLocaleString()}
                </td>
                <td className={`py-4 px-4 text-right ${
                  product.stock <= 5 ? 'text-red-400' : ''
                }`}>
                  {product.stock}
                  {product.stock <= 5 && (
                    <AlertTriangle size={16} className="inline ml-1" />
                  )}
                </td>
                <td className="py-4 px-4 text-center">
                  {product.featured ? (
                    <Check size={18} className="inline text-green-400" />
                  ) : (
                    <X size={18} className="inline text-gray-400" />
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-2 text-white hover:text-accent transition-colors"
                      aria-label="Edit product"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(product)}
                      className="p-2 text-white hover:text-red-400 transition-colors"
                      aria-label="Delete product"
                    >
                      <Trash size={18} />
                    </button>
                    <a
                      href={`/product/${product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-white hover:text-accent transition-colors"
                      aria-label="View product"
                    >
                      <Eye size={18} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-gray-dark/50 rounded-lg mt-4">
            <p className="text-gray-400">No products found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-dark rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif text-white">Add New Product</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(handleAddProduct)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-300 mb-1">
                    Product Name*
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name', { required: 'Product name is required' })}
                    className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="slug" className="block text-sm text-gray-300 mb-1">
                    Slug*
                  </label>
                  <input
                    id="slug"
                    type="text"
                    {...register('slug', { required: 'Slug is required' })}
                    className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  {errors.slug && (
                    <p className="text-red-400 text-sm mt-1">{errors.slug.message}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm text-gray-300 mb-1">
                    Description*
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    {...register('description', { required: 'Description is required' })}
                    className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm text-gray-300 mb-1">
                    Price (₹)*
                  </label>
                  <input
                    id="price"
                    type="number"
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 1, message: 'Price must be greater than 0' }
                    })}
                    className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  {errors.price && (
                    <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm text-gray-300 mb-1">
                    Category*
                  </label>
                  <select
                    id="category"
                    {...register('category', { required: 'Category is required' })}
                    className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="stock" className="block text-sm text-gray-300 mb-1">
                    Stock*
                  </label>
                  <input
                    id="stock"
                    type="number"
                    {...register('stock', { 
                      required: 'Stock is required',
                      min: { value: 0, message: 'Stock cannot be negative' }
                    })}
                    className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  {errors.stock && (
                    <p className="text-red-400 text-sm mt-1">{errors.stock.message}</p>
                  )}
                </div>
                
                <div className="flex items-center">
                  <input
                    id="featured"
                    type="checkbox"
                    {...register('featured')}
                    className="form-checkbox text-accent border-accent/50 focus:ring-accent"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-gray-300">
                    Featured Product
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Product Images
                </label>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <img 
                        src={image} 
                        alt={`Product image ${index + 1}`} 
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        aria-label="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  <label className="w-24 h-24 flex flex-col items-center justify-center border border-dashed border-accent/30 rounded-md cursor-pointer hover:border-accent/60 transition-colors">
                    <Upload size={24} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-400">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      {/* Edit Product Modal */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-dark rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif text-white">Edit Product</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(handleEditProduct)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm text-gray-300 mb-1">
                    Product Name*
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    {...register('name', { required: 'Product name is required' })}
                    className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="edit-slug" className="block text-sm text-gray-300 mb-1">
                    Slug*
                  </label>
                  <input
                    id="edit-slug"
                    type="text"
                    {...register('slug', { required: 'Slug is required' })}
                    className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  {errors.slug && (
                    <p className="text-red-400 text-sm mt-1">{errors.slug.message}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="edit-description" className="block text-sm text-gray-300 mb-1">
                    Description*
                  </label>
                  <textarea
                    id="edit-description"
                    rows={4}
                    {...register('description', { required: 'Description is required' })}
                    className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="edit-price" className="block text-sm text-gray-300 mb-1">
                    Price (₹)*
                  </label>
                  <input
                    id="edit-price"
                    type="number"
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 1, message: 'Price must be greater than 0' }
                    })}
                    className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  {errors.price && (
                    <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="edit-category" className="block text-sm text-gray-300 mb-1">
                    Category*
                  </label>
                  <select
                    id="edit-category"
                    {...register('category', { required: 'Category is required' })}
                    className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="edit-stock" className="block text-sm text-gray-300 mb-1">
                    Stock*
                  </label>
                  <input
                    id="edit-stock"
                    type="number"
                    {...register('stock', { 
                      required: 'Stock is required',
                      min: { value: 0, message: 'Stock cannot be negative' }
                    })}
                    className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  {errors.stock && (
                    <p className="text-red-400 text-sm mt-1">{errors.stock.message}</p>
                  )}
                </div>
                
                <div className="flex items-center">
                  <input
                    id="edit-featured"
                    type="checkbox"
                    {...register('featured')}
                    className="form-checkbox text-accent border-accent/50 focus:ring-accent"
                  />
                  <label htmlFor="edit-featured" className="ml-2 text-sm text-gray-300">
                    Featured Product
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Product Images
                </label>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative w-24 h-24">
                      <img 
                        src={image} 
                        alt={`Product image ${index + 1}`} 
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        aria-label="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  <label className="w-24 h-24 flex flex-col items-center justify-center border border-dashed border-accent/30 rounded-md cursor-pointer hover:border-accent/60 transition-colors">
                    <Upload size={24} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-400">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-dark rounded-lg p-6 w-full max-w-md"
          >
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <h2 className="text-xl font-serif text-white mb-2">Delete Product</h2>
              <p className="text-gray-400">
                Are you sure you want to delete "{selectedProduct.name}"? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-outline"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="btn bg-red-500 hover:bg-red-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}