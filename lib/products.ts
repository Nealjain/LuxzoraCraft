import { Product } from '@/types/product';
import { createClient } from '@/utils/supabase/server';

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }

  if (!data) {
    return null;
  }

  // Assuming your 'products' table has an 'images' column that is an array of strings
  // and 'spline_model' column for the 3D model URL.
  // You might need to adjust the column names based on your actual Supabase schema.
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    price: data.price,
    images: data.images || [], // Ensure images is an array, default to empty if null/undefined
    category: data.category,
    stock: data.stock,
    featured: data.featured,
    spline_model: data.spline_model || null,
  };
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    price: item.price,
    images: item.images || [],
    category: item.category,
    stock: item.stock,
    featured: item.featured,
    spline_model: item.spline_model || null,
  }));
}