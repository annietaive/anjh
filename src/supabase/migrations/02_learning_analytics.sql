-- ============================================================================
-- Learning Analytics System - Complete Database Schema
-- ============================================================================
-- Bảng này lưu trữ toàn bộ dữ liệu phân tích học tập cho hệ thống EngMastery
-- ============================================================================

-- ============================================================================
-- PART 1: Learning Progress Tracking
-- ============================================================================

-- Bảng lưu tiến độ học tập theo lesson
CREATE TABLE IF NOT EXISTS public.learning_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id BIGINT NOT NULL,
  grade BIGINT NOT NULL CHECK (grade >= 6 AND grade <= 9),
  
  -- Skill completion tracking
  vocabulary_completed BOOLEAN DEFAULT FALSE,
  listening_completed BOOLEAN DEFAULT FALSE,
  speaking_completed BOOLEAN DEFAULT FALSE,
  reading_completed BOOLEAN DEFAULT FALSE,
  writing_completed BOOLEAN DEFAULT FALSE,
  
  -- Progress percentage (0-100)
  progress_percentage BIGINT DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  
  -- Time tracking
  time_spent_minutes BIGINT DEFAULT 0,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one progress record per user per lesson
  UNIQUE(user_id, lesson_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON public.learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_lesson_id ON public.learning_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_grade ON public.learning_progress(grade);
CREATE INDEX IF NOT EXISTS idx_learning_progress_completed ON public.learning_progress(completed_at);

-- ============================================================================
-- PART 2: Exercise Results Storage
-- ============================================================================

-- Bảng lưu kết quả bài tập chi tiết
CREATE TABLE IF NOT EXISTS public.exercise_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id BIGINT NOT NULL,
  exercise_type TEXT NOT NULL CHECK (exercise_type IN ('vocabulary', 'listening', 'speaking', 'reading', 'writing', 'grammar', 'mixed')),
  
  -- Score and performance
  score BIGINT NOT NULL CHECK (score >= 0 AND score <= 100),
  total_questions BIGINT NOT NULL,
  correct_answers BIGINT NOT NULL,
  
  -- Detailed results (JSON)
  answers JSONB, -- Array of {questionId, userAnswer, correctAnswer, isCorrect, timeSpent}
  
  -- Time tracking
  time_spent_seconds BIGINT DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_exercise_results_user_id ON public.exercise_results(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_results_lesson_id ON public.exercise_results(lesson_id);
CREATE INDEX IF NOT EXISTS idx_exercise_results_type ON public.exercise_results(exercise_type);
CREATE INDEX IF NOT EXISTS idx_exercise_results_score ON public.exercise_results(score);
CREATE INDEX IF NOT EXISTS idx_exercise_results_completed ON public.exercise_results(completed_at);

-- ============================================================================
-- PART 3: Learning Analytics (Aggregated Stats)
-- ============================================================================

-- Bảng tổng hợp phân tích học tập
CREATE TABLE IF NOT EXISTS public.learning_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Overall statistics
  total_lessons_completed BIGINT DEFAULT 0,
  total_exercises_completed BIGINT DEFAULT 0,
  total_time_spent_minutes BIGINT DEFAULT 0,
  average_score NUMERIC(5,2) DEFAULT 0.0,
  
  -- Skill-based statistics
  vocabulary_mastery NUMERIC(5,2) DEFAULT 0.0, -- 0-100%
  listening_mastery NUMERIC(5,2) DEFAULT 0.0,
  speaking_mastery NUMERIC(5,2) DEFAULT 0.0,
  reading_mastery NUMERIC(5,2) DEFAULT 0.0,
  writing_mastery NUMERIC(5,2) DEFAULT 0.0,
  
  -- Strengths and weaknesses (JSON array of skill names)
  strengths JSONB DEFAULT '[]'::jsonb,
  weaknesses JSONB DEFAULT '[]'::jsonb,
  
  -- Recommended lessons (JSON array of lesson IDs)
  recommended_lessons JSONB DEFAULT '[]'::jsonb,
  
  -- Streak tracking
  current_streak_days BIGINT DEFAULT 0,
  longest_streak_days BIGINT DEFAULT 0,
  last_activity_date DATE,
  
  -- Updated timestamps
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one analytics record per user
  UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_learning_analytics_user_id ON public.learning_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_analytics_avg_score ON public.learning_analytics(average_score);

-- ============================================================================
-- PART 4: Daily Activity Log (for streak tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.daily_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  
  -- Activity counts
  lessons_completed BIGINT DEFAULT 0,
  exercises_completed BIGINT DEFAULT 0,
  time_spent_minutes BIGINT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one record per user per day
  UNIQUE(user_id, activity_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_activities_user_id ON public.daily_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activities_date ON public.daily_activities(activity_date);

-- ============================================================================
-- PART 5: Row Level Security Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activities ENABLE ROW LEVEL SECURITY;

-- learning_progress policies
DROP POLICY IF EXISTS "Users can view own progress" ON public.learning_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.learning_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.learning_progress;
DROP POLICY IF EXISTS "Teachers can view student progress" ON public.learning_progress;

CREATE POLICY "Users can view own progress" ON public.learning_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.learning_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.learning_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers can view student progress" ON public.learning_progress
  FOR SELECT USING (is_teacher(auth.uid()));

-- exercise_results policies
DROP POLICY IF EXISTS "Users can view own results" ON public.exercise_results;
DROP POLICY IF EXISTS "Users can insert own results" ON public.exercise_results;
DROP POLICY IF EXISTS "Teachers can view student results" ON public.exercise_results;

CREATE POLICY "Users can view own results" ON public.exercise_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own results" ON public.exercise_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers can view student results" ON public.exercise_results
  FOR SELECT USING (is_teacher(auth.uid()));

-- learning_analytics policies
DROP POLICY IF EXISTS "Users can view own analytics" ON public.learning_analytics;
DROP POLICY IF EXISTS "Users can update own analytics" ON public.learning_analytics;
DROP POLICY IF EXISTS "Users can insert own analytics" ON public.learning_analytics;
DROP POLICY IF EXISTS "Teachers can view student analytics" ON public.learning_analytics;

CREATE POLICY "Users can view own analytics" ON public.learning_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics" ON public.learning_analytics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON public.learning_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers can view student analytics" ON public.learning_analytics
  FOR SELECT USING (is_teacher(auth.uid()));

-- daily_activities policies
DROP POLICY IF EXISTS "Users can view own activities" ON public.daily_activities;
DROP POLICY IF EXISTS "Users can update own activities" ON public.daily_activities;
DROP POLICY IF EXISTS "Users can insert own activities" ON public.daily_activities;

CREATE POLICY "Users can view own activities" ON public.daily_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own activities" ON public.daily_activities
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities" ON public.daily_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- PART 6: Triggers for auto-updating timestamps
-- ============================================================================

DROP TRIGGER IF EXISTS update_learning_progress_updated_at ON public.learning_progress;
CREATE TRIGGER update_learning_progress_updated_at
  BEFORE UPDATE ON public.learning_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_learning_analytics_updated_at ON public.learning_analytics;
CREATE TRIGGER update_learning_analytics_updated_at
  BEFORE UPDATE ON public.learning_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PART 7: Helper Functions for Analytics
-- ============================================================================

-- Function to calculate average score for a user
CREATE OR REPLACE FUNCTION calculate_average_score(user_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
  avg_score NUMERIC;
BEGIN
  SELECT AVG(score) INTO avg_score
  FROM public.exercise_results
  WHERE user_id = user_uuid;
  
  RETURN COALESCE(avg_score, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's skill mastery
CREATE OR REPLACE FUNCTION get_skill_mastery(user_uuid UUID, skill_type TEXT)
RETURNS NUMERIC AS $$
DECLARE
  mastery NUMERIC;
BEGIN
  SELECT AVG(score) INTO mastery
  FROM public.exercise_results
  WHERE user_id = user_uuid AND exercise_type = skill_type;
  
  RETURN COALESCE(mastery, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user analytics (call this after each exercise completion)
CREATE OR REPLACE FUNCTION update_user_analytics(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  lessons_count BIGINT;
  exercises_count BIGINT;
  total_time BIGINT;
  avg_score NUMERIC;
  vocab_mastery NUMERIC;
  listen_mastery NUMERIC;
  speak_mastery NUMERIC;
  read_mastery NUMERIC;
  write_mastery NUMERIC;
  current_streak BIGINT;
  longest_streak BIGINT;
  last_activity DATE;
  strength_list JSONB;
  weakness_list JSONB;
  recommended_list JSONB;
BEGIN
  -- Calculate statistics
  SELECT COUNT(*) INTO lessons_count
  FROM public.learning_progress
  WHERE user_id = user_uuid AND completed_at IS NOT NULL;
  
  SELECT COUNT(*) INTO exercises_count
  FROM public.exercise_results
  WHERE user_id = user_uuid;
  
  SELECT COALESCE(SUM(time_spent_minutes), 0) INTO total_time
  FROM public.learning_progress
  WHERE user_id = user_uuid;
  
  SELECT calculate_average_score(user_uuid) INTO avg_score;
  SELECT get_skill_mastery(user_uuid, 'vocabulary') INTO vocab_mastery;
  SELECT get_skill_mastery(user_uuid, 'listening') INTO listen_mastery;
  SELECT get_skill_mastery(user_uuid, 'speaking') INTO speak_mastery;
  SELECT get_skill_mastery(user_uuid, 'reading') INTO read_mastery;
  SELECT get_skill_mastery(user_uuid, 'writing') INTO write_mastery;
  
  -- Calculate streak
  SELECT MAX(activity_date) INTO last_activity
  FROM public.daily_activities
  WHERE user_id = user_uuid;
  
  -- Calculate current streak (consecutive days up to today or yesterday)
  WITH RECURSIVE streak_calc AS (
    SELECT 
      activity_date,
      1 as streak_length,
      activity_date as max_date
    FROM public.daily_activities
    WHERE user_id = user_uuid
      AND activity_date >= CURRENT_DATE - INTERVAL '1 day'
    
    UNION ALL
    
    SELECT 
      da.activity_date,
      sc.streak_length + 1,
      sc.max_date
    FROM public.daily_activities da
    INNER JOIN streak_calc sc ON da.activity_date = sc.activity_date - INTERVAL '1 day'
    WHERE da.user_id = user_uuid
  )
  SELECT COALESCE(MAX(streak_length), 0) INTO current_streak
  FROM streak_calc;
  
  -- Calculate longest streak ever
  WITH streak_groups AS (
    SELECT 
      activity_date,
      activity_date - (ROW_NUMBER() OVER (ORDER BY activity_date))::integer AS grp
    FROM public.daily_activities
    WHERE user_id = user_uuid
  )
  SELECT COALESCE(MAX(COUNT(*)), 0) INTO longest_streak
  FROM streak_groups
  GROUP BY grp;
  
  -- Identify strengths (skills with mastery >= 70)
  SELECT jsonb_agg(skill) INTO strength_list
  FROM (
    SELECT CASE 
      WHEN vocab_mastery >= 70 THEN 'vocabulary'
      WHEN listen_mastery >= 70 THEN 'listening'
      WHEN speak_mastery >= 70 THEN 'speaking'
      WHEN read_mastery >= 70 THEN 'reading'
      WHEN write_mastery >= 70 THEN 'writing'
    END as skill
    FROM (VALUES 
      (vocab_mastery), 
      (listen_mastery), 
      (speak_mastery), 
      (read_mastery), 
      (write_mastery)
    ) AS v(mastery)
  ) skills
  WHERE skill IS NOT NULL;
  
  -- Identify weaknesses (skills with mastery < 60)
  SELECT jsonb_agg(skill ORDER BY mastery) INTO weakness_list
  FROM (
    SELECT 'vocabulary' as skill, vocab_mastery as mastery WHERE vocab_mastery < 60
    UNION ALL
    SELECT 'listening', listen_mastery WHERE listen_mastery < 60
    UNION ALL
    SELECT 'speaking', speak_mastery WHERE speak_mastery < 60
    UNION ALL
    SELECT 'reading', read_mastery WHERE read_mastery < 60
    UNION ALL
    SELECT 'writing', write_mastery WHERE write_mastery < 60
  ) weak_skills
  WHERE mastery < 60;
  
  -- Get recommended lessons (lessons not yet completed or with low scores)
  SELECT jsonb_agg(lesson_id ORDER BY RANDOM()) INTO recommended_list
  FROM (
    SELECT DISTINCT lesson_id
    FROM public.exercise_results
    WHERE user_id = user_uuid 
      AND score < 70
    ORDER BY RANDOM()
    LIMIT 5
  ) recommended;
  
  -- Upsert analytics
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
    strengths,
    weaknesses,
    recommended_lessons,
    current_streak_days,
    longest_streak_days,
    last_activity_date,
    updated_at
  ) VALUES (
    user_uuid,
    lessons_count,
    exercises_count,
    total_time,
    avg_score,
    vocab_mastery,
    listen_mastery,
    speak_mastery,
    read_mastery,
    write_mastery,
    COALESCE(strength_list, '[]'::jsonb),
    COALESCE(weakness_list, '[]'::jsonb),
    COALESCE(recommended_list, '[]'::jsonb),
    current_streak,
    GREATEST(longest_streak, current_streak),
    last_activity,
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_lessons_completed = EXCLUDED.total_lessons_completed,
    total_exercises_completed = EXCLUDED.total_exercises_completed,
    total_time_spent_minutes = EXCLUDED.total_time_spent_minutes,
    average_score = EXCLUDED.average_score,
    vocabulary_mastery = EXCLUDED.vocabulary_mastery,
    listening_mastery = EXCLUDED.listening_mastery,
    speaking_mastery = EXCLUDED.speaking_mastery,
    reading_mastery = EXCLUDED.reading_mastery,
    writing_mastery = EXCLUDED.writing_mastery,
    strengths = EXCLUDED.strengths,
    weaknesses = EXCLUDED.weaknesses,
    recommended_lessons = EXCLUDED.recommended_lessons,
    current_streak_days = EXCLUDED.current_streak_days,
    longest_streak_days = GREATEST(public.learning_analytics.longest_streak_days, EXCLUDED.longest_streak_days),
    last_activity_date = EXCLUDED.last_activity_date,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Setup Complete! 🎉
-- ============================================================================
-- Bây giờ bạn có:
-- ✅ learning_progress - Theo dõi tiến độ từng lesson
-- ✅ exercise_results - Lưu kết quả bài tập chi tiết
-- ✅ learning_analytics - Phân tích tổng hợp
-- ✅ daily_activities - Theo dõi streak
-- ✅ Helper functions để tính toán analytics
-- 
-- Next steps:
-- 1. Integrate vào Exercises component để lưu kết quả
-- 2. Tạo LearningAnalytics component để hiển thị
-- 3. Tạo PersonalizedRecommendations component
-- ============================================================================