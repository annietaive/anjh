-- ============================================================================
-- Seed 60 Real Students with Learning Analytics Data
-- ============================================================================
-- IMPORTANT: This SQL script CANNOT create auth.users directly
-- You MUST use the TypeScript seeder in /utils/seedRealStudents.ts instead
-- 
-- This file is for REFERENCE ONLY - showing the data structure
-- ============================================================================

-- Alternative: If you have auth user IDs from signup, you can manually insert:
-- Replace 'YOUR-AUTH-USER-ID-HERE' with actual UUIDs from auth.users table

/*
-- Example for one student (Grade 6 - Student 1)
-- Step 1: Create user profile
INSERT INTO public.user_profiles (user_id, name, username, email, grade, role)
VALUES (
  'YOUR-AUTH-USER-ID-HERE', 
  'Nguyễn Văn An', 
  'nguyenvanan', 
  'nguyenvanan@engmastery.edu.vn', 
  6, 
  'student'
);

-- Step 2: Create learning progress (example for units 1-5)
INSERT INTO public.learning_progress (user_id, lesson_id, grade, vocabulary_completed, listening_completed, speaking_completed, reading_completed, writing_completed, progress_percentage, time_spent_minutes)
VALUES 
  ('YOUR-AUTH-USER-ID-HERE', 1, 6, true, true, true, true, false, 85, 45),
  ('YOUR-AUTH-USER-ID-HERE', 2, 6, true, true, false, true, false, 72, 38),
  ('YOUR-AUTH-USER-ID-HERE', 3, 6, true, false, true, true, true, 68, 52),
  ('YOUR-AUTH-USER-ID-HERE', 4, 6, true, true, true, false, false, 56, 28),
  ('YOUR-AUTH-USER-ID-HERE', 5, 6, false, true, false, true, false, 44, 22);

-- Step 3: Create exercise results for 4 skills
INSERT INTO public.exercise_results (user_id, lesson_id, exercise_type, score, total_questions, correct_answers, time_spent_seconds)
VALUES 
  -- Listening exercises
  ('YOUR-AUTH-USER-ID-HERE', 1, 'listening', 85, 10, 9, 420),
  ('YOUR-AUTH-USER-ID-HERE', 1, 'listening', 90, 10, 9, 380),
  ('YOUR-AUTH-USER-ID-HERE', 2, 'listening', 75, 10, 8, 450),
  
  -- Speaking exercises
  ('YOUR-AUTH-USER-ID-HERE', 1, 'speaking', 70, 5, 4, 300),
  ('YOUR-AUTH-USER-ID-HERE', 1, 'speaking', 80, 5, 4, 280),
  ('YOUR-AUTH-USER-ID-HERE', 2, 'speaking', 65, 5, 3, 320),
  
  -- Reading exercises
  ('YOUR-AUTH-USER-ID-HERE', 1, 'reading', 88, 10, 9, 540),
  ('YOUR-AUTH-USER-ID-HERE', 1, 'reading', 92, 10, 9, 510),
  ('YOUR-AUTH-USER-ID-HERE', 2, 'reading', 78, 10, 8, 580),
  
  -- Writing exercises
  ('YOUR-AUTH-USER-ID-HERE', 1, 'writing', 65, 10, 7, 600),
  ('YOUR-AUTH-USER-ID-HERE', 1, 'writing', 70, 10, 7, 620),
  ('YOUR-AUTH-USER-ID-HERE', 2, 'writing', 60, 10, 6, 650);

-- Step 4: Create daily activities
INSERT INTO public.daily_activities (user_id, activity_date, lessons_completed, exercises_completed, time_spent_minutes)
VALUES 
  ('YOUR-AUTH-USER-ID-HERE', CURRENT_DATE - INTERVAL '1 day', 2, 5, 45),
  ('YOUR-AUTH-USER-ID-HERE', CURRENT_DATE - INTERVAL '2 days', 1, 3, 32),
  ('YOUR-AUTH-USER-ID-HERE', CURRENT_DATE - INTERVAL '5 days', 3, 8, 78),
  ('YOUR-AUTH-USER-ID-HERE', CURRENT_DATE - INTERVAL '7 days', 1, 4, 38),
  ('YOUR-AUTH-USER-ID-HERE', CURRENT_DATE - INTERVAL '10 days', 2, 6, 52);

-- Step 5: Create learning analytics (summary)
INSERT INTO public.learning_analytics (
  user_id, 
  total_lessons_completed, 
  total_exercises_completed, 
  total_time_spent_minutes, 
  average_score,
  vocabulary_mastery,
  listening_mastery,
  speaking_mastery,
  reading_mastery,
  writing_mastery,
  current_streak_days,
  longest_streak_days,
  last_activity_date
)
VALUES (
  'YOUR-AUTH-USER-ID-HERE',
  5,    -- lessons completed
  60,   -- exercises completed  
  185,  -- total time in minutes
  75.5, -- average score
  78.0, -- vocabulary mastery
  83.3, -- listening mastery
  71.7, -- speaking mastery
  86.0, -- reading mastery
  65.0, -- writing mastery
  3,    -- current streak
  7,    -- longest streak
  CURRENT_DATE
);
*/

-- ============================================================================
-- RECOMMENDED APPROACH: Use TypeScript Seeder
-- ============================================================================
-- Run this command in your application:
--
--   Admin Panel > Click "Thêm 60 Học Sinh Vào Database"
--
-- This will:
-- 1. Create 60 auth users via Supabase Auth API
-- 2. Generate realistic learning data for all 4 skills
-- 3. Insert ~10,000+ records across all tables
-- 4. Handle errors and rate limiting automatically
-- ============================================================================

-- ============================================================================
-- List of 60 Students (Reference)
-- ============================================================================
-- Grade 6 (15 students):
--   1. Nguyễn Văn An (nguyenvanan@engmastery.edu.vn)
--   2. Trần Thị Bình (tranthibinh@engmastery.edu.vn)
--   3. Lê Hoàng Cường (lehoangcuong@engmastery.edu.vn)
--   4. Phạm Thu Dung (phamthudung@engmastery.edu.vn)
--   5. Hoàng Minh Đức (hoangminhduc@engmastery.edu.vn)
--   6. Đỗ Thị Hà (dothiha@engmastery.edu.vn)
--   7. Vũ Quang Huy (vuquanghuy@engmastery.edu.vn)
--   8. Bùi Lan Hương (builanhuong@engmastery.edu.vn)
--   9. Ngô Tiến Khoa (ngotienkhoa@engmastery.edu.vn)
--   10. Đinh Thị Linh (dinhthilinh@engmastery.edu.vn)
--   11. Trương Văn Minh (truongvanminh@engmastery.edu.vn)
--   12. Phan Thị Nam (phanthinam@engmastery.edu.vn)
--   13. Đặng Quốc Phong (dangquocphong@engmastery.edu.vn)
--   14. Lý Thu Quỳnh (lythuquynh@engmastery.edu.vn)
--   15. Võ Đức Sơn (voducson@engmastery.edu.vn)
--
-- Grade 7 (15 students):
--   16. Nguyễn Thị Tâm (nguyenthitam@engmastery.edu.vn)
--   17. Trần Văn Tuấn (tranvantuan@engmastery.edu.vn)
--   ... (see /utils/seedRealStudents.ts for full list)
--
-- Grade 8 (15 students):
--   31. Nguyễn Văn Nghĩa (nguyenvannghia@engmastery.edu.vn)
--   ... (see /utils/seedRealStudents.ts for full list)
--
-- Grade 9 (15 students):
--   46. Nguyễn Thị Hằng (nguyenthihang@engmastery.edu.vn)
--   ... (see /utils/seedRealStudents.ts for full list)
--
-- All passwords: Student123!
-- ============================================================================

-- Query to verify seeded data after running TypeScript seeder:
/*
-- Check total students
SELECT COUNT(*) as total_students 
FROM user_profiles 
WHERE role = 'student';

-- Check students by grade
SELECT grade, COUNT(*) as count 
FROM user_profiles 
WHERE role = 'student'
GROUP BY grade 
ORDER BY grade;

-- Check exercise results by skill type
SELECT 
  exercise_type,
  COUNT(*) as total_exercises,
  ROUND(AVG(score)::numeric, 2) as avg_score,
  MIN(score) as min_score,
  MAX(score) as max_score
FROM exercise_results
GROUP BY exercise_type
ORDER BY exercise_type;

-- Check learning analytics summary
SELECT 
  ROUND(AVG(listening_mastery)::numeric, 2) as avg_listening,
  ROUND(AVG(speaking_mastery)::numeric, 2) as avg_speaking,
  ROUND(AVG(reading_mastery)::numeric, 2) as avg_reading,
  ROUND(AVG(writing_mastery)::numeric, 2) as avg_writing,
  ROUND(AVG(average_score)::numeric, 2) as overall_avg
FROM learning_analytics;

-- Check total records in each table
SELECT 
  (SELECT COUNT(*) FROM user_profiles WHERE role = 'student') as students,
  (SELECT COUNT(*) FROM learning_progress) as progress_records,
  (SELECT COUNT(*) FROM exercise_results) as exercise_records,
  (SELECT COUNT(*) FROM daily_activities) as activity_records,
  (SELECT COUNT(*) FROM learning_analytics) as analytics_records;
*/

-- ============================================================================
-- END OF FILE
-- ============================================================================
