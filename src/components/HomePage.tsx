import { BookOpen, MessageCircle, Award, Sparkles, TrendingUp, Users, Zap, GraduationCap, CheckCircle, Brain, Target, Clock, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import bookGrade6 from 'figma:asset/44e0115c27a3a0c0e631e48040c4466e9c917053.png';
import bookGrade7 from 'figma:asset/33dc5cfccfc81152cc5cda9ef480e425a39d2129.png';
import bookGrade8 from 'figma:asset/5384d13379b5d276213f5f607f16d0a5cb905940.png';
import bookGrade9 from 'figma:asset/15dc872fe6e2be4d257c8a8d9e193d3b8b478797.png';

type Page = 'home' | 'lessons' | 'lesson-detail' | 'exercises' | 'ai-teacher' | 'progress' | 'about' | 'account' | 'teacher' | 'interactive';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  user?: {
    name: string;
    grade: number;
  } | null;
}

interface Book {
  grade: 6 | 7 | 8 | 9;
  title: string;
  image: string;
  color: string;
}

export function HomePage({ onNavigate, user }: HomePageProps) {
  const books: Book[] = [
    { 
      grade: 6, 
      title: 'Tiếng Anh 6',
      image: bookGrade6,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      grade: 7, 
      title: 'Tiếng Anh 7',
      image: bookGrade7,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      grade: 8, 
      title: 'Tiếng Anh 8',
      image: bookGrade8,
      color: 'from-pink-500 to-rose-500'
    },
    { 
      grade: 9, 
      title: 'Tiếng Anh 9',
      image: bookGrade9,
      color: 'from-purple-500 to-indigo-500'
    },
  ];

  const handleBookClick = (grade: 6 | 7 | 8 | 9) => {
    // Navigate to lessons page - the LessonList component will need to support filtering by grade
    localStorage.setItem('selectedGrade', grade.toString());
    onNavigate('lessons');
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Học theo Unit',
      description: 'Nội dung theo chương trình Global Success THCS',
      color: 'from-blue-500 to-blue-600',
      page: 'lessons' as Page,
    },
    {
      icon: Zap,
      title: 'Bài tập tương tác',
      description: 'Luyện tập với nhiều dạng bài tập hấp dẫn',
      color: 'from-yellow-500 to-orange-600',
      page: 'interactive' as Page,
    },
    {
      icon: MessageCircle,
      title: 'Giáo viên AI',
      description: 'Trò chuyện và hỏi đáp với giáo viên ảo thông minh',
      color: 'from-purple-500 to-purple-600',
      page: 'ai-teacher' as Page,
    },
    {
      icon: GraduationCap,
      title: 'Quản lý bài tập',
      description: 'Giáo viên giao bài và theo dõi học sinh',
      color: 'from-pink-500 to-rose-600',
      page: 'teacher' as Page,
    },
    {
      icon: TrendingUp,
      title: 'Theo dõi tiến độ',
      description: 'Xem kết quả học tập và tiến độ của bạn',
      color: 'from-green-500 to-emerald-600',
      page: 'progress' as Page,
    },
    {
      icon: Award,
      title: 'Quản lý tài khoản',
      description: 'Cập nhật thông tin và cài đặt cá nhân',
      color: 'from-indigo-500 to-blue-600',
      page: 'account' as Page,
    },
  ];

  const stats = [
    { label: 'Bài học', value: '48', icon: BookOpen },
    { label: 'Từ vựng', value: '2000+', icon: Sparkles },
    { label: 'Bài tập', value: '500+', icon: Award },
  ];

  const benefits = [
    {
      icon: Brain,
      title: 'AI thông minh',
      description: 'Giáo viên AI Gemini hỗ trợ học tập 24/7',
    },
    {
      icon: Target,
      title: 'Học theo mục tiêu',
      description: 'Chương trình chuẩn SGK Global Success',
    },
    {
      icon: CheckCircle,
      title: 'Bài tập đa dạng',
      description: '4 kỹ năng: Nghe - Nói - Đọc - Viết',
    },
    {
      icon: Clock,
      title: 'Học mọi lúc, mọi nơi',
      description: 'Truy cập dễ dàng trên mọi thiết bị',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Chọn bài học',
      description: 'Chọn unit theo lớp và chủ đề yêu thích',
    },
    {
      step: '2',
      title: 'Học từ vựng',
      description: 'Học từ vựng mới với hình ảnh và phát âm',
    },
    {
      step: '3',
      title: 'Luyện tập',
      description: 'Làm bài tập tương tác và kiểm tra kiến thức',
    },
    {
      step: '4',
      title: 'Theo dõi tiến độ',
      description: 'Xem kết quả và cải thiện từng ngày',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Hero Section with Image */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 animate-fade-in">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-apple-semibold">Học tiếng Anh thông minh với AI</span>
            </span>
          </div>
          <h1 className="text-blue-900 font-apple-heavy tracking-tight text-4xl md:text-5xl leading-tight">
            Chào mừng đến với EngMastery
          </h1>
          <p className="text-gray-600 text-lg font-apple-semibold">
            Nền tảng học tiếng Anh trực tuyến dành cho học sinh THCS với giáo viên AI, 
            bài học tương tác và theo dõi tiến độ chi tiết
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('lessons')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-apple-semibold hover:scale-105"
            >
              Bắt đầu học ngay
            </button>
            <button
              onClick={() => onNavigate('ai-teacher')}
              className="bg-white text-blue-600 px-8 py-3 rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-all font-apple-semibold hover:scale-105"
            >
              Trò chuyện với AI
            </button>
          </div>
        </div>

        <div className="relative animate-fade-in-delay">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded-3xl blur-2xl opacity-30"></div>
          <div className="relative">
            <div className="text-center mb-4">
              <h3 className="text-blue-900 mb-2">Chọn lớp học của bạn</h3>
              <p className="text-gray-600 text-sm">Click vào sách giáo khoa để bắt đầu học</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {books.map((book) => (
                <button
                  key={book.grade}
                  onClick={() => handleBookClick(book.grade)}
                  className="group relative bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${book.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  
                  {/* Book Cover */}
                  <div className="relative aspect-[3/4] mb-3 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Book Title */}
                  <div className="relative">
                    <h4 className="text-gray-900 text-center mb-1">{book.title}</h4>
                    <div className={`mx-auto w-12 h-1 bg-gradient-to-r ${book.color} rounded-full group-hover:w-16 transition-all`}></div>
                  </div>
                  
                  {/* Hover Effect Icon */}
                  <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4 text-blue-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-xl transition-all hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-blue-900 mb-1">{stat.value}</div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Why Choose EngMastery */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-blue-900 mb-4">Tại sao chọn EngMastery?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Học tiếng Anh hiệu quả với công nghệ AI tiên tiến và phương pháp giảng dạy hiện đại
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2 text-lg">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-blue-900 mb-4">Cách thức hoạt động</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chỉ với 4 bước đơn giản, bạn có thể bắt đầu hành trình chinh phục tiếng Anh
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map((item, index) => (
            <div 
              key={index} 
              className="relative bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-apple-heavy shadow-lg">
                {item.step}
              </div>
              <h3 className="text-gray-900 mb-2 mt-4">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Teacher Feature Highlight */}
      <div className="grid md:grid-cols-2 gap-12 items-center bg-white rounded-3xl p-8 md:p-12 shadow-lg">
        <div className="order-2 md:order-1">
          <div className="inline-block bg-purple-100 text-purple-600 px-3 py-1 rounded-full mb-4">
            <span className="text-sm font-apple-semibold">Công nghệ AI tiên tiến</span>
          </div>
          <h2 className="text-blue-900 mb-4">Giáo viên AI - Teacher Emma</h2>
          <p className="text-gray-600 mb-6">
            Trò chuyện với giáo viên AI thông minh được trang bị công nghệ Gemini. 
            Teacher Emma sẵn sàng giải đáp mọi thắc mắc về ngữ pháp, từ vựng, và giúp bạn 
            luyện tập giao tiếp tiếng Anh tự nhiên.
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">Trả lời câu hỏi ngay lập tức</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">Chấm bài viết và đưa ra nhận xét</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">Phân tích phát âm và ngữ pháp</span>
            </li>
          </ul>
          <button
            onClick={() => onNavigate('ai-teacher')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-apple-semibold hover:scale-105"
          >
            Trò chuyện ngay
          </button>
        </div>
        <div className="order-1 md:order-2">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-3xl blur-2xl opacity-30"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc2NDU4NzYzNnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="AI Education"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-blue-900 mb-4">Tính năng nổi bật</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá các tính năng học tập hiện đại giúp bạn nâng cao trình độ tiếng Anh
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <button
                key={index}
                onClick={() => onNavigate(feature.page)}
                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all text-left group hover:-translate-y-1"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <Users className="w-12 h-12 mx-auto mb-4" />
          <h2 className="mb-4">Sẵn sàng cải thiện tiếng Anh?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn học sinh đang học tiếng Anh hiệu quả với phương pháp hiện đại
          </p>
          <button
            onClick={() => onNavigate('lessons')}
            className="bg-white text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-50 transition-all hover:scale-105 font-apple-semibold"
          >
            Khám phá bài học
          </button>
        </div>
      </div>

      {/* About Link */}
      <div className="text-center">
        <button
          onClick={() => onNavigate('about')}
          className="text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center gap-2 group"
        >
          <span>Tìm hiểu thêm về dự án EngMastery</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
}