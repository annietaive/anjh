# Supabase Setup Guide - EngMastery

## 📋 Tổng quan

EngMastery sử dụng Supabase để:
- ✅ **Authentication**: Đăng ký/đăng nhập user
- ✅ **User Profiles**: Lưu thông tin học sinh (tên, lớp, email)
- ⚠️ **Analytics** (Optional): Lưu kết quả bài tập và theo dõi tiến độ

## 🚀 Quick Start

### Bước 1: Kết nối Supabase (Bắt buộc)

1. Click nút **"Connect Supabase"** trong app
2. Nhập thông tin từ Supabase Dashboard:
   - **Project URL**: https://xxx.supabase.co
   - **Anon Key**: eyJhbG...

### Bước 2: Tạo User Profiles Table (Bắt buộc)

Mở **Supabase SQL Editor** và chạy:

```sql
-- User profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  grade INTEGER CHECK (grade IN (6, 7, 8, 9)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Bước 3: Tạo Analytics Tables (Optional - Recommended)

Nếu bạn muốn lưu **kết quả bài tập** và **theo dõi tiến độ**, chạy file:

📄 **`/docs/DATABASE_SCHEMA.sql`**

Copy toàn bộ nội dung và paste vào **Supabase SQL Editor** → Run.

File này tạo 4 tables:
- ✅ `learning_progress` - Tiến độ từng bài học
- ✅ `exercise_results` - Kết quả bài tập chi tiết  
- ✅ `learning_analytics` - Thống kê tổng hợp
- ✅ `daily_activities` - Hoạt động hàng ngày (streak)

## ⚠️ Quan trọng

### App vẫn hoạt động BÌNH THƯỜNG nếu bạn KHÔNG tạo Analytics tables

- ✅ Đăng ký/đăng nhập vẫn hoạt động
- ✅ Học bài, làm bài tập vẫn hoạt động
- ✅ Kết quả vẫn được lưu vào `localStorage`
- ⚠️ **Nhưng không đồng bộ giữa các thiết bị**

### Lợi ích khi có Analytics tables:

- ✅ **Đồng bộ tiến độ** giữa các thiết bị
- ✅ **Streak tracking** - Theo dõi chuỗi ngày học liên tục
- ✅ **Detailed analytics** - Thống kê chi tiết kỹ năng
- ✅ **Personalized recommendations** - Gợi ý bài học phù hợp

## 🔧 Troubleshooting

### Lỗi: "Could not find the table 'public.xxx'"

**Nguyên nhân**: Table chưa được tạo trong Supabase

**Giải pháp**:
1. Mở Supabase SQL Editor
2. Chạy script tạo table tương ứng từ `/docs/DATABASE_SCHEMA.sql`
3. Hoặc bỏ qua - app vẫn hoạt động bình thường!

### App đã handle gracefully:

```typescript
// Nếu table không tồn tại, app sẽ:
if (error.code === 'PGRST205') {
  console.log('Table not created yet. Skipping save.');
  return null; // Không throw error
}
```

## 📊 Database Schema Overview

### Core Tables (Required)
```
user_profiles
├── id (UUID) - Primary Key
├── full_name (TEXT)
├── email (TEXT)
├── grade (INTEGER)
└── created_at, updated_at
```

### Analytics Tables (Optional)
```
learning_progress (Tiến độ từng bài)
├── user_id + lesson_id (Composite unique)
├── vocabulary_completed, listening_completed, ...
├── progress_percentage (0-100)
└── time_spent_minutes

exercise_results (Kết quả bài tập)
├── user_id, lesson_id
├── score, total_questions, correct_answers
├── answers (JSONB - chi tiết từng câu)
└── time_spent_seconds

learning_analytics (Thống kê tổng hợp)
├── user_id (Unique)
├── total_lessons_completed, total_exercises_completed
├── vocabulary_mastery, listening_mastery, ... (0-100)
└── current_streak_days, longest_streak_days

daily_activities (Hoạt động hàng ngày)
├── user_id + activity_date (Composite unique)
├── lessons_completed, exercises_completed
└── time_spent_minutes
```

## 🎯 Recommended Setup Flow

### Minimum Setup (5 phút):
1. ✅ Kết nối Supabase
2. ✅ Tạo `user_profiles` table
3. ✅ Done! App đã hoạt động

### Full Setup (10 phút):
1. ✅ Kết nối Supabase
2. ✅ Tạo `user_profiles` table
3. ✅ Chạy `/docs/DATABASE_SCHEMA.sql` (tạo 4 analytics tables)
4. ✅ Done! Full features enabled

## 🔐 Security (Row Level Security)

Tất cả tables đều có **RLS enabled**:
- ✅ Users chỉ có thể xem/sửa dữ liệu của chính mình
- ✅ Không thể xem dữ liệu của users khác
- ✅ Tự động enforce bằng Supabase Auth

## 📚 Tài liệu liên quan

- `/docs/DATABASE_SCHEMA.sql` - Full SQL schema
- `/utils/analytics.ts` - Analytics functions
- `/utils/supabase/client.ts` - Supabase client setup

## ❓ FAQ

**Q: Tôi có cần tạo tất cả tables không?**  
A: Không. Chỉ cần `user_profiles` là đủ. Analytics tables là optional.

**Q: Nếu không tạo analytics tables thì sao?**  
A: App vẫn hoạt động bình thường. Kết quả lưu vào localStorage thay vì database.

**Q: Tôi muốn thêm analytics sau có được không?**  
A: Được! Chỉ cần chạy `/docs/DATABASE_SCHEMA.sql` bất cứ lúc nào.

**Q: Làm sao xóa dữ liệu test?**  
A: Vào Supabase Dashboard → Table Editor → Select rows → Delete

**Q: App có hoạt động offline không?**  
A: Có! localStorage luôn hoạt động. Chỉ database sync cần internet.
