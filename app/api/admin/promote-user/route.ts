import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const { email, secret } = await request.json()
    
    // Simple security check - you can change this secret
    const ADMIN_SECRET = process.env.ADMIN_PROMOTION_SECRET || 'luxzora-admin-secret-2024'
    
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      )
    }
    
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Find user by email and update to admin
    const { data, error } = await supabase
      .from('users')
      .update({ is_admin: true })
      .eq('email', email)
      .select()
    
    if (error) {
      console.error('Error promoting user to admin:', error)
      return NextResponse.json(
        { message: 'Failed to promote user to admin' },
        { status: 500 }
      )
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: 'User not found with that email' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      message: `User ${email} has been promoted to admin successfully`,
      user: data[0]
    })
  } catch (error) {
    console.error('Error in promote user API:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
