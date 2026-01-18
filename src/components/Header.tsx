import { BookOpen, MessageCircle, BarChart3, Home, Library, LogOut, User, Info, Settings, GraduationCap, Zap, HelpCircle, Brain, Database } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

type Page = 'home' | 'lessons' | 'lesson-detail' | 'exercises' | 'ai-teacher' | 'progress' | 'about' | 'account' | 'teacher' | 'interactive' | 'analytics' | 'admin';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user?: {
    name: string;
    email: string;
    grade: number;
    role?: 'student' | 'teacher';
  } | null;
  onLogout?: () => void;
  onShowGuide?: () => void;
}

export function Header({ currentPage, onNavigate, user, onLogout, onShowGuide }: HeaderProps) {
  const navItems = [
    { id: 'home' as Page, label: 'Trang chủ', icon: Home },
    { id: 'lessons' as Page, label: 'Bài học', icon: Library },
    { id: 'interactive' as Page, label: 'Bài tập tương tác', icon: Zap },
    { id: 'ai-teacher' as Page, label: 'Giáo viên AI', icon: MessageCircle },
    { id: 'progress' as Page, label: 'Tiến độ', icon: BarChart3 },
  ];

  // Check if user has admin/teacher privileges
  const isAdminOrTeacher = user?.role === 'teacher' || user?.email?.includes('admin') || user?.email?.includes('teacher');

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-blue-900 font-apple-heavy tracking-tight">EngMastery</h1>
              <p className="text-sm text-gray-600">Học tiếng Anh THCS</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <nav className="flex gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p>{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-blue-600 mt-1">Lớp {user.grade}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate('analytics')}>
                    <Brain className="w-4 h-4 mr-2" />
                    Phân tích học tập
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('account')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Quản lý tài khoản
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('teacher')} className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Quản lý bài tập
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onShowGuide}>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Hướng dẫn sử dụng
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('about')}>
                    <Info className="w-4 h-4 mr-2" />
                    Giới thiệu
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="md:hidden flex items-center gap-1 overflow-x-auto">
            {navItems.slice(0, 3).map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-blue-50'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                      currentPage === 'account' || currentPage === 'teacher' || currentPage === 'about'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-blue-50'
                    }`}
                    title="Tài khoản"
                  >
                    <User className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p>{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-blue-600 mt-1">Lớp {user.grade}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate('ai-teacher')}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Giáo viên AI
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('progress')}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Tiến độ
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate('account')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Quản lý tài khoản
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('teacher')} className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Quản lý bài tập
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onShowGuide}>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Hướng dẫn sử dụng
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('about')}>
                    <Info className="w-4 h-4 mr-2" />
                    Giới thiệu
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}