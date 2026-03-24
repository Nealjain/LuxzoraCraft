'use client'

import { useState, useEffect, useRef, RefObject } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
  freezeOnceVisible?: boolean
}

interface UseIntersectionObserverReturn {
  ref: RefObject<Element>
  isIntersecting: boolean
  hasIntersected: boolean
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
  } = options

  const ref = useRef<Element>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // If frozen once visible and already intersected, don't re-observe
    if (freezeOnceVisible && hasIntersected) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersecting = entry.isIntersecting
        setIsIntersecting(intersecting)

        if (intersecting) {
          setHasIntersected(true)
          // If freeze on visible, unobserve after first intersection
          if (freezeOnceVisible) {
            observer.unobserve(element)
          }
        }
      },
      { threshold, root, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, root, rootMargin, freezeOnceVisible, hasIntersected])

  return { ref, isIntersecting, hasIntersected }
}

// Simpler single-element version (returns ref + boolean)
export function useIsVisible(
  rootMargin = '0px',
  freezeOnceVisible = true
): [RefObject<Element>, boolean] {
  const { ref, hasIntersected } = useIntersectionObserver({
    rootMargin,
    freezeOnceVisible,
    threshold: 0.1,
  })
  return [ref, hasIntersected]
}
