import { useState } from 'react';
import { Bug, ChevronDown, ChevronUp } from 'lucide-react';
import { allLessons } from '../data/allLessons';

interface ExerciseDebugPanelProps {
  lessonId: number;
  currentExerciseIndex: number;
  totalExercises: number;
}

export function ExerciseDebugPanel({ lessonId, currentExerciseIndex, totalExercises }: ExerciseDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const lesson = allLessons.find(l => l.id === lessonId);

  if (!lesson) return null;

  const typeDistribution: { [key: string]: number } = {};
  lesson.exercises.forEach(ex => {
    typeDistribution[ex.type] = (typeDistribution[ex.type] || 0) + 1;
  });

  const mcAnswerDistribution: { [key: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0 };
  lesson.exercises.forEach(ex => {
    if (ex.type === 'multiple-choice' && typeof ex.correctAnswer === 'number') {
      mcAnswerDistribution[ex.correctAnswer as number]++;
    }
  });

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-40"
        title="Debug Exercises"
      >
        <Bug className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-2xl shadow-2xl p-6 w-96 max-h-[80vh] overflow-y-auto z-40 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-purple-600" />
          <h3 className="font-apple-semibold text-gray-800">Exercise Debug</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Current Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <h4 className="font-apple-semibold text-sm text-gray-700 mb-2">Current Status</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Current Exercise:</span>
            <span className="font-mono text-gray-800">{currentExerciseIndex + 1}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Exercises:</span>
            <span className="font-mono text-gray-800">{totalExercises}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Progress:</span>
            <span className="font-mono text-gray-800">
              {Math.round(((currentExerciseIndex + 1) / totalExercises) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Lesson Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
        <h4 className="font-apple-semibold text-sm text-gray-700 mb-2">Lesson Info</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Lesson ID:</span>
            <span className="font-mono text-gray-800">{lesson.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Unit:</span>
            <span className="font-mono text-gray-800">{lesson.unit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Grade:</span>
            <span className="font-mono text-gray-800">{lesson.grade}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Vocabulary:</span>
            <span className="font-mono text-gray-800">{lesson.vocabulary.length}</span>
          </div>
        </div>
      </div>

      {/* Exercise Type Distribution */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
        <h4 className="font-apple-semibold text-sm text-gray-700 mb-2">Exercise Types</h4>
        <div className="space-y-1 text-xs">
          {Object.entries(typeDistribution).map(([type, count]) => (
            <div key={type} className="flex justify-between">
              <span className="text-gray-600">{type}:</span>
              <span className="font-mono text-gray-800">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Answer Diversity (MC only) */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
        <h4 className="font-apple-semibold text-sm text-gray-700 mb-2">
          Answer Diversity (MC)
        </h4>
        <div className="space-y-2 text-xs">
          {Object.entries(mcAnswerDistribution).map(([position, count]) => {
            const total = Object.values(mcAnswerDistribution).reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
            return (
              <div key={position}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Position {position}:</span>
                  <span className="font-mono text-gray-800">{count} ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-purple-600 h-1.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All Exercise IDs */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
        <h4 className="font-apple-semibold text-sm text-gray-700 mb-2">
          All Exercise IDs ({lesson.exercises.length})
        </h4>
        <div className="text-xs text-gray-600 max-h-32 overflow-y-auto">
          {lesson.exercises.map((ex, idx) => (
            <div 
              key={ex.id} 
              className={`py-1 ${idx === currentExerciseIndex ? 'bg-orange-200 font-apple-semibold' : ''}`}
            >
              {idx + 1}. ID: {ex.id} - {ex.type}
            </div>
          ))}
        </div>
      </div>

      {/* Warning if less than 30 */}
      {totalExercises < 30 && (
        <div className="mt-4 bg-yellow-50 border border-yellow-300 rounded-lg p-3">
          <p className="text-xs text-yellow-800">
            ⚠️ Warning: This lesson has only {totalExercises} exercises (expected 30)
          </p>
        </div>
      )}
    </div>
  );
}
