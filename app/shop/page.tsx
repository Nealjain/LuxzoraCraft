import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductGrid from '@/components/shop/ProductGrid'
import FilterSidebar from '@/components/shop/FilterSidebar'
import ShopBanner from '@/components/shop/ShopBanner'
import LoadingScreen from '@/components/ui/LoadingScreen'

export const metadata = {
  title: 'Shop - LuxZoraCraft Premium Jewelry',
  description: 'Browse our collection of premium, affordable luxury jewelry. Find necklaces, rings, earrings, and bracelets crafted with excellence.',
}

export default function ShopPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Suspense fallback={<LoadingScreen />}>
        <ShopBanner />
        
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <FilterSidebar />
            </div>
            <div className="md:w-3/4">
              <ProductGrid />
            </div>
          </div>
        </div>
      </Suspense>
      
      <Footer />
    </main>
  )
}
