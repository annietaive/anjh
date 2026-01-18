import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, BookOpen, Users, Calendar, Send, Trash2, Eye, List, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { allLessons } from '../data/allLessons';
import { UserSearch } from './UserSearch';
import { StudentManagement } from './StudentManagement';
import { TeacherAnalyticsDashboard } from './TeacherAnalyticsDashboard';

interface Assignment {
  id: string;
  title: string;
  description: string;
  lesson_id: number;
  due_date: string;
  assigned_to_grade: number;
  created_at: string;
  status: 'active' | 'completed';
}

interface TeacherDashboardProps {
  onBack: () => void;
  user: {
    id: string;
    email: string;
    name: string;
    grade: number;
  };
  accessToken: string | null;
}

export function TeacherDashboard({ onBack, user, accessToken }: TeacherDashboardProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showStudentManagement, setShowStudentManagement] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Demo assignments
  const demoAssignments: Assignment[] = [
    {
      id: 'demo-1',
      title: 'Unit 1: My new school - Vocabulary',
      description: 'Hoàn thành tất cả bài tập từ vựng trong Unit 1',
      lesson_id: 1,
      due_date: '2025-12-05',
      assigned_to_grade: 6,
      status: 'active',
      created_at: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      title: 'Unit 2: My house - Speaking Practice',
      description: 'Luyện nói về ngôi nhà của em với AI Teacher',
      lesson_id: 2,
      due_date: '2025-12-10',
      assigned_to_grade: 6,
      status: 'active',
      created_at: new Date().toISOString(),
    },
  ];
  
  // Get first lesson for user's grade
  const getDefaultLessonId = () => {
    const firstLesson = allLessons.find(l => l.grade === user.grade);
    return firstLesson?.id || 1;
  };
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lessonId: getDefaultLessonId(),
    dueDate: '',
    assignedToGrade: user.grade,
    assignedToUserId: null as string | null,
  });
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    if (!accessToken) return;
    
    setIsLoading(true);
    try {
      const { getSupabaseClient } = await import('../utils/supabase/client');
      const supabase = await getSupabaseClient();

      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist or invalid UUID, use demo mode
        if (error.code === 'PGRST116' || error.code === 'PGRST205' || error.code === '22P02' || error.code === '42P17' || error.message.includes('invalid input syntax') || error.message.includes('infinite recursion')) {
          setAssignments(demoAssignments);
          setIsDemoMode(true);
          return;
        }
        throw error;
      }

      setAssignments(data || []);
      setIsDemoMode(false);
    } catch (error: any) {
      // Don't show error if table doesn't exist or invalid UUID
      if (error.code !== 'PGRST116' && error.code !== 'PGRST205' && error.code !== '22P02' && error.code !== '42P17') {
        console.error('Error loading assignments:', error);
        toast.error('Không thể tải danh sách bài tập');
      }
      // Fallback to demo mode on any error
      setAssignments(demoAssignments);
      setIsDemoMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!accessToken) {
      toast.error('Bạn cần đăng nhập để tạo bài tập');
      return;
    }

    if (!formData.title || !formData.description || !formData.dueDate) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const { getSupabaseClient } = await import('../utils/supabase/client');
      const supabase = await getSupabaseClient();

      const newAssignment: any = {
        teacher_id: user.id,
        title: formData.title,
        description: formData.description,
        lesson_id: formData.lessonId,
        due_date: formData.dueDate,
        assigned_to_grade: formData.assignedToGrade,
        status: 'active',
        created_at: new Date().toISOString(),
      };

      // If a specific student is selected, add their user_id
      if (formData.assignedToUserId) {
        newAssignment.assigned_to_user_id = formData.assignedToUserId;
      }

      const { error } = await supabase
        .from('assignments')
        .insert([newAssignment]);

      if (error) {
        // If table doesn't exist, save to demo mode (localStorage)
        if (error.code === 'PGRST116' || error.code === 'PGRST205') {
          const demoAssignment: Assignment = {
            id: `demo-${Date.now()}`,
            title: formData.title,
            description: formData.description,
            lesson_id: formData.lessonId,
            due_date: formData.dueDate,
            assigned_to_grade: formData.assignedToGrade,
            status: 'active',
            created_at: new Date().toISOString(),
          };
          
          // Add to current list
          setAssignments(prev => [demoAssignment, ...prev]);
          setIsDemoMode(true);
          
          toast.success('Tạo bài tập thành công (Chế độ Demo)', {
            description: 'Kết nối Supabase để lưu vào database thật'
          });
          
          setFormData({
            title: '',
            description: '',
            lessonId: getDefaultLessonId(),
            dueDate: '',
            assignedToGrade: user.grade,
            assignedToUserId: null,
          });
          setSelectedStudent(null);
          setShowCreateForm(false);
          return;
        }
        throw error;
      }

      toast.success('Tạo bài tập thành công');
      setFormData({
        title: '',
        description: '',
        lessonId: getDefaultLessonId(),
        dueDate: '',
        assignedToGrade: user.grade,
        assignedToUserId: null,
      });
      setSelectedStudent(null);
      setShowCreateForm(false);
      loadAssignments();
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      if (error.code !== 'PGRST116' && error.code !== 'PGRST205') {
        toast.error(error.message || 'Có lỗi xảy ra khi tạo bài tập');
      }
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài tập này?')) return;

    try {
      const { getSupabaseClient } = await import('../utils/supabase/client');
      const supabase = await getSupabaseClient();

      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', id);

      if (error) {
        if (error.code === 'PGRST116' || error.code === 'PGRST205') {
          toast.error('Bảng assignments chưa được tạo trong database.');
          return;
        }
        throw error;
      }

      toast.success('Đã xóa bài tập');
      loadAssignments();
    } catch (error: any) {
      console.error('Error deleting assignment:', error);
      if (error.code !== 'PGRST116' && error.code !== 'PGRST205') {
        toast.error('Có lỗi xảy ra khi xóa bài tập');
      }
    }
  };

  const getLessonTitle = (lessonId: number) => {
    const lesson = allLessons.find(l => l.id === lessonId);
    return lesson ? `Unit ${lesson.unit}: ${lesson.title}` : 'Unknown Lesson';
  };

  // If showing student management, render that instead
  if (showStudentManagement) {
    return <StudentManagement onBack={() => setShowStudentManagement(false)} user={user} />;
  }

  // If showing analytics, render that instead
  if (showAnalytics) {
    return <TeacherAnalyticsDashboard onBack={() => setShowAnalytics(false)} user={user} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-gray-800">Quản lý bài tập</h1>
                <p className="text-gray-600">Giao bài và theo dõi học sinh</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowAnalytics(true)} variant="outline" className="gap-2">
                <BarChart3 className="w-5 h-5" />
                Phân tích lớp học
              </Button>
              <Button onClick={() => setShowStudentManagement(true)} variant="outline" className="gap-2">
                <List className="w-5 h-5" />
                Danh sách học sinh
              </Button>
              <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2">
                <Plus className="w-5 h-5" />
                Tạo bài tập mới
              </Button>
            </div>
          </div>

          {/* Create Assignment Form */}
          {showCreateForm && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
              <h2 className="text-gray-800 mb-4">Tạo bài tập mới</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-700 block mb-2">Tiêu đề bài tập</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ví dụ: Hoàn thành bài tập Unit 1"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 block mb-2">Mô tả</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mô tả chi tiết về bài tập..."
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 block mb-2">Tìm kiếm học sinh (tùy chọn)</label>
                  <p className="text-xs text-gray-600 mb-2">Nếu không chọn học sinh cụ thể, bài tập sẽ được giao cho toàn bộ lớp</p>
                  <UserSearch 
                    onSelectUser={(student) => {
                      setSelectedStudent(student);
                      const studentId = student.user_id || student.id;
                      setFormData({ ...formData, assignedToUserId: studentId, assignedToGrade: student.grade });
                    }}
                    selectedUserId={formData.assignedToUserId || undefined}
                  />
                  {selectedStudent && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-sm">Đã chọn: <span className="font-medium">{selectedStudent.name}</span></p>
                        <p className="text-xs text-gray-600">@{selectedStudent.username} - Lớp {selectedStudent.grade}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedStudent(null);
                          setFormData({ ...formData, assignedToUserId: null });
                        }}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Bỏ chọn
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">Unit bài học</label>
                    <select
                      value={formData.lessonId}
                      onChange={(e) => setFormData({ ...formData, lessonId: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {allLessons
                        .filter(lesson => lesson.grade === formData.assignedToGrade)
                        .map(lesson => (
                          <option key={lesson.id} value={lesson.id}>
                            Unit {lesson.unit}: {lesson.title}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 block mb-2">Giao cho lớp</label>
                    <select
                      value={formData.assignedToGrade}
                      onChange={(e) => {
                        const newGrade = parseInt(e.target.value);
                        const firstLessonForGrade = allLessons.find(l => l.grade === newGrade);
                        setFormData({ 
                          ...formData, 
                          assignedToGrade: newGrade, 
                          lessonId: firstLessonForGrade?.id || 1 
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!!selectedStudent}
                    >
                      <option value={6}>Lớp 6</option>
                      <option value={7}>Lớp 7</option>
                      <option value={8}>Lớp 8</option>
                      <option value={9}>Lớp 9</option>
                    </select>
                    {selectedStudent && (
                      <p className="text-xs text-gray-600 mt-1">Lớp được chọn tự động theo học sinh</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 block mb-2">Hạn nộp</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={() => {
                    setShowCreateForm(false);
                    setSelectedStudent(null);
                    setFormData({
                      title: '',
                      description: '',
                      lessonId: getDefaultLessonId(),
                      dueDate: '',
                      assignedToGrade: user.grade,
                      assignedToUserId: null,
                    });
                  }} variant="outline">
                    Hủy
                  </Button>
                  <Button onClick={handleCreateAssignment}>
                    <Send className="w-4 h-4 mr-2" />
                    Giao bài tập
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Assignments List */}
          <div>
            <h2 className="text-gray-800 mb-4">Danh sách bài tập đã giao</h2>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải...</p>
              </div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Chưa có bài tập nào được giao</p>
                <p className="text-sm text-gray-500 mt-2">Nhấn nút "Tạo bài tập mới" để bắt đầu</p>
                <details className="mt-6 text-left max-w-2xl mx-auto">
                  <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                    Hướng dẫn tạo bảng assignments trong Supabase
                  </summary>
                  <div className="mt-4 p-4 bg-white rounded-lg border text-sm text-gray-700">
                    <p className="mb-3">Để sử dụng tính năng quản lý bài tập, bạn cần chạy file SQL migration tại <code className="bg-gray-100 px-2 py-1 rounded">/supabase/migrations/create_assignments_table.sql</code> và <code className="bg-gray-100 px-2 py-1 rounded">/supabase/migrations/create_user_profiles_table.sql</code></p>
                    <p className="text-gray-600">Hoặc bạn có thể tự tạo bảng trong Supabase Dashboard.</p>
                  </div>
                </details>
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-gray-800">{assignment.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            assignment.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {assignment.status === 'active' ? 'Đang hoạt động' : 'Đã hoàn thành'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{assignment.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            <span>{getLessonTitle(assignment.lesson_id)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <span>Hạn: {new Date(assignment.due_date).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-green-600" />
                            <span>Lớp {assignment.assigned_to_grade}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-gray-800 mb-1">{assignments.length}</h3>
            <p className="text-sm text-gray-600">Tổng bài tập</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-gray-800 mb-1">{assignments.filter(a => a.status === 'active').length}</h3>
            <p className="text-sm text-gray-600">Đang hoạt động</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-gray-800 mb-1">{assignments.filter(a => a.status === 'completed').length}</h3>
            <p className="text-sm text-gray-600">Đã hoàn thành</p>
          </div>
        </div>
      </div>
    </div>
  );
}