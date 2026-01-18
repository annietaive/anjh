import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, BookOpen, Lightbulb, Award, CheckCircle, Headphones, Mic, FileText, PenTool } from 'lucide-react';
import { allLessons as lessons } from '../data/allLessons';
import { saveLessonProgress } from '../utils/api';
import { saveExerciseResult, updateLearningProgress, logDailyActivity } from '../utils/analytics';
import { toast } from 'sonner@2.0.3';
import { SpeakingPractice } from './SpeakingPractice';
import { getLessonImage } from '../data/lessonImages';
import { LessonImage } from './LessonImage';
import { VocabularyImage } from './VocabularyImage';

interface LessonDetailProps {
  lessonId: number;
  onNavigateToExercises: (lessonId: number) => void;
  onBack: () => void;
  accessToken?: string | null;
  user?: {
    id: string;
    name: string;
    grade: number;
  } | null;
}

export function LessonDetail({ lessonId, onNavigateToExercises, onBack, accessToken, user }: LessonDetailProps) {
  const lesson = lessons.find((l) => l.id === lessonId);
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'reading' | 'writing'>('vocabulary');
  const [learnedWords, setLearnedWords] = useState<Set<string>>(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [writingText, setWritingText] = useState('');
  const [writingFeedback, setWritingFeedback] = useState<{
    score: number;
    grammar: number;
    vocabulary: number;
    structure: number;
    comments: string[];
  } | null>(null);

  // Debug: Log image URL
  const imageUrl = getLessonImage(lessonId);
  console.log('Lesson ID:', lessonId, 'Image URL:', imageUrl);

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Không tìm thấy bài học</p>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">
          Quay lại
        </button>
      </div>
    );
  }

  const handleSpeakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleLearnedWord = async (word: string) => {
    const newLearnedWords = new Set(learnedWords);
    if (newLearnedWords.has(word)) {
      newLearnedWords.delete(word);
    } else {
      newLearnedWords.add(word);
    }
    setLearnedWords(newLearnedWords);

    // Save progress when learning vocabulary
    if (accessToken) {
      try {
        const progress = Math.round((newLearnedWords.size / lesson.vocabulary.length) * 100);
        await saveLessonProgress(
          lessonId,
          {
            skills: { vocabulary: newLearnedWords.size === lesson.vocabulary.length },
            score: progress,
          },
          accessToken
        );
      } catch (error) {
        console.error('Error saving vocabulary progress:', error);
      }
    }
  };

  const progress = Math.round((learnedWords.size / lesson.vocabulary.length) * 100);

  // Helper function to save skill progress
  const saveSkillProgress = async (skill: 'listening' | 'speaking' | 'reading' | 'writing', score: number, correctAnswers: number = 0, totalQuestions: number = 0) => {
    if (!user) {
      console.log(`[LessonDetail] No user, skipping ${skill} save`);
      return;
    }

    try {
      // Save exercise result with proper exerciseType
      await saveExerciseResult({
        userId: user.id,
        lessonId: lessonId,
        exerciseType: skill, // 'listening', 'speaking', 'reading', or 'writing'
        score: score,
        totalQuestions: totalQuestions || 1,
        correctAnswers: correctAnswers || Math.round(score / 100),
        answers: [],
        timeSpentSeconds: 0
      });
      console.log(`[LessonDetail] Saved ${skill} result: ${score}% (${correctAnswers}/${totalQuestions} correct)`);
      
      await updateLearningProgress(user.id, lessonId, lesson.unit, {
        progress_percentage: score,
        completed_at: score >= 70 ? new Date().toISOString() : null
      });
      console.log(`[LessonDetail] Updated ${skill} progress for lesson ${lessonId}`);
      
      await logDailyActivity(user.id);
      console.log(`[LessonDetail] Logged daily activity for ${skill}`);
      
      toast.success(`✅ Đã lưu kết quả ${skill === 'listening' ? 'Nghe' : skill === 'speaking' ? 'Nói' : skill === 'reading' ? 'Đọc' : 'Viết'}: ${score}%`);
    } catch (error) {
      console.error(`[LessonDetail] Error saving ${skill} progress:`, error);
    }
  };

  // Check listening completion and save progress
  useEffect(() => {
    if (activeTab === 'listening' && lesson?.listening?.questions) {
      const answeredCount = Object.keys(selectedAnswers).filter(key => !key.startsWith('reading-')).length;
      const totalQuestions = lesson.listening.questions.length;
      
      if (answeredCount === totalQuestions && totalQuestions > 0) {
        // Calculate score
        let correct = 0;
        lesson.listening.questions.forEach((q, index) => {
          if (selectedAnswers[index] === q.correctAnswer) {
            correct++;
          }
        });
        const score = Math.round((correct / totalQuestions) * 100);
        saveSkillProgress('listening', score, correct, totalQuestions);
      }
    }
  }, [selectedAnswers, activeTab]);

  // Check reading completion and save progress
  useEffect(() => {
    if (activeTab === 'reading' && lesson?.reading?.questions) {
      const readingAnswers = Object.keys(selectedAnswers).filter(key => key.startsWith('reading-'));
      const totalQuestions = lesson.reading.questions.length;
      
      if (readingAnswers.length === totalQuestions && totalQuestions > 0) {
        // Calculate score
        let correct = 0;
        lesson.reading.questions.forEach((q, index) => {
          if (selectedAnswers[`reading-${index}`] === q.correctAnswer) {
            correct++;
          }
        });
        const score = Math.round((correct / totalQuestions) * 100);
        saveSkillProgress('reading', score, correct, totalQuestions);
      }
    }
  }, [selectedAnswers, activeTab]);

  const gradeWriting = () => {
    if (writingText.trim().length < 20) {
      alert('Bài viết quá ngắn! Vui lòng viết ít nhất 50 từ.');
      return;
    }

    const words = writingText.trim().split(/\s+/);
    const wordCount = words.length;
    
    let grammarScore = 8;
    let vocabScore = 7;
    let structureScore = 8;
    const comments: string[] = [];

    // Check capitalization
    if (!/^[A-Z]/.test(writingText)) {
      grammarScore -= 1;
      comments.push('❌ Câu nên bắt đầu bằng chữ in hoa');
    }

    // Check ending punctuation
    if (!/[.!?]$/.test(writingText.trim())) {
      grammarScore -= 1;
      comments.push('❌ Thiếu dấu câu cuối câu');
    }

    // Check common grammar errors
    if (/\b(I am|He is|She is)\s+\d+\s+year\s+old\b/i.test(writingText)) {
      grammarScore -= 2;
      comments.push("❌ Lỗi: '13 year old' → '13 years old' (thêm 's')");
    }

    if (/\b(he|she|it)\s+(go|play|study|do|have)\s/i.test(writingText)) {
      grammarScore -= 2;
      comments.push('❌ Lỗi: Thiếu s/es với chủ ngữ ngôi thứ 3 số ít (he/she/it)');
    }

    // Check length
    if (wordCount < 50) {
      structureScore -= 2;
      comments.push(`⚠️ Bài hơi ngắn (${wordCount} từ). Nên viết 60-100 từ.`);
    } else if (wordCount >= 60 && wordCount <= 100) {
      structureScore += 1;
      comments.push(`✅ Độ dài phù hợp (${wordCount} từ)`);
    }

    // Check vocabulary variety
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const varietyRatio = uniqueWords.size / wordCount;
    if (varietyRatio > 0.7) {
      vocabScore += 2;
      comments.push('✅ Từ vựng đa dạng!');
    } else if (varietyRatio < 0.5) {
      vocabScore -= 1;
      comments.push('⚠️ Nên sử dụng từ vựng đa dạng hơn');
    }

    // Check for linking words
    const linkingWords = ['first', 'second', 'finally', 'however', 'because', 'so', 'but', 'and', 'also', 'moreover'];
    const hasLinking = linkingWords.some(word => writingText.toLowerCase().includes(word));
    if (hasLinking) {
      structureScore += 1;
      comments.push('✅ Sử dụng linking words tốt');
    } else {
      structureScore -= 1;
      comments.push('💡 Nên dùng linking words: First, Second, Finally, Because, So...');
    }

    // Ensure scores are within 0-10
    grammarScore = Math.max(0, Math.min(10, grammarScore));
    vocabScore = Math.max(0, Math.min(10, vocabScore));
    structureScore = Math.max(0, Math.min(10, structureScore));

    const totalScore = Math.round((grammarScore + vocabScore + structureScore) / 3 * 10) / 10;

    if (comments.length === 0) {
      comments.push('✅ Bài viết tốt! Tiếp tục cố gắng!');
    }

    comments.push('');
    comments.push('📚 Gợi ý cải thiện:');
    comments.push('→ Đọc kỹ đề bài và trả lời đầy đủ các yêu cầu');
    comments.push('→ Sử dụng cấu trúc câu đa dạng (simple, compound, complex)');
    comments.push('→ Kiểm tra chính tả và ngữ pháp trước khi nộp');

    setWritingFeedback({
      score: totalScore,
      grammar: grammarScore,
      vocabulary: vocabScore,
      structure: structureScore,
      comments
    });

    // Save writing progress
    saveSkillProgress('writing', Math.round(totalScore * 10));
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Quay lại danh sách</span>
      </button>

      <div className="bg-white rounded-2xl p-8 shadow-md mb-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-4">
          <div className="flex-1">
            <div className="text-sm text-blue-600 mb-2">Unit {lesson.unit} - {lesson.level}</div>
            <h1 className="text-blue-900 mb-2">{lesson.title}</h1>
            <p className="text-gray-600">{lesson.description}</p>
          </div>
          <div className="w-full md:w-64 flex-shrink-0 rounded-xl overflow-hidden shadow-lg group" style={{ height: '200px' }}>
            <LessonImage
              src={imageUrl}
              alt={lesson.title}
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-95"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {lesson.topics.map((topic, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full"
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Tiến độ học từ vựng</span>
            <span>{learnedWords.size}/{lesson.vocabulary.length} từ</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => onNavigateToExercises(lessonId)}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Award className="w-5 h-5" />
          <span>Làm bài tập ({lesson.exercises.length} câu)</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('vocabulary')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            activeTab === 'vocabulary'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-blue-50'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Từ vựng ({lesson.vocabulary.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('grammar')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            activeTab === 'grammar'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-purple-50'
          }`}
        >
          <Lightbulb className="w-5 h-5" />
          <span>Ngữ pháp ({lesson.grammar.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('listening')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            activeTab === 'listening'
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-red-50'
          }`}
        >
          <Headphones className="w-5 h-5" />
          <span>Nghe</span>
        </button>
        <button
          onClick={() => setActiveTab('speaking')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            activeTab === 'speaking'
              ? 'bg-orange-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-orange-50'
          }`}
        >
          <Mic className="w-5 h-5" />
          <span>Nói</span>
        </button>
        <button
          onClick={() => setActiveTab('reading')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            activeTab === 'reading'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-green-50'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Đọc</span>
        </button>
        <button
          onClick={() => setActiveTab('writing')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
            activeTab === 'writing'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-blue-50'
          }`}
        >
          <PenTool className="w-5 h-5" />
          <span>Viết</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'vocabulary' && (
        <div className="grid gap-6">
          {lesson.vocabulary.map((vocab, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all ${
                learnedWords.has(vocab.word) ? 'ring-2 ring-green-500' : ''
              }`}
            >
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                  <VocabularyImage
                    word={vocab.word}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-900">{vocab.word}</h3>
                        <button
                          onClick={() => handleSpeakWord(vocab.word)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-gray-500 mb-1">{vocab.pronunciation}</p>
                      <p className="text-blue-600">{vocab.meaning}</p>
                    </div>
                    <button
                      onClick={() => toggleLearnedWord(vocab.word)}
                      className={`p-2 rounded-lg transition-all ${
                        learnedWords.has(vocab.word)
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600'
                      }`}
                    >
                      <CheckCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Example:</p>
                    <p className="text-gray-800 italic">"{vocab.example}"</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'grammar' && (
        <div className="grid gap-6">
          {lesson.grammar.map((grammar, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Lightbulb className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">{grammar.title}</h3>
                  <p className="text-gray-600">{grammar.explanation}</p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-purple-600 mb-2">Công thức:</p>
                <p className="text-purple-900">{grammar.rule}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">Ví dụ:</p>
                {grammar.examples.map((example, exIndex) => (
                  <div key={exIndex} className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <p className="text-gray-800">{example}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Listening Tab */}
      {activeTab === 'listening' && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 p-3 rounded-lg">
              <Headphones className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-gray-900">{lesson.listening.title}</h3>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">📝 Audio Script:</p>
            <p className="text-gray-800 leading-relaxed">{lesson.listening.audioScript}</p>
            <button
              onClick={() => handleSpeakWord(lesson.listening.audioScript)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Volume2 className="w-5 h-5" />
              <span>Phát audio</span>
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-900">Câu hỏi:</p>
            {lesson.listening.questions.map((q, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <p className="text-gray-800 mb-3">{index + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((option, optIndex) => {
                    const isSelected = selectedAnswers[index] === optIndex;
                    const isCorrect = optIndex === q.correctAnswer;
                    const showResult = selectedAnswers[index] !== undefined;

                    return (
                      <button
                        key={optIndex}
                        onClick={() => setSelectedAnswers({ ...selectedAnswers, [index]: optIndex })}
                        className={`w-full p-3 rounded-lg text-left transition-all border-2 ${
                          showResult && isCorrect
                            ? 'bg-green-50 border-green-500'
                            : showResult && isSelected && !isCorrect
                            ? 'bg-red-50 border-red-500'
                            : isSelected
                            ? 'bg-blue-50 border-blue-500'
                            : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Speaking Tab */}
      {activeTab === 'speaking' && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Mic className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-gray-900">{lesson.speaking.title}</h3>
              <span className="text-sm text-gray-600">Type: {lesson.speaking.type}</span>
            </div>
          </div>

          <SpeakingPractice 
            speaking={lesson.speaking} 
            grade={lesson.grade} 
            user={user}
            lessonId={lessonId}
          />
        </div>
      )}

      {/* Reading Tab */}
      {activeTab === 'reading' && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-gray-900">{lesson.reading.title}</h3>
          </div>

          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">{lesson.reading.passage}</p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-900">Comprehension Questions:</p>
            {lesson.reading.questions.map((q, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <p className="text-gray-800 mb-3">{index + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((option, optIndex) => {
                    const isSelected = selectedAnswers[`reading-${index}`] === optIndex;
                    const isCorrect = optIndex === q.correctAnswer;
                    const showResult = selectedAnswers[`reading-${index}`] !== undefined;

                    return (
                      <button
                        key={optIndex}
                        onClick={() => setSelectedAnswers({ ...selectedAnswers, [`reading-${index}`]: optIndex })}
                        className={`w-full p-3 rounded-lg text-left transition-all border-2 ${
                          showResult && isCorrect
                            ? 'bg-green-50 border-green-500'
                            : showResult && isSelected && !isCorrect
                            ? 'bg-red-50 border-red-500'
                            : isSelected
                            ? 'bg-blue-50 border-blue-500'
                            : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Writing Tab */}
      {activeTab === 'writing' && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-lg">
              <PenTool className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-gray-900">{lesson.writing.title}</h3>
              <span className="text-sm text-gray-600">Type: {lesson.writing.type}</span>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-blue-600 mb-2">✍️ Writing Prompt:</p>
            <p className="text-gray-800">{lesson.writing.prompt}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">📝 Sample Writing:</p>
            <p className="text-gray-800 italic leading-relaxed">{lesson.writing.example}</p>
          </div>

          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-gray-900 mb-3">💡 Writing Tips:</p>
            <div className="space-y-2">
              {lesson.writing.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-gray-900 mb-3">Your Writing:</p>
            <textarea
              className="w-full h-48 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Write your response here..."
              value={writingText}
              onChange={(e) => setWritingText(e.target.value)}
            />
            <button
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={gradeWriting}
            >
              Submit Writing
            </button>
          </div>

          {writingFeedback && (
            <div className="mt-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-500 p-2 rounded-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-900">📊 Kết quả chấm bài</h3>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-2xl mb-1">⭐ {writingFeedback.score}</p>
                  <p className="text-sm text-gray-600">Tổng điểm</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-2xl mb-1">{writingFeedback.grammar}/10</p>
                  <p className="text-sm text-gray-600">Ngữ pháp</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-2xl mb-1">{writingFeedback.vocabulary}/10</p>
                  <p className="text-sm text-gray-600">Từ vựng</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-2xl mb-1">{writingFeedback.structure}/10</p>
                  <p className="text-sm text-gray-600">Cấu trúc</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-gray-900 mb-3">💬 Nhận xét chi tiết:</p>
                <div className="space-y-2">
                  {writingFeedback.comments.map((comment, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed">{comment}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}