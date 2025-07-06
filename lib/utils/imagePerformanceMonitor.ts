'use client'

interface ImageLoadMetrics {
  url: string
  loadStartTime: number
  loadEndTime: number
  loadDuration: number
  fileSize?: number
  format: string
  dimensions?: { width: number; height: number }
  isWebP: boolean
  connectionType?: string
  bandwidth?: number
  error?: string
}

interface PerformanceThresholds {
  goodLoadTime: number
  warningLoadTime: number
  maxLoadTime: number
  minWebPUsage: number
}

class ImagePerformanceMonitor {
  private metrics: Map<string, ImageLoadMetrics> = new Map()
  private static instance: ImagePerformanceMonitor
  private isDevelopment: boolean
  private thresholds: PerformanceThresholds

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
    this.thresholds = {
      goodLoadTime: 500, // ms
      warningLoadTime: 1000, // ms  
      maxLoadTime: 3000, // ms
      minWebPUsage: 0.8 // 80% of images should be WebP
    }
  }

  static getInstance(): ImagePerformanceMonitor {
    if (!ImagePerformanceMonitor.instance) {
      ImagePerformanceMonitor.instance = new ImagePerformanceMonitor()
    }
    return ImagePerformanceMonitor.instance
  }

  private getConnectionInfo() {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection
      return {
        connectionType: connection?.effectiveType || 'unknown',
        bandwidth: connection?.downlink || 0
      }
    }
    return { connectionType: 'unknown', bandwidth: 0 }
  }

  private getImageFormat(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase()
    return extension || 'unknown'
  }

  private isWebPFormat(url: string): boolean {
    return url.toLowerCase().includes('.webp') || url.includes('format=webp')
  }

  private logPerformanceMetric(metric: ImageLoadMetrics) {
    if (!this.isDevelopment) return

    const { connectionType, bandwidth } = this.getConnectionInfo()
    const isSlowNetwork = connectionType === '2g' || connectionType === 'slow-2g' || bandwidth < 1

    let logLevel = 'info'
    let message = `Image loaded: ${metric.url}`

    if (metric.error) {
      logLevel = 'error'
      message = `Image failed to load: ${metric.url} - ${metric.error}`
    } else if (metric.loadDuration > this.thresholds.maxLoadTime) {
      logLevel = 'error'
      message = `Slow image load (${metric.loadDuration}ms): ${metric.url}`
    } else if (metric.loadDuration > this.thresholds.warningLoadTime) {
      logLevel = 'warn'
      message = `Moderately slow image load (${metric.loadDuration}ms): ${metric.url}`
    }

    const logData = {
      url: metric.url,
      loadTime: `${metric.loadDuration}ms`,
      format: metric.format,
      isWebP: metric.isWebP,
      dimensions: metric.dimensions,
      fileSize: metric.fileSize ? `${(metric.fileSize / 1024).toFixed(1)}KB` : 'unknown',
      connectionType,
      bandwidth: bandwidth ? `${bandwidth}Mbps` : 'unknown',
      isSlowNetwork,
      timestamp: new Date().toISOString()
    }

    switch (logLevel) {
      case 'error':
        console.error(`🚨 ${message}`, logData)
        break
      case 'warn':
        console.warn(`⚠️ ${message}`, logData)
        break
      default:
        console.log(`✅ ${message}`, logData)
    }

    // Additional warnings for optimization opportunities
    if (!metric.isWebP && this.isDevelopment) {
      console.warn(`📸 Consider using WebP format for: ${metric.url}`)
    }

    if (isSlowNetwork && metric.loadDuration > this.thresholds.goodLoadTime) {
      console.warn(`🐌 Image load time concerning on slow network: ${metric.url}`)
    }
  }

  startTracking(url: string): void {
    const connectionInfo = this.getConnectionInfo()
    const metric: ImageLoadMetrics = {
      url,
      loadStartTime: performance.now(),
      loadEndTime: 0,
      loadDuration: 0,
      format: this.getImageFormat(url),
      isWebP: this.isWebPFormat(url),
      ...connectionInfo
    }
    this.metrics.set(url, metric)

    if (this.isDevelopment) {
      console.log(`📊 Started tracking image load: ${url}`)
    }
  }

  endTracking(url: string, success: boolean = true, error?: string): void {
    const metric = this.metrics.get(url)
    if (!metric) return

    metric.loadEndTime = performance.now()
    metric.loadDuration = metric.loadEndTime - metric.loadStartTime
    
    if (!success && error) {
      metric.error = error
    }

    this.logPerformanceMetric(metric)
    this.checkImageDimensions(url, metric)
  }

  private async checkImageDimensions(url: string, metric: ImageLoadMetrics): Promise<void> {
    try {
      // Create a temporary image to get dimensions
      const img = new Image()
      img.onload = () => {
        metric.dimensions = { width: img.naturalWidth, height: img.naturalHeight }
        
        // Check if image maintains square aspect ratio
        const aspectRatio = img.naturalWidth / img.naturalHeight
        const isSquare = Math.abs(aspectRatio - 1) < 0.1 // Allow 10% tolerance
        
        if (this.isDevelopment) {
          if (!isSquare) {
            console.warn(`📐 Non-square image detected: ${url} (${img.naturalWidth}x${img.naturalHeight}, ratio: ${aspectRatio.toFixed(2)})`)
          }
          
          console.log(`📏 Image dimensions: ${url} - ${img.naturalWidth}x${img.naturalHeight}`)
        }
      }
      img.src = url
    } catch (error) {
      if (this.isDevelopment) {
        console.warn(`Could not get dimensions for: ${url}`, error)
      }
    }
  }

  getMetrics(): ImageLoadMetrics[] {
    return Array.from(this.metrics.values())
  }

  getPerformanceReport(): {
    totalImages: number
    averageLoadTime: number
    webpUsage: number
    slowLoads: number
    failedLoads: number
    recommendations: string[]
  } {
    const metrics = this.getMetrics()
    const totalImages = metrics.length
    
    if (totalImages === 0) {
      return {
        totalImages: 0,
        averageLoadTime: 0,
        webpUsage: 0,
        slowLoads: 0,
        failedLoads: 0,
        recommendations: []
      }
    }

    const successfulLoads = metrics.filter(m => !m.error)
    const averageLoadTime = successfulLoads.reduce((sum, m) => sum + m.loadDuration, 0) / successfulLoads.length
    const webpImages = metrics.filter(m => m.isWebP).length
    const webpUsage = webpImages / totalImages
    const slowLoads = metrics.filter(m => m.loadDuration > this.thresholds.warningLoadTime).length
    const failedLoads = metrics.filter(m => m.error).length

    const recommendations: string[] = []
    
    if (webpUsage < this.thresholds.minWebPUsage) {
      recommendations.push(`Consider converting more images to WebP format (currently ${(webpUsage * 100).toFixed(1)}%)`)
    }
    
    if (averageLoadTime > this.thresholds.warningLoadTime) {
      recommendations.push(`Average load time is high (${averageLoadTime.toFixed(0)}ms). Consider image optimization.`)
    }
    
    if (slowLoads > totalImages * 0.2) {
      recommendations.push(`${slowLoads} images are loading slowly. Review image sizes and compression.`)
    }
    
    if (failedLoads > 0) {
      recommendations.push(`${failedLoads} images failed to load. Check image URLs and availability.`)
    }

    return {
      totalImages,
      averageLoadTime,
      webpUsage,
      slowLoads,
      failedLoads,
      recommendations
    }
  }

  logPerformanceReport(): void {
    if (!this.isDevelopment) return

    const report = this.getPerformanceReport()
    
    console.group('📊 Image Performance Report')
    console.log(`Total Images: ${report.totalImages}`)
    console.log(`Average Load Time: ${report.averageLoadTime.toFixed(0)}ms`)
    console.log(`WebP Usage: ${(report.webpUsage * 100).toFixed(1)}%`)
    console.log(`Slow Loads: ${report.slowLoads}`)
    console.log(`Failed Loads: ${report.failedLoads}`)
    
    if (report.recommendations.length > 0) {
      console.group('💡 Recommendations')
      report.recommendations.forEach(rec => console.log(`• ${rec}`))
      console.groupEnd()
    }
    
    console.groupEnd()
  }

  clearMetrics(): void {
    this.metrics.clear()
  }

  // Network throttling detection
  detectNetworkThrottling(): Promise<{
    isThrottled: boolean
    estimatedSpeed: string
    connectionType: string
  }> {
    return new Promise((resolve) => {
      const connectionInfo = this.getConnectionInfo()
      
      // Create a small test image to measure actual speed
      const testImageUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' // 1x1 transparent gif
      const startTime = performance.now()
      
      const img = new Image()
      img.onload = () => {
        const loadTime = performance.now() - startTime
        const isThrottled = loadTime > 100 || connectionInfo.connectionType === '2g' || connectionInfo.connectionType === 'slow-2g'
        
        resolve({
          isThrottled,
          estimatedSpeed: connectionInfo.bandwidth ? `${connectionInfo.bandwidth}Mbps` : 'unknown',
          connectionType: connectionInfo.connectionType
        })
      }
      
      img.onerror = () => {
        resolve({
          isThrottled: false,
          estimatedSpeed: 'unknown',
          connectionType: connectionInfo.connectionType
        })
      }
      
      img.src = testImageUrl
    })
  }
}

// Export singleton instance
export const imagePerformanceMonitor = ImagePerformanceMonitor.getInstance()

// Utility functions
export const startImageTracking = (url: string) => {
  imagePerformanceMonitor.startTracking(url)
}

export const endImageTracking = (url: string, success: boolean = true, error?: string) => {
  imagePerformanceMonitor.endTracking(url, success, error)
}

export const getImagePerformanceReport = () => {
  return imagePerformanceMonitor.getPerformanceReport()
}

export const logImagePerformanceReport = () => {
  imagePerformanceMonitor.logPerformanceReport()
}

export const detectNetworkThrottling = () => {
  return imagePerformanceMonitor.detectNetworkThrottling()
}

export const clearImageMetrics = () => {
  imagePerformanceMonitor.clearMetrics()
}
