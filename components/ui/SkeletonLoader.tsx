'use client'

import { forwardRef } from 'react'

interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
  width?: number | string
  height?: number | string
  variant?: 'rectangular' | 'circular' | 'rounded' | 'text'
  animation?: 'pulse' | 'wave' | 'none'
  children?: React.ReactNode
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className = '',
      style,
      width,
      height,
      variant = 'rectangular',
      animation = 'pulse',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'bg-gray-300 dark:bg-gray-700'
    
    const variantClasses = {
      rectangular: 'rounded-none',
      circular: 'rounded-full',
      rounded: 'rounded-lg',
      text: 'rounded-sm'
    }

    const animationClasses = {
      pulse: 'animate-pulse',
      wave: 'animate-bounce',
      none: ''
    }

    const combinedStyle = {
      width,
      height,
      ...style
    }

    return (
      <div
        ref={ref}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${animationClasses[animation]}
          ${className}
        `}
        style={combinedStyle}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Skeleton.displayName = 'Skeleton'

// Product Card Skeleton
export const ProductCardSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`space-y-4 ${className}`}>
    <Skeleton 
      variant="rounded" 
      className="aspect-square w-full" 
    />
    <div className="space-y-2">
      <Skeleton variant="text" height="1.25rem" />
      <Skeleton variant="text" height="1rem" width="60%" />
    </div>
  </div>
)

// Hero Section Skeleton
export const HeroSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`h-screen w-full bg-gray-300 dark:bg-gray-700 animate-pulse ${className}`}>
    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 p-8">
      <Skeleton variant="text" height="3rem" width="300px" />
      <Skeleton variant="text" height="1.5rem" width="500px" />
      <Skeleton variant="rounded" height="3rem" width="200px" />
    </div>
  </div>
)

// Image Gallery Skeleton
export const ImageGallerySkeleton = ({ 
  count = 6, 
  className = '' 
}: { 
  count?: number
  className?: string 
}) => (
  <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton 
        key={index}
        variant="rounded" 
        className="aspect-square w-full" 
      />
    ))}
  </div>
)

// Product Detail Skeleton
export const ProductDetailSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`grid lg:grid-cols-2 gap-8 ${className}`}>
    {/* Image Section */}
    <div className="space-y-4">
      <Skeleton variant="rounded" className="aspect-square w-full" />
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton 
            key={index}
            variant="rounded" 
            className="aspect-square w-full" 
          />
        ))}
      </div>
    </div>

    {/* Details Section */}
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton variant="text" height="2rem" />
        <Skeleton variant="text" height="1.5rem" width="40%" />
      </div>
      
      <Skeleton variant="text" height="1rem" />
      <Skeleton variant="text" height="1rem" width="80%" />
      <Skeleton variant="text" height="1rem" width="60%" />
      
      <div className="space-y-3">
        <Skeleton variant="rounded" height="3rem" />
        <Skeleton variant="rounded" height="3rem" />
      </div>
    </div>
  </div>
)

// Text Skeleton
export const TextSkeleton = ({ 
  lines = 3, 
  className = '' 
}: { 
  lines?: number
  className?: string 
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton 
        key={index}
        variant="text" 
        height="1rem" 
        width={index === lines - 1 ? '60%' : '100%'}
      />
    ))}
  </div>
)

// Avatar Skeleton
export const AvatarSkeleton = ({ 
  size = 40, 
  className = '' 
}: { 
  size?: number
  className?: string 
}) => (
  <Skeleton 
    variant="circular" 
    width={size} 
    height={size} 
    className={className} 
  />
)

// Button Skeleton
export const ButtonSkeleton = ({ 
  className = '' 
}: { 
  className?: string 
}) => (
  <Skeleton 
    variant="rounded" 
    height="2.5rem" 
    width="8rem" 
    className={className} 
  />
)

export default Skeleton
