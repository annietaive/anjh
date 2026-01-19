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

// Main function - accepts full data object
export async function saveExerciseResult(data: {
  userId: string;
  lessonId: number;
  exerciseType: 'vocabulary' | 'listening' | 'speaking' | 'reading' | 'writing' | 'grammar' | 'mixed';
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  answers: any[];
  timeSpentSeconds: number;
}): Promise<any>;

// Overload - accepts simple parameters for backward compatibility
export async function saveExerciseResult(
  userId: string, 
  lessonId: number, 
  score: number, 
  unit: number
): Promise<any>;

// Implementation
export async function saveExerciseResult(
  dataOrUserId: any,
  lessonId?: number,
  score?: number,
  unit?: number
): Promise<any> {
  // Determine if called with object or individual parameters
  let data: any;
  
  if (typeof dataOrUserId === 'object') {
    // Called with full data object
    data = dataOrUserId;
  } else {
    // Called with individual parameters - create data object
    data = {
      userId: dataOrUserId,
      lessonId: lessonId!,
      exerciseType: 'mixed' as const,
      score: score!,
      totalQuestions: 1,
      correctAnswers: Math.round(score! / 100),
      answers: [],
      timeSpentSeconds: 0
    };
  }

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
        
        // Save to localStorage instead
        try {
          const results = JSON.parse(localStorage.getItem('exercise_results') || '[]');
          results.push({
            userId: data.userId,
            lessonId: data.lessonId,
            exerciseType: data.exerciseType,
            score: data.score,
            totalQuestions: data.totalQuestions,
            correctAnswers: data.correctAnswers,
            answers: data.answers,
            completedAt: new Date().toISOString()
          });
          localStorage.setItem('exercise_results', JSON.stringify(results));
          console.log('[Analytics] Saved to localStorage fallback');
        } catch (e) {
          console.error('[Analytics] Error saving to localStorage:', e);
        }
        
        return null;
      }
      throw error;
    }

    return result;
  } catch (error: any) {
    console.error('Error saving exercise result:', error);
    
    // Try localStorage fallback
    try {
      const results = JSON.parse(localStorage.getItem('exercise_results') || '[]');
      results.push({
        userId: data.userId,
        lessonId: data.lessonId,
        exerciseType: data.exerciseType,
        score: data.score,
        totalQuestions: data.totalQuestions,
        correctAnswers: data.correctAnswers,
        answers: data.answers,
        completedAt: new Date().toISOString()
      });
      localStorage.setItem('exercise_results', JSON.stringify(results));
      console.log('[Analytics] Saved to localStorage fallback after error');
    } catch (e) {
      console.error('[Analytics] Error saving to localStorage:', e);
    }
    
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
        grade: 6, // TODO: Get from user profile
        progress_percentage: progressData.progress_percentage || 0,
        time_spent_minutes: 0,
        completed_at: progressData.progress_percentage === 100 ? new Date().toISOString() : null,
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

// Overload 1 - with activityType and metadata
export async function logDailyActivity(
  userId: string,
  activityType: 'lesson_viewed' | 'exercise_completed' | 'vocabulary_learned',
  metadata: any
): Promise<void>;

// Overload 2 - simple userId only (for backward compatibility)
export async function logDailyActivity(userId: string): Promise<void>;

// Implementation
export async function logDailyActivity(
  userId: string,
  activityType?: 'lesson_viewed' | 'exercise_completed' | 'vocabulary_learned',
  metadata?: any
): Promise<void> {
  // Default to 'exercise_completed' if not specified
  const type = activityType || 'exercise_completed';
  
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
      const updates: any = {};

      if (type === 'lesson_viewed') {
        updates.lessons_completed = (existing.lessons_completed || 0) + 1;
      } else if (type === 'exercise_completed') {
        updates.exercises_completed = (existing.exercises_completed || 0) + 1;
      }
      // Note: vocabulary_learned is not in the schema, so skip it

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
          lessons_completed: type === 'lesson_viewed' ? 1 : 0,
          exercises_completed: type === 'exercise_completed' ? 1 : 0,
          time_spent_minutes: 0,
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

  // If no database analytics, calculate from exercise_results or fallback to localStorage
  if (!analytics) {
    console.log('[Analytics] No user_analytics view, calculating from exercise_results...');
    
    try {
      const supabase = await getSupabaseClient();
      
      // Query all exercise results for this user
      const { data: exerciseResults, error } = await supabase
        .from('exercise_results')
        .select('*')
        .eq('user_id', userId);
      
      if (!error && exerciseResults && exerciseResults.length > 0) {
        console.log(`[Analytics] Found ${exerciseResults.length} exercise results, calculating stats...`);
        
        // Calculate overall stats
        const totalExercises = exerciseResults.length;
        const totalScore = exerciseResults.reduce((sum, r) => sum + (r.score || 0), 0);
        const totalTime = exerciseResults.reduce((sum, r) => sum + (r.time_spent_seconds || 0), 0);
        const avgScore = totalExercises > 0 ? totalScore / totalExercises : 0;
        
        // Calculate stats by type
        const calculateSkillStats = (type: string) => {
          const results = exerciseResults.filter(r => r.exercise_type === type);
          if (results.length === 0) return 0;
          const totalScore = results.reduce((sum, r) => sum + (r.score || 0), 0);
          return Math.round(totalScore / results.length);
        };
        
        const vocabularyMastery = calculateSkillStats('vocabulary');
        const listeningMastery = calculateSkillStats('listening');
        const speakingMastery = calculateSkillStats('speaking');
        const readingMastery = calculateSkillStats('reading');
        const writingMastery = calculateSkillStats('writing');
        
        // Calculate skill details
        const calculateSkillDetails = (results: any[]) => {
          if (results.length === 0) return {
            averageScore: 0,
            totalExercises: 0,
            totalCorrect: 0,
            totalQuestions: 0,
            accuracy: 0
          };
          
          const totalScore = results.reduce((sum, r) => sum + (r.score || 0), 0);
          const totalCorrect = results.reduce((sum, r) => sum + (r.correct_answers || 0), 0);
          const totalQuestions = results.reduce((sum, r) => sum + (r.total_questions || 1), 0);
          
          return {
            averageScore: Math.round(totalScore / results.length),
            totalExercises: results.length,
            totalCorrect: totalCorrect,
            totalQuestions: totalQuestions,
            accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
          };
        };
        
        const skillDetails = {
          vocabulary: calculateSkillDetails(exerciseResults.filter(r => r.exercise_type === 'vocabulary')),
          listening: calculateSkillDetails(exerciseResults.filter(r => r.exercise_type === 'listening')),
          speaking: calculateSkillDetails(exerciseResults.filter(r => r.exercise_type === 'speaking')),
          reading: calculateSkillDetails(exerciseResults.filter(r => r.exercise_type === 'reading')),
          writing: calculateSkillDetails(exerciseResults.filter(r => r.exercise_type === 'writing')),
        };
        
        // Get unique lessons
        const uniqueLessons = new Set(exerciseResults.map(r => r.lesson_id));
        
        // Calculate weekly stats from recent activities
        const weeklyLessons = recentActivities?.reduce((sum, day) => sum + day.lessons_completed, 0) || 0;
        const weeklyExercises = recentActivities?.reduce((sum, day) => sum + day.exercises_completed, 0) || 0;
        const weeklyTime = recentActivities?.reduce((sum, day) => sum + day.time_spent_minutes, 0) || 0;
        
        // Calculate streak from daily_activities
        let currentStreak = 0;
        if (recentActivities && recentActivities.length > 0) {
          // Sort by date descending
          const sortedActivities = recentActivities.sort((a, b) => 
            new Date(b.activity_date).getTime() - new Date(a.activity_date).getTime()
          );
          
          // Check if there's activity today or yesterday
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          const lastActivityDate = new Date(sortedActivities[0].activity_date);
          lastActivityDate.setHours(0, 0, 0, 0);
          
          if (lastActivityDate.getTime() === today.getTime() || lastActivityDate.getTime() === yesterday.getTime()) {
            // Count consecutive days
            let checkDate = new Date(lastActivityDate);
            for (const activity of sortedActivities) {
              const activityDate = new Date(activity.activity_date);
              activityDate.setHours(0, 0, 0, 0);
              
              if (activityDate.getTime() === checkDate.getTime()) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
              } else {
                break;
              }
            }
          }
        }
        
        console.log('[Analytics] Calculated stats:', {
          totalExercises,
          totalLessons: uniqueLessons.size,
          avgScore: Math.round(avgScore),
          currentStreak
        });
        
        return {
          overall: {
            totalLessons: uniqueLessons.size,
            totalExercises: totalExercises,
            totalTime: Math.round(totalTime / 60), // Convert seconds to minutes
            averageScore: Math.round(avgScore),
          },
          weekly: {
            lessons: weeklyLessons,
            exercises: weeklyExercises,
            time: weeklyTime,
          },
          skills: {
            vocabulary: vocabularyMastery || 0,
            listening: listeningMastery || 0,
            speaking: speakingMastery || 0,
            reading: readingMastery || 0,
            writing: writingMastery || 0,
          },
          skillDetails: skillDetails,
          streak: {
            current: currentStreak,
            longest: currentStreak, // For now, use current as longest
          }
        };
      }
    } catch (error) {
      console.error('[Analytics] Error calculating from exercise_results:', error);
    }
    
    // Final fallback to localStorage
    console.log('[Analytics] No database data, trying localStorage...');
    const { getLocalStatistics } = await import('./localStorageAnalytics');
    return getLocalStatistics(userId);
  }

  // Get detailed exercise results from database for skill details
  let skillDetails = null;
  try {
    const supabase = await getSupabaseClient();
    
    // Query all exercise results for this user
    const { data: exerciseResults, error } = await supabase
      .from('exercise_results')
      .select('*')
      .eq('user_id', userId);
    
    if (!error && exerciseResults && exerciseResults.length > 0) {
      // Calculate detailed stats for each skill
      const calculateSkillDetails = (results: any[]) => {
        if (results.length === 0) return {
          averageScore: 0,
          totalExercises: 0,
          totalCorrect: 0,
          totalQuestions: 0,
          accuracy: 0
        };
        
        const totalScore = results.reduce((sum, r) => sum + (r.score || 0), 0);
        const totalCorrect = results.reduce((sum, r) => sum + (r.correct_answers || 0), 0);
        const totalQuestions = results.reduce((sum, r) => sum + (r.total_questions || 1), 0);
        
        return {
          averageScore: Math.round(totalScore / results.length),
          totalExercises: results.length,
          totalCorrect: totalCorrect,
          totalQuestions: totalQuestions,
          accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
        };
      };
      
      // Filter results by exercise type
      const listeningResults = exerciseResults.filter(r => r.exercise_type === 'listening');
      const speakingResults = exerciseResults.filter(r => r.exercise_type === 'speaking');
      const readingResults = exerciseResults.filter(r => r.exercise_type === 'reading');
      const writingResults = exerciseResults.filter(r => r.exercise_type === 'writing');
      
      skillDetails = {
        listening: calculateSkillDetails(listeningResults),
        speaking: calculateSkillDetails(speakingResults),
        reading: calculateSkillDetails(readingResults),
        writing: calculateSkillDetails(writingResults),
      };
      
      console.log('[Analytics] Calculated skillDetails from database:', skillDetails);
    }
  } catch (error) {
    console.error('[Analytics] Error calculating skill details:', error);
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
    skillDetails: skillDetails, // ⭐ Added detailed skill stats
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