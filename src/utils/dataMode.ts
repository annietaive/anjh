/**
 * Data Mode Manager
 * Quản lý chế độ dữ liệu: Demo vs Real Database
 * 
 * Features:
 * - Auto fallback: Tự động dùng demo nếu chưa có data thật
 * - Manual toggle: Cho phép user chọn mode
 * - Seamless switch: Chuyển đổi mượt mà giữa 2 mode
 */

import { supabase } from '../lib/supabase';

export type DataMode = 'auto' | 'demo' | 'real';

const DATA_MODE_KEY = 'engmastery_data_mode';
const DEMO_MODE_ENABLED_KEY = 'engmastery_demo_mode_enabled';

/**
 * Get current data mode preference
 */
export function getDataModePreference(): DataMode {
  if (typeof window === 'undefined') return 'auto';
  
  const saved = localStorage.getItem(DATA_MODE_KEY);
  if (saved === 'demo' || saved === 'real' || saved === 'auto') {
    return saved;
  }
  return 'auto';
}

/**
 * Set data mode preference
 */
export function setDataModePreference(mode: DataMode): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DATA_MODE_KEY, mode);
}

/**
 * Check if demo mode is enabled
 */
export function isDemoModeEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(DEMO_MODE_ENABLED_KEY) === 'true';
}

/**
 * Enable/disable demo mode
 */
export function setDemoModeEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DEMO_MODE_ENABLED_KEY, enabled ? 'true' : 'false');
}

/**
 * Check if user has real data in database
 */
export async function hasRealData(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  try {
    // Check if user has any learning progress
    const { data: progress, error } = await supabase
      .from('learning_progress')
      .select('id')
      .eq('user_id', userId)
      .limit(1);
    
    if (error) {
      console.warn('[DataMode] Error checking real data:', error);
      return false;
    }
    
    return (progress?.length ?? 0) > 0;
  } catch (error) {
    console.warn('[DataMode] Failed to check real data:', error);
    return false;
  }
}

/**
 * Determine which data source to use
 * Returns 'demo' or 'real' based on preference and data availability
 */
export async function resolveDataSource(userId: string | null): Promise<'demo' | 'real'> {
  const preference = getDataModePreference();
  
  // If manual mode is set, use it
  if (preference === 'demo') return 'demo';
  if (preference === 'real') return 'real';
  
  // Auto mode: check if user has real data
  if (!userId) return 'demo';
  
  const hasReal = await hasRealData(userId);
  return hasReal ? 'real' : 'demo';
}

/**
 * Get data mode status for UI display
 */
export async function getDataModeStatus(userId: string | null): Promise<{
  mode: DataMode;
  source: 'demo' | 'real';
  hasRealData: boolean;
  canSwitchToReal: boolean;
}> {
  const mode = getDataModePreference();
  const hasReal = userId ? await hasRealData(userId) : false;
  const source = await resolveDataSource(userId);
  
  return {
    mode,
    source,
    hasRealData: hasReal,
    canSwitchToReal: hasReal,
  };
}

/**
 * Import demo progress to real database
 * Copy current demo progress to user's real account
 */
export async function importDemoToReal(userId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!userId) {
    return { success: false, error: 'User ID required' };
  }
  
  try {
    // Get demo data from localStorage
    const demoProgress = localStorage.getItem('progress');
    const demoExerciseResults = localStorage.getItem('exerciseResults');
    
    if (!demoProgress) {
      return { success: false, error: 'No demo data found' };
    }
    
    const progress = JSON.parse(demoProgress);
    
    // Convert demo progress to database format
    const progressRecords = Object.entries(progress).map(([lessonId, data]: [string, any]) => ({
      user_id: userId,
      lesson_id: data.lessonId,
      grade: 6, // Default grade
      vocabulary_completed: data.vocabularyCompleted || false,
      listening_completed: data.listeningCompleted || false,
      speaking_completed: data.speakingCompleted || false,
      reading_completed: data.readingCompleted || false,
      writing_completed: data.writingCompleted || false,
      progress_percentage: data.progressPercentage || data.totalScore || 0,
      time_spent_minutes: data.timeSpent || 0,
      last_accessed_at: new Date().toISOString(),
    }));
    
    // Insert into database (upsert to avoid duplicates)
    const { error: progressError } = await supabase
      .from('learning_progress')
      .upsert(progressRecords, {
        onConflict: 'user_id,lesson_id',
      });
    
    if (progressError) {
      throw progressError;
    }
    
    // Import exercise results if available
    if (demoExerciseResults) {
      try {
        const exerciseResults = JSON.parse(demoExerciseResults);
        const exerciseRecords = exerciseResults.map((result: any) => ({
          user_id: userId,
          lesson_id: result.lessonId,
          exercise_type: result.exerciseType,
          score: result.score,
          total_questions: result.totalQuestions,
          correct_answers: result.correctAnswers,
          time_spent_seconds: result.timeSpent || 0,
          completed_at: result.completedAt || new Date().toISOString(),
        }));
        
        const { error: exerciseError } = await supabase
          .from('exercise_results')
          .insert(exerciseRecords);
        
        if (exerciseError) {
          console.warn('[DataMode] Failed to import exercise results:', exerciseError);
        }
      } catch (err) {
        console.warn('[DataMode] Failed to parse exercise results:', err);
      }
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('[DataMode] Import failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Clear demo data from localStorage
 */
export function clearDemoData(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('progress');
  localStorage.removeItem('exerciseResults');
  localStorage.removeItem('dailyStreak');
  localStorage.removeItem('analyticsCache');
}

/**
 * Get data mode display info for UI
 */
export function getDataModeDisplayInfo(source: 'demo' | 'real'): {
  icon: string;
  label: string;
  description: string;
  color: string;
} {
  if (source === 'demo') {
    return {
      icon: '🎮',
      label: 'Demo Mode',
      description: 'Dữ liệu demo (lưu trên trình duyệt)',
      color: 'text-blue-600',
    };
  }
  
  return {
    icon: '☁️',
    label: 'Real Mode',
    description: 'Dữ liệu thật (lưu trên server)',
    color: 'text-green-600',
  };
}