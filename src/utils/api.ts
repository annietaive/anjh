import { getSupabaseClient } from './supabase/client';

export interface UserProgress {
  totalLessons: number;
  completedLessons: number;
  totalExercises: number;
  correctAnswers: number;
  totalScore: number;
}

export interface LessonProgress {
  lessonId: number;
  completed: boolean;
  score: number;
  skills: {
    vocabulary?: boolean;
    grammar?: boolean;
    listening?: boolean;
    speaking?: boolean;
    reading?: boolean;
    writing?: boolean;
  };
  lastAccessed: string | null;
}

export interface ExerciseResult {
  lessonId: number;
  exerciseType: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  answers: any[];
  completedAt: string;
}

// Helper function to get current user ID
async function getCurrentUserId(): Promise<string> {
  // Check if in demo mode
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user.id === 'demo-user') {
      return 'demo-user';
    }
  }
  
  const supabase = await getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  return user.id;
}

// Fetch user progress
export async function fetchUserProgress(): Promise<{
  overall: UserProgress;
  lessons: LessonProgress[];
}> {
  try {
    const userId = await getCurrentUserId();
    
    // Return demo data for demo user
    if (userId === 'demo-user') {
      return {
        overall: {
          totalLessons: 48,
          completedLessons: 5,
          totalExercises: 23,
          correctAnswers: 18,
          totalScore: 450,
        },
        lessons: [
          {
            lessonId: 1,
            completed: true,
            score: 95,
            skills: {
              vocabulary: true,
              grammar: true,
              listening: true,
              speaking: true,
              reading: true,
              writing: false,
            },
            lastAccessed: new Date().toISOString(),
          },
        ],
      };
    }
    
    const supabase = await getSupabaseClient();

    // Fetch overall progress
    const { data: overallData, error: overallError } = await supabase
      .from('kv_store_bf8225f3')
      .select('value')
      .eq('key', `user:${userId}:progress`)
      .maybeSingle();

    if (overallError) {
      console.error('Error fetching overall progress:', overallError);
    }

    // Fetch lesson progress
    const { data: lessonsData, error: lessonsError } = await supabase
      .from('kv_store_bf8225f3')
      .select('value')
      .like('key', `user:${userId}:lesson:%`);

    if (lessonsError) {
      console.error('Error fetching lessons progress:', lessonsError);
    }

    return {
      overall: overallData?.value || {
        totalLessons: 0,
        completedLessons: 0,
        totalExercises: 0,
        correctAnswers: 0,
        totalScore: 0,
      },
      lessons: lessonsData?.map((item) => item.value) || [],
    };
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
}

// Save lesson progress
export async function saveLessonProgress(
  lessonId: number,
  data: {
    completed?: boolean;
    score?: number;
    skills?: Partial<LessonProgress['skills']>;
  }
): Promise<{ success: boolean; progress: LessonProgress }> {
  try {
    const userId = await getCurrentUserId();
    
    // For demo user, just return success without saving
    if (userId === 'demo-user') {
      const demoProgress: LessonProgress = {
        lessonId,
        completed: data.completed ?? false,
        score: data.score ?? 0,
        skills: data.skills || {},
        lastAccessed: new Date().toISOString(),
      };
      return { success: true, progress: demoProgress };
    }
    
    const supabase = await getSupabaseClient();

    // Get current overall progress
    const { data: currentProgressData } = await supabase
      .from('kv_store_bf8225f3')
      .select('value')
      .eq('key', `user:${userId}:progress`)
      .maybeSingle();

    const currentProgress = currentProgressData?.value || {
      totalLessons: 0,
      completedLessons: 0,
      totalExercises: 0,
      correctAnswers: 0,
      totalScore: 0,
    };

    // Get current lesson progress
    const lessonKey = `user:${userId}:lesson:${lessonId}`;
    const { data: currentLessonData } = await supabase
      .from('kv_store_bf8225f3')
      .select('value')
      .eq('key', lessonKey)
      .maybeSingle();

    const currentLessonProgress = currentLessonData?.value || {
      lessonId,
      completed: false,
      score: 0,
      skills: {},
      lastAccessed: null,
    };

    // Update lesson progress
    const updatedLessonProgress = {
      ...currentLessonProgress,
      completed: data.completed ?? currentLessonProgress.completed,
      score: data.score ?? currentLessonProgress.score,
      skills: data.skills ? { ...currentLessonProgress.skills, ...data.skills } : currentLessonProgress.skills,
      lastAccessed: new Date().toISOString(),
    };

    // Save updated lesson progress
    const { error: lessonError } = await supabase
      .from('kv_store_bf8225f3')
      .upsert({
        key: lessonKey,
        value: updatedLessonProgress,
      });

    if (lessonError) {
      throw new Error(lessonError.message);
    }

    // Update overall progress if lesson is newly completed
    if (data.completed && !currentLessonProgress.completed) {
      currentProgress.completedLessons += 1;
      currentProgress.totalScore += (data.score || 0);

      const { error: progressError } = await supabase
        .from('kv_store_bf8225f3')
        .upsert({
          key: `user:${userId}:progress`,
          value: currentProgress,
        });

      if (progressError) {
        throw new Error(progressError.message);
      }
    }

    return { success: true, progress: updatedLessonProgress };
  } catch (error) {
    console.error('Error saving lesson progress:', error);
    throw error;
  }
}

// Save exercise result
export async function saveExerciseResult(
  exerciseData: {
    lessonId: number;
    exerciseType: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    answers: any[];
  }
): Promise<{ success: boolean }> {
  try {
    const userId = await getCurrentUserId();
    
    // For demo user, just return success without saving
    if (userId === 'demo-user') {
      return { success: true };
    }
    
    const supabase = await getSupabaseClient();

    // Save exercise result
    const exerciseKey = `user:${userId}:exercise:${Date.now()}`;
    const { error: exerciseError } = await supabase
      .from('kv_store_bf8225f3')
      .upsert({
        key: exerciseKey,
        value: {
          ...exerciseData,
          completedAt: new Date().toISOString(),
        },
      });

    if (exerciseError) {
      throw new Error(exerciseError.message);
    }

    // Update overall progress
    const { data: currentProgressData } = await supabase
      .from('kv_store_bf8225f3')
      .select('value')
      .eq('key', `user:${userId}:progress`)
      .maybeSingle();

    const currentProgress = currentProgressData?.value || {
      totalLessons: 0,
      completedLessons: 0,
      totalExercises: 0,
      correctAnswers: 0,
      totalScore: 0,
    };

    currentProgress.totalExercises += 1;
    currentProgress.correctAnswers += (exerciseData.correctAnswers || 0);
    currentProgress.totalScore += (exerciseData.score || 0);

    const { error: progressError } = await supabase
      .from('kv_store_bf8225f3')
      .upsert({
        key: `user:${userId}:progress`,
        value: currentProgress,
      });

    if (progressError) {
      throw new Error(progressError.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving exercise result:', error);
    throw error;
  }
}

// Get exercise history
export async function fetchExerciseHistory(): Promise<ExerciseResult[]> {
  try {
    const userId = await getCurrentUserId();
    
    // Return demo data for demo user
    if (userId === 'demo-user') {
      return [
        {
          lessonId: 1,
          exerciseType: 'vocabulary',
          score: 95,
          totalQuestions: 10,
          correctAnswers: 9,
          answers: [],
          completedAt: new Date().toISOString(),
        },
        {
          lessonId: 2,
          exerciseType: 'grammar',
          score: 85,
          totalQuestions: 10,
          correctAnswers: 8,
          answers: [],
          completedAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
    }
    
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
      .from('kv_store_bf8225f3')
      .select('value')
      .like('key', `user:${userId}:exercise:%`)
      .order('key', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data?.map((item) => item.value) || [];
  } catch (error) {
    console.error('Error fetching exercise history:', error);
    throw error;
  }
}

// Get lesson progress
export async function fetchLessonProgress(
  lessonId: number
): Promise<LessonProgress> {
  try {
    const userId = await getCurrentUserId();
    
    // Return demo data for demo user
    if (userId === 'demo-user') {
      return {
        lessonId,
        completed: lessonId === 1,
        score: lessonId === 1 ? 95 : 0,
        skills: lessonId === 1 ? {
          vocabulary: true,
          grammar: true,
          listening: true,
          speaking: true,
          reading: true,
          writing: false,
        } : {},
        lastAccessed: lessonId === 1 ? new Date().toISOString() : null,
      };
    }
    
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
      .from('kv_store_bf8225f3')
      .select('value')
      .eq('key', `user:${userId}:lesson:${lessonId}`)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data?.value || {
      lessonId,
      completed: false,
      score: 0,
      skills: {},
      lastAccessed: null,
    };
  } catch (error) {
    console.error('Error fetching lesson progress:', error);
    throw error;
  }
}