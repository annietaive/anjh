import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function SupabaseDebug() {
  const [status, setStatus] = useState<{
    auth: 'loading' | 'success' | 'error';
    database: 'loading' | 'success' | 'error';
    details: string;
  }>({
    auth: 'loading',
    database: 'loading',
    details: '',
  });

  const checkConnection = async () => {
    setStatus({
      auth: 'loading',
      database: 'loading',
      details: 'Đang kiểm tra kết nối...',
    });

    try {
      // Check Supabase client
      const { getSupabaseClient } = await import('../utils/supabase/client');
      const supabase = await getSupabaseClient();

      // Check auth connection
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        setStatus(prev => ({
          ...prev,
          auth: 'error',
          details: `Auth Error: ${sessionError.message}`,
        }));
        return;
      }

      setStatus(prev => ({
        ...prev,
        auth: 'success',
        details: 'Supabase Auth connection OK',
      }));

      // Check database connection
      try {
        const { data, error } = await supabase
          .from('kv_store_bf8225f3')
          .select('key')
          .limit(1);

        if (error) {
          setStatus(prev => ({
            ...prev,
            database: 'error',
            details: `Database Error: ${error.message}`,
          }));
        } else {
          setStatus(prev => ({
            ...prev,
            database: 'success',
            details: 'All connections OK ✅',
          }));
        }
      } catch (dbError: any) {
        setStatus(prev => ({
          ...prev,
          database: 'error',
          details: `Database Error: ${dbError.message}`,
        }));
      }
    } catch (error: any) {
      setStatus({
        auth: 'error',
        database: 'error',
        details: `Connection Error: ${error.message}`,
      });
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const StatusIcon = ({ status }: { status: 'loading' | 'success' | 'error' }) => {
    if (status === 'loading') return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    if (status === 'success') return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">Trạng thái kết nối</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <StatusIcon status={status.auth} />
          <span>Supabase Auth</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <StatusIcon status={status.database} />
          <span>Database Connection</span>
        </div>

        <p className="text-xs text-gray-600 pt-2 border-t">
          {status.details}
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={checkConnection}
          className="w-full text-xs"
        >
          Kiểm tra lại
        </Button>
      </CardContent>
    </Card>
  );
}
