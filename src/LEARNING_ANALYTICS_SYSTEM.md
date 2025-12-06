# EngMastery - Learning Analytics System

## 📊 Tổng quan hệ thống

Website EngMastery hiện đã có **hệ thống phân tích học tập (Learning Analytics)** hoàn chỉnh với 3 flows chính:

### ✅ Flow 1: Học sinh
```
Đăng nhập → Làm bài → Nhận gợi ý → Xem tiến độ
```

1. **Đăng nhập**: AuthPage với Supabase authentication
2. **Làm bài**: Exercises component - Tự động lưu kết quả vào database
3. **Nhận gợi ý**: LearningAnalyticsDashboard - Gợi ý bài học cá nhân hóa dựa trên weak skills
4. **Xem tiến độ**: Progress & LearningAnalyticsDashboard - Xem thống kê chi tiết

### ✅ Flow 2: Giáo viên  
```
Đăng nhập → Xem Dashboard → Xem phân tích lớp học
```

1. **Đăng nhập**: AuthPage (role: teacher)
2. **Xem Dashboard**: TeacherDashboard - Quản lý bài tập, giao bài
3. **Xem phân tích lớp học**: TeacherAnalyticsDashboard - Phân tích toàn bộ học sinh

### ✅ Flow 3: AI Engine
```
Phân tích lỗi → Gợi ý bài học → Cập nhật Database
```

1. **Phân tích lỗi**: `getPersonalizedRecommendations()` - Tính toán weak skills
2. **Gợi ý bài học**: Đề xuất lessons dựa trên weaknesses
3. **Cập nhật Database**: `update_user_analytics()` SQL function - Auto-update

---

## 🗄️ Database Schema

### Bảng chính (Đã có trong `/supabase/migrations/02_learning_analytics.sql`)

#### 1. `learning_progress`
Theo dõi tiến độ học tập theo từng lesson:
- `user_id`, `lesson_id`, `grade`
- `vocabulary_completed`, `listening_completed`, `speaking_completed`, `reading_completed`, `writing_completed`
- `progress_percentage` (0-100)
- `time_spent_minutes`
- `completed_at`

#### 2. `exercise_results`
Lưu kết quả bài tập chi tiết:
- `user_id`, `lesson_id`, `exercise_type`
- `score`, `total_questions`, `correct_answers`
- `answers` (JSONB) - Chi tiết từng câu hỏi
- `time_spent_seconds`

#### 3. `learning_analytics`
Phân tích tổng hợp:
- `user_id`
- `total_lessons_completed`, `total_exercises_completed`, `total_time_spent_minutes`
- `average_score`
- `vocabulary_mastery`, `listening_mastery`, `speaking_mastery`, `reading_mastery`, `writing_mastery` (0-100%)
- `strengths`, `weaknesses` (JSONB arrays)
- `recommended_lessons` (JSONB array)
- `current_streak_days`, `longest_streak_days`

#### 4. `daily_activities`
Theo dõi streak và hoạt động hàng ngày:
- `user_id`, `activity_date`
- `lessons_completed`, `exercises_completed`, `time_spent_minutes`

### Helper Functions (SQL)
- `calculate_average_score(user_uuid)` - Tính điểm trung bình
- `get_skill_mastery(user_uuid, skill_type)` - Tính mastery theo kỹ năng
- `update_user_analytics(user_uuid)` - Cập nhật toàn bộ analytics tự động

---

## 📁 Code Structure

### Utils Layer (`/utils/analytics.ts`)
```typescript
// Learning Progress
getLearningProgress(userId, lessonId)
updateLearningProgress(userId, lessonId, grade, updates)

// Exercise Results
saveExerciseResult(result) // ⭐ Auto-call update_user_analytics()
getExerciseResults(userId, lessonId?)

// Analytics
getLearningAnalytics(userId)
updateUserAnalytics(userId)

// Daily Activities
logDailyActivity(userId, updates)
getDailyActivities(userId, days)

// Recommendations
getPersonalizedRecommendations(userId) // 🧠 AI-powered
getUserStatistics(userId)
```

### Components Layer

#### Học sinh Components
- **`/components/Exercises.tsx`** ⭐ Đã tích hợp auto-save
  - Nhận user prop
  - Tự động lưu kết quả khi hoàn thành bài tập
  - Gọi `saveExerciseResult()` và `updateLearningProgress()`
  
- **`/components/LearningAnalyticsDashboard.tsx`** ⭐ NEW
  - Overall Statistics (lessons, exercises, score, time)
  - Streak Tracking (current & longest)
  - Skills Breakdown (5 kỹ năng với progress bars)
  - Personalized Recommendations:
    - Weak skills detection
    - Recommended lessons
    - Next steps suggestions
  - Weekly Progress

#### Giáo viên Components
- **`/components/TeacherDashboard.tsx`** ✅ Updated
  - Quản lý bài tập
  - Giao bài cho học sinh hoặc cả lớp
  - Nút "Phân tích lớp học" → TeacherAnalyticsDashboard
  
- **`/components/TeacherAnalyticsDashboard.tsx`** ⭐ NEW ✅ REAL DATA
  - **Tự động sử dụng dữ liệu thật từ database**
  - Class Overview Stats (total students, active students, average score)
  - Students Needing Help (score < 60 hoặc không active)
  - Top Performers (score >= 85)
  - All Students Table (comprehensive view)
  - Grade Filter (6, 7, 8, 9, hoặc all)
  - **Toast notifications** thông báo trạng thái data
  - **Debug Info panel** hiển thị chi tiết
  - **Smart fallback** sang demo mode nếu không có data

### App Integration (`/App.tsx`)
- Thêm page type `'analytics'`
- Route đến `LearningAnalyticsDashboard`
- Truyền `user` prop vào `Exercises`
- Support navigation từ recommendations → lessons

### Header (`/components/Header.tsx`)
- Thêm menu "Phân tích học tập" (Brain icon)
- Navigate đến analytics page

---

## 🚀 Cách sử dụng

### Setup Database
1. Chạy migration file trong Supabase SQL Editor:
   ```sql
   /supabase/migrations/02_learning_analytics.sql
   ```
2. Verify các bảng đã được tạo:
   - `learning_progress`
   - `exercise_results`
   - `learning_analytics`
   - `daily_activities`

### Học sinh Flow
1. **Đăng nhập** → AuthPage
2. **Chọn bài học** → LessonList → LessonDetail
3. **Làm bài tập** → Exercises
   - Kết quả tự động lưu vào `exercise_results`
   - Progress tự động update vào `learning_progress`
   - Analytics tự động refresh qua `update_user_analytics()`
4. **Xem analytics** → Menu → "Phân tích học tập"
   - Xem overall stats, skills breakdown
   - Nhận gợi ý cá nhân hóa
   - Click vào recommended lessons để học tiếp

### Giáo viên Flow
1. **Đăng nhập** (role: teacher)
2. **Quản lý bài tập** → Header menu → "Quản lý bài tập"
3. **Xem phân tích lớp** → Click "Phân tích lớp học"
   - Chọn grade filter (6/7/8/9/all)
   - Xem học sinh cần hỗ trợ
   - Xem top performers
   - Xem toàn bộ danh sách học sinh với stats

---

## 🎯 AI Engine - Personalized Recommendations

### Logic phân tích (trong `getPersonalizedRecommendations()`)

1. **Weak Skills Detection**:
   ```typescript
   skills.filter(skill => skill.mastery < 60)
     .sort((a, b) => a.mastery - b.mastery)
     .slice(0, 2)
   ```

2. **Next Steps Generation**:
   - Nếu có weak skill → "Tập trung vào kỹ năng X"
   - Nếu streak = 0 → "Bắt đầu streak mới"
   - Nếu score < 70 → "Ôn tập lại các bài đã học"

3. **Recommended Lessons**:
   - Từ `learning_analytics.recommended_lessons` (JSONB array)
   - Có thể mở rộng bằng ML algorithm (tương lai)

### Auto-Update Trigger
```typescript
// Trong saveExerciseResult()
await saveExerciseResult(...);
await updateUserAnalytics(userId); // ⭐ Auto-refresh analytics
```

---

## 📊 Demo Mode Support

Tất cả components đều hỗ trợ **Demo Mode**:
- Tự động fallback khi không có database connection
- Sử dụng demo data có sẵn
- Không hiện error cho users
- Badge "Chế độ Demo" hiển thị rõ ràng

### Demo Data
- `demoStatistics` - Student analytics
- `demoClassStats` - Class analytics
- `demoStudents` - Student list

---

## 🔐 Security (RLS Policies)

### Students
- Chỉ xem được data của chính mình
- Có thể insert/update own progress và results

### Teachers
- Xem được data của tất cả students (qua `is_teacher()` helper)
- Không thể modify student data directly
- Chỉ có thể view analytics

### Functions
- `SECURITY DEFINER` cho helper functions
- Prevent infinite recursion trong RLS policies

---

## 🎨 UI/UX Features

### Color Coding
- **Green (>=85%)**: Excellent
- **Blue (70-84%)**: Good
- **Orange (60-69%)**: Average
- **Red (<60%)**: Needs Help

### Responsive Design
- Mobile-friendly
- Grid layouts cho stats
- Collapsible sections

### Interactive Elements
- Click on recommended lessons → Navigate
- Grade filters
- Sortable tables
- Real-time updates

---

## 📈 Metrics Tracked

### Per Student
- Total lessons completed
- Total exercises completed
- Average score
- Time spent (minutes)
- Skill mastery (5 skills: vocabulary, listening, speaking, reading, writing)
- Current streak & longest streak
- Last activity date

### Per Class (Teachers)
- Total students
- Active students (học trong 7 ngày gần nhất)
- Class average score
- Total lessons/exercises completed by class
- Students needing help
- Top performers

---

## 🛠️ Future Enhancements

### Có thể mở rộng
1. **ML-based Recommendations**:
   - Train model trên exercise_results
   - Predict next best lesson for each student

2. **Advanced Analytics**:
   - Time-series charts (learning progress over time)
   - Cohort analysis
   - A/B testing for teaching methods

3. **Gamification**:
   - Badges & achievements
   - Leaderboards
   - Challenges

4. **Teacher Tools**:
   - Bulk assign homework
   - Auto-grading with AI
   - Parent dashboard

5. **Export Features**:
   - PDF reports
   - Excel exports
   - Email notifications

---

## ✅ Checklist - Hoàn thành

- ✅ Database Schema (`02_learning_analytics.sql`)
- ✅ Analytics Utils (`/utils/analytics.ts`)
- ✅ Student Analytics Dashboard (`/components/LearningAnalyticsDashboard.tsx`)
- ✅ Teacher Analytics Dashboard (`/components/TeacherAnalyticsDashboard.tsx`)
- ✅ Auto-save Exercise Results (tích hợp vào `Exercises.tsx`)
- ✅ RLS Policies (students own data, teachers view all)
- ✅ Helper Functions (calculate scores, update analytics)
- ✅ Personalized Recommendations (AI-powered logic)
- ✅ Demo Mode Support (toàn bộ components)
- ✅ App Integration (routing, navigation)
- ✅ Header Menu (phân tích học tập link)

---

## 🎯 Kết luận

Hệ thống EngMastery giờ đã có **ĐẦY ĐỦ** 3 flows:

### ✅ Học sinh
Đăng nhập → Làm bài (auto-save) → Nhận gợi ý (AI) → Xem tiến độ (analytics)

### ✅ Giáo viên
Đăng nhập → Xem Dashboard (assignments) → Xem phân tích lớp học (class analytics)

### ✅ AI Engine
Phân tích lỗi (weak skills) → Gợi ý bài học (recommendations) → Cập nhật Database (auto-update)

**Production-ready!** 🚀

---

## 📘 Sử dụng dữ liệu thật thay vì Demo Mode

### Teacher Analytics Dashboard - Real Data Guide

**TeacherAnalyticsDashboard** đã được nâng cấp để **tự động sử dụng dữ liệu thật** từ database!

#### ✅ Khi nào hiện dữ liệu thật?
- Khi có students trong bảng `user_profiles` (role: 'student')
- Khi students đã làm bài và có data trong `learning_analytics`
- RLS policies cho phép teacher xem student data

#### 📋 Steps để thấy dữ liệu thật:

**1. Tạo student accounts:**
- Logout khỏi teacher account
- Đăng ký tài khoản mới với role: student, grade: 6-9
- Lặp lại để tạo nhiều students (khuyến nghị ít nhất 5 students)

**2. Students làm bài:**
- Login vào student account
- Chọn lesson → Làm exercises
- Kết quả tự động lưu vào database

**3. Teacher xem analytics:**
- Login với teacher account
- Vào "Quản lý bài tập" → "Phân tích lớp học"
- Sẽ thấy dữ liệu thật từ students!

#### 🔍 Cách kiểm tra

**Toast notifications sẽ hiển thị:**
```
✓ Đã tải dữ liệu 10 học sinh
  5 học sinh hoạt động trong 7 ngày qua
```

**Debug Info (click để xem chi tiết):**
```
Successfully loaded data for 10 students (5 active)
```

**Không có badge "Chế độ Demo"** → Nghĩa là đang dùng real data!

#### 📖 Chi tiết đầy đủ

Xem file `/TEACHER_ANALYTICS_REALDATA_GUIDE.md` để biết:
- Cách setup database
- Troubleshooting các vấn đề thường gặp
- Script tạo test students nhanh
- SQL commands để debug
- Production checklist

---

## 🎉 Summary

Hệ thống Learning Analytics của EngMastery đã **HOÀN TOÀN SẴN SÀNG** cho production với:

✅ **3 Complete Flows**: Student, Teacher, AI Engine  
✅ **Real-time Data**: Tự động sử dụng dữ liệu thật từ Supabase  
✅ **Smart Fallback**: Demo mode khi không có data  
✅ **Full Analytics**: Stats, recommendations, class overview  
✅ **Security**: RLS policies đầy đủ  
✅ **User-friendly**: Toast notifications, debug info, clear UI  

**Sẵn sàng để phục vụ hàng nghìn học sinh! 🚀**