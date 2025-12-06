# Exercise Structure - EngMastery

## 📊 Tổng quan

Mỗi lesson trong EngMastery có **18 bài tập** được chia thành 2 phần chính:

### 📈 Cấu trúc 18 bài tập:

#### **SECTION 1: Multiple Choice - Grammar (6 exercises)**
- Exercise 1-6: Câu hỏi ngữ pháp cơ bản
- Kiểu: `multiple-choice`
- Tập trung vào thì, cấu trúc câu, từ loại

#### **SECTION 2: Multiple Choice - Vocabulary (4 exercises)**
- Exercise 7-10: Câu hỏi từ vựng
- Kiểu: `multiple-choice`
- Bao gồm:
  - Exercise 7: Word meaning
  - Exercise 8: Complete sentence with word
  - Exercise 9: Correct usage in sentence
  - Exercise 10: Contextual meaning

#### **SECTION 3: Fill in the Blank (8 exercises)**
- Exercise 11-18: Điền từ vào chỗ trống
- Kiểu: `fill-blank`
- Tập trung vào áp dụng ngữ pháp và từ vựng

## 🎯 Đặc điểm nổi bật

### ✅ Realistic Distractors
- Đáp án sai được tạo từ **vocabulary database** của cùng lesson
- Không còn placeholder như "wrong word", "nghĩa sai"
- Đảm bảo chất lượng học tập cao

### ✅ Conditional Expansion
- Chỉ expand exercises khi lesson có **< 18 exercises**
- Không override dữ liệu manual đã có
- Giữ nguyên exercises chất lượng cao đã được viết sẵn

### ✅ Correct Answer Tracking
- Đã fix bug shuffle - `correctAnswer` index được tính đúng
- Options được shuffle random mỗi lần generate
- Đảm bảo không có pattern cố định

## 📝 Example Exercise Types

### Multiple Choice
```typescript
{
  id: 1,
  type: 'multiple-choice',
  question: 'She ___ to school every day.',
  options: ['go', 'goes', 'going', 'went'],
  correctAnswer: 1,  // index of 'goes'
  explanation: 'Use "goes" for third person singular in Present Simple'
}
```

### Fill in the Blank
```typescript
{
  id: 11,
  type: 'fill-blank',
  question: 'My sister ___ (study) English every day.',
  correctAnswer: 'studies',
  explanation: 'Third person singular: study → studies'
}
```

## 🔧 Technical Implementation

### Files
- `/data/exerciseExpander.ts` - Generate 18 exercises
- `/data/lessonEnhancer.ts` - Conditional expansion logic
- `/data/allLessons.ts` - Merge and enhance all lessons

### Key Functions
- `generate18ExercisesForUnit()` - Main generation function
- `enhanceLesson()` - Expand if needed
- `generateDistractorMeanings()` - Realistic wrong answers
- `shuffle()` - Randomize options

## 📊 Statistics

- **Total Lessons**: 48 (12 per grade)
- **Exercises per Lesson**: 18
- **Total Exercises**: 864 (48 × 18)
- **Vocabulary per Lesson**: 30 words
- **Total Vocabulary**: 1,440 words

## 🧪 Testing

```javascript
// Test trong browser console (F12)
const test = await import("/utils/testExerciseCount.ts");

// Expected: All ✅ with 18 exercises each
```

## 📚 Learning Path

1. **Multiple Choice (1-6)** → Học ngữ pháp cơ bản
2. **Vocabulary (7-10)** → Mở rộng từ vựng
3. **Fill Blank (11-18)** → Áp dụng và củng cố

Cấu trúc này đảm bảo học sinh được luyện tập đầy đủ cả **ngữ pháp**, **từ vựng**, và **vận dụng**.
