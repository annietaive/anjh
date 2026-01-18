-- ============================================================================
-- 🔥 FIX: Infinite Recursion - Copy & Paste vào Supabase SQL Editor
-- ============================================================================
-- Nếu gặp lỗi: "infinite recursion detected in policy for relation user_profiles"
-- Chạy toàn bộ SQL này trong Supabase Dashboard > SQL Editor > New Query
-- ============================================================================

-- Step 1: Tạo helper functions với SECURITY DEFINER (bypass RLS)
CREATE OR REPLACE FUNCTION is_teacher(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = user_uuid AND role = 'teacher'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- Step 2: Drop các policies có vấn đề
DROP POLICY IF EXISTS "Teachers can view student profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Students can view assignments for their grade" ON public.assignments;

-- Step 3: Recreate policies với helper functions
CREATE POLICY "Teachers can view student profiles" ON public.user_profiles
  FOR SELECT
  USING (is_teacher(auth.uid()));

CREATE POLICY "Students can view assignments for their grade" ON public.assignments
  FOR SELECT
  USING (
    assigned_to_grade = get_user_grade(auth.uid())
    OR assigned_to_user_id = auth.uid()
  );

-- ============================================================================
-- ✅ Done! Reload trang và thử lại
-- ============================================================================
