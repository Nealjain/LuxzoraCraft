import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductDetail from '@/components/product/ProductDetail'
import RelatedProducts from '@/components/product/RelatedProducts'
import LoadingScreen from '@/components/ui/LoadingScreen'
import { getProductBySlug } from '@/lib/products'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  
  if (!product) {
    return {
      title: 'Product Not Found - LuxZoraCraft',
      description: 'The requested product could not be found.',
    }
  }
  
  return {
    title: `${product.name} - LuxZoraCraft Jewelry`,
    description: product.description,
    openGraph: {
      images: [{ url: product.images[0], width: 1200, height: 630, alt: product.name }],
    },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  
  if (!product) {
    notFound()
  }
  
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={<LoadingScreen />}>
          <ProductDetail product={product} />
          <RelatedProducts 
            category={product.category} 
            currentProductId={product.id} 
          />
        </Suspense>
      </div>
      
      <Footer />
    </main>
  )
}