-- ============================================================================
-- FIX: Infinite Recursion in RLS Policies
-- ============================================================================
-- Lỗi: Policies query user_profiles tạo vòng lặp vô hạn
-- Giải pháp: Sử dụng SECURITY DEFINER functions
-- ============================================================================

-- Create helper function to check if user is teacher (SECURITY DEFINER to avoid recursion)
CREATE OR REPLACE FUNCTION is_teacher(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = user_uuid AND role = 'teacher'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to get user grade (SECURITY DEFINER to avoid recursion)
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

-- Drop and recreate the problematic policies
DROP POLICY IF EXISTS "Teachers can view student profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Students can view assignments for their grade" ON public.assignments;

CREATE POLICY "Teachers can view student profiles" ON public.user_profiles
  FOR SELECT
  USING (
    is_teacher(auth.uid())
  );

CREATE POLICY "Students can view assignments for their grade" ON public.assignments
  FOR SELECT
  USING (
    assigned_to_grade = get_user_grade(auth.uid())
    OR assigned_to_user_id = auth.uid()
  );

-- ============================================================================
-- Done! Policies giờ sử dụng functions với SECURITY DEFINER
-- ============================================================================
-- Functions này sẽ chạy với quyền của owner (bypass RLS) để tránh infinite loop
-- ============================================================================
