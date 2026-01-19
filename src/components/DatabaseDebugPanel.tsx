import { useState } from 'react';
import { Database, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

interface DatabaseDebugPanelProps {
  userId: string;
}

export function DatabaseDebugPanel({ userId }: DatabaseDebugPanelProps) {
  const [debugData, setDebugData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'check' | 'raw' | 'test'>('check');

  const checkAllTables = async () => {
    setIsLoading(true);
    try {
      const { getSupabaseClient } = await import('../utils/supabase/client');
      const supabase = await getSupabaseClient();

      const results: any = {
        timestamp: new Date().toISOString(),
        tables: {}
      };

      // 1. Check exercise_results table
      console.log('[Debug] Checking exercise_results...');
      const { data: exerciseResults, error: exerciseError } = await supabase
        .from('exercise_results')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      results.tables.exercise_results = {
        exists: !exerciseError,
        error: exerciseError,
        count: exerciseResults?.length || 0,
        data: exerciseResults,
        byType: exerciseResults ? {
          vocabulary: exerciseResults.filter(r => r.exercise_type === 'vocabulary').length,
          listening: exerciseResults.filter(r => r.exercise_type === 'listening').length,
          speaking: exerciseResults.filter(r => r.exercise_type === 'speaking').length,
          reading: exerciseResults.filter(r => r.exercise_type === 'reading').length,
          writing: exerciseResults.filter(r => r.exercise_type === 'writing').length,
          grammar: exerciseResults.filter(r => r.exercise_type === 'grammar').length,
          mixed: exerciseResults.filter(r => r.exercise_type === 'mixed').length,
        } : {}
      };

      // 2. Check learning_progress table
      console.log('[Debug] Checking learning_progress...');
      const { data: learningProgress, error: progressError } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', userId)
        .order('last_accessed_at', { ascending: false });

      results.tables.learning_progress = {
        exists: !progressError,
        error: progressError,
        count: learningProgress?.length || 0,
        data: learningProgress
      };

      // 3. Check user_analytics view
      console.log('[Debug] Checking user_analytics...');
      const { data: analytics, error: analyticsError } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      results.tables.user_analytics = {
        exists: !analyticsError,
        error: analyticsError,
        data: analytics
      };

      // 4. Check daily_activities table
      console.log('[Debug] Checking daily_activities...');
      const { data: dailyActivities, error: activitiesError } = await supabase
        .from('daily_activities')
        .select('*')
        .eq('user_id', userId)
        .order('activity_date', { ascending: false })
        .limit(7);

      results.tables.daily_activities = {
        exists: !activitiesError,
        error: activitiesError,
        count: dailyActivities?.length || 0,
        data: dailyActivities
      };

      // 5. Check localStorage fallback
      try {
        const localResults = JSON.parse(localStorage.getItem('exercise_results') || '[]');
        const userLocalResults = localResults.filter((r: any) => r.userId === userId);
        results.localStorage = {
          totalRecords: localResults.length,
          userRecords: userLocalResults.length,
          data: userLocalResults
        };
      } catch (e) {
        results.localStorage = { error: String(e) };
      }

      setDebugData(results);
      console.log('[Debug] Results:', results);

    } catch (error) {
      console.error('[Debug] Error:', error);
      setDebugData({ error: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const testSaveExercise = async () => {
    setIsLoading(true);
    try {
      const { saveExerciseResult } = await import('../utils/analytics');
      
      const testData = {
        userId: userId,
        lessonId: 1,
        exerciseType: 'vocabulary' as const,
        score: 85,
        totalQuestions: 10,
        correctAnswers: 8,
        answers: [{ questionId: 1, userAnswer: 'test', isCorrect: true }],
        timeSpentSeconds: 120
      };

      console.log('[Debug] Testing saveExerciseResult with:', testData);
      const result = await saveExerciseResult(testData);
      console.log('[Debug] Save result:', result);

      // Refresh data
      await checkAllTables();

      if (result) {
        alert('✅ Test save successful! Check the data below.');
      } else {
        alert('⚠️ Save returned null - check console and localStorage');
      }

    } catch (error) {
      console.error('[Debug] Test save error:', error);
      alert('❌ Test save failed: ' + String(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          <h3 className="text-blue-800 font-semibold">Database Debug Panel</h3>
        </div>
        <div className="flex gap-2">
          <Button onClick={testSaveExercise} disabled={isLoading} size="sm" variant="outline">
            Test Save
          </Button>
          <Button onClick={checkAllTables} disabled={isLoading} size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Check Database
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('check')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            activeTab === 'check' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-blue-600 hover:bg-blue-100'
          }`}
        >
          Status Check
        </button>
        <button
          onClick={() => setActiveTab('raw')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            activeTab === 'raw' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-blue-600 hover:bg-blue-100'
          }`}
        >
          Raw Data
        </button>
      </div>

      {debugData && (
        <div className="space-y-4">
          {activeTab === 'check' && (
            <>
              {/* Exercise Results */}
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-800">exercise_results</h4>
                  {debugData.tables.exercise_results.exists ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                
                {debugData.tables.exercise_results.error ? (
                  <div className="text-xs text-red-600 mb-2">
                    Error: {debugData.tables.exercise_results.error.message}
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-gray-700 mb-3">
                      Total Records: <strong>{debugData.tables.exercise_results.count}</strong>
                    </div>
                    
                    {debugData.tables.exercise_results.count > 0 && (
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="text-blue-600 font-medium">Vocabulary</div>
                          <div className="text-gray-700">{debugData.tables.exercise_results.byType.vocabulary}</div>
                        </div>
                        <div className="bg-purple-50 p-2 rounded">
                          <div className="text-purple-600 font-medium">Listening</div>
                          <div className="text-gray-700">{debugData.tables.exercise_results.byType.listening}</div>
                        </div>
                        <div className="bg-pink-50 p-2 rounded">
                          <div className="text-pink-600 font-medium">Speaking</div>
                          <div className="text-gray-700">{debugData.tables.exercise_results.byType.speaking}</div>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <div className="text-green-600 font-medium">Reading</div>
                          <div className="text-gray-700">{debugData.tables.exercise_results.byType.reading}</div>
                        </div>
                        <div className="bg-orange-50 p-2 rounded">
                          <div className="text-orange-600 font-medium">Writing</div>
                          <div className="text-gray-700">{debugData.tables.exercise_results.byType.writing}</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="text-gray-600 font-medium">Grammar</div>
                          <div className="text-gray-700">{debugData.tables.exercise_results.byType.grammar}</div>
                        </div>
                        <div className="bg-indigo-50 p-2 rounded">
                          <div className="text-indigo-600 font-medium">Mixed</div>
                          <div className="text-gray-700">{debugData.tables.exercise_results.byType.mixed}</div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Learning Progress */}
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-800">learning_progress</h4>
                  {debugData.tables.learning_progress.exists ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                {debugData.tables.learning_progress.error ? (
                  <div className="text-xs text-red-600">
                    Error: {debugData.tables.learning_progress.error.message}
                  </div>
                ) : (
                  <div className="text-sm text-gray-700">
                    Lessons Tracked: <strong>{debugData.tables.learning_progress.count}</strong>
                  </div>
                )}
              </div>

              {/* User Analytics */}
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-800">user_analytics (view)</h4>
                  {debugData.tables.user_analytics.exists ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                {debugData.tables.user_analytics.error ? (
                  <div className="text-xs text-red-600">
                    Error: {debugData.tables.user_analytics.error.message}
                  </div>
                ) : debugData.tables.user_analytics.data ? (
                  <div className="text-xs space-y-1">
                    <div>Total Lessons: {debugData.tables.user_analytics.data.total_lessons_completed}</div>
                    <div>Total Exercises: {debugData.tables.user_analytics.data.total_exercises_completed}</div>
                    <div>Avg Score: {debugData.tables.user_analytics.data.average_score}%</div>
                    <div>Vocabulary: {debugData.tables.user_analytics.data.vocabulary_mastery}%</div>
                    <div>Listening: {debugData.tables.user_analytics.data.listening_mastery}%</div>
                    <div>Speaking: {debugData.tables.user_analytics.data.speaking_mastery}%</div>
                    <div>Reading: {debugData.tables.user_analytics.data.reading_mastery}%</div>
                    <div>Writing: {debugData.tables.user_analytics.data.writing_mastery}%</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No analytics data</div>
                )}
              </div>

              {/* Daily Activities */}
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-800">daily_activities</h4>
                  {debugData.tables.daily_activities.exists ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                {debugData.tables.daily_activities.error ? (
                  <div className="text-xs text-red-600">
                    Error: {debugData.tables.daily_activities.error.message}
                  </div>
                ) : (
                  <div className="text-sm text-gray-700">
                    Days Tracked: <strong>{debugData.tables.daily_activities.count}</strong>
                  </div>
                )}
              </div>

              {/* LocalStorage */}
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <h4 className="text-sm font-semibold text-gray-800">localStorage Fallback</h4>
                </div>
                <div className="text-sm text-gray-700">
                  User Records: <strong>{debugData.localStorage?.userRecords || 0}</strong>
                </div>
              </div>
            </>
          )}

          {activeTab === 'raw' && (
            <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
              <pre className="text-xs text-green-400">
                {JSON.stringify(debugData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {!debugData && (
        <div className="text-center py-8 text-gray-600">
          Click "Check Database" to view your data
        </div>
      )}
    </div>
  );
}
