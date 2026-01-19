import { useState } from 'react';
import { Bug, Database, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface ProgressDebugPanelProps {
  userId: string;
}

export function ProgressDebugPanel({ userId }: ProgressDebugPanelProps) {
  const [debugData, setDebugData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkDatabase = async () => {
    setIsLoading(true);
    try {
      const { getSupabaseClient } = await import('../utils/supabase/client');
      const supabase = await getSupabaseClient();

      // 1. Check exercise_results
      const { data: exerciseResults, error: exerciseError } = await supabase
        .from('exercise_results')
        .select('*')
        .eq('user_id', userId);

      // 2. Check user_analytics
      const { data: analytics, error: analyticsError } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      // 3. Check learning_progress
      const { data: progress, error: progressError } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', userId);

      // 4. Calculate skill stats
      const skillStats = {
        listening: exerciseResults?.filter(r => r.exercise_type === 'listening') || [],
        speaking: exerciseResults?.filter(r => r.exercise_type === 'speaking') || [],
        reading: exerciseResults?.filter(r => r.exercise_type === 'reading') || [],
        writing: exerciseResults?.filter(r => r.exercise_type === 'writing') || [],
        vocabulary: exerciseResults?.filter(r => r.exercise_type === 'vocabulary') || [],
      };

      setDebugData({
        exerciseResults: {
          total: exerciseResults?.length || 0,
          data: exerciseResults,
          error: exerciseError,
        },
        analytics: {
          data: analytics,
          error: analyticsError,
        },
        progress: {
          total: progress?.length || 0,
          data: progress,
          error: progressError,
        },
        skillStats: {
          listening: {
            count: skillStats.listening.length,
            avgScore: skillStats.listening.length > 0 
              ? Math.round(skillStats.listening.reduce((sum, r) => sum + r.score, 0) / skillStats.listening.length)
              : 0,
            data: skillStats.listening,
          },
          speaking: {
            count: skillStats.speaking.length,
            avgScore: skillStats.speaking.length > 0 
              ? Math.round(skillStats.speaking.reduce((sum, r) => sum + r.score, 0) / skillStats.speaking.length)
              : 0,
            data: skillStats.speaking,
          },
          reading: {
            count: skillStats.reading.length,
            avgScore: skillStats.reading.length > 0 
              ? Math.round(skillStats.reading.reduce((sum, r) => sum + r.score, 0) / skillStats.reading.length)
              : 0,
            data: skillStats.reading,
          },
          writing: {
            count: skillStats.writing.length,
            avgScore: skillStats.writing.length > 0 
              ? Math.round(skillStats.writing.reduce((sum, r) => sum + r.score, 0) / skillStats.writing.length)
              : 0,
            data: skillStats.writing,
          },
          vocabulary: {
            count: skillStats.vocabulary.length,
            avgScore: skillStats.vocabulary.length > 0 
              ? Math.round(skillStats.vocabulary.reduce((sum, r) => sum + r.score, 0) / skillStats.vocabulary.length)
              : 0,
            data: skillStats.vocabulary,
          },
        }
      });

      console.log('[ProgressDebug] Debug data:', {
        exerciseResults: exerciseResults?.length,
        analytics,
        skillStats: Object.entries(skillStats).map(([key, val]) => `${key}: ${val.length}`),
      });

    } catch (error) {
      console.error('[ProgressDebug] Error:', error);
      setDebugData({ error: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-yellow-600" />
          <h3 className="text-yellow-800">Debug Panel - Progress Data</h3>
        </div>
        <Button 
          onClick={checkDatabase} 
          disabled={isLoading}
          size="sm"
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Check Database
        </Button>
      </div>

      {debugData && (
        <div className="space-y-4">
          {/* Exercise Results Summary */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="text-sm text-gray-700 mb-2 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Exercise Results Table ({debugData.exerciseResults.total} records)
            </h4>
            {debugData.exerciseResults.error ? (
              <p className="text-red-600 text-sm">Error: {debugData.exerciseResults.error.message}</p>
            ) : (
              <div className="grid grid-cols-5 gap-2 text-xs">
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-blue-600 font-medium">Vocabulary</p>
                  <p className="text-gray-700">{debugData.skillStats.vocabulary.count} bài</p>
                  <p className="text-gray-600">TB: {debugData.skillStats.vocabulary.avgScore}%</p>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <p className="text-purple-600 font-medium">Listening</p>
                  <p className="text-gray-700">{debugData.skillStats.listening.count} bài</p>
                  <p className="text-gray-600">TB: {debugData.skillStats.listening.avgScore}%</p>
                </div>
                <div className="bg-pink-50 p-2 rounded">
                  <p className="text-pink-600 font-medium">Speaking</p>
                  <p className="text-gray-700">{debugData.skillStats.speaking.count} bài</p>
                  <p className="text-gray-600">TB: {debugData.skillStats.speaking.avgScore}%</p>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <p className="text-green-600 font-medium">Reading</p>
                  <p className="text-gray-700">{debugData.skillStats.reading.count} bài</p>
                  <p className="text-gray-600">TB: {debugData.skillStats.reading.avgScore}%</p>
                </div>
                <div className="bg-orange-50 p-2 rounded">
                  <p className="text-orange-600 font-medium">Writing</p>
                  <p className="text-gray-700">{debugData.skillStats.writing.count} bài</p>
                  <p className="text-gray-600">TB: {debugData.skillStats.writing.avgScore}%</p>
                </div>
              </div>
            )}
          </div>

          {/* User Analytics */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="text-sm text-gray-700 mb-2">User Analytics (View)</h4>
            {debugData.analytics.error ? (
              <p className="text-red-600 text-sm">Error: {debugData.analytics.error.message}</p>
            ) : debugData.analytics.data ? (
              <div className="text-xs space-y-1">
                <p>Listening Mastery: {debugData.analytics.data.listening_mastery}%</p>
                <p>Speaking Mastery: {debugData.analytics.data.speaking_mastery}%</p>
                <p>Reading Mastery: {debugData.analytics.data.reading_mastery}%</p>
                <p>Writing Mastery: {debugData.analytics.data.writing_mastery}%</p>
                <p>Vocabulary Mastery: {debugData.analytics.data.vocabulary_mastery}%</p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No analytics data found</p>
            )}
          </div>

          {/* Learning Progress */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="text-sm text-gray-700 mb-2">Learning Progress ({debugData.progress.total} lessons)</h4>
            {debugData.progress.error ? (
              <p className="text-red-600 text-sm">Error: {debugData.progress.error.message}</p>
            ) : (
              <p className="text-gray-600 text-xs">
                {debugData.progress.total} lessons tracked
              </p>
            )}
          </div>

          {/* Recent Exercise Results */}
          {debugData.exerciseResults.data && debugData.exerciseResults.data.length > 0 && (
            <div className="bg-white rounded-lg p-4">
              <h4 className="text-sm text-gray-700 mb-2">Recent Results (Last 5)</h4>
              <div className="space-y-2">
                {debugData.exerciseResults.data.slice(0, 5).map((result: any, idx: number) => (
                  <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                    <span className="font-medium">{result.exercise_type}</span> - 
                    Lesson {result.lesson_id} - 
                    Score: {result.score}% - 
                    {result.correct_answers}/{result.total_questions} correct
                    <span className="text-gray-500 ml-2">
                      {new Date(result.completed_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!debugData && (
        <p className="text-gray-600 text-sm">Click "Check Database" to see your progress data</p>
      )}
    </div>
  );
}
