'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/admin')
      return
    }
    
    // Check if user is admin
    if (session && session.user && !session.user.isAdmin) {
      router.push('/')
    }
  }, [status, session, router])
  
  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [pathname])
  
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading-logo">
          <img src="/images/logo.png" alt="Loading" width={100} height={100} />
        </div>
      </div>
    )
  }
  
  if (!session || !session.user.isAdmin) {
    return null
  }
  
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: ShoppingBag },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]
  
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }
  
  return (
    <div className="min-h-screen bg-primary">
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-dark py-4 px-4 flex items-center justify-between">
        <Link href="/admin" className="text-xl font-serif gold-text">
          Admin Panel
        </Link>
        
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="text-white hover:text-accent"
        >
          {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className="hidden md:block w-64 bg-gray-dark min-h-screen fixed">
          <div className="p-6">
            <Link href="/admin" className="text-xl font-serif gold-text block mb-8">
              Admin Panel
            </Link>
            
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center py-3 px-4 rounded-md transition-colors ${
                    pathname === item.href
                      ? 'bg-accent text-primary'
                      : 'text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon size={18} className="mr-3" />
                  {item.label}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-white/10 mt-4">
                <Link
                  href="/"
                  className="flex items-center py-3 px-4 rounded-md text-white hover:bg-gray-800 transition-colors"
                >
                  <ShoppingBag size={18} className="mr-3" />
                  View Store
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center py-3 px-4 rounded-md text-white hover:bg-gray-800 transition-colors w-full"
                >
                  <LogOut size={18} className="mr-3" />
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        </div>
        
        {/* Sidebar - Mobile */}
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/70 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3 }}
              className="w-64 bg-gray-dark h-full overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <Link href="/admin" className="text-xl font-serif gold-text">
                    Admin Panel
                  </Link>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="text-white hover:text-accent"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center py-3 px-4 rounded-md transition-colors ${
                        pathname === item.href
                          ? 'bg-accent text-primary'
                          : 'text-white hover:bg-gray-800'
                      }`}
                    >
                      <item.icon size={18} className="mr-3" />
                      {item.label}
                    </Link>
                  ))}
                  
                  <div className="pt-4 border-t border-white/10 mt-4">
                    <Link
                      href="/"
                      className="flex items-center py-3 px-4 rounded-md text-white hover:bg-gray-800 transition-colors"
                    >
                      <ShoppingBag size={18} className="mr-3" />
                      View Store
                    </Link>
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center py-3 px-4 rounded-md text-white hover:bg-gray-800 transition-colors w-full"
                    >
                      <LogOut size={18} className="mr-3" />
                      Sign Out
                    </button>
                  </div>
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Main Content */}
        <div className="flex-1 md:ml-64 p-6">
          {children}
        </div>
      </div>
    </div>
  )
}