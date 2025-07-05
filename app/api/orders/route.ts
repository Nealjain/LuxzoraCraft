import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Razorpay from 'razorpay'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
    const { userId, items, shippingAddress, amount } = await request.json()
    
    // Validate input
    if (!userId || !items || !shippingAddress || !amount) {
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
    
    // Create order in Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          items,
          shipping_address: shippingAddress,
          amount,
          razorpay_order_id: razorpayOrder.id,
          status: 'pending',
        },
      ])
      .select()
    
    if (error) {
      console.error('Error creating order:', error)
      return NextResponse.json(
        { message: 'Failed to create order' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Order created successfully',
      order: data[0],
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