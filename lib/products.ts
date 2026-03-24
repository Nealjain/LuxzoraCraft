import { Product } from '@/types/product';
import { createClient } from '@/utils/supabase/server';

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('product_catalog')
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

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.short_description || '', // Mapping short_description or full description
    price: data.price,
    images: data.images || [],
    category: data.category_name || '', // DB view returns category_name
    stock: data.quantity || 0, // DB view returns quantity
    featured: data.is_featured || false,
    spline_model: undefined, // Spline model not in new schema, maybe added later
  };
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('product_catalog')
    .select('*')
    .eq('is_featured', true);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.short_description || '',
    price: item.price,
    images: item.images || [],
    category: item.category_name || '',
    stock: item.quantity || 0,
    featured: item.is_featured || false,
    spline_model: undefined,
  }));
}