'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X
} from 'lucide-react'

type Order = {
  id: string
  customer: {
    name: string
    email: string
  }
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  amount: number
  items: any[]
  created_at: string
  tracking_number?: string
  shipping_address: {
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<string>('')
  const [trackingNumber, setTrackingNumber] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockOrders: Order[] = [
          {
            id: 'ORD12345',
            customer: {
              name: 'Priya Sharma',
              email: 'priya.sharma@example.com'
            },
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
            created_at: '2023-08-15T10:30:00Z',
            tracking_number: 'TRK987654321',
            shipping_address: {
              address: '123 Main Street, Apartment 4B',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400001',
              country: 'India'
            }
          },
          {
            id: 'ORD12346',
            customer: {
              name: 'Rahul Patel',
              email: 'rahul.patel@example.com'
            },
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
            created_at: '2023-09-05T14:45:00Z',
            tracking_number: 'TRK123456789',
            shipping_address: {
              address: '456 Business Park, Building C',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400051',
              country: 'India'
            }
          },
          {
            id: 'ORD12347',
            customer: {
              name: 'Ananya Gupta',
              email: 'ananya.gupta@example.com'
            },
            status: 'pending',
            amount: 3299,
            items: [
              {
                id: '5',
                name: 'Statement Collar Necklace',
                price: 1899,
                quantity: 1,
                images: ['/images/products/necklace-2.jpg'],
              },
              {
                id: '7',
                name: 'Geometric Hoop Earrings',
                price: 1199,
                quantity: 1,
                images: ['/images/products/earrings-2.jpg'],
              },
              {
                id: '8',
                name: 'Beaded Charm Bracelet',
                price: 1099,
                quantity: 1,
                images: ['/images/products/bracelet-2.jpg'],
              },
            ],
            created_at: '2023-09-10T09:15:00Z',
            shipping_address: {
              address: '789 Residential Colony, Flat 12',
              city: 'Bangalore',
              state: 'Karnataka',
              postalCode: '560001',
              country: 'India'
            }
          },
          {
            id: 'ORD12348',
            customer: {
              name: 'Vikram Singh',
              email: 'vikram.singh@example.com'
            },
            status: 'pending',
            amount: 2499,
            items: [
              {
                id: '4',
                name: 'Layered Chain Bracelet',
                price: 999,
                quantity: 1,
                images: ['/images/products/bracelet-1.jpg'],
              },
              {
                id: '6',
                name: 'Minimalist Stacking Rings Set',
                price: 1299,
                quantity: 1,
                images: ['/images/products/ring-2.jpg'],
              },
            ],
            created_at: '2023-09-12T16:20:00Z',
            shipping_address: {
              address: '234 Park Avenue, House 7',
              city: 'Delhi',
              state: 'Delhi',
              postalCode: '110001',
              country: 'India'
            }
          },
          {
            id: 'ORD12349',
            customer: {
              name: 'Aditya Sharma',
              email: 'aditya.sharma@example.com'
            },
            status: 'cancelled',
            amount: 1899,
            items: [
              {
                id: '5',
                name: 'Statement Collar Necklace',
                price: 1899,
                quantity: 1,
                images: ['/images/products/necklace-2.jpg'],
              },
            ],
            created_at: '2023-09-01T11:10:00Z',
            shipping_address: {
              address: '567 Commercial Street',
              city: 'Chennai',
              state: 'Tamil Nadu',
              postalCode: '600001',
              country: 'India'
            }
          },
        ]
        
        setOrders(mockOrders)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching orders:', error)
        setIsLoading(false)
      }
    }
    
    fetchOrders()
  }, [])
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter ? order.status === statusFilter : true
    
    return matchesSearch && matchesStatus
  })
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'paid':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertTriangle size={16} />
      case 'paid':
        return <CheckCircle size={16} />
      case 'shipped':
        return <Truck size={16} />
      case 'delivered':
        return <Package size={16} />
      case 'cancelled':
        return <XCircle size={16} />
      default:
        return null
    }
  }
  
  const openViewModal = (order: Order) => {
    setSelectedOrder(order)
    setIsViewModalOpen(true)
  }
  
  const openUpdateStatusModal = (order: Order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setTrackingNumber(order.tracking_number || '')
    setIsUpdateStatusModalOpen(true)
  }
  
  const handleUpdateStatus = () => {
    if (!selectedOrder) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id 
          ? { 
              ...order, 
              status: newStatus as any,
              tracking_number: newStatus === 'shipped' || newStatus === 'delivered' 
                ? trackingNumber 
                : order.tracking_number
            } 
          : order
      )
      
      setOrders(updatedOrders)
      setIsUpdateStatusModalOpen(false)
      setSelectedOrder(null)
      setIsSubmitting(false)
    }, 1000)
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-logo">
          <img src="/images/logo.png" alt="Loading" width={60} height={60} />
        </div>
      </div>
    )
  }
  
  return (
    <div>
      <h1 className="text-3xl font-serif gold-text mb-8">Orders</h1>
      
      <div className="card p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders by ID, customer name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-dark">
            <tr>
              <th className="text-left py-4 px-4 rounded-tl-lg">Order ID</th>
              <th className="text-left py-4 px-4">Customer</th>
              <th className="text-left py-4 px-4">Date</th>
              <th className="text-center py-4 px-4">Status</th>
              <th className="text-right py-4 px-4">Amount</th>
              <th className="text-right py-4 px-4 rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr 
                key={order.id} 
                className={`border-b border-white/10 ${
                  index === filteredOrders.length - 1 ? 'rounded-b-lg overflow-hidden' : ''
                }`}
              >
                <td className="py-4 px-4 font-medium">
                  {order.id}
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="text-white">{order.customer.name}</p>
                    <p className="text-sm text-gray-400">{order.customer.email}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {formatDate(order.created_at)}
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  ₹{order.amount.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => openViewModal(order)}
                      className="p-2 text-white hover:text-accent transition-colors"
                      aria-label="View order details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => openUpdateStatusModal(order)}
                      className="p-2 text-white hover:text-accent transition-colors"
                      aria-label="Update order status"
                    >
                      <Package size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-gray-dark/50 rounded-lg mt-4">
            <p className="text-gray-400">No orders found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* View Order Modal */}
      {isViewModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-dark rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif text-white">Order Details: {selectedOrder.id}</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="card p-4">
                <h3 className="text-lg font-medium text-white mb-3">Customer Information</h3>
                <p><span className="text-gray-400">Name:</span> {selectedOrder.customer.name}</p>
                <p><span className="text-gray-400">Email:</span> {selectedOrder.customer.email}</p>
              </div>
              
              <div className="card p-4">
                <h3 className="text-lg font-medium text-white mb-3">Order Information</h3>
                <p>
                  <span className="text-gray-400">Status:</span> 
                  <span className={`inline-flex items-center gap-1 ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </p>
                <p><span className="text-gray-400">Date:</span> {formatDate(selectedOrder.created_at)}</p>
                <p><span className="text-gray-400">Total Amount:</span> ₹{selectedOrder.amount.toLocaleString()}</p>
                {selectedOrder.tracking_number && (
                  <p><span className="text-gray-400">Tracking Number:</span> {selectedOrder.tracking_number}</p>
                )}
              </div>
            </div>
            
            <div className="card p-4 mb-6">
              <h3 className="text-lg font-medium text-white mb-3">Shipping Address</h3>
              <p>{selectedOrder.shipping_address.address}</p>
              <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postalCode}</p>
              <p>{selectedOrder.shipping_address.country}</p>
            </div>
            
            <div className="card p-4">
              <h3 className="text-lg font-medium text-white mb-3">Order Items</h3>
              <div className="space-y-4">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center border-b border-white/10 pb-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
                      <img 
                        src={item.images[0]} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-white">{item.name}</p>
                      <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-accent">₹{item.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-400">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="text-white">₹{selectedOrder.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-400">Shipping:</span>
                  <span className="text-white">₹99</span>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-white/10">
                  <span className="font-medium text-white">Total:</span>
                  <span className="font-medium text-accent">₹{(selectedOrder.amount + 99).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setIsViewModalOpen(false)
                  openUpdateStatusModal(selectedOrder)
                }}
                className="btn btn-primary"
              >
                Update Status
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Update Status Modal */}
      {isUpdateStatusModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-dark rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif text-white">Update Order Status</h2>
              <button
                onClick={() => setIsUpdateStatusModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="status" className="block text-sm text-gray-300 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              {(newStatus === 'shipped' || newStatus === 'delivered') && (
                <div>
                  <label htmlFor="tracking" className="block text-sm text-gray-300 mb-1">
                    Tracking Number
                  </label>
                  <input
                    id="tracking"
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full py-2 px-3 bg-gray-dark border border-accent/30 rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsUpdateStatusModalOpen(false)}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}