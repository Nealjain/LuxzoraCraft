import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartItems from '@/components/cart/CartItems'
import CartSummary from '@/components/cart/CartSummary'
import EmptyCart from '@/components/cart/EmptyCart'

export const metadata = {
  title: 'Shopping Cart - LuxZoraCraft',
  description: 'Review your selected luxury jewelry items and proceed to checkout.',
}

export default function CartPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif mb-8 gold-text">Your Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <CartItems />
          </div>
          <div className="lg:w-1/3">
            <CartSummary />
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}