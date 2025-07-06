-- Add phone number uniqueness constraint and improve user data handling
-- To be run on remote Supabase database

-- Add unique constraint for phone number (excluding NULL values)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone_unique ON users(phone) WHERE phone IS NOT NULL AND phone != '';

-- Add provider and provider_id columns for OAuth users
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'credentials';
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);

-- Create index for provider lookups
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider, provider_id);

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
  -- Check if user exists with this email
  SELECT id INTO user_id FROM users WHERE email = p_email;
  
  IF user_id IS NULL THEN
    -- Create new user
    INSERT INTO users (email, name, provider, provider_id, avatar_url, email_verified)
    VALUES (p_email, p_name, p_provider, p_provider_id, p_avatar_url, TRUE)
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
