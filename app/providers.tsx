'use client'

import { SessionProvider } from 'next-auth/react'
import { ImagePreloadProvider } from '@/lib/context/ImagePreloadContext'
import { CartProvider } from '@/lib/cart'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <ImagePreloadProvider preloadFeatured={true}>
          {children}
        </ImagePreloadProvider>
      </CartProvider>
    </SessionProvider>
  )
}
