import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BookOpen, GraduationCap, Users, Award, HelpCircle, UserCircle, Briefcase, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { LoginTroubleshooting } from './LoginTroubleshooting';
import { SupabaseDebug } from './SupabaseDebug';
import { GalaxyBackground } from './GalaxyBackground';

interface AuthPageProps {
  onAuthSuccess: (user: any, accessToken: string) => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [authMode, setAuthMode] = useState<'auto' | 'local' | 'supabase'>('auto');
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    grade: '6',
    role: 'student' as 'student' | 'teacher',
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Function to generate username from name
  const generateUsername = (name: string): string => {
    // Remove Vietnamese accents
    const withoutAccents = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
    
    // Convert to lowercase, remove spaces and special characters
    const username = withoutAccents
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '');
    
    return username;
  };

  // Function to ensure unique username
  const ensureUniqueUsername = async (supabase: any, baseUsername: string): Promise<string> => {
    let username = baseUsername;
    let counter = 1;
    
    while (true) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();
      
      // If table doesn't exist or no duplicate found, use this username
      if (error || !data) {
        return username;
      }
      
      // If duplicate found, add number
      username = `${baseUsername}${counter}`;
      counter++;
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Try Supabase first if in auto mode
      if (authMode === 'auto' || authMode === 'supabase') {
        try {
          const { getSupabaseClient } = await import('../utils/supabase/client');
          const supabase = await getSupabaseClient();
          
          // Sign up with Supabase Auth
          const { data, error } = await supabase.auth.signUp({
            email: signupData.email.trim(),
            password: signupData.password,
            options: {
              data: {
                name: signupData.name,
                grade: parseInt(signupData.grade),
              },
            },
          });

          if (error) {
            // If it's a network error, fall back to local auth
            if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
              throw new Error('NETWORK_ERROR');
            }
            throw new Error(error.message || 'Đăng ký thất bại');
          }

          if (!data.user) {
            throw new Error('Đăng ký thất bại. Vui lòng thử lại.');
          }

          // Generate unique username
          const baseUsername = generateUsername(signupData.name);
          const username = await ensureUniqueUsername(supabase, baseUsername);

          // Initialize user profile
          const userId = data.user.id;
          try {
            await supabase.from('kv_store_bf8225f3').upsert({
              key: `user:${userId}:profile`,
              value: {
                name: signupData.name,
                email: signupData.email,
                grade: parseInt(signupData.grade),
                username: username,
                createdAt: new Date().toISOString(),
              },
            }, { onConflict: 'key' });
          } catch (kvError: any) {
            if (kvError.code === '42501') {
              console.log('⚠️ kv_store RLS policy prevents insert - skipping');
            }
          }

          // Create user profile
          try {
            await supabase.from('user_profiles').insert({
              user_id: userId,
              name: signupData.name,
              username: username,
              email: signupData.email,
              grade: parseInt(signupData.grade),
              role: signupData.role,
            });
          } catch (profileError: any) {
            console.warn('Could not create user_profiles record:', profileError);
          }

          // Initialize progress
          try {
            await supabase.from('kv_store_bf8225f3').upsert({
              key: `user:${userId}:progress`,
              value: {
                totalLessons: 0,
                completedLessons: 0,
                totalExercises: 0,
                correctAnswers: 0,
                totalScore: 0,
              },
            }, { onConflict: 'key' });
          } catch (kvError: any) {
            if (kvError.code === '42501') {
              console.log('⚠️ kv_store RLS policy prevents insert - skipping');
            }
          }

          // Success
          if (data.session?.access_token) {
            toast.success('Đăng ký thành công! Chào mừng bạn đến với EngMastery! 🎉', {
              description: `Username: ${username} (Online Mode)`
            });
            onAuthSuccess({
              id: data.user.id,
              email: data.user.email,
              name: signupData.name,
              grade: parseInt(signupData.grade),
              username: username,
              role: signupData.role,
            }, data.session.access_token);
            return;
          } else {
            toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.', {
              description: `Username: ${username}`
            });
            setIsLoading(false);
            return;
          }
        } catch (supabaseError: any) {
          // If network error and in auto mode, fallback to local
          if (supabaseError.message === 'NETWORK_ERROR' && authMode === 'auto') {
            console.log('[Auth] Supabase unavailable, using local auth');
            toast.info('Đang sử dụng chế độ Offline...', { duration: 2000 });
          } else if (authMode === 'supabase') {
            // If explicitly using Supabase, show error
            throw supabaseError;
          }
          // Continue to local auth fallback
        }
      }

      // Use local authentication
      const { localSignup } = await import('../utils/localAuth');
      const { user, token } = await localSignup(
        signupData.email,
        signupData.password,
        signupData.name,
        parseInt(signupData.grade),
        signupData.role
      );

      toast.success('Đăng ký thành công! Chào mừng bạn đến với EngMastery! 🎉', {
        description: `Username: ${user.username} (Offline Mode)`
      });

      onAuthSuccess({
        id: user.id,
        email: user.email,
        name: user.name,
        grade: user.grade,
        username: user.username,
        role: user.role,
      }, token);

    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Try Supabase first if in auto mode
      if (authMode === 'auto' || authMode === 'supabase') {
        try {
          const { getSupabaseClient } = await import('../utils/supabase/client');
          const supabase = await getSupabaseClient();

          console.log('Attempting login with email:', loginData.email);
          const { data, error } = await supabase.auth.signInWithPassword({
            email: loginData.email.trim(),
            password: loginData.password,
          });

          if (error) {
            // If it's a network error, fall back to local auth
            if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
              throw new Error('NETWORK_ERROR');
            }
            
            // If it's the test account and it doesn't exist, try to create it
            if (error.message.includes('Invalid login credentials') && 
                loginData.email.trim() === 'test@engmastery.com') {
              toast.info('Tài khoản test chưa tồn tại. Đang tạo tự động...');
              await handleAutoCreateTestAccount();
              return;
            }
            
            // User-friendly error messages
            if (error.message.includes('Invalid login credentials')) {
              throw new Error('Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại hoặc đăng ký tài khoản mới.');
            } else if (error.message.includes('Email not confirmed')) {
              throw new Error('Email chưa được xác nhận. Vui lòng kiểm tra email của bạn.');
            } else {
              throw new Error(error.message);
            }
          }

          if (data?.session?.access_token && data.user) {
            // Fetch user profile
            const { data: profileData } = await supabase
              .from('kv_store_bf8225f3')
              .select('value')
              .eq('key', `user:${data.user.id}:profile`)
              .maybeSingle();

            let userProfile = profileData?.value;

            const { data: userProfilesData } = await supabase
              .from('user_profiles')
              .select('username, role, grade')
              .eq('user_id', data.user.id)
              .maybeSingle();

            if (!userProfile) {
              userProfile = {
                name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
                email: data.user.email,
                grade: data.user.user_metadata?.grade || 6,
                createdAt: new Date().toISOString(),
              };

              try {
                await supabase.from('kv_store_bf8225f3').upsert({
                  key: `user:${data.user.id}:profile`,
                  value: userProfile,
                }, { onConflict: 'key' });
              } catch (kvError: any) {
                if (kvError.code === '42501') {
                  console.log('⚠️ kv_store RLS policy prevents insert - skipping');
                }
              }

              try {
                await supabase.from('kv_store_bf8225f3').upsert({
                  key: `user:${data.user.id}:progress`,
                  value: {
                    totalLessons: 0,
                    completedLessons: 0,
                    totalExercises: 0,
                    correctAnswers: 0,
                    totalScore: 0,
                  },
                }, { onConflict: 'key' });
              } catch (kvError: any) {
                if (kvError.code === '42501') {
                  console.log('⚠️ kv_store RLS policy prevents insert - skipping');
                }
              }
            }

            const finalUserProfile = {
              ...userProfile,
              username: userProfilesData?.username || userProfile.username,
              role: userProfilesData?.role || 'student',
            };

            if (userProfilesData?.grade) {
              finalUserProfile.grade = userProfilesData.grade;
            }

            try {
              const { ensureUsernameConsistency } = await import('../utils/syncUsername');
              await ensureUsernameConsistency(data.user.id);
            } catch (syncError) {
              console.warn('Could not auto-sync username:', syncError);
            }

            toast.success('Đăng nhập thành công! 🎓', {
              description: finalUserProfile.username 
                ? `Chào mừng trở lại, @${finalUserProfile.username}! (Online Mode)` 
                : 'Online Mode'
            });
            
            onAuthSuccess({
              id: data.user.id,
              email: data.user.email,
              ...finalUserProfile,
            }, data.session.access_token);
            return;
          }
        } catch (supabaseError: any) {
          // If network error and in auto mode, fallback to local
          if (supabaseError.message === 'NETWORK_ERROR' && authMode === 'auto') {
            console.log('[Auth] Supabase unavailable, using local auth');
            toast.info('Đang sử dụng chế độ Offline...', { duration: 2000 });
          } else if (authMode === 'supabase') {
            // If explicitly using Supabase, show error
            throw supabaseError;
          }
          // Continue to local auth fallback
        }
      }

      // Use local authentication
      const { localLogin } = await import('../utils/localAuth');
      const { user, token } = await localLogin(
        loginData.email,
        loginData.password
      );

      toast.success('Đăng nhập thành công! 🎓', {
        description: `Chào mừng trở lại, @${user.username}! (Offline Mode)`
      });

      onAuthSuccess({
        id: user.id,
        email: user.email,
        name: user.name,
        grade: user.grade,
        username: user.username,
        role: user.role,
      }, token);

    } catch (error: any) {
      console.error('Login error:', error);
      setLoginAttempts(prev => prev + 1);
      
      toast.error(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      
      // Show help after 2 failed attempts
      if (loginAttempts >= 1) {
        setTimeout(() => {
          toast.info('💡 Gợi ý: Bạn có thể đăng ký tài khoản mới hoặc dùng chế độ Demo');
          setShowHelp(true);
        }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoCreateTestAccount = async () => {
    try {
      const { getSupabaseClient } = await import('../utils/supabase/client');
      const supabase = await getSupabaseClient();
      
      // Try to sign up the test account
      const { data, error } = await supabase.auth.signUp({
        email: 'test@engmastery.com',
        password: 'test123',
        options: {
          data: {
            name: 'Test User',
            grade: 6,
          },
        },
      });

      if (error) {
        console.error('Auto-create test account error:', error);
        toast.error('Không thể tạo tài khoản test tự động. Vui lòng đăng ký tài khoản mới.');
        return;
      }

      if (data.user) {
        // Initialize user profile
        const userId = data.user.id;
        try {
          await supabase.from('kv_store_bf8225f3').upsert({
            key: `user:${userId}:profile`,
            value: {
              name: 'Test User',
              email: 'test@engmastery.com',
              grade: 6,
              createdAt: new Date().toISOString(),
            },
          }, {
            onConflict: 'key'
          });
        } catch (kvError: any) {
          if (kvError.code === '42501') {
            console.log('⚠️ kv_store RLS policy prevents insert - skipping');
          }
        }

        try {
          await supabase.from('kv_store_bf8225f3').upsert({
            key: `user:${userId}:progress`,
            value: {
              totalLessons: 0,
              completedLessons: 0,
              totalExercises: 0,
              correctAnswers: 0,
              totalScore: 0,
            },
          }, {
            onConflict: 'key'
          });
        } catch (kvError: any) {
          if (kvError.code === '42501') {
            console.log('⚠️ kv_store RLS policy prevents insert - skipping');
          }
        }

        // If session is available, login immediately
        if (data.session?.access_token) {
          toast.success('Tài khoản test đã được tạo và đăng nhập thành công! 🎉');
          onAuthSuccess({
            id: data.user.id,
            email: data.user.email,
            name: 'Test User',
            grade: 6,
          }, data.session.access_token);
        } else {
          toast.success('Tài khoản test đã được tạo! Vui lòng đăng nhập lại.');
          setIsLoading(false);
        }
      }
    } catch (error: any) {
      console.error('Auto-create error:', error);
      toast.error('Không thể tạo tài khoản test. Vui lòng đăng ký tài khoản mới.');
      setIsLoading(false);
    }
  };

  const handleDemoMode = () => {
    toast.success('Đang vào chế độ Demo... 🚀');
    onAuthSuccess({
      id: 'demo-user',
      email: 'demo@engmastery.com',
      name: 'Demo User',
      grade: 6,
    }, 'demo-token');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Galaxy Background */}
      <GalaxyBackground />
      
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Branding */}
        <div className="text-center md:text-left space-y-6">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <GraduationCap className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-6xl font-apple-heavy bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
              EngMastery
            </h1>
          </div>
          
          <p className="text-xl text-white font-apple-semibold drop-shadow-md">
            Nền tảng học tiếng Anh trực tuyến cho học sinh THCS
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="bg-blue-500/20 p-2 rounded-lg backdrop-blur-sm">
                <BookOpen className="h-6 w-6 text-blue-300" />
              </div>
              <div>
                <h3 className="text-white font-apple-semibold drop-shadow">48 Units hoàn chỉnh</h3>
                <p className="text-blue-100 text-sm drop-shadow">Theo chương trình Global Success lớp 6-9</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="bg-purple-500/20 p-2 rounded-lg backdrop-blur-sm">
                <Users className="h-6 w-6 text-purple-300" />
              </div>
              <div>
                <h3 className="text-white font-apple-semibold drop-shadow">Giáo viên AI thông minh</h3>
                <p className="text-purple-100 text-sm drop-shadow">Chấm bài tự động và hỗ trợ 24/7</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="bg-pink-500/20 p-2 rounded-lg backdrop-blur-sm">
                <Award className="h-6 w-6 text-pink-300" />
              </div>
              <div>
                <h3 className="text-white font-apple-semibold drop-shadow">Theo dõi tiến độ</h3>
                <p className="text-pink-100 text-sm drop-shadow">Lưu trữ kết quả học tập bền vững</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <Card className="w-full shadow-2xl backdrop-blur-sm bg-white/95">
          <CardHeader>
            <CardTitle>Bắt đầu học ngay</CardTitle>
            <CardDescription>Đăng ký hoặc đăng nhập để tiếp tục</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Demo Mode Button */}
            <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-green-800 mb-1">🚀 Thử ngay không cần đăng ký</h3>
                  <p className="text-xs text-green-700">Khám phá tất cả tính năng với chế độ Demo</p>
                </div>
                <Button 
                  onClick={handleDemoMode}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  Dùng Demo
                </Button>
              </div>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Hoặc
                </span>
              </div>
            </div>

            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup">Đăng ký</TabsTrigger>
                <TabsTrigger value="login">Đăng nhập</TabsTrigger>
              </TabsList>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Họ và tên</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="email@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mật khẩu</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500">Tối thiểu 6 ký tự</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-grade">Khối lớp</Label>
                    <select
                      id="signup-grade"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={signupData.grade}
                      onChange={(e) => setSignupData({ ...signupData, grade: e.target.value })}
                      disabled={isLoading}
                    >
                      <option value="6">Lớp 6</option>
                      <option value="7">Lớp 7</option>
                      <option value="8">Lớp 8</option>
                      <option value="9">Lớp 9</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-role">Vai trò</Label>
                    <select
                      id="signup-role"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={signupData.role}
                      onChange={(e) => setSignupData({ ...signupData, role: e.target.value as 'student' | 'teacher' })}
                      disabled={isLoading}
                    >
                      <option value="student">Học sinh</option>
                      <option value="teacher">Giáo viên</option>
                    </select>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="email@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mật khẩu</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>

                  <div className="text-center mt-4 space-y-2">
                    <p className="text-xs text-gray-500">
                      💡 Lưu ý: Email và mật khẩu phải khớp với thông tin đã đăng ký
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={() => {
                        setLoginData({
                          email: 'test@engmastery.com',
                          password: 'test123',
                        });
                        toast.info('Đã điền thông tin tài khoản test. Nhấn "Đăng nhập" để tiếp tục.');
                      }}
                    >
                      Dùng tài khoản test
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-xs"
                      onClick={() => setShowHelp(!showHelp)}
                    >
                      <HelpCircle className="h-3 w-3 mr-1" />
                      {showHelp ? 'Ẩn trợ giúp' : 'Cần trợ giúp?'}
                    </Button>
                  </div>
                </form>
                
                {showHelp && <LoginTroubleshooting />}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}