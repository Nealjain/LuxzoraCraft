'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { formatPrice, formatDate } from '@/lib/utils'

type Order = {
  id: string
  created_at: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  amount: number
  items: any[]
  tracking_number?: string
}

export default function OrdersTab() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockOrders: Order[] = [
          {
            id: 'ORD12345',
            created_at: '2023-08-15T10:30:00Z',
            status: 'delivered',
            amount: 2198,
            items: [
              {
                id: '1',
                name: 'Gold-Plated Pendant Necklace',
                price: 1299,
                quantity: 1,
                images: ['/images/products/necklace-1.jpg'],
              },
              {
                id: '2',
                name: 'Twisted Band Ring',
                price: 899,
                quantity: 1,
                images: ['/images/products/ring-1.jpg'],
              },
            ],
            tracking_number: 'TRK987654321',
          },
          {
            id: 'ORD12346',
            created_at: '2023-09-05T14:45:00Z',
            status: 'shipped',
            amount: 1499,
            items: [
              {
                id: '3',
                name: 'Crystal Drop Earrings',
                price: 1499,
                quantity: 1,
                images: ['/images/products/earrings-1.jpg'],
              },
            ],
            tracking_number: 'TRK123456789',
          },
        ]
        
        setOrders(mockOrders)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching orders:', error)
        setIsLoading(false)
      }
    }
    
    if (session) {
      fetchOrders()
    }
  }, [session])
  
  if (isLoading) {
    return (
      <div className="card p-6">
        <h3 className="text-xl font-serif text-white mb-6">My Orders</h3>
        <div className="flex justify-center items-center h-64">
          <div className="loading-logo">
            <img src="/images/logo.png" alt="Loading" width={60} height={60} />
          </div>
        </div>
      </div>
    )
  }
  
  if (orders.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-xl font-serif text-white mb-6">My Orders</h3>
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">You haven't placed any orders yet.</p>
          <Link href="/shop" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="card p-6">
      <h3 className="text-xl font-serif text-white mb-6">My Orders</h3>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border border-white/10 rounded-lg overflow-hidden">
            <div className="bg-gray-dark p-4 flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <p className="text-white font-medium">Order #{order.id}</p>
                <p className="text-sm text-gray-400">Placed on {formatDate(order.created_at)}</p>
              </div>
              
              <div className="mt-2 md:mt-0 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'paid' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                
                <span className="text-accent font-medium">
                  {formatPrice(order.amount)}
                </span>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center">
                  <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
                    <img 
                      src={item.images[0]} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <Link 
                      href={`/product/${item.id}`}
                      className="text-white hover:text-accent transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-400">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {order.tracking_number && (
              <div className="bg-gray-dark/50 p-4 border-t border-white/10">
                <p className="text-sm">
                  <span className="text-gray-400">Tracking Number: </span>
                  <span className="text-white">{order.tracking_number}</span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}