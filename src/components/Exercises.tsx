import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Award, RefreshCw } from 'lucide-react';
import { allLessons as lessons } from '../data/allLessons';
import { saveExerciseResult, updateLearningProgress, logDailyActivity } from '../utils/analytics';
import { toast } from 'sonner@2.0.3';

interface ExercisesProps {
  lessonId: number;
  onBack: () => void;
  user?: {
    id: string;
    grade: number;
  };
}

export function Exercises({ lessonId, onBack, user }: ExercisesProps) {
  const lesson = lessons.find((l) => l.id === lessonId);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string | number }>({});
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setCurrentExerciseIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setSubmitted(false);
  }, [lessonId]);

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Không tìm thấy bài tập</p>
      </div>
    );
  }

  const currentExercise = lesson.exercises[currentExerciseIndex];
  const totalExercises = lesson.exercises.length;

  const handleSelectAnswer = (answer: string | number) => {
    setUserAnswers({
      ...userAnswers,
      [currentExercise.id]: answer,
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleNext = async () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setSubmitted(false);
    } else {
      setShowResults(true);
      // Save completion status
      localStorage.setItem(`lesson_${lessonId}_completed`, 'true');
      
      // Save to database if user is logged in
      if (user && user.id !== 'demo-user' && !user.id.startsWith('demo-')) {
        try {
          const { correct, total } = calculateScore();
          const percentage = Math.round((correct / total) * 100);
          const isPassed = percentage >= 70;
          
          // Build detailed answers array
          const detailedAnswers = lesson.exercises.map((exercise, idx) => ({
            questionId: exercise.id,
            question: exercise.question,
            userAnswer: userAnswers[exercise.id],
            correctAnswer: exercise.correctAnswer,
            isCorrect: isCorrect(exercise.id),
            timeSpent: 0, // Could track this if needed
          }));
          
          // Save exercise result to database
          const savedResult = await saveExerciseResult({
            userId: user.id,
            lessonId: lessonId,
            exerciseType: 'vocabulary', // Default exercises are vocabulary/grammar mix
            score: percentage,
            totalQuestions: total,
            correctAnswers: correct,
            answers: detailedAnswers,
            timeSpentSeconds: 0, // Could track this if needed
          });
          
          // Update learning progress in database
          const savedProgress = await updateLearningProgress(
            user.id,
            lessonId,
            user.grade,
            {
              progress_percentage: isPassed ? 100 : percentage,
              completed_at: isPassed ? new Date().toISOString() : null,
            }
          );
          
          // Log daily activity
          await logDailyActivity(user.id, 'exercise_completed', {
            lessonId: lessonId,
            score: percentage,
            totalQuestions: total,
            correctAnswers: correct,
          });
          
          // FALLBACK: Save to localStorage if database save failed
          if (!savedResult || !savedProgress) {
            console.log('Database save failed. Saving to localStorage as fallback.');
            
            // Save exercise result to localStorage
            const localResults = JSON.parse(localStorage.getItem('exercise_results') || '[]');
            localResults.push({
              userId: user.id,
              lessonId: lessonId,
              exerciseType: 'mixed',
              score: percentage,
              totalQuestions: total,
              correctAnswers: correct,
              answers: detailedAnswers,
              completedAt: new Date().toISOString(),
            });
            localStorage.setItem('exercise_results', JSON.stringify(localResults));
            
            // Save learning progress to localStorage
            const localProgress = JSON.parse(localStorage.getItem('learning_progress') || '{}');
            localProgress[`${user.id}_${lessonId}`] = {
              userId: user.id,
              lessonId: lessonId,
              grade: user.grade,
              progressPercentage: isPassed ? 100 : percentage,
              completedAt: isPassed ? new Date().toISOString() : null,
              lastAccessedAt: new Date().toISOString(),
            };
            localStorage.setItem('learning_progress', JSON.stringify(localProgress));
          }
          
          toast.success(isPassed ? 'Đã lưu kết quả! Bạn đã vượt qua bài tập!' : 'Đã lưu kết quả!');
        } catch (error) {
          console.error('Error saving exercise result:', error);
          // Don't show error to user, just log it
        }
      }
    }
  };

  const handleRestart = () => {
    setCurrentExerciseIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setSubmitted(false);
  };

  const calculateScore = () => {
    let correct = 0;
    lesson.exercises.forEach((exercise) => {
      const userAnswer = userAnswers[exercise.id];
      if (typeof exercise.correctAnswer === 'string') {
        if (userAnswer?.toString().toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim()) {
          correct++;
        }
      } else {
        if (userAnswer === exercise.correctAnswer) {
          correct++;
        }
      }
    });
    return { correct, total: lesson.exercises.length };
  };

  const isCorrect = (exerciseId: number) => {
    const exercise = lesson.exercises.find((e) => e.id === exerciseId);
    if (!exercise) return false;
    const userAnswer = userAnswers[exerciseId];
    if (typeof exercise.correctAnswer === 'string') {
      return userAnswer?.toString().toLowerCase().trim() === exercise.correctAnswer.toLowerCase().trim();
    }
    return userAnswer === exercise.correctAnswer;
  };

  if (showResults) {
    const { correct, total } = calculateScore();
    const percentage = Math.round((correct / total) * 100);
    const isPassed = percentage >= 70;

    return (
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại bài học</span>
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-md text-center">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
            isPassed ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            <Award className={`w-12 h-12 ${isPassed ? 'text-green-600' : 'text-orange-600'}`} />
          </div>

          <h2 className="text-gray-900 mb-2">
            {isPassed ? 'Xuất sắc!' : 'Cố gắng lên!'}
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn đã hoàn thành bài tập Unit {lesson.unit}
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="text-gray-900 mb-2">{percentage}%</div>
            <p className="text-gray-600 mb-4">
              Đúng {correct}/{total} câu
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  isPassed ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-orange-500 to-orange-600'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Làm lại</span>
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Quay lại bài học
            </button>
          </div>

          {/* Review wrong answers */}
          {correct < total && (
            <div className="mt-8 text-left">
              <h3 className="text-gray-900 mb-4">Câu trả lời chi tiết:</h3>
              <div className="space-y-4">
                {lesson.exercises.map((exercise, index) => {
                  const correct = isCorrect(exercise.id);
                  if (correct) return null;
                  return (
                    <div key={exercise.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-gray-900 mb-2">
                        Câu {index + 1}: {exercise.question}
                      </p>
                      <p className="text-red-600 text-sm mb-1">
                        Câu trả lời của bạn: {userAnswers[exercise.id] || '(Chưa trả lời)'}
                      </p>
                      <p className="text-green-600 text-sm mb-2">
                        Đáp án đúng: {exercise.correctAnswer}
                      </p>
                      {exercise.explanation && (
                        <p className="text-gray-600 text-sm">
                          💡 {exercise.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Quay lại bài học</span>
      </button>

      <div className="bg-white rounded-2xl p-8 shadow-md">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Câu {currentExerciseIndex + 1}/{totalExercises}</span>
            <span>{Math.round(((currentExerciseIndex + 1) / totalExercises) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentExerciseIndex + 1) / totalExercises) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-4">{currentExercise.question}</h3>

          {/* Multiple Choice */}
          {currentExercise.type === 'multiple-choice' && currentExercise.options && (
            <div className="space-y-3">
              {currentExercise.options.map((option, index) => {
                const isSelected = userAnswers[currentExercise.id] === index;
                const isCorrectAnswer = index === currentExercise.correctAnswer;
                const showCorrect = submitted && isCorrectAnswer;
                const showWrong = submitted && isSelected && !isCorrectAnswer;

                return (
                  <button
                    key={index}
                    onClick={() => !submitted && handleSelectAnswer(index)}
                    disabled={submitted}
                    className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                      showCorrect
                        ? 'bg-green-50 border-green-500'
                        : showWrong
                        ? 'bg-red-50 border-red-500'
                        : isSelected
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                    } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`${
                        showCorrect ? 'text-green-700' : showWrong ? 'text-red-700' : 'text-gray-700'
                      }`}>
                        {option}
                      </span>
                      {showCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {showWrong && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Fill in the blank */}
          {currentExercise.type === 'fill-blank' && (
            <div>
              <input
                type="text"
                value={userAnswers[currentExercise.id] || ''}
                onChange={(e) => handleSelectAnswer(e.target.value)}
                disabled={submitted}
                placeholder="Nhập câu trả lời..."
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  submitted
                    ? isCorrect(currentExercise.id)
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                    : 'bg-gray-50 border-gray-200 focus:border-blue-500 focus:outline-none'
                }`}
              />
              {submitted && (
                <div className={`mt-2 p-3 rounded-lg ${
                  isCorrect(currentExercise.id) ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <p className={`text-sm ${
                    isCorrect(currentExercise.id) ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {isCorrect(currentExercise.id) 
                      ? '✓ Chính xác!' 
                      : `✗ Đáp án đúng: ${currentExercise.correctAnswer}`
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Explanation */}
        {submitted && currentExercise.explanation && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-900 text-sm mb-1">💡 Giải thích:</p>
            <p className="text-blue-700 text-sm">{currentExercise.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={userAnswers[currentExercise.id] === undefined}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Kiểm tra
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
            >
              {currentExerciseIndex < totalExercises - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
