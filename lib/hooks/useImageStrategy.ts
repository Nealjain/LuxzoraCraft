'use client'

import { useEffect, useCallback } from 'react'
import { useImagePreloader } from './useImagePreloader'
import { preloadCriticalImages, preloadImages } from '@/lib/utils/preloadManager'

interface ImageStrategyConfig {
  heroImages?: string[]
  aboveFoldImages?: string[]
  criticalImages?: string[]
  prefetchOnHover?: string[]
  lazyLoadThreshold?: string
  priorityCount?: number
}

interface UseImageStrategyReturn {
  preloadCritical: (images: string[]) => Promise<void>
  preloadOnHover: (url: string) => () => void
  preloadNextPage: (images: string[]) => Promise<void>
  getCriticalImages: () => string[]
  getImageState: (url: string) => any
  clearImageCache: () => void
}

export function useImageStrategy(config: ImageStrategyConfig = {}): UseImageStrategyReturn {
  const {
    heroImages = [],
    aboveFoldImages = [],
    criticalImages = [],
    prefetchOnHover = [],
    lazyLoadThreshold = '100px',
    priorityCount = 3
  } = config

  const { preloadImages: preloadImagesHook, preloadImage, getImageState, clearCache } = useImagePreloader()

  // Combine all critical images
  const allCriticalImages = [
    ...heroImages,
    ...aboveFoldImages,
    ...criticalImages
  ].filter((url, index, self) => self.indexOf(url) === index) // Remove duplicates

  // Preload critical images on mount
  useEffect(() => {
    const initializeImageStrategy = async () => {
      try {
        // 1. Preload hero images with highest priority
        if (heroImages.length > 0) {
          preloadCriticalImages(heroImages)
          await preloadImagesHook(heroImages, { priority: true })
        }

        // 2. Preload above-the-fold images
        if (aboveFoldImages.length > 0) {
          setTimeout(() => {
            preloadCriticalImages(aboveFoldImages.slice(0, priorityCount))
            preloadImagesHook(aboveFoldImages, { priority: false })
          }, 50)
        }

        // 3. Preload other critical images with lower priority
        if (criticalImages.length > 0) {
          setTimeout(() => {
            preloadImages(criticalImages)
            preloadImagesHook(criticalImages, { priority: false })
          }, 200)
        }
      } catch (error) {
        console.warn('Error initializing image strategy:', error)
      }
    }

    initializeImageStrategy()
  }, [heroImages, aboveFoldImages, criticalImages, priorityCount, preloadImagesHook])

  // Preload critical images function
  const preloadCritical = useCallback(async (images: string[]) => {
    try {
      preloadCriticalImages(images)
      await preloadImagesHook(images, { priority: true })
    } catch (error) {
      console.warn('Error preloading critical images:', error)
    }
  }, [preloadImagesHook])

  // Preload on hover function
  const preloadOnHover = useCallback((url: string) => {
    return () => {
      if (!getImageState(url).isLoaded && !getImageState(url).isLoading) {
        preloadImage(url, { priority: false })
      }
    }
  }, [preloadImage, getImageState])

  // Preload next page images
  const preloadNextPage = useCallback(async (images: string[]) => {
    try {
      // Preload with low priority and delay
      setTimeout(() => {
        preloadImagesHook(images, { priority: false })
      }, 1000)
    } catch (error) {
      console.warn('Error preloading next page images:', error)
    }
  }, [preloadImagesHook])

  // Get critical images
  const getCriticalImages = useCallback(() => {
    return allCriticalImages
  }, [allCriticalImages])

  // Clear image cache
  const clearImageCache = useCallback(() => {
    clearCache()
  }, [clearCache])

  return {
    preloadCritical,
    preloadOnHover,
    preloadNextPage,
    getCriticalImages,
    getImageState,
    clearImageCache
  }
}

// Utility hook for specific image optimization strategies
export function useHeroImageStrategy(heroImages: string[]) {
  return useImageStrategy({
    heroImages,
    priorityCount: heroImages.length
  })
}

export function useProductImageStrategy(productImages: string[], relatedImages: string[] = []) {
  return useImageStrategy({
    aboveFoldImages: productImages.slice(0, 3),
    prefetchOnHover: relatedImages,
    priorityCount: 2
  })
}

export function useGalleryImageStrategy(galleryImages: string[], visibleCount: number = 6) {
  return useImageStrategy({
    aboveFoldImages: galleryImages.slice(0, visibleCount),
    criticalImages: galleryImages.slice(visibleCount, visibleCount + 6),
    priorityCount: 3
  })
}
