'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useImagePreloader } from '@/lib/hooks/useImagePreloader'
import { preloadCriticalImages } from '@/lib/utils/preloadManager'
import { getFeaturedImages } from '@/lib/imageData'

interface ImagePreloadContextType {
  preloadedImages: Map<string, any>
  preloadImages: (urls: string[], options?: any) => Promise<void>
  preloadImage: (url: string, options?: any) => Promise<void>
  getImageState: (url: string) => any
  clearCache: () => void
}

const ImagePreloadContext = createContext<ImagePreloadContextType | null>(null)

interface ImagePreloadProviderProps {
  children: ReactNode
  criticalImages?: string[]
  preloadFeatured?: boolean
}

export function ImagePreloadProvider({ 
  children, 
  criticalImages = [],
  preloadFeatured = true
}: ImagePreloadProviderProps) {
  const imagePreloader = useImagePreloader()

  useEffect(() => {
    const preloadCriticalAndFeatured = async () => {
      try {
        // Preload critical images first with high priority
        if (criticalImages.length > 0) {
          preloadCriticalImages(criticalImages)
          await imagePreloader.preloadImages(criticalImages, { priority: true })
        }

        // Preload featured images if enabled
        if (preloadFeatured) {
          const featuredImages = getFeaturedImages()
          const featuredUrls = featuredImages.map(img => img.src)
          
          // Add small delay to not interfere with critical images
          setTimeout(() => {
            preloadCriticalImages(featuredUrls.slice(0, 3)) // Preload first 3 featured images
            imagePreloader.preloadImages(featuredUrls.slice(0, 3), { priority: false })
          }, 100)

          // Preload remaining featured images with lower priority
          setTimeout(() => {
            imagePreloader.preloadImages(featuredUrls.slice(3), { priority: false })
          }, 500)
        }
      } catch (error) {
        console.warn('Error preloading images:', error)
      }
    }

    preloadCriticalAndFeatured()
  }, [criticalImages, preloadFeatured, imagePreloader])

  return (
    <ImagePreloadContext.Provider value={imagePreloader}>
      {children}
    </ImagePreloadContext.Provider>
  )
}

export function useImagePreloadContext() {
  const context = useContext(ImagePreloadContext)
  if (!context) {
    throw new Error('useImagePreloadContext must be used within an ImagePreloadProvider')
  }
  return context
}

// Hook for easy access to image states
export function useImageState(url: string) {
  const { getImageState } = useImagePreloadContext()
  return getImageState(url)
}

// Hook for preloading specific images on demand
export function usePreloadOnHover() {
  const { preloadImage } = useImagePreloadContext()
  
  const preloadOnHover = (url: string) => {
    return () => {
      preloadImage(url, { priority: false })
    }
  }

  return preloadOnHover
}
