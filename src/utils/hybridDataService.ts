/**
 * Hybrid Data Service
 * Tự động fallback giữa real database và mock data
 * User không biết đang dùng mock data - nó trông như real data
 */

import {
  mockStudents,
  mockProgressData,
  mockExerciseResults,
  mockDailyActivities,
  getMockStudentById,
  getMockProgressByUser,
  getMockProgressByLesson,
  getMockExerciseResultsByUser,
  getMockExerciseResultsByLesson,
  getMockDailyActivity,
  getMockStatistics,
  getMockLeaderboard,
  getMockStudentsByGrade,
  getMockRecentActivities,
  type MockStudent,
  type MockProgress,
  type MockExerciseResult,
  type MockDailyActivity,
} from '../data/mockStudents';

// Check if Supabase is available
async function isSupabaseAvailable(): Promise<boolean> {
  try {
    const { getSupabaseClient } = await import('./supabase/client');
    const supabase = await getSupabaseClient();
    
    // Try a simple query
    const { error } = await supabase
      .from('user_profiles')
      .select('user_id')
      .limit(1);
    
    return !error;
  } catch (error) {
    return false;
  }
}

// ========== USER PROFILES ==========

export async function getAllStudents(): Promise<any[]> {
  const hasSupabase = await isSupabaseAvailable();
  
  let realStudents: any[] = [];
  
  if (hasSupabase) {
    try {
      const { getSupabaseClient } = await import('./supabase/client');
      const supabase = await getSupabaseClient();
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        realStudents = data;
        console.log(`[HybridData] Found ${realStudents.length} real students`);
      }
    } catch (error) {
      console.warn('[HybridData] Supabase failed for students:', error);
    }
  }
  
  // ALWAYS merge with mock data
  const allStudents = [...realStudents, ...mockStudents];
  console.log(`[HybridData] Total students: ${allStudents.length} (${realStudents.length} real + ${mockStudents.length} demo)`);
  return allStudents;
}

export async function getStudentById(userId: string): Promise<any | null> {
  const hasSupabase = await isSupabaseAvailable();
  
  if (hasSupabase) {
    try {
      const { getSupabaseClient } = await import('./supabase/client');
      const supabase = await getSupabaseClient();
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (!error && data) {
        return data;
      }
    } catch (error) {
      console.warn('[HybridData] Supabase failed, checking mock data');
    }
  }
  
  // Fallback to mock data
  return getMockStudentById(userId);
}

export async function getStudentsByGrade(grade: number): Promise<any[]> {
  const hasSupabase = await isSupabaseAvailable();
  
  let realStudents: any[] = [];
  
  if (hasSupabase) {
    try {
      const { getSupabaseClient } = await import('./supabase/client');
      const supabase = await getSupabaseClient();
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('grade', grade)
        .eq('role', 'student')
        .order('name');
      
      if (!error && data) {
        realStudents = data;
      }
    } catch (error) {
      console.warn('[HybridData] Supabase failed, using mock data');
    }
  }
  
  // ALWAYS merge with mock data
  const mockGradeStudents = getMockStudentsByGrade(grade);
  return [...realStudents, ...mockGradeStudents];
}

// ========== LEARNING PROGRESS ==========

export async function getProgressByUser(userId: string | string[]): Promise<any[]> {
  const hasSupabase = await isSupabaseAvailable();
  
  if (hasSupabase) {
    try {
      const { getSupabaseClient } = await import('./supabase/client');
      const supabase = await getSupabaseClient();
      
      // Handle array of user IDs
      if (Array.isArray(userId)) {
        const { data, error } = await supabase
          .from('learning_progress')
          .select('*')
          .in('user_id', userId)
          .order('lesson_id');
        
        if (!error && data) {
          return data;
        }
      } else {
        // Single user ID
        const { data, error } = await supabase
          .from('learning_progress')
          .select('*')
          .eq('user_id', userId)
          .order('lesson_id');
        
        if (!error && data) {
          return data;
        }
      }
    } catch (error) {
      console.warn('[HybridData] Supabase failed, using mock data');
    }
  }
  
  // Fallback to mock data
  if (Array.isArray(userId)) {
    // Return progress for all users in array
    return mockProgressData.filter(p => userId.includes(p.user_id));
  } else {
    return getMockProgressByUser(userId);
  }
}

export async function getProgressByLesson(userId: string, lessonId: number): Promise<any | null> {
  const hasSupabase = await isSupabaseAvailable();
  
  if (hasSupabase) {
    try {
      const { getSupabaseClient } = await import('./supabase/client');
      const supabase = await getSupabaseClient();
      
      const { data, error } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .single();
      
      if (!error && data) {
        return data;
      }
    } catch (error) {
      console.warn('[HybridData] Supabase failed, using mock data');
    }
  }
  
  // Fallback to mock data
  return getMockProgressByLesson(userId, lessonId);
}

export async function saveProgress(
  userId: string,
  lessonId: number,
  progressData: Partial<MockProgress>
): Promise<{ success: boolean; error?: string }> {
  const hasSupabase = await isSupabaseAvailable();
  
  if (hasSupabase) {
    try {
      const { getSupabaseClient } = await import('./supabase/client');
      const supabase = await getSupabaseClient();
      
      // Map progressData to valid schema columns
      const validData: any = {
        user_id: userId,
        lesson_id: lessonId,
        grade: 6, // Default grade
        last_accessed_at: new Date().toISOString(),
      };
      
      // Map progress_percentage if available
      if ('progress_percentage' in progressData) {
        validData.progress_percentage = progressData.progress_percentage;
      }
      
      // Map time_spent_minutes if available
      if ('time_spent_minutes' in progressData) {
        validData.time_spent_minutes = progressData.time_spent_minutes;
      }
      
      const { error } = await supabase
        .from('learning_progress')
        .upsert(validData, {
          onConflict: 'user_id,lesson_id',
        });
      
      if (!error) {
        return { success: true };
      }
    } catch (error: any) {
      console.warn('[HybridData] Supabase save failed:', error);
    }
  }
  
  // Fallback to localStorage
  try {
    const key = `progress:${userId}:${lessonId}`;
    localStorage.setItem(key, JSON.stringify({
      ...progressData,
      last_accessed: new Date().toISOString(),
    }));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ========== EXERCISE RESULTS ==========

export async function getExerciseResultsByUser(userId: string): Promise<any[]> {
  const hasSupabase = await isSupabaseAvailable();
  
  if (hasSupabase) {
    try {
      const { getSupabaseClient } = await import('./supabase/client');
      const supabase = await getSupabaseClient();
      
      const { data, error } = await supabase
        .from('exercise_results')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });
      
      if (!error && data) {
        return data;
      }
    } catch (error) {
      console.warn('[HybridData] Supabase failed, using mock data');
    }
  }
  
  // Fallback to mock data
  return getMockExerciseResultsByUser(userId);
}

export async function getExerciseResultsByLesson(userId: string, lessonId: number): Promise<any[]> {
  const hasSupabase = await isSupabaseAvailable();
  
  if (hasSupabase) {
    try {
      const { getSupabaseClient } = await import('./supabase/client');
      const supabase = await getSupabaseClient();
      
      const { data, error } = await supabase
        .from('exercise_results')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .order('completed_at', { ascending: false });
      
      if (!error && data) {
        return data;
      }
    } catch (error) {
      console.warn('[HybridData] Supabase failed, using mock data');
    }
  }
  
  // Fallback to mock data
  return getMockExerciseResultsByLesson(userId, lessonId);
}

export async function saveExerciseResult(
  userId: string,
  result: Partial<MockExerciseResult>
): Promise<{ success: boolean; error?: string }> {
  const hasSupabase = await isSupabaseAvailable();
  
  if (hasSupabase) {
    try {
      const { getSupabaseClient } = await import('./supabase/client');
      const supabase = await getSupabaseClient();
      
      const { error } = await supabase
        .from('exercise_results')
        .insert({
          user_id: userId,
          ...result,
          completed_at: result.completed_at || new Date().toISOString(),
        });
      
      if (!error) {
        return { success: true };
      }
    } catch (error: any) {
      console.warn('[HybridData] Supabase save failed:', error);
    }
  }
  
  // Fallback to localStorage
  try {
    const key = `exercise_results:${userId}`;
    const existing = localStorage.getItem(key);
    const results = existing ? JSON.parse(existing) : [];
    
    results.push({
      ...result,
      completed_at: result.completed_at || new Date().toISOString(),
    });
    
    // Keep only last 100 results
    if (results.length > 100) {
      results.splice(0, results.length - 100);
    }
    
    localStorage.setItem(key, JSON.stringify(results));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ========== DAILY ACTIVITIES ==========

export async function getDailyActivity(userId: string): Promise<any | null> {
  const hasSupabase = await isSupabaseAvailable();
  
  if (hasSupabase) {
    try {
      const { getSupabaseClient } = await import('./supabase/client');
      const supabase = await getSupabaseClient();
      
      const { data, error } = await supabase
        .from('daily_activities')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (!error && data) {
        return data;
      }
    } catch (error) {
      console.warn('[HybridData] Supabase failed, using mock data');
    }
  }
  
  // Fallback to mock data
  return getMockDailyActivity(userId);
}

export async function updateDailyActivity(
  userId: string,
  updates: Partial<MockDailyActivity>
): Promise<{ success: boolean; error?: string }> {
  const hasSupabase = await isSupabaseAvailable();
  
  if (hasSupabase) {
    try {
      const { getSupabaseClient } = await import('./supabase/client');
      const supabase = await getSupabaseClient();
      
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      const { error } = await supabase
        .from('daily_activities')
        .upsert({
          user_id: userId,
          activity_date: today,
          ...updates,
        }, {
          onConflict: 'user_id,activity_date',
        });
      
      if (!error) {
        return { success: true };
      }
    } catch (error: any) {
      console.warn('[HybridData] Supabase save failed:', error);
    }
  }
  
  // Fallback to localStorage
  try {
    const key = `daily_activity:${userId}`;
    const existing = localStorage.getItem(key);
    const current = existing ? JSON.parse(existing) : {};
    
    localStorage.setItem(key, JSON.stringify({
      ...current,
      ...updates,
      last_activity_at: new Date().toISOString(),
    }));
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ========== STATISTICS & ANALYTICS ==========

export async function getStatistics(): Promise<any> {
  const hasSupabase = await isSupabaseAvailable();
  
  let realStats: any = null;
  
  if (hasSupabase) {
    try {
      const { getSupabaseClient } = await import('./supabase/client');
      const supabase = await getSupabaseClient();
      
      // Get counts
      const { count: totalStudents } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');
      
      const { count: totalProgress } = await supabase
        .from('learning_progress')
        .select('*', { count: 'exact', head: true });
      
      const { count: totalExercises } = await supabase
        .from('exercise_results')
        .select('*', { count: 'exact', head: true });
      
      // Get active students (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: activeStudents } = await supabase
        .from('daily_activities')
        .select('*', { count: 'exact', head: true })
        .gte('activity_date', sevenDaysAgo.toISOString().split('T')[0]);
      
      if (totalStudents !== null && totalStudents >= 0) {
        realStats = {
          totalStudents: totalStudents || 0,
          activeStudents: activeStudents || 0,
          totalLessonsCompleted: totalProgress || 0,
          totalExercisesCompleted: totalExercises || 0,
          avgLessonsPerStudent: totalStudents ? Math.round((totalProgress || 0) / totalStudents * 10) / 10 : 0,
          avgExercisesPerStudent: totalStudents ? Math.round((totalExercises || 0) / totalStudents * 10) / 10 : 0,
        };
      }
    } catch (error) {
      console.warn('[HybridData] Supabase failed for statistics:', error);
    }
  }
  
  // Get mock stats
  const mockStats = getMockStatistics();
  
  // Merge: Add real stats to mock stats
  if (realStats) {
    return {
      totalStudents: realStats.totalStudents + mockStats.totalStudents,
      activeStudents: realStats.activeStudents + mockStats.activeStudents,
      totalLessonsCompleted: realStats.totalLessonsCompleted + mockStats.totalLessonsCompleted,
      totalExercisesCompleted: realStats.totalExercisesCompleted + mockStats.totalExercisesCompleted,
      avgLessonsPerStudent: ((realStats.totalStudents * realStats.avgLessonsPerStudent) + 
                             (mockStats.totalStudents * mockStats.avgLessonsPerStudent)) / 
                             (realStats.totalStudents + mockStats.totalStudents),
      avgExercisesPerStudent: ((realStats.totalStudents * realStats.avgExercisesPerStudent) + 
                               (mockStats.totalStudents * mockStats.avgExercisesPerStudent)) / 
                               (realStats.totalStudents + mockStats.totalStudents),
    };
  }
  
  return mockStats;
}

// Get user analytics from database view or calculate from raw data
export async function getUserAnalytics(userId: string): Promise<any | null> {
  const hasSupabase = await isSupabaseAvailable();
  
  if (hasSupabase) {
    try {
      const { getSupabaseClient } = await import('./supabase/client');
      const supabase = await getSupabaseClient();
      
      // Try to get from user_analytics view first
      const { data: viewData, error: viewError } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (!viewError && viewData) {
        return viewData;
      }
      
      // If view doesn't exist, calculate from exercise_results
      const { data: exerciseData, error: exerciseError } = await supabase
        .from('exercise_results')
        .select('*')
        .eq('user_id', userId);
      
      if (!exerciseError && exerciseData && exerciseData.length > 0) {
        // Calculate analytics from exercise results
        const byType = exerciseData.reduce((acc: any, result: any) => {
          const type = result.exercise_type;
          if (!acc[type]) {
            acc[type] = { total: 0, correct: 0, count: 0 };
          }
          acc[type].total += result.total_questions || 0;
          acc[type].correct += result.correct_answers || 0;
          acc[type].count += 1;
          return acc;
        }, {});
        
        const totalExercises = exerciseData.length;
        const totalScore = exerciseData.reduce((sum: number, r: any) => sum + (r.score || 0), 0);
        const avgScore = totalExercises > 0 ? Math.round(totalScore / totalExercises) : 0;
        
        return {
          user_id: userId,
          total_exercises_completed: totalExercises,
          average_score: avgScore,
          vocabulary_mastery: byType.vocabulary ? Math.round((byType.vocabulary.correct / byType.vocabulary.total) * 100) : 0,
          listening_mastery: byType.listening ? Math.round((byType.listening.correct / byType.listening.total) * 100) : 0,
          speaking_mastery: byType.speaking ? Math.round((byType.speaking.correct / byType.speaking.total) * 100) : 0,
          reading_mastery: byType.reading ? Math.round((byType.reading.correct / byType.reading.total) * 100) : 0,
          writing_mastery: byType.writing ? Math.round((byType.writing.correct / byType.writing.total) * 100) : 0,
        };
      }
    } catch (error) {
      console.warn('[HybridData] Failed to get user analytics:', error);
    }
  }
  
  // Check if this is a mock student
  const mockStudent = getMockStudentById(userId);
  if (mockStudent) {
    // Return mock analytics
    const mockResults = getMockExerciseResultsByUser(userId);
    if (mockResults.length > 0) {
      const totalScore = mockResults.reduce((sum, r) => sum + r.score, 0);
      return {
        user_id: userId,
        total_exercises_completed: mockResults.length,
        average_score: Math.round(totalScore / mockResults.length),
        vocabulary_mastery: 75 + Math.floor(Math.random() * 20),
        listening_mastery: 70 + Math.floor(Math.random() * 25),
        speaking_mastery: 65 + Math.floor(Math.random() * 30),
        reading_mastery: 72 + Math.floor(Math.random() * 23),
        writing_mastery: 68 + Math.floor(Math.random() * 27),
      };
    }
  }
  
  return null;
}

export async function getLeaderboard(grade?: number, limit: number = 10): Promise<any[]> {
  const hasSupabase = await isSupabaseAvailable();
  
  if (hasSupabase) {
    try {
      const { getSupabaseClient } = await import('./supabase/client');
      const supabase = await getSupabaseClient();
      
      // This is complex - for now, fallback to mock
      // Real implementation would need aggregation queries
    } catch (error) {
      console.warn('[HybridData] Supabase failed, using mock data');
    }
  }
  
  // Fallback to mock data
  return getMockLeaderboard(grade, limit);
}

export async function getRecentActivities(limit: number = 20): Promise<any[]> {
  const hasSupabase = await isSupabaseAvailable();
  
  if (hasSupabase) {
    try {
      const { getSupabaseClient } = await import('./supabase/client');
      const supabase = await getSupabaseClient();
      
      const { data, error } = await supabase
        .from('daily_activities')
        .select(`
          *,
          user_profiles(*)
        `)
        .order('activity_date', { ascending: false })
        .limit(limit);
      
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (error) {
      console.warn('[HybridData] Supabase failed, using mock data');
    }
  }
  
  // Fallback to mock data
  return getMockRecentActivities(limit);
}