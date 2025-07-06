-- Add phone number uniqueness constraint and improve user data handling
-- Migration: 0007_user_constraints.sql

-- Add unique constraint for phone number (excluding NULL values)
CREATE UNIQUE INDEX idx_users_phone_unique ON users(phone) WHERE phone IS NOT NULL AND phone != '';

-- Add provider and provider_id columns for OAuth users
ALTER TABLE users ADD COLUMN provider VARCHAR(50) DEFAULT 'credentials';
ALTER TABLE users ADD COLUMN provider_id VARCHAR(255);
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500);

-- Create index for provider lookups
CREATE INDEX idx_users_provider ON users(provider, provider_id);

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

-- Function to validate user data before insert/update
CREATE OR REPLACE FUNCTION validate_user_data() RETURNS TRIGGER AS $$
BEGIN
  -- Validate email format
  IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Validate phone number format (Indian format)
  IF NEW.phone IS NOT NULL AND NEW.phone != '' THEN
    -- Remove all non-digits
    NEW.phone := regexp_replace(NEW.phone, '[^0-9]', '', 'g');
    
    -- Check if it's a valid Indian mobile number
    IF NEW.phone !~ '^[6-9][0-9]{9}$' AND NEW.phone !~ '^91[6-9][0-9]{9}$' THEN
      RAISE EXCEPTION 'Invalid phone number format. Please use Indian mobile number format.';
    END IF;
    
    -- Normalize to 10 digits (remove country code if present)
    IF length(NEW.phone) = 12 AND substring(NEW.phone, 1, 2) = '91' THEN
      NEW.phone := substring(NEW.phone, 3);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user data validation
CREATE TRIGGER validate_user_data_trigger
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION validate_user_data();

-- Create a view for user profile with safe data
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
