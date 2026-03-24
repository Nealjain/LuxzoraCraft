import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const { email, phone } = await request.json()
    
    if (!email && !phone) {
      return NextResponse.json(
        { message: 'Email or phone number is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const errors: string[] = []

    // Check email uniqueness
    if (email) {
      const { data: existingEmail, error: emailError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (emailError && emailError.code !== 'PGRST116') {
        console.error('Error checking email:', emailError)
        return NextResponse.json(
          { message: 'Database error' },
          { status: 500 }
        )
      }

      if (existingEmail) {
        errors.push('Email address is already registered')
      }
    }

    // Check phone uniqueness
    if (phone) {
      // Normalize phone number (remove non-digits and handle country code)
      let normalizedPhone = phone.replace(/[^0-9]/g, '')
      
      // Remove country code if present
      if (normalizedPhone.length === 12 && normalizedPhone.startsWith('91')) {
        normalizedPhone = normalizedPhone.substring(2)
      }

      // Validate Indian mobile number format
      if (!/^[6-9][0-9]{9}$/.test(normalizedPhone)) {
        errors.push('Invalid phone number format. Please use a valid Indian mobile number.')
      } else {
        const { data: existingPhone, error: phoneError } = await supabase
          .from('users')
          .select('id')
          .eq('phone', normalizedPhone)
          .single()

        if (phoneError && phoneError.code !== 'PGRST116') {
          console.error('Error checking phone:', phoneError)
          return NextResponse.json(
            { message: 'Database error' },
            { status: 500 }
          )
        }

        if (existingPhone) {
          errors.push('Phone number is already registered')
        }
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { 
          valid: false,
          errors: errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      message: 'Email and phone number are available'
    })

  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
