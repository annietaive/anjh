# Tính năng Quản lý Học sinh cho Giáo viên

## 🎯 Tổng quan

Hệ thống EngMastery đã được tích hợp đầy đủ với Supabase để giáo viên có thể:
- ✅ Tìm kiếm và xem danh sách tất cả học sinh
- ✅ Lọc học sinh theo lớp (6, 7, 8, 9)
- ✅ Tìm kiếm theo tên, username, email
- ✅ Giao bài tập cho học sinh cụ thể hoặc cả lớp
- ✅ Theo dõi thống kê số lượng học sinh

## 🚀 Các tính năng đã hoàn thành

### 1. **Teacher Dashboard** (`/components/TeacherDashboard.tsx`)
- Quản lý bài tập (assignments)
- Tạo bài tập mới với khả năng chọn học sinh cụ thể
- Xem danh sách bài tập đã giao
- Nút "Danh sách học sinh" để truy cập StudentManagement

### 2. **Student Management** (`/components/StudentManagement.tsx`)
- Hiển thị danh sách tất cả học sinh
- Thống kê số lượng học sinh theo lớp
- Tìm kiếm real-time
- Lọc theo lớp
- Card view đẹp mắt với thông tin chi tiết
- Kiểm tra kết nối Supabase

### 3. **User Search** (`/components/UserSearch.tsx`)
- Component tìm kiếm học sinh có thể tái sử dụng
- Tìm kiếm theo username hoặc tên
- Hỗ trợ chọn học sinh để giao bài tập
- Auto fallback về demo data nếu Supabase chưa setup

### 4. **Supabase Connection Test** (`/components/SupabaseConnectionTest.tsx`)
- Kiểm tra kết nối Supabase
- Hiển thị trạng thái các bảng (user_profiles, assignments)
- Đếm số lượng records trong mỗi bảng
- Hướng dẫn chạy migrations nếu cần

## 📊 Database Schema

### Bảng `user_profiles`
```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  name TEXT NOT NULL,
  username TEXT UNIQUE,
  email TEXT NOT NULL,
  grade INTEGER CHECK (grade >= 6 AND grade <= 9),
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Bảng `assignments`
```sql
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES user_profiles(user_id),
  assigned_to_user_id UUID REFERENCES user_profiles(user_id),
  assigned_to_grade INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  lesson_id INTEGER,
  due_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔐 Row Level Security (RLS)

### User Profiles Policies

1. **Users can view own profile**
   ```sql
   CREATE POLICY "Users can view own profile" ON user_profiles
     FOR SELECT USING (auth.uid() = user_id);
   ```

2. **Teachers can view student profiles**
   ```sql
   CREATE POLICY "Teachers can view student profiles" ON user_profiles
     FOR SELECT USING (
       EXISTS (
         SELECT 1 FROM user_profiles
         WHERE user_id = auth.uid() AND role = 'teacher'
       )
     );
   ```

3. **Users can update own profile**
   ```sql
   CREATE POLICY "Users can update own profile" ON user_profiles
     FOR UPDATE USING (auth.uid() = user_id);
   ```

## 🎨 UI/UX Features

### Demo Mode
- Tự động bật khi Supabase chưa được setup hoặc không có dữ liệu
- Hiển thị 12 học sinh mẫu
- Banner cảnh báo và hướng dẫn setup
- Không lưu dữ liệu vào database

### Production Mode
- Kết nối Supabase thật
- Tải dữ liệu từ database
- Lưu tất cả thay đổi
- Toast notifications cho mọi action

### Statistics Cards
- Tổng số học sinh
- Số học sinh lớp 6, 7, 8, 9
- Màu sắc phân biệt theo lớp:
  - Lớp 6: Blue
  - Lớp 7: Green
  - Lớp 8: Orange
  - Lớp 9: Pink

## 📝 Hướng dẫn sử dụng

### Dành cho Giáo viên

1. **Đăng nhập với tài khoản giáo viên**
2. **Vào Teacher Dashboard** từ menu
3. **Click "Danh sách học sinh"** để xem tất cả học sinh
4. **Sử dụng tìm kiếm và lọc**:
   - Nhập tên/username/email vào ô tìm kiếm
   - Chọn lớp từ dropdown
5. **Giao bài tập cho học sinh**:
   - Click "Tạo bài tập mới"
   - Tìm kiếm học sinh (hoặc để trống để giao cho cả lớp)
   - Điền thông tin bài tập
   - Click "Giao bài tập"

### Dành cho Developer

#### Setup Supabase

1. **Kết nối Supabase**
   ```typescript
   // Đã được tích hợp sẵn trong app
   // Chỉ cần cung cấp thông tin trong /utils/supabase/info.tsx
   ```

2. **Chạy migrations**
   - Vào Supabase Dashboard > SQL Editor
   - Chạy `/supabase/migrations/create_user_profiles_table.sql`
   - Chạy `/supabase/migrations/create_assignments_table.sql`

3. **Tạo test users**
   - Sử dụng signup flow trong app (khuyến nghị)
   - Hoặc tạo trong Supabase Dashboard > Authentication

4. **Verify setup**
   - Vào Student Management
   - Click "Kiểm tra kết nối"
   - Xem trạng thái các bảng

## 🔧 Troubleshooting

### Lỗi "permission denied for table user_profiles"

**Nguyên nhân:** RLS policies chưa được tạo hoặc user không có role teacher

**Giải pháp:**
1. Kiểm tra RLS policies trong Supabase Dashboard
2. Chạy lại migrations
3. Đảm bảo user có `role = 'teacher'` trong bảng user_profiles

### Không tìm thấy học sinh nào

**Nguyên nhân:** Chưa có học sinh trong database

**Giải pháp:**
1. Tạo test students bằng signup flow
2. Hoặc insert thủ công vào bảng user_profiles
3. App sẽ tự động fallback về demo mode để test UI

### UserSearch trả về dữ liệu demo

**Nguyên nhân:**
- Supabase chưa được kết nối
- Bảng user_profiles chưa tồn tại
- RLS policies chặn query

**Giải pháp:**
1. Kiểm tra kết nối trong SupabaseConnectionTest
2. Chạy migrations
3. Verify RLS policies

## 📚 Files liên quan

### Components
- `/components/TeacherDashboard.tsx` - Dashboard chính cho giáo viên
- `/components/StudentManagement.tsx` - Quản lý danh sách học sinh
- `/components/UserSearch.tsx` - Tìm kiếm học sinh (reusable)
- `/components/SupabaseConnectionTest.tsx` - Test kết nối

### Migrations
- `/supabase/migrations/create_user_profiles_table.sql` - Tạo bảng user_profiles + RLS
- `/supabase/migrations/create_assignments_table.sql` - Tạo bảng assignments
- `/supabase/migrations/seed_test_students.sql` - Script seed test data

### Documentation
- `/SUPABASE_TEACHER_SETUP.md` - Hướng dẫn setup chi tiết
- `/TEACHER_STUDENT_MANAGEMENT.md` - File này
- `/SETUP_TEST_ACCOUNTS.md` - Hướng dẫn tạo test accounts

## 🎯 Roadmap

### Đã hoàn thành ✅
- [x] Kết nối Supabase thật
- [x] Tìm kiếm học sinh
- [x] Lọc theo lớp
- [x] Xem danh sách học sinh
- [x] Giao bài tập cho học sinh cụ thể
- [x] Giao bài tập cho cả lớp
- [x] Demo mode với dữ liệu mẫu
- [x] RLS policies
- [x] Connection test utility

### Sắp tới 🔄
- [ ] Xem tiến độ học tập của từng học sinh
- [ ] Xuất báo cáo Excel/PDF
- [ ] Gửi thông báo push cho học sinh
- [ ] Chat trực tiếp với học sinh
- [ ] Chấm điểm bài tập
- [ ] Thống kê chi tiết theo thời gian

## 💡 Tips

### Cho Giáo viên
1. **Sử dụng tìm kiếm nhanh**: Gõ vài ký tự đầu của tên hoặc username
2. **Lọc theo lớp**: Chọn lớp để chỉ xem học sinh của lớp đó
3. **Giao bài linh hoạt**: Có thể giao cho cả lớp hoặc chọn học sinh cụ thể
4. **Kiểm tra kết nối**: Nếu có vấn đề, click "Kiểm tra kết nối" để debug

### Cho Developer
1. **Luôn chạy migrations trước**: Đảm bảo database đã có đủ bảng
2. **Test với demo mode**: Không cần Supabase để test UI
3. **Kiểm tra RLS**: Nếu query thất bại, kiểm tra policies
4. **Sử dụng SupabaseConnectionTest**: Để debug nhanh các vấn đề về database

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra Console browser (F12)
2. Xem Supabase Dashboard > Logs
3. Sử dụng SupabaseConnectionTest component
4. Đọc hướng dẫn trong `/SUPABASE_TEACHER_SETUP.md`

---

**Phát triển bởi:** EngMastery Team
**Ngày cập nhật:** December 5, 2025
**Version:** 2.0.0
