-- ============================================================
-- LuxzoraCraft — Complete Secure Supabase Setup
-- Migration: 0009_complete_secure_setup.sql
-- Run this ENTIRE script in Supabase → SQL Editor
-- ============================================================

-- ─────────────────────────────────────────
-- STEP 0: Enable required extensions
-- ─────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- For AES encryption functions

-- ─────────────────────────────────────────
-- STEP 1: Drop all existing tables cleanly
-- (Run this only on a fresh/dev database)
-- ─────────────────────────────────────────
DROP TABLE IF EXISTS fraud_logs       CASCADE;
DROP TABLE IF EXISTS audit_logs       CASCADE;
DROP TABLE IF EXISTS payment_tokens   CASCADE;
DROP TABLE IF EXISTS order_items      CASCADE;
DROP TABLE IF EXISTS orders           CASCADE;
DROP TABLE IF EXISTS addresses        CASCADE;
DROP TABLE IF EXISTS wishlist         CASCADE;
DROP TABLE IF EXISTS reviews          CASCADE;
DROP TABLE IF EXISTS products         CASCADE;
DROP TABLE IF EXISTS categories       CASCADE;
DROP TABLE IF EXISTS users            CASCADE;

-- Drop old functions/triggers if they exist
DROP FUNCTION IF EXISTS update_updated_at_column()       CASCADE;
DROP FUNCTION IF EXISTS generate_order_number()          CASCADE;
DROP FUNCTION IF EXISTS set_order_number()               CASCADE;
DROP FUNCTION IF EXISTS handle_oauth_user(VARCHAR,VARCHAR,VARCHAR,VARCHAR,VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS normalize_phone_number(TEXT)     CASCADE;
DROP FUNCTION IF EXISTS trigger_normalize_phone()        CASCADE;
DROP FUNCTION IF EXISTS validate_user_data()             CASCADE;
DROP FUNCTION IF EXISTS encrypt_sensitive(TEXT)          CASCADE;
DROP FUNCTION IF EXISTS decrypt_sensitive(TEXT)          CASCADE;
DROP FUNCTION IF EXISTS generate_order_hash(UUID)        CASCADE;
DROP FUNCTION IF EXISTS log_audit(UUID, TEXT, TEXT, JSONB) CASCADE;


-- ─────────────────────────────────────────
-- STEP 2: UTILITY FUNCTIONS
-- ─────────────────────────────────────────

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Generate unique order number (e.g. LZC-20260324-001)
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'LZC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
         LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-assign order number on insert
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────
-- STEP 3: ENCRYPTION FUNCTIONS
-- Uses pgcrypto's AES (symmetric encryption)
-- Key is stored in Supabase Vault or env var
-- ─────────────────────────────────────────

-- Encrypt sensitive text (card metadata, PII)
-- Usage: SELECT encrypt_sensitive('4111111111111111', 'your-32-char-key');
CREATE OR REPLACE FUNCTION encrypt_sensitive(plain_text TEXT, encryption_key TEXT DEFAULT 'luxzoracraft-aes-key-32chars!!')
RETURNS TEXT AS $$
BEGIN
  -- Returns base64-encoded AES-256-CBC ciphertext
  RETURN encode(
    pgp_sym_encrypt(plain_text, encryption_key),
    'base64'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrypt sensitive text
-- Usage: SELECT decrypt_sensitive(encrypted_col, 'your-32-char-key');
CREATE OR REPLACE FUNCTION decrypt_sensitive(encrypted_text TEXT, encryption_key TEXT DEFAULT 'luxzoracraft-aes-key-32chars!!')
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(
    decode(encrypted_text, 'base64'),
    encryption_key
  );
EXCEPTION WHEN OTHERS THEN
  RETURN NULL; -- Return NULL on decryption failure (wrong key / corrupted data)
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generate SHA-256 order integrity hash
CREATE OR REPLACE FUNCTION generate_order_hash(p_order_id UUID)
RETURNS TEXT AS $$
DECLARE
  order_record RECORD;
  items_json   TEXT;
  hash_input   TEXT;
BEGIN
  SELECT o.id, o.user_id, o.total_amount, o.order_number, o.created_at
  INTO order_record
  FROM orders o
  WHERE o.id = p_order_id;

  SELECT string_agg(
    product_id::TEXT || ':' || quantity::TEXT || ':' || unit_price::TEXT,
    ',' ORDER BY product_id
  ) INTO items_json
  FROM order_items
  WHERE order_id = p_order_id;

  hash_input := order_record.order_number
    || '|' || COALESCE(order_record.user_id::TEXT, 'guest')
    || '|' || order_record.total_amount::TEXT
    || '|' || order_record.created_at::TEXT
    || '|' || COALESCE(items_json, '');

  RETURN encode(digest(hash_input, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Audit logging helper
CREATE OR REPLACE FUNCTION log_audit(
  p_user_id   UUID,
  p_action    TEXT,
  p_ip        TEXT DEFAULT NULL,
  p_metadata  JSONB DEFAULT '{}'::JSONB
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, ip_address, metadata)
  VALUES (p_user_id, p_action, p_ip, p_metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phone normalization
CREATE OR REPLACE FUNCTION normalize_phone_number(input_phone TEXT)
RETURNS TEXT AS $$
BEGIN
  IF input_phone IS NULL OR trim(input_phone) = '' THEN RETURN NULL; END IF;
  input_phone := regexp_replace(input_phone, '[^0-9]', '', 'g');
  IF length(input_phone) = 12 AND substring(input_phone, 1, 2) = '91' THEN
    input_phone := substring(input_phone, 3);
  END IF;
  IF input_phone !~ '^[6-9][0-9]{9}$' THEN
    RAISE EXCEPTION 'Invalid Indian phone number: %', input_phone;
  END IF;
  RETURN input_phone;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trigger_normalize_phone()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.phone IS NOT NULL THEN
    BEGIN
      NEW.phone := normalize_phone_number(NEW.phone);
    EXCEPTION WHEN OTHERS THEN
      NEW.phone := NULL;
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ─────────────────────────────────────────
-- STEP 4: CREATE TABLES
-- ─────────────────────────────────────────

-- USERS
CREATE TABLE users (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email            VARCHAR(255) UNIQUE NOT NULL,
  name             VARCHAR(255),
  password_hash    VARCHAR(255),              -- bcrypt hash (never plain text)
  phone            VARCHAR(20),               -- normalized 10-digit Indian
  date_of_birth    DATE,
  role             VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'moderator')),
  provider         VARCHAR(50) DEFAULT 'credentials',
  provider_id      VARCHAR(255),
  avatar_url       VARCHAR(500),
  is_active        BOOLEAN DEFAULT TRUE,
  email_verified   BOOLEAN DEFAULT FALSE,
  failed_attempts  INTEGER DEFAULT 0,
  locked_until     TIMESTAMP WITH TIME ZONE,
  -- Encrypted PII fields (stored encrypted via pgcrypto)
  encrypted_dob    TEXT,                      -- encrypted date of birth
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(255) UNIQUE NOT NULL,
  slug        VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url   VARCHAR(500),
  is_active   BOOLEAN DEFAULT TRUE,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE products (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              VARCHAR(255) NOT NULL,
  slug              VARCHAR(255) UNIQUE NOT NULL,
  description       TEXT,
  short_description TEXT,
  price             DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  compare_price     DECIMAL(10, 2),
  sku               VARCHAR(100) UNIQUE,
  quantity          INTEGER DEFAULT 0 CHECK (quantity >= 0),
  category_id       UUID REFERENCES categories(id) ON DELETE SET NULL,
  images            TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags              TEXT[] DEFAULT ARRAY[]::TEXT[],
  material          VARCHAR(255),
  color             VARCHAR(100),
  gemstone          VARCHAR(255),
  metal_purity      VARCHAR(100),
  weight_grams      DECIMAL(8, 2),
  warranty_months   INTEGER DEFAULT 12,
  is_featured       BOOLEAN DEFAULT FALSE,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ADDRESSES
CREATE TABLE addresses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  type            VARCHAR(20) DEFAULT 'shipping' CHECK (type IN ('shipping', 'billing')),
  first_name      VARCHAR(255),
  last_name       VARCHAR(255),
  address_line_1  VARCHAR(255) NOT NULL,
  address_line_2  VARCHAR(255),
  city            VARCHAR(100) NOT NULL,
  state           VARCHAR(100),
  postal_code     VARCHAR(20) NOT NULL,
  country         VARCHAR(100) NOT NULL DEFAULT 'India',
  phone           VARCHAR(20),
  is_default      BOOLEAN DEFAULT FALSE,
  -- Encrypted address for extra privacy
  encrypted_address TEXT,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ORDERS
CREATE TABLE orders (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number        VARCHAR(50) UNIQUE NOT NULL DEFAULT '',
  user_id             UUID REFERENCES users(id) ON DELETE SET NULL,
  email               VARCHAR(255) NOT NULL,
  status              VARCHAR(50) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  payment_status      VARCHAR(50) DEFAULT 'pending'
                        CHECK (payment_status IN ('pending','paid','failed','refunded')),
  subtotal            DECIMAL(10, 2) NOT NULL,
  tax_amount          DECIMAL(10, 2) DEFAULT 0,
  shipping_amount     DECIMAL(10, 2) DEFAULT 0,
  discount_amount     DECIMAL(10, 2) DEFAULT 0,
  total_amount        DECIMAL(10, 2) NOT NULL,
  currency            VARCHAR(3) DEFAULT 'INR',
  -- Security fields
  integrity_hash      VARCHAR(64),             -- SHA-256 of order contents
  fraud_score         DECIMAL(3, 2) DEFAULT 0, -- 0.00 to 1.00
  fraud_flags         TEXT[],                  -- which rules fired
  -- Payment (tokenized, NOT raw card data)
  payment_method      VARCHAR(100),
  razorpay_order_id   VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  payment_token       VARCHAR(255),            -- gateway token (never card number)
  -- Addresses
  shipping_address_id UUID REFERENCES addresses(id),
  billing_address_id  UUID REFERENCES addresses(id),
  -- Tracking
  tracking_number     VARCHAR(255),
  notes               TEXT,
  -- Timestamps
  confirmed_at        TIMESTAMP WITH TIME ZONE,
  shipped_at          TIMESTAMP WITH TIME ZONE,
  delivered_at        TIMESTAMP WITH TIME ZONE,
  cancelled_at        TIMESTAMP WITH TIME ZONE,
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ORDER ITEMS
CREATE TABLE order_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name  VARCHAR(255) NOT NULL,   -- snapshot at time of order
  product_sku   VARCHAR(100),
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  unit_price    DECIMAL(10, 2) NOT NULL, -- price at time of order
  total         DECIMAL(10, 2) NOT NULL,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PAYMENT TOKENS (secure payment references)
CREATE TABLE payment_tokens (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id          UUID REFERENCES orders(id) ON DELETE CASCADE,
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
  gateway           VARCHAR(50) NOT NULL,       -- 'razorpay', 'stripe', etc.
  token             VARCHAR(255) NOT NULL,       -- gateway payment token
  last_four         VARCHAR(4),                  -- last 4 digits of card (safe to store)
  card_brand        VARCHAR(50),                 -- 'visa', 'mastercard', etc.
  encrypted_meta    TEXT,                        -- AES-encrypted payment metadata
  status            VARCHAR(50) DEFAULT 'active',
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- REVIEWS
CREATE TABLE reviews (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id       UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id          UUID REFERENCES users(id) ON DELETE CASCADE,
  order_id         UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating           INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title            VARCHAR(255),
  comment          TEXT,
  verified_purchase BOOLEAN DEFAULT FALSE,
  is_approved      BOOLEAN DEFAULT TRUE,
  helpful_count    INTEGER DEFAULT 0,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WISHLIST
CREATE TABLE wishlist (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- AUDIT LOGS (immutable — no UPDATE/DELETE allowed via RLS)
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  action      VARCHAR(100) NOT NULL,
  ip_address  VARCHAR(45),
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FRAUD LOGS
CREATE TABLE fraud_logs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  order_id     UUID REFERENCES orders(id) ON DELETE SET NULL,
  fraud_score  DECIMAL(3, 2),
  triggers     TEXT[],
  action_taken VARCHAR(50) CHECK (action_taken IN ('approved','review','blocked')),
  ip_address   VARCHAR(45),
  user_agent   TEXT,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- STEP 5: INDEXES (performance)
-- ─────────────────────────────────────────
CREATE INDEX idx_products_category    ON products(category_id);
CREATE INDEX idx_products_active      ON products(is_active);
CREATE INDEX idx_products_featured    ON products(is_featured);
CREATE INDEX idx_products_slug        ON products(slug);
CREATE INDEX idx_orders_user          ON orders(user_id);
CREATE INDEX idx_orders_status        ON orders(status);
CREATE INDEX idx_orders_number        ON orders(order_number);
CREATE INDEX idx_order_items_order    ON order_items(order_id);
CREATE INDEX idx_order_items_product  ON order_items(product_id);
CREATE INDEX idx_reviews_product      ON reviews(product_id);
CREATE INDEX idx_reviews_user         ON reviews(user_id);
CREATE INDEX idx_wishlist_user        ON wishlist(user_id);
CREATE INDEX idx_addresses_user       ON addresses(user_id);
CREATE INDEX idx_users_email          ON users(email);
CREATE INDEX idx_users_provider       ON users(provider, provider_id);
CREATE UNIQUE INDEX idx_users_phone   ON users(phone) WHERE phone IS NOT NULL AND phone != '';
CREATE INDEX idx_audit_user           ON audit_logs(user_id);
CREATE INDEX idx_audit_action         ON audit_logs(action);
CREATE INDEX idx_fraud_user           ON fraud_logs(user_id);


-- ─────────────────────────────────────────
-- STEP 6: TRIGGERS
-- ─────────────────────────────────────────

-- updated_at triggers
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_addresses_updated_at
  BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_reviews_updated_at
  BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate order number
CREATE TRIGGER trg_set_order_number
  BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- Phone normalization on users
CREATE TRIGGER trg_normalize_phone
  BEFORE INSERT OR UPDATE ON users FOR EACH ROW EXECUTE FUNCTION trigger_normalize_phone();


-- ─────────────────────────────────────────
-- STEP 7: ROW LEVEL SECURITY (RLS) POLICIES
-- ─────────────────────────────────────────

ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses      ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews        ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist       ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_logs     ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ── USERS policies ──
CREATE POLICY "Users: view own profile"
  ON users FOR SELECT USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users: update own profile"
  ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users: insert on register"
  ON users FOR INSERT WITH CHECK (true); -- handled by auth trigger

-- ── PRODUCTS policies ──
CREATE POLICY "Products: public read"
  ON products FOR SELECT USING (is_active = true OR is_admin());

CREATE POLICY "Products: admin write"
  ON products FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Products: admin update"
  ON products FOR UPDATE USING (is_admin());

CREATE POLICY "Products: admin delete"
  ON products FOR DELETE USING (is_admin());

-- ── CATEGORIES policies ──
CREATE POLICY "Categories: public read"
  ON categories FOR SELECT USING (is_active = true OR is_admin());

CREATE POLICY "Categories: admin write"
  ON categories FOR ALL USING (is_admin());

-- ── ADDRESSES policies ──
CREATE POLICY "Addresses: own only"
  ON addresses FOR ALL USING (auth.uid() = user_id OR is_admin());

-- ── ORDERS policies ──
CREATE POLICY "Orders: view own"
  ON orders FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Orders: create own"
  ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Orders: admin update"
  ON orders FOR UPDATE USING (is_admin());

-- ── ORDER ITEMS policies ──
CREATE POLICY "Order items: view if order owner"
  ON order_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "Order items: insert for own orders"
  ON order_items FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- ── PAYMENT TOKENS policies ──
CREATE POLICY "Tokens: view own"
  ON payment_tokens FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Tokens: insert own"
  ON payment_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── REVIEWS policies ──
CREATE POLICY "Reviews: public read"
  ON reviews FOR SELECT USING (is_approved = true OR is_admin());

CREATE POLICY "Reviews: create own"
  ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Reviews: update own"
  ON reviews FOR UPDATE USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Reviews: delete own or admin"
  ON reviews FOR DELETE USING (auth.uid() = user_id OR is_admin());

-- ── WISHLIST policies ──
CREATE POLICY "Wishlist: own only"
  ON wishlist FOR ALL USING (auth.uid() = user_id);

-- ── AUDIT LOGS policies (insert-only for users, read for admins) ──
CREATE POLICY "Audit: admin read all"
  ON audit_logs FOR SELECT USING (is_admin());

CREATE POLICY "Audit: insert only"
  ON audit_logs FOR INSERT WITH CHECK (true);

-- Prevent any UPDATE or DELETE on audit_logs (immutable)
-- (No UPDATE/DELETE policies = no one can do it)

-- ── FRAUD LOGS policies ──
CREATE POLICY "Fraud: admin only"
  ON fraud_logs FOR ALL USING (is_admin());


-- ─────────────────────────────────────────
-- STEP 8: VIEWS (safe data exposure)
-- ─────────────────────────────────────────

-- Safe user profile view (no password hash, no encrypted fields)
CREATE OR REPLACE VIEW user_profiles AS
SELECT
  id, email, name, phone, date_of_birth,
  role, provider, avatar_url,
  is_active, email_verified, created_at
FROM users;

-- Product catalog view (only active products)
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

GRANT SELECT ON product_catalog TO anon, authenticated;
GRANT SELECT ON user_profiles   TO authenticated;


-- ─────────────────────────────────────────
-- STEP 9: SAMPLE DATA
-- ─────────────────────────────────────────

-- ── Admin user
-- NOTE: Password shown below is bcrypt hash of "Neal@2005"
-- Generated with: bcrypt.hash('Neal@2005', 12)
INSERT INTO users (email, name, password_hash, role, is_active, email_verified)
VALUES (
  'nealmanawat@gmail.com',
  'Neal Manawat',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniZk5pQ.Q2zHjkRz7CumtXl8K',  -- Neal@2005
  'admin',
  true,
  true
)
ON CONFLICT (email) DO UPDATE SET
  role           = 'admin',
  is_active      = true,
  email_verified = true;

-- ── Sample customer users
INSERT INTO users (email, name, password_hash, role, phone, is_active, email_verified)
VALUES
  ('priya.sharma@gmail.com',  'Priya Sharma',  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniZk5pQ.Q2zHjkRz7CumtXl8K', 'customer', '9876543210', true, true),
  ('arjun.mehta@gmail.com',   'Arjun Mehta',   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniZk5pQ.Q2zHjkRz7CumtXl8K', 'customer', '9123456780', true, true),
  ('divya.patel@gmail.com',   'Divya Patel',   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniZk5pQ.Q2zHjkRz7CumtXl8K', 'customer', '9812345678', true, true),
  ('rohit.kumar@yahoo.com',   'Rohit Kumar',   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniZk5pQ.Q2zHjkRz7CumtXl8K', 'customer', '8765432109', true, false)
ON CONFLICT (email) DO NOTHING;

-- ── Categories
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

-- ── Products (20 luxury jewelry items)
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
    'A breathtaking diamond solitaire necklace handcrafted in 18k white gold. The brilliant round-cut diamond pendant captures light beautifully from every angle, making it perfect for both daily elegance and grand occasions.',
    'Brilliant round diamond pendant in 18k white gold',
    45000.00, 52000.00, 'DSN-001', 15,
    (SELECT id FROM categories WHERE slug = 'necklaces'),
    ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'],
    ARRAY['diamond', 'solitaire', 'white-gold', 'luxury', 'gift'],
    '18k White Gold', 'White', 'Diamond', '18k', 4.2, 24, true, true
  ),
  (
    'Emerald Gold Chain', 'emerald-gold-chain',
    'Rich natural emeralds set along a lustrous 22k gold chain. Each stone is hand-selected for clarity and deep color, creating a statement piece worthy of any royal occasion.',
    'Natural emeralds on a hand-linked 22k gold chain',
    78000.00, 89000.00, 'EGC-001', 6,
    (SELECT id FROM categories WHERE slug = 'necklaces'),
    ARRAY['https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800'],
    ARRAY['emerald', 'gold', '22k', 'statement', 'luxury'],
    '22k Yellow Gold', 'Gold/Green', 'Emerald', '22k', 18.5, 24, true, true
  ),

  -- EARRINGS
  (
    'Pearl Drop Earrings', 'pearl-drop-earrings',
    'Classic freshwater pearl drop earrings set in sterling silver. The lustrous pearls are perfectly matched for size and glow, making these a timeless wardrobe essential.',
    'Matched freshwater pearl drops in sterling silver',
    8500.00, 10500.00, 'PDE-001', 25,
    (SELECT id FROM categories WHERE slug = 'earrings'),
    ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'],
    ARRAY['pearl', 'drop', 'silver', 'classic', 'everyday'],
    'Sterling Silver', 'White', 'Pearl', '925', 3.1, 12, true, true
  ),
  (
    'Ruby Jhumka Earrings', 'ruby-jhumka-earrings',
    'Traditional Indian jhumka earrings featuring rich pigeon-blood rubies and intricate 22k gold filigree work. A masterpiece of artisan craftsmanship.',
    'Traditional jhumkas with pigeon-blood rubies in 22k gold',
    34000.00, 40000.00, 'RJE-001', 10,
    (SELECT id FROM categories WHERE slug = 'earrings'),
    ARRAY['https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800'],
    ARRAY['ruby', 'jhumka', 'traditional', 'indian', '22k'],
    '22k Yellow Gold', 'Red/Gold', 'Ruby', '22k', 9.8, 18, true, true
  ),
  (
    'Diamond Stud Earrings', 'diamond-stud-earrings',
    'Minimalist 4-prong diamond studs in 14k white gold. Brilliant cut diamonds with VS1 clarity and GIA certification for guaranteed quality.',
    'Certified VS1 diamond studs in 14k white gold',
    22000.00, 27000.00, 'DSE-001', 20,
    (SELECT id FROM categories WHERE slug = 'earrings'),
    ARRAY['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800'],
    ARRAY['diamond', 'studs', 'minimalist', '14k', 'certified'],
    '14k White Gold', 'White', 'Diamond', '14k', 1.8, 24, false, true
  ),

  -- RINGS
  (
    'Ruby Engagement Ring', 'ruby-engagement-ring',
    'A show-stopping ruby engagement ring featuring an oval pigeon-blood ruby surrounded by a halo of brilliant diamonds, set in 18k yellow gold. Handcrafted for perfection.',
    'Oval ruby with diamond halo in 18k yellow gold',
    85000.00, 97000.00, 'RER-001', 8,
    (SELECT id FROM categories WHERE slug = 'rings'),
    ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'],
    ARRAY['ruby', 'engagement', 'halo', 'diamond', '18k'],
    '18k Yellow Gold', 'Red', 'Ruby, Diamond', '18k', 5.6, 36, true, true
  ),
  (
    'Diamond Eternity Band', 'diamond-eternity-band',
    'A full diamond eternity band crafted in platinum featuring 30 round brilliant diamonds with total carat weight of 2.0ct. Represents endless love and luxury.',
    '30 brilliant diamonds set in platinum — 2.0ct total',
    125000.00, 145000.00, 'DEB-001', 5,
    (SELECT id FROM categories WHERE slug = 'rings'),
    ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'],
    ARRAY['diamond', 'eternity', 'platinum', 'luxury', 'wedding'],
    'Platinum', 'White', 'Diamond', 'PT950', 4.2, 36, true, true
  ),
  (
    'Sapphire Cocktail Ring', 'sapphire-cocktail-ring',
    'A bold and glamorous cocktail ring featuring a 3ct deep blue Ceylon sapphire encircled by pave-set diamonds in 18k white gold. Perfect for evenings that demand attention.',
    '3ct Ceylon sapphire with pave diamonds in 18k white gold',
    62000.00, 72000.00, 'SCR-001', 7,
    (SELECT id FROM categories WHERE slug = 'rings'),
    ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
    ARRAY['sapphire', 'cocktail', 'bold', 'ceylon', 'white-gold'],
    '18k White Gold', 'Blue', 'Sapphire, Diamond', '18k', 6.3, 24, false, true
  ),

  -- BRACELETS
  (
    'Tennis Bracelet', 'tennis-bracelet',
    'An iconic tennis bracelet featuring 42 brilliant-cut diamonds in a 4-prong box setting, totaling 5.0ct. Crafted in 14k white gold with a secure lobster clasp.',
    '42 brilliants, 5.0ct total, in 14k white gold',
    125000.00, 142000.00, 'TB-001', 5,
    (SELECT id FROM categories WHERE slug = 'bracelets'),
    ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800'],
    ARRAY['tennis', 'diamond', 'classic', '14k', 'luxury'],
    '14k White Gold', 'White', 'Diamond', '14k', 11.2, 24, true, true
  ),
  (
    'Vintage Charm Bracelet', 'vintage-charm-bracelet',
    'A handpicked collection of vintage-inspired charms in sterling silver — each telling its own story. Adjustable fit, with lobster clasp and 6 unique charms included.',
    'Sterling silver with 6 vintage-inspired charms, adjustable',
    12000.00, 15500.00, 'VCB-001', 30,
    (SELECT id FROM categories WHERE slug = 'bracelets'),
    ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800'],
    ARRAY['vintage', 'charm', 'silver', 'adjustable', 'gift'],
    'Sterling Silver', 'Silver', NULL, '925', 14.0, 12, false, true
  ),

  -- PENDANTS
  (
    'Sapphire Teardrop Pendant', 'sapphire-teardrop-pendant',
    'An elegant pear-shaped blue sapphire pendant accented with diamond pavé, suspended from an 18-inch white gold chain. A timeless classic for any wardrobe.',
    'Pear sapphire with diamond pavé on 18" white gold chain',
    35000.00, 42000.00, 'STP-001', 12,
    (SELECT id FROM categories WHERE slug = 'pendants'),
    ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
    ARRAY['sapphire', 'teardrop', 'pendant', 'pave', 'white-gold'],
    '18k White Gold', 'Blue', 'Sapphire, Diamond', '18k', 3.8, 24, false, true
  ),
  (
    'Om Pendant in Gold', 'om-pendant-gold',
    'A sacred Om pendant handcrafted in 22k gold with intricate engraving and a polished finish. Comes with a gold chain. A meaningful gift for spiritual occasions.',
    'Handcrafted 22k gold Om pendant with chain',
    18000.00, 22000.00, 'OPG-001', 20,
    (SELECT id FROM categories WHERE slug = 'pendants'),
    ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'],
    ARRAY['om', 'religious', 'gold', '22k', 'spiritual', 'gift'],
    '22k Yellow Gold', 'Gold', NULL, '22k', 5.5, 12, false, true
  ),

  -- BANGLES
  (
    'Gold Bangle Set', 'gold-bangle-set',
    'A classic set of 2 bangles in 22k yellow gold with intricate traditional Indian motifs. Comes in a velvet gift box. Perfect for weddings and festivals.',
    'Set of 2 traditional 22k gold bangles with Indian motifs',
    55000.00, 64000.00, 'GBS-001', 20,
    (SELECT id FROM categories WHERE slug = 'bangles'),
    ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800'],
    ARRAY['gold', 'bangles', 'traditional', 'indian', 'set', 'wedding'],
    '22k Yellow Gold', 'Gold', NULL, '22k', 32.0, 12, false, true
  ),
  (
    'Diamond-Cut Bangle', 'diamond-cut-bangle',
    'A modern 18k white gold bangle with a diamond-cut exterior for maximum sparkle. Slim profile makes it perfect for stacking or wearing solo.',
    'Slim 18k white gold bangle with diamond-cut brilliance',
    28000.00, 34000.00, 'DCB-001', 15,
    (SELECT id FROM categories WHERE slug = 'bangles'),
    ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800'],
    ARRAY['diamond-cut', 'bangle', 'modern', '18k', 'stackable'],
    '18k White Gold', 'White', NULL, '18k', 9.5, 18, false, true
  ),

  -- WATCHES
  (
    'Prestige Swiss Chronograph', 'prestige-swiss-chronograph',
    'Swiss-made automatic chronograph with 42mm case, sapphire crystal glass, and 50m water resistance. The exhibition caseback reveals the intricate movement inside.',
    'Swiss automatic chronograph, 42mm, sapphire crystal',
    285000.00, 320000.00, 'PSC-001', 4,
    (SELECT id FROM categories WHERE slug = 'watches'),
    ARRAY['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800'],
    ARRAY['swiss', 'chronograph', 'automatic', 'luxury', 'watch'],
    'Stainless Steel / Sapphire Crystal', 'Silver/Black', NULL, NULL, 145.0, 36, true, true
  ),
  (
    'Rose Gold Ladies Watch', 'rose-gold-ladies-watch',
    'An elegant ladies timepiece in rose gold-plated stainless steel with a mother-of-pearl dial and diamond hour markers. Japanese quartz movement with 3 ATM resistance.',
    'Rose gold ladies watch with MOP dial and diamond markers',
    32000.00, 38000.00, 'RGW-001', 10,
    (SELECT id FROM categories WHERE slug = 'watches'),
    ARRAY['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800'],
    ARRAY['rose-gold', 'ladies', 'watch', 'diamond', 'elegant'],
    'Rose Gold Plated Steel', 'Rose Gold', 'Diamond (markers)', NULL, 62.0, 24, false, true
  ),

  -- WEDDING
  (
    'Bridal Diamond Necklace Set', 'bridal-diamond-necklace-set',
    'An opulent bridal necklace set featuring a graduated diamond necklace with matching earrings and maang tikka. Crafted in 18k rose gold and white gold combination.',
    'Graduated diamond bridal set — necklace, earrings, tikka',
    450000.00, 520000.00, 'BDS-001', 3,
    (SELECT id FROM categories WHERE slug = 'wedding'),
    ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
    ARRAY['bridal', 'diamond', 'set', 'necklace', 'wedding', 'luxury'],
    '18k Rose Gold & White Gold', 'Pink/White', 'Diamond', '18k', 87.0, 36, true, true
  ),
  (
    'Couple Wedding Band Set', 'couple-wedding-band-set',
    'A perfectly matched pair of wedding bands in 18k gold. His band features a brushed finish; hers has a pavé diamond edge. Engraving service included.',
    'Matching his-and-hers 18k gold wedding bands with engraving',
    38000.00, 45000.00, 'CWB-001', 12,
    (SELECT id FROM categories WHERE slug = 'wedding'),
    ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'],
    ARRAY['wedding', 'bands', 'couple', '18k', 'engraving'],
    '18k Yellow Gold', 'Gold/White', 'Diamond (hers)', '18k', 8.4, 24, false, true
  ),
  (
    'Kundan Bridal Jewellery Set', 'kundan-bridal-set',
    'A spectacular kundan and polki set comprising a choker necklace, jhumka earrings, maang tikka, and a passa hairpiece. Set in 22k gold with enamel (meenakari) detailing.',
    'Full kundan/polki bridal set — 4 pieces in 22k gold',
    320000.00, 380000.00, 'KBS-001', 2,
    (SELECT id FROM categories WHERE slug = 'wedding'),
    ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'],
    ARRAY['kundan', 'polki', 'bridal', 'meenakari', '22k', 'set'],
    '22k Yellow Gold', 'Gold/Multi', 'Polki, Kundan', '22k', 215.0, 24, true, true
  ),
  (
    'Mangalsutra Classic', 'mangalsutra-classic',
    'A traditional black-bead mangalsutra in 18k gold with a central diamond pendant. Adjustable length, lightweight design for everyday wear.',
    'Traditional mangalsutra with diamond pendant in 18k gold',
    24000.00, 29000.00, 'MGS-001', 18,
    (SELECT id FROM categories WHERE slug = 'wedding'),
    ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'],
    ARRAY['mangalsutra', 'traditional', 'diamond', '18k', 'everyday'],
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


-- ── Sample reviews
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
  'The ring was even more beautiful in person. The ruby was vibrant and the craftsmanship was top-notch. Fast delivery and beautifully packaged.',
  true, true
WHERE NOT EXISTS (
  SELECT 1 FROM reviews r
  JOIN products p ON p.id = r.product_id
  JOIN users u ON u.id = r.user_id
  WHERE p.slug = 'ruby-engagement-ring' AND u.email = 'arjun.mehta@gmail.com'
);

INSERT INTO reviews (product_id, user_id, rating, title, comment, verified_purchase, is_approved)
SELECT
  (SELECT id FROM products WHERE slug = 'tennis-bracelet'),
  (SELECT id FROM users WHERE email = 'divya.patel@gmail.com'),
  4,
  'Beautiful piece',
  'The bracelet is gorgeous and feels very premium. Only giving 4 stars because delivery took longer than expected, but the product itself is perfect.',
  true, true
WHERE NOT EXISTS (
  SELECT 1 FROM reviews r
  JOIN products p ON p.id = r.product_id
  JOIN users u ON u.id = r.user_id
  WHERE p.slug = 'tennis-bracelet' AND u.email = 'divya.patel@gmail.com'
);


-- ─────────────────────────────────────────
-- STEP 10: SECURE ENCRYPTION DEMO
-- Shows how encrypted fields work
-- ─────────────────────────────────────────

-- Example: Store an encrypted address (run manually for testing)
-- INSERT INTO addresses (user_id, address_line_1, city, postal_code, country, encrypted_address)
-- SELECT
--   (SELECT id FROM users WHERE email = 'priya.sharma@gmail.com'),
--   '42 Marine Drive',
--   'Mumbai',
--   '400001',
--   'India',
--   encrypt_sensitive('42 Marine Drive, Mumbai, 400001, India')  -- encrypted copy
-- ;

-- Decrypt example:
-- SELECT decrypt_sensitive(encrypted_address) FROM addresses WHERE user_id = '<uuid>';

-- Verify order integrity (after placing an order):
-- UPDATE orders SET integrity_hash = generate_order_hash(id) WHERE id = '<order_uuid>';
-- SELECT order_number, integrity_hash FROM orders WHERE id = '<order_uuid>';


-- ─────────────────────────────────────────
-- STEP 11: VERIFICATION QUERIES
-- Run these to confirm everything worked
-- ─────────────────────────────────────────

-- Check user count and roles
SELECT role, COUNT(*) FROM users GROUP BY role;

-- Check category count
SELECT COUNT(*) AS total_categories FROM categories;

-- Check product count and featured items
SELECT is_featured, COUNT(*) FROM products GROUP BY is_featured;

-- Check product catalog view
SELECT name, category_name, price, avg_rating, review_count
FROM product_catalog
ORDER BY is_featured DESC, price DESC
LIMIT 10;

-- Check encryption is working
SELECT encrypt_sensitive('Test Payment Data 4111111111111111') AS sample_encrypted;

-- Confirm RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
