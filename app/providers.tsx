'use client'

import { useState, useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import { createClient } from '@supabase/supabase-js'
import { createContext } from 'react'
import { CartProvider } from '@/lib/cart'

// Create Supabase context
export const SupabaseContext = createContext(null)

export function Providers({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)
  
  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark')
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <SessionProvider>
      <SupabaseContext.Provider value={supabase as any}>
        <CartProvider>
          {children}
        </CartProvider>
      </SupabaseContext.Provider>
    </SessionProvider>
  )
}