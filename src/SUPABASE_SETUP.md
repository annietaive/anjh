# Hướng dẫn cấu hình Supabase cho EngMastery

## Bảng cần thiết

Để sử dụng đầy đủ các tính năng của EngMastery, bạn cần tạo các bảng sau trong Supabase:

### 1. Bảng `user_profiles` (Đã có)
Lưu thông tin người dùng

### 2. Bảng `lesson_progress` (Đã có)
Lưu tiến độ học tập

### 3. Bảng `exercise_results` (Đã có)
Lưu kết quả bài tập

### 4. Bảng `assignments` (Mới - cho tính năng Quản lý bài tập)

## Cách tạo bảng `assignments`

### Phương pháp 1: Sử dụng SQL Editor trong Supabase Dashboard

1. Mở Supabase Dashboard
2. Vào **SQL Editor**
3. Copy toàn bộ nội dung từ file `/supabase/migrations/create_assignments_table.sql`
4. Paste vào SQL Editor và nhấn **Run**

### Phương pháp 2: Sử dụng Table Editor (Thủ công)

1. Mở Supabase Dashboard → **Table Editor**
2. Nhấn **New table**
3. Tên bảng: `assignments`
4. Thêm các cột sau:

| Tên cột | Kiểu dữ liệu | Mặc định | Ràng buộc |
|---------|--------------|----------|-----------|
| id | uuid | gen_random_uuid() | Primary Key |
| teacher_id | uuid | - | Foreign Key → auth.users(id) |
| title | text | - | NOT NULL |
| description | text | - | - |
| lesson_id | int8 | - | NOT NULL |
| due_date | date | - | NOT NULL |
| assigned_to_grade | int8 | - | NOT NULL, CHECK (6-9) |
| status | text | 'active' | NOT NULL |
| created_at | timestamptz | now() | - |
| updated_at | timestamptz | now() | - |

5. Bật **Row Level Security (RLS)**
6. Thêm các policies:
   - Teachers can view own assignments
   - Teachers can create assignments
   - Teachers can update own assignments
   - Teachers can delete own assignments
   - Students can view assignments for their grade

## Kiểm tra

Sau khi tạo bảng, thử:
1. Vào trang **Quản lý bài tập** trong EngMastery
2. Tạo một bài tập thử nghiệm
3. Kiểm tra bảng trong Supabase để xác nhận dữ liệu đã được lưu

## Lưu ý

- Tất cả các bảng đều có RLS (Row Level Security) được bật để bảo mật dữ liệu
- Mỗi giáo viên chỉ có thể xem và quản lý bài tập của mình
- Học sinh có thể xem bài tập được giao cho khối lớp của mình

## Hỗ trợ

Nếu gặp vấn đề khi setup, vui lòng liên hệ:
- Email: truongan111112@gmail.com
- Điện thoại: 0855894205
