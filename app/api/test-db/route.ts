import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test basic connection
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (usersError) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: usersError.message
      })
    }
    
    // Test products table
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('count')
      .limit(1)
    
    if (productsError) {
      return NextResponse.json({
        status: 'error',
        message: 'Products table connection failed',
        error: productsError.message
      })
    }
    
    // Test categories table
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('count')
      .limit(1)
    
    if (categoriesError) {
      return NextResponse.json({
        status: 'error',
        message: 'Categories table connection failed',
        error: categoriesError.message
      })
    }
    
    // Test orders table
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('count')
      .limit(1)
    
    if (ordersError) {
      return NextResponse.json({
        status: 'error',
        message: 'Orders table connection failed',
        error: ordersError.message
      })
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'All database connections working properly!',
      tables: {
        users: 'connected',
        products: 'connected',
        categories: 'connected',
        orders: 'connected'
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Database connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
