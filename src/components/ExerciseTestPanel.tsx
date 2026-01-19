import { useState } from 'react';
import { Bug, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { getLessonById } from '../data/allLessons';
import { generateExercisesForLesson } from '../data/exerciseGenerator';

export function ExerciseTestPanel() {
  const [lessonId, setLessonId] = useState(1);
  const [testResults, setTestResults] = useState<any>(null);

  const testExercises = () => {
    const lesson = getLessonById(lessonId);
    if (!lesson) {
      setTestResults({ error: 'Lesson not found' });
      return;
    }

    const exercises = generateExercisesForLesson(lesson);
    const results: any = {
      lessonId,
      lessonTitle: lesson.title,
      grade: lesson.grade,
      exercises: []
    };

    // Test each exercise type
    exercises.forEach(exercise => {
      const exerciseResult: any = {
        type: exercise.type,
        difficulty: exercise.difficulty,
        issues: []
      };

      if (exercise.type === 'fillblank') {
        // Test fill-in-blank
        exercise.data.sentences.forEach((sentence: any, idx: number) => {
          // Check if sentence has all required fields
          if (!sentence.text) {
            exerciseResult.issues.push(`Sentence ${idx + 1}: Missing text`);
          }
          if (!sentence.answer) {
            exerciseResult.issues.push(`Sentence ${idx + 1}: Missing answer`);
          }
          if (!sentence.options || sentence.options.length === 0) {
            exerciseResult.issues.push(`Sentence ${idx + 1}: Missing options`);
          } else {
            // Check if answer is in options
            if (!sentence.options.includes(sentence.answer)) {
              exerciseResult.issues.push(
                `Sentence ${idx + 1}: Answer "${sentence.answer}" not in options [${sentence.options.join(', ')}]`
              );
            }
            // Check for undefined in options
            if (sentence.options.some((opt: any) => opt === undefined || opt === null)) {
              exerciseResult.issues.push(`Sentence ${idx + 1}: Has undefined/null in options`);
            }
          }
        });
        exerciseResult.totalSentences = exercise.data.sentences.length;
      } else if (exercise.type === 'synonym') {
        // Test synonym
        exercise.data.questions.forEach((question: any, idx: number) => {
          if (!question.word) {
            exerciseResult.issues.push(`Question ${idx + 1}: Missing word`);
          }
          if (!question.correctAnswer) {
            exerciseResult.issues.push(`Question ${idx + 1}: Missing correctAnswer`);
          }
          if (!question.options || question.options.length === 0) {
            exerciseResult.issues.push(`Question ${idx + 1}: Missing options`);
          } else {
            if (!question.options.includes(question.correctAnswer)) {
              exerciseResult.issues.push(
                `Question ${idx + 1}: Answer "${question.correctAnswer}" not in options`
              );
            }
            if (question.options.some((opt: any) => opt === undefined || opt === null)) {
              exerciseResult.issues.push(`Question ${idx + 1}: Has undefined/null in options`);
            }
          }
        });
        exerciseResult.totalQuestions = exercise.data.questions.length;
      } else if (exercise.type === 'pronunciation') {
        // Test pronunciation
        exercise.data.items.forEach((item: any, idx: number) => {
          if (!item.word) {
            exerciseResult.issues.push(`Item ${idx + 1}: Missing word`);
          }
          if (!item.pronunciation) {
            exerciseResult.issues.push(`Item ${idx + 1}: Missing pronunciation`);
          }
          if (!item.options || item.options.length === 0) {
            exerciseResult.issues.push(`Item ${idx + 1}: Missing options`);
          } else {
            if (!item.options.includes(item.pronunciation)) {
              exerciseResult.issues.push(
                `Item ${idx + 1}: Pronunciation "${item.pronunciation}" not in options`
              );
            }
          }
        });
        exerciseResult.totalItems = exercise.data.items.length;
      }

      exerciseResult.isValid = exerciseResult.issues.length === 0;
      results.exercises.push(exerciseResult);
    });

    setTestResults(results);
  };

  return (
    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Bug className="w-5 h-5 text-yellow-600" />
        <h3 className="text-yellow-800">Exercise Test Panel</h3>
      </div>

      <div className="flex gap-4 items-center mb-4">
        <label className="text-sm text-gray-700">Lesson ID:</label>
        <input
          type="number"
          value={lessonId}
          onChange={(e) => setLessonId(parseInt(e.target.value) || 1)}
          min="1"
          max="48"
          className="w-20 px-3 py-2 border rounded-lg"
        />
        <Button onClick={testExercises} size="sm">
          Test Exercises
        </Button>
      </div>

      {testResults && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="text-sm text-gray-700 mb-2">
              Lesson: {testResults.lessonTitle} (Grade {testResults.grade})
            </h4>
          </div>

          {testResults.exercises.map((exercise: any, idx: number) => (
            <div
              key={idx}
              className={`rounded-lg p-4 ${
                exercise.isValid
                  ? 'bg-green-50 border-2 border-green-300'
                  : 'bg-red-50 border-2 border-red-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {exercise.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <h4 className="text-sm font-medium">
                    {exercise.type.toUpperCase()} ({exercise.difficulty})
                  </h4>
                </div>
                {exercise.totalSentences && (
                  <span className="text-xs text-gray-600">{exercise.totalSentences} sentences</span>
                )}
                {exercise.totalQuestions && (
                  <span className="text-xs text-gray-600">{exercise.totalQuestions} questions</span>
                )}
                {exercise.totalItems && (
                  <span className="text-xs text-gray-600">{exercise.totalItems} items</span>
                )}
              </div>

              {exercise.issues.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-red-600 font-medium">Issues found:</p>
                  {exercise.issues.slice(0, 5).map((issue: string, issueIdx: number) => (
                    <p key={issueIdx} className="text-xs text-red-700 ml-4">
                      • {issue}
                    </p>
                  ))}
                  {exercise.issues.length > 5 && (
                    <p className="text-xs text-red-600 ml-4">
                      ... and {exercise.issues.length - 5} more issues
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
