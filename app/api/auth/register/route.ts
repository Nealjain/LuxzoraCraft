import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { name, email, password, dob, address, roomNumber, buildingName, location, phoneNumber } = await request.json();

    // Basic validation
    if (!name || !email || !password || !dob || !address || !location || !phoneNumber) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Sign up user with Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: name, 
          dob, 
          address, 
          room_number: roomNumber, 
          building_name: buildingName, 
          location,
          phone_number: phoneNumber
        },
      },
    });

    if (authError) {
      console.error('Supabase Auth Error:', authError);
      return NextResponse.json({ message: authError.message }, { status: authError.status || 500 });
    }

    // If user is created but not confirmed (e.g., email verification is on)
    if (data.user && !data.user.confirmed_at) {
      return NextResponse.json({ message: 'Registration successful. Please check your email to confirm your account.' }, { status: 200 });
    }

    // If user is directly created and confirmed (e.g., email verification is off)
    if (data.user) {
      return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    }

    return NextResponse.json({ message: 'Registration failed for an unknown reason.' }, { status: 500 });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}