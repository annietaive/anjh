# Database Seeder - Hướng Dẫn Sử Dụng

## Tổng quan

Database Seeder là công cụ tự động thêm 60 học sinh thực tế vào database với dữ liệu phân tích đầy đủ cho 4 kỹ năng: **Nghe, Nói, Đọc, Viết**.

## Truy cập Admin Panel

### Yêu cầu quyền truy cập
Chỉ có giáo viên hoặc admin mới có thể truy cập Admin Panel:
- **Role**: `teacher`
- **Email**: Chứa từ "admin" hoặc "teacher"

### Cách truy cập
1. Đăng nhập với tài khoản teacher/admin
2. Click vào icon User (góc trên bên phải)
3. Chọn **"Admin Panel"** trong menu dropdown (hiển thị màu tím)

## Dữ liệu được tạo

### 1. Học sinh (60 students)
- **Phân bố**: 15 học sinh mỗi khối (6, 7, 8, 9)
- **Thông tin**: Tên, email, username, grade
- **Email format**: `tenstudent@engmastery.edu.vn`
- **Password**: `Student123!` (cho tất cả học sinh)

### 2. Bảng database

#### `user_profiles`
- Thông tin cơ bản: name, username, email, grade, role
- 60 bản ghi

#### `learning_progress`
- Tiến độ học tập cho từng unit
- Tracking các skill đã hoàn thành: vocabulary, listening, speaking, reading, writing
- Progress percentage, time spent
- ~400-500 bản ghi (tùy vào tiến độ random của mỗi học sinh)

#### `exercise_results`
- Kết quả bài tập chi tiết cho 4 kỹ năng
- **Listening**: 2-5 bài tập mỗi unit
- **Speaking**: 2-5 bài tập mỗi unit
- **Reading**: 2-5 bài tập mỗi unit
- **Writing**: 2-5 bài tập mỗi unit
- Score, correct answers, time spent, answers (JSONB)
- ~8,000-10,000 bản ghi

#### `daily_activities`
- Hoạt động học tập hàng ngày
- Tracking streak, lessons completed, exercises completed
- 5-30 ngày hoạt động cho mỗi học sinh
- ~1,000-1,500 bản ghi

#### `learning_analytics`
- Phân tích tổng hợp cho mỗi học sinh
- **Skill mastery** (0-100):
  - `listening_mastery`
  - `speaking_mastery`
  - `reading_mastery`
  - `writing_mastery`
  - `vocabulary_mastery`
- Average score, total lessons, total exercises
- Current streak, longest streak
- 60 bản ghi

## Cách sử dụng

### Bước 1: Kết nối Supabase
Đảm bảo bạn đã cấu hình Supabase credentials trong `/utils/supabase/info.tsx`:
```typescript
export const projectId = 'your-project-id';
export const publicAnonKey = 'your-anon-key';
```

### Bước 2: Chạy Seeder
1. Truy cập Admin Panel
2. Xem lại thông tin sẽ được tạo
3. Click nút **"Thêm 60 Học Sinh Vào Database"**
4. Xác nhận trong dialog popup
5. Đợi 2-3 phút để quá trình hoàn tất

### Bước 3: Theo dõi tiến trình
- Console sẽ hiển thị log chi tiết:
  ```
  📝 Processing 1/60: Nguyễn Văn An (Grade 6)
  ✅ Created auth user: xxx-xxx-xxx
  ✅ Created user profile
  ✅ Created 8 progress records
  ✅ Created 96 exercise results (all 4 skills)
  ✅ Created 15 daily activities
  ✅ Created learning analytics
  📊 Skills - L:72 S:65 R:78 W:58
  ✅ SUCCESS (1/60)
  ```

### Bước 4: Kiểm tra kết quả
- Vào Teacher Dashboard để xem danh sách học sinh
- Kiểm tra analytics của từng học sinh
- Verify dữ liệu trong Supabase Dashboard

## Dữ liệu thực tế

### Tên học sinh
60 tên học sinh Việt Nam đa dạng, không trùng lặp:
- **Grade 6**: Nguyễn Văn An, Trần Thị Bình, Lê Hoàng Cường...
- **Grade 7**: Nguyễn Thị Tâm, Trần Văn Tuấn, Lê Thị Uyên...
- **Grade 8**: Nguyễn Văn Nghĩa, Trần Thị Oanh, Lê Văn Phúc...
- **Grade 9**: Nguyễn Thị Hằng, Trần Văn Hải, Lê Thị Kiều...

### Điểm số và năng lực
- **Phân bố normal distribution**: Điểm số được generate theo phân phối chuẩn
- **Biến động tự nhiên**: Mỗi học sinh có năng lực khác nhau ở các kỹ năng
- **Thực tế**: Có học sinh giỏi nghe nhưng yếu viết, hoặc ngược lại

### Tiến độ học tập
- **Random progress**: 20-90% units đã hoàn thành
- **Realistic timing**: Thời gian học phân bố trong 30 ngày gần đây
- **Activity patterns**: Số ngày học từ 5-30 ngày

## Xử lý lỗi

### Lỗi thường gặp

#### 1. "Failed to fetch" / Connection error
- **Nguyên nhân**: Supabase credentials chưa đúng
- **Giải pháp**: Kiểm tra lại `projectId` và `publicAnonKey`

#### 2. "User already exists"
- **Nguyên nhân**: Đã chạy seeder trước đó
- **Giải pháp**: Script sẽ tự động bỏ qua user đã tồn tại

#### 3. Rate limiting
- **Nguyên nhân**: Quá nhiều requests đến Supabase
- **Giải pháp**: Script có delay 500ms giữa các học sinh để tránh rate limit

#### 4. Duplicate key constraint
- **Nguyên nhân**: Dữ liệu trùng lặp trong daily_activities
- **Giải pháp**: Script tự động bỏ qua lỗi duplicate

## Performance

### Thời gian thực hiện
- **60 students**: ~2-3 phút
- **Average per student**: 2-3 giây
- **Total records created**: ~10,000+ bản ghi

### Rate limiting
- Delay 500ms giữa mỗi học sinh
- Batch insert 50 records/lần cho exercise_results
- Tránh overload Supabase API

## Kiểm tra dữ liệu sau khi seed

### 1. Supabase Dashboard
```sql
-- Kiểm tra số lượng học sinh
SELECT COUNT(*) FROM user_profiles WHERE role = 'student';

-- Kiểm tra exercise results theo skill
SELECT exercise_type, COUNT(*), AVG(score)
FROM exercise_results
GROUP BY exercise_type;

-- Kiểm tra learning analytics
SELECT 
  AVG(listening_mastery) as avg_listening,
  AVG(speaking_mastery) as avg_speaking,
  AVG(reading_mastery) as avg_reading,
  AVG(writing_mastery) as avg_writing
FROM learning_analytics;
```

### 2. Teacher Dashboard
- Tìm kiếm học sinh theo tên
- Xem chi tiết analytics từng học sinh
- Verify skills breakdown

### 3. Analytics Dashboard
- Kiểm tra overall statistics
- So sánh performance giữa các khối
- Xem trend và patterns

## Lưu ý quan trọng

### ⚠️ Cảnh báo
- **Không rerun nhiều lần**: Script sẽ tạo duplicate data nếu email đã thay đổi
- **Production data**: Chỉ nên chạy trên development/staging environment
- **Backup**: Nên backup database trước khi chạy seeder

### ✅ Best practices
- Chạy seeder trên môi trường test trước
- Monitor console logs để catch errors sớm
- Verify dữ liệu trong Supabase sau khi seed
- Document việc seed data trong team

## Troubleshooting

### Script không chạy
1. Mở Console (F12) để xem error logs
2. Kiểm tra network tab để verify API calls
3. Test Supabase connection trước bằng SupabaseConnectionTest component

### Dữ liệu không đúng
1. Xem lại generated data trong console logs
2. Query trực tiếp từ Supabase để verify
3. Sử dụng TeacherAnalyticsDashboard để kiểm tra

### Performance chậm
1. Giảm số lượng học sinh trong script
2. Tăng delay giữa các requests
3. Chạy script vào giờ off-peak

## Code Reference

### Main Script
- **File**: `/utils/seedRealStudents.ts`
- **Function**: `seedRealStudents()`

### UI Component
- **File**: `/components/DatabaseSeeder.tsx`
- **Component**: `<DatabaseSeeder />`

### Admin Panel
- **File**: `/components/AdminPanel.tsx`
- **Component**: `<AdminPanel />`

## Support

Nếu gặp vấn đề, kiểm tra:
1. Console logs trong browser
2. Supabase Dashboard > Logs
3. Database schema trong `/docs/DATABASE_SCHEMA.sql`
4. RLS policies trong Supabase

---

**Last Updated**: January 2025
**Version**: 1.0.0
