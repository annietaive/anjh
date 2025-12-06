import { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, GraduationCap, Save, Key, Shield, AtSign } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface AccountManagementProps {
  onBack: () => void;
  user: {
    id: string;
    email: string;
    name: string;
    grade: number;
    username?: string;
    role?: string;
  };
  accessToken: string | null;
  onUpdateUser: (user: any) => void;
}

export function AccountManagement({ onBack, user, accessToken, onUpdateUser }: AccountManagementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    grade: user.grade,
    username: user.username || '',
    role: user.role || 'student',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Check username availability
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username === user.username) {
      setUsernameAvailable(null);
      return;
    }

    // Username validation: 3-20 characters, alphanumeric and underscore only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      setUsernameAvailable(false);
      return;
    }

    setCheckingUsername(true);
    try {
      const { getSupabaseClient } = await import('../utils/supabase/client');
      const supabase = await getSupabaseClient();

      const { data, error } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('username', username)
        .single();

      setUsernameAvailable(!data);
    } catch (error: any) {
      // If no data found, username is available
      setUsernameAvailable(true);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!accessToken) {
      toast.error('Bạn cần đăng nhập để cập nhật thông tin');
      return;
    }

    // Validate username if it's being changed
    if (formData.username && formData.username !== user.username) {
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(formData.username)) {
        toast.error('Username phải có 3-20 ký tự, chỉ bao gồm chữ, số và dấu gạch dưới');
        return;
      }

      if (usernameAvailable === false) {
        toast.error('Username này đã được sử dụng');
        return;
      }
    }

    setIsSaving(true);
    try {
      // Update local user state first
      const updatedUser = {
        ...user,
        name: formData.name,
        grade: formData.grade,
        username: formData.username || user.username,
        role: formData.role,
      };
      
      console.log('🔄 Updating user profile:', updatedUser);
      
      onUpdateUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Try to update in database if Supabase is connected
      try {
        const { getSupabaseClient } = await import('../utils/supabase/client');
        const supabase = await getSupabaseClient();

        // Update user profile in database
        const updateData: any = {
          name: formData.name,
          grade: formData.grade,
          role: formData.role,
          updated_at: new Date().toISOString(),
        };

        // Only update username if it's provided and changed
        if (formData.username && formData.username !== user.username) {
          updateData.username = formData.username;
        }

        console.log('📝 Updating user_profiles table:', updateData);

        // Update user_profiles table
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update(updateData)
          .eq('user_id', user.id);

        if (profileError) {
          console.error('❌ Error updating user_profiles:', profileError);
          if (!profileError.message.includes('user_profiles')) {
            toast.error(`Lỗi cập nhật database: ${profileError.message}`);
            throw profileError;
          }
        } else {
          console.log('✅ user_profiles updated successfully');
        }

        // Also update kv_store for backward compatibility
        try {
          const { data: kvData } = await supabase
            .from('kv_store_bf8225f3')
            .select('value')
            .eq('key', `user:${user.id}:profile`)
            .maybeSingle();

          const currentProfile = kvData?.value || {};
          const updatedProfile = {
            ...currentProfile,
            name: formData.name,
            grade: formData.grade,
            username: formData.username || user.username,
            role: formData.role,
            updatedAt: new Date().toISOString(),
          };

          console.log('📝 Updating kv_store:', updatedProfile);

          const { error: kvError } = await supabase
            .from('kv_store_bf8225f3')
            .upsert({
              key: `user:${user.id}:profile`,
              value: updatedProfile,
            }, {
              onConflict: 'key',
              ignoreDuplicates: false
            });

          if (kvError) {
            // Check if it's RLS policy error (code 42501)
            if (kvError.code === '42501') {
              console.log('⚠️ kv_store RLS policy prevents update - skipping (this is OK)');
            } else {
              console.error('❌ Error updating kv_store:', kvError);
            }
          } else {
            console.log('✅ kv_store updated successfully');
          }
        } catch (kvUpdateError: any) {
          // Silently handle kv_store errors - it's not critical
          console.log('⚠️ kv_store update skipped:', kvUpdateError.message);
        }
      } catch (dbError) {
        // Database update failed, but local update succeeded
        console.error('⚠️ Database not configured:', dbError);
        toast.warning('Cập nhật local thành công, nhưng không thể lưu vào database');
      }
      
      toast.success('Cập nhật thông tin thành công ✓');
      setIsEditing(false);
      setUsernameAvailable(null);
    } catch (error: any) {
      console.error('❌ Error updating profile:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!accessToken) {
      toast.error('Bạn cần đăng nhập để đổi mật khẩu');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsSaving(true);
    try {
      const { getSupabaseClient } = await import('../utils/supabase/client');
      const supabase = await getSupabaseClient();

      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast.success('Đổi mật khẩu thành công');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-gray-800">Quản lý tài khoản</h1>
              <p className="text-gray-600">Cập nhật thông tin cá nhân của bạn</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div className="border-b pb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-800">Thông tin cá nhân</h2>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    Chỉnh sửa
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={() => setIsEditing(false)} variant="outline">
                      Hủy
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <label className="text-sm text-gray-600 block mb-1">Họ và tên</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-800">{user.name}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <AtSign className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <label className="text-sm text-gray-600 block mb-1">Username</label>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => {
                            setFormData({ ...formData, username: e.target.value });
                            checkUsernameAvailability(e.target.value);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="username_cua_ban"
                        />
                        {formData.username && formData.username !== user.username && (
                          <p className={`text-xs mt-1 ${
                            checkingUsername ? 'text-gray-500' :
                            usernameAvailable === true ? 'text-green-600' :
                            usernameAvailable === false ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            {checkingUsername ? 'Đang kiểm tra...' :
                             usernameAvailable === true ? '✓ Username khả dụng' :
                             usernameAvailable === false ? '✗ Username đã được sử dụng' :
                             '3-20 ký tự, chỉ chữ, số và dấu gạch dưới'}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-800">{user.username || <span className="text-gray-400 italic">Chưa đặt username</span>}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <label className="text-sm text-gray-600 block mb-1">Email</label>
                    <p className="text-gray-800">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <label className="text-sm text-gray-600 block mb-1">Khối lớp</label>
                    {isEditing ? (
                      <select
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={6}>Lớp 6</option>
                        <option value={7}>Lớp 7</option>
                        <option value={8}>Lớp 8</option>
                        <option value={9}>Lớp 9</option>
                      </select>
                    ) : (
                      <p className="text-gray-800">Lớp {user.grade}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <label className="text-sm text-gray-600 block mb-1">Vai trò</label>
                    {isEditing ? (
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="student">Học sinh</option>
                        <option value="teacher">Giáo viên</option>
                      </select>
                    ) : (
                      <p className="text-gray-800">{user.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-800">Bảo mật</h2>
                {!showPasswordForm && (
                  <Button onClick={() => setShowPasswordForm(true)} variant="outline">
                    <Key className="w-4 h-4 mr-2" />
                    Đổi mật khẩu
                  </Button>
                )}
              </div>

              {showPasswordForm && (
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div>
                    <label className="text-sm text-gray-700 block mb-2">Mật khẩu mới</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 block mb-2">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={() => setShowPasswordForm(false)} variant="outline">
                      Hủy
                    </Button>
                    <Button onClick={handleChangePassword} disabled={isSaving}>
                      {isSaving ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                    </Button>
                  </div>
                </div>
              )}

              {!showPasswordForm && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Shield className="w-5 h-5 text-green-600" />
                  <p className="text-sm">Tài khoản của bạn được bảo vệ bằng mật khẩu</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-gray-800 mb-1">Khối {user.grade}</h3>
            <p className="text-sm text-gray-600">Cấp học hiện tại</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-gray-800 mb-1">Đã xác thực</h3>
            <p className="text-sm text-gray-600">Tài khoản email</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-gray-800 mb-1">An toàn</h3>
            <p className="text-sm text-gray-600">Bảo mật tài khoản</p>
          </div>
        </div>
      </div>
    </div>
  );
}