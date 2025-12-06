// ============================================================================
// Analytics & Progress Tracking
// ============================================================================
// This module provides analytics and progress tracking functionality.
// It uses Supabase database when available, with localStorage as fallback.
// ============================================================================

import { getSupabaseClient } from './supabase/client';

// ============================================================================
// Save Exercise Result
// ============================================================================

export async function saveExerciseResult(data: {
  userId: string;
  lessonId: number;
  exerciseType: 'vocabulary' | 'listening' | 'speaking' | 'reading' | 'writing' | 'grammar' | 'mixed';
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  answers: any[];
  timeSpentSeconds: number;
}) {
  try {
    const supabase = await getSupabaseClient();

    const { data: result, error } = await supabase
      .from('exercise_results')
      .insert({
        user_id: data.userId,
        lesson_id: data.lessonId,
        exercise_type: data.exerciseType,
        score: data.score,
        total_questions: data.totalQuestions,
        correct_answers: data.correctAnswers,
        answers: data.answers,
        time_spent_seconds: data.timeSpentSeconds,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // If table doesn't exist (PGRST205), silently return null
      if (error.code === 'PGRST205' || error.code === '42P01') {
        console.log('Table "exercise_results" not created yet. Skipping database save.');
        return null;
      }
      throw error;
    }

    return result;
  } catch (error: any) {
    console.error('Error saving exercise result:', error);
    // Return null instead of throwing to allow fallback
    return null;
  }
}

// ============================================================================
// Update Learning Progress
// ============================================================================

export async function updateLearningProgress(
  userId: string,
  lessonId: number,
  grade: number,
  progressData: {
    progress_percentage?: number;
    completed_at?: string | null;
  }
) {
  try {
    const supabase = await getSupabaseClient();

    const { data: result, error } = await supabase
      .from('learning_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        grade: grade,
        progress_percentage: progressData.progress_percentage || 0,
        completed_at: progressData.completed_at || null,
        last_accessed_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,lesson_id',
      })
      .select()
      .single();

    if (error) {
      // If table doesn't exist (PGRST205), silently return null
      if (error.code === 'PGRST205' || error.code === '42P01') {
        console.log('Table "learning_progress" not created yet. Skipping database save.');
        return null;
      }
      throw error;
    }

    return result;
  } catch (error: any) {
    console.error('Error updating learning progress:', error);
    // Return null instead of throwing to allow fallback
    return null;
  }
}

// ============================================================================
// Log Daily Activity
// ============================================================================

export async function logDailyActivity(
  userId: string,
  activityType: 'lesson_viewed' | 'exercise_completed' | 'vocabulary_learned',
  metadata: any
) {
  try {
    const supabase = await getSupabaseClient();

    const today = new Date().toISOString().split('T')[0];

    // Try to get existing activity for today
    const { data: existing } = await supabase
      .from('daily_activities')
      .select('*')
      .eq('user_id', userId)
      .eq('activity_date', today)
      .maybeSingle();

    if (existing) {
      // Update existing record
      const updates: any = {
        last_activity_at: new Date().toISOString(),
      };

      if (activityType === 'lesson_viewed') {
        updates.lessons_completed = (existing.lessons_completed || 0) + 1;
      } else if (activityType === 'exercise_completed') {
        updates.exercises_completed = (existing.exercises_completed || 0) + 1;
      } else if (activityType === 'vocabulary_learned') {
        updates.vocabulary_learned = (existing.vocabulary_learned || 0) + 1;
      }

      const { error } = await supabase
        .from('daily_activities')
        .update(updates)
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      // Create new record
      const { error } = await supabase
        .from('daily_activities')
        .insert({
          user_id: userId,
          activity_date: today,
          lessons_completed: activityType === 'lesson_viewed' ? 1 : 0,
          exercises_completed: activityType === 'exercise_completed' ? 1 : 0,
          vocabulary_learned: activityType === 'vocabulary_learned' ? 1 : 0,
          time_spent_minutes: 0,
          last_activity_at: new Date().toISOString(),
        });

      if (error) throw error;
    }
  } catch (error: any) {
    // If table doesn't exist (PGRST205), silently ignore
    if (error.code === 'PGRST205' || error.code === '42P01') {
      console.log('Table "daily_activities" not created yet. Skipping activity log.');
      return;
    }
    console.error('Error logging daily activity:', error);
  }
}

// ============================================================================
// Get Learning Analytics
// ============================================================================

export async function getLearningAnalytics(userId: string) {
  try {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      // If table doesn't exist, return null to trigger fallback
      if (error.code === 'PGRST205' || error.code === '42P01') {
        console.log('Table "user_analytics" not created yet. Will use localStorage fallback.');
        return null;
      }
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('Error getting learning analytics:', error);
    return null;
  }
}

// ============================================================================
// Get Daily Activities
// ============================================================================

export async function getDailyActivities(userId: string, days: number = 30) {
  try {
    const supabase = await getSupabaseClient();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('daily_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('activity_date', startDate.toISOString().split('T')[0])
      .order('activity_date', { ascending: false });

    if (error) {
      // If table doesn't exist, return empty array
      if (error.code === 'PGRST205' || error.code === '42P01') {
        console.log('Table "daily_activities" not created yet.');
        return [];
      }
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error('Error getting daily activities:', error);
    return [];
  }
}

// ============================================================================
// Get User Statistics (with localStorage fallback)
// ============================================================================

export async function getUserStatistics(userId: string) {
  const analytics = await getLearningAnalytics(userId);
  const recentActivities = await getDailyActivities(userId, 7);

  // If no database analytics, try localStorage
  if (!analytics) {
    const { getLocalStatistics } = await import('./localStorageAnalytics');
    return getLocalStatistics(userId);
  }

  // Calculate weekly stats
  const weeklyLessons = recentActivities.reduce((sum, day) => sum + day.lessons_completed, 0);
  const weeklyExercises = recentActivities.reduce((sum, day) => sum + day.exercises_completed, 0);
  const weeklyTime = recentActivities.reduce((sum, day) => sum + day.time_spent_minutes, 0);

  return {
    overall: {
      totalLessons: analytics.total_lessons_completed,
      totalExercises: analytics.total_exercises_completed,
      totalTime: analytics.total_time_spent_minutes,
      averageScore: Math.round(analytics.average_score),
    },
    weekly: {
      lessons: weeklyLessons,
      exercises: weeklyExercises,
      time: weeklyTime,
    },
    skills: {
      vocabulary: Math.round(analytics.vocabulary_mastery),
      listening: Math.round(analytics.listening_mastery),
      speaking: Math.round(analytics.speaking_mastery),
      reading: Math.round(analytics.reading_mastery),
      writing: Math.round(analytics.writing_mastery),
    },
    streak: {
      current: analytics.current_streak_days,
      longest: analytics.longest_streak_days,
    }
  };
}

// ============================================================================
// Get Personalized Recommendations (with localStorage fallback)
// ============================================================================

export async function getPersonalizedRecommendations(userId: string) {
  // Get user's analytics
  const analytics = await getLearningAnalytics(userId);
  
  // If no database analytics, try localStorage
  if (!analytics) {
    const { getLocalRecommendations } = await import('./localStorageAnalytics');
    return getLocalRecommendations(userId);
  }

  // Identify weak skills (below 60%)
  const skills = [
    { name: 'vocabulary', mastery: analytics.vocabulary_mastery, label: 'Từ vựng' },
    { name: 'listening', mastery: analytics.listening_mastery, label: 'Nghe' },
    { name: 'speaking', mastery: analytics.speaking_mastery, label: 'Nói' },
    { name: 'reading', mastery: analytics.reading_mastery, label: 'Đọc' },
    { name: 'writing', mastery: analytics.writing_mastery, label: 'Viết' },
  ];

  const weakSkills = skills
    .filter(skill => skill.mastery < 60)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 2);

  // Get recommended lessons from analytics
  const recommendedLessons = analytics.recommended_lessons || [];

  // Generate next steps
  const nextSteps = [];
  
  if (weakSkills.length > 0) {
    nextSteps.push(`Tập trung vào kỹ năng ${weakSkills[0].label.toLowerCase()} (${Math.round(weakSkills[0].mastery)}%)`);
  }
  
  if (analytics.current_streak_days === 0) {
    nextSteps.push('Bắt đầu streak mới bằng cách hoàn thành 1 bài tập hôm nay');
  } else {
    nextSteps.push(`Duy trì streak ${analytics.current_streak_days} ngày của bạn!`);
  }

  if (analytics.average_score < 70) {
    nextSteps.push('Ôn tập lại các bài đã học để cải thiện điểm số');
  }

  return {
    weakSkills,
    recommendedLessons,
    nextSteps
  };
}
