import './globals.css'
import type { Metadata } from 'next'
import { Montserrat, Playfair_Display } from 'next/font/google'
import { Providers } from './providers'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://luxzoracraft.vercel.app'),
  title: 'LuxZoraCraft - Premium Jewelry Collection',
  description: 'Discover affordable luxury jewelry with LuxZoraCraft. Elegant designs, premium quality, and exceptional craftsmanship.',
  keywords: 'luxury jewelry, affordable jewelry, gold plated, necklaces, rings, earrings, bracelets, India',
  openGraph: {
    title: 'LuxZoraCraft - Premium Jewelry Collection',
    description: 'Discover affordable luxury jewelry with LuxZoraCraft. Elegant designs, premium quality, and exceptional craftsmanship.',
    url: 'https://luxzoracraft.com',
    siteName: 'LuxZoraCraft',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LuxZoraCraft Luxury Jewelry',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${montserrat.variable} ${playfair.variable} font-sans bg-primary text-secondary min-h-screen`}>
        <Providers>
          {children}
        </Providers>

      </body>
    </html>
  )
}