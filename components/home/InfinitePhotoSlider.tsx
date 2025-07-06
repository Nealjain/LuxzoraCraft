'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface PhotoItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
}

const luxuryPhotos: PhotoItem[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    alt: 'Elegant Diamond Necklace',
    title: 'Celestial Diamond Necklace',
    description: 'Exquisite handcrafted diamonds in platinum setting'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    alt: 'Luxury Gold Rings',
    title: 'Aurora Gold Collection',
    description: '18k gold with rare gemstone accents'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
    alt: 'Luxury Bracelet Collection',
    title: 'Heritage Bracelets',
    description: 'Masterful craftsmanship with precious metals'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80',
    alt: 'Precious Gemstone Collection',
    title: 'Royal Gemstone Collection',
    description: 'Rare gemstones in platinum settings'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
    alt: 'Vintage Luxury Jewelry',
    title: 'Vintage Elegance',
    description: 'Timeless pieces with modern luxury'
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=80',
    alt: 'Diamond Earrings',
    title: 'Crystal Drop Earrings',
    description: 'Brilliant diamonds in elegant settings'
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1544376664-80b17f09d399?w=800&q=80',
    alt: 'Luxury Ring Collection',
    title: 'Signature Rings',
    description: 'Statement pieces for special occasions'
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    alt: 'Premium Jewelry Display',
    title: 'Premium Collection',
    description: 'Curated selection of finest jewelry'
  }
];

const InfinitePhotoSlider = () => {
  const [duplicatedPhotos, setDuplicatedPhotos] = useState<PhotoItem[]>([]);

  useEffect(() => {
    setDuplicatedPhotos([...luxuryPhotos, ...luxuryPhotos]);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-primary py-16">
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
          Luxury Collection
        </h2>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
          Discover our finest jewelry pieces, each meticulously crafted with the highest quality materials and exceptional attention to detail.
        </p>
      </div>

      <div className="relative w-full">
        <motion.div
          className="flex slider-track gap-6 md:gap-8"
          animate={{
            x: ['0%', `-${50 * luxuryPhotos.length}%`]
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 60,
              ease: 'linear'
            }
          }}
        >
          {duplicatedPhotos.map((photo, index) => (
            <motion.div
              key={`${photo.id}-${index}`}
              className="flex-shrink-0 w-72 md:w-80 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-lg shadow-2xl border border-accent/20">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 320px"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/40 z-10 group-hover:bg-black/50 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 z-20">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-white font-serif text-lg mb-1 group-hover:text-accent transition-colors duration-300">
                      {photo.title}
                    </h4>
                    <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {photo.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-2">
                <h3 className="text-lg md:text-xl font-serif text-white mb-2 group-hover:text-accent transition-colors">
                  {photo.title}
                </h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  {photo.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="absolute top-0 left-0 w-20 md:w-32 h-full bg-gradient-to-r from-primary to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-20 md:w-32 h-full bg-gradient-to-l from-primary to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
};

export default InfinitePhotoSlider;