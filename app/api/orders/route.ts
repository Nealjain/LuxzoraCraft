import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import Razorpay from 'razorpay'

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit
    
    const supabase = await createClient()
    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
    
    // Filter by user if provided
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    // Get paginated results
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json(
        { message: 'Failed to fetch orders' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      orders: data,
      totalCount: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { userId, items, shippingAddressId, amount } = await request.json()
    
    // Validate input
    if (!userId || !items || !shippingAddressId || !amount) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    })
    
    const supabase = await createClient()
    
    // Create order in Supabase
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          shipping_address_id: shippingAddressId,
          amount,
          status: 'pending',
        },
      ])
      .select()
    
    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json(
        { message: 'Failed to create order' },
        { status: 500 }
      )
    }
    
    const orderId = orderData[0].id
    
    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: orderId,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
    }))
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
    
    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      // Clean up order if items creation fails
      await supabase.from('orders').delete().eq('id', orderId)
      return NextResponse.json(
        { message: 'Failed to create order items' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Order created successfully',
      order: orderData[0],
      razorpayOrder,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
