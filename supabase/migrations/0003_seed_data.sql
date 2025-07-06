-- Insert categories
INSERT INTO categories (name, slug) VALUES
  ('Rings', 'rings'),
  ('Necklaces', 'necklaces'),
  ('Earrings', 'earrings'),
  ('Bracelets', 'bracelets'),
  ('Watches', 'watches'),
  ('Wedding', 'wedding'),
  ('Custom', 'custom');

-- Insert some sample products
INSERT INTO products (name, slug, description, price, images, category_id, quantity, is_featured)
SELECT 
  'Diamond Solitaire Ring',
  'diamond-solitaire-ring',
  'Elegant diamond solitaire ring crafted with precision and featuring a brilliant cut diamond set in 14k white gold.',
  2999.99,
  ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'],
  (SELECT id FROM categories WHERE slug = 'rings'),
  10,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'diamond-solitaire-ring');

INSERT INTO products (name, slug, description, price, images, category_id, quantity, is_featured) 
SELECT 
  'Pearl Necklace Set',
  'pearl-necklace-set',
  'Luxurious freshwater pearl necklace with matching earrings. Perfect for special occasions.',
  899.99,
  ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
  (SELECT id FROM categories WHERE slug = 'necklaces'),
  15,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pearl-necklace-set');

INSERT INTO products (name, slug, description, price, images, category_id, quantity, is_featured) 
SELECT 
  'Gold Hoop Earrings',
  'gold-hoop-earrings',
  'Classic 18k gold hoop earrings with a modern twist. Lightweight and comfortable for everyday wear.',
  599.99,
  ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'],
  (SELECT id FROM categories WHERE slug = 'earrings'),
  25,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'gold-hoop-earrings');

INSERT INTO products (name, slug, description, price, images, category_id, quantity, is_featured) 
SELECT 
  'Tennis Bracelet',
  'tennis-bracelet',
  'Stunning diamond tennis bracelet featuring perfectly matched diamonds in a secure setting.',
  1899.99,
  ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800'],
  (SELECT id FROM categories WHERE slug = 'bracelets'),
  8,
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'tennis-bracelet');

INSERT INTO products (name, slug, description, price, images, category_id, quantity, is_featured) 
SELECT 
  'Luxury Swiss Watch',
  'luxury-swiss-watch',
  'Precision Swiss automatic movement with sapphire crystal and stainless steel case.',
  3999.99,
  ARRAY['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800'],
  (SELECT id FROM categories WHERE slug = 'watches'),
  5,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'luxury-swiss-watch');

INSERT INTO products (name, slug, description, price, images, category_id, quantity, is_featured) 
SELECT 
  'Wedding Ring Set',
  'wedding-ring-set',
  'Beautiful matching wedding ring set for couples. Crafted in 14k gold with diamond accents.',
  2299.99,
  ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'],
  (SELECT id FROM categories WHERE slug = 'wedding'),
  12,
  true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'wedding-ring-set');

INSERT INTO products (name, slug, description, price, images, category_id, quantity, is_featured) 
SELECT 
  'Emerald Statement Ring',
  'emerald-statement-ring',
  'Bold emerald statement ring surrounded by diamonds in a vintage-inspired setting.',
  4999.99,
  ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'],
  (SELECT id FROM categories WHERE slug = 'rings'),
  3,
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'emerald-statement-ring');

INSERT INTO products (name, slug, description, price, images, category_id, quantity, is_featured) 
SELECT 
  'Sapphire Drop Earrings',
  'sapphire-drop-earrings',
  'Elegant sapphire drop earrings with diamond accents. Perfect for formal occasions.',
  1599.99,
  ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'],
  (SELECT id FROM categories WHERE slug = 'earrings'),
  7,
  false
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'sapphire-drop-earrings');
