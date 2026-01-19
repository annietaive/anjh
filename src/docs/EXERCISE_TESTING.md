# Exercise Testing Guide

## Hướng dẫn kiểm tra bài tập

### 🎯 Mục tiêu
- Đảm bảo mỗi lesson có đúng 18 bài tập
- Kiểm tra độ đa dạng của đáp án (không bị lệch về 1 position)
- Xác minh exercise data được lưu đúng cách vào database

## 🚀 Quick Test

### Test nhanh tất cả lessons
Mở browser console (F12) và chạy:

```javascript
// Test tất cả lessons có đủ 18 exercises không
const test = await import("/utils/testExerciseCount.ts");

// Expected output:
// ✅ Lesson 1 (My New School): 18 exercises
// ✅ Lesson 2 (My House): 18 exercises
// ... (all 48 lessons)
// Total: 864 exercises (48 × 18)
```

### Test expansion system
```javascript
// Debug xem expansion có hoạt động không
const debug = await import("/utils/debugExpansion.ts");
debug.debugExpansion(1); // Test lesson 1
```

## 1. Visual Debug Panel

### Cách sử dụng
1. Vào trang bài tập bất kỳ (Lessons → Chọn unit → Bài tập)
2. Click icon **Bug màu tím** ở góc phải dưới màn hình
3. Panel sẽ hiển thị:
   - **Current Status**: Câu hiện tại, tổng số câu, progress
   - **Lesson Info**: ID, Unit, Grade, số lượng vocabulary
   - **Exercise Types**: Phân bổ loại bài tập (MC, Fill-blank, Matching)
   - **Answer Diversity**: Phân bổ đáp án đúng ở các vị trí khác nhau (0-3)
   - **All Exercise IDs**: Danh sách tất cả bài tập

### Ý nghĩa các chỉ số

#### Answer Diversity (MC)
Đáp án đúng nên phân bổ đều:
- ✅ **Tốt**: Mỗi position (0-3) chiếm ~25%
- ⚠️ **Cần cải thiện**: 1 position chiếm >35%
- ❌ **Không tốt**: 1 position chiếm >40%

#### Exercise Types
Mỗi lesson có 30 bài tập chia theo:
- Multiple Choice: 10-16 câu
- Fill-blank: 8-10 câu  
- Matching: 4-6 câu

## 2. Console Test Helper

### Cách sử dụng

Mở browser console (F12) và chạy:

```javascript
// Import helper
const helper = await import("/utils/exerciseTestHelper.ts");

// 1. Xem tổng quan tất cả exercises
helper.getExerciseStats();

// 2. Kiểm tra độ đa dạng đáp án
helper.checkAnswerDiversity();

// 3. Test chi tiết 1 lesson cụ thể
helper.testLessonExercises(1); // Lesson ID 1

// 4. Tìm các vấn đề trong data
helper.findIssues();

// 5. Hiển thị help
helper.showHelp();
```

### Output mẫu

```
📊 EXERCISE STATISTICS
============================================================
Total Lessons: 48
Total Exercises: 1440
Average per Lesson: 30.0
Min: 30, Max: 30
Lessons with 30 exercises: 48/48
============================================================

📊 ANSWER DIVERSITY CHECK
============================================================
Total Multiple-Choice Questions: 720
Correct Answer Distribution:
  Position 0: 180 (25.0%) ██████████████
  Position 1: 180 (25.0%) ██████████████
  Position 2: 180 (25.0%) ██████████████
  Position 3: 180 (25.0%) ██████████████
✅ Answer distribution is diverse!
============================================================
```

## 3. Kiểm tra lưu tiến độ

### Thủ công

1. **Login** với tài khoản thật (không phải demo)
2. Làm bài tập và hoàn thành
3. Mở Browser Console (F12)
4. Kiểm tra logs:

```
✅ Exercise result saved successfully
✅ Learning progress updated
✅ Daily activity logged
```

5. Vào **Progress** page để xem tiến độ đã được cập nhật

### Test với Analytics Helper

```javascript
// Generate mock data để test analytics
const helper = await import("/utils/analyticsTestHelper.ts");

// Lấy user ID từ localStorage
const user = JSON.parse(localStorage.getItem('user'));
const userId = user.id;

// Generate mock exercise data
await helper.generateMockExerciseData(userId, user.grade);

// View analytics dashboard để kiểm tra
```

### Kiểm tra Database

Vào Supabase Dashboard:

1. **exercise_results table**:
   - Check có records mới với `user_id` của bạn
   - Verify `score`, `total_questions`, `correct_answers`
   - Check `answers` JSON có đầy đủ data

2. **learning_progress table**:
   - Check `progress_percentage` đã update
   - Verify `completed_at` nếu pass (>= 70%)
   - Check `last_accessed_at` là thời gian gần đây

3. **daily_activities table**:
   - Check có activity với type `exercise_completed`
   - Verify `activity_date` là hôm nay
   - Check `metadata` có chứa score/lesson info

## 4. Common Issues & Solutions

### Issue: Bài tập dừng ở câu 19

**Nguyên nhân**: 
- Có thể là bug trong exercise rendering logic
- Exercise data thiếu hoặc ID không liên tục

**Solution**:
1. Mở Debug Panel kiểm tra "All Exercise IDs"
2. Chạy `helper.testLessonExercises(lessonId)` để xem chi tiết
3. Nếu thiếu bài tập, check `exerciseExpander.ts`

### Issue: Đáp án không đa dạng

**Nguyên nhân**:
- Hard-coded correct answers không random
- Logic generate exercises bị lệch

**Solution**:
1. Chạy `helper.checkAnswerDiversity()`
2. Nếu 1 position chiếm >35%, cần cải thiện
3. Update `exerciseExpander.ts` để randomize correct answer position

### Issue: Tiến độ không được lưu

**Nguyên nhân**:
- User là demo user
- Network error / RLS policy
- Analytics functions không được gọi

**Solution**:
1. Check console logs cho errors
2. Verify user ID không phải `demo-user`
3. Check Supabase RLS policies
4. Test với `helper.generateMockExerciseData()`

## 5. Performance Testing

### Load Test

```javascript
// Test với nhiều exercises
for (let i = 1; i <= 48; i++) {
  const helper = await import("/utils/exerciseTestHelper.ts");
  helper.testLessonExercises(i);
}
```

### Verify Total

```javascript
const helper = await import("/utils/exerciseTestHelper.ts");
const stats = helper.getExerciseStats();

// Should be 1440 total (48 lessons × 30 exercises)
console.assert(
  stats.reduce((sum, s) => sum + s.exerciseCount, 0) === 1440,
  'Total exercises should be 1440'
);
```

## 6. Best Practices

✅ **DO**:
- Luôn test với real user account
- Check console logs sau mỗi exercise completion
- Verify database sau khi làm bài
- Use debug panel khi develop

❌ **DON'T**:
- Không test với demo account (data không lưu DB)
- Không skip việc kiểm tra answer diversity
- Không ignore console warnings/errors
- Không hard-code test data vào production

## 7. Automated Testing (Future)

```typescript
// TODO: Add unit tests
describe('Exercises', () => {
  it('should have 30 exercises per lesson', () => {
    allLessons.forEach(lesson => {
      expect(lesson.exercises.length).toBe(30);
    });
  });

  it('should have diverse answer positions', () => {
    const distribution = checkAnswerDiversity();
    Object.values(distribution).forEach(count => {
      expect(count / totalMC).toBeCloseTo(0.25, 1); // Within 10%
    });
  });
});
```