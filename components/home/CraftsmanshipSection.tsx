'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

// Base64 blur placeholder data
const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

// Craftsmanship process data
const craftsmanshipSteps = [
  {
    id: 1,
    image: '/images/craftsmanship/1.jpg',
    title: 'Design & Conception',
    description: 'Every piece begins with a vision. Our skilled artisans carefully sketch and conceptualize each design, ensuring every detail reflects our commitment to luxury and elegance.',
  },
  {
    id: 2,
    image: '/images/craftsmanship/2.jpg',
    title: 'Precision Crafting',
    description: 'Using traditional techniques combined with modern precision tools, our master craftsmen shape each piece with meticulous attention to detail, creating the foundation of luxury.',
  },
  {
    id: 3,
    image: '/images/craftsmanship/3.jpg',
    title: 'Final Finishing',
    description: 'The final touch involves careful polishing, quality inspection, and finishing. Each piece undergoes rigorous quality checks to ensure it meets our exacting standards.',
  },
]

export default function CraftsmanshipSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  
  return (
    <section ref={sectionRef} className="py-16 bg-primary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-serif gold-text mb-4"
          >
            Our Craftsmanship
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            Discover the artistry behind every piece. Our time-honored techniques and modern precision come together to create jewelry that transcends ordinary luxury.
          </motion.p>
        </div>

        {/* Desktop: Step-by-step grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 lg:gap-12">
          {craftsmanshipSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
              className="text-center"
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-6">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority={index === 0}
                  loading={index === 0 ? undefined : "lazy"}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                />
                <div className="absolute top-4 left-4 bg-accent text-primary w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold">
                  {step.id}
                </div>
              </div>
              <h3 className="text-xl font-serif gold-text mb-3">{step.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Horizontal scrolling */}
        <div className="md:hidden">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="overflow-x-auto pb-4"
          >
            <div className="flex space-x-6 min-w-max px-4">
              {craftsmanshipSteps.map((step, index) => (
                <div key={step.id} className="flex-shrink-0 w-72 text-center">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      loading={index === 0 ? undefined : "lazy"}
                      sizes="(max-width: 768px) 80vw, 300px"
                      placeholder="blur"
                      blurDataURL={blurDataURL}
                    />
                    <div className="absolute top-4 left-4 bg-accent text-primary w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold">
                      {step.id}
                    </div>
                  </div>
                  <h3 className="text-lg font-serif gold-text mb-2">{step.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Scroll indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {craftsmanshipSteps.map((_, index) => (
                <div key={index} className="w-2 h-2 rounded-full bg-accent/30"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-300 mb-6">
            Every piece tells a story of dedication, precision, and passion for the craft.
          </p>
          <button className="inline-block px-8 py-3 border border-accent text-accent hover:bg-accent hover:text-primary transition-colors duration-300">
            View Our Collection
          </button>
        </motion.div>
      </div>
    </section>
  )
}
