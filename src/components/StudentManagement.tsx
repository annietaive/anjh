import { useState, useEffect } from 'react';
import { Search, User, GraduationCap, Mail, Calendar, ArrowLeft, Loader2, RefreshCw, BookOpen, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { SupabaseConnectionTest } from './SupabaseConnectionTest';

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  username: string;
  email: string;
  grade: number;
  role: string;
  created_at: string;
}

interface StudentManagementProps {
  onBack: () => void;
  user: {
    id: string;
    email: string;
    name: string;
    grade: number;
  };
}

export function StudentManagement({ onBack, user }: StudentManagementProps) {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showConnectionTest, setShowConnectionTest] = useState(false);

  // Demo data
  const demoStudents: UserProfile[] = [
    { id: '1', user_id: 'demo-1', name: 'Nguyễn Văn An', username: 'nguyenvanan', email: 'an@engmastery.com', grade: 6, role: 'student', created_at: '2024-01-15T08:00:00Z' },
    { id: '2', user_id: 'demo-2', name: 'Trần Thị Bình', username: 'tranbinhthi', email: 'binh@engmastery.com', grade: 6, role: 'student', created_at: '2024-01-16T09:00:00Z' },
    { id: '3', user_id: 'demo-3', name: 'Lê Hoàng Cường', username: 'lehoangcuong', email: 'cuong@engmastery.com', grade: 7, role: 'student', created_at: '2024-01-17T10:00:00Z' },
    { id: '4', user_id: 'demo-4', name: 'Phạm Thu Dung', username: 'phamthudung', email: 'dung@engmastery.com', grade: 7, role: 'student', created_at: '2024-01-18T11:00:00Z' },
    { id: '5', user_id: 'demo-5', name: 'Hoàng Minh Đức', username: 'hoangminhduc', email: 'duc@engmastery.com', grade: 8, role: 'student', created_at: '2024-01-19T12:00:00Z' },
    { id: '6', user_id: 'demo-6', name: 'Đỗ Thị Hà', username: 'dothiha', email: 'ha@engmastery.com', grade: 8, role: 'student', created_at: '2024-01-20T13:00:00Z' },
    { id: '7', user_id: 'demo-7', name: 'Vũ Quang Huy', username: 'vuquanghuy', email: 'huy@engmastery.com', grade: 9, role: 'student', created_at: '2024-01-21T14:00:00Z' },
    { id: '8', user_id: 'demo-8', name: 'Bùi Lan Hương', username: 'builanhuong', email: 'huong@engmastery.com', grade: 9, role: 'student', created_at: '2024-01-22T15:00:00Z' },
    { id: '9', user_id: 'demo-9', name: 'Ngô Tiến Khoa', username: 'ngotienkhoa', email: 'khoa@engmastery.com', grade: 6, role: 'student', created_at: '2024-01-23T16:00:00Z' },
    { id: '10', user_id: 'demo-10', name: 'Đinh Thị Linh', username: 'dinhthilinh', email: 'linh@engmastery.com', grade: 7, role: 'student', created_at: '2024-01-24T17:00:00Z' },
    { id: '11', user_id: 'demo-11', name: 'Phan Văn Minh', username: 'phanvanminh', email: 'minh@engmastery.com', grade: 8, role: 'student', created_at: '2024-01-25T18:00:00Z' },
    { id: '12', user_id: 'demo-12', name: 'Võ Thị Nga', username: 'vothinga', email: 'nga@engmastery.com', grade: 9, role: 'student', created_at: '2024-01-26T19:00:00Z' },
  ];

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchQuery, selectedGrade]);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const { getSupabaseClient } = await import('../utils/supabase/client');
      const supabase = await getSupabaseClient();

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist or other error, use demo mode
        if (error.code === 'PGRST116' || error.code === 'PGRST205' || error.code === '22P02' || error.code === '42P17' || error.message.includes('permission denied') || error.message.includes('invalid input syntax') || error.message.includes('infinite recursion')) {
          console.log('Using demo mode for students');
          setStudents(demoStudents);
          setIsDemoMode(true);
          toast.info('Đang sử dụng dữ liệu mẫu', {
            description: 'Kết nối Supabase và chạy migrations để sử dụng dữ liệu thật'
          });
          return;
        }
        throw error;
      }

      if (!data || data.length === 0) {
        // No students found, use demo data
        setStudents(demoStudents);
        setIsDemoMode(true);
        toast.info('Chưa có học sinh nào đăng ký', {
          description: 'Hiển thị dữ liệu mẫu để demo'
        });
      } else {
        setStudents(data);
        setIsDemoMode(false);
        toast.success(`Đã tải ${data.length} học sinh`);
      }
    } catch (error: any) {
      console.error('Error loading students:', error);
      setStudents(demoStudents);
      setIsDemoMode(true);
      toast.error('Không thể tải danh sách học sinh, hiển thị dữ liệu mẫu');
    } finally {
      setIsLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(query) ||
        student.username.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
      );
    }

    // Filter by grade
    if (selectedGrade !== 'all') {
      filtered = filtered.filter(student => student.grade === selectedGrade);
    }

    setFilteredStudents(filtered);
  };

  const getStatsByGrade = (grade: number) => {
    return students.filter(s => s.grade === grade).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        {/* Setup Guide - Show prominently if in demo mode */}
        {isDemoMode && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6 mb-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 flex-shrink-0" />
                <div>
                  <h3 className="text-white mb-1">Đang sử dụng dữ liệu mẫu</h3>
                  <p className="text-orange-50 text-sm">
                    Kết nối Supabase để sử dụng dữ liệu thật và lưu trữ vĩnh viễn
                  </p>
                </div>
              </div>
              <Button onClick={() => setShowConnectionTest(true)} variant="outline" className="bg-white text-orange-600 hover:bg-orange-50 border-white">
                Kiểm tra kết nối
              </Button>
            </div>
          </div>
        )}

        {/* Connection Test */}
        {showConnectionTest && (
          <div className="mb-8">
            <h2 className="text-gray-800 mb-4">Kiểm tra kết nối Supabase</h2>
            <SupabaseConnectionTest />
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-gray-800">Danh sách học sinh</h1>
                <p className="text-gray-600">
                  {isDemoMode && <span className="text-orange-600">[Chế độ Demo] </span>}
                  Quản lý và tìm kiếm học sinh
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {isDemoMode && (
                <Button onClick={() => setShowConnectionTest(true)} variant="outline" className="gap-2 text-orange-600 border-orange-300 hover:bg-orange-50">
                  <BookOpen className="w-5 h-5" />
                  Kiểm tra kết nối
                </Button>
              )}
              <Button onClick={() => setShowConnectionTest(!showConnectionTest)} variant="outline" className="gap-2">
                <Settings className="w-5 h-5" />
                {showConnectionTest ? 'Ẩn' : 'Kiểm tra'} kết nối
              </Button>
              <Button onClick={loadStudents} variant="outline" className="gap-2">
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center">
              <GraduationCap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="text-gray-800 mb-1">{students.length}</h3>
              <p className="text-xs text-gray-600">Tổng học sinh</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-gray-800 mb-1">{getStatsByGrade(6)}</h3>
              <p className="text-xs text-gray-600">Lớp 6</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center">
              <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-gray-800 mb-1">{getStatsByGrade(7)}</h3>
              <p className="text-xs text-gray-600">Lớp 7</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 text-center">
              <BookOpen className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="text-gray-800 mb-1">{getStatsByGrade(8)}</h3>
              <p className="text-xs text-gray-600">Lớp 8</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-4 text-center">
              <BookOpen className="w-8 h-8 text-pink-600 mx-auto mb-2" />
              <h3 className="text-gray-800 mb-1">{getStatsByGrade(9)}</h3>
              <p className="text-xs text-gray-600">Lớp 9</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên, username hoặc email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả lớp</option>
              <option value={6}>Lớp 6</option>
              <option value={7}>Lớp 7</option>
              <option value={8}>Lớp 8</option>
              <option value={9}>Lớp 9</option>
            </select>
          </div>

          {/* Students List */}
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Đang tải danh sách học sinh...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Không tìm thấy học sinh nào</p>
              <p className="text-sm text-gray-500 mt-2">Thử thay đổi điều kiện tìm kiếm</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Hiển thị {filteredStudents.length} / {students.length} học sinh
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.map((student) => (
                  <div
                    key={student.user_id}
                    className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-800 truncate">{student.name}</h3>
                        <p className="text-sm text-gray-600">@{student.username}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs ${
                        student.grade === 6 ? 'bg-blue-100 text-blue-700' :
                        student.grade === 7 ? 'bg-green-100 text-green-700' :
                        student.grade === 8 ? 'bg-orange-100 text-orange-700' :
                        'bg-pink-100 text-pink-700'
                      }`}>
                        Lớp {student.grade}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Tham gia: {new Date(student.created_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        ID: {student.user_id.substring(0, 8)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}