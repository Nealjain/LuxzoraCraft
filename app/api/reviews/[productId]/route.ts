import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { productId: string } }) {
  try {
    const { productId } = params;

    if (!productId) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId);

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json({ message: 'Error fetching reviews' }, { status: 500 });
    }

    return NextResponse.json({ reviews: data }, { status: 200 });

  } catch (error) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}