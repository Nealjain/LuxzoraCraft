'use client'

import { useState, useEffect } from 'react'
import { 
  getImagePerformanceReport, 
  logImagePerformanceReport,
  detectNetworkThrottling,
  clearImageMetrics
} from '@/lib/utils/imagePerformanceMonitor'
import { 
  analyzeWebPOptimization,
  logWebPOptimizationReport,
  testWebPSupport
} from '@/lib/utils/webpOptimizer'

interface NetworkConditions {
  isThrottled: boolean
  estimatedSpeed: string
  connectionType: string
}

export default function ImagePerformanceDevTool() {
  const [isVisible, setIsVisible] = useState(false)
  const [networkConditions, setNetworkConditions] = useState<NetworkConditions | null>(null)
  const [performanceReport, setPerformanceReport] = useState<any>(null)
  const [webpReport, setWebpReport] = useState<any>(null)

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  useEffect(() => {
    // Check network conditions on mount
    detectNetworkThrottling().then(setNetworkConditions)
    
    // Update reports periodically
    const interval = setInterval(() => {
      setPerformanceReport(getImagePerformanceReport())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  const handleGenerateFullReport = () => {
    logImagePerformanceReport()
    
    // Collect all tracked image URLs (you'd need to implement this)
    const imageUrls: string[] = [] // This would need to be collected from your image tracking
    logWebPOptimizationReport(imageUrls)
  }

  const handleClearMetrics = () => {
    clearImageMetrics()
    setPerformanceReport(null)
    console.log('🧹 Performance metrics cleared')
  }

  const handleTestWebP = () => {
    testWebPSupport()
  }

  const handleRefreshNetworkConditions = () => {
    detectNetworkThrottling().then(setNetworkConditions)
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-4 right-4 z-[9999]">
        <button
          onClick={handleToggleVisibility}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          title="Image Performance Monitor"
        >
          📊
        </button>
      </div>

      {/* Performance Panel */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 w-80 bg-white border border-gray-300 rounded-lg shadow-xl z-[9998] max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Image Performance</h3>
              <button
                onClick={handleToggleVisibility}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4 text-sm">
            {/* Network Conditions */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-700">Network Conditions</h4>
                <button
                  onClick={handleRefreshNetworkConditions}
                  className="text-blue-600 hover:text-blue-800 text-xs"
                >
                  Refresh
                </button>
              </div>
              {networkConditions ? (
                <div className="bg-gray-100 p-2 rounded text-xs">
                  <div>Type: {networkConditions.connectionType}</div>
                  <div>Speed: {networkConditions.estimatedSpeed}</div>
                  <div className={`font-semibold ${networkConditions.isThrottled ? 'text-red-600' : 'text-green-600'}`}>
                    {networkConditions.isThrottled ? '🐌 Throttled' : '🚀 Normal'}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-xs">Loading...</div>
              )}
            </div>

            {/* Performance Metrics */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Performance Metrics</h4>
              {performanceReport ? (
                <div className="bg-gray-100 p-2 rounded text-xs space-y-1">
                  <div>Total Images: {performanceReport.totalImages}</div>
                  <div>Avg Load Time: {performanceReport.averageLoadTime.toFixed(0)}ms</div>
                  <div>WebP Usage: {(performanceReport.webpUsage * 100).toFixed(1)}%</div>
                  <div>Slow Loads: {performanceReport.slowLoads}</div>
                  <div>Failed Loads: {performanceReport.failedLoads}</div>
                  
                  {performanceReport.recommendations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-300">
                      <div className="font-semibold text-orange-600">Recommendations:</div>
                      {performanceReport.recommendations.slice(0, 2).map((rec: string, index: number) => (
                        <div key={index} className="text-orange-600">• {rec}</div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 text-xs">No data available</div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleGenerateFullReport}
                className="w-full bg-blue-600 text-white py-2 px-3 rounded text-xs hover:bg-blue-700 transition-colors"
              >
                Generate Full Report
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleTestWebP}
                  className="bg-green-600 text-white py-1 px-2 rounded text-xs hover:bg-green-700 transition-colors"
                >
                  Test WebP
                </button>
                
                <button
                  onClick={handleClearMetrics}
                  className="bg-red-600 text-white py-1 px-2 rounded text-xs hover:bg-red-700 transition-colors"
                >
                  Clear Metrics
                </button>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-yellow-50 border border-yellow-200 p-2 rounded">
              <div className="font-semibold text-yellow-800 text-xs mb-1">Quick Tips:</div>
              <ul className="text-yellow-700 text-xs space-y-1">
                <li>• Check console for detailed logs</li>
                <li>• Images should load under 1000ms</li>
                <li>• Aim for 80%+ WebP usage</li>
                <li>• Square images should maintain aspect ratio</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
