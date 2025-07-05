'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'

type ProfileFormData = {
  name: string
  email: string
  phone: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ProfileTab() {
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<ProfileFormData>({
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      phone: '',
    },
  })
  
  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true)
    setSuccessMessage('')
    
    try {
      // In a real app, this would update the user's profile
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccessMessage('Profile updated successfully')
      reset({
        ...data,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="card p-6">
      <h3 className="text-xl font-serif text-white mb-6">My Profile</h3>
      
      {successMessage && (
        <div className="bg-green-500/20 border border-green-500 text-green-100 p-3 rounded mb-6">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div>
          <h4 className="text-lg text-white mb-4">Personal Information</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm text-gray-300 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
                Email Address
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
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                {...register('phone', { 
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
        
        {/* Change Password */}
        <div>
          <h4 className="text-lg text-white mb-4">Change Password</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm text-gray-300 mb-1">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                {...register('currentPassword')}
                className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  {...register('newPassword', {
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                />
                {errors.newPassword && (
                  <p className="text-red-400 text-sm mt-1">{errors.newPassword.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', {
                    validate: value => 
                      value === watch('newPassword') || "Passwords don't match",
                  })}
                  className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}