import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { productId, userId, rating, comment } = await request.json();

    if (!productId || !userId || !rating || !comment) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('reviews')
      .insert([
        { product_id: productId, user_id: userId, rating, comment }
      ])
      .select();

    if (error) {
      console.error('Error inserting review:', error);
      return NextResponse.json({ message: 'Error submitting review' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Review submitted successfully', review: data[0] }, { status: 201 });

  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}