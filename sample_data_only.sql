-- =========================================================
-- LUXZORACRAFT - SAMPLE DATA SCRIPT
-- Run this in your Supabase SQL Editor AFTER creating tables
-- =========================================================

-- 1. Create Views (Required for frontend to fetch data correctly)
CREATE OR REPLACE VIEW product_catalog AS
SELECT
  p.id, p.name, p.slug, p.short_description, p.price,
  p.compare_price, p.images, p.tags, p.is_featured,
  p.material, p.gemstone, p.metal_purity,
  p.quantity, p.warranty_months, p.created_at,
  c.name   AS category_name,
  c.slug   AS category_slug,
  COALESCE(AVG(r.rating), 0) AS avg_rating,
  COUNT(r.id)                AS review_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN reviews    r ON r.product_id = p.id AND r.is_approved = true
WHERE p.is_active = true
GROUP BY p.id, c.name, c.slug, p.created_at;


-- 2. Create Admin User
INSERT INTO users (email, name, password_hash, role, is_active, email_verified)
VALUES (
  'admin@luxzoracraft.com',
  'Admin Manager',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniZk5pQ.Q2zHjkRz7CumtXl8K',  -- Password is "Neal@2005"
  'admin',
  true,
  true
)
ON CONFLICT (email) DO NOTHING;

-- 3. Create Sample Customer Users
INSERT INTO users (email, name, password_hash, role, phone, is_active, email_verified)
VALUES
  ('priya.sharma@gmail.com',  'Priya Sharma',  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniZk5pQ.Q2zHjkRz7CumtXl8K', 'customer', '9876543210', true, true),
  ('arjun.mehta@gmail.com',   'Arjun Mehta',   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniZk5pQ.Q2zHjkRz7CumtXl8K', 'customer', '9123456780', true, true)
ON CONFLICT (email) DO NOTHING;


-- 4. Create Categories
INSERT INTO categories (name, slug, description, is_active, sort_order)
VALUES
  ('Necklaces',  'necklaces',  'Elegant necklaces for every occasion',          true, 1),
  ('Earrings',   'earrings',   'Beautiful earrings to complete your look',       true, 2),
  ('Rings',      'rings',      'Stunning rings for every special moment',        true, 3),
  ('Bracelets',  'bracelets',  'Delicate bracelets for everyday wear',           true, 4),
  ('Pendants',   'pendants',   'Unique pendants with precious gemstones',        true, 5),
  ('Bangles',    'bangles',    'Traditional and modern bangle collections',      true, 6),
  ('Watches',    'watches',    'Luxury timepieces for the discerning collector', true, 7),
  ('Wedding',    'wedding',    'Curated sets for your special day',              true, 8)
ON CONFLICT (slug) DO NOTHING;


-- 5. Create 20 Premium Items
INSERT INTO products (
  name, slug, description, short_description,
  price, compare_price, sku, quantity,
  category_id, images, tags,
  material, color, gemstone, metal_purity, weight_grams, warranty_months,
  is_featured, is_active
)
SELECT * FROM (VALUES

  -- NECKLACES
  (
    'Diamond Solitaire Necklace', 'diamond-solitaire-necklace',
    'A breathtaking diamond solitaire necklace handcrafted in 18k white gold.',
    'Brilliant round diamond pendant in 18k white gold',
    45000.00, 52000.00, 'DSN-001', 15,
    (SELECT id FROM categories WHERE slug = 'necklaces'),
    ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800']::text[],
    ARRAY['diamond', 'solitaire', 'white-gold', 'luxury', 'gift']::text[],
    '18k White Gold', 'White', 'Diamond', '18k', 4.2, 24, true, true
  ),
  (
    'Emerald Gold Chain', 'emerald-gold-chain',
    'Rich natural emeralds set along a lustrous 22k gold chain.',
    'Natural emeralds on a hand-linked 22k gold chain',
    78000.00, 89000.00, 'EGC-001', 6,
    (SELECT id FROM categories WHERE slug = 'necklaces'),
    ARRAY['https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800']::text[],
    ARRAY['emerald', 'gold', '22k', 'statement', 'luxury']::text[],
    '22k Yellow Gold', 'Gold/Green', 'Emerald', '22k', 18.5, 24, true, true
  ),

  -- EARRINGS
  (
    'Pearl Drop Earrings', 'pearl-drop-earrings',
    'Classic freshwater pearl drop earrings set in sterling silver.',
    'Matched freshwater pearl drops in sterling silver',
    8500.00, 10500.00, 'PDE-001', 25,
    (SELECT id FROM categories WHERE slug = 'earrings'),
    ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800']::text[],
    ARRAY['pearl', 'drop', 'silver', 'classic', 'everyday']::text[],
    'Sterling Silver', 'White', 'Pearl', '925', 3.1, 12, true, true
  ),
  (
    'Ruby Jhumka Earrings', 'ruby-jhumka-earrings',
    'Traditional Indian jhumka earrings featuring rich pigeon-blood rubies.',
    'Traditional jhumkas with pigeon-blood rubies in 22k gold',
    34000.00, 40000.00, 'RJE-001', 10,
    (SELECT id FROM categories WHERE slug = 'earrings'),
    ARRAY['https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800']::text[],
    ARRAY['ruby', 'jhumka', 'traditional', 'indian', '22k']::text[],
    '22k Yellow Gold', 'Red/Gold', 'Ruby', '22k', 9.8, 18, true, true
  ),
  (
    'Diamond Stud Earrings', 'diamond-stud-earrings',
    'Minimalist 4-prong diamond studs in 14k white gold.',
    'Certified VS1 diamond studs in 14k white gold',
    22000.00, 27000.00, 'DSE-001', 20,
    (SELECT id FROM categories WHERE slug = 'earrings'),
    ARRAY['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800']::text[],
    ARRAY['diamond', 'studs', 'minimalist', '14k', 'certified']::text[],
    '14k White Gold', 'White', 'Diamond', '14k', 1.8, 24, false, true
  ),

  -- RINGS
  (
    'Ruby Engagement Ring', 'ruby-engagement-ring',
    'A show-stopping ruby engagement ring featuring an oval pigeon-blood ruby.',
    'Oval ruby with diamond halo in 18k yellow gold',
    85000.00, 97000.00, 'RER-001', 8,
    (SELECT id FROM categories WHERE slug = 'rings'),
    ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800']::text[],
    ARRAY['ruby', 'engagement', 'halo', 'diamond', '18k']::text[],
    '18k Yellow Gold', 'Red', 'Ruby, Diamond', '18k', 5.6, 36, true, true
  ),
  (
    'Diamond Eternity Band', 'diamond-eternity-band',
    'A full diamond eternity band crafted in platinum featuring 30 round brilliant diamonds.',
    '30 brilliant diamonds set in platinum — 2.0ct total',
    125000.00, 145000.00, 'DEB-001', 5,
    (SELECT id FROM categories WHERE slug = 'rings'),
    ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800']::text[],
    ARRAY['diamond', 'eternity', 'platinum', 'luxury', 'wedding']::text[],
    'Platinum', 'White', 'Diamond', 'PT950', 4.2, 36, true, true
  ),
  (
    'Sapphire Cocktail Ring', 'sapphire-cocktail-ring',
    'A bold and glamorous cocktail ring featuring a 3ct deep blue Ceylon sapphire.',
    '3ct Ceylon sapphire with pave diamonds in 18k white gold',
    62000.00, 72000.00, 'SCR-001', 7,
    (SELECT id FROM categories WHERE slug = 'rings'),
    ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800']::text[],
    ARRAY['sapphire', 'cocktail', 'bold', 'ceylon', 'white-gold']::text[],
    '18k White Gold', 'Blue', 'Sapphire, Diamond', '18k', 6.3, 24, false, true
  ),

  -- BRACELETS
  (
    'Tennis Bracelet', 'tennis-bracelet',
    'An iconic tennis bracelet featuring 42 brilliant-cut diamonds in a 4-prong box setting.',
    '42 brilliants, 5.0ct total, in 14k white gold',
    125000.00, 142000.00, 'TB-001', 5,
    (SELECT id FROM categories WHERE slug = 'bracelets'),
    ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800']::text[],
    ARRAY['tennis', 'diamond', 'classic', '14k', 'luxury']::text[],
    '14k White Gold', 'White', 'Diamond', '14k', 11.2, 24, true, true
  ),
  (
    'Vintage Charm Bracelet', 'vintage-charm-bracelet',
    'A handpicked collection of vintage-inspired charms in sterling silver.',
    'Sterling silver with 6 vintage-inspired charms, adjustable',
    12000.00, 15500.00, 'VCB-001', 30,
    (SELECT id FROM categories WHERE slug = 'bracelets'),
    ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800']::text[],
    ARRAY['vintage', 'charm', 'silver', 'adjustable', 'gift']::text[],
    'Sterling Silver', 'Silver', NULL, '925', 14.0, 12, false, true
  ),

  -- PENDANTS
  (
    'Sapphire Teardrop Pendant', 'sapphire-teardrop-pendant',
    'An elegant pear-shaped blue sapphire pendant accented with diamond pavé.',
    'Pear sapphire with diamond pavé on 18" white gold chain',
    35000.00, 42000.00, 'STP-001', 12,
    (SELECT id FROM categories WHERE slug = 'pendants'),
    ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800']::text[],
    ARRAY['sapphire', 'teardrop', 'pendant', 'pave', 'white-gold']::text[],
    '18k White Gold', 'Blue', 'Sapphire, Diamond', '18k', 3.8, 24, false, true
  ),
  (
    'Om Pendant in Gold', 'om-pendant-gold',
    'A sacred Om pendant handcrafted in 22k gold with intricate engraving.',
    'Handcrafted 22k gold Om pendant with chain',
    18000.00, 22000.00, 'OPG-001', 20,
    (SELECT id FROM categories WHERE slug = 'pendants'),
    ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800']::text[],
    ARRAY['om', 'religious', 'gold', '22k', 'spiritual', 'gift']::text[],
    '22k Yellow Gold', 'Gold', NULL, '22k', 5.5, 12, false, true
  ),

  -- BANGLES
  (
    'Gold Bangle Set', 'gold-bangle-set',
    'A classic set of 2 bangles in 22k yellow gold with intricate traditional Indian motifs.',
    'Set of 2 traditional 22k gold bangles with Indian motifs',
    55000.00, 64000.00, 'GBS-001', 20,
    (SELECT id FROM categories WHERE slug = 'bangles'),
    ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800']::text[],
    ARRAY['gold', 'bangles', 'traditional', 'indian', 'set', 'wedding']::text[],
    '22k Yellow Gold', 'Gold', NULL, '22k', 32.0, 12, false, true
  ),
  (
    'Diamond-Cut Bangle', 'diamond-cut-bangle',
    'A modern 18k white gold bangle with a diamond-cut exterior for maximum sparkle.',
    'Slim 18k white gold bangle with diamond-cut brilliance',
    28000.00, 34000.00, 'DCB-001', 15,
    (SELECT id FROM categories WHERE slug = 'bangles'),
    ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800']::text[],
    ARRAY['diamond-cut', 'bangle', 'modern', '18k', 'stackable']::text[],
    '18k White Gold', 'White', NULL, '18k', 9.5, 18, false, true
  ),

  -- WATCHES
  (
    'Prestige Swiss Chronograph', 'prestige-swiss-chronograph',
    'Swiss-made automatic chronograph with 42mm case, sapphire crystal glass.',
    'Swiss automatic chronograph, 42mm, sapphire crystal',
    285000.00, 320000.00, 'PSC-001', 4,
    (SELECT id FROM categories WHERE slug = 'watches'),
    ARRAY['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800']::text[],
    ARRAY['swiss', 'chronograph', 'automatic', 'luxury', 'watch']::text[],
    'Stainless Steel / Sapphire Crystal', 'Silver/Black', NULL, NULL, 145.0, 36, true, true
  ),
  (
    'Rose Gold Ladies Watch', 'rose-gold-ladies-watch',
    'An elegant ladies timepiece in rose gold-plated stainless steel.',
    'Rose gold ladies watch with MOP dial and diamond markers',
    32000.00, 38000.00, 'RGW-001', 10,
    (SELECT id FROM categories WHERE slug = 'watches'),
    ARRAY['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800']::text[],
    ARRAY['rose-gold', 'ladies', 'watch', 'diamond', 'elegant']::text[],
    'Rose Gold Plated Steel', 'Rose Gold', 'Diamond (markers)', NULL, 62.0, 24, false, true
  ),

  -- WEDDING
  (
    'Bridal Diamond Necklace Set', 'bridal-diamond-necklace-set',
    'An opulent bridal necklace set featuring a graduated diamond necklace with matching earrings.',
    'Graduated diamond bridal set — necklace, earrings, tikka',
    450000.00, 520000.00, 'BDS-001', 3,
    (SELECT id FROM categories WHERE slug = 'wedding'),
    ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800']::text[],
    ARRAY['bridal', 'diamond', 'set', 'necklace', 'wedding', 'luxury']::text[],
    '18k Rose Gold & White Gold', 'Pink/White', 'Diamond', '18k', 87.0, 36, true, true
  ),
  (
    'Couple Wedding Band Set', 'couple-wedding-band-set',
    'A perfectly matched pair of wedding bands in 18k gold.',
    'Matching his-and-hers 18k gold wedding bands with engraving',
    38000.00, 45000.00, 'CWB-001', 12,
    (SELECT id FROM categories WHERE slug = 'wedding'),
    ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800']::text[],
    ARRAY['wedding', 'bands', 'couple', '18k', 'engraving']::text[],
    '18k Yellow Gold', 'Gold/White', 'Diamond (hers)', '18k', 8.4, 24, false, true
  ),
  (
    'Kundan Bridal Jewellery Set', 'kundan-bridal-set',
    'A spectacular kundan and polki set comprising a choker necklace, jhumka earrings.',
    'Full kundan/polki bridal set — 4 pieces in 22k gold',
    320000.00, 380000.00, 'KBS-001', 2,
    (SELECT id FROM categories WHERE slug = 'wedding'),
    ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800']::text[],
    ARRAY['kundan', 'polki', 'bridal', 'meenakari', '22k', 'set']::text[],
    '22k Yellow Gold', 'Gold/Multi', 'Polki, Kundan', '22k', 215.0, 24, true, true
  ),
  (
    'Mangalsutra Classic', 'mangalsutra-classic',
    'A traditional black-bead mangalsutra in 18k gold with a central diamond pendant.',
    'Traditional mangalsutra with diamond pendant in 18k gold',
    24000.00, 29000.00, 'MGS-001', 18,
    (SELECT id FROM categories WHERE slug = 'wedding'),
    ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800']::text[],
    ARRAY['mangalsutra', 'traditional', 'diamond', '18k', 'everyday']::text[],
    '18k Yellow Gold', 'Gold/Black', 'Diamond', '18k', 6.2, 12, false, true
  )

) AS t(
  name, slug, description, short_description,
  price, compare_price, sku, quantity,
  category_id, images, tags,
  material, color, gemstone, metal_purity, weight_grams, warranty_months,
  is_featured, is_active
)
ON CONFLICT (slug) DO NOTHING;


-- 6. Insert Reviews
INSERT INTO reviews (product_id, user_id, rating, title, comment, verified_purchase, is_approved)
SELECT
  (SELECT id FROM products WHERE slug = 'diamond-solitaire-necklace'),
  (SELECT id FROM users WHERE email = 'priya.sharma@gmail.com'),
  5,
  'Absolutely stunning!',
  'Bought this as an anniversary gift. My wife was speechless. The quality and packaging were both exceptional. Will definitely buy again.',
  true, true
WHERE NOT EXISTS (
  SELECT 1 FROM reviews r
  JOIN products p ON p.id = r.product_id
  JOIN users u ON u.id = r.user_id
  WHERE p.slug = 'diamond-solitaire-necklace' AND u.email = 'priya.sharma@gmail.com'
);

INSERT INTO reviews (product_id, user_id, rating, title, comment, verified_purchase, is_approved)
SELECT
  (SELECT id FROM products WHERE slug = 'ruby-engagement-ring'),
  (SELECT id FROM users WHERE email = 'arjun.mehta@gmail.com'),
  5,
  'She said YES!',
  'The ring was even more beautiful in person. The ruby was vibrant and the craftsmanship was top-notch.',
  true, true
WHERE NOT EXISTS (
  SELECT 1 FROM reviews r
  JOIN products p ON p.id = r.product_id
  JOIN users u ON u.id = r.user_id
  WHERE p.slug = 'ruby-engagement-ring' AND u.email = 'arjun.mehta@gmail.com'
);
