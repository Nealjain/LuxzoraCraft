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
      .from('addresses')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching addresses:', error)
      return NextResponse.json(
        { message: 'Failed to fetch addresses' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ addresses: data })
  } catch (error) {
    console.error('Error fetching addresses:', error)
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
    
    const {
      street_address,
      room_number,
      building_name,
      city,
      state,
      postal_code,
      country,
      location
    } = await request.json()
    
    if (!street_address || !city || !postal_code || !country) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('addresses')
      .insert([
        {
          user_id: session.user.id,
          street_address,
          room_number,
          building_name,
          city,
          state,
          postal_code,
          country,
          location,
        },
      ])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating address:', error)
      return NextResponse.json(
        { message: 'Failed to create address' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Address created successfully',
      address: data,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating address:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
