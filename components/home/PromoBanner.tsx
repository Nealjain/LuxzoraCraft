'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function PromoBanner() {
  return (
    <section className="relative py-8 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/promo/1.jpg"
          alt="Limited-Time Offer - 20% off selected collections"
          fill
          className="object-cover"
          sizes="100vw"
          quality={80}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-4 sm:mb-6 leading-tight px-2"
          >
            Discover Our Luxury Collection
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 max-w-sm sm:max-w-2xl mx-auto px-4 leading-relaxed"
          >
            Experience the finest jewelry pieces crafted with precision and elegance. 
            Each piece in our collection embodies timeless beauty and exceptional quality.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/shop" 
              className="btn btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-block"
            >
              Explore Collection
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
