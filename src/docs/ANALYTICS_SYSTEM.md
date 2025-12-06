# Hệ thống Learning Analytics - EngMastery

## 📊 Tổng quan

Hệ thống Learning Analytics của EngMastery cung cấp khả năng theo dõi và phân tích tiến độ học tập của học sinh một cách toàn diện. Hệ thống sử dụng **dữ liệu thật** từ database Supabase, không còn demo data.

## 🎯 Tính năng chính

### 1. Theo dõi tiến độ theo từng bài học
- Tiến độ hoàn thành từng kỹ năng (vocabulary, listening, speaking, reading, writing)
- Phần trăm hoàn thành
- Thời gian học
- Ngày truy cập gần nhất

### 2. Lưu trữ kết quả bài tập chi tiết
- Điểm số và số câu đúng/sai
- Chi tiết từng câu trả lời
- Thời gian làm bài
- Loại bài tập

### 3. Phân tích học tập tổng hợp
- Tổng số bài học/bài tập đã hoàn thành
- Điểm trung bình
- Mức độ thành thạo từng kỹ năng (0-100%)
- Điểm mạnh và điểm yếu
- Bài học được đề xuất dựa trên performance

### 4. Streak tracking
- Chuỗi ngày học liên tục
- Chuỗi dài nhất từ trước đến nay
- Motivation để học đều đặn

### 5. Gợi ý cá nhân hóa
- Tự động xác định kỹ năng cần cải thiện
- Đề xuất bài học phù hợp
- Gợi ý các bước tiếp theo

## 🏗️ Kiến trúc hệ thống

### Database Schema

```
learning_progress         →  Tiến độ từng lesson
    ├─ user_id
    ├─ lesson_id
    ├─ progress_percentage
    ├─ vocabulary_completed
    ├─ listening_completed
    ├─ speaking_completed
    ├─ reading_completed
    ├─ writing_completed
    └─ completed_at

exercise_results          →  Kết quả bài tập chi tiết
    ├─ user_id
    ├─ lesson_id
    ├─ exercise_type
    ├─ score
    ├─ total_questions
    ├─ correct_answers
    ├─ answers (JSONB)
    └─ completed_at

learning_analytics        →  Thống kê tổng hợp
    ├─ user_id
    ├─ total_lessons_completed
    ├─ total_exercises_completed
    ├─ average_score
    ├─ vocabulary_mastery
    ├─ listening_mastery
    ├─ speaking_mastery
    ├─ reading_mastery
    ├─ writing_mastery
    ├─ strengths (JSONB)
    ├─ weaknesses (JSONB)
    ├─ recommended_lessons (JSONB)
    ├─ current_streak_days
    └─ longest_streak_days

daily_activities          →  Hoạt động hàng ngày
    ├─ user_id
    ├─ activity_date
    ├─ lessons_completed
    ├─ exercises_completed
    └─ time_spent_minutes
```

### Data Flow

```
User completes exercise
         ↓
Exercises.tsx
  ├─ saveExerciseResult()
  │   └─ Insert vào exercise_results
  │       └─ Trigger update_user_analytics()
  │           └─ Calculate & update learning_analytics
  ├─ updateLearningProgress()
  │   └─ Upsert learning_progress
  └─ logDailyActivity()
      └─ Upsert daily_activities
         ↓
LearningAnalyticsDashboard
  ├─ getUserStatistics()
  │   └─ Query learning_analytics + daily_activities
  └─ getPersonalizedRecommendations()
      └─ Analyze data & generate recommendations
```

## 💻 Sử dụng trong code

### Frontend - Lưu kết quả bài tập

```typescript
import { saveExerciseResult, updateLearningProgress, logDailyActivity } from '../utils/analytics';

// Khi user hoàn thành bài tập
await saveExerciseResult({
  userId: user.id,
  lessonId: 1,
  exerciseType: 'mixed',
  score: 85,
  totalQuestions: 10,
  correctAnswers: 8,
  answers: [...],  // Chi tiết từng câu
  timeSpentSeconds: 180,
});

// Cập nhật tiến độ lesson
await updateLearningProgress(user.id, 1, user.grade, {
  progress_percentage: 100,
  completed_at: new Date().toISOString(),
});

// Log activity hàng ngày
await logDailyActivity(user.id, 'exercise_completed', {
  lessonId: 1,
  score: 85,
});
```

### Frontend - Hiển thị analytics

```typescript
import { getUserStatistics, getPersonalizedRecommendations } from '../utils/analytics';

// Lấy statistics tổng hợp
const stats = await getUserStatistics(userId);
// Returns:
// {
//   overall: { totalLessons, totalExercises, totalTime, averageScore },
//   weekly: { lessons, exercises, time },
//   skills: { vocabulary, listening, speaking, reading, writing },
//   streak: { current, longest }
// }

// Lấy recommendations
const recs = await getPersonalizedRecommendations(userId);
// Returns:
// {
//   weakSkills: [{ name, mastery, label }],
//   recommendedLessons: [lessonId1, lessonId2, ...],
//   nextSteps: ['Tập trung...', 'Duy trì...']
// }
```

## 🧪 Testing trong Development

### Tạo mock data để test

```typescript
// Trong browser console
const helper = await import('/utils/analyticsTestHelper.ts');

// Generate 10 bài tập với scores ngẫu nhiên
await helper.generateMockExerciseData('YOUR_USER_ID', 6);

// Xem analytics summary
await helper.viewAnalyticsSummary('YOUR_USER_ID');

// Xóa tất cả data để test lại (cẩn thận!)
await helper.clearUserAnalyticsData('YOUR_USER_ID');
```

### Kiểm tra database trực tiếp

```sql
-- Xem analytics của user
SELECT * FROM learning_analytics WHERE user_id = 'YOUR_USER_ID';

-- Xem kết quả bài tập gần nhất
SELECT * FROM exercise_results 
WHERE user_id = 'YOUR_USER_ID' 
ORDER BY completed_at DESC 
LIMIT 10;

-- Xem hoạt động 7 ngày gần nhất
SELECT * FROM daily_activities 
WHERE user_id = 'YOUR_USER_ID' 
ORDER BY activity_date DESC 
LIMIT 7;
```

## 📈 Cách tính toán Analytics

### Average Score
```sql
AVG(score) FROM exercise_results WHERE user_id = ?
```

### Skill Mastery (per skill)
```sql
AVG(score) FROM exercise_results 
WHERE user_id = ? AND exercise_type = 'vocabulary'
```

### Current Streak
Tính số ngày liên tục có hoạt động trong `daily_activities`, tính ngược từ hôm nay/hôm qua.

### Longest Streak
Tìm chuỗi dài nhất trong lịch sử `daily_activities`.

### Strengths
Kỹ năng có mastery >= 70%

### Weaknesses
Kỹ năng có mastery < 60%, sắp xếp từ thấp đến cao

### Recommended Lessons
Các lesson có score < 70% hoặc chưa hoàn thành

## 🔒 Security & RLS

Tất cả tables có Row Level Security:
- Users chỉ có thể view/update dữ liệu của mình
- Teachers có thể view dữ liệu của students
- Stored procedures chạy với SECURITY DEFINER

## 🚀 Performance

### Indexes
- Tất cả foreign keys có indexes
- Query theo user_id được optimize
- Composite indexes cho queries phổ biến

### Caching Strategy
- Analytics data được tính toán và lưu trong `learning_analytics`
- Frontend chỉ query table này, không cần tính toán real-time
- Stored procedure chỉ chạy khi có exercise mới

### Optimization Tips
- Analytics dashboard có thể cache 5 phút ở frontend
- Dữ liệu cũ có thể archive sau 1 năm
- Daily activities có thể summarize thành monthly

## 🐛 Troubleshooting

### Không thấy dữ liệu trong dashboard
✅ **Kiểm tra:**
1. User đã hoàn thành ít nhất 1 bài tập chưa?
2. Database migration đã chạy thành công?
3. Stored procedure `update_user_analytics` có tồn tại?

```sql
-- Kiểm tra có exercise results không
SELECT COUNT(*) FROM exercise_results WHERE user_id = 'YOUR_USER_ID';

-- Kiểm tra analytics có được tính không
SELECT * FROM learning_analytics WHERE user_id = 'YOUR_USER_ID';

-- Manually trigger analytics update
SELECT update_user_analytics('YOUR_USER_ID'::uuid);
```

### Streak không đúng
✅ **Kiểm tra:**
```sql
-- Xem daily activities
SELECT * FROM daily_activities 
WHERE user_id = 'YOUR_USER_ID' 
ORDER BY activity_date DESC;

-- Manually recalculate
SELECT update_user_analytics('YOUR_USER_ID'::uuid);
```

### Skill mastery = 0
✅ **Nguyên nhân:** Chưa có bài tập cho kỹ năng đó

Hiện tại hầu hết bài tập là `exercise_type = 'mixed'`. Để có skill mastery chính xác, cần:
- Phân loại exercises theo type (vocabulary, listening, etc.)
- Hoặc track skill riêng trong learning_progress

## 📚 Tài liệu liên quan

- [Migration Guide](/supabase/MIGRATION_GUIDE.md)
- [Database Schema](/supabase/migrations/02_learning_analytics.sql)
- [Analytics Utilities](/utils/analytics.ts)
- [Test Helper](/utils/analyticsTestHelper.ts)

## 🎯 Roadmap

### Phase 1 ✅ (Completed)
- [x] Database schema
- [x] Basic analytics calculation
- [x] Dashboard hiển thị
- [x] Streak tracking
- [x] Recommendations

### Phase 2 (Next)
- [ ] Detailed skill breakdown per lesson
- [ ] Progress charts & visualizations
- [ ] Weekly/Monthly reports
- [ ] Export analytics to PDF
- [ ] Teacher view cho multiple students
- [ ] Comparison với peers (anonymous)

### Phase 3 (Future)
- [ ] AI-powered recommendations
- [ ] Predictive analytics
- [ ] Gamification badges & achievements
- [ ] Social features (study groups)
- [ ] Advanced reporting & insights
