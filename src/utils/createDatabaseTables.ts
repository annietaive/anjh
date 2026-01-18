// Script to create all necessary database tables for EngMastery
import { getSupabaseClient } from './supabase/client';

export async function createDatabaseTables() {
  console.log('🗄️ Creating database tables...');
  
  try {
    const supabase = await getSupabaseClient();
    
    // Test connection
    const { error: testError } = await supabase.from('user_profiles').select('user_id').limit(1);
    if (testError && testError.message.includes('Failed to fetch')) {
      throw new Error('❌ Không thể kết nối Supabase. Vui lòng kết nối Supabase project trước.');
    }
    
    console.log('✅ Supabase connection verified');
    
    // Execute SQL to create tables
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        -- 1. User profiles table (if not exists)
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
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON public.learning_progress(user_id);
        CREATE INDEX IF NOT EXISTS idx_exercise_results_user ON public.exercise_results(user_id);
        CREATE INDEX IF NOT EXISTS idx_daily_activities_user ON public.daily_activities(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
        CREATE INDEX IF NOT EXISTS idx_user_profiles_grade ON public.user_profiles(grade);

        -- Enable Row Level Security
        ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.exercise_results ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.daily_activities ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.learning_analytics ENABLE ROW LEVEL SECURITY;

        -- Create policies (allow authenticated users to access their own data)
        DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
        CREATE POLICY "Users can view own profile" ON public.user_profiles
          FOR SELECT USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
        CREATE POLICY "Users can update own profile" ON public.user_profiles
          FOR UPDATE USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can view own progress" ON public.learning_progress;
        CREATE POLICY "Users can view own progress" ON public.learning_progress
          FOR SELECT USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can insert own progress" ON public.learning_progress;
        CREATE POLICY "Users can insert own progress" ON public.learning_progress
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can update own progress" ON public.learning_progress;
        CREATE POLICY "Users can update own progress" ON public.learning_progress
          FOR UPDATE USING (auth.uid() = user_id);

        -- Similar policies for other tables
        DROP POLICY IF EXISTS "Users can view own results" ON public.exercise_results;
        CREATE POLICY "Users can view own results" ON public.exercise_results
          FOR SELECT USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can insert own results" ON public.exercise_results;
        CREATE POLICY "Users can insert own results" ON public.exercise_results
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can view own activities" ON public.daily_activities;
        CREATE POLICY "Users can view own activities" ON public.daily_activities
          FOR SELECT USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can insert own activities" ON public.daily_activities;
        CREATE POLICY "Users can insert own activities" ON public.daily_activities
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can view own analytics" ON public.learning_analytics;
        CREATE POLICY "Users can view own analytics" ON public.learning_analytics
          FOR SELECT USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can insert own analytics" ON public.learning_analytics;
        CREATE POLICY "Users can insert own analytics" ON public.learning_analytics
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can update own analytics" ON public.learning_analytics;
        CREATE POLICY "Users can update own analytics" ON public.learning_analytics
          FOR UPDATE USING (auth.uid() = user_id);

        -- Teachers can view all student data
        DROP POLICY IF EXISTS "Teachers can view all profiles" ON public.user_profiles;
        CREATE POLICY "Teachers can view all profiles" ON public.user_profiles
          FOR SELECT USING (
            auth.uid() IN (
              SELECT user_id FROM public.user_profiles WHERE role = 'teacher'
            )
          );

        DROP POLICY IF EXISTS "Teachers can view all progress" ON public.learning_progress;
        CREATE POLICY "Teachers can view all progress" ON public.learning_progress
          FOR SELECT USING (
            auth.uid() IN (
              SELECT user_id FROM public.user_profiles WHERE role = 'teacher'
            )
          );

        DROP POLICY IF EXISTS "Teachers can view all analytics" ON public.learning_analytics;
        CREATE POLICY "Teachers can view all analytics" ON public.learning_analytics
          FOR SELECT USING (
            auth.uid() IN (
              SELECT user_id FROM public.user_profiles WHERE role = 'teacher'
            )
          );
      `
    });
    
    if (error) {
      // If exec_sql function doesn't exist, try creating tables directly
      console.log('⚠️ exec_sql function not available, creating tables individually...');
      
      const tables = [
        {
          name: 'user_profiles',
          sql: `CREATE TABLE IF NOT EXISTS public.user_profiles (
            user_id UUID PRIMARY KEY,
            name TEXT NOT NULL,
            username TEXT UNIQUE NOT NULL,
            email TEXT NOT NULL,
            grade INTEGER NOT NULL,
            role TEXT NOT NULL DEFAULT 'student',
            avatar_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )`
        },
        {
          name: 'learning_progress',
          sql: `CREATE TABLE IF NOT EXISTS public.learning_progress (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL,
            lesson_id INTEGER NOT NULL,
            completed BOOLEAN DEFAULT false,
            score REAL,
            time_spent_minutes INTEGER DEFAULT 0,
            completed_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, lesson_id)
          )`
        },
        {
          name: 'exercise_results',
          sql: `CREATE TABLE IF NOT EXISTS public.exercise_results (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL,
            lesson_id INTEGER NOT NULL,
            exercise_type TEXT NOT NULL,
            score REAL NOT NULL,
            total_questions INTEGER NOT NULL,
            correct_answers INTEGER NOT NULL,
            time_spent_seconds INTEGER DEFAULT 0,
            completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )`
        },
        {
          name: 'daily_activities',
          sql: `CREATE TABLE IF NOT EXISTS public.daily_activities (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL,
            activity_date DATE NOT NULL,
            lessons_completed INTEGER DEFAULT 0,
            exercises_completed INTEGER DEFAULT 0,
            time_spent_minutes INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, activity_date)
          )`
        },
        {
          name: 'learning_analytics',
          sql: `CREATE TABLE IF NOT EXISTS public.learning_analytics (
            user_id UUID PRIMARY KEY,
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
          )`
        }
      ];
      
      // Note: Supabase doesn't allow direct SQL execution from client
      // User needs to run this SQL in Supabase SQL Editor
      throw new Error(
        'Cần tạo tables trong Supabase SQL Editor. Vui lòng:\n' +
        '1. Mở Supabase Dashboard\n' +
        '2. Vào SQL Editor\n' +
        '3. Copy và chạy SQL từ file /docs/database-schema.sql'
      );
    }
    
    console.log('✅ All tables created successfully!');
    return {
      success: true,
      message: 'Đã tạo thành công tất cả các bảng database!'
    };
    
  } catch (error: any) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
}
