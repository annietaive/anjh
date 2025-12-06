# Hướng dẫn Migration Database cho Learning Analytics

## Tổng quan
Hệ thống learning analytics sử dụng các bảng sau để theo dõi và phân tích tiến độ học tập:
- `learning_progress` - Tiến độ học từng bài
- `exercise_results` - Kết quả bài tập chi tiết
- `learning_analytics` - Thống kê tổng hợp
- `daily_activities` - Hoạt động hàng ngày (cho streak tracking)

## Các bước Migration

### 1. Chạy Migration Script
Trong Supabase Dashboard, vào SQL Editor và chạy file:
```
/supabase/migrations/02_learning_analytics.sql
```

Script này sẽ tạo:
- ✅ 4 bảng chính với đầy đủ indexes
- ✅ Row Level Security policies
- ✅ Helper functions và stored procedures
- ✅ Triggers cho auto-update timestamps

### 2. Kiểm tra Migration thành công

Chạy query sau để kiểm tra:

```sql
-- Kiểm tra tables đã được tạo
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('learning_progress', 'exercise_results', 'learning_analytics', 'daily_activities');

-- Kiểm tra stored procedure
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'update_user_analytics';

-- Kiểm tra RLS đã được enable
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('learning_progress', 'exercise_results', 'learning_analytics', 'daily_activities');
```

### 3. Test Analytics Flow

Sau khi migration, test flow sau:

1. **Hoàn thành một bài tập** → Kiểm tra `exercise_results` có data
```sql
SELECT * FROM exercise_results WHERE user_id = 'YOUR_USER_ID' ORDER BY created_at DESC LIMIT 5;
```

2. **Kiểm tra learning progress** được update
```sql
SELECT * FROM learning_progress WHERE user_id = 'YOUR_USER_ID' ORDER BY last_accessed_at DESC LIMIT 5;
```

3. **Kiểm tra analytics được tính toán**
```sql
SELECT * FROM learning_analytics WHERE user_id = 'YOUR_USER_ID';
```

4. **Kiểm tra daily activities** được log
```sql
SELECT * FROM daily_activities WHERE user_id = 'YOUR_USER_ID' ORDER BY activity_date DESC LIMIT 7;
```

## Flow hoạt động

### Khi user hoàn thành bài tập:

1. **Frontend (Exercises.tsx)** gọi:
   ```typescript
   await saveExerciseResult({...})
   await updateLearningProgress({...})
   await logDailyActivity('exercise_completed', {...})
   ```

2. **Backend flow**:
   - `saveExerciseResult()` → Insert vào `exercise_results`
   - Tự động gọi `update_user_analytics()` stored procedure
   - Stored procedure tính toán:
     - Tổng bài học/bài tập đã hoàn thành
     - Điểm trung bình
     - Mastery level cho từng kỹ năng (vocabulary, listening, speaking, reading, writing)
     - Current streak và longest streak
     - Strengths và weaknesses
     - Recommended lessons
   - Upsert vào `learning_analytics` table

3. **Dashboard hiển thị**:
   - `LearningAnalyticsDashboard` gọi `getUserStatistics()`
   - Lấy data từ `learning_analytics` và `daily_activities`
   - Hiển thị real-time analytics

## Troubleshooting

### Lỗi: Table not found (PGRST205)
**Nguyên nhân:** Migration chưa chạy hoặc chưa hoàn thành

**Giải pháp:**
1. Vào Supabase Dashboard → SQL Editor
2. Chạy lại file `02_learning_analytics.sql`
3. Kiểm tra không có error trong execution log

### Lỗi: Permission denied (PGRST301)
**Nguyên nhân:** RLS policies chưa được setup đúng

**Giải pháp:**
```sql
-- Kiểm tra policies
SELECT * FROM pg_policies WHERE tablename IN ('learning_progress', 'exercise_results', 'learning_analytics', 'daily_activities');

-- Nếu thiếu, chạy lại phần RLS trong migration script
```

### Lỗi: Function not found (PGRST202)
**Nguyên nhân:** Stored procedure `update_user_analytics` chưa được tạo

**Giải pháp:**
Chạy lại phần PART 7 của migration script để tạo functions

### Data không được tính toán
**Nguyên nhân:** Stored procedure không được gọi sau khi lưu exercise result

**Kiểm tra:**
```sql
-- Xem logs của stored procedure
SELECT * FROM pg_stat_user_functions WHERE funcname = 'update_user_analytics';
```

**Giải pháp:**
- Kiểm tra xem `saveExerciseResult()` có gọi `updateUserAnalytics()` không
- Kiểm tra user có quyền execute stored procedure không

## Performance Tips

### Indexes đã được tạo:
- `idx_exercise_results_user_id` - Query theo user
- `idx_exercise_results_lesson_id` - Query theo lesson
- `idx_daily_activities_user_id` - Query activities theo user
- `idx_learning_analytics_user_id` - Query analytics theo user

### Caching strategy:
- Learning analytics được cache trong database
- Frontend chỉ cần query `learning_analytics` table
- Stored procedure chỉ chạy khi có exercise mới hoàn thành

### Scaling considerations:
- Dữ liệu cũ trong `exercise_results` có thể được archive sau 1 năm
- `daily_activities` có thể được summarize thành monthly statistics
- Analytics dashboard có thể cache ở frontend level với stale time 5 phút

## Migration Rollback

Nếu cần rollback migration:

```sql
-- Drop tables (cẩn thận: sẽ mất dữ liệu!)
DROP TABLE IF EXISTS public.daily_activities CASCADE;
DROP TABLE IF EXISTS public.learning_analytics CASCADE;
DROP TABLE IF EXISTS public.exercise_results CASCADE;
DROP TABLE IF EXISTS public.learning_progress CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.update_user_analytics(UUID);
DROP FUNCTION IF EXISTS public.get_skill_mastery(UUID, TEXT);
DROP FUNCTION IF EXISTS public.calculate_average_score(UUID);
```

## Support

Nếu gặp vấn đề:
1. Check migration logs trong Supabase Dashboard
2. Xem browser console để check client-side errors
3. Kiểm tra Network tab để xem API responses
4. Xem Supabase logs để check server-side errors
