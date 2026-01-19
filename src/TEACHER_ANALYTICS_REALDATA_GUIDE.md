# Hướng dẫn sử dụng dữ liệu thật cho Teacher Analytics Dashboard

## 📊 Tổng quan

TeacherAnalyticsDashboard hiện đã được nâng cấp để **tự động sử dụng dữ liệu thật từ database**. Nó sẽ:

1. ✅ Tải danh sách học sinh từ `user_profiles` table
2. ✅ Lấy analytics data từ `learning_analytics` table  
3. ✅ Tính toán thống kê lớp học real-time
4. ✅ Hiển thị học sinh cần hỗ trợ và top performers
5. ✅ Fallback sang demo mode nếu không có dữ liệu hoặc có lỗi

---

## 🔧 Setup để sử dụng dữ liệu thật

### Bước 1: Chạy migrations trong Supabase

Đảm bảo các migrations sau đã được chạy:

```sql
-- 1. User profiles table
/supabase/migrations/create_user_profiles_table.sql

-- 2. Learning analytics tables
/supabase/migrations/02_learning_analytics.sql
```

**Cách chạy:**
1. Vào Supabase Dashboard → SQL Editor
2. Copy nội dung từng file migration
3. Paste và Execute

### Bước 2: Tạo học sinh (students)

Có 2 cách để tạo học sinh:

#### Cách 1: Đăng ký qua UI (KHUYẾN NGHỊ)
1. Logout khỏi tài khoản teacher hiện tại
2. Vào trang AuthPage
3. Đăng ký tài khoản mới với:
   - Role: **student**
   - Grade: 6, 7, 8, hoặc 9
   - Email: bất kỳ (ví dụ: `student1@engmastery.com`)
   - Password: bất kỳ
4. Lặp lại để tạo nhiều học sinh
5. Login lại với tài khoản teacher

#### Cách 2: Tạo trực tiếp trong Supabase Dashboard
1. Vào Supabase Dashboard → Authentication → Users
2. Click **Add user** → Create new user
3. Điền email, password, Auto Confirm: **YES**
4. Lấy UUID của user vừa tạo
5. Vào Table Editor → `user_profiles` → Insert row:
   ```
   user_id: <UUID vừa lấy>
   name: Nguyễn Văn A
   username: nguyenvana  
   email: student1@engmastery.com
   grade: 6
   role: student
   ```

### Bước 3: Tạo learning data cho học sinh

Để có dữ liệu analytics, học sinh cần:

1. **Login** vào tài khoản student
2. **Chọn bài học** (LessonList → LessonDetail)
3. **Làm bài tập** trong tab "Exercises"
4. Kết quả tự động lưu vào:
   - `exercise_results` - Chi tiết bài làm
   - `learning_progress` - Tiến độ lesson
   - `learning_analytics` - Tự động cập nhật qua SQL function

Sau khi học sinh làm bài, Teacher Dashboard sẽ hiển thị dữ liệu thật!

---

## 📱 Cách kiểm tra dữ liệu có hiển thị không

### 1. Login với teacher account
```
Email: teacher@engmastery.com (hoặc bất kỳ teacher account)
Role: teacher
```

### 2. Vào Teacher Dashboard
- Click vào menu hamburger (top-right)
- Chọn "Quản lý bài tập" (role: teacher)

### 3. Click "Phân tích lớp học"
Bạn sẽ thấy:
- **Badge "Chế độ Demo"** → Nghĩa là KHÔNG có students trong DB
- **Toast notification** với thông tin:
  - "Đã tải dữ liệu X học sinh" → CÓ dữ liệu thật
  - "Chưa có học sinh trong hệ thống" → Cần tạo students
  - "Lỗi khi tải..." → Có lỗi RLS hoặc migration

### 4. Kiểm tra Debug Info (nếu có data thật)
- Click vào **"Debug Info"** dropdown (góc phải header)
- Sẽ show:
  ```
  Successfully loaded data for X students (Y active)
  ```

---

## 🔍 Troubleshooting

### Vấn đề 1: Hiện "Chế độ Demo" mặc dù đã có students

**Nguyên nhân:**
- RLS policy chặn teacher không xem được students
- Migration chưa được chạy đầy đủ

**Giải pháp:**
```sql
-- Kiểm tra RLS policy cho user_profiles
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

-- Phải có policy: "Teachers can view student profiles"
-- Nếu không có, chạy lại migration create_user_profiles_table.sql
```

### Vấn đề 2: Không có dữ liệu analytics cho students

**Nguyên nhân:**
- Students chưa làm bài tập nào
- Bảng `learning_analytics` chưa được tạo

**Giải pháp:**
1. Kiểm tra table exists:
   ```sql
   SELECT * FROM learning_analytics LIMIT 1;
   ```
2. Nếu không có, chạy migration `02_learning_analytics.sql`
3. Để tạo data, login vào student account và làm bài tập

### Vấn đề 3: Error "relation does not exist"

**Nguyên nhân:**
- Bảng chưa được tạo trong Supabase

**Giải pháp:**
```sql
-- Kiểm tra các bảng cần thiết
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'learning_analytics', 'exercise_results', 'learning_progress');

-- Phải có đủ 4 bảng trên
-- Nếu thiếu, chạy lại migrations
```

### Vấn đề 4: Teacher không thấy students của lớp khác

**Đây KHÔNG phải bug!**
- By design, teacher chỉ thấy students của grade mình dạy (mặc định)
- Click **"Tất cả"** trong Grade Filter để xem all grades
- Hoặc chọn grade cụ thể (6, 7, 8, 9)

---

## 🎯 Làm thế nào để test với nhiều students?

### Tạo 10 students nhanh chóng:

1. **Script tạo users** (chạy trong Supabase SQL Editor):
```sql
-- Tạo test students (cần create auth users trước trong Dashboard)
-- Sau đó insert vào user_profiles với user_id tương ứng

-- Example: Giả sử đã tạo 10 auth users và có UUIDs
INSERT INTO public.user_profiles (user_id, name, username, email, grade, role) VALUES
  ('<UUID-1>', 'Nguyễn Văn An', 'nguyenvanan', 'an@test.com', 6, 'student'),
  ('<UUID-2>', 'Trần Thị Bình', 'tranbinhthi', 'binh@test.com', 6, 'student'),
  ('<UUID-3>', 'Lê Hoàng Cường', 'lehoangcuong', 'cuong@test.com', 7, 'student'),
  -- ... thêm 7 students nữa
ON CONFLICT (user_id) DO NOTHING;
```

2. **Tạo fake analytics data** (optional, để test nhanh):
```sql
-- Tạo fake analytics cho mỗi student
INSERT INTO public.learning_analytics (
  user_id, 
  total_lessons_completed, 
  total_exercises_completed,
  average_score,
  vocabulary_mastery,
  listening_mastery,
  speaking_mastery,
  reading_mastery,
  writing_mastery,
  current_streak_days
)
SELECT 
  user_id,
  floor(random() * 12 + 1)::int, -- 1-12 lessons
  floor(random() * 36 + 3)::int, -- 3-36 exercises
  floor(random() * 40 + 60)::int, -- 60-100 score
  floor(random() * 30 + 70)::int, -- skill masteries
  floor(random() * 30 + 70)::int,
  floor(random() * 30 + 70)::int,
  floor(random() * 30 + 70)::int,
  floor(random() * 30 + 70)::int,
  floor(random() * 15)::int -- 0-15 streak
FROM user_profiles
WHERE role = 'student'
ON CONFLICT (user_id) DO UPDATE SET
  total_lessons_completed = EXCLUDED.total_lessons_completed,
  average_score = EXCLUDED.average_score;
```

3. **Set last_activity_date** để students hiện là "active":
```sql
UPDATE learning_analytics
SET last_activity_date = NOW() - (random() * interval '6 days')
WHERE user_id IN (SELECT user_id FROM user_profiles WHERE role = 'student');
```

---

## ✅ Xác nhận thành công

Khi mọi thứ hoạt động đúng, bạn sẽ thấy:

### ✅ Toast Notifications
```
✓ Đã tải dữ liệu 10 học sinh
  5 học sinh hoạt động trong 7 ngày qua
```

### ✅ Dashboard hiển thị
- **Tổng số học sinh**: Số thật từ DB (không phải 30 của demo)
- **Hoạt động**: Số students có last_activity trong 7 ngày
- **Điểm TB**: Tính từ average_score của students
- **Top performers**: Students có score >= 85%
- **Students needing help**: Students có score < 60% hoặc không active

### ✅ Debug Info
```
Successfully loaded data for 10 students (5 active)
```

### ✅ KHÔNG có badge "Chế độ Demo"

---

## 🚀 Production Checklist

Trước khi deploy production:

- [ ] Đã chạy tất cả migrations
- [ ] RLS policies hoạt động đúng
- [ ] Teachers có thể xem students (kiểm tra policy)
- [ ] Students tạo được analytics data khi làm bài
- [ ] Teacher Dashboard hiển thị dữ liệu thật
- [ ] Grade filter hoạt động
- [ ] Toast notifications hiển thị đúng
- [ ] Fallback demo mode hoạt động khi không có data
- [ ] Console không có errors

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra console logs (F12 → Console)
2. Xem debug info trong dashboard
3. Kiểm tra Supabase logs
4. Verify RLS policies trong SQL Editor

**Common SQL commands for debugging:**
```sql
-- Check students count
SELECT COUNT(*) FROM user_profiles WHERE role = 'student';

-- Check analytics count
SELECT COUNT(*) FROM learning_analytics;

-- Check teacher can see students (run as teacher)
SELECT * FROM user_profiles WHERE role = 'student' LIMIT 5;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename IN ('user_profiles', 'learning_analytics');
```

Chúc bạn thành công! 🎉
