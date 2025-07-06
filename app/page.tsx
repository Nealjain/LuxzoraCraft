import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import { getFeaturedProducts } from '@/lib/products'
import CategoryShowcase from '@/components/home/CategoryShowcase'
import Testimonials from '@/components/home/Testimonials'
import Newsletter from '@/components/home/Newsletter'
import LoadingScreen from '@/components/ui/LoadingScreen'
import PromoBanner from '@/components/home/PromoBanner'
import InstagramGallery from '@/components/home/InstagramGallery'
import AboutSection from '@/components/home/AboutSection'
import CraftsmanshipSection from '@/components/home/CraftsmanshipSection'
import InfinitePhotoSlider from '@/components/home/InfinitePhotoSlider'

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  return (
    <main className="flex min-h-screen flex-col">
      <Suspense fallback={<LoadingScreen />}>
        <Header />
        <HeroSection />
        <CategoryShowcase />
        <AboutSection />
        <CraftsmanshipSection />
        <InfinitePhotoSlider />
        <PromoBanner />
        <FeaturedProducts products={featuredProducts} />
        <InstagramGallery />
        <Testimonials />
        <Newsletter />
        <Footer />
      </Suspense>
    </main>
  )
}