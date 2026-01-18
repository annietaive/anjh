-- Seed test student profiles for development and testing
-- This migration creates test student profiles that teachers can search for

-- Note: This assumes auth users have already been created via the signup flow or Supabase Dashboard
-- If you need to create test users, use the signup endpoint or create them in Supabase Dashboard first

-- Insert test student profiles
-- These will only work if the corresponding auth.users already exist
-- You can create auth users in Supabase Dashboard > Authentication > Users

-- Example test students (you need to replace user_id with actual auth.users IDs from your project)
-- To get user IDs, go to Supabase Dashboard > Authentication > Users and copy the UUID

-- Sample insert (commented out - you need to replace with real user_ids):
/*
INSERT INTO public.user_profiles (user_id, name, username, email, grade, role)
VALUES 
  ('your-auth-user-id-1', 'Nguyễn Văn An', 'nguyenvanan', 'an@engmastery.com', 6, 'student'),
  ('your-auth-user-id-2', 'Trần Thị Bình', 'tranbinhthi', 'binh@engmastery.com', 6, 'student'),
  ('your-auth-user-id-3', 'Lê Hoàng Cường', 'lehoangcuong', 'cuong@engmastery.com', 7, 'student'),
  ('your-auth-user-id-4', 'Phạm Thu Dung', 'phamthudung', 'dung@engmastery.com', 7, 'student'),
  ('your-auth-user-id-5', 'Hoàng Minh Đức', 'hoangminhduc', 'duc@engmastery.com', 8, 'student'),
  ('your-auth-user-id-6', 'Đỗ Thị Hà', 'dothiha', 'ha@engmastery.com', 8, 'student'),
  ('your-auth-user-id-7', 'Vũ Quang Huy', 'vuquanghuy', 'huy@engmastery.com', 9, 'student'),
  ('your-auth-user-id-8', 'Bùi Lan Hương', 'builanhuong', 'huong@engmastery.com', 9, 'student'),
  ('your-auth-user-id-9', 'Ngô Tiến Khoa', 'ngotienkhoa', 'khoa@engmastery.com', 6, 'student'),
  ('your-auth-user-id-10', 'Đinh Thị Linh', 'dinhthilinh', 'linh@engmastery.com', 7, 'student')
ON CONFLICT (user_id) DO NOTHING;
*/

-- Instructions:
-- 1. Create auth users in Supabase Dashboard > Authentication > Users
--    - Email: student1@engmastery.com, Password: test123, Auto Confirm: YES
--    - Repeat for multiple test students
-- 2. Copy the user IDs (UUID) from the Authentication table
-- 3. Update the INSERT statement above with the real user IDs
-- 4. Uncomment and run this migration
-- 
-- OR use the signup flow in the app to create test students - this is easier!
