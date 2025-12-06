# 🔄 Demo Mode vs Real Data Mode - Giải thích

## 📊 Hệ thống dữ liệu EngMastery

EngMastery có **2 chế độ hoạt động** cho phần phân tích học tập:

### 🟡 Demo Mode (Chế độ Demo)
- **Khi nào xuất hiện?**
  - Không có Supabase connection
  - Không có students trong database
  - Không có analytics data
  - Có lỗi khi load data từ database

- **Hiển thị:**
  - Badge màu vàng: **"Chế độ Demo"**
  - Dữ liệu mẫu (30 học sinh ảo)
  - Toast notification: "Đang hiển thị dữ liệu demo"

- **Mục đích:**
  - Cho phép test UI/UX mà không cần database
  - Demo tính năng cho người dùng mới
  - Fallback an toàn khi có lỗi

### 🟢 Real Data Mode (Chế độ dữ liệu thật)
- **Khi nào xuất hiện?**
  - ✅ Có Supabase connection
  - ✅ Có students trong `user_profiles` table
  - ✅ Students đã làm bài (có data trong `learning_analytics`)
  - ✅ RLS policies hoạt động đúng

- **Hiển thị:**
  - **KHÔNG có** badge "Chế độ Demo"
  - Toast success: "Đã tải dữ liệu X học sinh"
  - Debug Info: "Successfully loaded data for X students"

- **Dữ liệu:**
  - Số học sinh thực tế từ database
  - Analytics thật từ bài tập đã làm
  - Real-time statistics
  - Live updates khi students làm bài

---

## 🎯 Cách chuyển từ Demo Mode sang Real Data Mode

### Cho Teacher:

#### Step 1: Verify Database Setup
```sql
-- Kiểm tra trong Supabase SQL Editor
SELECT COUNT(*) FROM user_profiles WHERE role = 'student';
-- Nếu = 0 → Cần tạo students
-- Nếu > 0 → Có students rồi
```

#### Step 2: Tạo Student Accounts (nếu chưa có)

**Cách 1: UI (Dễ nhất)**
1. Logout khỏi teacher account
2. Vào AuthPage → Sign Up
3. Điền thông tin:
   - Name: Nguyễn Văn An
   - Email: student1@engmastery.com
   - Password: bất kỳ
   - Grade: 6
   - Role: Student
4. Click "Đăng ký"
5. Lặp lại cho nhiều students (khuyến nghị 5-10)

**Cách 2: Supabase Dashboard**
1. Vào Authentication → Users → Add user
2. Tạo auth user
3. Copy user UUID
4. Vào Table Editor → user_profiles → Insert row
5. Điền user_id = UUID vừa copy

#### Step 3: Students làm bài
1. Login với student account
2. Chọn lesson bất kỳ
3. Làm exercises (ít nhất 1 bài)
4. Kết quả tự động lưu

#### Step 4: Teacher kiểm tra
1. Login lại với teacher account
2. Vào "Quản lý bài tập" → "Phân tích lớp học"
3. Kiểm tra:
   - ❌ Có badge "Chế độ Demo"? → Chưa có data thật
   - ✅ Không có badge? → Đang dùng real data!

---

## 🔍 Troubleshooting

### Vấn đề: Vẫn thấy "Chế độ Demo" mặc dù đã có students

**Nguyên nhân có thể:**
1. RLS policy chặn teacher không xem được students
2. Students chưa làm bài → Chưa có analytics data
3. Migration chưa chạy đầy đủ

**Giải pháp:**

#### Check 1: Verify RLS Policies
```sql
-- Kiểm tra teacher có xem được students không
SELECT * FROM user_profiles WHERE role = 'student';
-- Nếu return 0 rows mặc dù có students → RLS policy sai
```

#### Check 2: Verify Analytics Data
```sql
-- Kiểm tra có analytics data không
SELECT COUNT(*) FROM learning_analytics;
-- Nếu = 0 → Students chưa làm bài
```

#### Check 3: Re-run Migrations
```sql
-- Chạy lại migrations quan trọng:
-- 1. create_user_profiles_table.sql
-- 2. 02_learning_analytics.sql
```

---

## 📱 UI Indicators

### Demo Mode Indicators:
```
┌─────────────────────────────────────────┐
│ 🟡 Chế độ Demo                         │ ← Badge màu vàng
│                                         │
│ Toast: "Chưa có học sinh trong hệ      │
│ thống. Đang hiển thị dữ liệu demo."    │
│                                         │
│ Tổng số học sinh: 30 (demo)            │
└─────────────────────────────────────────┘
```

### Real Data Mode Indicators:
```
┌─────────────────────────────────────────┐
│ (No demo badge)                         │ ← Không có badge
│                                         │
│ Toast: ✓ Đã tải dữ liệu 10 học sinh   │
│        5 học sinh hoạt động trong 7    │
│        ngày qua                         │
│                                         │
│ Debug Info: Successfully loaded data   │ ← Click để xem
│ for 10 students (5 active)             │
│                                         │
│ Tổng số học sinh: 10 (real)            │
└─────────────────────────────────────────┘
```

---

## 🎓 Cho Students

Học sinh **KHÔNG** thấy Demo Mode trong Student Analytics Dashboard vì:
- Mỗi học sinh chỉ xem data của chính mình
- Nếu chưa làm bài → Hiện "0" (không phải demo)
- Nếu đã làm bài → Hiện số liệu thật

**Cách tạo data:**
1. Login vào student account
2. Chọn lesson → Tab "Exercises"
3. Làm bài tập
4. Vào "Phân tích học tập" để xem kết quả

---

## 📊 So sánh Demo vs Real Data

| Feature | Demo Mode | Real Data Mode |
|---------|-----------|----------------|
| Số học sinh | 30 (fake) | Từ database |
| Điểm số | Random mẫu | Thực tế |
| Hoạt động | Giả lập | Live data |
| Badge | 🟡 "Chế độ Demo" | Không có |
| Toast | Info/Warning | Success |
| Update | Static | Real-time |
| Debug Info | "Using demo mode" | "Successfully loaded..." |

---

## ✅ Production Checklist

Trước khi deploy, đảm bảo:

- [ ] ✅ Migrations đã chạy đầy đủ
- [ ] ✅ RLS policies hoạt động đúng
- [ ] ✅ Teachers có thể view student data
- [ ] ✅ Students có thể tạo analytics data
- [ ] ✅ Demo mode fallback hoạt động
- [ ] ✅ Toast notifications hiển thị đúng
- [ ] ✅ No console errors
- [ ] ✅ Debug info hiển thị thông tin chính xác

**Khi tất cả checklist pass → System sẵn sàng production! 🚀**

---

## 🔗 Related Documentation

- `/LEARNING_ANALYTICS_SYSTEM.md` - Tổng quan hệ thống
- `/TEACHER_ANALYTICS_REALDATA_GUIDE.md` - Hướng dẫn chi tiết cho teachers
- `/supabase/migrations/02_learning_analytics.sql` - Database schema
- `/components/TeacherAnalyticsDashboard.tsx` - Component code

---

## 💡 Tips

### Để test nhanh:
1. Tạo 1 student account
2. Làm 1-2 bài exercises
3. Login teacher → Check analytics
4. Sẽ thấy real data ngay lập tức!

### Để có full data:
1. Tạo 10-20 student accounts
2. Mỗi student làm 3-5 bài
3. Teacher analytics sẽ rất đầy đủ và đẹp!

### Để debug:
1. Check console logs (F12)
2. Click "Debug Info" trong dashboard
3. Run SQL queries để verify data
4. Check toast notifications

**Happy teaching! 📚✨**
