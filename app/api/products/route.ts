import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '12')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit
    
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
    
    // Apply filters if provided
    if (category) {
      query = query.eq('category', category)
    }
    
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }
    
    // Get paginated results
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { message: 'Failed to fetch products' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      products: data,
      totalCount: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, slug, description, price, images, category, stock, spline_model, featured } = await request.json()
    
    // Validate input
    if (!name || !slug || !price || !images || !category) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Create product in Supabase
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          slug,
          description,
          price,
          images,
          category,
          stock,
          spline_model,
          featured: featured || false,
        },
      ])
      .select()
    
    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json(
        { message: 'Failed to create product' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { message: 'Product created successfully', product: data[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}