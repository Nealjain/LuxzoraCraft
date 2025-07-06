'use client'

import { useState } from 'react'
import OptimizedImage from '@/components/ui/OptimizedImage'
import { 
  useCriticalImageMonitoring, 
  useSquareFormatMonitoring,
  useBasicImagePerformanceMonitoring 
} from '@/lib/hooks/useImagePerformanceMonitoring'
import { ProductCardSkeleton, ImageGallerySkeleton } from '@/components/ui/SkeletonLoader'

export default function ImagePerformanceTestPage() {
  const [showSlowImages, setShowSlowImages] = useState(false)
  const [showSquareImages, setShowSquareImages] = useState(false)
  const [showWebPImages, setShowWebPImages] = useState(false)

  // Test images with different characteristics
  const testImages = {
    critical: [
      '/images/hero/hero-1.jpg',
      '/images/hero/hero-2.jpg',
      '/images/hero/hero-3.jpg'
    ],
    square: [
      '/images/products/ring-1.jpg',
      '/images/products/ring-2.jpg',
      '/images/products/ring-3.jpg',
      '/images/products/necklace-1.jpg'
    ],
    webp: [
      '/images/pexels-1.webp',
      '/images/pexels-2.webp'
    ],
    regular: [
      '/images/products/earrings.jpg',
      '/images/products/bracelet.jpg',
      '/images/products/necklaces.jpg'
    ],
    slow: [
      'https://picsum.photos/800/600?random=1',
      'https://picsum.photos/800/600?random=2',
      'https://picsum.photos/800/600?random=3'
    ]
  }

  // Monitor different sets of images
  useCriticalImageMonitoring(testImages.critical)
  useSquareFormatMonitoring(testImages.square)
  useBasicImagePerformanceMonitoring()

  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Image Performance Test Page</h1>
          <p>This page is only available in development mode.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Image Performance Testing</h1>
          <p className="text-gray-300 mb-6">
            This page demonstrates various image loading scenarios for performance testing.
            Open your browser's developer tools and check the console for detailed performance logs.
          </p>
          
          <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">📊 Performance Monitoring Active</h3>
            <ul className="text-sm space-y-1">
              <li>• Load times are tracked for all images</li>
              <li>• WebP optimization analysis is running</li>
              <li>• Square format validation is enabled</li>
              <li>• Network throttling detection is active</li>
              <li>• Check console logs for detailed reports</li>
            </ul>
          </div>
        </header>

        {/* Critical Images Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Critical Images (Hero/Above-fold)</h2>
          <p className="text-gray-300 mb-4">
            These images are marked as priority and should load immediately with performance monitoring.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testImages.critical.map((src, index) => (
              <div key={src} className="bg-gray-800 rounded-lg overflow-hidden">
                <OptimizedImage
                  src={src}
                  alt={`Critical Image ${index + 1}`}
                  width={400}
                  height={300}
                  priority={index === 0}
                  enablePerformanceMonitoring={true}
                  autoWebP={true}
                  skeleton={true}
                  className="w-full aspect-[4/3]"
                />
                <div className="p-4">
                  <h3 className="font-semibold">Critical Image {index + 1}</h3>
                  <p className="text-sm text-gray-400">
                    {index === 0 ? 'Priority: High' : 'Priority: Normal'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Square Format Images */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Square Format Validation</h2>
            <button
              onClick={() => setShowSquareImages(!showSquareImages)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              {showSquareImages ? 'Hide' : 'Show'} Square Images
            </button>
          </div>
          <p className="text-gray-300 mb-4">
            These images are monitored for square aspect ratio compliance (1:1 ratio).
          </p>
          
          {showSquareImages && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {testImages.square.map((src, index) => (
                <div key={src} className="bg-gray-800 rounded-lg overflow-hidden">
                  <OptimizedImage
                    src={src}
                    alt={`Square Image ${index + 1}`}
                    width={200}
                    height={200}
                    lazy={true}
                    squareFormat={true}
                    enablePerformanceMonitoring={true}
                    autoWebP={true}
                    skeleton={true}
                    className="w-full aspect-square"
                  />
                  <div className="p-2">
                    <p className="text-xs text-gray-400">Square #{index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!showSquareImages && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          )}
        </section>

        {/* WebP Optimization Test */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">WebP Optimization Test</h2>
            <button
              onClick={() => setShowWebPImages(!showWebPImages)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
            >
              {showWebPImages ? 'Hide' : 'Show'} WebP Images
            </button>
          </div>
          <p className="text-gray-300 mb-4">
            These images test WebP format optimization and fallback behavior.
          </p>
          
          {showWebPImages && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testImages.webp.map((src, index) => (
                <div key={src} className="bg-gray-800 rounded-lg overflow-hidden">
                  <OptimizedImage
                    src={src}
                    alt={`WebP Image ${index + 1}`}
                    width={400}
                    height={300}
                    lazy={true}
                    enablePerformanceMonitoring={true}
                    autoWebP={true}
                    skeleton={true}
                    className="w-full aspect-[4/3]"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">WebP Test #{index + 1}</h3>
                    <p className="text-sm text-gray-400">Format: WebP with fallback</p>
                  </div>
                </div>
              ))}
              
              {/* Regular images for comparison */}
              {testImages.regular.slice(0, 2).map((src, index) => (
                <div key={src} className="bg-gray-800 rounded-lg overflow-hidden">
                  <OptimizedImage
                    src={src}
                    alt={`Regular Image ${index + 1}`}
                    width={400}
                    height={300}
                    lazy={true}
                    enablePerformanceMonitoring={true}
                    autoWebP={false}
                    skeleton={true}
                    className="w-full aspect-[4/3]"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">Regular #{index + 1}</h3>
                    <p className="text-sm text-gray-400">Format: Original (no WebP)</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Network Throttling Test */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Network Performance Test</h2>
            <button
              onClick={() => setShowSlowImages(!showSlowImages)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              {showSlowImages ? 'Hide' : 'Show'} Slow Images
            </button>
          </div>
          <p className="text-gray-300 mb-4">
            These external images simulate slow network conditions for testing throttled scenarios.
          </p>
          
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-4">
            <p className="text-yellow-200 text-sm">
              💡 <strong>Tip:</strong> Use browser dev tools to throttle network speed (Network tab → Throttling) 
              and observe how performance monitoring adapts to different connection speeds.
            </p>
          </div>
          
          {showSlowImages && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testImages.slow.map((src, index) => (
                <div key={src} className="bg-gray-800 rounded-lg overflow-hidden">
                  <OptimizedImage
                    src={src}
                    alt={`Network Test Image ${index + 1}`}
                    width={300}
                    height={200}
                    lazy={true}
                    enablePerformanceMonitoring={true}
                    autoWebP={true}
                    skeleton={true}
                    className="w-full aspect-[3/2]"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">Network Test #{index + 1}</h3>
                    <p className="text-sm text-gray-400">External source (may be slow)</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!showSlowImages && (
            <ImageGallerySkeleton count={3} />
          )}
        </section>

        {/* Performance Insights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Performance Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-900 border border-green-700 rounded-lg p-6">
              <h3 className="font-semibold text-green-400 mb-3">✅ Best Practices Implemented</h3>
              <ul className="space-y-2 text-sm">
                <li>• Priority loading for above-fold images</li>
                <li>• Lazy loading for below-fold content</li>
                <li>• Automatic WebP optimization with fallbacks</li>
                <li>• Skeleton screens during loading</li>
                <li>• Performance monitoring and logging</li>
                <li>• Square format validation</li>
                <li>• Network condition detection</li>
              </ul>
            </div>
            
            <div className="bg-blue-900 border border-blue-700 rounded-lg p-6">
              <h3 className="font-semibold text-blue-400 mb-3">📊 Monitoring Features</h3>
              <ul className="space-y-2 text-sm">
                <li>• Load time tracking (development only)</li>
                <li>• WebP usage analysis</li>
                <li>• Network throttling detection</li>
                <li>• Image format recommendations</li>
                <li>• Square aspect ratio validation</li>
                <li>• Performance reports in console</li>
                <li>• Real-time dev tool panel</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Instructions */}
        <section className="bg-gray-800 rounded-lg p-6">
          <h3 className="font-semibold mb-4">🔧 Testing Instructions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-gray-300 mb-2">Console Monitoring:</h4>
              <ul className="space-y-1">
                <li>1. Open browser developer tools (F12)</li>
                <li>2. Go to Console tab</li>
                <li>3. Reload the page to see startup logs</li>
                <li>4. Look for performance reports every 30 seconds</li>
                <li>5. Check for optimization recommendations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300 mb-2">Network Testing:</h4>
              <ul className="space-y-1">
                <li>1. Go to Network tab in dev tools</li>
                <li>2. Set throttling to "Slow 3G" or "Fast 3G"</li>
                <li>3. Reload page and observe load times</li>
                <li>4. Check console for throttling warnings</li>
                <li>5. Notice skeleton screens during loading</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
