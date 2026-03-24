import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    const [
      { count: totalProducts },
      { count: totalOrders },
      { count: totalUsers },
      { data: revenueData },
      { data: recentOrders },
      { data: lowStock },
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total_amount').eq('status', 'delivered'),
      supabase.from('orders')
        .select('id, order_number, total_amount, status, created_at, users!orders_user_id_fkey(name, email)')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('products')
        .select('id, name, quantity, price')
        .lte('quantity', 5)
        .order('quantity', { ascending: true })
        .limit(5),
    ])

    const totalRevenue = revenueData?.reduce((sum, o) => sum + parseFloat(o.total_amount), 0) || 0

    return NextResponse.json({
      stats: {
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        totalUsers: totalUsers || 0,
        totalRevenue,
        recentOrders: recentOrders || [],
        lowStockProducts: lowStock || [],
      },
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
