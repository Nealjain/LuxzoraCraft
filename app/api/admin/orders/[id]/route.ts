import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }
    
    const { status, tracking_number } = await request.json()
    
    if (!status) {
      return NextResponse.json(
        { message: 'Status is required' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Update the order
    const { data, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
        ...(tracking_number && { tracking_number })
      })
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating order:', error)
      return NextResponse.json(
        { message: 'Failed to update order' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Order updated successfully',
      order: data
    })
  } catch (error) {
    console.error('Error in admin order update API:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
