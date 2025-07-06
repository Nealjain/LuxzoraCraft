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
    street_address: string
    city: string
    state: string
    postal_code: string
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
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()

      if (response.ok) {
        setOrders(data.orders || [])
      } else {
        console.error('Failed to fetch orders:', data.message)
        // Use mock data if API fails
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }
  
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
    return date.toLocaleDateString('en-US', {
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
  
  const handleUpdateStatus = async () => {
    if (!selectedOrder) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          tracking_number: trackingNumber,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const updatedOrders = orders.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                status: newStatus as any,
                tracking_number:
                  newStatus === 'shipped' || newStatus === 'delivered'
                    ? trackingNumber
                    : order.tracking_number,
              }
            : order
        )

        setOrders(updatedOrders)
        setIsUpdateStatusModalOpen(false)
        setSelectedOrder(null)
      } else {
        console.error('Failed to update order status:', data.message)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    } finally {
      setIsSubmitting(false)
    }
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
      <h1 className="text-3xl font-serif gold-text mb-8">Orders Management</h1>
      
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
                  ${order.amount.toLocaleString()}
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
                <p><span className="text-gray-400">Total Amount:</span> ${selectedOrder.amount.toLocaleString()}</p>
                {selectedOrder.tracking_number && (
                  <p><span className="text-gray-400">Tracking Number:</span> {selectedOrder.tracking_number}</p>
                )}
              </div>
            </div>
            
            <div className="card p-4 mb-6">
              <h3 className="text-lg font-medium text-white mb-3">Shipping Address</h3>
              <p>{selectedOrder.shipping_address.street_address}</p>
              <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}</p>
              <p>{selectedOrder.shipping_address.country}</p>
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
