import { ArrowLeft, Award, BookOpen, CheckCircle, TrendingUp, Calendar, Target, Headphones, Mic, FileText, PenTool, Sparkles, Zap, Brain, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { allLessons as lessons } from '../data/allLessons';
import { getUserStatistics } from '../utils/analytics';
import { getLocalStatistics } from '../utils/localStorageAnalytics';
import { ProgressDebugPanel } from './ProgressDebugPanel';

interface ProgressProps {
  onBack: () => void;
  accessToken?: string | null;
  user?: {
    id: string;
    name: string;
    grade: number;
  };
}

export function Progress({ onBack, accessToken, user }: ProgressProps) {
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Try to load from API first
        const stats = await getUserStatistics(user.id);
        
        // Check if we got real data or empty data
        if (stats?.overall && (stats.overall.totalLessons > 0 || stats.overall.totalExercises > 0)) {
          console.log('[Progress] Loaded from API');
          setStatistics(stats);
        } else {
          // API returned empty data, try localStorage
          console.log('[Progress] API empty, trying localStorage');
          const localStats = getLocalStatistics(user.id);
          if (localStats) {
            console.log('[Progress] Loaded from localStorage');
            setStatistics(localStats);
          } else {
            console.log('[Progress] No data available');
            setStatistics(null);
          }
        }
      } catch (error) {
        console.error('[Progress] Error loading:', error);
        // Fallback to localStorage if API fails
        const localStats = getLocalStatistics(user.id);
        if (localStats) {
          console.log('[Progress] Loaded from localStorage (fallback)');
          setStatistics(localStats);
        } else {
          setStatistics(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải tiến độ...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Chưa có dữ liệu tiến độ</p>
            <p className="text-sm text-gray-500">Hoàn thành một số bài học để xem tiến độ của bạn</p>
          </div>
        </div>
      </div>
    );
  }

  const completedLessons = statistics.overall.totalLessons || 0;
  const totalLessons = lessons.length;
  const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const averageScore = statistics.overall.averageScore || 0;

  const getLevelBadge = () => {
    if (completionRate === 100) return { name: 'Master 🏆', color: 'bg-gradient-to-r from-purple-500 to-pink-500', textColor: 'text-white' };
    if (completionRate >= 75) return { name: 'Advanced ⭐', color: 'bg-gradient-to-r from-green-500 to-emerald-500', textColor: 'text-white' };
    if (completionRate >= 50) return { name: 'Intermediate 🎯', color: 'bg-gradient-to-r from-blue-500 to-cyan-500', textColor: 'text-white' };
    if (completionRate >= 25) return { name: 'Beginner+ 🌱', color: 'bg-gradient-to-r from-orange-400 to-yellow-400', textColor: 'text-white' };
    return { name: 'Beginner 🔰', color: 'bg-gradient-to-r from-gray-400 to-gray-500', textColor: 'text-white' };
  };

  const badge = getLevelBadge();

  // Skills data with icons and colors
  const skills = [
    {
      key: 'vocabulary',
      name: 'Từ vựng',
      nameEn: 'Vocabulary',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgLight: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-600',
      score: statistics.skills.vocabulary || 0,
      details: null
    },
    {
      key: 'listening',
      name: 'Nghe',
      nameEn: 'Listening',
      icon: Headphones,
      color: 'from-purple-500 to-purple-600',
      bgLight: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-600',
      score: statistics.skills.listening || 0,
      details: statistics.skillDetails?.listening
    },
    {
      key: 'speaking',
      name: 'Nói',
      nameEn: 'Speaking',
      icon: Mic,
      color: 'from-pink-500 to-pink-600',
      bgLight: 'from-pink-50 to-pink-100',
      textColor: 'text-pink-600',
      score: statistics.skills.speaking || 0,
      details: statistics.skillDetails?.speaking
    },
    {
      key: 'reading',
      name: 'Đọc',
      nameEn: 'Reading',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      bgLight: 'from-green-50 to-green-100',
      textColor: 'text-green-600',
      score: statistics.skills.reading || 0,
      details: statistics.skillDetails?.reading
    },
    {
      key: 'writing',
      name: 'Viết',
      nameEn: 'Writing',
      icon: PenTool,
      color: 'from-orange-500 to-orange-600',
      bgLight: 'from-orange-50 to-orange-100',
      textColor: 'text-orange-600',
      score: statistics.skills.writing || 0,
      details: statistics.skillDetails?.writing
    }
  ];

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { label: 'Xuất sắc', color: 'text-green-600' };
    if (score >= 80) return { label: 'Giỏi', color: 'text-blue-600' };
    if (score >= 70) return { label: 'Khá', color: 'text-yellow-600' };
    if (score >= 60) return { label: 'Trung bình', color: 'text-orange-600' };
    return { label: 'Cần cải thiện', color: 'text-red-600' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-gray-800">Tiến độ học tập</h1>
                <p className="text-gray-600">Theo dõi quá trình phát triển kỹ năng tiếng Anh</p>
              </div>
            </div>
            <div className={`px-6 py-3 rounded-full ${badge.color} shadow-lg`}>
              <span className={`${badge.textColor}`}>{badge.name}</span>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-800">Tiến độ tổng thể</h3>
              <span className="text-2xl text-blue-600">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-2">
              <div
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-gray-600 text-sm">
              {completedLessons} / {totalLessons} bài học đã hoàn thành
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <span className="text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded-full">Bài học</span>
              </div>
              <p className="text-2xl text-gray-800 mb-1">{statistics.overall.totalLessons}</p>
              <p className="text-sm text-gray-600">Đã hoàn thành</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-6 h-6 text-purple-600" />
                <span className="text-xs text-purple-600 bg-purple-200 px-2 py-1 rounded-full">Bài tập</span>
              </div>
              <p className="text-2xl text-gray-800 mb-1">{statistics.overall.totalExercises}</p>
              <p className="text-sm text-gray-600">Đã làm xong</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-6 h-6 text-green-600" />
                <span className="text-xs text-green-600 bg-green-200 px-2 py-1 rounded-full">Điểm TB</span>
              </div>
              <p className="text-2xl text-gray-800 mb-1">{averageScore}%</p>
              <p className={`text-sm ${getScoreLevel(averageScore).color}`}>
                {getScoreLevel(averageScore).label}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-6 h-6 text-orange-600" />
                <span className="text-xs text-orange-600 bg-orange-200 px-2 py-1 rounded-full">Streak</span>
              </div>
              <p className="text-2xl text-gray-800 mb-1">{statistics.streak.current}</p>
              <p className="text-sm text-gray-600">Ngày liên tiếp</p>
            </div>
          </div>
        </div>

        {/* 5 Skills Breakdown */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <h2 className="text-gray-800">Năng lực 5 kỹ năng</h2>
          </div>

          <div className="grid md:grid-cols-5 gap-4 mb-6">
            {skills.map((skill) => {
              const Icon = skill.icon;
              const scoreLevel = getScoreLevel(skill.score);
              
              return (
                <div key={skill.key} className={`bg-gradient-to-br ${skill.bgLight} rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer`}>
                  <div className="flex flex-col items-center text-center">
                    <div className={`bg-gradient-to-br ${skill.color} w-12 h-12 rounded-full flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-gray-800 text-sm mb-1">{skill.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{skill.nameEn}</p>
                    <p className={`text-2xl ${skill.textColor} mb-1`}>{skill.score}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className={`bg-gradient-to-r ${skill.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                    <p className={`text-xs ${scoreLevel.color}`}>{scoreLevel.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Skills Stats (4 main skills) */}
        {statistics.skillDetails && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Listening Details */}
            {statistics.skillDetails.listening && statistics.skillDetails.listening.totalExercises > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Headphones className="w-8 h-8 text-purple-600" />
                  <div>
                    <h3 className="text-gray-800">Kỹ năng Nghe</h3>
                    <p className="text-sm text-gray-600">Listening Skills</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-2xl text-purple-600 mb-1">{statistics.skillDetails.listening.averageScore}%</p>
                    <p className="text-xs text-gray-600">Điểm trung bình</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-2xl text-purple-600 mb-1">{statistics.skillDetails.listening.totalExercises}</p>
                    <p className="text-xs text-gray-600">Bài đã làm</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-lg text-purple-600 mb-1">{statistics.skillDetails.listening.totalCorrect}/{statistics.skillDetails.listening.totalQuestions}</p>
                    <p className="text-xs text-gray-600">Đúng/Tổng câu</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-2xl text-purple-600 mb-1">{statistics.skillDetails.listening.accuracy}%</p>
                    <p className="text-xs text-gray-600">Độ chính xác</p>
                  </div>
                </div>
              </div>
            )}

            {/* Speaking Details */}
            {statistics.skillDetails.speaking && statistics.skillDetails.speaking.totalExercises > 0 && (
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-3xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mic className="w-8 h-8 text-pink-600" />
                  <div>
                    <h3 className="text-gray-800">Kỹ năng Nói</h3>
                    <p className="text-sm text-gray-600">Speaking Skills</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-2xl text-pink-600 mb-1">{statistics.skillDetails.speaking.averageScore}%</p>
                    <p className="text-xs text-gray-600">Điểm trung bình</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-2xl text-pink-600 mb-1">{statistics.skillDetails.speaking.totalExercises}</p>
                    <p className="text-xs text-gray-600">Bài đã làm</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-lg text-pink-600 mb-1">{statistics.skillDetails.speaking.totalCorrect}/{statistics.skillDetails.speaking.totalQuestions}</p>
                    <p className="text-xs text-gray-600">Đúng/Tổng tiêu chí</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-2xl text-pink-600 mb-1">{statistics.skillDetails.speaking.accuracy}%</p>
                    <p className="text-xs text-gray-600">Độ chính xác</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reading Details */}
            {statistics.skillDetails.reading && statistics.skillDetails.reading.totalExercises > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="text-gray-800">Kỹ năng Đọc</h3>
                    <p className="text-sm text-gray-600">Reading Skills</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-2xl text-green-600 mb-1">{statistics.skillDetails.reading.averageScore}%</p>
                    <p className="text-xs text-gray-600">Điểm trung bình</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-2xl text-green-600 mb-1">{statistics.skillDetails.reading.totalExercises}</p>
                    <p className="text-xs text-gray-600">Bài đã làm</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-lg text-green-600 mb-1">{statistics.skillDetails.reading.totalCorrect}/{statistics.skillDetails.reading.totalQuestions}</p>
                    <p className="text-xs text-gray-600">Đúng/Tổng câu</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-2xl text-green-600 mb-1">{statistics.skillDetails.reading.accuracy}%</p>
                    <p className="text-xs text-gray-600">Độ chính xác</p>
                  </div>
                </div>
              </div>
            )}

            {/* Writing Details */}
            {statistics.skillDetails.writing && statistics.skillDetails.writing.totalExercises > 0 && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <PenTool className="w-8 h-8 text-orange-600" />
                  <div>
                    <h3 className="text-gray-800">Kỹ năng Viết</h3>
                    <p className="text-sm text-gray-600">Writing Skills</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-2xl text-orange-600 mb-1">{statistics.skillDetails.writing.averageScore}%</p>
                    <p className="text-xs text-gray-600">Điểm trung bình</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-2xl text-orange-600 mb-1">{statistics.skillDetails.writing.totalExercises}</p>
                    <p className="text-xs text-gray-600">Bài đã làm</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-lg text-orange-600 mb-1">{statistics.skillDetails.writing.totalCorrect}/{statistics.skillDetails.writing.totalQuestions}</p>
                    <p className="text-xs text-gray-600">Đúng/Tổng tiêu chí</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-2xl text-orange-600 mb-1">{statistics.skillDetails.writing.accuracy}%</p>
                    <p className="text-xs text-gray-600">Độ chính xác</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Weekly Progress */}
        {statistics.weekly && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h2 className="text-gray-800">Hoạt động tuần này</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-3xl text-gray-800 mb-1">{statistics.weekly.lessons}</p>
                <p className="text-sm text-gray-600">Bài học hoàn thành</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-3xl text-gray-800 mb-1">{statistics.weekly.exercises}</p>
                <p className="text-sm text-gray-600">Bài tập đã làm</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <p className="text-3xl text-gray-800 mb-1">{statistics.weekly.time}</p>
                <p className="text-sm text-gray-600">Phút học tập</p>
              </div>
            </div>
          </div>
        )}

        {/* Motivational Message */}
        <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-xl p-8 text-white text-center">
          <Star className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <h3 className="mb-3">
            {completionRate >= 75 
              ? '🎉 Xuất sắc! Bạn đang làm rất tốt!' 
              : completionRate >= 50
              ? '🌟 Tuyệt vời! Tiếp tục phát huy!'
              : '💪 Hãy cố gắng lên! Bạn làm được!'}
          </h3>
          <p className="text-blue-100 max-w-2xl mx-auto">
            {completionRate >= 75
              ? 'Chỉ còn một chút nữa là hoàn thành chương trình! Hãy duy trì phong độ này nhé!'
              : completionRate >= 50
              ? 'Bạn đã vượt qua được nửa chặng đường rồi! Tiếp tục cố gắng để đạt mục tiêu!'
              : 'Mỗi ngày học một chút, bạn sẽ tiến bộ nhanh chóng! Đừng bỏ cuộc nhé!'}
          </p>
          {averageScore >= 80 && (
            <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
              <p className="text-sm">⭐ Điểm số của bạn rất ấn tượng! Keep it up!</p>
            </div>
          )}
        </div>

        {/* Debug Panel */}
        {user && showDebug && (
          <ProgressDebugPanel userId={user.id} />
        )}
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="mt-4 block mx-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors text-sm"
        >
          {showDebug ? '🔍 Ẩn Debug Panel' : '🔧 Hiện Debug Panel'}
        </button>
      </div>
    </div>
  );
}