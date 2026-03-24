import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json(
        { message: 'Failed to fetch categories' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ categories: data })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, slug } = await request.json()
    
    if (!name || !slug) {
      return NextResponse.json(
        { message: 'Name and slug are required' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, slug }])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating category:', error)
      return NextResponse.json(
        { message: 'Failed to create category' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Category created successfully',
      category: data,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
