'use client'

import { useEffect, useCallback, useRef } from 'react'
import { 
  logImagePerformanceReport, 
  detectNetworkThrottling, 
  clearImageMetrics,
  getImagePerformanceReport
} from '@/lib/utils/imagePerformanceMonitor'
import { 
  logWebPOptimizationReport, 
  testWebPSupport, 
  validateSquareFormats 
} from '@/lib/utils/webpOptimizer'

interface PerformanceMonitoringConfig {
  enablePerformanceLogging?: boolean
  enableWebPOptimizationReport?: boolean
  enableSquareFormatValidation?: boolean
  enableNetworkThrottlingDetection?: boolean
  reportInterval?: number // in milliseconds
  criticalImageUrls?: string[]
}

interface UseImagePerformanceMonitoringReturn {
  startMonitoring: () => void
  stopMonitoring: () => void
  generateReport: () => void
  clearMetrics: () => void
  checkNetworkConditions: () => Promise<{
    isThrottled: boolean
    estimatedSpeed: string
    connectionType: string
  }>
  monitorCriticalImages: (imageUrls: string[]) => Promise<void>
}

export function useImagePerformanceMonitoring(
  config: PerformanceMonitoringConfig = {}
): UseImagePerformanceMonitoringReturn {
  const {
    enablePerformanceLogging = true,
    enableWebPOptimizationReport = true,
    enableSquareFormatValidation = false,
    enableNetworkThrottlingDetection = true,
    reportInterval = 30000, // 30 seconds
    criticalImageUrls = []
  } = config

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMonitoringRef = useRef(false)
  const collectedImageUrls = useRef<Set<string>>(new Set())

  // Collect image URLs as they're loaded
  const addImageUrl = useCallback((url: string) => {
    collectedImageUrls.current.add(url)
  }, [])

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (isMonitoringRef.current || process.env.NODE_ENV !== 'development') return

    isMonitoringRef.current = true
    
    console.log('🔍 Starting image performance monitoring...')

    // Test WebP support on startup
    if (enableWebPOptimizationReport) {
      testWebPSupport()
    }

    // Set up periodic reporting
    if (enablePerformanceLogging && reportInterval > 0) {
      intervalRef.current = setInterval(() => {
        generateReport()
      }, reportInterval)
    }

    // Check network conditions
    if (enableNetworkThrottlingDetection) {
      checkNetworkConditions().then(conditions => {
        if (conditions.isThrottled) {
          console.warn('🐌 Throttled network detected. Image performance may be impacted.')
          console.log(`Connection: ${conditions.connectionType}, Speed: ${conditions.estimatedSpeed}`)
        } else {
          console.log(`📶 Network conditions: ${conditions.connectionType}, Speed: ${conditions.estimatedSpeed}`)
        }
      })
    }
  }, [
    enablePerformanceLogging,
    enableWebPOptimizationReport,
    enableNetworkThrottlingDetection,
    reportInterval
  ])

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    if (!isMonitoringRef.current) return

    isMonitoringRef.current = false
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Generate final report
    generateReport()
    
    console.log('🏁 Image performance monitoring stopped')
  }, [])

  // Generate comprehensive report
  const generateReport = useCallback(() => {
    if (process.env.NODE_ENV !== 'development') return

    const imageUrls = Array.from(collectedImageUrls.current)
    
    if (imageUrls.length === 0) {
      console.log('📊 No images to report on yet')
      return
    }

    console.group('🎯 Image Performance & Optimization Report')
    
    // Performance metrics report
    if (enablePerformanceLogging) {
      logImagePerformanceReport()
    }

    // WebP optimization report
    if (enableWebPOptimizationReport) {
      logWebPOptimizationReport(imageUrls)
    }

    // Square format validation (if enabled)
    if (enableSquareFormatValidation) {
      validateSquareFormats(imageUrls).catch(error => {
        console.warn('Error validating square formats:', error)
      })
    }

    console.groupEnd()
  }, [enablePerformanceLogging, enableWebPOptimizationReport, enableSquareFormatValidation])

  // Clear all metrics
  const clearMetrics = useCallback(() => {
    clearImageMetrics()
    collectedImageUrls.current.clear()
    console.log('🧹 Image performance metrics cleared')
  }, [])

  // Check network conditions
  const checkNetworkConditions = useCallback(async () => {
    try {
      return await detectNetworkThrottling()
    } catch (error) {
      console.warn('Error detecting network conditions:', error)
      return {
        isThrottled: false,
        estimatedSpeed: 'unknown',
        connectionType: 'unknown'
      }
    }
  }, [])

  // Monitor specific critical images
  const monitorCriticalImages = useCallback(async (imageUrls: string[]) => {
    if (process.env.NODE_ENV !== 'development') return

    console.group('🎯 Critical Images Analysis')
    
    // Add to collected URLs
    imageUrls.forEach(url => addImageUrl(url))

    // Performance report for these specific images
    const report = getImagePerformanceReport()
    const criticalMetrics = report // You could filter this for specific URLs
    
    console.log(`Analyzing ${imageUrls.length} critical images`)
    console.log(`Current metrics: ${report.totalImages} total images tracked`)
    
    if (enableWebPOptimizationReport) {
      logWebPOptimizationReport(imageUrls)
    }

    if (enableSquareFormatValidation) {
      await validateSquareFormats(imageUrls)
    }

    // Check if any critical images are loading slowly
    const networkConditions = await checkNetworkConditions()
    if (networkConditions.isThrottled) {
      console.warn('⚠️ Critical images may load slowly due to network conditions')
    }

    console.groupEnd()
  }, [addImageUrl, enableWebPOptimizationReport, enableSquareFormatValidation])

  // Auto-start monitoring on mount
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      startMonitoring()
    }

    return () => {
      stopMonitoring()
    }
  }, [startMonitoring, stopMonitoring])

  // Monitor critical images on mount
  useEffect(() => {
    if (criticalImageUrls.length > 0) {
      monitorCriticalImages(criticalImageUrls)
    }
  }, [criticalImageUrls, monitorCriticalImages])

  // Add window event listeners for performance insights
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        generateReport()
      }
    }

    const handleBeforeUnload = () => {
      generateReport()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [generateReport])

  return {
    startMonitoring,
    stopMonitoring,
    generateReport,
    clearMetrics,
    checkNetworkConditions,
    monitorCriticalImages
  }
}

// Convenience hook for basic monitoring
export function useBasicImagePerformanceMonitoring() {
  return useImagePerformanceMonitoring({
    enablePerformanceLogging: true,
    enableWebPOptimizationReport: true,
    enableSquareFormatValidation: false,
    enableNetworkThrottlingDetection: true,
    reportInterval: 30000
  })
}

// Hook for critical image monitoring (hero images, above-fold content)
export function useCriticalImageMonitoring(criticalImageUrls: string[]) {
  return useImagePerformanceMonitoring({
    enablePerformanceLogging: true,
    enableWebPOptimizationReport: true,
    enableSquareFormatValidation: true,
    enableNetworkThrottlingDetection: true,
    reportInterval: 10000, // More frequent reporting for critical images
    criticalImageUrls
  })
}

// Hook for square format validation (product images, profile photos)
export function useSquareFormatMonitoring(imageUrls: string[]) {
  return useImagePerformanceMonitoring({
    enablePerformanceLogging: true,
    enableWebPOptimizationReport: false,
    enableSquareFormatValidation: true,
    enableNetworkThrottlingDetection: false,
    reportInterval: 0, // No periodic reporting
    criticalImageUrls: imageUrls
  })
}
