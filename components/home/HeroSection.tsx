'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

// Hero slide data
const getRandomHeroImage = (baseId: number) => {
  const variations = ['', '.1'];
  const randomVariation = variations[Math.floor(Math.random() * variations.length)];
  return `/images/hero/hero-${baseId}${randomVariation}.jpg`;
};

const heroSlides = [
  {
    id: 1,
    get image() { return getRandomHeroImage(1); },
    title: 'Elegant Necklace Collection',
    subtitle: 'Timeless Beauty',
    description: 'Discover our exquisite collection of handcrafted gold-plated necklaces.',
    link: '/shop?category=necklaces',
  },
  {
    id: 2,
    get image() { return getRandomHeroImage(2); },
    title: 'Stunning Ring Selection',
    subtitle: 'Perfect for Every Occasion',
    description: 'Browse our premium selection of rings designed for elegance and comfort.',
    link: '/shop?category=rings',
  },
  {
    id: 3,
    get image() { return getRandomHeroImage(3); },
    title: 'Luxury Earrings',
    subtitle: 'Elevate Your Style',
    description: 'Adorn yourself with our beautiful collection of statement earrings.',
    link: '/shop?category=earrings',
  },
]

export default function HeroSection() {
  const [showIntro, setShowIntro] = useState(true)
  const [introComplete, setIntroComplete] = useState(false)
  
  useEffect(() => {
    // Check if intro has been shown before
    const hasSeenIntro = localStorage.getItem('hasSeenIntro')
    
    if (hasSeenIntro) {
      setShowIntro(false)
      setIntroComplete(true)
    } else {
      // Set timeout to hide intro after 3 seconds
      const timer = setTimeout(() => {
        setShowIntro(false)
        localStorage.setItem('hasSeenIntro', 'true')
        
        // Add a small delay before showing content
        setTimeout(() => {
          setIntroComplete(true)
        }, 500)
      }, 3000)
      
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
          pagination={ { clickable: true } }
          autoplay={ { delay: 5000, disableOnInteraction: false } }
          loop={true}
          className="h-full w-full"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={ { backgroundImage: `url(${slide.image})` } }
              >
                <div className="absolute inset-0 bg-black/50" />
              </div>
              
              <div className="relative h-full flex flex-col items-center justify-center text-center px-6 sm:px-8 md:px-12 lg:px-20">
                <motion.div
                  initial={ { opacity: 0, y: 20 } }
                  animate={ { opacity: 1, y: 0 } }
                  transition={ { duration: 0.5, delay: 0.2 } }
                  className="text-sm md:text-base uppercase tracking-widest text-accent mb-2"
                >
                  {slide.subtitle}
                </motion.div>
                
                <motion.h1
                  initial={ { opacity: 0, y: 20 } }
                  animate={ { opacity: 1, y: 0 } }
                  transition={ { duration: 0.5, delay: 0.4 } }
                  className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-4"
                >
                  {slide.title}
                </motion.h1>
                
                <motion.p
                  initial={ { opacity: 0, y: 20 } }
                  animate={ { opacity: 1, y: 0 } }
                  transition={ { duration: 0.5, delay: 0.6 } }
                  className="text-lg md:text-xl text-gray-200 max-w-xl sm:max-w-2xl lg:max-w-3xl mb-8 whitespace-normal"
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