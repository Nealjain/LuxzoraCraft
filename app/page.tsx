import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import CategoryShowcase from '@/components/home/CategoryShowcase'
import { getFeaturedProducts } from '@/lib/products'

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <HeroSection />
      <CategoryShowcase />
      <FeaturedProducts products={featuredProducts} />
      <Footer />
    </main>
  )
}
