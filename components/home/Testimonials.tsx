'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    image: '/images/testimonials/testimonial-1.jpg',
    rating: 5,
    text: 'The quality of the jewelry I received from LuxZoraCraft exceeded my expectations. The necklace looks exactly like the pictures, and the packaging was beautiful. Will definitely order again!',
  },
  {
    id: 2,
    name: 'Rahul Patel',
    location: 'Delhi',
    image: '/images/testimonials/testimonial-2.jpg',
    rating: 5,
    text: `I bought a ring for my wife's birthday, and she absolutely loves it! The craftsmanship is excellent, and it looks much more expensive than what I paid. Great value for money.`
  },
  {
    id: 3,
    name: 'Ananya Gupta',
    location: 'Bangalore',
    image: '/images/testimonials/testimonial-3.jpg',
    rating: 4,
    text: `The earrings I ordered are stunning and arrived quickly. The only reason I'm giving 4 stars instead of 5 is because one of the backings was a bit loose, but customer service was very helpful in resolving the issue.`
  },
  {
    id: 4,
    name: 'Vikram Singh',
    location: 'Jaipur',
    image: '/images/testimonials/testimonial-4.jpg',
    rating: 5,
    text: `I've ordered multiple pieces from LuxZoraCraft, and I'm always impressed by the quality and attention to detail. Their jewelry has become my go-to for special occasions.`
  },
]

export default function Testimonials() {
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
            Customer Testimonials
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            Hear what our customers have to say about their experience with LuxZoraCraft jewelry.
          </motion.p>
        </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Swiper
          modules={[Autoplay, Pagination]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          spaceBetween={30}
          className="testimonial-swiper"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="card p-6 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 relative">
                    <Image 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-accent' : 'text-gray-600'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-300 italic flex-grow">{testimonial.text}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
      </div>
    </section>
  )
}