-- ============================================================================
-- EngMastery Database Schema
-- ============================================================================
-- This schema defines all tables needed for analytics and progress tracking
-- Run this in your Supabase SQL Editor to create the database tables
-- ============================================================================

-- ============================================================================
-- 1. LEARNING PROGRESS TABLE
-- ============================================================================
-- Tracks user progress for each lesson (vocabulary, exercises, etc.)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL,
  grade INTEGER NOT NULL CHECK (grade IN (6, 7, 8, 9)),
  
  -- Skill completion flags
  vocabulary_completed BOOLEAN DEFAULT FALSE,
  listening_completed BOOLEAN DEFAULT FALSE,
  speaking_completed BOOLEAN DEFAULT FALSE,
  reading_completed BOOLEAN DEFAULT FALSE,
  writing_completed BOOLEAN DEFAULT FALSE,
  
  -- Progress tracking
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  time_spent_minutes INTEGER DEFAULT 0,
  
  -- Timestamps
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Composite unique constraint
  UNIQUE(user_id, lesson_id)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON public.learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_lesson_id ON public.learning_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_grade ON public.learning_progress(grade);

-- Enable Row Level Security
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own progress"
  ON public.learning_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.learning_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.learning_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 2. EXERCISE RESULTS TABLE
-- ============================================================================
-- Stores detailed results from completed exercises
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.exercise_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL,
  exercise_type TEXT NOT NULL CHECK (exercise_type IN ('vocabulary', 'listening', 'speaking', 'reading', 'writing', 'grammar', 'mixed')),
  
  -- Score tracking
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  
  -- Detailed answers (JSONB for flexible storage)
  answers JSONB DEFAULT '[]'::jsonb,
  
  -- Time tracking
  time_spent_seconds INTEGER DEFAULT 0,
  
  -- Timestamps
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_exercise_results_user_id ON public.exercise_results(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_results_lesson_id ON public.exercise_results(lesson_id);
CREATE INDEX IF NOT EXISTS idx_exercise_results_completed_at ON public.exercise_results(completed_at);

-- Enable RLS
ALTER TABLE public.exercise_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own results"
  ON public.exercise_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own results"
  ON public.exercise_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 3. LEARNING ANALYTICS TABLE
-- ============================================================================
-- Aggregated analytics and statistics for each user
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.learning_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Overall statistics
  total_lessons_completed INTEGER DEFAULT 0,
  total_exercises_completed INTEGER DEFAULT 0,
  total_time_spent_minutes INTEGER DEFAULT 0,
  average_score NUMERIC(5,2) DEFAULT 0,
  
  -- Skill mastery (0-100)
  vocabulary_mastery NUMERIC(5,2) DEFAULT 0,
  listening_mastery NUMERIC(5,2) DEFAULT 0,
  speaking_mastery NUMERIC(5,2) DEFAULT 0,
  reading_mastery NUMERIC(5,2) DEFAULT 0,
  writing_mastery NUMERIC(5,2) DEFAULT 0,
  
  -- Insights
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  recommended_lessons INTEGER[] DEFAULT '{}',
  
  -- Streak tracking
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  
  -- Timestamps
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_learning_analytics_user_id ON public.learning_analytics(user_id);

-- Enable RLS
ALTER TABLE public.learning_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own analytics"
  ON public.learning_analytics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
  ON public.learning_analytics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics"
  ON public.learning_analytics FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 4. DAILY ACTIVITIES TABLE
-- ============================================================================
-- Tracks daily learning activity for streak calculations
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.daily_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  
  -- Daily counters
  lessons_completed INTEGER DEFAULT 0,
  exercises_completed INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Composite unique constraint
  UNIQUE(user_id, activity_date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_daily_activities_user_id ON public.daily_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activities_date ON public.daily_activities(activity_date);

-- Enable RLS
ALTER TABLE public.daily_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own activities"
  ON public.daily_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
  ON public.daily_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities"
  ON public.daily_activities FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 5. STORED PROCEDURE: UPDATE USER ANALYTICS
-- ============================================================================
-- Automatically calculates and updates user analytics based on exercise results
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_user_analytics(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  total_lessons INT;
  total_exercises INT;
  total_time INT;
  avg_score NUMERIC;
  vocab_mastery NUMERIC;
  listen_mastery NUMERIC;
  speak_mastery NUMERIC;
  read_mastery NUMERIC;
  write_mastery NUMERIC;
  current_streak INT;
  longest_streak INT;
  last_activity DATE;
BEGIN
  -- Calculate overall statistics from exercise_results
  SELECT 
    COUNT(DISTINCT lesson_id),
    COUNT(*),
    COALESCE(SUM(time_spent_seconds) / 60, 0),
    COALESCE(AVG(score), 0)
  INTO total_lessons, total_exercises, total_time, avg_score
  FROM public.exercise_results
  WHERE user_id = user_uuid;
  
  -- Calculate skill mastery from exercise_results
  SELECT COALESCE(AVG(score), 0) INTO vocab_mastery
  FROM public.exercise_results
  WHERE user_id = user_uuid AND exercise_type IN ('vocabulary', 'mixed');
  
  SELECT COALESCE(AVG(score), 0) INTO listen_mastery
  FROM public.exercise_results
  WHERE user_id = user_uuid AND exercise_type = 'listening';
  
  SELECT COALESCE(AVG(score), 0) INTO speak_mastery
  FROM public.exercise_results
  WHERE user_id = user_uuid AND exercise_type = 'speaking';
  
  SELECT COALESCE(AVG(score), 0) INTO read_mastery
  FROM public.exercise_results
  WHERE user_id = user_uuid AND exercise_type = 'reading';
  
  SELECT COALESCE(AVG(score), 0) INTO write_mastery
  FROM public.exercise_results
  WHERE user_id = user_uuid AND exercise_type = 'writing';
  
  -- Calculate streak from daily_activities
  WITH streak_data AS (
    SELECT 
      activity_date,
      activity_date - (ROW_NUMBER() OVER (ORDER BY activity_date))::int AS streak_group
    FROM public.daily_activities
    WHERE user_id = user_uuid
    ORDER BY activity_date
  ),
  streak_lengths AS (
    SELECT 
      COUNT(*) as streak_length,
      MAX(activity_date) as streak_end
    FROM streak_data
    GROUP BY streak_group
  )
  SELECT 
    COALESCE(MAX(CASE 
      WHEN streak_end = CURRENT_DATE OR streak_end = CURRENT_DATE - 1 
      THEN streak_length 
      ELSE 0 
    END), 0),
    COALESCE(MAX(streak_length), 0)
  INTO current_streak, longest_streak
  FROM streak_lengths;
  
  -- Get last activity date
  SELECT MAX(activity_date) INTO last_activity
  FROM public.daily_activities
  WHERE user_id = user_uuid;
  
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
    current_streak_days,
    longest_streak_days,
    last_activity_date,
    updated_at
  ) VALUES (
    user_uuid,
    total_lessons,
    total_exercises,
    total_time,
    avg_score,
    vocab_mastery,
    listen_mastery,
    speak_mastery,
    read_mastery,
    write_mastery,
    current_streak,
    longest_streak,
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
    current_streak_days = EXCLUDED.current_streak_days,
    longest_streak_days = EXCLUDED.longest_streak_days,
    last_activity_date = EXCLUDED.last_activity_date,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 6. AUTO-UPDATE TRIGGERS
-- ============================================================================
-- Automatically update `updated_at` timestamp on record changes
-- ============================================================================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for learning_progress
DROP TRIGGER IF EXISTS update_learning_progress_updated_at ON public.learning_progress;
CREATE TRIGGER update_learning_progress_updated_at
  BEFORE UPDATE ON public.learning_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for learning_analytics
DROP TRIGGER IF EXISTS update_learning_analytics_updated_at ON public.learning_analytics;
CREATE TRIGGER update_learning_analytics_updated_at
  BEFORE UPDATE ON public.learning_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- DONE! 
-- ============================================================================
-- All tables, indexes, RLS policies, and functions have been created
-- The app will now be able to save and retrieve learning analytics data
-- ============================================================================
