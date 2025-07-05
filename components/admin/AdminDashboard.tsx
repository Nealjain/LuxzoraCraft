'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingBag, 
  Users, 
  CreditCard, 
  TrendingUp,
  Package,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    pendingOrders: 0
  })
  
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setStats({
          totalSales: 125750,
          totalOrders: 48,
          totalCustomers: 32,
          totalProducts: 24,
          lowStockProducts: 3,
          pendingOrders: 5
        })
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setIsLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-logo">
          <img src="/images/logo.png" alt="Loading" width={60} height={60} />
        </div>
      </div>
    )
  }
  
  const statCards = [
    {
      title: 'Total Sales',
      value: `₹${stats.totalSales.toLocaleString()}`,
      icon: CreditCard,
      color: 'bg-green-500/20 text-green-400',
      link: '/admin/orders'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-blue-500/20 text-blue-400',
      link: '/admin/orders'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-purple-500/20 text-purple-400',
      link: '/admin/customers'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-accent/20 text-accent',
      link: '/admin/products'
    }
  ]
  
  const alertCards = [
    {
      title: 'Low Stock Products',
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      color: 'bg-orange-500/20 text-orange-400',
      link: '/admin/products?filter=low-stock'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: 'bg-red-500/20 text-red-400',
      link: '/admin/orders?status=pending'
    }
  ]
  
  return (
    <div>
      <h1 className="text-3xl font-serif gold-text mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={card.link} className="block">
              <div className="card p-6 hover:border hover:border-accent/30 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{card.title}</p>
                    <h3 className="text-2xl font-serif text-white mt-2">{card.value}</h3>
                  </div>
                  <div className={`p-3 rounded-full ${card.color}`}>
                    <card.icon size={20} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {alertCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
          >
            <Link href={card.link} className="block">
              <div className="card p-6 hover:border hover:border-accent/30 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{card.title}</p>
                    <h3 className="text-2xl font-serif text-white mt-2">{card.value}</h3>
                  </div>
                  <div className={`p-3 rounded-full ${card.color}`}>
                    <card.icon size={20} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="card p-6"
        >
          <h2 className="text-xl font-serif text-white mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left py-3 px-2">Order ID</th>
                  <th className="text-left py-3 px-2">Customer</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-right py-3 px-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-2">ORD12345</td>
                  <td className="py-3 px-2">Priya Sharma</td>
                  <td className="py-3 px-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Delivered
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">₹2,198</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-2">ORD12346</td>
                  <td className="py-3 px-2">Rahul Patel</td>
                  <td className="py-3 px-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Shipped
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">₹1,499</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-2">ORD12347</td>
                  <td className="py-3 px-2">Ananya Gupta</td>
                  <td className="py-3 px-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">₹3,299</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-2">ORD12348</td>
                  <td className="py-3 px-2">Vikram Singh</td>
                  <td className="py-3 px-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">₹2,499</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <Link href="/admin/orders" className="text-accent hover:underline">
              View All Orders
            </Link>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="card p-6"
        >
          <h2 className="text-xl font-serif text-white mb-4">Low Stock Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left py-3 px-2">Product</th>
                  <th className="text-left py-3 px-2">Category</th>
                  <th className="text-right py-3 px-2">Stock</th>
                  <th className="text-right py-3 px-2">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-2">Crystal Drop Earrings</td>
                  <td className="py-3 px-2">Earrings</td>
                  <td className="py-3 px-2 text-right text-red-400">2</td>
                  <td className="py-3 px-2 text-right">₹1,499</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-2">Statement Collar Necklace</td>
                  <td className="py-3 px-2">Necklaces</td>
                  <td className="py-3 px-2 text-right text-orange-400">5</td>
                  <td className="py-3 px-2 text-right">₹1,899</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-2">Beaded Charm Bracelet</td>
                  <td className="py-3 px-2">Bracelets</td>
                  <td className="py-3 px-2 text-right text-orange-400">4</td>
                  <td className="py-3 px-2 text-right">₹1,099</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <Link href="/admin/products?filter=low-stock" className="text-accent hover:underline">
              View All Low Stock Products
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}