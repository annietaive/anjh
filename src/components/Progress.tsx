import { ArrowLeft, Award, BookOpen, CheckCircle, TrendingUp, Calendar, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import { allLessons as lessons } from '../data/allLessons';
import { fetchUserProgress, UserProgress } from '../utils/api';
import { getLocalStatistics } from '../utils/localStorageAnalytics';

interface ProgressProps {
  onBack: () => void;
  accessToken?: string | null;
  user?: {
    id: string;
  };
}

export function Progress({ onBack, accessToken, user }: ProgressProps) {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const loadProgress = async () => {
      if (!accessToken) {
        // No token - try localStorage only
        if (user) {
          const localStats = getLocalStatistics(user.id);
          setDebugInfo(`No token. LocalStorage stats: ${localStats ? 'Found' : 'Not found'}`);
          if (localStats) {
            setUserProgress({
              completedLessons: localStats.overall.totalLessons,
              totalExercises: localStats.overall.totalExercises,
              correctAnswers: localStats.overall.totalExercises * (localStats.overall.averageScore / 100) * 18,
              totalScore: localStats.overall.averageScore * localStats.overall.totalExercises,
            } as UserProgress);
          }
        }
        setIsLoading(false);
        return;
      }

      // Has token - try API first, then fallback to localStorage
      try {
        const data = await fetchUserProgress(accessToken);
        
        // Check if we got real data or empty data
        if (data?.overall && (data.overall.completedLessons > 0 || data.overall.totalExercises > 0)) {
          setDebugInfo('Loaded from API');
          setUserProgress(data.overall);
        } else {
          // API returned empty data, use localStorage fallback
          if (user) {
            const localStats = getLocalStatistics(user.id);
            setDebugInfo(`API empty. LocalStorage stats: ${localStats ? 'Found' : 'Not found'}`);
            if (localStats) {
              setUserProgress({
                completedLessons: localStats.overall.totalLessons,
                totalExercises: localStats.overall.totalExercises,
                correctAnswers: localStats.overall.totalExercises * (localStats.overall.averageScore / 100) * 18,
                totalScore: localStats.overall.averageScore * localStats.overall.totalExercises,
              } as UserProgress);
            }
          }
        }
      } catch (error) {
        console.error('Error loading progress:', error);
        // Fallback to localStorage if API fails
        if (user) {
          const localStats = getLocalStatistics(user.id);
          setDebugInfo(`API error. LocalStorage stats: ${localStats ? 'Found' : 'Not found'}`);
          if (localStats) {
            setUserProgress({
              completedLessons: localStats.overall.totalLessons,
              totalExercises: localStats.overall.totalExercises,
              correctAnswers: localStats.overall.totalExercises * (localStats.overall.averageScore / 100) * 18,
              totalScore: localStats.overall.averageScore * localStats.overall.totalExercises,
            } as UserProgress);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [accessToken, user]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải tiến độ...</p>
        </div>
      </div>
    );
  }

  const completedLessons = userProgress?.completedLessons || 0;
  const totalLessons = lessons.length;
  const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const totalExercises = userProgress?.totalExercises || 0;
  const correctAnswers = userProgress?.correctAnswers || 0;
  const totalScore = userProgress?.totalScore || 0;

  const stats = [
    {
      icon: BookOpen,
      label: 'Bài học đã hoàn thành',
      value: `${completedLessons}/${totalLessons}`,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Award,
      label: 'Tỷ lệ hoàn thành',
      value: `${completionRate}%`,
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Target,
      label: 'Bài tập đã làm',
      value: totalExercises.toString(),
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: TrendingUp,
      label: 'Tổng điểm',
      value: totalScore.toString(),
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const getLevelBadge = () => {
    if (completionRate === 100) return { name: 'Master', color: 'text-purple-600 bg-purple-100' };
    if (completionRate >= 75) return { name: 'Advanced', color: 'text-green-600 bg-green-100' };
    if (completionRate >= 50) return { name: 'Intermediate', color: 'text-blue-600 bg-blue-100' };
    if (completionRate >= 25) return { name: 'Beginner+', color: 'text-orange-600 bg-orange-100' };
    return { name: 'Beginner', color: 'text-gray-600 bg-gray-100' };
  };

  const badge = getLevelBadge();

  // Calculate accuracy
  const accuracy = totalExercises > 0 
    ? Math.round((correctAnswers / (totalExercises * 10)) * 100) // Assuming ~10 questions per exercise
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Quay lại</span>
      </button>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-blue-900">Tiến độ học tập của bạn</h1>
          <div className={`px-4 py-2 rounded-full ${badge.color}`}>
            <span>{badge.name}</span>
          </div>
        </div>
        <p className="text-gray-600">
          Theo dõi quá trình học tập và những thành tích bạn đã đạt được
        </p>
        {/* Debug Info */}
        {debugInfo && (
          <div className="mt-2 text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded">
            Debug: {debugInfo} | User: {user?.id} | Token: {accessToken ? 'Yes' : 'No'}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className={`bg-gradient-to-br ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900">Tiến độ tổng thể</h2>
          <span className="text-blue-600">{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-gray-600 text-sm mt-2">
          {completedLessons} / {totalLessons} bài học đã hoàn thành
        </p>
      </div>

      {/* Additional Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-gray-900">Độ chính xác</h3>
          </div>
          <p className="text-gray-900 mb-2">{accuracy}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full"
              style={{ width: `${accuracy}%` }}
            />
          </div>
          <p className="text-gray-600 text-sm mt-2">
            {correctAnswers} câu trả lời đúng
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-gray-900">Hoạt động</h3>
          </div>
          <p className="text-gray-900 mb-2">{totalExercises} bài tập</p>
          <p className="text-gray-600 text-sm">
            Tiếp tục luyện tập để nâng cao kỹ năng!
          </p>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white text-center">
        <TrendingUp className="w-12 h-12 mx-auto mb-4" />
        <h3 className="mb-2">
          {completionRate >= 75 
            ? 'Xuất sắc! Bạn đang làm rất tốt!' 
            : completionRate >= 50
            ? 'Tuyệt vời! Tiếp tục phát huy!'
            : 'Hãy cố gắng lên! Bạn làm được!'}
        </h3>
        <p className="text-blue-100">
          {completionRate >= 75
            ? 'Chỉ còn một chút nữa là hoàn thành chương trình!'
            : completionRate >= 50
            ? 'Bạn đã vượt qua được nửa chặng đường rồi!'
            : 'Mỗi ngày học một chút, bạn sẽ tiến bộ nhanh chóng!'}
        </p>
      </div>
    </div>
  );
}