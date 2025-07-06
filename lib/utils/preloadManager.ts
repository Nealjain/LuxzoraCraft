'use client'

interface PreloadOptions {
  as?: 'image' | 'style' | 'script' | 'font' | 'fetch'
  crossOrigin?: 'anonymous' | 'use-credentials'
  type?: string
  media?: string
  fetchPriority?: 'high' | 'low' | 'auto'
}

interface PreloadLink {
  href: string
  id: string
  element: HTMLLinkElement
}

class PreloadManager {
  private preloadedLinks: Map<string, PreloadLink> = new Map()
  private static instance: PreloadManager

  static getInstance(): PreloadManager {
    if (!PreloadManager.instance) {
      PreloadManager.instance = new PreloadManager()
    }
    return PreloadManager.instance
  }

  private createPreloadId(href: string): string {
    return `preload-${btoa(href).replace(/[^a-zA-Z0-9]/g, '')}`
  }

  preloadResource(href: string, options: PreloadOptions = {}): void {
    if (typeof document === 'undefined') return
    
    const id = this.createPreloadId(href)
    
    // Check if already preloaded
    if (this.preloadedLinks.has(id)) {
      return
    }

    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.id = id
    
    // Set options
    if (options.as) link.as = options.as
    if (options.crossOrigin) link.crossOrigin = options.crossOrigin
    if (options.type) link.type = options.type
    if (options.media) link.media = options.media
    if (options.fetchPriority) (link as any).fetchPriority = options.fetchPriority

    // Add to document head
    document.head.appendChild(link)

    // Store reference
    this.preloadedLinks.set(id, { href, id, element: link })
  }

  preloadImages(urls: string[], options: Omit<PreloadOptions, 'as'> = {}): void {
    urls.forEach(url => {
      this.preloadResource(url, { ...options, as: 'image' })
    })
  }

  preloadCriticalImages(urls: string[]): void {
    this.preloadImages(urls, { fetchPriority: 'high' })
  }

  removePreload(href: string): void {
    const id = this.createPreloadId(href)
    const preloadLink = this.preloadedLinks.get(id)
    
    if (preloadLink && preloadLink.element.parentNode) {
      preloadLink.element.parentNode.removeChild(preloadLink.element)
      this.preloadedLinks.delete(id)
    }
  }

  removeAllPreloads(): void {
    this.preloadedLinks.forEach(({ element }) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element)
      }
    })
    this.preloadedLinks.clear()
  }

  isPreloaded(href: string): boolean {
    const id = this.createPreloadId(href)
    return this.preloadedLinks.has(id)
  }

  getPreloadedLinks(): PreloadLink[] {
    return Array.from(this.preloadedLinks.values())
  }
}

// Export singleton instance
export const preloadManager = PreloadManager.getInstance()

// Export utility functions
export const preloadImage = (href: string, options?: Omit<PreloadOptions, 'as'>) => {
  preloadManager.preloadResource(href, { ...options, as: 'image' })
}

export const preloadImages = (urls: string[], options?: Omit<PreloadOptions, 'as'>) => {
  preloadManager.preloadImages(urls, options)
}

export const preloadCriticalImages = (urls: string[]) => {
  preloadManager.preloadCriticalImages(urls)
}

export const removePreload = (href: string) => {
  preloadManager.removePreload(href)
}

export const removeAllPreloads = () => {
  preloadManager.removeAllPreloads()
}

export const isPreloaded = (href: string) => {
  preloadManager.isPreloaded(href)
}
