'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Plus, Edit, Trash, X } from 'lucide-react'

type Address = {
  id: string
  name: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

type AddressFormData = Omit<Address, 'id'>

export default function AddressesTab() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AddressFormData>()
  
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockAddresses: Address[] = [
          {
            id: '1',
            name: 'Home',
            phone: '9876543210',
            address: '123 Main Street, Apartment 4B',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India',
            isDefault: true,
          },
          {
            id: '2',
            name: 'Office',
            phone: '9876543211',
            address: '456 Business Park, Building C',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400051',
            country: 'India',
            isDefault: false,
          },
        ]
        
        setAddresses(mockAddresses)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching addresses:', error)
        setIsLoading(false)
      }
    }
    
    fetchAddresses()
  }, [])
  
  const onSubmit = (data: AddressFormData) => {
    if (editingAddressId) {
      // Update existing address
      setAddresses(addresses.map(address => 
        address.id === editingAddressId ? { ...address, ...data } : address
      ))
      setEditingAddressId(null)
    } else {
      // Add new address
      const newAddress: Address = {
        id: `new-${Date.now()}`,
        ...data,
      }
      setAddresses([...addresses, newAddress])
    }
    
    reset()
    setIsAddingAddress(false)
  }
  
  const handleEdit = (address: Address) => {
    setEditingAddressId(address.id)
    setIsAddingAddress(true)
    reset(address)
  }
  
  const handleDelete = (addressId: string) => {
    setAddresses(addresses.filter(address => address.id !== addressId))
  }
  
  const handleSetDefault = (addressId: string) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isDefault: address.id === addressId,
    })))
  }
  
  const handleCancel = () => {
    setIsAddingAddress(false)
    setEditingAddressId(null)
    reset()
  }
  
  if (isLoading) {
    return (
      <div className="card p-6">
        <h3 className="text-xl font-serif text-white mb-6">My Addresses</h3>
        <div className="flex justify-center items-center h-64">
          <div className="loading-logo">
            <img src="/images/logo.png" alt="Loading" width={60} height={60} />
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif text-white">My Addresses</h3>
        
        {!isAddingAddress && (
          <button
            onClick={() => setIsAddingAddress(true)}
            className="btn btn-outline flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            Add New Address
          </button>
        )}
      </div>
      
      <AnimatePresence>
        {isAddingAddress && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 overflow-hidden"
          >
            <div className="border border-accent/30 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg text-white">
                  {editingAddressId ? 'Edit Address' : 'Add New Address'}
                </h4>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm text-gray-300 mb-1">
                      Address Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Home, Office, etc."
                      {...register('name', { required: 'Address name is required' })}
                      className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Please enter a valid 10-digit phone number',
                        },
                      })}
                      className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm text-gray-300 mb-1">
                      Street Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      {...register('address', { required: 'Address is required' })}
                      className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    {errors.address && (
                      <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm text-gray-300 mb-1">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      {...register('city', { required: 'City is required' })}
                      className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    {errors.city && (
                      <p className="text-red-400 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm text-gray-300 mb-1">
                      State
                    </label>
                    <input
                      id="state"
                      type="text"
                      {...register('state', { required: 'State is required' })}
                      className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    {errors.state && (
                      <p className="text-red-400 text-sm mt-1">{errors.state.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="postalCode" className="block text-sm text-gray-300 mb-1">
                      Postal Code
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      {...register('postalCode', { 
                        required: 'Postal code is required',
                        pattern: {
                          value: /^[0-9]{6}$/,
                          message: 'Please enter a valid 6-digit postal code',
                        },
                      })}
                      className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    {errors.postalCode && (
                      <p className="text-red-400 text-sm mt-1">{errors.postalCode.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm text-gray-300 mb-1">
                      Country
                    </label>
                    <select
                      id="country"
                      {...register('country', { required: 'Country is required' })}
                      className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="India">India</option>
                    </select>
                    {errors.country && (
                      <p className="text-red-400 text-sm mt-1">{errors.country.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="isDefault"
                    type="checkbox"
                    {...register('isDefault')}
                    className="form-checkbox text-accent border-accent/50 focus:ring-accent"
                  />
                  <label htmlFor="isDefault" className="ml-2 text-sm text-gray-300">
                    Set as default address
                  </label>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingAddressId ? 'Update Address' : 'Save Address'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {addresses.length === 0 && !isAddingAddress ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">You don't have any saved addresses yet.</p>
          <button
            onClick={() => setIsAddingAddress(true)}
            className="btn btn-primary"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border border-white/10 rounded-lg p-4 relative"
            >
              {address.isDefault && (
                <span className="absolute top-4 right-4 bg-accent/20 text-accent text-xs px-2 py-1 rounded">
                  Default
                </span>
              )}
              
              <h4 className="text-lg text-white mb-2">{address.name}</h4>
              
              <div className="text-gray-300 space-y-1 mb-4">
                <p>{address.address}</p>
                <p>{address.city}, {address.state} {address.postalCode}</p>
                <p>{address.country}</p>
                <p className="text-gray-400">Phone: {address.phone}</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(address)}
                  className="text-sm text-white hover:text-accent flex items-center gap-1"
                >
                  <Edit size={14} />
                  Edit
                </button>
                
                <button
                  onClick={() => handleDelete(address.id)}
                  className="text-sm text-white hover:text-red-400 flex items-center gap-1"
                >
                  <Trash size={14} />
                  Delete
                </button>
                
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-sm text-white hover:text-accent ml-auto"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}