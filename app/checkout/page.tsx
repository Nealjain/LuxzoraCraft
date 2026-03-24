'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import OrderSummary from '@/components/checkout/OrderSummary'
import { useCart } from '@/lib/cart'

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { items } = useCart()
  
  useEffect(() => {
    // Redirect if not logged in
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/checkout')
    }
    
    // Redirect if cart is empty
    if (items.length === 0) {
      router.push('/shop')
    }
  }, [status, router, items])
  
  if (status === 'loading' || items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading-logo">
          <img src="/images/logo.png" alt="Loading" width={100} height={100} />
        </div>
      </div>
    )
  }
  
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif mb-8 gold-text">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <CheckoutForm />
          </div>
          <div className="lg:w-1/3">
            <OrderSummary />
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}