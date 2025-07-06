import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getServerSession } from 'next-auth'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        id,
        created_at,
        products (
          id,
          name,
          slug,
          description,
          price,
          images,
          stock,
          featured
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching wishlist:', error)
      return NextResponse.json(
        { message: 'Failed to fetch wishlist' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ wishlist: data })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { productId } = await request.json()
    
    if (!productId) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Check if product is already in wishlist
    const { data: existing } = await supabase
      .from('wishlist')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('product_id', productId)
      .single()
    
    if (existing) {
      return NextResponse.json(
        { message: 'Product already in wishlist' },
        { status: 409 }
      )
    }
    
    const { data, error } = await supabase
      .from('wishlist')
      .insert([
        {
          user_id: session.user.id,
          product_id: productId,
        },
      ])
      .select(`
        id,
        created_at,
        products (
          id,
          name,
          slug,
          description,
          price,
          images,
          stock,
          featured
        )
      `)
      .single()
    
    if (error) {
      console.error('Error adding to wishlist:', error)
      return NextResponse.json(
        { message: 'Failed to add to wishlist' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Product added to wishlist',
      wishlistItem: data,
    }, { status: 201 })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
