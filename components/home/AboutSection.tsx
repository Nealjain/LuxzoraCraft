'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

// Base64 blur placeholder data
const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

export default function AboutSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  
  return (
    <section ref={sectionRef} className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-serif gold-text mb-4"
          >
            About LuxZoraCraft
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            Discover the story behind our passion for creating affordable luxury jewelry that celebrates life's precious moments.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
                <Image
                  src="/images/about/1.jpg"
                  alt="LuxZoraCraft jewelry craftsmanship"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                />
              </div>
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden mt-8">
                <Image
                  src="/images/about/2.jpg"
                  alt="LuxZoraCraft jewelry collection"
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                />
              </div>
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-serif gold-text mb-4">Our Story</h3>
              <p className="text-gray-300 leading-relaxed">
                Founded with a vision to make luxury jewelry accessible to everyone, LuxZoraCraft began as a small family business 
                driven by passion for exquisite craftsmanship. We believe that every person deserves to feel special and confident, 
                regardless of their budget.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-serif gold-text mb-4">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                We are committed to creating stunning, high-quality jewelry that doesn't compromise on style or affordability. 
                Our mission is to celebrate life's precious moments with pieces that are as unique and beautiful as the people who wear them.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-serif gold-text mb-4">Our Heritage</h3>
              <p className="text-gray-300 leading-relaxed">
                With generations of jewelry-making expertise, we combine traditional craftsmanship techniques with contemporary designs. 
                Each piece is carefully curated and crafted to ensure it meets our high standards of quality and elegance, 
                making luxury jewelry accessible to the modern lifestyle.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
