-- Clean user data and enforce unique constraints
-- Migration: 0008_clean_and_enforce_unique.sql

-- First, delete all existing user data to start fresh
DELETE FROM wishlist;
DELETE FROM reviews;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM addresses;
DELETE FROM users;

-- Reset any sequences if they exist
-- This ensures clean IDs when we start adding users again

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_users_phone_unique;
DROP INDEX IF EXISTS idx_users_provider;

-- Add new columns if they don't exist (using IF NOT EXISTS for safety)
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'credentials';
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);

-- Ensure email column has UNIQUE constraint (it should already exist)
-- We'll recreate it to be sure
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);

-- Add unique constraint for phone number (excluding NULL/empty values)
-- This creates a partial unique index that only applies to non-null, non-empty phone numbers
CREATE UNIQUE INDEX idx_users_phone_unique ON users(phone) 
WHERE phone IS NOT NULL AND phone != '';

-- Create index for provider lookups
CREATE INDEX idx_users_provider ON users(provider, provider_id);

-- Add constraint to ensure phone number format (if not null)
ALTER TABLE users ADD CONSTRAINT check_phone_format 
CHECK (phone IS NULL OR phone ~ '^[6-9][0-9]{9}$');

-- Add constraint to ensure email format
ALTER TABLE users ADD CONSTRAINT check_email_format 
CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Function to validate and normalize phone number
CREATE OR REPLACE FUNCTION normalize_phone_number(input_phone TEXT) 
RETURNS TEXT AS $$
BEGIN
  IF input_phone IS NULL OR input_phone = '' THEN
    RETURN NULL;
  END IF;
  
  -- Remove all non-digits
  input_phone := regexp_replace(input_phone, '[^0-9]', '', 'g');
  
  -- Remove country code if present
  IF length(input_phone) = 12 AND substring(input_phone, 1, 2) = '91' THEN
    input_phone := substring(input_phone, 3);
  END IF;
  
  -- Validate Indian mobile number format
  IF input_phone !~ '^[6-9][0-9]{9}$' THEN
    RAISE EXCEPTION 'Invalid phone number format. Must be a valid Indian mobile number.';
  END IF;
  
  RETURN input_phone;
END;
$$ LANGUAGE plpgsql;

-- Function to handle user upsert for OAuth providers
CREATE OR REPLACE FUNCTION handle_oauth_user(
  p_email VARCHAR(255),
  p_name VARCHAR(255),
  p_provider VARCHAR(50),
  p_provider_id VARCHAR(255),
  p_avatar_url VARCHAR(500) DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Validate email format
  IF p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Check if user exists with this email
  SELECT id INTO user_id FROM users WHERE email = p_email;
  
  IF user_id IS NULL THEN
    -- Create new user
    INSERT INTO users (
      email, 
      name, 
      provider, 
      provider_id, 
      avatar_url, 
      email_verified
    )
    VALUES (
      p_email, 
      p_name, 
      p_provider, 
      p_provider_id, 
      p_avatar_url, 
      TRUE
    )
    RETURNING id INTO user_id;
  ELSE
    -- Update existing user with OAuth info if not already set
    UPDATE users 
    SET 
      name = COALESCE(name, p_name),
      provider = CASE WHEN provider = 'credentials' THEN p_provider ELSE provider END,
      provider_id = COALESCE(provider_id, p_provider_id),
      avatar_url = COALESCE(avatar_url, p_avatar_url),
      email_verified = TRUE,
      updated_at = NOW()
    WHERE id = user_id;
  END IF;
  
  RETURN user_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to normalize phone numbers before insert/update
CREATE OR REPLACE FUNCTION trigger_normalize_phone() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.phone IS NOT NULL THEN
    NEW.phone := normalize_phone_number(NEW.phone);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for phone normalization
DROP TRIGGER IF EXISTS trigger_normalize_phone_on_users ON users;
CREATE TRIGGER trigger_normalize_phone_on_users
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION trigger_normalize_phone();

-- Create a view for safe user profile data (excluding sensitive info)
CREATE OR REPLACE VIEW user_profiles AS
SELECT 
  id,
  email,
  name,
  phone,
  date_of_birth,
  is_admin,
  email_verified,
  provider,
  avatar_url,
  created_at,
  updated_at
FROM users;

-- Grant necessary permissions
GRANT SELECT ON user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;

-- Add comments for documentation
COMMENT ON CONSTRAINT users_email_key ON users IS 'Ensures email uniqueness across all users';
COMMENT ON INDEX idx_users_phone_unique IS 'Ensures phone number uniqueness (excluding NULL values)';
COMMENT ON FUNCTION normalize_phone_number IS 'Normalizes and validates Indian phone numbers';
COMMENT ON FUNCTION handle_oauth_user IS 'Handles OAuth user creation and updates';
