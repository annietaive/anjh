import { ArrowLeft, Target, Users, Heart, Award, BookOpen, Sparkles, BookText, Mail, Phone } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

export function About({ onBack }: AboutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl mb-6 inline-block">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4 font-apple-heavy tracking-tight">
              EngMastery
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hệ thống học tiếng Anh trực tuyến dành cho học sinh THCS, được xây dựng theo chương trình Global Success với công nghệ AI tiên tiến
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
              <div className="text-3xl text-blue-600 mb-2">48</div>
              <div className="text-sm text-blue-800">Units</div>
              <div className="text-xs text-blue-600 mt-1">Lớp 6-9</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
              <div className="text-3xl text-purple-600 mb-2">2000+</div>
              <div className="text-sm text-purple-800">Từ vựng</div>
              <div className="text-xs text-purple-600 mt-1">Có phiên âm, ví dụ</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 text-center">
              <div className="text-3xl text-indigo-600 mb-2">500+</div>
              <div className="text-sm text-indigo-800">Bài tập</div>
              <div className="text-xs text-indigo-600 mt-1">Đa dạng dạng bài</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
              <div className="text-3xl text-green-600 mb-2">4</div>
              <div className="text-sm text-green-800">Kỹ năng</div>
              <div className="text-xs text-green-600 mt-1">Nghe-Nói-Đọc-Viết</div>
            </div>
          </div>
        </div>

        {/* Tính năng nổi bật */}
        <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl shadow-xl p-8 mb-8 border border-orange-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-orange-600">Tính Năng Nổi Bật</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-blue-800 mb-3">2000+ Từ vựng</h3>
              <p className="text-gray-600 text-sm">
                Kho từ vựng phong phú với phiên âm chuẩn IPA, nghĩa tiếng Việt, ví dụ minh họa và hình ảnh trực quan cho mỗi từ.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-purple-800 mb-3">500+ Bài tập</h3>
              <p className="text-gray-600 text-sm">
                Hệ thống bài tập đa dạng: ghép đôi, điền vào chỗ trống, sắp xếp câu, kéo thả, phát âm, từ đồng nghĩa - phù hợp từng lớp học.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-green-800 mb-3">AI thông minh</h3>
              <p className="text-gray-600 text-sm">
                Giáo viên ảo AI nhận xét phát âm, ngữ pháp, chấm bài viết tự động và đưa ra gợi ý cải thiện cá nhân hóa.
              </p>
            </div>
          </div>
        </div>

        {/* Mục tiêu */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-blue-600">Mục Tiêu Dự Án</h2>
          </div>
          <div className="space-y-4 text-gray-700">
            <p>
              EngMastery được phát triển với mục tiêu tạo ra một nền tảng học tiếng Anh toàn diện, hiện đại và hiệu quả cho học sinh Trung học Cơ sở tại Việt Nam.
            </p>
            <ul className="space-y-3 ml-6">
              <li className="flex gap-3">
                <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Cung cấp nội dung học tập đầy đủ và chất lượng theo chương trình Global Success (48 units cho 4 khối 6, 7, 8, 9)</span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Phát triển đồng đều 4 kỹ năng nghe, nói, đọc, viết thông qua các bài tập tương tác phong phú</span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Ứng dụng công nghệ AI để tạo trải nghiệm học tập cá nhân hóa với giáo viên ảo thông minh</span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Giúp học sinh tự học và rèn luyện tiếng Anh mọi lúc, mọi nơi một cách hiệu quả</span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Theo dõi tiến độ học tập và đánh giá năng lực một cách chi tiết, khoa học</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Đối tượng */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-purple-600">Đối Tượng Sử Dụng</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <h3 className="text-blue-800 mb-3">Học sinh THCS</h3>
              <p className="text-gray-700">
                Các em học sinh từ lớp 6 đến lớp 9 đang theo học chương trình Global Success, muốn nâng cao trình độ tiếng Anh và chuẩn bị tốt cho các kỳ thi.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
              <h3 className="text-purple-800 mb-3">Giáo viên</h3>
              <p className="text-gray-700">
                Giáo viên tiếng Anh có thể sử dụng nền tảng để giao bài tập, theo dõi tiến độ học tập của học sinh và hỗ trợ giảng dạy.
              </p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6">
              <h3 className="text-indigo-800 mb-3">Phụ huynh</h3>
              <p className="text-gray-700">
                Phụ huynh có thể theo dõi quá trình học tập của con em mình, biết được điểm mạnh và điểm cần cải thiện.
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6">
              <h3 className="text-pink-800 mb-3">Người tự học</h3>
              <p className="text-gray-700">
                Bất kỳ ai muốn học tiếng Anh theo chương trình THCS một cách có hệ thống và khoa học.
              </p>
            </div>
          </div>
        </div>

        {/* Ý nghĩa */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-green-600">Ý Nghĩa Dự Án</h2>
          </div>
          <div className="space-y-4 text-gray-700">
            <p>
              EngMastery không chỉ là một công cụ học tập đơn thuần mà còn mang ý nghĩa sâu sắc đối với giáo dục tiếng Anh tại Việt Nam:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-green-800 mb-2">Phổ cập công nghệ giáo dục</h3>
                <p className="text-gray-600">
                  Mang lại cơ hội tiếp cận với công nghệ AI và phương pháp học tập hiện đại cho học sinh ở mọi vùng miền.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-blue-800 mb-2">Nâng cao chất lượng học tập</h3>
                <p className="text-gray-600">
                  Giúp học sinh học tiếng Anh hiệu quả hơn thông qua bài tập tương tác và phản hồi tức thời từ AI.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-purple-800 mb-2">Hỗ trợ giáo viên</h3>
                <p className="text-gray-600">
                  Giảm tải công việc cho giáo viên, giúp họ tập trung vào những nhiệm vụ quan trọng hơn.
                </p>
              </div>
              <div className="border-l-4 border-pink-500 pl-4">
                <h3 className="text-pink-800 mb-2">Học tập cá nhân hóa</h3>
                <p className="text-gray-600">
                  Mỗi học sinh có thể học theo nhịp độ riêng, tập trung vào những điểm cần cải thiện.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Đội ngũ phát triển */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-xl p-8 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h2>Đội Ngũ Phát Triển</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Học sinh phát triển */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="mb-4">Học sinh thực hiện</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">👨‍💻</span>
                  </div>
                  <div>
                    <p className="text-white/80">Nguyễn Trường An</p>
                    <p className="text-white/60">Lớp 9D - Trường THCS Cao Bình</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">👨‍💻</span>
                  </div>
                  <div>
                    <p className="text-white/80">Trần Minh Khuê</p>
                    <p className="text-white/60">Lớp 9A - Trường THCS Cao Bình</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Giáo viên hướng dẫn */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="mb-4">Giáo viên hướng dẫn</h3>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">👩‍🏫</span>
                </div>
                <div>
                  <p className="text-white/80">Cô Nguyễn Huyền</p>
                  <p className="text-white/60">Giáo viên hướng dẫn</p>
                  <p className="text-white/60">Trường THCS Cao Bình</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trường học */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <p className="text-white/80 mb-2">Trường Trung học Cơ sở Cao Bình</p>
            <p className="text-white/60">Dự án được đang phát triển</p>
          </div>
        </div>

        {/* Công nghệ */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
          <h2 className="text-gray-800 mb-6">Công Nghệ Sử Dụng</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
              <p className="text-blue-800">React</p>
              <p className="text-blue-600 text-sm">Frontend Framework</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
              <p className="text-purple-800">TypeScript</p>
              <p className="text-purple-600 text-sm">Programming Language</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 text-center">
              <p className="text-indigo-800">Tailwind CSS</p>
              <p className="text-indigo-600 text-sm">Styling</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
              <p className="text-green-800">Supabase</p>
              <p className="text-green-600 text-sm">Backend & Database</p>
            </div>
          </div>
        </div>

        {/* Hướng dẫn */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <BookText className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-orange-600">Hướng Dẫn Sử Dụng</h2>
          </div>
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-gray-800 mb-3">Bước 1: Đăng ký/Đăng nhập</h3>
              <p className="text-gray-600 ml-4">
                Tạo tài khoản mới hoặc đăng nhập bằng email để bắt đầu hành trình học tiếng Anh của bạn.
              </p>
            </div>
            <div>
              <h3 className="text-gray-800 mb-3">Bước 2: Chọn khối lớp và Unit</h3>
              <p className="text-gray-600 ml-4">
                Chọn khối lớp phù hợp (6, 7, 8, hoặc 9) và bài học (Unit) mà bạn muốn học theo chương trình Global Success.
              </p>
            </div>
            <div>
              <h3 className="text-gray-800 mb-3">Bước 3: Luyện tập 4 kỹ năng</h3>
              <p className="text-gray-600 ml-4">
                Mỗi Unit bao gồm các bài tập về Listening (Nghe), Speaking (Nói), Reading (Đọc), và Writing (Viết). Hoàn thành từng phần để nắm vững kiến thức.
              </p>
            </div>
            <div>
              <h3 className="text-gray-800 mb-3">Bước 4: Làm bài kiểm tra</h3>
              <p className="text-gray-600 ml-4">
                Sau khi học xong mỗi Unit, làm bài kiểm tra để đánh giá mức độ hiểu bài. Kết quả sẽ được lưu lại để bạn theo dõi tiến độ.
              </p>
            </div>
            <div>
              <h3 className="text-gray-800 mb-3">Bước 5: Trò chuyện với AI Teacher</h3>
              <p className="text-gray-600 ml-4">
                Sử dụng tính năng AI Teacher để hỏi đáp, được giải thích thêm về ngữ pháp, từ vựng hoặc luyện tập giao tiếp tiếng Anh.
              </p>
            </div>
            <div>
              <h3 className="text-gray-800 mb-3">Bước 6: Theo dõi tiến độ</h3>
              <p className="text-gray-600 ml-4">
                Xem tiến độ học tập, điểm số các bài kiểm tra và những kỹ năng cần cải thiện trong phần Dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Liên hệ */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl shadow-xl p-8 mt-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h2>Liên Hệ</h2>
          </div>
          <div className="space-y-4">
            <p className="text-white/90">
              Nếu bạn có bất kỳ câu hỏi, góp ý hoặc cần hỗ trợ, vui lòng liên hệ với chúng tôi:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/80">Điện thoại</span>
                </div>
                <a href="tel:0855894205" className="text-white hover:text-white/80 transition-colors">
                  0855894205
                </a>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/80">Email</span>
                </div>
                <a href="mailto:truongan111112@gmail.com" className="text-white hover:text-white/80 transition-colors break-all">
                  truongan111112@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p className="mb-2">EngMastery - Học tiếng Anh thông minh cùng AI</p>
          <p className="text-sm">© 2025 - Dự án học tập tại THCS Cao Bình</p>
        </div>
      </div>
    </div>
  );
}