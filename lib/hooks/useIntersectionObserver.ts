'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface UseIntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  once?: boolean
  onIntersect?: (entry: IntersectionObserverEntry) => void
}

interface UseIntersectionObserverReturn {
  ref: React.RefObject<HTMLElement>
  isIntersecting: boolean
  hasIntersected: boolean
  entry: IntersectionObserverEntry | null
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0.1,
    once = false,
    onIntersect
  } = options

  const ref = useRef<HTMLElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries
    const isCurrentlyIntersecting = entry.isIntersecting

    setIsIntersecting(isCurrentlyIntersecting)
    setEntry(entry)

    if (isCurrentlyIntersecting && !hasIntersected) {
      setHasIntersected(true)
    }

    if (isCurrentlyIntersecting) {
      onIntersect?.(entry)
    }
  }, [hasIntersected, onIntersect])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(handleIntersect, {
      root,
      rootMargin,
      threshold
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [root, rootMargin, threshold, handleIntersect])

  useEffect(() => {
    if (once && hasIntersected && ref.current) {
      // Optionally disconnect observer after first intersection
      const element = ref.current
      const observer = new IntersectionObserver(() => {}, {})
      observer.unobserve(element)
    }
  }, [once, hasIntersected])

  return {
    ref,
    isIntersecting,
    hasIntersected,
    entry
  }
}
