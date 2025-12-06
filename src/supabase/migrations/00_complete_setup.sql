-- ============================================================================
-- EngMastery Complete Database Setup
-- ============================================================================
-- File này bao gồm tất cả migrations cần thiết để setup database hoàn chỉnh
-- Chạy file này trong Supabase Dashboard > SQL Editor
-- ============================================================================

-- ============================================================================
-- PART 1: Create helper functions
-- ============================================================================

-- Helper function for updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Helper function to check if user is teacher (SECURITY DEFINER to avoid recursion)
CREATE OR REPLACE FUNCTION is_teacher(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = user_uuid AND role = 'teacher'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get user grade (SECURITY DEFINER to avoid recursion)
CREATE OR REPLACE FUNCTION get_user_grade(user_uuid UUID)
RETURNS BIGINT AS $$
DECLARE
  user_grade BIGINT;
BEGIN
  SELECT grade INTO user_grade
  FROM public.user_profiles
  WHERE user_id = user_uuid;
  RETURN user_grade;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PART 2: Create user_profiles table
-- ============================================================================

-- Create user_profiles table for storing user information
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  username TEXT UNIQUE,
  email TEXT NOT NULL,
  grade BIGINT NOT NULL CHECK (grade >= 6 AND grade <= 9),
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_grade ON public.user_profiles(grade);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Teachers can view student profiles" ON public.user_profiles;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Teachers can view all student profiles (using helper function to avoid recursion)
CREATE POLICY "Teachers can view student profiles" ON public.user_profiles
  FOR SELECT
  USING (
    is_teacher(auth.uid())
  );

-- Add trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PART 3: Create assignments table
-- ============================================================================

-- Create assignments table for teacher homework management
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  lesson_id BIGINT NOT NULL,
  due_date DATE NOT NULL,
  assigned_to_grade BIGINT NOT NULL CHECK (assigned_to_grade >= 6 AND assigned_to_grade <= 9),
  assigned_to_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_assignments_teacher_id ON public.assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON public.assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_grade ON public.assignments(assigned_to_grade);
CREATE INDEX IF NOT EXISTS idx_assignments_user_id ON public.assignments(assigned_to_user_id);

-- Enable Row Level Security
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Teachers can view own assignments" ON public.assignments;
DROP POLICY IF EXISTS "Teachers can create assignments" ON public.assignments;
DROP POLICY IF EXISTS "Teachers can update own assignments" ON public.assignments;
DROP POLICY IF EXISTS "Teachers can delete own assignments" ON public.assignments;
DROP POLICY IF EXISTS "Students can view assignments for their grade" ON public.assignments;

-- Policy: Teachers can view their own assignments
CREATE POLICY "Teachers can view own assignments" ON public.assignments
  FOR SELECT
  USING (auth.uid() = teacher_id);

-- Policy: Teachers can create assignments
CREATE POLICY "Teachers can create assignments" ON public.assignments
  FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

-- Policy: Teachers can update their own assignments
CREATE POLICY "Teachers can update own assignments" ON public.assignments
  FOR UPDATE
  USING (auth.uid() = teacher_id);

-- Policy: Teachers can delete their own assignments
CREATE POLICY "Teachers can delete own assignments" ON public.assignments
  FOR DELETE
  USING (auth.uid() = teacher_id);

-- Policy: Students can view assignments for their grade or assigned to them specifically
CREATE POLICY "Students can view assignments for their grade" ON public.assignments
  FOR SELECT
  USING (
    assigned_to_grade = get_user_grade(auth.uid())
    OR assigned_to_user_id = auth.uid()
  );

-- Add trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_assignments_updated_at ON public.assignments;
CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PART 4: Verification queries
-- ============================================================================

-- Uncomment these to verify the setup after running the migration:

-- Check if tables exist
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Check user_profiles structure
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_schema = 'public' AND table_name = 'user_profiles' ORDER BY ordinal_position;

-- Check assignments structure
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_schema = 'public' AND table_name = 'assignments' ORDER BY ordinal_position;

-- Check RLS policies
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;

-- Check functions
-- SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' ORDER BY routine_name;

-- ============================================================================
-- Setup Complete! 🎉
-- ============================================================================
-- Next steps:
-- 1. Create test users via signup or Supabase Dashboard
-- 2. Update role to 'teacher' for teacher accounts:
--    UPDATE user_profiles SET role = 'teacher' WHERE email = 'teacher@engmastery.com';
-- 3. Login to the app and test the features
-- 4. Teachers can now search for students and create assignments
-- ============================================================================
