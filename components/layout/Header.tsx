'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/cart'
import { ShoppingBag, User, Menu, X, Search } from 'lucide-react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const pathname = usePathname()
  const { data: session } = useSession()
  const { items } = useCart()
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`
    }
  }
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-primary/90 backdrop-blur-md py-2 shadow-lg' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <motion.div 
              initial={ { opacity: 0 } }
              animate={ { opacity: 1 } }
              transition={ { duration: 0.5 } }
              className="text-2xl font-serif gold-text"
            >
              LuxZoraCraft
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-sm uppercase tracking-wider hover:text-accent transition-colors ${
                pathname === '/' ? 'text-accent' : 'text-white'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className={`text-sm uppercase tracking-wider hover:text-accent transition-colors ${
                pathname === '/shop' ? 'text-accent' : 'text-white'
              }`}
            >
              Shop
            </Link>
            <Link 
              href="/about" 
              className={`text-sm uppercase tracking-wider hover:text-accent transition-colors ${
                pathname === '/about' ? 'text-accent' : 'text-white'
              }`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`text-sm uppercase tracking-wider hover:text-accent transition-colors ${
                pathname === '/contact' ? 'text-accent' : 'text-white'
              }`}
            >
              Contact
            </Link>
          </nav>
          
          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-white hover:text-accent transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            
            <Link 
              href={session ? '/account' : '/login'} 
              className="text-white hover:text-accent transition-colors"
              aria-label={session ? 'Account' : 'Login'}
            >
              <User size={20} />
            </Link>
            
            <Link 
              href="/cart" 
              className="text-white hover:text-accent transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-primary text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-accent transition-colors"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={ { opacity: 0, height: 0 } }
              animate={ { opacity: 1, height: 'auto' } }
              exit={ { opacity: 0, height: 0 } }
              transition={ { duration: 0.3 } }
              className="mt-4"
            >
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  placeholder="Search for jewelry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 px-4 bg-gray-dark border border-accent/30 rounded-l-md focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <button
                  type="submit"
                  className="bg-accent text-primary py-2 px-4 rounded-r-md hover:bg-accent-light transition-colors"
                >
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={ { opacity: 0, x: '100%' } }
            animate={ { opacity: 1, x: 0 } }
            exit={ { opacity: 0, x: '100%' } }
            transition={ { duration: 0.3 } }
            className="fixed inset-0 bg-primary z-40 pt-20"
          >
            <div className="container mx-auto px-4">
              <nav className="flex flex-col space-y-6 py-8">
                <Link 
                  href="/" 
                  className={`text-xl font-serif ${
                    pathname === '/' ? 'text-accent' : 'text-white'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  href="/shop" 
                  className={`text-xl font-serif ${
                    pathname === '/shop' ? 'text-accent' : 'text-white'
                  }`}
                >
                  Shop
                </Link>
                <Link 
                  href="/about" 
                  className={`text-xl font-serif ${
                    pathname === '/about' ? 'text-accent' : 'text-white'
                  }`}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className={`text-xl font-serif ${
                    pathname === '/contact' ? 'text-accent' : 'text-white'
                  }`}
                >
                  Contact
                </Link>
                
                <div className="pt-6 border-t border-white/10">
                  <Link 
                    href={session ? '/account' : '/login'} 
                    className="text-xl font-serif text-white hover:text-accent"
                  >
                    {session ? 'My Account' : 'Login / Register'}
                  </Link>
                </div>
                
                {session?.user && 'isAdmin' in session.user && session.user.isAdmin && (
                  <Link 
                    href="/admin" 
                    className="text-xl font-serif text-accent"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}