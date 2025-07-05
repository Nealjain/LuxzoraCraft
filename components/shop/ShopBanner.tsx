'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

export default function ShopBanner() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  
  // Define banner content based on category
  const getBannerContent = () => {
    switch (category) {
      case 'necklaces':
        return {
          title: 'Necklace Collection',
          description: 'Discover our exquisite range of necklaces, from delicate pendants to statement pieces.',
          image: '/images/banners/necklaces-banner.jpg',
        }
      case 'rings':
        return {
          title: 'Ring Collection',
          description: 'Explore our stunning selection of rings, perfect for every occasion and style.',
          image: '/images/banners/rings-banner.jpg',
        }
      case 'earrings':
        return {
          title: 'Earring Collection',
          description: 'Browse our beautiful earrings, from elegant studs to dramatic statement pieces.',
          image: '/images/banners/earrings-banner.jpg',
        }
      case 'bracelets':
        return {
          title: 'Bracelet Collection',
          description: 'Find the perfect bracelet to complement your style from our carefully curated collection.',
          image: '/images/banners/bracelets-banner.jpg',
        }
      default:
        return {
          title: 'Luxury Jewelry Collection',
          description: 'Explore our premium selection of affordable luxury jewelry, crafted with attention to detail.',
          image: '/images/banners/shop-banner.jpg',
        }
    }
  }
  
  const bannerContent = getBannerContent()
  
  return (
    <div className="relative h-64 md:h-80 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerContent.image})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-4"
        >
          {bannerContent.title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-gray-200 max-w-2xl"
        >
          {bannerContent.description}
        </motion.p>
      </div>
    </div>
  )
}