import { useState, useEffect } from 'react';
import { InteractiveExercises } from './components/InteractiveExercises';
import { UserGuide } from './components/UserGuide';
import { LearningAnalyticsDashboard } from './components/LearningAnalyticsDashboard';
import { Toaster } from './components/ui/sonner';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { LessonList } from './components/LessonList';
import { LessonDetail } from './components/LessonDetail';
import { Exercises } from './components/Exercises';
import { AITeacher } from './components/AITeacher';
import { Progress } from './components/Progress';
import { About } from './components/About';
import { AccountManagement } from './components/AccountManagement';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AuthPage } from './components/AuthPage';

type Page = 'home' | 'lessons' | 'lesson-detail' | 'exercises' | 'ai-teacher' | 'progress' | 'about' | 'account' | 'teacher' | 'interactive' | 'analytics';

interface User {
  id: string;
  email: string;
  name: string;
  grade: number;
  username?: string;
  role?: 'student' | 'teacher';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showUserGuide, setShowUserGuide] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const storedToken = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          
          // If it's demo mode, just restore the session without verification
          if (storedToken === 'demo-token' || userData.id === 'demo-user') {
            setUser(userData);
            setAccessToken(storedToken);
          } else {
            // Verify token is still valid by checking with Supabase
            const { getSupabaseClient } = await import('./utils/supabase/client');
            const supabase = await getSupabaseClient();

            const { data, error } = await supabase.auth.getUser(storedToken);

            if (data?.user && !error) {
              // Re-fetch user profile to get latest data (including username)
              const { data: userProfilesData } = await supabase
                .from('user_profiles')
                .select('username, role, grade, name')
                .eq('user_id', data.user.id)
                .maybeSingle();

              // Merge with stored data and fresh profile data
              const updatedUserData = {
                ...userData,
                username: userProfilesData?.username || userData.username,
                role: userProfilesData?.role || userData.role || 'student',
                name: userProfilesData?.name || userData.name,
                grade: userProfilesData?.grade || userData.grade,
              };

              // Update localStorage with fresh data
              localStorage.setItem('user', JSON.stringify(updatedUserData));
              
              setUser(updatedUserData);
              setAccessToken(storedToken);

              // Auto-sync username to database if needed (silent, non-blocking)
              try {
                const { ensureUsernameConsistency } = await import('./utils/syncUsername');
                ensureUsernameConsistency(data.user.id).catch(err => {
                  console.warn('Silent username sync failed:', err);
                });
              } catch (syncError) {
                // Ignore - this is a non-critical background operation
              }
            } else {
              // Token is invalid, clear storage
              localStorage.removeItem('access_token');
              localStorage.removeItem('user');
            }
          }
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkExistingSession();
  }, []);

  const handleAuthSuccess = (userData: User, token: string) => {
    setUser(userData);
    setAccessToken(token);
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Show user guide for new users (first login)
    const hasSeenGuide = localStorage.getItem('hasSeenGuide');
    if (!hasSeenGuide) {
      setShowUserGuide(true);
      localStorage.setItem('hasSeenGuide', 'true');
    }
  };

  const handleUpdateUser = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      const { getSupabaseClient } = await import('./utils/supabase/client');
      const supabase = await getSupabaseClient();

      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setCurrentPage('home');
    }
  };

  const navigateToLesson = (lessonId: number) => {
    setSelectedLesson(lessonId);
    setCurrentPage('lesson-detail');
  };

  const navigateToExercises = (lessonId: number) => {
    setSelectedLesson(lessonId);
    setCurrentPage('exercises');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} user={user} />;
      case 'lessons':
        return <LessonList onSelectLesson={navigateToLesson} />;
      case 'lesson-detail':
        return selectedLesson ? (
          <LessonDetail 
            lessonId={selectedLesson} 
            onNavigateToExercises={navigateToExercises}
            onBack={() => setCurrentPage('lessons')}
            accessToken={accessToken}
            user={user}
          />
        ) : null;
      case 'exercises':
        return selectedLesson ? (
          <Exercises 
            lessonId={selectedLesson}
            onBack={() => setCurrentPage('lesson-detail')}
            user={user || undefined}
          />
        ) : null;
      case 'ai-teacher':
        return <AITeacher onBack={() => setCurrentPage('home')} />;
      case 'progress':
        return <Progress onBack={() => setCurrentPage('home')} accessToken={accessToken} user={user} />;
      case 'about':
        return <About onBack={() => setCurrentPage('home')} />;
      case 'account':
        return user ? (
          <AccountManagement 
            onBack={() => setCurrentPage('home')} 
            user={user}
            accessToken={accessToken}
            onUpdateUser={handleUpdateUser}
          />
        ) : null;
      case 'teacher':
        return user ? (
          <TeacherDashboard 
            onBack={() => setCurrentPage('home')} 
            user={user}
            accessToken={accessToken}
          />
        ) : null;
      case 'interactive':
        return selectedLesson ? (
          <InteractiveExercises 
            onBack={() => setCurrentPage('lessons')}
            lessonId={selectedLesson}
            accessToken={accessToken}
            user={user}
          />
        ) : (
          <InteractiveExercises 
            onBack={() => setCurrentPage('home')}
            lessonId={1}
            accessToken={accessToken}
            user={user}
          />
        );
      case 'analytics':
        return user ? (
          <LearningAnalyticsDashboard 
            onBack={() => setCurrentPage('home')} 
            user={user}
            onSelectLesson={navigateToLesson}
          />
        ) : null;
      default:
        return <HomePage onNavigate={setCurrentPage} user={user} />;
    }
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return (
      <>
        <AuthPage onAuthSuccess={handleAuthSuccess} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        user={user}
        onLogout={handleLogout}
        onShowGuide={() => setShowUserGuide(true)}
      />
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>
      {showUserGuide && (
        <UserGuide 
          onClose={() => setShowUserGuide(false)} 
          userName={user.name}
        />
      )}
      <Toaster />
    </div>
  );
}