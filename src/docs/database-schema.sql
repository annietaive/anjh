-- EngMastery Database Schema
-- Run this SQL in Supabase SQL Editor to create all necessary tables
-- This script is IDEMPOTENT - safe to run multiple times

-- ============================================================================
-- STEP 1: Create Tables
-- ============================================================================

-- 1. User profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  grade INTEGER NOT NULL CHECK (grade BETWEEN 6 AND 9),
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Learning progress table
CREATE TABLE IF NOT EXISTS public.learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  score REAL,
  time_spent_minutes INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 3. Exercise results table
CREATE TABLE IF NOT EXISTS public.exercise_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL,
  exercise_type TEXT NOT NULL CHECK (exercise_type IN ('listening', 'speaking', 'reading', 'writing')),
  score REAL NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  time_spent_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Daily activities table
CREATE TABLE IF NOT EXISTS public.daily_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  lessons_completed INTEGER DEFAULT 0,
  exercises_completed INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

-- 5. Learning analytics table
CREATE TABLE IF NOT EXISTS public.learning_analytics (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_lessons_completed INTEGER DEFAULT 0,
  total_exercises_completed INTEGER DEFAULT 0,
  total_time_spent_minutes INTEGER DEFAULT 0,
  average_score REAL DEFAULT 0,
  vocabulary_mastery REAL DEFAULT 0,
  listening_mastery REAL DEFAULT 0,
  speaking_mastery REAL DEFAULT 0,
  reading_mastery REAL DEFAULT 0,
  writing_mastery REAL DEFAULT 0,
  current_streak_days INTEGER DEFAULT 0,
  longest_streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- STEP 2: Create Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON public.learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_lesson ON public.learning_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_exercise_results_user ON public.exercise_results(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_results_lesson ON public.exercise_results(lesson_id);
CREATE INDEX IF NOT EXISTS idx_exercise_results_type ON public.exercise_results(exercise_type);
CREATE INDEX IF NOT EXISTS idx_daily_activities_user ON public.daily_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activities_date ON public.daily_activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_grade ON public.user_profiles(grade);

-- ============================================================================
-- STEP 3: Enable Row Level Security
-- ============================================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_analytics ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 4: Drop ALL Existing Policies (Safe Cleanup)
-- ============================================================================

DO $$ 
DECLARE
  policy_record RECORD;
BEGIN
  -- Drop all policies on user_profiles
  FOR policy_record IN 
    SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_profiles', policy_record.policyname);
  END LOOP;

  -- Drop all policies on learning_progress
  FOR policy_record IN 
    SELECT policyname FROM pg_policies WHERE tablename = 'learning_progress' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.learning_progress', policy_record.policyname);
  END LOOP;

  -- Drop all policies on exercise_results
  FOR policy_record IN 
    SELECT policyname FROM pg_policies WHERE tablename = 'exercise_results' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.exercise_results', policy_record.policyname);
  END LOOP;

  -- Drop all policies on daily_activities
  FOR policy_record IN 
    SELECT policyname FROM pg_policies WHERE tablename = 'daily_activities' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.daily_activities', policy_record.policyname);
  END LOOP;

  -- Drop all policies on learning_analytics
  FOR policy_record IN 
    SELECT policyname FROM pg_policies WHERE tablename = 'learning_analytics' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.learning_analytics', policy_record.policyname);
  END LOOP;

  RAISE NOTICE '✅ All existing policies dropped successfully';
END $$;

-- ============================================================================
-- STEP 5: Create Fresh Policies
-- ============================================================================

-- Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access to profiles" ON public.user_profiles
  FOR ALL USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- Policies for learning_progress
CREATE POLICY "Users can view own progress" ON public.learning_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.learning_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.learning_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to progress" ON public.learning_progress
  FOR ALL USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- Policies for exercise_results
CREATE POLICY "Users can view own results" ON public.exercise_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own results" ON public.exercise_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access to results" ON public.exercise_results
  FOR ALL USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- Policies for daily_activities
CREATE POLICY "Users can view own activities" ON public.daily_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities" ON public.daily_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities" ON public.daily_activities
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to activities" ON public.daily_activities
  FOR ALL USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- Policies for learning_analytics
CREATE POLICY "Users can view own analytics" ON public.learning_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON public.learning_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics" ON public.learning_analytics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to analytics" ON public.learning_analytics
  FOR ALL USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- ============================================================================
-- STEP 6: Grant Permissions
-- ============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ============================================================================
-- Success Message
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Database Schema Updated Successfully!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Tables created/updated:';
  RAISE NOTICE '  ✓ user_profiles';
  RAISE NOTICE '  ✓ learning_progress';
  RAISE NOTICE '  ✓ exercise_results';
  RAISE NOTICE '  ✓ daily_activities';
  RAISE NOTICE '  ✓ learning_analytics';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 Security configured:';
  RAISE NOTICE '  ✓ Row Level Security enabled';
  RAISE NOTICE '  ✓ User policies created';
  RAISE NOTICE '  ✓ Service role policies created';
  RAISE NOTICE '';
  RAISE NOTICE '⚡ Performance optimizations:';
  RAISE NOTICE '  ✓ Indexes created';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Ready to seed students!';
  RAISE NOTICE '';
END $$;