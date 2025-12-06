-- Create test user accounts for development
-- This migration creates test accounts that can be used for testing the application

-- Note: This script is for development/testing purposes only
-- In production, users should be created through the signup flow

-- Test Student Account
-- Email: test@engmastery.com
-- Password: test123
-- This should be created using the signup API endpoint or Supabase Dashboard

-- Test Teacher Account
-- Email: teacher@engmastery.com
-- Password: test123
-- This should be created using the signup API endpoint or Supabase Dashboard

-- The actual user creation is handled by Supabase Auth
-- This file is just documentation for test accounts
-- To create these accounts, use the signup endpoint or Supabase Dashboard:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" > "Create new user"
-- 3. Enter email and password
-- 4. Make sure to check "Auto Confirm User"

-- After creating the auth user, the profile will be created automatically via the signup endpoint
