'use client'

import { useEffect } from 'react'
import OptimizedImage from '@/components/ui/OptimizedImage'
import { ProductCardSkeleton, ImageGallerySkeleton } from '@/components/ui/SkeletonLoader'
import { useImageStrategy, useGalleryImageStrategy } from '@/lib/hooks/useImageStrategy'
import { usePreloadOnHover } from '@/lib/context/ImagePreloadContext'

// Example: Hero section with critical image preloading
export function HeroImageExample() {
  const heroImages = [
    '/images/hero/hero-1.jpg',
    '/images/hero/hero-2.jpg',
    '/images/hero/hero-3.jpg'
  ]

  const { preloadCritical, getImageState } = useImageStrategy({
    heroImages,
    priorityCount: heroImages.length
  })

  return (
    <div className="relative h-96 bg-gray-900">
      <OptimizedImage
        src={heroImages[0]}
        alt="Hero Image"
        fill
        priority
        skeleton
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white">Hero Section</h1>
      </div>
    </div>
  )
}

// Example: Product grid with lazy loading and preloading
export function ProductGridExample() {
  const productImages = [
    '/images/products/ring-1.jpg',
    '/images/products/ring-2.jpg',
    '/images/products/ring-3.jpg',
    '/images/products/necklace-1.jpg',
    '/images/products/necklaces.jpg',
    '/images/products/earrings.jpg'
  ]

  const { preloadOnHover, preloadNextPage } = useGalleryImageStrategy(productImages, 3)

  // Preload next page of products
  useEffect(() => {
    const nextPageImages = [
      '/images/products/bracelet.jpg',
      '/images/products/earrings-1.jpg'
    ]
    preloadNextPage(nextPageImages)
  }, [preloadNextPage])

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {productImages.map((image, index) => (
        <div 
          key={index}
          className="group cursor-pointer"
          onMouseEnter={preloadOnHover(image)}
        >
          <OptimizedImage
            src={image}
            alt={`Product ${index + 1}`}
            width={300}
            height={300}
            lazy={index >= 3} // Lazy load images below the fold
            skeleton
            className="w-full aspect-square object-cover rounded-lg group-hover:scale-105 transition-transform"
          />
        </div>
      ))}
    </div>
  )
}

// Example: Gallery with intersection observer lazy loading
export function GalleryExample() {
  const galleryImages = Array.from({ length: 12 }, (_, i) => 
    `/images/gallery/image-${i + 1}.jpg`
  )

  const { preloadCritical } = useImageStrategy({
    aboveFoldImages: galleryImages.slice(0, 6),
    criticalImages: galleryImages.slice(6, 9)
  })

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Image Gallery</h2>
      
      {/* Above the fold images - preloaded */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {galleryImages.slice(0, 6).map((image, index) => (
          <OptimizedImage
            key={index}
            src={image}
            alt={`Gallery ${index + 1}`}
            width={400}
            height={300}
            lazy={false} // Don't lazy load above-the-fold images
            skeleton
            className="w-full aspect-[4/3] object-cover rounded-lg"
          />
        ))}
      </div>

      {/* Below the fold images - lazy loaded */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {galleryImages.slice(6).map((image, index) => (
          <OptimizedImage
            key={index + 6}
            src={image}
            alt={`Gallery ${index + 7}`}
            width={400}
            height={300}
            lazy
            skeleton
            lazyOffset="200px"
            className="w-full aspect-[4/3] object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  )
}

// Example: Loading states with skeletons
export function LoadingStatesExample() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Loading States</h2>
      
      {/* Product card skeletons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>

      {/* Gallery skeletons */}
      <ImageGallerySkeleton count={6} />
    </div>
  )
}

// Example: Hover preloading for navigation
export function NavigationPreloadExample() {
  const preloadOnHover = usePreloadOnHover()

  const navigationItems = [
    { href: '/shop/rings', image: '/images/categories/rings.jpg', label: 'Rings' },
    { href: '/shop/necklaces', image: '/images/categories/necklaces.jpg', label: 'Necklaces' },
    { href: '/shop/earrings', image: '/images/categories/earrings.jpg', label: 'Earrings' }
  ]

  return (
    <nav className="flex space-x-6">
      {navigationItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="hover:text-accent transition-colors"
          onMouseEnter={preloadOnHover(item.image)}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}

// Complete example combining all strategies
export default function ImageStrategyExample() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 space-y-12">
        <HeroImageExample />
        <ProductGridExample />
        <GalleryExample />
        <LoadingStatesExample />
        <NavigationPreloadExample />
      </div>
    </div>
  )
}
