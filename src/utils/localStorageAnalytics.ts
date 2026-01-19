// ============================================================================
// Local Storage Analytics Fallback
// ============================================================================
// Provides analytics from localStorage when database is not available
// ============================================================================

export interface LocalExerciseResult {
  userId: string;
  lessonId: number;
  exerciseType: 'vocabulary' | 'listening' | 'speaking' | 'reading' | 'writing' | 'grammar' | 'mixed';
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  answers: any[];
  completedAt: string;
}

export interface LocalLearningProgress {
  userId: string;
  lessonId: number;
  grade: number;
  progressPercentage: number;
  completedAt: string | null;
  lastAccessedAt: string;
}

// ============================================================================
// Get Exercise Results from localStorage
// ============================================================================

export function getLocalExerciseResults(userId: string, lessonId?: number): LocalExerciseResult[] {
  try {
    const results = JSON.parse(localStorage.getItem('exercise_results') || '[]');
    
    return results.filter((r: LocalExerciseResult) => {
      if (r.userId !== userId) return false;
      if (lessonId && r.lessonId !== lessonId) return false;
      return true;
    });
  } catch (error) {
    console.error('Error reading local exercise results:', error);
    return [];
  }
}

// ============================================================================
// Get Learning Progress from localStorage
// ============================================================================

export function getLocalLearningProgress(userId: string, lessonId: number): LocalLearningProgress | null {
  try {
    const progress = JSON.parse(localStorage.getItem('learning_progress') || '{}');
    return progress[`${userId}_${lessonId}`] || null;
  } catch (error) {
    console.error('Error reading local learning progress:', error);
    return null;
  }
}

export function getAllLocalLearningProgress(userId: string): LocalLearningProgress[] {
  try {
    const progress = JSON.parse(localStorage.getItem('learning_progress') || '{}');
    
    return Object.values(progress).filter((p: any) => p.userId === userId);
  } catch (error) {
    console.error('Error reading all local learning progress:', error);
    return [];
  }
}

// ============================================================================
// Calculate Statistics from localStorage
// ============================================================================

export function getLocalStatistics(userId: string) {
  const results = getLocalExerciseResults(userId);
  const progressList = getAllLocalLearningProgress(userId);
  
  console.log('[LocalStorage] getLocalStatistics for userId:', userId);
  console.log('[LocalStorage] Found results:', results.length);
  console.log('[LocalStorage] Found progress:', progressList.length);
  
  if (results.length === 0) {
    console.log('[LocalStorage] No results found, returning null');
    return null;
  }
  
  // Calculate overall statistics
  const completedLessons = new Set(progressList.filter(p => p.completedAt).map(p => p.lessonId)).size;
  const totalExercises = results.length;
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const averageScore = totalScore / results.length;
  
  // Calculate skill mastery with detailed stats
  const skillResults = {
    vocabulary: results.filter(r => r.exerciseType === 'vocabulary' || r.exerciseType === 'mixed'),
    listening: results.filter(r => r.exerciseType === 'listening'),
    speaking: results.filter(r => r.exerciseType === 'speaking'),
    reading: results.filter(r => r.exerciseType === 'reading'),
    writing: results.filter(r => r.exerciseType === 'writing'),
  };
  
  const calculateSkillMastery = (results: LocalExerciseResult[]) => {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, r) => sum + r.score, 0);
    return Math.round(total / results.length);
  };
  
  const calculateSkillDetails = (results: LocalExerciseResult[]) => {
    if (results.length === 0) return {
      averageScore: 0,
      totalExercises: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      accuracy: 0
    };
    
    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const totalCorrect = results.reduce((sum, r) => sum + r.correctAnswers, 0);
    const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0);
    
    return {
      averageScore: Math.round(totalScore / results.length),
      totalExercises: results.length,
      totalCorrect: totalCorrect,
      totalQuestions: totalQuestions,
      accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
    };
  };
  
  // Calculate streak
  const activityDates = new Set(
    results.map(r => new Date(r.completedAt).toISOString().split('T')[0])
  );
  
  const sortedDates = Array.from(activityDates).sort().reverse();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  // Check if active today or yesterday for current streak
  if (sortedDates.includes(today) || sortedDates.includes(yesterday)) {
    let checkDate = sortedDates.includes(today) ? new Date() : new Date(Date.now() - 86400000);
    
    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      if (date.toISOString().split('T')[0] === checkDate.toISOString().split('T')[0]) {
        currentStreak++;
        checkDate = new Date(checkDate.getTime() - 86400000);
      } else {
        break;
      }
    }
  }
  
  // Calculate longest streak
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / 86400000);
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);
  
  // Get recent results (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const recentResults = results.filter(r => r.completedAt >= sevenDaysAgo);
  
  const weeklyLessons = new Set(recentResults.map(r => r.lessonId)).size;
  const weeklyExercises = recentResults.length;
  
  return {
    overall: {
      totalLessons: completedLessons,
      totalExercises: totalExercises,
      totalTime: 0, // Can't track time from localStorage
      averageScore: Math.round(averageScore),
    },
    weekly: {
      lessons: weeklyLessons,
      exercises: weeklyExercises,
      time: 0,
    },
    skills: {
      vocabulary: calculateSkillMastery(skillResults.vocabulary),
      listening: calculateSkillMastery(skillResults.listening),
      speaking: calculateSkillMastery(skillResults.speaking),
      reading: calculateSkillMastery(skillResults.reading),
      writing: calculateSkillMastery(skillResults.writing),
    },
    skillDetails: {
      listening: calculateSkillDetails(skillResults.listening),
      speaking: calculateSkillDetails(skillResults.speaking),
      reading: calculateSkillDetails(skillResults.reading),
      writing: calculateSkillDetails(skillResults.writing),
    },
    streak: {
      current: currentStreak,
      longest: longestStreak,
    }
  };
}

// ============================================================================
// Get Personalized Recommendations from localStorage
// ============================================================================

export function getLocalRecommendations(userId: string) {
  const stats = getLocalStatistics(userId);
  
  if (!stats) {
    return {
      weakSkills: [],
      recommendedLessons: [],
      nextSteps: []
    };
  }
  
  // Identify weak skills (below 60%)
  const skills = [
    { name: 'vocabulary', mastery: stats.skills.vocabulary, label: 'Từ vựng' },
    { name: 'listening', mastery: stats.skills.listening, label: 'Nghe' },
    { name: 'speaking', mastery: stats.skills.speaking, label: 'Nói' },
    { name: 'reading', mastery: stats.skills.reading, label: 'Đọc' },
    { name: 'writing', mastery: stats.skills.writing, label: 'Viết' },
  ];
  
  const weakSkills = skills
    .filter(skill => skill.mastery < 60 && skill.mastery > 0)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 2);
  
  // Generate next steps
  const nextSteps = [];
  
  if (weakSkills.length > 0) {
    nextSteps.push(`Tập trung vào kỹ năng ${weakSkills[0].label.toLowerCase()} (${weakSkills[0].mastery}%)`);
  }
  
  if (stats.streak.current === 0) {
    nextSteps.push('Bắt đầu streak mới bằng cách hoàn thành 1 bài tập hôm nay');
  } else {
    nextSteps.push(`Duy trì streak ${stats.streak.current} ngày của bạn!`);
  }
  
  if (stats.overall.averageScore < 70) {
    nextSteps.push('Ôn tập lại các bài đã học để cải thiện điểm số');
  }
  
  return {
    weakSkills,
    recommendedLessons: [],
    nextSteps
  };
}