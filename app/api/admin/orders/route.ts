import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        email,
        status,
        payment_status,
        total_amount,
        created_at,
        updated_at,
        users!orders_user_id_fkey (
          id,
          name,
          email
        ),
        addresses!orders_shipping_address_id_fkey (
          address_line_1,
          address_line_2,
          city,
          state,
          postal_code,
          country
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 })
    }

    const transformed = orders?.map((order: any) => ({
      id: order.id,
      order_number: order.order_number,
      email: order.email,
      customer: {
        name: order.users?.name || 'Unknown',
        email: order.users?.email || order.email,
      },
      status: order.status,
      payment_status: order.payment_status,
      total_amount: parseFloat(order.total_amount),
      created_at: order.created_at,
      shipping_address: order.addresses ? {
        address_line_1: order.addresses.address_line_1,
        city: order.addresses.city,
        state: order.addresses.state,
        postal_code: order.addresses.postal_code,
        country: order.addresses.country,
      } : null,
    })) || []

    return NextResponse.json({ orders: transformed })
  } catch (error) {
    console.error('Error in admin orders API:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
