import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }
    
    const supabase = await createClient()
    
    // Fetch orders with user information and addresses
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        amount,
        status,
        created_at,
        updated_at,
        users!orders_user_id_fkey (
          id,
          name,
          email
        ),
        addresses!orders_shipping_address_id_fkey (
          street_address,
          room_number,
          building_name,
          city,
          state,
          postal_code,
          country
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json(
        { message: 'Failed to fetch orders' },
        { status: 500 }
      )
    }
    
    // Transform the data to match the expected format
    const transformedOrders = orders?.map((order: any) => ({
      id: order.id,
      customer: {
        name: order.users?.name || 'Unknown Customer',
        email: order.users?.email || 'No email'
      },
      status: order.status,
      amount: parseFloat(order.amount.toString()),
      created_at: order.created_at,
      items: [], // Will be populated separately if needed
      shipping_address: {
        street_address: order.addresses?.street_address || '',
        city: order.addresses?.city || '',
        state: order.addresses?.state || '',
        postal_code: order.addresses?.postal_code || '',
        country: order.addresses?.country || ''
      }
    })) || []
    
    return NextResponse.json({ orders: transformedOrders })
  } catch (error) {
    console.error('Error in admin orders API:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
