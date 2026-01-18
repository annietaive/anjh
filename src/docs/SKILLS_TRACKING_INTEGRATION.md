# 📊 Hệ Thống Tích Hợp Tracking Điểm Số 4 Kỹ Năng

## Tổng quan

Hệ thống đã được tích hợp đầy đủ để tracking điểm số cho tất cả 4 kỹ năng chính (Nghe, Nói, Đọc, Viết) cùng với phần Bài tập (Vocabulary/Mixed). Tất cả điểm số sẽ được lưu vào database với `exercise_type` tương ứng và hiển thị trong trang **Learning Analytics**.

---

## 📋 Exercise Types

Hệ thống hỗ trợ các loại exercise_type sau:

1. **`listening`** - Kỹ năng Nghe
2. **`speaking`** - Kỹ năng Nói  
3. **`reading`** - Kỹ năng Đọc
4. **`writing`** - Kỹ năng Viết
5. **`vocabulary`** - Bài tập từ vựng
6. **`grammar`** - Bài tập ngữ pháp
7. **`mixed`** - Bài tập tổng hợp

---

## 🔧 Cách Lưu Kết Quả

### 1. Listening (Nghe)

**Component:** `/components/LessonDetail.tsx` (Tab Listening)

**Cơ chế:**
- Người dùng trả lời các câu hỏi listening
- Khi hoàn thành tất cả câu hỏi, tự động tính điểm
- Gọi `saveSkillProgress('listening', score, correct, total)`

**Code:**
```typescript
useEffect(() => {
  if (activeTab === 'listening' && lesson?.listening?.questions) {
    const answeredCount = Object.keys(selectedAnswers)
      .filter(key => !key.startsWith('reading-')).length;
    const totalQuestions = lesson.listening.questions.length;
    
    if (answeredCount === totalQuestions && totalQuestions > 0) {
      let correct = 0;
      lesson.listening.questions.forEach((q, index) => {
        if (selectedAnswers[index] === q.correctAnswer) {
          correct++;
        }
      });
      const score = Math.round((correct / totalQuestions) * 100);
      saveSkillProgress('listening', score, correct, totalQuestions);
    }
  }
}, [selectedAnswers, activeTab]);
```

---

### 2. Speaking (Nói)

**Component:** `/components/SpeakingPractice.tsx`

**Cơ chế:**
- Người dùng ghi âm giọng nói
- AI phân tích 4 tiêu chí: pronunciation, grammar, fluency, vocabulary
- Tính điểm tổng hợp (overall score)
- Lưu kết quả khi nhấn "Phân tích AI"

**Code:**
```typescript
await saveExerciseResult({
  userId: user.id,
  lessonId: lessonId,
  exerciseType: 'speaking',
  score: analysisResult.overallScore,
  totalQuestions: 4, // 4 criteria
  correctAnswers: Math.round((analysisResult.overallScore / 100) * 4),
  answers: [{ transcript, feedback: analysisResult }],
  timeSpentSeconds: recordingTime
});
```

**Tiêu chí đánh giá:**
- Pronunciation (25%)
- Grammar (30%)
- Fluency (25%)
- Vocabulary (20%)

---

### 3. Reading (Đọc)

**Component:** `/components/LessonDetail.tsx` (Tab Reading)

**Cơ chế:**
- Người dùng đọc đoạn văn và trả lời câu hỏi comprehension
- Khi hoàn thành tất cả câu hỏi, tự động tính điểm
- Gọi `saveSkillProgress('reading', score, correct, total)`

**Code:**
```typescript
useEffect(() => {
  if (activeTab === 'reading' && lesson?.reading?.questions) {
    const readingAnswers = Object.keys(selectedAnswers)
      .filter(key => key.startsWith('reading-'));
    const totalQuestions = lesson.reading.questions.length;
    
    if (readingAnswers.length === totalQuestions && totalQuestions > 0) {
      let correct = 0;
      lesson.reading.questions.forEach((q, index) => {
        if (selectedAnswers[`reading-${index}`] === q.correctAnswer) {
          correct++;
        }
      });
      const score = Math.round((correct / totalQuestions) * 100);
      saveSkillProgress('reading', score, correct, totalQuestions);
    }
  }
}, [selectedAnswers, activeTab]);
```

---

### 4. Writing (Viết)

**Component:** `/components/LessonDetail.tsx` (Tab Writing)

**Cơ chế:**
- Người dùng viết bài theo prompt
- Nhấn "Submit Writing" để chấm điểm
- AI phân tích 3 tiêu chí: grammar, vocabulary, structure
- Lưu kết quả với điểm tổng hợp

**Code:**
```typescript
const gradeWriting = () => {
  // ... tính điểm grammar, vocabulary, structure ...
  
  const totalScore = Math.round((grammarScore + vocabScore + structureScore) / 3 * 10) / 10;
  
  setWritingFeedback({
    score: totalScore,
    grammar: grammarScore,
    vocabulary: vocabScore,
    structure: structureScore,
    comments
  });

  // Save writing progress (điểm * 10 để convert từ 10 điểm thành 100 điểm)
  saveSkillProgress('writing', Math.round(totalScore * 10));
};
```

**Tiêu chí đánh giá:**
- Grammar (33.3%)
- Vocabulary (33.3%)
- Structure (33.3%)

---

### 5. Bài Tập (Vocabulary/Mixed)

**Component:** `/components/InteractiveExercises.tsx`

**Cơ chế:**
- Các loại bài tập: matching, fill blank, ordering, drag-drop, pronunciation, synonym
- Lưu với `exerciseType: 'vocabulary'` hoặc `'mixed'`

**Code:**
```typescript
const saveProgress = async (exerciseType: string, correct: number, total: number) => {
  const scorePercent = Math.round((correct / total) * 100);
  
  const analyticsType = exerciseType === 'matching' || 
                        exerciseType === 'dragdrop' || 
                        exerciseType === 'fillblank' || 
                        exerciseType === 'ordering' ||
                        exerciseType === 'pronunciation' || 
                        exerciseType === 'synonym' ? 'vocabulary' : 'mixed';
  
  await saveExerciseResult({
    userId: user.id,
    lessonId: lessonId,
    exerciseType: analyticsType,
    score: scorePercent,
    totalQuestions: total,
    correctAnswers: correct,
    answers: [],
    timeSpentSeconds: 0
  });
};
```

---

## 📊 Hiển Thị Analytics

### Learning Analytics Dashboard

**Component:** `/components/LearningAnalyticsDashboard.tsx`

**Dữ liệu hiển thị:**

1. **Overall Statistics** (Tổng quan)
   - Total Lessons Completed
   - Total Exercises Completed
   - Average Score
   - Total Time

2. **Skills Breakdown** (Phân tích kỹ năng)
   - Vocabulary Mastery
   - Listening Mastery
   - Speaking Mastery
   - Reading Mastery
   - Writing Mastery

3. **Detailed Skills Stats** (Chi tiết 4 kỹ năng chính) ⭐ **MỚI**
   - **Listening Details:**
     - Average Score (điểm trung bình)
     - Total Exercises (số bài đã làm)
     - Correct/Total Questions (số câu đúng/tổng)
     - Accuracy (độ chính xác %)
   
   - **Speaking Details:**
     - Average Score
     - Total Exercises
     - Correct/Total Criteria
     - Accuracy
   
   - **Reading Details:**
     - Average Score
     - Total Exercises
     - Correct/Total Questions
     - Accuracy
   
   - **Writing Details:**
     - Average Score
     - Total Exercises
     - Correct/Total Criteria
     - Accuracy

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    User completes exercise                       │
│        (Listening/Speaking/Reading/Writing/Vocabulary)           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              saveSkillProgress() or saveProgress()               │
│                  (in respective component)                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    saveExerciseResult()                          │
│              (in /utils/analytics.ts)                            │
│  - userId                                                        │
│  - lessonId                                                      │
│  - exerciseType: 'listening'|'speaking'|'reading'|'writing'      │
│               |'vocabulary'|'grammar'|'mixed'                    │
│  - score: 0-100                                                  │
│  - totalQuestions                                                │
│  - correctAnswers                                                │
│  - answers: []                                                   │
│  - timeSpentSeconds                                              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              Supabase: exercise_results table                    │
│  Columns:                                                        │
│  - id                                                            │
│  - user_id                                                       │
│  - lesson_id                                                     │
│  - exercise_type ← QUAN TRỌNG!                                   │
│  - score                                                         │
│  - total_questions                                               │
│  - correct_answers                                               │
│  - answers (JSONB)                                               │
│  - time_spent_seconds                                            │
│  - completed_at                                                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              getUserStatistics() - Analytics                     │
│              (in /utils/analytics.ts)                            │
│  Query exercise_results by exercise_type:                        │
│  - WHERE exercise_type = 'listening'                             │
│  - WHERE exercise_type = 'speaking'                              │
│  - WHERE exercise_type = 'reading'                               │
│  - WHERE exercise_type = 'writing'                               │
│                                                                  │
│  Calculate for each skill:                                       │
│  - averageScore = SUM(score) / COUNT(*)                          │
│  - totalExercises = COUNT(*)                                     │
│  - totalCorrect = SUM(correct_answers)                           │
│  - totalQuestions = SUM(total_questions)                         │
│  - accuracy = (totalCorrect / totalQuestions) * 100              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│          LearningAnalyticsDashboard Component                    │
│  Display:                                                        │
│  - Overall stats (all skills combined)                           │
│  - Skill mastery bars (5 skills)                                 │
│  - Detailed skill stats (4 main skills) ⭐                        │
│    • Listening card with 4 metrics                               │
│    • Speaking card with 4 metrics                                │
│    • Reading card with 4 metrics                                 │
│    • Writing card with 4 metrics                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Testing Checklist

Để kiểm tra hệ thống hoạt động đúng:

### 1. Test Listening
- [ ] Vào một lesson, chọn tab "Nghe"
- [ ] Trả lời tất cả câu hỏi listening
- [ ] Kiểm tra toast notification "✅ Đã lưu kết quả Nghe: XX%"
- [ ] Vào Learning Analytics, kiểm tra "Kỹ năng Nghe" card xuất hiện

### 2. Test Speaking
- [ ] Vào một lesson, chọn tab "Nói"
- [ ] Ghi âm và phân tích
- [ ] Kiểm tra toast notification "✅ Đã lưu kết quả Nói: XX%"
- [ ] Vào Learning Analytics, kiểm tra "Kỹ năng Nói" card xuất hiện

### 3. Test Reading
- [ ] Vào một lesson, chọn tab "Đọc"
- [ ] Trả lời tất cả câu hỏi reading
- [ ] Kiểm tra toast notification "✅ Đã lưu kết quả Đọc: XX%"
- [ ] Vào Learning Analytics, kiểm tra "Kỹ năng Đọc" card xuất hiện

### 4. Test Writing
- [ ] Vào một lesson, chọn tab "Viết"
- [ ] Viết bài và submit
- [ ] Kiểm tra toast notification "✅ Đã lưu kết quả Viết: XX%"
- [ ] Vào Learning Analytics, kiểm tra "Kỹ năng Viết" card xuất hiện

### 5. Test Analytics Display
- [ ] Vào Learning Analytics Dashboard
- [ ] Kiểm tra "Năng lực theo kỹ năng" hiển thị 5 bars (Vocabulary, Listening, Speaking, Reading, Writing)
- [ ] Kiểm tra 4 cards chi tiết (Listening, Speaking, Reading, Writing) hiển thị đầy đủ:
  - Điểm trung bình
  - Bài đã làm
  - Đúng/Tổng câu
  - Độ chính xác

### 6. Verify Database
```sql
-- Kiểm tra dữ liệu đã lưu
SELECT 
  exercise_type,
  COUNT(*) as total,
  AVG(score) as avg_score,
  SUM(correct_answers) as total_correct,
  SUM(total_questions) as total_questions
FROM exercise_results
WHERE user_id = 'YOUR_USER_ID'
GROUP BY exercise_type;
```

Kết quả mong đợi:
```
exercise_type | total | avg_score | total_correct | total_questions
--------------+-------+-----------+---------------+----------------
listening     |   3   |    75.0   |      9        |      12
speaking      |   2   |    82.0   |      7        |       8
reading       |   4   |    88.0   |     14        |      16
writing       |   1   |    85.0   |      9        |      10
vocabulary    |  10   |    90.0   |     45        |      50
```

---

## 🐛 Troubleshooting

### Vấn đề: Không thấy skillDetails trong Analytics
**Nguyên nhân:** Chưa có dữ liệu exercise_results với exercise_type tương ứng

**Giải pháp:**
1. Hoàn thành ít nhất 1 bài listening/speaking/reading/writing
2. Refresh trang Learning Analytics
3. Kiểm tra console log: `[Analytics] Calculated skillDetails from database`

### Vấn đề: Toast notification không hiện
**Nguyên nhân:** Lỗi trong quá trình save

**Giải pháp:**
1. Mở Console (F12)
2. Kiểm tra error logs
3. Verify Supabase connection
4. Kiểm tra user object có tồn tại không

### Vấn đề: Điểm không chính xác
**Nguyên nhân:** Logic tính điểm sai

**Giải pháp:**
1. Kiểm tra công thức tính điểm trong component
2. Verify `correctAnswers` và `totalQuestions` được truyền đúng
3. Kiểm tra database xem giá trị có đúng không

---

## 📝 Notes

1. **Automatic Save:** Listening và Reading tự động lưu khi hoàn thành tất cả câu hỏi
2. **Manual Save:** Speaking và Writing cần nhấn nút "Phân tích AI" hoặc "Submit Writing"
3. **LocalStorage Fallback:** Nếu Supabase fail, dữ liệu sẽ được lưu vào localStorage
4. **Toast Notifications:** Mọi lần lưu thành công đều có toast thông báo
5. **Real-time Updates:** Analytics dashboard sẽ cập nhật ngay khi có dữ liệu mới

---

## 🎯 Kết luận

Hệ thống đã được tích hợp đầy đủ để tracking và hiển thị điểm số cho:
- ✅ Listening (Nghe)
- ✅ Speaking (Nói)
- ✅ Reading (Đọc)
- ✅ Writing (Viết)
- ✅ Vocabulary (Từ vựng)

Tất cả dữ liệu được lưu vào database Supabase với `exercise_type` phù hợp và hiển thị chi tiết trong **Learning Analytics Dashboard**.
