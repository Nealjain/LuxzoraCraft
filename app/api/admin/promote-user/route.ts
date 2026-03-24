import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const { email, secret } = await request.json()

    const ADMIN_SECRET = process.env.ADMIN_PROMOTION_SECRET || 'luxzora-admin-secret-2024'

    if (secret !== ADMIN_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('email', email)
      .select()

    if (error) {
      console.error('Error promoting user:', error)
      return NextResponse.json({ message: 'Failed to promote user' }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ message: `${email} promoted to admin successfully` })
  } catch (error) {
    console.error('Error in promote user API:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
