-- Clean all user data and set up unique constraints
-- Run this directly in Supabase SQL Editor

-- Step 1: Delete all existing user data to start fresh
DELETE FROM wishlist;
DELETE FROM reviews WHERE user_id IS NOT NULL;
DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id IS NOT NULL);
DELETE FROM orders WHERE user_id IS NOT NULL;
DELETE FROM addresses;
DELETE FROM users;

-- Step 2: Add new columns for OAuth support (if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='provider') THEN
    ALTER TABLE users ADD COLUMN provider VARCHAR(50) DEFAULT 'credentials';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='provider_id') THEN
    ALTER TABLE users ADD COLUMN provider_id VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='avatar_url') THEN
    ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500);
  END IF;
END $$;

-- Step 3: Drop existing constraints and indexes if they exist
DROP INDEX IF EXISTS idx_users_phone_unique;
DROP INDEX IF EXISTS idx_users_provider;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE users DROP CONSTRAINT IF EXISTS check_phone_format;
ALTER TABLE users DROP CONSTRAINT IF EXISTS check_email_format;

-- Step 4: Recreate email unique constraint
ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);

-- Step 5: Create unique index for phone (excluding NULL/empty values)
CREATE UNIQUE INDEX idx_users_phone_unique ON users(phone) 
WHERE phone IS NOT NULL AND phone != '';

-- Step 6: Create index for provider lookups
CREATE INDEX idx_users_provider ON users(provider, provider_id);

-- Step 7: Add format validation constraints
ALTER TABLE users ADD CONSTRAINT check_phone_format 
CHECK (phone IS NULL OR phone ~ '^[6-9][0-9]{9}$');

ALTER TABLE users ADD CONSTRAINT check_email_format 
CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Step 8: Function to normalize phone numbers
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

-- Step 9: Function for OAuth user handling
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
    -- Update existing user with OAuth info
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

-- Step 10: Trigger function for phone normalization
CREATE OR REPLACE FUNCTION trigger_normalize_phone() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.phone IS NOT NULL THEN
    NEW.phone := normalize_phone_number(NEW.phone);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 11: Create trigger for phone normalization
DROP TRIGGER IF EXISTS trigger_normalize_phone_on_users ON users;
CREATE TRIGGER trigger_normalize_phone_on_users
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION trigger_normalize_phone();

-- Step 12: Create safe user profile view
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

-- Step 13: Add helpful comments
COMMENT ON CONSTRAINT users_email_key ON users IS 'Ensures email uniqueness across all users';
COMMENT ON INDEX idx_users_phone_unique IS 'Ensures phone number uniqueness (excluding NULL values)';
COMMENT ON FUNCTION normalize_phone_number IS 'Normalizes and validates Indian phone numbers';
COMMENT ON FUNCTION handle_oauth_user IS 'Handles OAuth user creation and updates';

-- Confirmation message
SELECT 'Database cleanup and unique constraints setup completed successfully!' as status;
