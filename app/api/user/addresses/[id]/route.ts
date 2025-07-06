import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getServerSession } from 'next-auth'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
      .update({
        street_address,
        room_number,
        building_name,
        city,
        state,
        postal_code,
        country,
        location,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating address:', error)
      return NextResponse.json(
        { message: 'Failed to update address' },
        { status: 500 }
      )
    }
    
    if (!data) {
      return NextResponse.json(
        { message: 'Address not found or unauthorized' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      message: 'Address updated successfully',
      address: data,
    })
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const supabase = await createClient()
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', params.id)
      .eq('user_id', session.user.id)
    
    if (error) {
      console.error('Error deleting address:', error)
      return NextResponse.json(
        { message: 'Failed to delete address' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Address deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
