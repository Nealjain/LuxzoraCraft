import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '12')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    const supabase = await createClient()
    let query = supabase
      .from('product_catalog')
      .select('*', { count: 'exact' })

    if (category) query = query.eq('category_slug', category)
    if (search) query = query.ilike('name', `%${search}%`)

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 })
    }

    return NextResponse.json({
      products: data || [],
      total: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, short_description, price, compare_price, images, category_id, quantity, material, color, gemstone, metal_purity, is_featured } = await request.json()

    if (!name || !price || !category_id) {
      return NextResponse.json({ message: 'Name, price, and category are required' }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name,
        slug,
        description,
        short_description,
        price,
        compare_price,
        images: images || [],
        category_id,
        quantity: quantity || 0,
        material,
        color,
        gemstone,
        metal_purity,
        is_featured: is_featured || false,
      }])
      .select()

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json({ message: 'Failed to create product' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Product created successfully', product: data[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
