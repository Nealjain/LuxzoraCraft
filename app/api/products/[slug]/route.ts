import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config'

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const supabase = await createClient();

  try {
    // Fetch product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (productError) {
      console.error('Error fetching product:', productError);
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Fetch reviews for the product
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', product.id);

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      // Continue without reviews if there's an error fetching them
    }

    return NextResponse.json({ product, reviews: reviews || [] }, { status: 200 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  
  try {
    // Check authentication and admin status
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    
    // Check if user is admin
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('email', session.user.email)
      .single();

    if (userError || !user?.is_admin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      original_price,
      category_id,
      stock_quantity,
      sku,
      weight,
      dimensions,
      material,
      care_instructions,
      image_url,
      gallery_images,
      is_featured,
      is_active
    } = body;

    // Get the existing product first to ensure it exists
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single();

    if (fetchError || !existingProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Generate new slug if name changed
    let newSlug = slug;
    if (name) {
      newSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Update the product
    const { data: product, error } = await supabase
      .from('products')
      .update({
        name,
        description,
        price: parseFloat(price),
        original_price: original_price ? parseFloat(original_price) : null,
        category_id: parseInt(category_id),
        stock_quantity: parseInt(stock_quantity),
        sku,
        weight: weight ? parseFloat(weight) : null,
        dimensions,
        material,
        care_instructions,
        image_url,
        gallery_images,
        is_featured: Boolean(is_featured),
        is_active: Boolean(is_active),
        slug: newSlug,
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return NextResponse.json({ message: 'Failed to update product' }, { status: 500 });
    }

    return NextResponse.json({ product }, { status: 200 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  
  try {
    // Check authentication and admin status
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    
    // Check if user is admin
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('email', session.user.email)
      .single();

    if (userError || !user?.is_admin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    // Get the product to check if it exists and get its ID
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single();

    if (fetchError || !product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Check if product has any orders (prevent deletion if so)
    const { data: orderItems, error: orderCheckError } = await supabase
      .from('order_items')
      .select('id')
      .eq('product_id', product.id)
      .limit(1);

    if (orderCheckError) {
      console.error('Error checking orders:', orderCheckError);
      return NextResponse.json({ message: 'Failed to check product dependencies' }, { status: 500 });
    }

    if (orderItems && orderItems.length > 0) {
      return NextResponse.json({ 
        message: 'Cannot delete product that has been ordered. Consider deactivating it instead.' 
      }, { status: 400 });
    }

    // Delete related data first (reviews, wishlist items, cart items)
    await supabase.from('reviews').delete().eq('product_id', product.id);
    await supabase.from('wishlist_items').delete().eq('product_id', product.id);
    await supabase.from('cart_items').delete().eq('product_id', product.id);

    // Delete the product
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('slug', slug);

    if (deleteError) {
      console.error('Error deleting product:', deleteError);
      return NextResponse.json({ message: 'Failed to delete product' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
