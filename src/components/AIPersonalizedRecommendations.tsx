import { useState } from 'react';
import { Sparkles, Brain, TrendingUp, Target, Lightbulb, BookOpen, AlertCircle, Settings, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface AIPersonalizedRecommendationsProps {
  statistics: {
    overall: {
      totalLessons: number;
      totalExercises: number;
      averageScore: number;
      totalTime: number;
    };
    skills: {
      vocabulary: number;
      listening: number;
      speaking: number;
      reading: number;
      writing: number;
    };
    skillDetails?: {
      listening?: { averageScore: number; totalExercises: number; accuracy: number };
      speaking?: { averageScore: number; totalExercises: number; accuracy: number };
      reading?: { averageScore: number; totalExercises: number; accuracy: number };
      writing?: { averageScore: number; totalExercises: number; accuracy: number };
    };
    streak: {
      current: number;
      longest: number;
    };
  };
  user: {
    name: string;
    grade: number;
  };
}

interface AIRecommendation {
  strengths: string[];
  weaknesses: string[];
  studyPlan: string[];
  motivationalMessage: string;
  specificTips: {
    listening?: string[];
    speaking?: string[];
    reading?: string[];
    writing?: string[];
  };
  goalSetting: string[];
}

export function AIPersonalizedRecommendations({ statistics, user }: AIPersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const handleSaveApiKey = () => {
    if (!apiKeyInput.trim()) {
      setError('Vui lòng nhập API Key');
      return;
    }
    
    localStorage.setItem('gemini_api_key', apiKeyInput.trim());
    setShowApiKeySetup(false);
    setError(null);
    setApiKeyInput('');
    
    // Auto generate after saving
    setTimeout(() => generateRecommendations(), 100);
  };

  const generateRecommendations = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Use user's API key from localStorage, or fallback to default
      const userApiKey = localStorage.getItem('gemini_api_key');
      const defaultApiKey = 'AIzaSyBXPnwA-gB2f6AenCznoUnCTI4ojRGOU2s';
      const apiKey = userApiKey || defaultApiKey;

      console.log('[AI] Using API key:', apiKey ? 'Available' : 'Missing');

      // Prepare learning data summary
      const learningProfile = {
        name: user.name,
        grade: user.grade,
        totalLessonsCompleted: statistics.overall.totalLessons,
        totalExercises: statistics.overall.totalExercises,
        averageScore: statistics.overall.averageScore,
        totalStudyTime: statistics.overall.totalTime,
        currentStreak: statistics.streak.current,
        longestStreak: statistics.streak.longest,
        skills: {
          vocabulary: statistics.skills.vocabulary,
          listening: statistics.skills.listening,
          speaking: statistics.skills.speaking,
          reading: statistics.skills.reading,
          writing: statistics.skills.writing,
        },
        detailedSkills: statistics.skillDetails || {},
      };

      // Create prompt for Gemini
      const prompt = `Bạn là Teacher Emma - một giáo viên tiếng Anh AI chuyên nghiệp và thân thiện cho học sinh THCS.

Phân tích dữ liệu học tập của học sinh và đưa ra gợi ý cá nhân hóa CHI TIẾT:

**Thông tin học sinh:**
- Tên: ${learningProfile.name}
- Lớp: ${learningProfile.grade}
- Tổng bài học hoàn thành: ${learningProfile.totalLessonsCompleted}
- Tổng bài tập đã làm: ${learningProfile.totalExercises}
- Điểm trung bình: ${learningProfile.averageScore}%
- Tổng thời gian học: ${learningProfile.totalStudyTime} phút
- Chuỗi ngày học hiện tại: ${learningProfile.currentStreak} ngày
- Chuỗi ngày học cao nhất: ${learningProfile.longestStreak} ngày

**Điểm số theo từng kỹ năng (%):**
- Từ vựng (Vocabulary): ${learningProfile.skills.vocabulary}%
- Nghe (Listening): ${learningProfile.skills.listening}%
- Nói (Speaking): ${learningProfile.skills.speaking}%
- Đọc (Reading): ${learningProfile.skills.reading}%
- Viết (Writing): ${learningProfile.skills.writing}%

**Chi tiết kỹ năng:**
${JSON.stringify(learningProfile.detailedSkills, null, 2)}

QUAN TRỌNG: Hãy trả về CHÍNH XÁC format JSON hợp lệ sau, KHÔNG có markdown code blocks, KHÔNG có dấu phẩy thừa, và ĐẢM BẢO JSON đầy đủ không bị cắt:

{
  "strengths": ["Điểm mạnh 1", "Điểm mạnh 2", "Điểm mạnh 3"],
  "weaknesses": ["Điểm yếu 1 và cách cải thiện", "Điểm yếu 2 và cách cải thiện"],
  "studyPlan": [
    "Tuần 1: Kế hoạch học cụ thể",
    "Tuần 2: Kế hoạch học cụ thể",
    "Tuần 3: Kế hoạch học cụ thể",
    "Tuần 4: Kế hoạch học cụ thể"
  ],
  "motivationalMessage": "Lời động viên cá nhân hóa dựa trên tiến độ thực tế",
  "specificTips": {
    "listening": ["Mẹo nghe 1", "Mẹo nghe 2"],
    "speaking": ["Mẹo nói 1", "Mẹo nói 2"],
    "reading": ["Mẹo đọc 1", "Mẹo đọc 2"],
    "writing": ["Mẹo viết 1", "Mẹo viết 2"]
  },
  "goalSetting": [
    "Mục tiêu ngắn hạn (1-2 tuần)",
    "Mục tiêu trung hạn (1 tháng)",
    "Mục tiêu dài hạn (3 tháng)"
  ]
}

LƯU Ý:
1. Phân tích DỰA VÀO DỮ LIỆU THỰC TẾ, không chung chung
2. Gợi ý CỤ THỂ, khả thi cho học sinh lớp ${learningProfile.grade}
3. Mỗi mục phải NGẮN GỌN (1-2 câu) để tránh vượt giới hạn
4. Trả về CHÍNH XÁC JSON hợp lệ, KHÔNG thêm text nào khác
5. ĐẢM BẢO không có dấu phẩy thừa ở cuối object/array`;

      // Call Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 4096, // Increased to handle long JSON responses
              topP: 0.95,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate recommendations');
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;

      // Parse JSON response
      let parsedRecommendations: AIRecommendation;
      try {
        // Remove markdown code blocks if present
        let jsonText = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        // Remove trailing comma if present (common AI mistake)
        jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1');
        
        // Check if JSON is complete (should end with })
        if (!jsonText.endsWith('}')) {
          console.warn('Incomplete JSON response detected, attempting to fix...');
          // Try to close incomplete JSON
          const openBraces = (jsonText.match(/{/g) || []).length;
          const closeBraces = (jsonText.match(/}/g) || []).length;
          const missingBraces = openBraces - closeBraces;
          
          if (missingBraces > 0) {
            // Close incomplete arrays/objects
            if (jsonText.includes('"goalSetting"') && !jsonText.includes(']', jsonText.lastIndexOf('"goalSetting"'))) {
              jsonText += '"]';
            }
            jsonText += '}'.repeat(missingBraces);
            console.log('Fixed incomplete JSON');
          }
        }
        
        parsedRecommendations = JSON.parse(jsonText);
        
        // Validate required fields
        if (!parsedRecommendations.strengths || !parsedRecommendations.weaknesses || 
            !parsedRecommendations.studyPlan || !parsedRecommendations.motivationalMessage) {
          throw new Error('Missing required fields in AI response');
        }
        
      } catch (parseError) {
        console.error('Failed to parse AI response:', aiResponse);
        console.error('Parse error:', parseError);
        throw new Error('AI trả về dữ liệu không hợp lệ. Vui lòng thử lại.');
      }

      setRecommendations(parsedRecommendations);
    } catch (err: any) {
      console.error('Error generating recommendations:', err);
      setError(err.message || 'Không thể tạo gợi ý. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!recommendations) {
    return (
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Sparkles className="w-6 h-6" />
            Gợi ý cá nhân hóa bằng AI
          </CardTitle>
          <CardDescription>
            Teacher Emma sẽ phân tích dữ liệu học tập của bạn và đưa ra lộ trình học tập cá nhân hóa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                <div className="text-sm text-gray-700">
                  <p className="mb-2">
                    AI sẽ phân tích:
                  </p>
                  <ul className="list-disc ml-4 space-y-1">
                    <li>Điểm mạnh và điểm yếu của bạn</li>
                    <li>Kế hoạch học tập 4 tuần chi tiết</li>
                    <li>Mẹo học tập cho từng kỹ năng</li>
                    <li>Mục tiêu học tập ngắn hạn và dài hạn</li>
                    <li>Lời động viên cá nhân hóa</li>
                  </ul>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800">{error}</div>
                </div>
              </div>
            )}

            {showApiKeySetup && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Settings className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-1">Cấu hình Gemini API Key</p>
                      <p className="mb-2">Để sử dụng tính năng AI, bạn cần API Key miễn phí từ Google:</p>
                      <ol className="list-decimal ml-4 space-y-1 mb-3">
                        <li>Truy cập <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">Google AI Studio <ExternalLink className="w-3 h-3" /></a></li>
                        <li>Đăng nhập với tài khoản Google</li>
                        <li>Nhấn "Create API Key" và copy key</li>
                        <li>Dán vào ô bên dưới</li>
                      </ol>
                    </div>
                  </div>
                  
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveApiKey()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Nhập Gemini API Key (ví dụ: AIzaSy...)"
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveApiKey}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Lưu và Tạo Gợi Ý
                    </Button>
                    <Button
                      onClick={() => setShowApiKeySetup(false)}
                      variant="outline"
                      className="px-4"
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!showApiKeySetup && (
              <Button
                onClick={generateRecommendations}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Đang phân tích dữ liệu...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Nhận gợi ý từ AI
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Motivational Message */}
      <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-900">
            <Sparkles className="w-6 h-6" />
            Lời nhắn từ Teacher Emma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-800 leading-relaxed">{recommendations.motivationalMessage}</p>
        </CardContent>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <TrendingUp className="w-5 h-5" />
              Điểm mạnh của bạn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-1">✓</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <Target className="w-5 h-5" />
              Cần cải thiện
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold mt-1">→</span>
                  <span className="text-gray-700">{weakness}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Study Plan */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <BookOpen className="w-5 h-5" />
            Kế hoạch học tập 4 tuần
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.studyPlan.map((plan, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 pt-1">{plan}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Specific Tips for Each Skill */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Lightbulb className="w-5 h-5" />
            Mẹo học cho từng kỹ năng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.specificTips.listening && (
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                  🎧 Nghe (Listening)
                </h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  {recommendations.specificTips.listening.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-500">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recommendations.specificTips.speaking && (
              <div className="bg-white rounded-lg p-4 border border-pink-200">
                <h4 className="font-semibold text-pink-700 mb-2 flex items-center gap-2">
                  🗣️ Nói (Speaking)
                </h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  {recommendations.specificTips.speaking.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-pink-500">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recommendations.specificTips.reading && (
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                  📖 Đọc (Reading)
                </h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  {recommendations.specificTips.reading.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recommendations.specificTips.writing && (
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">
                  ✍️ Viết (Writing)
                </h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  {recommendations.specificTips.writing.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-500">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Goal Setting */}
      <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <Target className="w-5 h-5" />
            Mục tiêu học tập
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.goalSetting.map((goal, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-indigo-200">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{goal}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regenerate Button */}
      <Button
        onClick={generateRecommendations}
        disabled={isGenerating}
        variant="outline"
        className="w-full"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2" />
            Đang tạo gợi ý mới...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Tạo gợi ý mới
          </>
        )}
      </Button>
    </div>
  );
}