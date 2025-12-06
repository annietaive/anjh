# 🚀 Quick Start: Kết nối Supabase

## TL;DR - Setup nhanh trong 5 phút

### Bước 1: Mở Supabase SQL Editor
1. Vào https://supabase.com/dashboard
2. Chọn project của bạn
3. Click **SQL Editor** (sidebar trái)

### Bước 2: Copy & Run Migration

**QUAN TRỌNG:** Nếu bạn đã chạy migration trước đó và gặp lỗi "infinite recursion", chạy fix này trước:

```sql
-- FIX: Infinite Recursion - Tạo helper functions
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

-- FIX: Recreate policies với helper functions
DROP POLICY IF EXISTS "Teachers can view student profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Students can view assignments for their grade" ON public.assignments;

CREATE POLICY "Teachers can view student profiles" ON public.user_profiles
  FOR SELECT USING (is_teacher(auth.uid()));

CREATE POLICY "Students can view assignments for their grade" ON public.assignments
  FOR SELECT USING (
    assigned_to_grade = get_user_grade(auth.uid())
    OR assigned_to_user_id = auth.uid()
  );
```

**Nếu setup lần đầu**, click vào file `/supabase/migrations/00_complete_setup.sql` trong project, copy toàn bộ nội dung và paste vào SQL Editor, sau đó click **Run**.

Hoặc copy SQL này:

```sql
-- Create helper function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create user_profiles table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_grade ON public.user_profiles(grade);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Teachers can view student profiles" ON public.user_profiles;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers can view student profiles" ON public.user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND role = 'teacher'
    )
  );

-- Add trigger
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create assignments table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assignments_teacher_id ON public.assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON public.assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_grade ON public.assignments(assigned_to_grade);
CREATE INDEX IF NOT EXISTS idx_assignments_user_id ON public.assignments(assigned_to_user_id);

-- Enable RLS
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Teachers can view own assignments" ON public.assignments;
DROP POLICY IF EXISTS "Teachers can create assignments" ON public.assignments;
DROP POLICY IF EXISTS "Teachers can update own assignments" ON public.assignments;
DROP POLICY IF EXISTS "Teachers can delete own assignments" ON public.assignments;
DROP POLICY IF EXISTS "Students can view assignments for their grade" ON public.assignments;

-- Create policies
CREATE POLICY "Teachers can view own assignments" ON public.assignments
  FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can create assignments" ON public.assignments
  FOR INSERT WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update own assignments" ON public.assignments
  FOR UPDATE USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete own assignments" ON public.assignments
  FOR DELETE USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view assignments for their grade" ON public.assignments
  FOR SELECT USING (
    assigned_to_grade = (
      SELECT grade FROM public.user_profiles WHERE user_id = auth.uid()
    )
    OR assigned_to_user_id = auth.uid()
  );

-- Add trigger
DROP TRIGGER IF EXISTS update_assignments_updated_at ON public.assignments;
CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Bước 3: Tạo Test Users

**Cách 1: Trong App (Khuyến nghị)**
1. Vào trang Đăng ký trong app
2. Tạo tài khoản giáo viên: `teacher@engmastery.com` / `teacher123`
3. Tạo vài tài khoản học sinh: `student1@engmastery.com` / `student123`

**Cách 2: Trong Supabase Dashboard**
1. Vào **Authentication** > **Users** > **Add user**
2. Nhập email/password
3. ✅ Bật **Auto Confirm User**
4. Click **Create user**

**Quan trọng:** Sau khi tạo user giáo viên, đổi role:
```sql
UPDATE user_profiles SET role = 'teacher' WHERE email = 'teacher@engmastery.com';
```

### Bước 4: Verify

1. Đăng nhập với tài khoản giáo viên
2. Vào **Teacher Dashboard**
3. Click **"Danh sách học sinh"**
4. Click **"Kiểm tra kết nối"** - Tất cả phải màu xanh ✅
5. Thử tìm kiếm học sinh

## ✅ Done!

Bây giờ bạn có thể:
- ✅ Xem danh sách tất cả học sinh
- ✅ Tìm kiếm và lọc học sinh
- ✅ Giao bài tập cho học sinh cụ thể hoặc cả lớp
- ✅ Theo dõi tiến độ (sắp tới)

## 🐛 Troubleshooting

### "permission denied for table user_profiles"
→ Đảm bảo user có role = 'teacher' trong bảng user_profiles

### "relation user_profiles does not exist"
→ Chạy lại migration SQL ở Bước 2

### Không tìm thấy học sinh nào
→ Tạo test users theo Bước 3

### Vẫn hiển thị "Chế độ Demo"
→ Click nút "Làm mới" hoặc reload trang

## 📖 Chi tiết

Xem file `/SUPABASE_TEACHER_SETUP.md` để biết thêm chi tiết và troubleshooting nâng cao.

---

**Need help?** Kiểm tra Console (F12) và Supabase Dashboard > Logs