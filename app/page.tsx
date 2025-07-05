import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import CategoryShowcase from '@/components/home/CategoryShowcase'
import Testimonials from '@/components/home/Testimonials'
import Newsletter from '@/components/home/Newsletter'
import LoadingScreen from '@/components/ui/LoadingScreen'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Suspense fallback={<LoadingScreen />}>
        <Header />
        <HeroSection />
        <div className="container mx-auto px-4 py-16 space-y-24">
          <FeaturedProducts />
          <CategoryShowcase />
          <Testimonials />
          <Newsletter />
        </div>
        <Footer />
      </Suspense>
    </main>
  )
}