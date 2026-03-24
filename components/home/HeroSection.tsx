'use client'

import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

const heroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000',
    title: 'Luxury Collection',
    subtitle: 'Discover our finest jewelry pieces',
    link: '/shop',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=2000',
    title: 'Timeless Elegance',
    subtitle: 'Handcrafted Excellence',
    link: '/shop?category=rings',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=2000',
    title: 'Exquisite Craftsmanship',
    subtitle: 'Premium Materials',
    link: '/shop?category=necklaces',
  },
]

export default function HeroSection() {
  return (
    <div className="relative h-screen w-full">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
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

            <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
              <p className="text-sm uppercase tracking-widest text-accent mb-3">
                {slide.subtitle}
              </p>
              <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
                {slide.title}
              </h1>
              <Link href={slide.link} className="btn btn-primary">
                Explore Collection
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
