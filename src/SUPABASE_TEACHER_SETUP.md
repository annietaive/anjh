# Hướng dẫn Setup Supabase cho tính năng Giáo viên

## Tổng quan
Hướng dẫn này giúp bạn thiết lập Supabase để giáo viên có thể tìm kiếm và quản lý học sinh trong hệ thống EngMastery.

## Bước 1: Kết nối Supabase Project

1. Đảm bảo bạn đã có Supabase project
2. Lấy thông tin kết nối:
   - Project URL: `https://[project-id].supabase.co`
   - Anon/Public Key: Lấy từ Supabase Dashboard > Settings > API

3. Cập nhật file `/utils/supabase/info.tsx` với thông tin của bạn

## Bước 2: Chạy Database Migrations

Truy cập Supabase Dashboard > SQL Editor và chạy các migrations theo thứ tự:

### 2.1. Tạo bảng user_profiles

Chạy migration: `/supabase/migrations/create_user_profiles_table.sql`

```sql
-- File này tạo:
-- - Bảng user_profiles để lưu thông tin người dùng
-- - Indexes để tăng tốc độ truy vấn
-- - Row Level Security (RLS) policies
-- - Policy cho phép giáo viên xem tất cả học sinh
```

**Kiểm tra:** Sau khi chạy, bảng `user_profiles` sẽ xuất hiện trong Database > Tables

### 2.2. Tạo bảng assignments

Chạy migration: `/supabase/migrations/create_assignments_table.sql`

```sql
-- File này tạo:
-- - Bảng assignments để lưu bài tập giáo viên giao
-- - Quan hệ với user_profiles
-- - RLS policies
```

**Kiểm tra:** Bảng `assignments` sẽ xuất hiện trong Database > Tables

## Bước 3: Tạo Test Accounts

### Cách 1: Sử dụng Signup Flow trong App (Khuyến nghị)

1. Mở app EngMastery
2. Vào trang Đăng ký
3. Tạo tài khoản giáo viên:
   - Họ và tên: `Giáo viên Test`
   - Email: `teacher@engmastery.com`
   - Mật khẩu: `teacher123`
   - Lớp: `6` (hoặc bất kỳ)
   - Username: `teacher_test`

4. Tạo một vài tài khoản học sinh:
   - Học sinh 1: `student1@engmastery.com` / `student123`
   - Học sinh 2: `student2@engmastery.com` / `student123`
   - v.v...

### Cách 2: Tạo trong Supabase Dashboard

1. Vào Supabase Dashboard > Authentication > Users
2. Click "Add user" > "Create new user"
3. Điền thông tin:
   - Email: `student1@engmastery.com`
   - Password: `student123`
   - ✅ Auto Confirm User (quan trọng!)
4. Click "Create user"
5. Lấy User ID (UUID) từ bảng Authentication
6. Vào Database > Table Editor > user_profiles
7. Insert record mới:
   ```
   user_id: [UUID từ bước 5]
   name: Nguyễn Văn An
   username: nguyenvanan
   email: student1@engmastery.com
   grade: 6
   role: student
   ```

## Bước 4: Kiểm tra RLS Policies

Đảm bảo policies cho phép giáo viên xem học sinh:

```sql
-- Kiểm tra policy "Teachers can view student profiles"
SELECT * FROM pg_policies 
WHERE tablename = 'user_profiles';
```

Nếu chưa có, tạo policy:

```sql
CREATE POLICY "Teachers can view student profiles" ON public.user_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_id = auth.uid() AND role = 'teacher'
    )
  );
```

## Bước 5: Test tính năng

### 5.1. Test tìm kiếm học sinh

1. Đăng nhập với tài khoản giáo viên
2. Vào Teacher Dashboard
3. Click "Danh sách học sinh"
4. Xem danh sách tất cả học sinh
5. Thử tìm kiếm theo tên, username hoặc email
6. Thử lọc theo lớp (6, 7, 8, 9)

### 5.2. Test giao bài tập cho học sinh cụ thể

1. Vào Teacher Dashboard
2. Click "Tạo bài tập mới"
3. Sử dụng "Tìm kiếm học sinh" để chọn học sinh
4. Điền thông tin bài tập
5. Click "Giao bài tập"
6. Kiểm tra bài tập đã được giao trong database

## Troubleshooting

### Lỗi "permission denied for table user_profiles"

**Nguyên nhân:** RLS policies chưa được setup đúng

**Giải pháp:**
1. Kiểm tra user hiện tại có role = 'teacher' không
2. Chạy lại migrations để tạo policies
3. Hoặc tạm thời disable RLS để test:
   ```sql
   ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
   ```
   ⚠️ Chỉ dùng trong development!

### Không tìm thấy học sinh nào

**Nguyên nhân:** Chưa có học sinh trong database

**Giải pháp:**
1. Tạo test students theo Bước 3
2. Hoặc app sẽ hiển thị dữ liệu demo để test UI

### UserSearch trả về dữ liệu demo

**Nguyên nhân:** 
- Supabase chưa được kết nối
- Bảng user_profiles chưa được tạo
- RLS policies chặn truy vấn

**Giải pháp:**
1. Kiểm tra kết nối Supabase trong `/utils/supabase/info.tsx`
2. Chạy lại migrations
3. Kiểm tra RLS policies

## Demo Mode vs Production Mode

### Demo Mode
- Tự động bật khi:
  - Supabase chưa được kết nối
  - Bảng user_profiles chưa tồn tại
  - Không có học sinh trong database
- Hiển thị 12 học sinh mẫu
- Không lưu dữ liệu vào database

### Production Mode
- Bật khi:
  - Supabase đã được kết nối đúng
  - Migrations đã chạy thành công
  - Có ít nhất 1 học sinh trong database
- Hiển thị dữ liệu thật từ Supabase
- Lưu tất cả thay đổi vào database

## Các tính năng đã tích hợp

### ✅ Hoàn thành
- [x] Kết nối Supabase thật
- [x] Tìm kiếm học sinh theo tên, username, email
- [x] Lọc học sinh theo lớp (6-9)
- [x] Xem danh sách tất cả học sinh
- [x] Giao bài tập cho học sinh cụ thể
- [x] Giao bài tập cho cả lớp
- [x] Demo mode với dữ liệu mẫu
- [x] RLS policies bảo mật

### 🔄 Sắp tới
- [ ] Xem tiến độ học tập của từng học sinh
- [ ] Xuất báo cáo thống kê
- [ ] Gửi thông báo cho học sinh
- [ ] Chat trực tiếp với học sinh

## Database Schema

### Table: user_profiles
```
id: UUID (Primary Key)
user_id: UUID (Foreign Key -> auth.users)
name: TEXT
username: TEXT (Unique)
email: TEXT
grade: INTEGER (6-9)
role: TEXT ('student' | 'teacher')
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### Table: assignments
```
id: UUID (Primary Key)
teacher_id: UUID (Foreign Key -> user_profiles.user_id)
assigned_to_user_id: UUID (Optional, Foreign Key -> user_profiles.user_id)
assigned_to_grade: INTEGER
title: TEXT
description: TEXT
lesson_id: INTEGER
due_date: DATE
status: TEXT ('active' | 'completed')
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

## SQL Queries hữu ích

### Xem tất cả học sinh
```sql
SELECT * FROM user_profiles 
WHERE role = 'student' 
ORDER BY created_at DESC;
```

### Đếm học sinh theo lớp
```sql
SELECT grade, COUNT(*) as student_count
FROM user_profiles
WHERE role = 'student'
GROUP BY grade
ORDER BY grade;
```

### Xem bài tập của giáo viên
```sql
SELECT a.*, up.name as teacher_name
FROM assignments a
JOIN user_profiles up ON a.teacher_id = up.user_id
ORDER BY a.created_at DESC;
```

### Xem bài tập được giao cho học sinh cụ thể
```sql
SELECT a.*, up.name as student_name
FROM assignments a
LEFT JOIN user_profiles up ON a.assigned_to_user_id = up.user_id
WHERE a.assigned_to_user_id IS NOT NULL
ORDER BY a.due_date;
```

## Liên hệ và Hỗ trợ

Nếu gặp vấn đề khi setup, hãy kiểm tra:
1. Console browser (F12) để xem lỗi JavaScript
2. Supabase Dashboard > Logs để xem lỗi database
3. Network tab để xem API calls

Chúc bạn setup thành công! 🎉
