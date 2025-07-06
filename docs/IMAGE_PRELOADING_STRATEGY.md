# Image Preloading Strategy

This document outlines the comprehensive image preloading strategy implemented for LuxZoraCraft, including critical image preloading, lazy loading with intersection observer, and skeleton loading states.

## Overview

The image preloading strategy consists of several key components:

1. **Critical Image Preloading**: Preload hero and above-the-fold images with high priority
2. **Lazy Loading**: Use intersection observer for images below the fold
3. **Skeleton Loading States**: Show loading placeholders while images load
4. **Smart Caching**: Global image cache to prevent duplicate requests
5. **Performance Optimization**: Strategic preloading based on user interaction

## Components

### 1. Core Hooks

#### `useImagePreloader`
- Manages global image cache and preloading
- Provides loading states for each image
- Handles priority-based loading

```typescript
const { preloadImages, getImageState, clearCache } = useImagePreloader()
```

#### `useIntersectionObserver`
- Implements intersection observer for lazy loading
- Configurable thresholds and root margins
- One-time or continuous observation

```typescript
const { ref, isIntersecting, hasIntersected } = useIntersectionObserver({
  rootMargin: '100px',
  threshold: 0.1,
  once: true
})
```

#### `useImageStrategy`
- High-level hook combining preloading strategies
- Automatic hero, above-fold, and critical image handling
- Specialized hooks for different use cases

```typescript
const { preloadCritical, preloadOnHover } = useImageStrategy({
  heroImages: ['/hero1.jpg', '/hero2.jpg'],
  aboveFoldImages: ['/product1.jpg', '/product2.jpg']
})
```

### 2. Components

#### `OptimizedImage`
- Drop-in replacement for Next.js Image component
- Built-in lazy loading and skeleton states
- Automatic error handling and fallbacks

```tsx
<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={400}
  height={300}
  priority={false}
  lazy={true}
  skeleton={true}
  className="object-cover"
/>
```

#### `SkeletonLoader`
- Customizable skeleton components
- Pre-built skeletons for common use cases
- Animated loading states

```tsx
<ProductCardSkeleton />
<ImageGallerySkeleton count={6} />
<HeroSkeleton />
```

### 3. Utilities

#### `preloadManager`
- Manages `<link rel="preload">` tags in document head
- Prevents duplicate preload tags
- High-priority preloading for critical images

```typescript
import { preloadCriticalImages, preloadImages } from '@/lib/utils/preloadManager'

// Preload with high priority
preloadCriticalImages(['/hero.jpg', '/logo.jpg'])

// Preload with normal priority
preloadImages(['/product1.jpg', '/product2.jpg'])
```

#### `ImagePreloadContext`
- Global context for image preloading state
- Automatic preloading of featured and critical images
- Shared cache across components

```tsx
<ImagePreloadProvider 
  criticalImages={['/hero.jpg']}
  preloadFeatured={true}
>
  <App />
</ImagePreloadProvider>
```

## Implementation Examples

### Hero Section
```tsx
export function HeroSection() {
  const heroImages = ['/hero1.jpg', '/hero2.jpg', '/hero3.jpg']
  const { preloadCritical } = useHeroImageStrategy(heroImages)

  return (
    <div className="hero">
      <OptimizedImage
        src={heroImages[0]}
        alt="Hero"
        priority
        fill
        skeleton
      />
    </div>
  )
}
```

### Product Grid
```tsx
export function ProductGrid({ products }) {
  const { preloadOnHover } = useImageStrategy()

  return (
    <div className="grid">
      {products.map((product, index) => (
        <div 
          key={product.id}
          onMouseEnter={preloadOnHover(product.image)}
        >
          <OptimizedImage
            src={product.image}
            alt={product.name}
            lazy={index >= 3} // Lazy load below fold
            skeleton
            width={300}
            height={300}
          />
        </div>
      ))}
    </div>
  )
}
```

### Gallery with Lazy Loading
```tsx
export function Gallery({ images }) {
  const { preloadCritical } = useGalleryImageStrategy(images, 6)

  return (
    <div className="gallery">
      {images.map((image, index) => (
        <OptimizedImage
          key={index}
          src={image}
          alt={`Gallery ${index}`}
          lazy={index >= 6}
          lazyOffset="200px"
          skeleton
        />
      ))}
    </div>
  )
}
```

## Performance Benefits

### 1. Faster Initial Load
- Critical images preloaded with `<link rel="preload">`
- Hero images loaded immediately
- Above-the-fold content prioritized

### 2. Reduced Bandwidth
- Lazy loading for below-the-fold images
- Only load images when needed
- Intersection observer prevents unnecessary requests

### 3. Better User Experience
- Skeleton screens during loading
- Smooth image transitions
- Error state handling

### 4. Smart Caching
- Global image cache prevents duplicate requests
- Persistent cache across component remounts
- Memory-efficient image management

## Configuration Options

### Image Strategy Config
```typescript
interface ImageStrategyConfig {
  heroImages?: string[]           // Highest priority images
  aboveFoldImages?: string[]      // Above-the-fold images
  criticalImages?: string[]       // Important images to preload
  prefetchOnHover?: string[]      // Images to preload on hover
  lazyLoadThreshold?: string      // Intersection observer margin
  priorityCount?: number          // Number of high-priority images
}
```

### Preload Options
```typescript
interface PreloadOptions {
  as?: 'image' | 'style' | 'script' | 'font' | 'fetch'
  crossOrigin?: 'anonymous' | 'use-credentials'
  fetchPriority?: 'high' | 'low' | 'auto'
}
```

### OptimizedImage Props
```typescript
interface OptimizedImageProps {
  src: string                     // Image source
  alt: string                     // Alt text
  priority?: boolean              // High priority loading
  lazy?: boolean                  // Enable lazy loading
  skeleton?: boolean              // Show skeleton while loading
  lazyOffset?: string             // Intersection observer margin
  preloadOnMount?: boolean        // Preload immediately
  onLoad?: () => void             // Load callback
  onError?: (error: Error) => void // Error callback
}
```

## Best Practices

### 1. Critical Image Identification
- Identify hero and above-the-fold images
- Use browser dev tools to measure LCP
- Prioritize images that affect Core Web Vitals

### 2. Lazy Loading Strategy
- Load above-the-fold images immediately
- Use intersection observer for below-the-fold
- Set appropriate root margins (100-200px)

### 3. Skeleton Screens
- Match skeleton dimensions to actual content
- Use consistent animation timing
- Provide meaningful loading states

### 4. Error Handling
- Implement fallback images
- Graceful degradation for failed loads
- User-friendly error messages

### 5. Performance Monitoring
- Monitor image loading metrics
- Track LCP and CLS improvements
- A/B test different strategies

## Browser Support

- **Intersection Observer**: Modern browsers (IE11+ with polyfill)
- **Link Preload**: Chrome 50+, Firefox 85+, Safari 11.1+
- **Image Loading**: All browsers with graceful fallbacks

## Migration Guide

### From Standard Images
```tsx
// Before
<img src="/image.jpg" alt="Description" />

// After
<OptimizedImage 
  src="/image.jpg" 
  alt="Description"
  width={400}
  height={300}
  lazy
  skeleton
/>
```

### From Next.js Image
```tsx
// Before
<Image src="/image.jpg" alt="Description" width={400} height={300} />

// After
<OptimizedImage 
  src="/image.jpg" 
  alt="Description"
  width={400}
  height={300}
  lazy
  skeleton
/>
```

## Troubleshooting

### Common Issues

1. **Images not preloading**: Check network tab for preload links
2. **Skeleton not showing**: Verify skeleton prop and CSS
3. **Lazy loading not working**: Check intersection observer support
4. **Memory leaks**: Ensure proper cleanup of observers

### Debug Tools

```typescript
// Check image cache state
const imageState = getImageState('/image.jpg')
console.log(imageState) // { isLoaded, isLoading, error }

// Clear cache if needed
clearImageCache()

// Monitor preload links
console.log(preloadManager.getPreloadedLinks())
```

This comprehensive image preloading strategy provides a solid foundation for optimal image loading performance while maintaining excellent user experience.
