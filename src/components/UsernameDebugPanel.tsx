import { useState, useEffect } from 'react';
import { Bug, CheckCircle, XCircle, AlertCircle, RefreshCw, Wrench } from 'lucide-react';
import { Button } from './ui/button';
import { syncUsernameToDatabase, ensureUsernameConsistency } from '../utils/syncUsername';
import { toast } from 'sonner@2.0.3';

interface UsernameDebugPanelProps {
  user: {
    id: string;
    username?: string;
    email: string;
    name: string;
  };
}

export function UsernameDebugPanel({ user }: UsernameDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);

  const checkUsernameStatus = async () => {
    setLoading(true);
    try {
      const { getSupabaseClient } = await import('../utils/supabase/client');
      const supabase = await getSupabaseClient();

      // Check localStorage
      const localUser = localStorage.getItem('user');
      const localUserData = localUser ? JSON.parse(localUser) : null;

      // Check user_profiles
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('username, role, updated_at')
        .eq('user_id', user.id)
        .maybeSingle();

      // Check kv_store
      const { data: kvData, error: kvError } = await supabase
        .from('kv_store_bf8225f3')
        .select('value')
        .eq('key', `user:${user.id}:profile`)
        .maybeSingle();

      setDebugInfo({
        localStorage: {
          exists: !!localUserData,
          username: localUserData?.username || null,
          data: localUserData,
        },
        userProfiles: {
          exists: !!profileData,
          username: profileData?.username || null,
          error: profileError?.message || null,
          data: profileData,
        },
        kvStore: {
          exists: !!kvData,
          username: kvData?.value?.username || null,
          error: kvError?.message || null,
          data: kvData?.value,
          isOptional: true, // Mark as optional
        },
        currentUser: {
          username: user.username || null,
        },
        // Consider synced if localStorage and user_profiles match (kv_store is optional)
        synced: localUserData?.username && 
                localUserData?.username === profileData?.username && 
                profileData?.username === user.username,
      });
    } catch (error: any) {
      console.error('Error checking username status:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFixSync = async () => {
    setFixing(true);
    try {
      toast.loading('Đang sửa đồng bộ username...');
      
      // Ensure consistency across all storages
      await ensureUsernameConsistency(user.id);
      
      // Reload the debug info
      await checkUsernameStatus();
      
      toast.success('Đã đồng bộ username thành công!');
      
      // Reload page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error fixing sync:', error);
      toast.error('Không thể sửa đồng bộ: ' + error.message);
    } finally {
      setFixing(false);
    }
  };

  useEffect(() => {
    if (isOpen && !debugInfo) {
      checkUsernameStatus();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="Debug Username"
      >
        <Bug className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-2xl shadow-2xl p-6 w-96 max-h-[80vh] overflow-y-auto z-50 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-gray-700" />
          <h3 className="font-apple-semibold text-gray-800">Username Debug</h3>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={checkUsernameStatus}
            disabled={loading}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
          <p className="text-sm text-gray-600">Đang kiểm tra...</p>
        </div>
      ) : debugInfo?.error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <XCircle className="w-5 h-5" />
            <span className="font-apple-semibold">Error</span>
          </div>
          <p className="text-sm text-red-600">{debugInfo.error}</p>
        </div>
      ) : debugInfo ? (
        <div className="space-y-4">
          {/* Overall Status */}
          <div className={`p-4 rounded-lg border-2 ${
            debugInfo.synced 
              ? 'bg-green-50 border-green-300'
              : 'bg-yellow-50 border-yellow-300'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {debugInfo.synced ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              )}
              <span className="font-apple-semibold text-gray-800">
                {debugInfo.synced ? 'Đồng bộ ✓' : 'Chưa đồng bộ'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {debugInfo.synced 
                ? 'Username đã được lưu đầy đủ vào tất cả storage'
                : 'Username chưa đồng bộ giữa các storage'}
            </p>
          </div>

          {/* Current User */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-apple-semibold text-sm text-gray-700 mb-2">Current User</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Username:</span>
                <span className="font-mono text-gray-800">
                  {debugInfo.currentUser.username || '❌ null'}
                </span>
              </div>
            </div>
          </div>

          {/* localStorage */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="font-apple-semibold text-sm text-gray-700 mb-2">
              localStorage {debugInfo.localStorage.exists ? '✓' : '✗'}
            </h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Username:</span>
                <span className={`font-mono ${
                  debugInfo.localStorage.username 
                    ? 'text-green-700' 
                    : 'text-red-700'
                }`}>
                  {debugInfo.localStorage.username || '❌ null'}
                </span>
              </div>
            </div>
          </div>

          {/* user_profiles */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <h4 className="font-apple-semibold text-sm text-gray-700 mb-2">
              user_profiles table {debugInfo.userProfiles.exists ? '✓' : '✗'}
            </h4>
            {debugInfo.userProfiles.error ? (
              <p className="text-xs text-red-600">Error: {debugInfo.userProfiles.error}</p>
            ) : (
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Username:</span>
                  <span className={`font-mono ${
                    debugInfo.userProfiles.username 
                      ? 'text-green-700' 
                      : 'text-red-700'
                  }`}>
                    {debugInfo.userProfiles.username || '❌ null'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-mono text-gray-800">
                    {debugInfo.userProfiles.data?.role || 'N/A'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* kv_store */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <h4 className="font-apple-semibold text-sm text-gray-700 mb-2">
              kv_store table {debugInfo.kvStore.exists ? '✓' : '✗'}
            </h4>
            {debugInfo.kvStore.error ? (
              <p className="text-xs text-red-600">Error: {debugInfo.kvStore.error}</p>
            ) : (
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Username:</span>
                  <span className={`font-mono ${
                    debugInfo.kvStore.username 
                      ? 'text-green-700' 
                      : 'text-red-700'
                  }`}>
                    {debugInfo.kvStore.username || '❌ null'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {!debugInfo.synced && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-apple-semibold text-sm text-gray-800">
                  💡 Suggested Actions
                </h4>
                <Button
                  onClick={handleFixSync}
                  disabled={fixing}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {fixing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                      Fixing...
                    </>
                  ) : (
                    <>
                      <Wrench className="w-4 h-4 mr-1" />
                      Fix Now
                    </>
                  )}
                </Button>
              </div>
              <ul className="space-y-2 text-xs text-gray-700">
                <li>• Click "Fix Now" để tự động sync username vào database</li>
                <li>• Hoặc logout và login lại</li>
                <li>• Hoặc reload page (F5)</li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">
          Click Refresh để kiểm tra
        </p>
      )}
    </div>
  );
}