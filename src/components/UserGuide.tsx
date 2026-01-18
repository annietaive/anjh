import React, { useState } from 'react';
import { X, BookOpen, PenTool, TrendingUp, MessageCircle, CheckCircle, ArrowRight, Sparkles, Target, Award, Users } from 'lucide-react';

interface UserGuideProps {
  onClose: () => void;
  userName?: string;
}

export function UserGuide({ onClose, userName }: UserGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Sparkles className="w-12 h-12 text-purple-600" />,
      title: 'Chào mừng bạn đến với EngMastery!',
      description: `Xin chào ${userName || 'bạn'}! Chúc mừng bạn đã tham gia cộng đồng học tiếng Anh thông minh. Hãy cùng khám phá cách sử dụng nền tảng để đạt hiệu quả tốt nhất.`,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
            <h4 className="text-blue-900 mb-3">🎯 Mục tiêu của EngMastery</h4>
            <p className="text-gray-700">
              Giúp học sinh THCS học tiếng Anh theo chương trình Global Success một cách <strong>tương tác</strong>, 
              <strong> thú vị</strong> và <strong>hiệu quả</strong> với sự hỗ trợ của AI.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border-2 border-blue-100">
              <div className="text-2xl mb-2">📚</div>
              <div className="text-sm text-gray-600">48 Units đầy đủ</div>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-purple-100">
              <div className="text-2xl mb-2">📝</div>
              <div className="text-sm text-gray-600">720 bài tập tương tác</div>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-green-100">
              <div className="text-2xl mb-2">💬</div>
              <div className="text-sm text-gray-600">AI Teacher Emma</div>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-orange-100">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm text-gray-600">Theo dõi tiến độ</div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <BookOpen className="w-12 h-12 text-blue-600" />,
      title: 'Bước 1: Chọn & Học Bài',
      description: 'Khám phá 48 units được sắp xếp theo 4 cấp độ từ lớp 6 đến lớp 9.',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-5 rounded-xl border-l-4 border-blue-500">
            <h4 className="text-blue-900 mb-3 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
              Chọn cấp độ của bạn
            </h4>
            <p className="text-gray-700 mb-2">
              Từ trang chủ, chọn khối lớp phù hợp (Lớp 6, 7, 8, hoặc 9). Mỗi khối có 12 units được thiết kế theo chương trình Global Success.
            </p>
          </div>

          <div className="bg-purple-50 p-5 rounded-xl border-l-4 border-purple-500">
            <h4 className="text-purple-900 mb-3 flex items-center gap-2">
              <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
              Chọn Unit muốn học
            </h4>
            <p className="text-gray-700 mb-2">
              Click vào bất kỳ unit nào (ví dụ: "Unit 1: My New School"). Bạn sẽ thấy:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2 text-gray-700">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span><strong>Từ vựng:</strong> 30 từ quan trọng với phát âm, ví dụ, và hình ảnh</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span><strong>Ngữ pháp:</strong> Kiến thức cốt lõi với ví dụ thực tế</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span><strong>Chủ đề:</strong> Các topic liên quan để mở rộng vốn từ</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 p-5 rounded-xl border-l-4 border-green-500">
            <h4 className="text-green-900 mb-3 flex items-center gap-2">
              <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
              Tương tác với từ vựng
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl mb-1">🔊</div>
                <p className="text-sm text-gray-700">Click icon loa để nghe phát âm chuẩn</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <div className="text-2xl mb-1">✅</div>
                <p className="text-sm text-gray-700">Click "Đã học" khi nhớ từ</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <PenTool className="w-12 h-12 text-green-600" />,
      title: 'Bước 2: Làm Bài Tập Tương Tác',
      description: 'Sau khi học xong, hãy luyện tập 4 kỹ năng để củng cố kiến thức!',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-5 rounded-xl">
            <h4 className="text-green-900 mb-3 flex items-center gap-2">
              <Target className="w-6 h-6 text-green-600" />
              <strong>Quan trọng:</strong> Liên kết giữa học và luyện tập
            </h4>
            <p className="text-gray-700 mb-3">
              Sau khi học từ vựng và ngữ pháp trong một unit, hãy <strong className="text-green-600">làm ngay bài tập</strong> của unit đó để kiến thức được ghi nhớ tốt nhất!
            </p>
            <div className="bg-white p-4 rounded-lg border-2 border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📖</span>
                <ArrowRight className="w-5 h-5 text-gray-400" />
                <span className="text-2xl">📝</span>
                <ArrowRight className="w-5 h-5 text-gray-400" />
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-sm text-gray-600">Học bài → Làm bài tập → Kiểm tra kết quả</p>
            </div>
          </div>

          <div className="bg-blue-50 p-5 rounded-xl border-l-4 border-blue-500">
            <h4 className="text-blue-900 mb-3">📝 4 kỹ năng - 15 bài tập mỗi unit</h4>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <span className="text-xl">👂</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-blue-900">Listening (3 bài)</h5>
                    <p className="text-sm text-gray-600">Nghe và chọn đáp án đúng</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <span className="text-xl">📖</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-purple-900">Reading (4 bài)</h5>
                    <p className="text-sm text-gray-600">Đọc đoạn văn và trả lời câu hỏi</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <span className="text-xl">🗣️</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-green-900">Speaking (4 bài)</h5>
                    <p className="text-sm text-gray-600">Luyện phát âm với AI nhận xét</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <span className="text-xl">✍️</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-orange-900">Writing (4 bài)</h5>
                    <p className="text-sm text-gray-600">Viết câu/đoạn văn với AI chấm điểm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-5 rounded-xl border-l-4 border-yellow-500">
            <h4 className="text-yellow-900 mb-3">💡 Cách làm bài tập</h4>
            <ol className="space-y-2 ml-4">
              <li className="flex items-start gap-2 text-gray-700">
                <span className="bg-yellow-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span>Cuộn xuống phần "Bài tập thực hành" trong trang chi tiết unit</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <span className="bg-yellow-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span>Chọn tab kỹ năng muốn luyện (Listening, Reading, Speaking, Writing)</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <span className="bg-yellow-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span>Làm từng bài tập và nhấn "Nộp bài" để xem kết quả</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <span className="bg-yellow-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">4</span>
                <span>Xem điểm số, nhận xét AI và làm lại nếu muốn cải thiện</span>
              </li>
            </ol>
          </div>
        </div>
      )
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-purple-600" />,
      title: 'Bước 3: Theo Dõi Tiến Độ',
      description: 'Xem kết quả và tiến độ học tập để điều chỉnh kế hoạch học.',
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 p-5 rounded-xl border-l-4 border-purple-500">
            <h4 className="text-purple-900 mb-3 flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-600" />
              Trang Dashboard cá nhân
            </h4>
            <p className="text-gray-700 mb-3">
              Click vào tên của bạn ở góc trên bên phải để xem dashboard cá nhân với:
            </p>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white p-4 rounded-lg border-l-4 border-purple-300">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <strong className="text-gray-900">Tổng quan thống kê</strong>
                </div>
                <p className="text-sm text-gray-600 ml-7">Số units đã học, số từ đã nhớ, số bài tập đã hoàn thành</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-300">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <strong className="text-gray-900">Biểu đồ tiến độ</strong>
                </div>
                <p className="text-sm text-gray-600 ml-7">Xem điểm số từng kỹ năng qua các units</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-l-4 border-green-300">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <strong className="text-gray-900">Lịch sử bài tập</strong>
                </div>
                <p className="text-sm text-gray-600 ml-7">Chi tiết từng lần làm bài với điểm số và nhận xét</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-5 rounded-xl border-l-4 border-green-500">
            <h4 className="text-green-900 mb-3">🎯 Mục tiêu học tập</h4>
            <p className="text-gray-700 mb-3">
              Đặt mục tiêu cho bản thân để duy trì động lực:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">📚</div>
                <p className="text-sm text-gray-700">Học ít nhất 1 unit/tuần</p>
              </div>
              <div className="bg-white p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">💯</div>
                <p className="text-sm text-gray-700">Đạt 80%+ mỗi bài tập</p>
              </div>
              <div className="bg-white p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">📝</div>
                <p className="text-sm text-gray-700">Hoàn thành 4 kỹ năng/unit</p>
              </div>
              <div className="bg-white p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">🔄</div>
                <p className="text-sm text-gray-700">Ôn lại units cũ định kỳ</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <MessageCircle className="w-12 h-12 text-pink-600" />,
      title: 'Bước 4: Hỏi Teacher Emma',
      description: 'AI Teacher Emma luôn sẵn sàng giúp bạn 24/7!',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-5 rounded-xl">
            <h4 className="text-pink-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-pink-600" />
              Teacher Emma - Gia sư AI thông minh
            </h4>
            <p className="text-gray-700 mb-3">
              Emma là giáo viên ảo được trang bị công nghệ AI Gemini, có thể:
            </p>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white p-4 rounded-lg flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💬</span>
                <div>
                  <strong className="text-gray-900">Giải thích từ vựng & ngữ pháp</strong>
                  <p className="text-sm text-gray-600">Hỏi nghĩa từ, cách dùng, ví dụ thực tế</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🗣️</span>
                <div>
                  <strong className="text-gray-900">Nhận xét phát âm</strong>
                  <p className="text-sm text-gray-600">Đọc to và nhận feedback về phát âm của bạn</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">✍️</span>
                <div>
                  <strong className="text-gray-900">Chấm bài Writing</strong>
                  <p className="text-sm text-gray-600">Nhận xét ngữ pháp, từ vựng, cấu trúc câu</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🎓</span>
                <div>
                  <strong className="text-gray-900">Hướng dẫn học tập</strong>
                  <p className="text-sm text-gray-600">Gợi ý cách học hiệu quả, mẹo ghi nhớ</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-5 rounded-xl border-l-4 border-blue-500">
            <h4 className="text-blue-900 mb-3">💡 Cách sử dụng Teacher Emma</h4>
            <ol className="space-y-2 ml-4">
              <li className="flex items-start gap-2 text-gray-700">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span>Click vào icon "💬 Teacher Emma" ở góc dưới bên phải màn hình</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span>Gõ câu hỏi của bạn bằng tiếng Việt hoặc tiếng Anh</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span>Nhận câu trả lời chi tiết ngay lập tức</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">4</span>
                <span>Hỏi thêm nếu chưa hiểu hoặc muốn biết thêm</span>
              </li>
            </ol>
          </div>

          <div className="bg-yellow-50 p-4 rounded-xl">
            <h5 className="text-yellow-900 mb-2">📝 Ví dụ câu hỏi hay:</h5>
            <div className="space-y-1 text-sm text-gray-700">
              <p>• "Giải thích ngữ pháp Present Simple giúp em"</p>
              <p>• "Sự khác biệt giữa 'look', 'see' và 'watch' là gì?"</p>
              <p>• "Cho em ví dụ về câu điều kiện loại 1"</p>
              <p>• "Cách phát âm 'th' đúng như thế nào?"</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: <Users className="w-12 h-12 text-orange-600" />,
      title: 'Tính Năng Giáo Viên',
      description: 'Nếu bạn là giáo viên, bạn có thể giao bài và theo dõi học sinh.',
      content: (
        <div className="space-y-4">
          <div className="bg-orange-50 p-5 rounded-xl border-l-4 border-orange-500">
            <h4 className="text-orange-900 mb-3">👨‍🏫 Dành cho Giáo viên</h4>
            <p className="text-gray-700 mb-3">
              Chuyển sang chế độ giáo viên để quản lý lớp học:
            </p>
            <ol className="space-y-2 ml-4">
              <li className="flex items-start gap-2 text-gray-700">
                <span className="bg-orange-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                <span>Click "Chế độ Giáo viên" trong menu dashboard</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <span className="bg-orange-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                <span>Tìm học sinh theo username và thêm vào lớp</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <span className="bg-orange-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                <span>Giao bài tập cho từng học sinh hoặc cả lớp</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <span className="bg-orange-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">4</span>
              <span>Theo dõi tiến độ và kết quả của học sinh</span>
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 p-5 rounded-xl border-l-4 border-blue-500">
            <h4 className="text-blue-900 mb-3">👨‍🎓 Dành cho Học sinh</h4>
            <p className="text-gray-700 mb-2">
              Để giáo viên có thể tìm và giao bài cho bạn:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2 text-gray-700">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Cung cấp <strong>username</strong> của bạn cho giáo viên</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Xem bài tập được giao trong tab "Bài tập của tôi"</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Hoàn thành đúng hạn để được điểm cao</span>
              </li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const totalSteps = steps.length;
  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4 mb-4">
            {currentStepData.icon}
            <div>
              <h2 className="text-2xl mb-1">{currentStepData.title}</h2>
              <p className="text-blue-100 text-sm">{currentStepData.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-white'
                    : index < currentStep
                    ? 'bg-blue-300'
                    : 'bg-blue-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex items-center justify-between bg-gray-50">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all ${
              currentStep === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            Quay lại
          </button>

          <div className="text-sm text-gray-600">
            Bước {currentStep + 1} / {totalSteps}
          </div>

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={() => setCurrentStep(Math.min(totalSteps - 1, currentStep + 1))}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2"
            >
              Tiếp theo
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all flex items-center gap-2"
            >
              Bắt đầu học
              <CheckCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
