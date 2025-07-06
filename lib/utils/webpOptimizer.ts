'use client'

interface WebPOptimizationReport {
  totalImages: number
  webpImages: number
  webpUsagePercentage: number
  webpSavingsEstimate: number
  unsupportedImages: string[]
  recommendations: {
    shouldConvert: string[]
    alreadyOptimized: string[]
    conversionPriority: 'high' | 'medium' | 'low'
  }
}

class WebPOptimizer {
  private static instance: WebPOptimizer
  private webpSupported: boolean | null = null
  private checkedImages: Set<string> = new Set()

  static getInstance(): WebPOptimizer {
    if (!WebPOptimizer.instance) {
      WebPOptimizer.instance = new WebPOptimizer()
    }
    return WebPOptimizer.instance
  }

  // Check if browser supports WebP
  async checkWebPSupport(): Promise<boolean> {
    if (this.webpSupported !== null) {
      return this.webpSupported
    }

    return new Promise((resolve) => {
      const webp = new window.Image()
      webp.onload = webp.onerror = () => {
        this.webpSupported = webp.height === 2
        resolve(this.webpSupported)
      }
      webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
    })
  }

  // Get WebP version of an image URL if possible
  getWebPUrl(originalUrl: string): string {
    // Check if it's already WebP
    if (originalUrl.includes('.webp') || originalUrl.includes('format=webp')) {
      return originalUrl
    }

    // For Next.js images or CDN URLs, try to add WebP format
    if (originalUrl.includes('/_next/image')) {
      const url = new URL(originalUrl, window.location.origin)
      url.searchParams.set('f', 'webp')
      return url.toString()
    }

    // For external CDNs (example patterns)
    if (originalUrl.includes('images.unsplash.com')) {
      return `${originalUrl}&fm=webp`
    }

    if (originalUrl.includes('cloudinary.com')) {
      return originalUrl.replace('/image/upload/', '/image/upload/f_webp/')
    }

    // For local images, don't auto-convert to WebP since files may not exist
    // Only convert if the WebP version actually exists
    if (originalUrl.startsWith('/images/') || originalUrl.startsWith('./images/')) {
      return originalUrl
    }
    
    // For other external images, suggest WebP alternatives
    const webpUrl = originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    return webpUrl
  }

  // Check if an image should be converted to WebP
  shouldConvertToWebP(url: string, fileSize?: number): boolean {
    // Skip if already WebP
    if (url.includes('.webp') || url.includes('format=webp')) {
      return false
    }

    // Check file extension
    const isConvertibleFormat = /\.(jpg|jpeg|png|gif)$/i.test(url)
    if (!isConvertibleFormat) {
      return false
    }

    // If we have file size info, prioritize larger images
    if (fileSize && fileSize < 10 * 1024) { // Less than 10KB
      return false
    }

    return true
  }

  // Estimate potential file size savings with WebP
  estimateWebPSavings(originalFormat: string, fileSize?: number): number {
    if (!fileSize) return 0

    const savings = {
      'jpg': 0.25,  // 25% average savings
      'jpeg': 0.25,
      'png': 0.45,  // 45% average savings (PNG compresses better to WebP)
      'gif': 0.35   // 35% average savings
    }

    const format = originalFormat.toLowerCase()
    const savingsPercentage = savings[format as keyof typeof savings] || 0.25
    
    return Math.round(fileSize * savingsPercentage)
  }

  // Analyze images and provide optimization recommendations
  analyzeImages(imageUrls: string[]): WebPOptimizationReport {
    const webpImages = imageUrls.filter(url => 
      url.includes('.webp') || url.includes('format=webp')
    ).length

    const shouldConvert: string[] = []
    const alreadyOptimized: string[] = []
    const unsupportedImages: string[] = []

    let totalEstimatedSavings = 0

    imageUrls.forEach(url => {
      if (url.includes('.webp') || url.includes('format=webp')) {
        alreadyOptimized.push(url)
      } else if (this.shouldConvertToWebP(url)) {
        shouldConvert.push(url)
        // Estimate savings (assuming average 100KB file size if unknown)
        const format = url.split('.').pop()?.toLowerCase() || 'jpg'
        totalEstimatedSavings += this.estimateWebPSavings(format, 100 * 1024)
      } else {
        unsupportedImages.push(url)
      }
    })

    const webpUsagePercentage = (webpImages / imageUrls.length) * 100

    let conversionPriority: 'high' | 'medium' | 'low' = 'low'
    if (webpUsagePercentage < 30) {
      conversionPriority = 'high'
    } else if (webpUsagePercentage < 70) {
      conversionPriority = 'medium'
    }

    return {
      totalImages: imageUrls.length,
      webpImages,
      webpUsagePercentage,
      webpSavingsEstimate: totalEstimatedSavings,
      unsupportedImages,
      recommendations: {
        shouldConvert,
        alreadyOptimized,
        conversionPriority
      }
    }
  }

  // Log WebP optimization recommendations
  logOptimizationReport(imageUrls: string[]): void {
    if (process.env.NODE_ENV !== 'development') return

    const report = this.analyzeImages(imageUrls)

    console.group('🎨 WebP Optimization Report')
    console.log(`Total Images: ${report.totalImages}`)
    console.log(`WebP Images: ${report.webpImages} (${report.webpUsagePercentage.toFixed(1)}%)`)
    console.log(`Estimated Savings: ${(report.webpSavingsEstimate / 1024).toFixed(1)}KB`)
    console.log(`Conversion Priority: ${report.recommendations.conversionPriority.toUpperCase()}`)

    if (report.recommendations.shouldConvert.length > 0) {
      console.group('📋 Images to Convert to WebP')
      report.recommendations.shouldConvert.forEach((url, index) => {
        if (index < 10) { // Limit to first 10 for readability
          console.log(`• ${url}`)
        }
      })
      if (report.recommendations.shouldConvert.length > 10) {
        console.log(`... and ${report.recommendations.shouldConvert.length - 10} more`)
      }
      console.groupEnd()
    }

    if (report.recommendations.alreadyOptimized.length > 0) {
      console.log(`✅ ${report.recommendations.alreadyOptimized.length} images already using WebP`)
    }

    if (report.unsupportedImages.length > 0) {
      console.group('⚠️ Unsupported Image Formats')
      report.unsupportedImages.forEach(url => console.log(`• ${url}`))
      console.groupEnd()
    }

    // Provide actionable recommendations
    console.group('💡 Recommendations')
    if (report.webpUsagePercentage < 50) {
      console.log('• Convert high-priority images to WebP format for better performance')
      console.log('• Consider using Next.js Image Optimization with automatic WebP conversion')
    }
    if (report.webpUsagePercentage < 30) {
      console.log('• WebP usage is very low - this should be a high priority optimization')
    }
    if (report.webpSavingsEstimate > 100 * 1024) {
      console.log(`• Potential bandwidth savings: ${(report.webpSavingsEstimate / 1024).toFixed(1)}KB`)
    }
    console.groupEnd()

    console.groupEnd()
  }

  // Test WebP support and log results
  async testAndLogWebPSupport(): Promise<void> {
    if (process.env.NODE_ENV !== 'development') return

    const supported = await this.checkWebPSupport()
    
    if (supported) {
      console.log('✅ WebP format is supported in this browser')
    } else {
      console.warn('⚠️ WebP format is not supported in this browser - falling back to original formats')
    }
  }

  // Get fallback URL for browsers that don't support WebP
  getFallbackUrl(webpUrl: string, originalUrl: string): string {
    return this.webpSupported ? webpUrl : originalUrl
  }

  // Check if image dimensions maintain square aspect ratio
  async checkSquareFormat(url: string): Promise<{
    isSquare: boolean
    dimensions: { width: number; height: number }
    aspectRatio: number
  }> {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.onload = () => {
        const aspectRatio = img.naturalWidth / img.naturalHeight
        const isSquare = Math.abs(aspectRatio - 1) < 0.1 // Allow 10% tolerance
        
        resolve({
          isSquare,
          dimensions: { width: img.naturalWidth, height: img.naturalHeight },
          aspectRatio
        })
      }
      
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${url}`))
      }
      
      img.src = url
    })
  }

  // Validate that critical images maintain square format across viewports
  async validateSquareFormats(imageUrls: string[]): Promise<void> {
    if (process.env.NODE_ENV !== 'development') return

    console.group('📐 Square Format Validation')
    
    for (const url of imageUrls) {
      try {
        const result = await this.checkSquareFormat(url)
        
        if (result.isSquare) {
          console.log(`✅ ${url} - Square format maintained (${result.dimensions.width}x${result.dimensions.height})`)
        } else {
          console.warn(`⚠️ ${url} - Non-square format detected (${result.dimensions.width}x${result.dimensions.height}, ratio: ${result.aspectRatio.toFixed(2)})`)
        }
      } catch (error) {
        console.error(`❌ ${url} - Failed to validate: ${error}`)
      }
    }
    
    console.groupEnd()
  }
}

// Export singleton instance
export const webpOptimizer = WebPOptimizer.getInstance()

// Utility functions
export const checkWebPSupport = () => {
  return webpOptimizer.checkWebPSupport()
}

export const getWebPUrl = (originalUrl: string) => {
  return webpOptimizer.getWebPUrl(originalUrl)
}

export const analyzeWebPOptimization = (imageUrls: string[]) => {
  return webpOptimizer.analyzeImages(imageUrls)
}

export const logWebPOptimizationReport = (imageUrls: string[]) => {
  webpOptimizer.logOptimizationReport(imageUrls)
}

export const testWebPSupport = () => {
  return webpOptimizer.testAndLogWebPSupport()
}

export const validateSquareFormats = (imageUrls: string[]) => {
  return webpOptimizer.validateSquareFormats(imageUrls)
}
