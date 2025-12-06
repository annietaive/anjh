import { useState, useEffect } from 'react';
import { ArrowLeft, Users, TrendingUp, Award, BookOpen, Brain, Target, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface StudentAnalytics {
  user_id: string;
  name: string;
  email: string;
  grade: number;
  total_lessons_completed: number;
  total_exercises_completed: number;
  average_score: number;
  vocabulary_mastery: number;
  listening_mastery: number;
  speaking_mastery: number;
  reading_mastery: number;
  writing_mastery: number;
  current_streak_days: number;
  last_activity_date: string | null;
  weakest_skill: string;
}

interface ClassStats {
  totalStudents: number;
  activeStudents: number;
  averageScore: number;
  totalLessonsCompleted: number;
  totalExercisesCompleted: number;
  studentsNeedingHelp: StudentAnalytics[];
  topPerformers: StudentAnalytics[];
}

interface TeacherAnalyticsDashboardProps {
  onBack: () => void;
  user: {
    id: string;
    name: string;
    grade: number;
  };
}

export function TeacherAnalyticsDashboard({ onBack, user }: TeacherAnalyticsDashboardProps) {
  const [classStats, setClassStats] = useState<ClassStats | null>(null);
  const [students, setStudents] = useState<StudentAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>(user.grade);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Demo data
  const demoClassStats: ClassStats = {
    totalStudents: 30,
    activeStudents: 24,
    averageScore: 76,
    totalLessonsCompleted: 180,
    totalExercisesCompleted: 540,
    studentsNeedingHelp: [
      {
        user_id: 'demo-1',
        name: 'Nguyễn Văn An',
        email: 'an@engmastery.com',
        grade: 6,
        total_lessons_completed: 2,
        total_exercises_completed: 4,
        average_score: 45,
        vocabulary_mastery: 40,
        listening_mastery: 45,
        speaking_mastery: 50,
        reading_mastery: 48,
        writing_mastery: 42,
        current_streak_days: 0,
        last_activity_date: '2025-11-28',
        weakest_skill: 'vocabulary',
      },
      {
        user_id: 'demo-2',
        name: 'Trần Thị Bình',
        email: 'binh@engmastery.com',
        grade: 6,
        total_lessons_completed: 3,
        total_exercises_completed: 6,
        average_score: 52,
        vocabulary_mastery: 55,
        listening_mastery: 48,
        speaking_mastery: 50,
        reading_mastery: 52,
        writing_mastery: 55,
        current_streak_days: 1,
        last_activity_date: '2025-12-04',
        weakest_skill: 'listening',
      },
    ],
    topPerformers: [
      {
        user_id: 'demo-3',
        name: 'Lê Hoàng Cường',
        email: 'cuong@engmastery.com',
        grade: 6,
        total_lessons_completed: 12,
        total_exercises_completed: 36,
        average_score: 95,
        vocabulary_mastery: 98,
        listening_mastery: 92,
        speaking_mastery: 94,
        reading_mastery: 96,
        writing_mastery: 95,
        current_streak_days: 15,
        last_activity_date: '2025-12-05',
        weakest_skill: 'listening',
      },
      {
        user_id: 'demo-4',
        name: 'Phạm Thu Dung',
        email: 'dung@engmastery.com',
        grade: 6,
        total_lessons_completed: 10,
        total_exercises_completed: 30,
        average_score: 88,
        vocabulary_mastery: 90,
        listening_mastery: 85,
        speaking_mastery: 87,
        reading_mastery: 92,
        writing_mastery: 86,
        current_streak_days: 8,
        last_activity_date: '2025-12-05',
        weakest_skill: 'listening',
      },
    ],
  };

  const demoStudents: StudentAnalytics[] = [
    ...demoClassStats.topPerformers,
    ...demoClassStats.studentsNeedingHelp,
    {
      user_id: 'demo-5',
      name: 'Hoàng Minh Đức',
      email: 'duc@engmastery.com',
      grade: 6,
      total_lessons_completed: 6,
      total_exercises_completed: 18,
      average_score: 72,
      vocabulary_mastery: 75,
      listening_mastery: 68,
      speaking_mastery: 70,
      reading_mastery: 74,
      writing_mastery: 73,
      current_streak_days: 3,
      last_activity_date: '2025-12-05',
      weakest_skill: 'listening',
    },
  ];

  useEffect(() => {
    loadClassAnalytics();
  }, [selectedGrade]);

  const loadClassAnalytics = async () => {
    setIsLoading(true);
    setDebugInfo('Starting to load class analytics...');
    
    try {
      // Check if user is demo user
      if (user.id === 'demo-user' || user.id.startsWith('demo-')) {
        setDebugInfo('Using demo mode (demo user detected)');
        setClassStats(demoClassStats);
        setStudents(demoStudents);
        setIsDemoMode(true);
        setIsLoading(false);
        return;
      }

      const { getSupabaseClient } = await import('../utils/supabase/client');
      const supabase = await getSupabaseClient();
      
      setDebugInfo('Supabase client initialized');

      // Get all students in the selected grade(s)
      let query = supabase
        .from('user_profiles')
        .select('user_id, name, email, grade')
        .eq('role', 'student');

      if (selectedGrade !== 'all') {
        query = query.eq('grade', selectedGrade);
      }

      const { data: studentsData, error: studentsError } = await query;

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
        setDebugInfo(`Error fetching students: ${studentsError.message}`);
        toast.error(`Lỗi khi tải danh sách học sinh: ${studentsError.message}`, {
          description: 'Đang hiển thị dữ liệu demo'
        });
        // Fallback to demo mode
        setClassStats(demoClassStats);
        setStudents(demoStudents);
        setIsDemoMode(true);
        setIsLoading(false);
        return;
      }

      setDebugInfo(`Found ${studentsData?.length || 0} students`);

      if (!studentsData || studentsData.length === 0) {
        // No students found - show info
        setDebugInfo('No students found in database');
        toast.info('Chưa có học sinh trong hệ thống', {
          description: 'Đang hiển thị dữ liệu demo. Học sinh cần đăng ký tài khoản để xuất hiện ở đây.'
        });
        setClassStats(demoClassStats);
        setStudents(demoStudents);
        setIsDemoMode(true);
        setIsLoading(false);
        return;
      }

      // Get analytics for each student
      const studentIds = studentsData.map((s: any) => s.user_id);
      setDebugInfo(`Fetching analytics for ${studentIds.length} students`);
      
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('learning_analytics')
        .select('*')
        .in('user_id', studentIds);

      if (analyticsError) {
        // PGRST205 = table not found (DB not fully setup)
        if (analyticsError.code === 'PGRST205') {
          console.log('⚠️ learning_analytics table not found - using default values');
          setDebugInfo('Analytics table chưa được tạo - hiển thị giá trị mặc định');
        } else {
          console.error('Error fetching analytics:', analyticsError);
          setDebugInfo(`Error fetching analytics: ${analyticsError.message}`);
        }
        // Don't show toast - this is expected when DB is not fully setup
      }

      setDebugInfo(`Found ${analyticsData?.length || 0} analytics records`);

      // Combine student data with analytics
      const studentsWithAnalytics: StudentAnalytics[] = studentsData.map((student: any) => {
        const analytics = analyticsData?.find((a: any) => a.user_id === student.user_id);
        
        // Find weakest skill
        const skills = {
          vocabulary: analytics?.vocabulary_mastery || 0,
          listening: analytics?.listening_mastery || 0,
          speaking: analytics?.speaking_mastery || 0,
          reading: analytics?.reading_mastery || 0,
          writing: analytics?.writing_mastery || 0,
        };
        const weakestSkill = Object.entries(skills).sort((a, b) => a[1] - b[1])[0][0];

        return {
          user_id: student.user_id,
          name: student.name,
          email: student.email,
          grade: student.grade,
          total_lessons_completed: analytics?.total_lessons_completed || 0,
          total_exercises_completed: analytics?.total_exercises_completed || 0,
          average_score: Math.round(analytics?.average_score || 0),
          vocabulary_mastery: Math.round(analytics?.vocabulary_mastery || 0),
          listening_mastery: Math.round(analytics?.listening_mastery || 0),
          speaking_mastery: Math.round(analytics?.speaking_mastery || 0),
          reading_mastery: Math.round(analytics?.reading_mastery || 0),
          writing_mastery: Math.round(analytics?.writing_mastery || 0),
          current_streak_days: analytics?.current_streak_days || 0,
          last_activity_date: analytics?.last_activity_date || null,
          weakest_skill: weakestSkill,
        };
      });

      // Calculate class statistics
      const totalStudents = studentsWithAnalytics.length;
      const activeStudents = studentsWithAnalytics.filter(
        s => s.last_activity_date && 
        new Date(s.last_activity_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length;
      const averageScore = studentsWithAnalytics.reduce((sum, s) => sum + s.average_score, 0) / totalStudents || 0;
      const totalLessonsCompleted = studentsWithAnalytics.reduce((sum, s) => sum + s.total_lessons_completed, 0);
      const totalExercisesCompleted = studentsWithAnalytics.reduce((sum, s) => sum + s.total_exercises_completed, 0);

      // Students needing help (score < 60 or no activity in 3 days)
      const studentsNeedingHelp = studentsWithAnalytics
        .filter(s => s.average_score < 60 || !s.last_activity_date || 
          new Date(s.last_activity_date) < new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
        .sort((a, b) => a.average_score - b.average_score)
        .slice(0, 5);

      // Top performers (score >= 85)
      const topPerformers = studentsWithAnalytics
        .filter(s => s.average_score >= 85)
        .sort((a, b) => b.average_score - a.average_score)
        .slice(0, 5);

      setClassStats({
        totalStudents,
        activeStudents,
        averageScore: Math.round(averageScore),
        totalLessonsCompleted,
        totalExercisesCompleted,
        studentsNeedingHelp,
        topPerformers,
      });
      setStudents(studentsWithAnalytics);
      setIsDemoMode(false);
      setDebugInfo(`Successfully loaded data for ${totalStudents} students (${activeStudents} active)`);
      
      toast.success(`Đã tải dữ liệu ${totalStudents} học sinh`, {
        description: `${activeStudents} học sinh hoạt động trong 7 ngày qua`
      });
    } catch (error: any) {
      console.error('Error loading class analytics:', error);
      setDebugInfo(`Error: ${error.message}`);
      toast.error('Có lỗi khi tải dữ liệu', {
        description: 'Đang hiển thị dữ liệu demo'
      });
      // Fallback to demo mode
      setClassStats(demoClassStats);
      setStudents(demoStudents);
      setIsDemoMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu phân tích lớp học...</p>
        </div>
      </div>
    );
  }

  if (!classStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Chưa có dữ liệu phân tích</p>
          <Button onClick={onBack} className="mt-4">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const skillLabels: Record<string, string> = {
    vocabulary: 'Từ vựng',
    listening: 'Nghe',
    speaking: 'Nói',
    reading: 'Đọc',
    writing: 'Viết',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-gray-800">Phân tích lớp học</h1>
                <p className="text-gray-600">Theo dõi tiến độ và năng lực của học sinh</p>
              </div>
            </div>
            {isDemoMode && (
              <div className="px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-sm text-yellow-800">Chế độ Demo</p>
              </div>
            )}
            {!isDemoMode && debugInfo && (
              <details className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg max-w-md">
                <summary className="text-sm text-blue-700 cursor-pointer">Debug Info</summary>
                <p className="text-xs text-blue-600 mt-2">{debugInfo}</p>
              </details>
            )}
          </div>

          {/* Grade Filter */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">Lọc theo lớp:</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedGrade('all')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedGrade === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tất cả
              </button>
              {[6, 7, 8, 9].map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedGrade === grade
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Lớp {grade}
                </button>
              ))}
            </div>
          </div>

          {/* Class Overview Stats */}
          <div className="grid md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-blue-600" />
                <span className="text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded-full">Học sinh</span>
              </div>
              <p className="text-gray-800 mb-1">{classStats.totalStudents}</p>
              <p className="text-sm text-gray-600">Tổng số</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <span className="text-xs text-green-600 bg-green-200 px-2 py-1 rounded-full">Hoạt động</span>
              </div>
              <p className="text-gray-800 mb-1">{classStats.activeStudents}</p>
              <p className="text-sm text-gray-600">Học tuần này</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-purple-600" />
                <span className="text-xs text-purple-600 bg-purple-200 px-2 py-1 rounded-full">Điểm TB</span>
              </div>
              <p className="text-gray-800 mb-1">{classStats.averageScore}%</p>
              <p className="text-sm text-gray-600">Cả lớp</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-8 h-8 text-orange-600" />
                <span className="text-xs text-orange-600 bg-orange-200 px-2 py-1 rounded-full">Bài học</span>
              </div>
              <p className="text-gray-800 mb-1">{classStats.totalLessonsCompleted}</p>
              <p className="text-sm text-gray-600">Đã hoàn thành</p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-pink-600" />
                <span className="text-xs text-pink-600 bg-pink-200 px-2 py-1 rounded-full">Bài tập</span>
              </div>
              <p className="text-gray-800 mb-1">{classStats.totalExercisesCompleted}</p>
              <p className="text-sm text-gray-600">Đã làm xong</p>
            </div>
          </div>
        </div>

        {/* Students Needing Help */}
        {classStats.studentsNeedingHelp.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-gray-800">Học sinh cần hỗ trợ</h2>
            </div>
            <div className="space-y-3">
              {classStats.studentsNeedingHelp.map((student) => (
                <div key={student.user_id} className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-800">{student.name}</h3>
                        <span className="text-sm text-gray-500">{student.email}</span>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">Lớp {student.grade}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Điểm TB</p>
                          <p className={`font-medium ${student.average_score < 50 ? 'text-red-600' : 'text-orange-600'}`}>
                            {Math.round(student.average_score)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Bài học</p>
                          <p className="font-medium text-gray-800">{student.total_lessons_completed}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Bài tập</p>
                          <p className="font-medium text-gray-800">{student.total_exercises_completed}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Kỹ năng yếu</p>
                          <p className="font-medium text-red-600">{skillLabels[student.weakest_skill]}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Streak</p>
                          <p className="font-medium text-gray-800">{student.current_streak_days} ngày</p>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Performers */}
        {classStats.topPerformers.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-yellow-600" />
              <h2 className="text-gray-800">Học sinh xuất sắc</h2>
            </div>
            <div className="space-y-3">
              {classStats.topPerformers.map((student, index) => (
                <div key={student.user_id} className="bg-gradient-to-r from-yellow-50 to-green-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                      }`}>
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-gray-800">{student.name}</h3>
                          <span className="text-sm text-gray-500">{student.email}</span>
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">Lớp {student.grade}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Điểm TB</p>
                            <p className="font-medium text-green-600">{Math.round(student.average_score)}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Bài học</p>
                            <p className="font-medium text-gray-800">{student.total_lessons_completed}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Bài tập</p>
                            <p className="font-medium text-gray-800">{student.total_exercises_completed}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Kỹ năng yếu nhất</p>
                            <p className="font-medium text-blue-600">{skillLabels[student.weakest_skill]}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Streak</p>
                            <p className="font-medium text-orange-600">{student.current_streak_days} ngày 🔥</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Students List */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-gray-800 mb-6">Tất cả học sinh ({students.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-700">Tên</th>
                  <th className="text-left py-3 px-4 text-gray-700">Email</th>
                  <th className="text-center py-3 px-4 text-gray-700">Lớp</th>
                  <th className="text-center py-3 px-4 text-gray-700">Điểm TB</th>
                  <th className="text-center py-3 px-4 text-gray-700">Bài học</th>
                  <th className="text-center py-3 px-4 text-gray-700">Bài tập</th>
                  <th className="text-center py-3 px-4 text-gray-700">Streak</th>
                  <th className="text-center py-3 px-4 text-gray-700">Kỹ năng yếu</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.user_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{student.name}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{student.email}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                        {student.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-medium ${
                        student.average_score >= 85 ? 'text-green-600' :
                        student.average_score >= 70 ? 'text-blue-600' :
                        student.average_score >= 60 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {Math.round(student.average_score)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-700">
                      {student.total_lessons_completed}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-700">
                      {student.total_exercises_completed}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`${student.current_streak_days > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                        {student.current_streak_days} {student.current_streak_days > 0 && '🔥'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-600">
                      {skillLabels[student.weakest_skill]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}