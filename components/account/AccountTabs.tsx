'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { User, ShoppingBag, Heart, MapPin, LogOut } from 'lucide-react'
import ProfileTab from './ProfileTab'
import OrdersTab from './OrdersTab'
import WishlistTab from './WishlistTab'
import AddressesTab from './AddressesTab'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
]

export default function AccountTabs() {
  const [activeTab, setActiveTab] = useState('profile')
  
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="md:col-span-1">
        <div className="card p-6">
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center p-3 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-accent text-primary'
                      : 'text-white hover:bg-gray-dark'
                  }`}
                >
                  <tab.icon size={18} className="mr-3" />
                  {tab.label}
                </button>
              </li>
            ))}
            
            <li className="pt-4 border-t border-white/10">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center p-3 rounded-md text-white hover:bg-gray-dark transition-colors"
              >
                <LogOut size={18} className="mr-3" />
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Content */}
      <div className="md:col-span-3">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'wishlist' && <WishlistTab />}
          {activeTab === 'addresses' && <AddressesTab />}
        </motion.div>
      </div>
    </div>
  )
}