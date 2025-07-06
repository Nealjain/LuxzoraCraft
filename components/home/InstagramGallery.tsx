'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Pagination } from 'swiper/modules'
import { Instagram } from 'lucide-react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'

interface InstagramGalleryProps {
  instagramUrl?: string
}

export default function InstagramGallery({ instagramUrl = "https://instagram.com/luxzoracraft" }: InstagramGalleryProps) {
  const [isMobile, setIsMobile] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  // Instagram images data
  const instagramImages = [
    { id: 1, src: '/images/instagram/1.jpg', alt: 'Luxury bracelet collection' },
    { id: 2, src: '/images/instagram/2.jpg', alt: 'Handcrafted earrings' },
    { id: 3, src: '/images/instagram/3.jpg', alt: 'Elegant necklace design' },
    { id: 4, src: '/images/instagram/4.jpg', alt: 'Premium ring collection' },
    { id: 5, src: '/images/instagram/5.jpg', alt: 'Artisan bracelet craftsmanship' },
    { id: 6, src: '/images/instagram/6.jpg', alt: 'Designer earrings showcase' },
    { id: 7, src: '/images/instagram/7.jpg', alt: 'Luxury rings collection' },
    { id: 8, src: '/images/instagram/8.jpg', alt: 'Premium earrings design' },
  ]

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const InstagramItem = ({ image, index }: { image: typeof instagramImages[0], index: number }) => (
    <motion.div
      variants={itemVariants}
      className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-square"
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
      />
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="transform scale-75 group-hover:scale-100 transition-transform duration-300">
          <Instagram className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.div>
  )

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">
            Follow Our Journey
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Discover our latest creations and behind-the-scenes moments
          </p>
          
          {/* Instagram Link */}
          <Link
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            <Instagram className="w-5 h-5" />
            @luxzoracraft
          </Link>
        </motion.div>

        {/* Gallery */}
        {isMobile ? (
          // Mobile: Swiper horizontal scroll
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="overflow-hidden"
          >
            <Swiper
              modules={[FreeMode, Pagination]}
              spaceBetween={16}
              slidesPerView={2.2}
              freeMode={true}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet !bg-accent',
                bulletActiveClass: 'swiper-pagination-bullet-active !bg-accent',
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2.5,
                  spaceBetween: 20,
                },
              }}
              className="!pb-12"
            >
              {instagramImages.map((image, index) => (
                <SwiperSlide key={image.id}>
                  <InstagramItem image={image} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        ) : (
          // Desktop: Masonry-style grid
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {/* First column - 2 images */}
            <div className="space-y-4">
              <InstagramItem image={instagramImages[0]} index={0} />
              <InstagramItem image={instagramImages[1]} index={1} />
            </div>
            
            {/* Second column - 2 images */}
            <div className="space-y-4">
              <InstagramItem image={instagramImages[2]} index={2} />
              <InstagramItem image={instagramImages[3]} index={3} />
            </div>
            
            {/* Third column - 2 images */}
            <div className="space-y-4">
              <InstagramItem image={instagramImages[4]} index={4} />
              <InstagramItem image={instagramImages[5]} index={5} />
            </div>
            
            {/* Fourth column - 2 images */}
            <div className="space-y-4">
              <InstagramItem image={instagramImages[6]} index={6} />
              <InstagramItem image={instagramImages[7]} index={7} />
            </div>
          </motion.div>
        )}

        {/* Visit Instagram CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-accent text-accent hover:bg-accent hover:text-white transition-all duration-300 rounded-full font-medium"
          >
            <Instagram className="w-5 h-5" />
            Visit Our Instagram
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
