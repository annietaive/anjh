// ============================================================================
// Analytics Test Helper
// ============================================================================
// Helper functions để test analytics trong development
// ============================================================================

import { saveExerciseResult, updateLearningProgress, logDailyActivity } from './analytics';

/**
 * Generate mock exercise data để test analytics
 */
export async function generateMockExerciseData(userId: string, grade: number) {
  console.log('🧪 Generating mock exercise data for analytics testing...');

  // Generate 10 bài tập với scores ngẫu nhiên
  const exerciseTypes: Array<'vocabulary' | 'listening' | 'speaking' | 'reading' | 'writing' | 'grammar' | 'mixed'> = 
    ['vocabulary', 'listening', 'speaking', 'reading', 'writing', 'grammar', 'mixed'];

  const lessons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  for (let i = 0; i < lessons.length; i++) {
    const lessonId = lessons[i];
    const exerciseType = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
    const score = Math.floor(Math.random() * 40) + 60; // Score từ 60-100
    const totalQuestions = 10;
    const correctAnswers = Math.floor((score / 100) * totalQuestions);

    try {
      // Save exercise result
      await saveExerciseResult({
        userId,
        lessonId,
        exerciseType,
        score,
        totalQuestions,
        correctAnswers,
        answers: Array.from({ length: totalQuestions }, (_, idx) => ({
          questionId: idx + 1,
          question: `Mock question ${idx + 1}`,
          userAnswer: 'Mock answer',
          correctAnswer: 'Correct answer',
          isCorrect: idx < correctAnswers,
          timeSpent: Math.floor(Math.random() * 30) + 10,
        })),
        timeSpentSeconds: Math.floor(Math.random() * 300) + 60,
      });

      // Update learning progress
      await updateLearningProgress(userId, lessonId, grade, {
        progress_percentage: score >= 70 ? 100 : score,
        completed_at: score >= 70 ? new Date().toISOString() : null,
      });

      // Log daily activity (vary the dates)
      const daysAgo = Math.floor(Math.random() * 7);
      const activityDate = new Date();
      activityDate.setDate(activityDate.getDate() - daysAgo);
      
      await logDailyActivity(userId, 'exercise_completed', {
        lessonId,
        score,
        totalQuestions,
        correctAnswers,
        timeSpentMinutes: Math.floor(Math.random() * 20) + 5,
      });

      console.log(`✅ Generated mock data for lesson ${lessonId} (${exerciseType}, score: ${score}%)`);
    } catch (error) {
      console.error(`❌ Error generating mock data for lesson ${lessonId}:`, error);
    }

    // Small delay để không overwhelm database
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('✅ Mock exercise data generation complete!');
  console.log('📊 Check your analytics dashboard to see the results');
}

/**
 * Clear tất cả analytics data cho một user (development only!)
 */
export async function clearUserAnalyticsData(userId: string) {
  console.warn('⚠️ Clearing all analytics data for user:', userId);
  
  const { getSupabaseClient } = await import('./supabase/client');
  const supabase = await getSupabaseClient();

  try {
    // Delete exercise results
    const { error: exerciseError } = await supabase
      .from('exercise_results')
      .delete()
      .eq('user_id', userId);

    if (exerciseError) {
      console.error('Error deleting exercise results:', exerciseError);
    } else {
      console.log('✅ Deleted exercise results');
    }

    // Delete learning progress
    const { error: progressError } = await supabase
      .from('learning_progress')
      .delete()
      .eq('user_id', userId);

    if (progressError) {
      console.error('Error deleting learning progress:', progressError);
    } else {
      console.log('✅ Deleted learning progress');
    }

    // Delete learning analytics
    const { error: analyticsError } = await supabase
      .from('learning_analytics')
      .delete()
      .eq('user_id', userId);

    if (analyticsError) {
      console.error('Error deleting learning analytics:', analyticsError);
    } else {
      console.log('✅ Deleted learning analytics');
    }

    // Delete daily activities
    const { error: activitiesError } = await supabase
      .from('daily_activities')
      .delete()
      .eq('user_id', userId);

    if (activitiesError) {
      console.error('Error deleting daily activities:', activitiesError);
    } else {
      console.log('✅ Deleted daily activities');
    }

    console.log('✅ All analytics data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing analytics data:', error);
  }
}

/**
 * View analytics summary trong console
 */
export async function viewAnalyticsSummary(userId: string) {
  console.log('📊 Analytics Summary for user:', userId);
  console.log('─'.repeat(50));

  const { getSupabaseClient } = await import('./supabase/client');
  const supabase = await getSupabaseClient();

  try {
    // Get analytics
    const { data: analytics, error: analyticsError } = await supabase
      .from('learning_analytics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (analyticsError || !analytics) {
      console.log('❌ No analytics data found');
      return;
    }

    console.log('📈 Overall Statistics:');
    console.log(`  • Total Lessons: ${analytics.total_lessons_completed}`);
    console.log(`  • Total Exercises: ${analytics.total_exercises_completed}`);
    console.log(`  • Average Score: ${analytics.average_score}%`);
    console.log(`  • Total Time: ${analytics.total_time_spent_minutes} minutes`);
    console.log();

    console.log('🎯 Skill Mastery:');
    console.log(`  • Vocabulary: ${analytics.vocabulary_mastery}%`);
    console.log(`  • Listening: ${analytics.listening_mastery}%`);
    console.log(`  • Speaking: ${analytics.speaking_mastery}%`);
    console.log(`  • Reading: ${analytics.reading_mastery}%`);
    console.log(`  • Writing: ${analytics.writing_mastery}%`);
    console.log();

    console.log('🔥 Streak:');
    console.log(`  • Current: ${analytics.current_streak_days} days`);
    console.log(`  • Longest: ${analytics.longest_streak_days} days`);
    console.log();

    console.log('💪 Strengths:', analytics.strengths);
    console.log('📚 Weaknesses:', analytics.weaknesses);
    console.log('📖 Recommended Lessons:', analytics.recommended_lessons);

    console.log('─'.repeat(50));

    // Get recent activities
    const { data: activities } = await supabase
      .from('daily_activities')
      .select('*')
      .eq('user_id', userId)
      .order('activity_date', { ascending: false })
      .limit(7);

    if (activities && activities.length > 0) {
      console.log('📅 Recent Activity (Last 7 Days):');
      activities.forEach(activity => {
        console.log(`  ${activity.activity_date}: ${activity.exercises_completed} exercises, ${activity.lessons_completed} lessons, ${activity.time_spent_minutes}min`);
      });
    }

  } catch (error) {
    console.error('❌ Error fetching analytics summary:', error);
  }
}

/**
 * Debug helper - print all available functions
 */
export function showTestHelperCommands() {
  console.log('🧪 Analytics Test Helper Commands');
  console.log('─'.repeat(50));
  console.log('Available functions:');
  console.log('  • generateMockExerciseData(userId, grade)');
  console.log('    → Generate mock exercise data for testing');
  console.log('  • clearUserAnalyticsData(userId)');
  console.log('    → Clear all analytics data for a user');
  console.log('  • viewAnalyticsSummary(userId)');
  console.log('    → View analytics summary in console');
  console.log();
  console.log('Example usage in browser console:');
  console.log('  const helper = await import("/utils/analyticsTestHelper.ts");');
  console.log('  await helper.generateMockExerciseData("YOUR_USER_ID", 6);');
  console.log('─'.repeat(50));
}

// Auto-show commands khi import trong dev mode
if (import.meta.env.DEV) {
  showTestHelperCommands();
}
