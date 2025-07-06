import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, dob } = await request.json()
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }
    
    // Validate phone number if provided
    let normalizedPhone = null
    if (phone) {
      normalizedPhone = phone.replace(/[^0-9]/g, '')
      
      // Remove country code if present
      if (normalizedPhone.length === 12 && normalizedPhone.startsWith('91')) {
        normalizedPhone = normalizedPhone.substring(2)
      }
      
      // Validate Indian mobile number format
      if (!/^[6-9][0-9]{9}$/.test(normalizedPhone)) {
        return NextResponse.json(
          { message: 'Invalid phone number format. Please use a valid Indian mobile number.' },
          { status: 400 }
        )
      }
    }
    
    const supabase = await createClient()
    
    // Check if user already exists with email
    const { data: existingEmail } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()
    
    if (existingEmail) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      )
    }
    
    // Check if phone number already exists
    if (normalizedPhone) {
      const { data: existingPhone } = await supabase
        .from('users')
        .select('phone')
        .eq('phone', normalizedPhone)
        .single()
      
      if (existingPhone) {
        return NextResponse.json(
          { message: 'User with this phone number already exists' },
          { status: 409 }
        )
      }
    }
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })
    
    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { message: 'Failed to create user account' },
        { status: 500 }
      )
    }
    
    if (!authData.user) {
      return NextResponse.json(
        { message: 'Failed to create user account' },
        { status: 500 }
      )
    }
    
    // Hash password for our users table
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create user profile in our users table
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          name,
          email,
          password_hash: hashedPassword,
          phone: normalizedPhone,
          date_of_birth: dob || null,
          provider: 'credentials',
          email_verified: false,
          is_admin: false,
        },
      ])
    
    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { message: 'Failed to create user profile' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'User registered successfully. Please check your email for verification.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
