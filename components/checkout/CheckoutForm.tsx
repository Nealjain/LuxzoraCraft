'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useCart } from '@/lib/cart'

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

export default function CheckoutForm() {
  const { data: session } = useSession()
  const { items, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      email: session?.user?.email || '',
      country: 'India',
    },
  })
  
  const onSubmit = async (data: FormData) => {
    if (items.length === 0) return
    
    setIsSubmitting(true)
    
    try {
      // In a real app, this would create an order in the database
      // and initialize a Razorpay payment
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Redirect to success page
      clearCart()
      router.push('/checkout/success')
    } catch (error) {
      console.error('Checkout error:', error)
      setIsSubmitting(false)
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="card p-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Contact Information */}
        <div>
          <h3 className="text-xl font-serif text-white mb-4">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm text-gray-300 mb-1">
                First Name*
              </label>
              <input
                id="firstName"
                type="text"
                {...register('firstName', { required: 'First name is required' })}
                className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
              />
              {errors.firstName && (
                <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm text-gray-300 mb-1">
                Last Name*
              </label>
              <input
                id="lastName"
                type="text"
                {...register('lastName', { required: 'Last name is required' })}
                className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
              />
              {errors.lastName && (
                <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
                Email Address*
              </label>
              <input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm text-gray-300 mb-1">
                Phone Number*
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
          </div>
        </div>
        
        {/* Shipping Address */}
        <div>
          <h3 className="text-xl font-serif text-white mb-4">Shipping Address</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm text-gray-300 mb-1">
                Street Address*
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm text-gray-300 mb-1">
                  City*
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
                  State/Province*
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
                  Postal Code*
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
                  Country*
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
          </div>
        </div>
        
        {/* Payment Method */}
        <div>
          <h3 className="text-xl font-serif text-white mb-4">Payment Method</h3>
          
          <div className="space-y-3">
            <label className="flex items-center p-4 border border-accent/30 rounded-md cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={paymentMethod === 'razorpay'}
                onChange={() => setPaymentMethod('razorpay')}
                className="form-radio text-accent border-accent/50 focus:ring-accent"
              />
              <div className="ml-3">
                <span className="block text-white">Razorpay</span>
                <span className="text-sm text-gray-400">Pay securely with credit/debit card, UPI, or net banking</span>
              </div>
              <img src="/images/payment/razorpay.svg" alt="Razorpay" className="h-8 ml-auto" />
            </label>
            
            <label className="flex items-center p-4 border border-accent/30 rounded-md cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="form-radio text-accent border-accent/50 focus:ring-accent"
              />
              <div className="ml-3">
                <span className="block text-white">Cash on Delivery</span>
                <span className="text-sm text-gray-400">Pay when you receive your order</span>
              </div>
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || items.length === 0}
          className="btn btn-primary w-full"
        >
          {isSubmitting ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </motion.div>
  )
}