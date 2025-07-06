import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getServerSession } from 'next-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const supabase = await createClient()
    
    // Get total products
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
    
    // Get total orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
    
    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
    
    // Get total revenue
    const { data: revenueData } = await supabase
      .from('orders')
      .select('amount')
      .eq('status', 'completed')
    
    const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.amount.toString()), 0) || 0
    
    // Get recent orders
    const { data: recentOrders } = await supabase
      .from('orders')
      .select(`
        id,
        amount,
        status,
        created_at,
        users (
          name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5)
    
    // Get low stock products
    const { data: lowStockProducts } = await supabase
      .from('products')
      .select('id, name, stock, price')
      .lte('stock', 10)
      .order('stock', { ascending: true })
      .limit(5)
    
    // Get order status distribution
    const { data: orderStats } = await supabase
      .from('orders')
      .select('status')
    
    const statusCounts = orderStats?.reduce((acc: any, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {}) || {}
    
    return NextResponse.json({
      stats: {
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        totalUsers: totalUsers || 0,
        totalRevenue,
        recentOrders,
        lowStockProducts,
        orderStatusDistribution: statusCounts,
      },
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
