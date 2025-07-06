'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import OptimizedImage from '@/components/ui/OptimizedImage'
import { useHeroImageStrategy } from '@/lib/hooks/useImageStrategy'
import { useCriticalImageMonitoring } from '@/lib/hooks/useImagePerformanceMonitoring'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

// Hero slide data
const getHeroImage = (baseId: number) => {
  return `/images/hero/hero-${baseId}.jpg`;
};

const heroSlides = [
  {
    id: 1,
    image: getHeroImage(1),
    title: 'Luxury Collection',
    subtitle: 'Discover our finest jewelry pieces',
    description: 'Experience the pinnacle of craftsmanship with our curated selection of premium jewelry designed for the discerning individual.',
    link: '/shop',
  },
  {
    id: 2,
    image: getHeroImage(2),
    title: 'Timeless Elegance',
    subtitle: 'Handcrafted Excellence',
    description: 'Each piece tells a story of exceptional artistry and attention to detail, creating treasures that last a lifetime.',
    link: '/shop?category=rings',
  },
  {
    id: 3,
    image: getHeroImage(3),
    title: 'Exquisite Craftsmanship',
    subtitle: 'Premium Materials',
    description: 'Our master artisans use only the finest materials to create jewelry that embodies luxury and sophistication.',
    link: '/shop?category=necklaces',
  },
]

export default function HeroSection() {
  const [showIntro, setShowIntro] = useState(false)
  const [introComplete, setIntroComplete] = useState(true)
  
  // Get all hero image URLs for preloading
  const heroImageUrls = heroSlides.map(slide => slide.image)
  const { preloadCritical } = useHeroImageStrategy(heroImageUrls)
  
  // Monitor critical hero images
  useCriticalImageMonitoring(heroImageUrls)
  
  useEffect(() => {
    // Check if intro has been shown before
    const hasSeenIntro = localStorage.getItem('hasSeenIntro')
    console.log('HeroSection useEffect: hasSeenIntro on mount', hasSeenIntro);

    if (hasSeenIntro) {
      console.log('HeroSection useEffect: hasSeenIntro is true, setting showIntro to false and introComplete to true');
      setShowIntro(false)
      setIntroComplete(true)
    } else {
      console.log('HeroSection useEffect: hasSeenIntro is false, starting intro timer');
      // Set timeout to hide intro after 3 seconds
      const timer = setTimeout(() => {
        console.log('HeroSection setTimeout: hiding intro');
        setShowIntro(false)
        localStorage.setItem('hasSeenIntro', 'true')
        
        // Add a small delay before showing content
        setTimeout(() => {
          console.log('HeroSection setTimeout inner: setting introComplete to true');
          setIntroComplete(true)
        }, 500)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [])
  
  const skipIntro = () => {
    setShowIntro(false)
    localStorage.setItem('hasSeenIntro', 'true')
    
    // Add a small delay before showing content
    setTimeout(() => {
      setIntroComplete(true)
    }, 500)
  }
  
  return (
    <div className="relative h-screen w-full">
      {/* Intro Animation */}
      {showIntro && (
        <motion.div
          initial={ { opacity: 0 } }
          animate={ { opacity: 1 } }
          exit={ { opacity: 0 } }
          className="absolute inset-0 z-50 bg-primary flex flex-col items-center justify-center"
        >
          <motion.div
            initial={ { scale: 0.8, opacity: 0 } }
            animate={ { scale: 1, opacity: 1 } }
            transition={ { duration: 1 } }
            className="text-5xl md:text-7xl font-serif gold-text text-center"
          >
            LuxZoraCraft
          </motion.div>
          <motion.div
            initial={ { opacity: 0 } }
            animate={ { opacity: 1 } }
            transition={ { delay: 1, duration: 0.5 } }
            className="mt-4 text-xl text-white"
          >
            Affordable Luxury Jewelry
          </motion.div>
          
          <button
            onClick={skipIntro}
            className="absolute bottom-8 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Skip Intro
          </button>
        </motion.div>
      )}
      
      {/* Hero Slider */}
      {introComplete && (
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          pagination={ { 
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 3
          } }
          autoplay={ { 
            delay: 4000, 
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            reverseDirection: false
          } }
          loop={true}

          centeredSlides={true}
          className="h-full w-full"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative overflow-hidden">
              <div className="absolute inset-0">
                <img 
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>
              
              <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
                <motion.div
                  initial={ { opacity: 0, y: 20 } }
                  animate={ { opacity: 1, y: 0 } }
                  transition={ { duration: 0.5, delay: 0.2 } }
                  className="text-xs sm:text-sm md:text-base uppercase tracking-widest text-accent mb-2 sm:mb-3"
                >
                  {slide.subtitle}
                </motion.div>
                
                <motion.h1
                  initial={ { opacity: 0, y: 20 } }
                  animate={ { opacity: 1, y: 0 } }
                  transition={ { duration: 0.5, delay: 0.4 } }
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-white mb-3 sm:mb-4 leading-tight"
                >
                  {slide.title}
                </motion.h1>
                
                <motion.p
                  initial={ { opacity: 0, y: 20 } }
                  animate={ { opacity: 1, y: 0 } }
                  transition={ { duration: 0.5, delay: 0.6 } }
                  className="text-base sm:text-lg md:text-xl text-gray-200 max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl mb-6 sm:mb-8 px-2 leading-relaxed"
                >
                  {slide.description}
                </motion.p>
                
                <motion.div
                  initial={ { opacity: 0, y: 20 } }
                  animate={ { opacity: 1, y: 0 } }
                  transition={ { duration: 0.5, delay: 0.8 } }
                >
                  <Link href={slide.link} className="btn btn-primary">
                    Explore Collection
                  </Link>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  )
}