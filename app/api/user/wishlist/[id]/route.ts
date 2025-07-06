import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getServerSession } from 'next-auth'

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
      .from('wishlist')
      .delete()
      .eq('id', params.id)
      .eq('user_id', session.user.id)
    
    if (error) {
      console.error('Error removing from wishlist:', error)
      return NextResponse.json(
        { message: 'Failed to remove from wishlist' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Product removed from wishlist',
    })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
