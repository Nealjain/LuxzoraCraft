-- Create admin user for nealmanawat@gmail.com
-- Run this in your Supabase SQL Editor

-- First, create the user in auth.users (this simulates a registration)
INSERT INTO auth.users (
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  'nealmanawat@gmail.com',
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Neal Manawat"}',
  false,
  'authenticated'
)
ON CONFLICT (email) DO NOTHING;

-- Now create the user in your users table and make them admin
INSERT INTO users (
  id,
  name,
  email,
  password_hash,
  is_admin,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'nealmanawat@gmail.com'),
  'Neal Manawat',
  'nealmanawat@gmail.com',
  '$2a$12$dummy.hash.for.admin.user', -- Dummy password hash (use Google login)
  true, -- Make admin
  now(),
  now()
)
ON CONFLICT (email) DO UPDATE SET is_admin = true;

-- Verify the user was created and is admin
SELECT id, name, email, is_admin, created_at FROM users WHERE email = 'nealmanawat@gmail.com';
