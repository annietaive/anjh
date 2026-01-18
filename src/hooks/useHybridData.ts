/**
 * useHybridData Hook
 * Tự động chọn data source (demo vs real) và cung cấp API thống nhất
 */

import React from 'react';
import { supabase } from '../lib/supabase';
import { resolveDataSource } from '../utils/dataMode';

interface LearningProgress {
  lessonId: number;
  completed: boolean;
  vocabularyScore: number;
  listeningScore: number;
  speakingScore: number;
  readingScore: number;
  writingScore: number;
  totalScore: number;
  lastAccessed?: string;
}

interface UseHybridDataReturn {
  dataSource: 'demo' | 'real' | null;
  isLoading: boolean;
  
  // Progress methods
  getProgress: (lessonId: number) => Promise<LearningProgress | null>;
  saveProgress: (lessonId: number, progress: Partial<LearningProgress>) => Promise<void>;
  getAllProgress: () => Promise<Record<number, LearningProgress>>;
  
  // Exercise results methods
  saveExerciseResult: (result: ExerciseResult) => Promise<void>;
  getExerciseResults: (lessonId?: number) => Promise<ExerciseResult[]>;
  
  // Analytics methods
  getDailyActivity: () => Promise<DailyActivity | null>;
  updateDailyActivity: () => Promise<void>;
}

interface ExerciseResult {
  lessonId: number;
  exerciseType: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent?: number;
  completedAt?: string;
}

interface DailyActivity {
  lastActivityAt: string;
  streak: number;
  totalMinutes: number;
}

export function useHybridData(userId: string | null): UseHybridDataReturn {
  const [dataSource, setDataSource] = React.useState<'demo' | 'real' | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Determine data source on mount
  React.useEffect(() => {
    const determineSource = async () => {
      setIsLoading(true);
      const source = await resolveDataSource(userId);
      setDataSource(source);
      setIsLoading(false);
    };
    
    determineSource();
  }, [userId]);

  // ========== Progress Methods ==========
  
  const getProgress = React.useCallback(async (lessonId: number): Promise<LearningProgress | null> => {
    if (!dataSource) return null;
    
    if (dataSource === 'demo') {
      // Load from localStorage
      const stored = localStorage.getItem('progress');
      if (!stored) return null;
      
      const allProgress = JSON.parse(stored);
      return allProgress[lessonId] || null;
    }
    
    // Load from database
    if (!userId) return null;
    
    const { data, error } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single();
    
    if (error || !data) return null;
    
    // Calculate if lesson is completed (all skills completed)
    const allCompleted = data.vocabulary_completed && 
                        data.listening_completed && 
                        data.speaking_completed && 
                        data.reading_completed && 
                        data.writing_completed;
    
    return {
      lessonId: data.lesson_id,
      completed: allCompleted,
      vocabularyScore: 0, // Scores are tracked in exercise_results table
      listeningScore: 0,
      speakingScore: 0,
      readingScore: 0,
      writingScore: 0,
      totalScore: data.progress_percentage || 0,
      lastAccessed: data.last_accessed_at,
    };
  }, [dataSource, userId]);

  const saveProgress = React.useCallback(async (
    lessonId: number, 
    progress: Partial<LearningProgress>
  ): Promise<void> => {
    if (!dataSource) return;
    
    if (dataSource === 'demo') {
      // Save to localStorage
      const stored = localStorage.getItem('progress') || '{}';
      const allProgress = JSON.parse(stored);
      
      allProgress[lessonId] = {
        ...allProgress[lessonId],
        ...progress,
        lessonId,
      };
      
      localStorage.setItem('progress', JSON.stringify(allProgress));
      return;
    }
    
    // Save to database
    if (!userId) return;
    
    // Get current grade (need to fetch or default to 6)
    const grade = 6; // TODO: Get from user profile
    
    const { error } = await supabase
      .from('learning_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        grade: grade,
        progress_percentage: progress.totalScore ?? 0,
        time_spent_minutes: 0, // TODO: Track time
        last_accessed_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,lesson_id',
      });
    
    if (error) {
      console.error('[HybridData] Failed to save progress:', error);
    }
  }, [dataSource, userId]);

  const getAllProgress = React.useCallback(async (): Promise<Record<number, LearningProgress>> => {
    if (!dataSource) return {};
    
    if (dataSource === 'demo') {
      // Load from localStorage
      const stored = localStorage.getItem('progress');
      return stored ? JSON.parse(stored) : {};
    }
    
    // Load from database
    if (!userId) return {};
    
    const { data, error } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (error || !data) return {};
    
    const progressMap: Record<number, LearningProgress> = {};
    data.forEach(item => {
      const allCompleted = item.vocabulary_completed && 
                          item.listening_completed && 
                          item.speaking_completed && 
                          item.reading_completed && 
                          item.writing_completed;
      
      progressMap[item.lesson_id] = {
        lessonId: item.lesson_id,
        completed: allCompleted,
        vocabularyScore: 0, // Scores tracked in exercise_results
        listeningScore: 0,
        speakingScore: 0,
        readingScore: 0,
        writingScore: 0,
        totalScore: item.progress_percentage || 0,
        lastAccessed: item.last_accessed_at,
      };
    });
    
    return progressMap;
  }, [dataSource, userId]);

  // ========== Exercise Results Methods ==========
  
  const saveExerciseResult = React.useCallback(async (result: ExerciseResult): Promise<void> => {
    if (!dataSource) return;
    
    if (dataSource === 'demo') {
      // Save to localStorage
      const stored = localStorage.getItem('exerciseResults') || '[]';
      const results = JSON.parse(stored);
      
      results.push({
        ...result,
        completedAt: result.completedAt || new Date().toISOString(),
      });
      
      // Keep only last 1000 results
      if (results.length > 1000) {
        results.splice(0, results.length - 1000);
      }
      
      localStorage.setItem('exerciseResults', JSON.stringify(results));
      return;
    }
    
    // Save to database
    if (!userId) return;
    
    const { error } = await supabase
      .from('exercise_results')
      .insert({
        user_id: userId,
        lesson_id: result.lessonId,
        exercise_type: result.exerciseType,
        score: result.score,
        total_questions: result.totalQuestions,
        correct_answers: result.correctAnswers,
        time_spent_seconds: result.timeSpent || 0,
        completed_at: result.completedAt || new Date().toISOString(),
      });
    
    if (error) {
      console.error('[HybridData] Failed to save exercise result:', error);
    }
  }, [dataSource, userId]);

  const getExerciseResults = React.useCallback(async (lessonId?: number): Promise<ExerciseResult[]> => {
    if (!dataSource) return [];
    
    if (dataSource === 'demo') {
      // Load from localStorage
      const stored = localStorage.getItem('exerciseResults');
      if (!stored) return [];
      
      const results = JSON.parse(stored);
      
      if (lessonId) {
        return results.filter((r: ExerciseResult) => r.lessonId === lessonId);
      }
      
      return results;
    }
    
    // Load from database
    if (!userId) return [];
    
    let query = supabase
      .from('exercise_results')
      .select('*')
      .eq('user_id', userId);
    
    if (lessonId) {
      query = query.eq('lesson_id', lessonId);
    }
    
    const { data, error } = await query.order('completed_at', { ascending: false });
    
    if (error || !data) return [];
    
    return data.map(item => ({
      lessonId: item.lesson_id,
      exerciseType: item.exercise_type,
      score: item.score,
      totalQuestions: item.total_questions,
      correctAnswers: item.correct_answers,
      timeSpent: item.time_spent_seconds,
      completedAt: item.completed_at,
    }));
  }, [dataSource, userId]);

  // ========== Daily Activity Methods ==========
  
  const getDailyActivity = React.useCallback(async (): Promise<DailyActivity | null> => {
    if (!dataSource) return null;
    
    if (dataSource === 'demo') {
      // Load from localStorage
      const stored = localStorage.getItem('dailyActivity');
      return stored ? JSON.parse(stored) : null;
    }
    
    // Load from database - get today's activity
    if (!userId) return null;
    
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('daily_activities')
      .select('*')
      .eq('user_id', userId)
      .eq('activity_date', today)
      .maybeSingle();
    
    if (error || !data) return null;
    
    return {
      lastActivityAt: data.activity_date, // Use activity_date instead
      streak: 0, // Streak is calculated separately
      totalMinutes: data.time_spent_minutes || 0,
    };
  }, [dataSource, userId]);

  const updateDailyActivity = React.useCallback(async (): Promise<void> => {
    if (!dataSource) return;
    
    const now = new Date();
    
    if (dataSource === 'demo') {
      // Update localStorage
      const stored = localStorage.getItem('dailyActivity');
      const current = stored ? JSON.parse(stored) : null;
      
      const updated = {
        lastActivityAt: now.toISOString(),
        streak: current ? current.streak : 1,
        totalMinutes: (current?.totalMinutes || 0) + 1,
      };
      
      localStorage.setItem('dailyActivity', JSON.stringify(updated));
      return;
    }
    
    // Update database
    if (!userId) return;
    
    const today = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    const { error } = await supabase
      .from('daily_activities')
      .upsert({
        user_id: userId,
        activity_date: today,
        time_spent_minutes: 1, // Increment would need more complex logic
      }, {
        onConflict: 'user_id,activity_date',
      });
    
    if (error) {
      console.error('[HybridData] Failed to update daily activity:', error);
    }
  }, [dataSource, userId]);

  return {
    dataSource,
    isLoading,
    getProgress,
    saveProgress,
    getAllProgress,
    saveExerciseResult,
    getExerciseResults,
    getDailyActivity,
    updateDailyActivity,
  };
}