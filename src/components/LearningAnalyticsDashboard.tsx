import { useState, useEffect } from 'react';
import { TrendingUp, Award, Clock, Target, BookOpen, Zap, Brain, Star, ArrowLeft, Headphones, Mic, FileText, PenTool } from 'lucide-react';
import { Button } from './ui/button';
import { getUserStatistics, getPersonalizedRecommendations, getLearningAnalytics } from '../utils/analytics';
import { getLocalStatistics } from '../utils/localStorageAnalytics';
import { toast } from 'sonner@2.0.3';
import { allLessons } from '../data/allLessons';
import { AIPersonalizedRecommendations } from './AIPersonalizedRecommendations';
import { DatabaseDebugPanel } from './DatabaseDebugPanel';

interface LearningAnalyticsDashboardProps {
  user: {
    id: string;
    name: string;
    grade: number;
  };
  onBack: () => void;
  onSelectLesson?: (lessonId: number) => void;
}

export function LearningAnalyticsDashboard({ user, onBack, onSelectLesson }: LearningAnalyticsDashboardProps) {
  const [statistics, setStatistics] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [user.id]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      // Check if user is demo user - they can't have real analytics
      if (user.id === 'demo-user' || user.id.startsWith('demo-') || user.id.startsWith('mock-')) {
        console.log('[Analytics] Demo/mock user detected, skipping analytics');
        setStatistics(null);
        setRecommendations(null);
        setIsLoading(false);
        return;
      }

      // Try to load from API first
      console.log('[Analytics] Loading analytics for user:', user.id);
      const [stats, recs] = await Promise.all([
        getUserStatistics(user.id),
        getPersonalizedRecommendations(user.id)
      ]);

      console.log('[Analytics] Received stats:', stats);
      console.log('[Analytics] Received recommendations:', recs);

      // Always use stats if available, even if empty
      setStatistics(stats);
      setRecommendations(recs);

    } catch (error: any) {
      console.error('[Analytics] Error loading analytics:', error);
      setStatistics(null);
      setRecommendations(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu phân tích...</p>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Chưa có dữ liệu phân tích</p>
          <p className="text-sm text-gray-500 mt-2">Hoàn thành một số bài tập để xem thống kê</p>
          <Button onClick={onBack} className="mt-4">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const skillColors: Record<string, { bg: string; text: string }> = {
    vocabulary: { bg: 'bg-blue-100', text: 'text-blue-700' },
    listening: { bg: 'bg-purple-100', text: 'text-purple-700' },
    speaking: { bg: 'bg-pink-100', text: 'text-pink-700' },
    reading: { bg: 'bg-green-100', text: 'text-green-700' },
    writing: { bg: 'bg-orange-100', text: 'text-orange-700' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
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
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-gray-800">Phân tích học tập</h1>
                <p className="text-gray-600">Theo dõi tiến độ và năng lực của bạn</p>
              </div>
            </div>
          </div>

          {/* Overall Statistics */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <span className="text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded-full">Bài học</span>
              </div>
              <p className="text-gray-800 mb-1">{statistics.overall.totalLessons}</p>
              <p className="text-sm text-gray-600">Đã hoàn thành</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-purple-600" />
                <span className="text-xs text-purple-600 bg-purple-200 px-2 py-1 rounded-full">Bài tập</span>
              </div>
              <p className="text-gray-800 mb-1">{statistics.overall.totalExercises}</p>
              <p className="text-sm text-gray-600">Đã làm xong</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-green-600" />
                <span className="text-xs text-green-600 bg-green-200 px-2 py-1 rounded-full">Điểm TB</span>
              </div>
              <p className="text-gray-800 mb-1">{statistics.overall.averageScore}%</p>
              <p className="text-sm text-gray-600">
                {statistics.overall.averageScore >= 80 ? 'Xuất sắc!' : 
                 statistics.overall.averageScore >= 70 ? 'Khá tốt!' : 
                 statistics.overall.averageScore >= 60 ? 'Trung bình' : 'Cần cố gắng'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-orange-600" />
                <span className="text-xs text-orange-600 bg-orange-200 px-2 py-1 rounded-full">Thời gian</span>
              </div>
              <p className="text-gray-800 mb-1">{Math.floor(statistics.overall.totalTime / 60)}h {statistics.overall.totalTime % 60}m</p>
              <p className="text-sm text-gray-600">Tổng thời gian</p>
            </div>
          </div>

          {/* Streak */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-800">Chuỗi ngày học</h3>
                  <p className="text-sm text-gray-600">
                    Hiện tại: <span className="font-medium text-orange-600">{statistics.streak.current} ngày</span> • 
                    Cao nhất: <span className="font-medium text-yellow-600">{statistics.streak.longest} ngày</span>
                  </p>
                </div>
              </div>
              {statistics.streak.current > 0 && (
                <div className="text-center">
                  <p className="text-gray-800">{statistics.streak.current} 🔥</p>
                  <p className="text-xs text-gray-600">Đang streak!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills Breakdown */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <h2 className="text-gray-800 mb-6">Năng lực theo kỹ năng</h2>
          <div className="space-y-4">
            {Object.entries(statistics.skills).map(([skill, mastery]) => {
              const skillLabel: Record<string, string> = {
                vocabulary: 'Từ vựng',
                listening: 'Nghe',
                speaking: 'Nói',
                reading: 'Đọc',
                writing: 'Viết',
              };
              
              const colors = skillColors[skill] || { bg: 'bg-gray-100', text: 'text-gray-700' };
              const masteryNum = mastery as number;

              return (
                <div key={skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">{skillLabel[skill]}</span>
                    <span className={`font-medium ${colors.text}`}>{masteryNum}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`${colors.bg.replace('-100', '-500')} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${masteryNum}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Skills Stats - For 4 main skills */}
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
                    <p className="text-2xl text-purple-600 mb-1">{statistics.skillDetails.listening.totalCorrect}/{statistics.skillDetails.listening.totalQuestions}</p>
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
                    <p className="text-2xl text-pink-600 mb-1">{statistics.skillDetails.speaking.totalCorrect}/{statistics.skillDetails.speaking.totalQuestions}</p>
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
                    <p className="text-2xl text-green-600 mb-1">{statistics.skillDetails.reading.totalCorrect}/{statistics.skillDetails.reading.totalQuestions}</p>
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
                    <p className="text-2xl text-orange-600 mb-1">{statistics.skillDetails.writing.totalCorrect}/{statistics.skillDetails.writing.totalQuestions}</p>
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

        {/* Recommendations */}
        {recommendations && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <h2 className="text-gray-800 mb-6">Gợi ý cá nhân hóa</h2>
            
            {/* Weak Skills */}
            {recommendations.weakSkills && recommendations.weakSkills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-gray-700 mb-3">Kỹ năng cần cải thiện</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {recommendations.weakSkills.map((skill: any) => {
                    const colors = skillColors[skill.name] || { bg: 'bg-gray-100', text: 'text-gray-700' };
                    return (
                      <div key={skill.name} className={`${colors.bg} rounded-xl p-4`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-medium ${colors.text}`}>{skill.label}</span>
                          <span className={`text-sm ${colors.text}`}>{Math.round(skill.mastery)}%</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Làm thêm bài tập {skill.label.toLowerCase()} để cải thiện
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recommended Lessons */}
            {recommendations.recommendedLessons && recommendations.recommendedLessons.length > 0 && onSelectLesson && (
              <div className="mb-6">
                <h3 className="text-gray-700 mb-3">Bài học đề xuất cho bạn</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {recommendations.recommendedLessons.slice(0, 3).map((lessonId: number) => {
                    const lesson = allLessons.find(l => l.id === lessonId);
                    if (!lesson) return null;
                    return (
                      <button
                        key={lessonId}
                        onClick={() => onSelectLesson(lessonId)}
                        className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 text-left hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <span className="text-sm text-blue-600">Đề xuất</span>
                        </div>
                        <h4 className="text-gray-800 mb-1">Unit {lesson.unit}</h4>
                        <p className="text-sm text-gray-600">{lesson.title}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Next Steps */}
            {recommendations.nextSteps && recommendations.nextSteps.length > 0 && (
              <div>
                <h3 className="text-gray-700 mb-3">Bước tiếp theo</h3>
                <div className="space-y-2">
                  {recommendations.nextSteps.map((step: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Weekly Progress */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <h2 className="text-gray-800 mb-6">Tiến độ tuần này</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-800 mb-1">{statistics.weekly.lessons}</p>
              <p className="text-sm text-gray-600">Bài học hoàn thành</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-gray-800 mb-1">{statistics.weekly.exercises}</p>
              <p className="text-sm text-gray-600">Bài tập hoàn thành</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-800 mb-1">{statistics.weekly.time} phút</p>
              <p className="text-sm text-gray-600">Thời gian học</p>
            </div>
          </div>
        </div>

        {/* AI Personalized Recommendations */}
        <AIPersonalizedRecommendations 
          statistics={statistics}
          user={user}
        />

        {/* Debug Panel */}
        {showDebug && (
          <DatabaseDebugPanel userId={user.id} />
        )}
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="mt-4 block mx-auto bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700 px-4 py-2 rounded-full transition-colors text-sm"
        >
          {showDebug ? '🔍 Ẩn Debug Panel' : '🔧 Hiện Debug Panel'}
        </button>
      </div>
    </div>
  );
}