import { useState } from 'react';
import { Search, User, AtSign, GraduationCap, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  username: string;
  email: string;
  grade: number;
  role: string;
}

interface UserSearchProps {
  onSelectUser: (user: UserProfile) => void;
  selectedUserId?: string;
}

export function UserSearch({ onSelectUser, selectedUserId }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Demo data for when Supabase is not configured
  const demoStudents: UserProfile[] = [
    { id: '1', user_id: 'demo-student-1', name: 'Nguyễn Văn An', username: 'nguyenvanan', email: 'an@example.com', grade: 6, role: 'student' },
    { id: '2', user_id: 'demo-student-2', name: 'Trần Thị Bình', username: 'tranbinhthi', email: 'binh@example.com', grade: 6, role: 'student' },
    { id: '3', user_id: 'demo-student-3', name: 'Lê Hoàng Cường', username: 'lehoangcuong', email: 'cuong@example.com', grade: 7, role: 'student' },
    { id: '4', user_id: 'demo-student-4', name: 'Phạm Thu Dung', username: 'phamthudung', email: 'dung@example.com', grade: 7, role: 'student' },
    { id: '5', user_id: 'demo-student-5', name: 'Hoàng Minh Đức', username: 'hoangminhduc', email: 'duc@example.com', grade: 8, role: 'student' },
    { id: '6', user_id: 'demo-student-6', name: 'Đỗ Thị Hà', username: 'dothiha', email: 'ha@example.com', grade: 8, role: 'student' },
    { id: '7', user_id: 'demo-student-7', name: 'Vũ Quang Huy', username: 'vuquanghuy', email: 'huy@example.com', grade: 9, role: 'student' },
    { id: '8', user_id: 'demo-student-8', name: 'Bùi Lan Hương', username: 'builanhuong', email: 'huong@example.com', grade: 9, role: 'student' },
    { id: '9', user_id: 'demo-student-9', name: 'Ngô Tiến Khoa', username: 'ngotienkhoa', email: 'khoa@example.com', grade: 6, role: 'student' },
    { id: '10', user_id: 'demo-student-10', name: 'Đinh Thị Linh', username: 'dinhthilinh', email: 'linh@example.com', grade: 7, role: 'student' },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Vui lòng nhập username hoặc tên để tìm kiếm');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const { getSupabaseClient } = await import('../utils/supabase/client');
      const supabase = await getSupabaseClient();

      // Search by username or name
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .or(`username.ilike.%${searchQuery}%,name.ilike.%${searchQuery}%`)
        .eq('role', 'student')
        .limit(10);

      if (error) {
        // If table doesn't exist or permission denied, use demo data
        if (error.code === 'PGRST116' || error.code === 'PGRST205' || error.message.includes('permission denied')) {
          console.log('Using demo data for search:', error.message);
          const query = searchQuery.toLowerCase();
          const filteredResults = demoStudents.filter(student => 
            student.name.toLowerCase().includes(query) || 
            student.username.toLowerCase().includes(query)
          );
          
          setSearchResults(filteredResults);
          
          if (filteredResults.length === 0) {
            toast.info('Không tìm thấy học sinh nào');
          } else {
            toast.success(`Tìm thấy ${filteredResults.length} học sinh (Dữ liệu mẫu)`, {
              description: 'Kết nối Supabase và chạy migrations để sử dụng dữ liệu thật'
            });
          }
          return;
        }
        throw error;
      }

      setSearchResults(data || []);
      
      if (!data || data.length === 0) {
        toast.info('Không tìm thấy học sinh nào trong database', {
          description: 'Thử tìm kiếm với từ khóa khác hoặc tạo test students'
        });
      } else {
        toast.success(`Tìm thấy ${data.length} học sinh`);
      }
    } catch (error: any) {
      // Use demo data on error
      console.error('Error searching users:', error);
      const query = searchQuery.toLowerCase();
      const filteredResults = demoStudents.filter(student => 
        student.name.toLowerCase().includes(query) || 
        student.username.toLowerCase().includes(query)
      );
      
      setSearchResults(filteredResults);
      toast.error('Lỗi khi tìm kiếm, hiển thị dữ liệu mẫu', {
        description: error.message
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tìm kiếm theo username hoặc tên học sinh..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={isSearching}
          className="gap-2"
        >
          {isSearching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang tìm...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Tìm kiếm
            </>
          )}
        </Button>
      </div>

      {hasSearched && (
        <div className="space-y-2">
          {searchResults.length > 0 ? (
            <>
              <p className="text-sm text-gray-600">Tìm thấy {searchResults.length} học sinh</p>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user.user_id}
                    onClick={() => onSelectUser(user)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedUserId === user.user_id
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-900">{user.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <AtSign className="w-3 h-3" />
                          <span>{user.username}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <GraduationCap className="w-3 h-3" />
                          <span>Lớp {user.grade}</span>
                        </div>
                      </div>
                      {selectedUserId === user.user_id && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Không tìm thấy kết quả</p>
              <p className="text-sm text-gray-500 mt-1">Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}