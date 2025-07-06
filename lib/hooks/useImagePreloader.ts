'use client'

import { useState, useEffect, useCallback } from 'react'

interface ImagePreloadOptions {
  priority?: boolean
  lazy?: boolean
  placeholder?: string
  onLoad?: () => void
  onError?: (error: Error) => void
}

interface ImagePreloadState {
  isLoaded: boolean
  isLoading: boolean
  error: Error | null
  src: string
}

interface UseImagePreloaderReturn {
  preloadedImages: Map<string, ImagePreloadState>
  preloadImages: (urls: string[], options?: ImagePreloadOptions) => Promise<void>
  preloadImage: (url: string, options?: ImagePreloadOptions) => Promise<void>
  getImageState: (url: string) => ImagePreloadState
  clearCache: () => void
}

// Global cache for preloaded images
const imageCache = new Map<string, ImagePreloadState>()

export function useImagePreloader(): UseImagePreloaderReturn {
  const [preloadedImages, setPreloadedImages] = useState<Map<string, ImagePreloadState>>(
    new Map(imageCache)
  )

  const updateImageState = useCallback((url: string, state: Partial<ImagePreloadState>) => {
    const currentState = imageCache.get(url) || {
      isLoaded: false,
      isLoading: false,
      error: null,
      src: url
    }
    
    const newState = { ...currentState, ...state }
    imageCache.set(url, newState)
    
    setPreloadedImages(new Map(imageCache))
  }, [])

  const preloadImage = useCallback(async (url: string, options: ImagePreloadOptions = {}) => {
    if (!url || imageCache.get(url)?.isLoaded) return

    updateImageState(url, { isLoading: true, error: null })

    try {
      const img = new Image()
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          updateImageState(url, { 
            isLoaded: true, 
            isLoading: false, 
            error: null 
          })
          options.onLoad?.()
          resolve()
        }
        
        img.onerror = () => {
          const error = new Error(`Failed to load image: ${url}`)
          updateImageState(url, { 
            isLoaded: false, 
            isLoading: false, 
            error 
          })
          options.onError?.(error)
          reject(error)
        }
        
        img.src = url
      })
    } catch (error) {
      updateImageState(url, { 
        isLoaded: false, 
        isLoading: false, 
        error: error as Error 
      })
      throw error
    }
  }, [updateImageState])

  const preloadImages = useCallback(async (urls: string[], options: ImagePreloadOptions = {}) => {
    const { priority = false } = options

    if (priority) {
      // Load priority images sequentially
      for (const url of urls) {
        await preloadImage(url, options)
      }
    } else {
      // Load non-priority images in parallel
      const promises = urls.map(url => preloadImage(url, options))
      await Promise.allSettled(promises)
    }
  }, [preloadImage])

  const getImageState = useCallback((url: string): ImagePreloadState => {
    return imageCache.get(url) || {
      isLoaded: false,
      isLoading: false,
      error: null,
      src: url
    }
  }, [])

  const clearCache = useCallback(() => {
    imageCache.clear()
    setPreloadedImages(new Map())
  }, [])

  return {
    preloadedImages,
    preloadImages,
    preloadImage,
    getImageState,
    clearCache
  }
}
