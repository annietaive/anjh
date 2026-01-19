/**
 * Mock Students Data - 60 học sinh ảo
 * Dữ liệu này được tạo để trông như dữ liệu thật từ database
 */

export interface MockStudent {
  id: string;
  email: string;
  name: string;
  username: string;
  grade: number;
  role: 'student';
  created_at: string;
  avatar_url?: string;
}

export interface MockProgress {
  user_id: string;
  lesson_id: number;
  completed: boolean;
  vocabulary_score: number;
  listening_score: number;
  speaking_score: number;
  reading_score: number;
  writing_score: number;
  total_score: number;
  last_accessed: string;
}

export interface MockExerciseResult {
  user_id: string;
  lesson_id: number;
  exercise_type: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  time_spent: number;
  completed_at: string;
}

export interface MockDailyActivity {
  user_id: string;
  last_activity_at: string;
  current_streak: number;
  longest_streak: number;
  total_learning_minutes: number;
  total_exercises_completed: number;
  total_lessons_completed: number;
}

// Real student names and emails
const studentData = [
  { name: 'Nguyễn Trường An', email: 'truongan111112@gmail.com', username: 'truongan' },
  { name: 'Trần Minh Khoa', email: 'khoa.tm92@gmail.com', username: 'minhkhoa' },
  { name: 'Lê Ngọc Linh', email: 'linhle_0305@gmail.com', username: 'ngoclinh' },
  { name: 'Phạm Gia Hân', email: 'giahan.p@gmail.com', username: 'giahan' },
  { name: 'Vũ Đức Long', email: 'long.vd88@gmail.com', username: 'duclong' },
  { name: 'Đặng Thảo My', email: 'mydang.cloud@gmail.com', username: 'thaomy' },
  { name: 'Bùi Thanh Tùng', email: 'tungbt_1999@gmail.com', username: 'thanhtung' },
  { name: 'Hồ Nhật Nam', email: 'nam.ho.sun@gmail.com', username: 'nhatnam' },
  { name: 'Dương Khánh Vy', email: 'vy.kduong@gmail.com', username: 'khanhvy' },
  { name: 'Cao Minh Quân', email: 'cmquan_777@gmail.com', username: 'minhquan' },
  { name: 'Lý Hoàng Phúc', email: 'phuc.lyh@gmail.com', username: 'hoangphuc' },
  { name: 'Phan Thùy Trang', email: 'trangpt.moon@gmail.com', username: 'thuytrang' },
  { name: 'Tạ Anh Tuấn', email: 'tuan.ta.a@gmail.com', username: 'anhtuan' },
  { name: 'Mai Quỳnh Anh', email: 'quynhanhmai@gmail.com', username: 'quynhanh' },
  { name: 'Trịnh Quốc Bảo', email: 'bao.trinhq@gmail.com', username: 'quocbao' },
  { name: 'Nguyễn Mỹ Duyên', email: 'duyen.ngm@gmail.com', username: 'myduyen' },
  { name: 'Lê Huy Hoàng', email: 'hoanglh.dev@gmail.com', username: 'huyhoang' },
  { name: 'Phạm Tuấn Kiệt', email: 'kietptx@gmail.com', username: 'tuankiet' },
  { name: 'Vũ Kim Ngân', email: 'nganvk.cute@gmail.com', username: 'kimngan' },
  { name: 'Trần Đức Minh', email: 'minh.trand@gmail.com', username: 'ducminh' },
  { name: 'Hoàng Nhật Minh', email: 'nhatminh.h@gmail.com', username: 'nhatminh' },
  { name: 'Bùi Gia Bảo', email: 'baobg_0102@gmail.com', username: 'giabao' },
  { name: 'Đỗ Thảo Nguyên', email: 'nguyen.do.t@gmail.com', username: 'thaonguyen' },
  { name: 'Nguyễn Khánh Linh', email: 'khlinh_ng@gmail.com', username: 'khanhlinh' },
  { name: 'Lê Anh Duy', email: 'duy.lea@gmail.com', username: 'anhduy' },
  { name: 'Phạm Quốc Thịnh', email: 'thinh.pq@gmail.com', username: 'quocthinh' },
  { name: 'Vũ Thanh Hà', email: 'ha.vth@gmail.com', username: 'thanhha' },
  { name: 'Trần Ngọc Anh', email: 'anhngoc.tr@gmail.com', username: 'ngocanh' },
  { name: 'Hồ Minh Phát', email: 'phat.ho_m@gmail.com', username: 'minhphat' },
  { name: 'Đặng Yến Nhi', email: 'nhi.yen.d@gmail.com', username: 'yennhi' },
  { name: 'Nguyễn Hải Đăng', email: 'dangnh.ai@gmail.com', username: 'haidang' },
  { name: 'Trần Thu Trang', email: 'trang.ttx@gmail.com', username: 'thutrang' },
  { name: 'Lê Quốc Việt', email: 'viet.leq@gmail.com', username: 'quocviet' },
  { name: 'Phạm Ngọc Bảo', email: 'baongo.p@gmail.com', username: 'ngocbao' },
  { name: 'Vũ Thảo Vy', email: 'vyvt.spark@gmail.com', username: 'thaovy' },
  { name: 'Đỗ Minh Quang', email: 'quangdm_404@gmail.com', username: 'minhquang' },
  { name: 'Cao Thị Mai', email: 'maicao.t@gmail.com', username: 'thimai' },
  { name: 'Hồ Gia Huy', email: 'huy.hogia@gmail.com', username: 'giahuy' },
  { name: 'Trịnh Thanh Tâm', email: 'tam.ttt@gmail.com', username: 'thanhtam' },
  { name: 'Bùi Phương Linh', email: 'linhbp.flow@gmail.com', username: 'phuonglinh' },
  { name: 'Nguyễn Tuệ Anh', email: 'anhtue.ng@gmail.com', username: 'tueanh' },
  { name: 'Phan Minh Đức', email: 'duc.pm@gmail.com', username: 'minhduc' },
  { name: 'Lê Khánh Toàn', email: 'toan.lk@gmail.com', username: 'khanhtoan' },
  { name: 'Vũ Hoàng Yến', email: 'yenvh.blue@gmail.com', username: 'hoangyen' },
  { name: 'Đặng Đức Huy', email: 'huydd_x@gmail.com', username: 'duchuy' },
  { name: 'Mai Thanh Phong', email: 'phong.mai@gmail.com', username: 'thanhphong' },
  { name: 'Trần Gia Linh', email: 'giatr.linh@gmail.com', username: 'gialinh' },
  { name: 'Nguyễn Quốc Anh', email: 'anh.nqz@gmail.com', username: 'quocanh' },
  { name: 'Bùi Nhật Hào', email: 'haobj.n@gmail.com', username: 'nhathao' },
  { name: 'Phạm Thùy Dung', email: 'dung.ptw@gmail.com', username: 'thuydung' },
  { name: 'Hồ Thế Anh', email: 'anh.hothe@gmail.com', username: 'theanh' },
  { name: 'Lý Minh Châu', email: 'chau.lm@gmail.com', username: 'minhchau' },
  { name: 'Trần Bảo Ngọc', email: 'ngoc.tbk@gmail.com', username: 'baongoc' },
  { name: 'Nguyễn Hoài Nam', email: 'nam.hoai.ng@gmail.com', username: 'hoainam' },
  { name: 'Đỗ Gia Phúc', email: 'phuc.dg@gmail.com', username: 'giaphuc' },
  { name: 'Vũ Minh Thảo', email: 'thao.vm@gmail.com', username: 'minhthao' },
  { name: 'Lê Tường Vy', email: 'vylt_09@gmail.com', username: 'tuongvy' },
  { name: 'Phạm Anh Khoa', email: 'khoapa@gmail.com', username: 'anhkhoa' },
  { name: 'Trịnh Mỹ Linh', email: 'linh.trm@gmail.com', username: 'mylinh' },
  { name: 'Nguyễn Nhật Quỳnh', email: 'quynh.nn@gmail.com', username: 'nhatquynh' },
];

// Generate 60 unique students
export const mockStudents: MockStudent[] = studentData.map((student, i) => {
  const grade = 6 + (i % 4); // Distribute across grades 6-9
  const year = new Date().getFullYear();
  const month = 1 + (i % 12);
  const day = 1 + (i % 28);
  
  return {
    id: `mock-student-${String(i + 1).padStart(3, '0')}`,
    email: student.email,
    name: student.name,
    username: student.username,
    grade,
    role: 'student',
    created_at: new Date(2024, month - 1, day).toISOString(),
    avatar_url: undefined,
  };
});

// Generate realistic progress data
export const generateMockProgress = (): MockProgress[] => {
  const progressData: MockProgress[] = [];
  const now = new Date();
  
  mockStudents.forEach((student, studentIdx) => {
    // Each student has completed 0-30 lessons randomly
    const lessonsCompleted = Math.floor(Math.random() * 31);
    
    for (let lessonId = 1; lessonId <= lessonsCompleted; lessonId++) {
      // Generate realistic scores
      const baseScore = 60 + Math.random() * 35; // 60-95
      const variance = 10;
      
      const vocabularyScore = Math.min(100, Math.max(0, Math.round(baseScore + (Math.random() - 0.5) * variance)));
      const listeningScore = Math.min(100, Math.max(0, Math.round(baseScore + (Math.random() - 0.5) * variance)));
      const speakingScore = Math.min(100, Math.max(0, Math.round(baseScore + (Math.random() - 0.5) * variance)));
      const readingScore = Math.min(100, Math.max(0, Math.round(baseScore + (Math.random() - 0.5) * variance)));
      const writingScore = Math.min(100, Math.max(0, Math.round(baseScore + (Math.random() - 0.5) * variance)));
      
      const totalScore = Math.round((vocabularyScore + listeningScore + speakingScore + readingScore + writingScore) / 5);
      
      // Last accessed within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const lastAccessed = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      
      progressData.push({
        user_id: student.id,
        lesson_id: lessonId,
        completed: true,
        vocabulary_score: vocabularyScore,
        listening_score: listeningScore,
        speaking_score: speakingScore,
        reading_score: readingScore,
        writing_score: writingScore,
        total_score: totalScore,
        last_accessed: lastAccessed.toISOString(),
      });
    }
  });
  
  return progressData;
};

// Generate realistic exercise results
export const generateMockExerciseResults = (): MockExerciseResult[] => {
  const exerciseTypes = ['vocabulary', 'listening', 'speaking', 'reading', 'writing'];
  const exerciseResults: MockExerciseResult[] = [];
  const now = new Date();
  
  mockStudents.forEach((student, studentIdx) => {
    const exercisesCount = 10 + Math.floor(Math.random() * 50); // 10-60 exercises
    
    for (let i = 0; i < exercisesCount; i++) {
      const lessonId = 1 + Math.floor(Math.random() * 20);
      const exerciseType = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
      const totalQuestions = 10 + Math.floor(Math.random() * 11); // 10-20 questions
      const correctAnswers = Math.floor(totalQuestions * (0.5 + Math.random() * 0.5)); // 50-100% correct
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      const timeSpent = 60 + Math.floor(Math.random() * 300); // 1-6 minutes
      
      const daysAgo = Math.floor(Math.random() * 30);
      const hoursAgo = Math.floor(Math.random() * 24);
      const completedAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000);
      
      exerciseResults.push({
        user_id: student.id,
        lesson_id: lessonId,
        exercise_type: exerciseType,
        score,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        time_spent: timeSpent,
        completed_at: completedAt.toISOString(),
      });
    }
  });
  
  return exerciseResults;
};

// Generate realistic daily activities
export const generateMockDailyActivities = (): MockDailyActivity[] => {
  const now = new Date();
  
  return mockStudents.map((student, idx) => {
    const daysActive = Math.floor(Math.random() * 60) + 10; // 10-70 days
    const currentStreak = Math.floor(Math.random() * 15) + 1; // 1-15 days
    const longestStreak = Math.max(currentStreak, Math.floor(Math.random() * 30) + 1);
    const totalMinutes = daysActive * (15 + Math.floor(Math.random() * 45)); // 15-60 min/day
    const totalExercises = Math.floor(totalMinutes / 5); // ~5 min per exercise
    const totalLessons = Math.floor(totalExercises / 5); // ~5 exercises per lesson
    
    const daysAgo = Math.floor(Math.random() * 3); // Last active 0-2 days ago
    const lastActivity = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    return {
      user_id: student.id,
      last_activity_at: lastActivity.toISOString(),
      current_streak: currentStreak,
      longest_streak: longestStreak,
      total_learning_minutes: totalMinutes,
      total_exercises_completed: totalExercises,
      total_lessons_completed: totalLessons,
    };
  });
};

// Pre-generate all data (this runs once when module is imported)
export const mockProgressData = generateMockProgress();
export const mockExerciseResults = generateMockExerciseResults();
export const mockDailyActivities = generateMockDailyActivities();

// Helper functions to query mock data (mimics Supabase API)
export const getMockStudents = () => mockStudents;

export const getMockStudentById = (userId: string) => 
  mockStudents.find(s => s.id === userId);

export const getMockProgressByUser = (userId: string) =>
  mockProgressData.filter(p => p.user_id === userId);

export const getMockProgressByLesson = (userId: string, lessonId: number) =>
  mockProgressData.find(p => p.user_id === userId && p.lesson_id === lessonId);

export const getMockExerciseResultsByUser = (userId: string) =>
  mockExerciseResults.filter(e => e.user_id === userId);

export const getMockExerciseResultsByLesson = (userId: string, lessonId: number) =>
  mockExerciseResults.filter(e => e.user_id === userId && e.lesson_id === lessonId);

export const getMockDailyActivity = (userId: string) =>
  mockDailyActivities.find(a => a.user_id === userId);

// Get aggregate statistics
export const getMockStatistics = () => {
  const totalStudents = mockStudents.length;
  const totalProgress = mockProgressData.length;
  const totalExercises = mockExerciseResults.length;
  
  const avgLessonsPerStudent = totalProgress / totalStudents;
  const avgExercisesPerStudent = totalExercises / totalStudents;
  
  const avgScore = mockProgressData.reduce((sum, p) => sum + p.total_score, 0) / totalProgress;
  
  const activeStudents = mockDailyActivities.filter(a => {
    const lastActive = new Date(a.last_activity_at);
    const daysSince = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince <= 7;
  }).length;
  
  return {
    totalStudents,
    activeStudents,
    totalLessonsCompleted: totalProgress,
    totalExercisesCompleted: totalExercises,
    avgLessonsPerStudent: Math.round(avgLessonsPerStudent * 10) / 10,
    avgExercisesPerStudent: Math.round(avgExercisesPerStudent * 10) / 10,
    avgScore: Math.round(avgScore * 10) / 10,
  };
};

// Get leaderboard
export const getMockLeaderboard = (grade?: number, limit: number = 10) => {
  let students = [...mockStudents];
  
  if (grade) {
    students = students.filter(s => s.grade === grade);
  }
  
  // Calculate total score for each student
  const leaderboard = students.map(student => {
    const progress = getMockProgressByUser(student.id);
    const totalScore = progress.reduce((sum, p) => sum + p.total_score, 0);
    const lessonsCompleted = progress.length;
    const avgScore = lessonsCompleted > 0 ? totalScore / lessonsCompleted : 0;
    const activity = getMockDailyActivity(student.id);
    
    return {
      ...student,
      lessonsCompleted,
      avgScore: Math.round(avgScore * 10) / 10,
      totalScore,
      currentStreak: activity?.current_streak || 0,
      totalMinutes: activity?.total_learning_minutes || 0,
    };
  });
  
  // Sort by total score descending
  leaderboard.sort((a, b) => b.totalScore - a.totalScore);
  
  return leaderboard.slice(0, limit);
};

// Get students by grade
export const getMockStudentsByGrade = (grade: number) =>
  mockStudents.filter(s => s.grade === grade);

// Get recent activities
export const getMockRecentActivities = (limit: number = 20) => {
  const activities = mockDailyActivities
    .map(a => ({
      ...a,
      student: getMockStudentById(a.user_id)!,
    }))
    .sort((a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime());
  
  return activities.slice(0, limit);
};