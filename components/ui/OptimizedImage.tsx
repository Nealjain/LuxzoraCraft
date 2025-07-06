'use client'

import { useState, useEffect, forwardRef } from 'react'
import Image from 'next/image'
import { useIntersectionObserver } from '@/lib/hooks/useIntersectionObserver'
import { useImagePreloader } from '@/lib/hooks/useImagePreloader'
import { preloadImage } from '@/lib/utils/preloadManager'
import { startImageTracking, endImageTracking } from '@/lib/utils/imagePerformanceMonitor'
import { getWebPUrl, checkWebPSupport } from '@/lib/utils/webpOptimizer'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  lazy?: boolean
  className?: string
  skeleton?: boolean
  skeletonClassName?: string
  fill?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: (error: Error) => void
  preloadOnMount?: boolean
  lazyOffset?: string
  style?: React.CSSProperties
  enablePerformanceMonitoring?: boolean
  autoWebP?: boolean
  squareFormat?: boolean
}

const OptimizedImage = forwardRef<HTMLDivElement, OptimizedImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      priority = false,
      lazy = true,
      className = '',
      skeleton = true,
      skeletonClassName = '',
      fill = false,
      sizes = '100vw',
      quality = 75,
      placeholder = 'empty',
      blurDataURL,
      onLoad,
      onError,
      preloadOnMount = false,
      lazyOffset = '100px',
      style,
      enablePerformanceMonitoring = true,
      autoWebP = true,
      squareFormat = false,
      ...props
    },
    ref
  ) => {
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [shouldLoad, setShouldLoad] = useState(!lazy || priority)
    const [optimizedSrc, setOptimizedSrc] = useState(src)
    const [webpSupported, setWebpSupported] = useState<boolean | null>(null)

    const { getImageState, preloadImage: preloadSingleImage } = useImagePreloader()
    const imageState = getImageState(optimizedSrc)

    // Intersection observer for lazy loading
    const { ref: intersectionRef, isIntersecting, hasIntersected } = useIntersectionObserver({
      rootMargin: lazyOffset,
      threshold: 0.1,
      once: true
    })

    // Check WebP support and optimize src URL
    useEffect(() => {
      const initializeOptimization = async () => {
        if (autoWebP) {
          try {
            const webpSupport = await checkWebPSupport()
            setWebpSupported(webpSupport)
            
            if (webpSupport) {
              const webpUrl = getWebPUrl(src)
              setOptimizedSrc(webpUrl)
              
              if (process.env.NODE_ENV === 'development') {
                console.log(`🎨 WebP optimization: ${src} → ${webpUrl}`)
              }
            } else {
              setOptimizedSrc(src)
              if (process.env.NODE_ENV === 'development') {
                console.warn(`⚠️ WebP not supported, using original: ${src}`)
              }
            }
          } catch (error) {
            console.warn('Error checking WebP support:', error)
            setOptimizedSrc(src)
          }
        } else {
          setOptimizedSrc(src)
        }
      }
      
      initializeOptimization()
    }, [src, autoWebP])

    // Preload on mount if requested
    useEffect(() => {
      if (preloadOnMount && !priority) {
        preloadImage(optimizedSrc, { fetchPriority: 'high' })
        preloadSingleImage(optimizedSrc, { priority: true })
      }
    }, [optimizedSrc, preloadOnMount, priority, preloadSingleImage])

    // Handle lazy loading
    useEffect(() => {
      if (lazy && !priority && (isIntersecting || hasIntersected)) {
        setShouldLoad(true)
      }
    }, [lazy, priority, isIntersecting, hasIntersected])

    // Handle priority images
    useEffect(() => {
      if (priority) {
        setShouldLoad(true)
        preloadImage(optimizedSrc, { fetchPriority: 'high' })
      }
    }, [priority, optimizedSrc])

    // Start performance tracking when image starts loading
    useEffect(() => {
      if (shouldLoad && enablePerformanceMonitoring) {
        startImageTracking(optimizedSrc)
      }
    }, [shouldLoad, optimizedSrc, enablePerformanceMonitoring])

    const handleLoad = () => {
      setImageLoaded(true)
      setImageError(false)
      
      // End performance tracking
      if (enablePerformanceMonitoring) {
        endImageTracking(optimizedSrc, true)
      }
      
      // Check square format if required
      if (squareFormat && process.env.NODE_ENV === 'development') {
        const img = new window.Image()
        img.onload = () => {
          const aspectRatio = img.naturalWidth / img.naturalHeight
          const isSquare = Math.abs(aspectRatio - 1) < 0.1
          
          if (!isSquare) {
            console.warn(`📐 Non-square image detected: ${optimizedSrc} (${img.naturalWidth}x${img.naturalHeight}, ratio: ${aspectRatio.toFixed(2)})`)
          }
        }
        img.src = optimizedSrc
      }
      
      onLoad?.()
    }

    const handleError = () => {
      setImageError(true)
      setImageLoaded(false)
      
      // End performance tracking with error
      if (enablePerformanceMonitoring) {
        endImageTracking(optimizedSrc, false, `Failed to load image: ${optimizedSrc}`)
      }
      
      // If WebP failed and we were using WebP, try fallback to original
      if (autoWebP && optimizedSrc !== src && webpSupported) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`⚠️ WebP failed, falling back to original: ${src}`)
        }
        setOptimizedSrc(src)
        setImageError(false) // Reset error state to try again
        return
      }
      
      onError?.(new Error(`Failed to load image: ${optimizedSrc}`))
    }

    // Skeleton component
    const SkeletonLoader = () => (
      <div
        className={`animate-pulse bg-gray-300 ${skeletonClassName}`}
        style={fill ? { position: 'absolute', inset: 0 } : { width, height }}
      />
    )

    // Error state
    const ErrorState = () => (
      <div
        className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`}
        style={fill ? { position: 'absolute', inset: 0 } : { width, height }}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
    )

    return (
      <div
        ref={ref}
        className={`relative overflow-hidden ${className}`}
        style={style}
        {...props}
      >
        {/* Intersection observer ref for lazy loading */}
        <div ref={intersectionRef as any} className="absolute inset-0 pointer-events-none" />

        {/* Show skeleton while loading */}
        {skeleton && !imageLoaded && !imageError && <SkeletonLoader />}

        {/* Show error state */}
        {imageError && <ErrorState />}

        {/* Show image when ready */}
        {shouldLoad && !imageError && (
          <Image
            src={optimizedSrc}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            sizes={sizes}
            quality={quality}
            priority={priority}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            className={`transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${squareFormat ? 'aspect-square object-cover' : ''}`}
            onLoad={handleLoad}
            onError={handleError}
            style={fill ? { objectFit: 'cover' } : undefined}
          />
        )}
      </div>
    )
  }
)

OptimizedImage.displayName = 'OptimizedImage'

export default OptimizedImage
