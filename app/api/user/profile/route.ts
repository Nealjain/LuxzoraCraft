import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, phone, date_of_birth, role, created_at, updated_at')
      .eq('id', session.user.id)
      .single()

    if (error) {
      return NextResponse.json({ message: 'Failed to fetch profile' }, { status: 500 })
    }

    return NextResponse.json({ user: data })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { name, date_of_birth, phone } = await request.json()

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('users')
      .update({ name, date_of_birth, phone, updated_at: new Date().toISOString() })
      .eq('id', session.user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Profile updated successfully', user: data })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
