import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database, Users, BookOpen, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface ConnectionStatus {
  connected: boolean;
  message: string;
  details?: string;
}

interface TableStatus {
  name: string;
  exists: boolean;
  count?: number;
  error?: string;
}

export function SupabaseConnectionTest() {
  const [isChecking, setIsChecking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([]);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const { getSupabaseClient } = await import('../utils/supabase/client');
      const supabase = await getSupabaseClient();

      // Test basic connection
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        setConnectionStatus({
          connected: false,
          message: 'Lỗi kết nối Supabase',
          details: authError.message
        });
        return;
      }

      setConnectionStatus({
        connected: true,
        message: 'Đã kết nối Supabase thành công',
        details: 'Auth service hoạt động bình thường'
      });

      // Check tables
      const tables = [
        { name: 'user_profiles', query: 'user_profiles' },
        { name: 'assignments', query: 'assignments' },
      ];

      const tableStatusResults: TableStatus[] = [];

      for (const table of tables) {
        try {
          const { data, error, count } = await supabase
            .from(table.query)
            .select('*', { count: 'exact', head: true });

          if (error) {
            tableStatusResults.push({
              name: table.name,
              exists: false,
              error: error.message
            });
          } else {
            tableStatusResults.push({
              name: table.name,
              exists: true,
              count: count || 0
            });
          }
        } catch (err: any) {
          tableStatusResults.push({
            name: table.name,
            exists: false,
            error: err.message
          });
        }
      }

      setTableStatuses(tableStatusResults);

    } catch (error: any) {
      console.error('Connection test error:', error);
      setConnectionStatus({
        connected: false,
        message: 'Không thể kết nối Supabase',
        details: error.message
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleRefresh = () => {
    toast.info('Đang kiểm tra kết nối...');
    checkConnection();
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className={`p-4 rounded-lg border ${
        connectionStatus?.connected 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {isChecking ? (
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            ) : connectionStatus?.connected ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className={`mb-1 ${
              connectionStatus?.connected ? 'text-green-800' : 'text-red-800'
            }`}>
              {connectionStatus?.message || 'Đang kiểm tra...'}
            </h3>
            {connectionStatus?.details && (
              <p className={`text-sm ${
                connectionStatus.connected ? 'text-green-700' : 'text-red-700'
              }`}>
                {connectionStatus.details}
              </p>
            )}
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isChecking}
            className="flex-shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Table Statuses */}
      {tableStatuses.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm text-gray-700">Database Tables:</h4>
          <div className="grid gap-2">
            {tableStatuses.map((table) => (
              <div
                key={table.name}
                className={`p-3 rounded-lg border ${
                  table.exists
                    ? 'bg-green-50 border-green-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {table.exists ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {table.name === 'user_profiles' && <Users className="w-4 h-4 text-gray-600" />}
                      {table.name === 'assignments' && <BookOpen className="w-4 h-4 text-gray-600" />}
                      <span className={`${
                        table.exists ? 'text-green-800' : 'text-yellow-800'
                      }`}>
                        {table.name}
                      </span>
                    </div>
                    {table.exists ? (
                      <p className="text-xs text-green-700 mt-1">
                        ✓ Tồn tại • {table.count} bản ghi
                      </p>
                    ) : (
                      <p className="text-xs text-yellow-700 mt-1">
                        ✗ Chưa tạo • {table.error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {tableStatuses.some(t => !t.exists) && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2 mb-3">
            <Database className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-blue-800 mb-2">Cần chạy Migrations</h4>
              <p className="text-sm text-blue-700 mb-3">
                Một số bảng chưa được tạo. Hãy chạy migrations trong Supabase Dashboard:
              </p>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Mở Supabase Dashboard &gt; SQL Editor</li>
                <li>Chạy <code className="bg-blue-100 px-1 rounded">/supabase/migrations/create_user_profiles_table.sql</code></li>
                <li>Chạy <code className="bg-blue-100 px-1 rounded">/supabase/migrations/create_assignments_table.sql</code></li>
                <li>Click nút refresh để kiểm tra lại</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {connectionStatus?.connected && tableStatuses.every(t => t.exists) && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="text-green-800">Hệ thống hoạt động bình thường</h4>
              <p className="text-sm text-green-700">
                Supabase đã được kết nối và tất cả các bảng đã được tạo. Giáo viên có thể tìm kiếm và quản lý học sinh.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}