import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, dob, is_admin, created_at, updated_at')
      .eq('id', session.user.id)
      .single()
    
    if (error) {
      console.error('Error fetching user profile:', error)
      return NextResponse.json(
        { message: 'Failed to fetch user profile' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ user: data })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { name, dob } = await request.json()
    
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('users')
      .update({
        name,
        dob,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating user profile:', error)
      return NextResponse.json(
        { message: 'Failed to update user profile' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: data,
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
