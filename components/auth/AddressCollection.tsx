'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, MapPin } from 'lucide-react'

interface AddressCollectionProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (address: AddressData) => void
}

interface AddressData {
  street_address: string
  room_number?: string
  building_name?: string
  city: string
  state: string
  postal_code: string
  country: string
}

export default function AddressCollection({ isOpen, onClose, onSubmit }: AddressCollectionProps) {
  const [formData, setFormData] = useState<AddressData>({
    street_address: '',
    room_number: '',
    building_name: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to save address')
      }

      onSubmit(formData)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save address')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    localStorage.setItem('address_collection_skipped', 'true')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-primary rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <MapPin className="w-6 h-6 text-accent mr-2" />
            <h2 className="text-xl font-serif text-accent">Add Your Address</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-300 mb-6 text-sm">
          To provide you with the best shopping experience, please add your shipping address. 
          This will help us calculate accurate shipping costs and delivery times.
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="street_address" className="block text-sm font-medium text-accent-light mb-1">
              Street Address *
            </label>
            <input
              type="text"
              id="street_address"
              name="street_address"
              value={formData.street_address}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-white"
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="room_number" className="block text-sm font-medium text-accent-light mb-1">
                Apt/Unit
              </label>
              <input
                type="text"
                id="room_number"
                name="room_number"
                value={formData.room_number}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-white"
                placeholder="Apt 4B"
              />
            </div>
            <div>
              <label htmlFor="building_name" className="block text-sm font-medium text-accent-light mb-1">
                Building
              </label>
              <input
                type="text"
                id="building_name"
                name="building_name"
                value={formData.building_name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-white"
                placeholder="Building name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-accent-light mb-1">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-white"
              placeholder="New York"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-accent-light mb-1">
                State *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-white"
                placeholder="NY"
              />
            </div>
            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium text-accent-light mb-1">
                ZIP Code *
              </label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-white"
                placeholder="10001"
              />
            </div>
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-accent-light mb-1">
              Country *
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-white"
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Japan">Japan</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary flex-1"
            >
              {isSubmitting ? 'Saving...' : 'Save Address'}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="btn btn-outline flex-1"
            >
              Skip for Now
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          You can always add or update your address later in your account settings.
        </p>
      </motion.div>
    </div>
  )
}
