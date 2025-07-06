'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

// Category data
const getRandomCategoryImage = (categoryId: string) => {
  const variations = ['', '-1', '-2'];
  const randomVariation = variations[Math.floor(Math.random() * variations.length)];
  return `/images/categories/${categoryId}${randomVariation}.jpg`;
};

const categories = [
  {
    id: 'necklaces',
    name: 'Necklaces',
    get image() { return getRandomCategoryImage('necklaces'); },
    description: 'Elegant necklaces for every occasion',
    link: '/shop?category=necklaces',
  },
  {
    id: 'rings',
    name: 'Rings',
    get image() { return getRandomCategoryImage('rings'); },
    description: 'Beautiful rings to complement your style',
    link: '/shop?category=rings',
  },
  {
    id: 'earrings',
    name: 'Earrings',
    get image() { return getRandomCategoryImage('earrings'); },
    description: 'Stunning earrings that make a statement',
    link: '/shop?category=earrings',
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    get image() { return getRandomCategoryImage('bracelets'); },
    description: 'Exquisite bracelets for a touch of elegance',
    link: '/shop?category=bracelets',
  },
]

export default function CategoryShowcase() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  
  return (
    <section ref={sectionRef} className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-serif gold-text mb-4"
          >
            Shop by Category
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            Explore our diverse collection of luxury jewelry categories, each crafted with precision and elegance.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <Link href={category.link} className="block group">
                <div className="relative overflow-hidden rounded-lg aspect-[16/9]">
                  <Image
                    src={category.image}
                    alt={category.description}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={80}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-200 mb-3 sm:mb-4 max-w-xs px-2 leading-relaxed">
                      {category.description}
                    </p>
                    <span className="inline-block px-3 sm:px-4 py-2 text-sm sm:text-base border border-accent text-accent group-hover:bg-accent group-hover:text-primary transition-colors duration-300">
                      Shop Now
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}