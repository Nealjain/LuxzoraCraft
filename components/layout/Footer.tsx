import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-dark pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <h3 className="text-2xl font-serif gold-text mb-4">LuxZoraCraft</h3>
            <p className="text-gray-300 mb-4">
              Discover affordable luxury jewelry with exceptional craftsmanship and elegant designs.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-accent transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/shop?category=necklaces" className="text-gray-300 hover:text-accent transition-colors">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/shop?category=rings" className="text-gray-300 hover:text-accent transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/shop?category=earrings" className="text-gray-300 hover:text-accent transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bracelets" className="text-gray-300 hover:text-accent transition-colors">
                  Bracelets
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Information */}
          <div>
            <h4 className="text-lg font-serif text-white mb-4">Information</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-accent transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-accent transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-accent transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-serif text-white mb-4">Contact Us</h4>
            <address className="not-italic text-gray-300 space-y-2">
              <p>123 Jewelry Lane</p>
              <p>Mumbai, Maharashtra 400001</p>
              <p>India</p>
              <p className="mt-4">
                <a href="tel:+919876543210" className="hover:text-accent transition-colors">
                  +91 98765 43210
                </a>
              </p>
              <p>
                <a href="mailto:info@luxzoracraft.com" className="hover:text-accent transition-colors">
                  info@luxzoracraft.com
                </a>
              </p>
            </address>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="border-t border-white/10 pt-8 pb-4">
          <div className="flex flex-wrap justify-center gap-4">
            <img src="/images/payment/razorpay.svg" alt="Razorpay" className="h-8" />
            <img src="/images/payment/visa.svg" alt="Visa" className="h-8" />
            <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-8" />
            <img src="/images/payment/upi.svg" alt="UPI" className="h-8" />
            <img src="/images/payment/paytm.svg" alt="Paytm" className="h-8" />
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm mt-8">
          <p>&copy; {currentYear} LuxZoraCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}