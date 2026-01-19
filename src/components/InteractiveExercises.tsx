import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, RefreshCw, Star, Trophy, Zap, Volume2, BookOpen, Brain } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { getLessonById } from '../data/allLessons';
import { generateExercisesForLesson, getDifficultyColor, getDifficultyText } from '../data/exerciseGenerator';
import { saveExerciseResult, updateLearningProgress, logDailyActivity } from '../utils/analytics';

interface InteractiveExercisesProps {
  onBack: () => void;
  lessonId: number;
  accessToken: string | null;
  user?: {
    id: string;
    name: string;
    grade: number;
  } | null;
}

interface MatchingPair {
  id: number;
  left: string;
  right: string;
  pronunciation?: string;
}

interface DragDropItem {
  id: number;
  text: string;
  category: string;
  vietnamese?: string;
}

export function InteractiveExercises({ onBack, lessonId, accessToken, user }: InteractiveExercisesProps) {
  const [currentExerciseType, setCurrentExerciseType] = useState<'matching' | 'dragdrop' | 'fillblank' | 'ordering' | 'pronunciation' | 'synonym'>('matching');
  const [score, setScore] = useState(0);
  const [lesson, setLesson] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [currentExercise, setCurrentExercise] = useState<any>(null);

  // Initialize lesson and exercises
  useEffect(() => {
    const lessonData = getLessonById(lessonId);
    if (lessonData) {
      setLesson(lessonData);
      const generatedExercises = generateExercisesForLesson(lessonData);
      setExercises(generatedExercises);
      const matchingEx = generatedExercises.find(e => e.type === 'matching');
      if (matchingEx) {
        setCurrentExercise(matchingEx);
      }
    }
  }, [lessonId]);

  // Change exercise type
  const changeExerciseType = (type: string) => {
    const exercise = exercises.find(e => e.type === type);
    if (exercise) {
      setCurrentExerciseType(type as any);
      setCurrentExercise(exercise);
      resetCurrentExercise();
    }
  };

  // Matching Exercise States
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [matchingRightOrder, setMatchingRightOrder] = useState<MatchingPair[]>([]);

  // Initialize matching right column order
  useEffect(() => {
    if (currentExercise?.type === 'matching' && currentExercise.data?.pairs) {
      setMatchingRightOrder([...currentExercise.data.pairs].sort(() => Math.random() - 0.5));;
    }
  }, [currentExercise]);

  // Check matching completion
  useEffect(() => {
    if (currentExercise?.type === 'matching' && currentExercise.data?.pairs) {
      if (matchedPairs.length === currentExercise.data.pairs.length && matchedPairs.length > 0) {
        // Save progress when all pairs are matched
        saveProgress('matching', matchedPairs.length, currentExercise.data.pairs.length);
      }
    }
  }, [matchedPairs, currentExercise]);

  // Fill in the Blank Exercise States
  const [fillBlankAnswers, setFillBlankAnswers] = useState<{ [key: number]: string }>({});
  const [fillBlankChecked, setFillBlankChecked] = useState(false);

  // Ordering Exercise States
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [currentOrderingSentence, setCurrentOrderingSentence] = useState(0);

  // Initialize ordering words
  useEffect(() => {
    if (currentExercise?.type === 'ordering' && currentExercise.data?.sentences) {
      const sentence = currentExercise.data.sentences[currentOrderingSentence];
      if (sentence) {
        const shuffled = [...sentence.words].sort(() => Math.random() - 0.5);
        setAvailableWords(shuffled);
        setOrderedWords([]);
      }
    }
  }, [currentExercise, currentOrderingSentence]);

  // Drag and Drop States
  const [draggedItem, setDraggedItem] = useState<DragDropItem | null>(null);
  const [categoryBoxes, setCategoryBoxes] = useState<{ [key: string]: DragDropItem[] }>({});
  const [remainingItems, setRemainingItems] = useState<DragDropItem[]>([]);

  // Initialize drag drop
  useEffect(() => {
    if (currentExercise?.type === 'dragdrop' && currentExercise.data?.items) {
      setRemainingItems([...currentExercise.data.items]);
      const boxes: { [key: string]: DragDropItem[] } = {};
      currentExercise.data.categories.forEach((cat: string) => {
        boxes[cat] = [];
      });
      setCategoryBoxes(boxes);
    }
  }, [currentExercise]);

  // Check drag and drop completion
  useEffect(() => {
    if (currentExercise?.type === 'dragdrop' && currentExercise.data?.items) {
      if (remainingItems.length === 0 && currentExercise.data.items.length > 0) {
        // All items placed - check if all correct
        let correct = 0;
        Object.entries(categoryBoxes).forEach(([category, items]) => {
          items.forEach(item => {
            if (item.category === category) correct++;
          });
        });
        if (correct > 0) {
          saveProgress('dragdrop', correct, currentExercise.data.items.length);
        }
      }
    }
  }, [remainingItems, categoryBoxes, currentExercise]);

  // Pronunciation Exercise States
  const [pronunciationAnswers, setPronunciationAnswers] = useState<{ [key: number]: string }>({});
  const [pronunciationChecked, setPronunciationChecked] = useState(false);

  // Synonym Exercise States
  const [synonymAnswers, setSynonymAnswers] = useState<{ [key: number]: string }>({});
  const [synonymChecked, setSynonymChecked] = useState(false);

  // Helper function to save progress
  const saveProgress = async (exerciseType: string, correct: number, total: number) => {
    if (!user) {
      console.log('[InteractiveExercises] No user, skipping save');
      return;
    }

    const scorePercent = Math.round((correct / total) * 100);
    
    try {
      // Map exercise type to analytics type
      const analyticsType = exerciseType === 'matching' || exerciseType === 'dragdrop' || 
                           exerciseType === 'fillblank' || exerciseType === 'ordering' ||
                           exerciseType === 'pronunciation' || exerciseType === 'synonym' ? 'vocabulary' : 'mixed';
      
      // Save exercise result with proper type
      await saveExerciseResult({
        userId: user.id,
        lessonId: lessonId,
        exerciseType: analyticsType as any,
        score: scorePercent,
        totalQuestions: total,
        correctAnswers: correct,
        answers: [],
        timeSpentSeconds: 0
      });
      console.log(`[InteractiveExercises] Saved ${exerciseType} result as ${analyticsType}: ${scorePercent}%`);
      
      // Update learning progress
      await updateLearningProgress(user.id, lessonId, lesson?.unit || 1, {
        progress_percentage: scorePercent,
        completed_at: scorePercent >= 70 ? new Date().toISOString() : null
      });
      console.log(`[InteractiveExercises] Updated progress for lesson ${lessonId}`);
      
      // Log daily activity
      await logDailyActivity(user.id);
      console.log(`[InteractiveExercises] Logged daily activity`);
    } catch (error) {
      console.error('[InteractiveExercises] Error saving progress:', error);
    }
  };

  // Matching Exercise Functions
  const handleMatchingClick = (side: 'left' | 'right', id: number) => {
    if (matchedPairs.includes(id)) return;

    if (side === 'left') {
      setSelectedLeft(id);
      if (selectedRight !== null) {
        checkMatch(id, selectedRight);
      }
    } else {
      setSelectedRight(id);
      if (selectedLeft !== null) {
        checkMatch(selectedLeft, id);
      }
    }
  };

  const checkMatch = (leftId: number, rightId: number) => {
    if (leftId === rightId) {
      setMatchedPairs([...matchedPairs, leftId]);
      setScore(score + 10);
      toast.success('Chính xác! +10 điểm');
    } else {
      toast.error('Chưa đúng, hãy thử lại!');
    }
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  // Fill in the Blank Functions
  const handleFillBlankSelect = (sentenceId: number, answer: string) => {
    setFillBlankAnswers({ ...fillBlankAnswers, [sentenceId]: answer });
  };

  const checkFillBlank = () => {
    let correct = 0;
    const sentences = currentExercise.data.sentences;
    sentences.forEach((sentence: any) => {
      if (fillBlankAnswers[sentence.id] === sentence.answer) {
        correct++;
      }
    });
    setFillBlankChecked(true);
    const points = correct * 10;
    setScore(score + points);
    toast.success(`Bạn trả lời đúng ${correct}/${sentences.length} câu! +${points} điểm`);
    saveProgress('fillblank', correct, sentences.length);
  };

  // Ordering Functions
  const addWordToOrder = (word: string) => {
    setOrderedWords([...orderedWords, word]);
    setAvailableWords(availableWords.filter(w => w !== word));
  };

  const removeWordFromOrder = (index: number) => {
    const word = orderedWords[index];
    setAvailableWords([...availableWords, word]);
    setOrderedWords(orderedWords.filter((_, i) => i !== index));
  };

  const checkOrdering = () => {
    const sentence = currentExercise.data.sentences[currentOrderingSentence];
    if (JSON.stringify(orderedWords) === JSON.stringify(sentence.correctOrder)) {
      setScore(score + 10);
      toast.success('Sắp xếp chính xác! +10 điểm');
      
      // Move to next sentence if available
      if (currentOrderingSentence < currentExercise.data.sentences.length - 1) {
        setTimeout(() => {
          setCurrentOrderingSentence(currentOrderingSentence + 1);
        }, 1000);
      }
    } else {
      toast.error('Chưa đúng, hãy thử lại!');
    }
  };

  // Drag and Drop Functions
  const handleDragStart = (item: DragDropItem) => {
    setDraggedItem(item);
  };

  const handleDrop = (category: string) => {
    if (!draggedItem) return;

    if (draggedItem.category === category) {
      setCategoryBoxes({
        ...categoryBoxes,
        [category]: [...(categoryBoxes[category] || []), draggedItem]
      });
      setRemainingItems(remainingItems.filter(item => item.id !== draggedItem.id));
      setScore(score + 5);
      toast.success('Đúng rồi! +5 điểm');
    } else {
      toast.error('Không đúng danh mục!');
    }
    setDraggedItem(null);
  };

  // Pronunciation Functions
  const handlePronunciationSelect = (itemId: number, pronunciation: string) => {
    setPronunciationAnswers({ ...pronunciationAnswers, [itemId]: pronunciation });
  };

  const checkPronunciation = () => {
    let correct = 0;
    const items = currentExercise.data.items;
    items.forEach((item: any) => {
      if (pronunciationAnswers[item.id] === item.pronunciation) {
        correct++;
      }
    });
    setPronunciationChecked(true);
    const points = correct * 10;
    setScore(score + points);
    toast.success(`Bạn chọn đúng ${correct}/${items.length} phiên âm! +${points} điểm`);
    saveProgress('pronunciation', correct, items.length);
  };

  // Synonym Functions
  const handleSynonymSelect = (questionId: number, answer: string) => {
    setSynonymAnswers({ ...synonymAnswers, [questionId]: answer });
  };

  const checkSynonym = () => {
    let correct = 0;
    const questions = currentExercise.data.questions;
    questions.forEach((question: any) => {
      if (synonymAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    setSynonymChecked(true);
    const points = correct * 15;
    setScore(score + points);
    toast.success(`Bạn trả lời đúng ${correct}/${questions.length} câu! +${points} điểm`);
    saveProgress('synonym', correct, questions.length);
  };

  const resetCurrentExercise = () => {
    setMatchedPairs([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setFillBlankAnswers({});
    setFillBlankChecked(false);
    setOrderedWords([]);
    setCurrentOrderingSentence(0);
    setPronunciationAnswers({});
    setPronunciationChecked(false);
    setSynonymAnswers({});
    setSynonymChecked(false);
  };

  const resetAll = () => {
    resetCurrentExercise();
    setScore(0);
    // Re-initialize current exercise
    if (currentExercise?.type === 'ordering' && currentExercise.data.sentences) {
      const sentence = currentExercise.data.sentences[0];
      if (sentence) {
        const shuffled = [...sentence.words].sort(() => Math.random() - 0.5);
        setAvailableWords(shuffled);
      }
    }
    if (currentExercise?.type === 'dragdrop') {
      setRemainingItems([...currentExercise.data.items]);
      const boxes: { [key: string]: DragDropItem[] } = {};
      currentExercise.data.categories.forEach((cat: string) => {
        boxes[cat] = [];
      });
      setCategoryBoxes(boxes);
    }
    if (currentExercise?.type === 'matching') {
      setMatchingRightOrder([...currentExercise.data.pairs].sort(() => Math.random() - 0.5));
    }
  };

  if (!lesson || !currentExercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài tập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="mb-2">Bài tập tương tác - {lesson.title}</h1>
              <p className="text-white/90">Lớp {lesson.grade} - {lesson.level}</p>
              <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm border ${getDifficultyColor(currentExercise.difficulty)}`}>
                Độ khó: {getDifficultyText(currentExercise.difficulty)}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-2">
                <Trophy className="w-6 h-6" />
                <span className="text-3xl">{score}</span>
              </div>
              <p className="text-sm text-white/80">Điểm số</p>
            </div>
          </div>
        </div>

        {/* Exercise Type Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-3">
            {exercises.map((exercise) => {
              let icon = <Zap className="w-4 h-4" />;
              let label = '';
              
              switch (exercise.type) {
                case 'matching':
                  icon = <Zap className="w-4 h-4" />;
                  label = 'Ghép đôi';
                  break;
                case 'fillblank':
                  icon = <Star className="w-4 h-4" />;
                  label = 'Điền vào chỗ trống';
                  break;
                case 'ordering':
                  icon = <CheckCircle2 className="w-4 h-4" />;
                  label = 'Sắp xếp câu';
                  break;
                case 'dragdrop':
                  icon = <Trophy className="w-4 h-4" />;
                  label = 'Kéo thả';
                  break;
                case 'pronunciation':
                  icon = <Volume2 className="w-4 h-4" />;
                  label = 'Phiên âm';
                  break;
                case 'synonym':
                  icon = <Brain className="w-4 h-4" />;
                  label = 'Từ đồng nghĩa';
                  break;
              }
              
              return (
                <Button
                  key={exercise.type}
                  onClick={() => changeExerciseType(exercise.type)}
                  variant={currentExerciseType === exercise.type ? 'default' : 'outline'}
                >
                  {icon}
                  <span className="ml-2">{label}</span>
                </Button>
              );
            })}
            <Button onClick={resetAll} variant="destructive">
              <RefreshCw className="w-4 h-4 mr-2" />
              Làm lại
            </Button>
          </div>
        </div>

        {/* Exercise Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Matching Exercise */}
          {currentExerciseType === 'matching' && currentExercise.type === 'matching' && (
            <div>
              <h2 className="text-gray-800 mb-6">{currentExercise.data.title}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h3 className="text-gray-700 mb-4">Tiếng Anh</h3>
                  {currentExercise.data.pairs.map((pair: any) => (
                    <div key={pair.id}>
                      <button
                        onClick={() => handleMatchingClick('left', pair.id)}
                        disabled={matchedPairs.includes(pair.id)}
                        className={`w-full p-4 rounded-xl transition-all text-left ${
                          matchedPairs.includes(pair.id)
                            ? 'bg-green-100 text-green-800 cursor-not-allowed'
                            : selectedLeft === pair.id
                            ? 'bg-blue-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                      >
                        <div>{pair.left}</div>
                        {currentExercise.data.showPronunciation && pair.pronunciation && (
                          <div className="text-sm opacity-70 mt-1">{pair.pronunciation}</div>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h3 className="text-gray-700 mb-4">Tiếng Việt</h3>
                  {matchingRightOrder.map((pair: any) => (
                    <button
                      key={pair.id}
                      onClick={() => handleMatchingClick('right', pair.id)}
                      disabled={matchedPairs.includes(pair.id)}
                      className={`w-full p-4 rounded-xl transition-all text-left ${
                        matchedPairs.includes(pair.id)
                          ? 'bg-green-100 text-green-800 cursor-not-allowed'
                          : selectedRight === pair.id
                          ? 'bg-purple-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      {pair.right}
                    </button>
                  ))}
                </div>
              </div>
              {matchedPairs.length === currentExercise.data.pairs.length && (
                <div className="mt-8 p-6 bg-green-50 rounded-2xl text-center">
                  <Trophy className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-green-800 mb-2">Hoàn thành xuất sắc!</h3>
                  <p className="text-green-700">Bạn đã ghép đúng tất cả các cặp từ!</p>
                </div>
              )}
            </div>
          )}

          {/* Fill in the Blank Exercise */}
          {currentExerciseType === 'fillblank' && currentExercise.type === 'fillblank' && (
            <div>
              <h2 className="text-gray-800 mb-6">{currentExercise.data.title}</h2>
              <div className="space-y-6">
                {currentExercise.data.sentences.map((sentence: any) => (
                  <div key={sentence.id} className="bg-gray-50 rounded-2xl p-6">
                    <p className="text-gray-800 mb-4">{sentence.text}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {sentence.options.map((option: string) => (
                        <button
                          key={option}
                          onClick={() => handleFillBlankSelect(sentence.id, option)}
                          disabled={fillBlankChecked}
                          className={`p-3 rounded-lg transition-all ${
                            fillBlankChecked
                              ? option === sentence.answer
                                ? 'bg-green-500 text-white'
                                : fillBlankAnswers[sentence.id] === option
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                              : fillBlankAnswers[sentence.id] === option
                              ? 'bg-blue-500 text-white'
                              : 'bg-white border-2 border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {!fillBlankChecked && (
                  <Button onClick={checkFillBlank} className="w-full">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Kiểm tra đáp án
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Ordering Exercise */}
          {currentExerciseType === 'ordering' && currentExercise.type === 'ordering' && (
            <div>
              <h2 className="text-gray-800 mb-6">{currentExercise.data.title}</h2>
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h3 className="text-gray-700 mb-4">Câu của bạn:</h3>
                  <div className="min-h-[60px] bg-white rounded-xl p-4 flex flex-wrap gap-2">
                    {orderedWords.length === 0 ? (
                      <p className="text-gray-400">Nhấn vào các từ bên dưới để sắp xếp</p>
                    ) : (
                      orderedWords.map((word, index) => (
                        <button
                          key={index}
                          onClick={() => removeWordFromOrder(index)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          {word}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-gray-700 mb-4">Các từ:</h3>
                  <div className="flex flex-wrap gap-3">
                    {availableWords.map((word, index) => (
                      <button
                        key={index}
                        onClick={() => addWordToOrder(word)}
                        className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>

                {currentExercise.data.sentences && orderedWords.length === currentExercise.data.sentences[currentOrderingSentence].correctOrder.length && (
                  <div className="space-y-3">
                    <Button onClick={checkOrdering} className="w-full">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Kiểm tra câu
                    </Button>
                    <div className="text-center text-gray-600">
                      Câu {currentOrderingSentence + 1}/{currentExercise.data.sentences.length}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Drag and Drop Exercise */}
          {currentExerciseType === 'dragdrop' && currentExercise.type === 'dragdrop' && (
            <div>
              <h2 className="text-gray-800 mb-6">{currentExercise.data.title}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="text-gray-700 mb-4">Các từ:</h3>
                  {remainingItems.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item)}
                      className="p-4 bg-gray-100 rounded-xl cursor-move hover:bg-gray-200 transition-colors"
                    >
                      <div>{item.text}</div>
                      {item.vietnamese && (
                        <div className="text-sm text-gray-600 mt-1">({item.vietnamese})</div>
                      )}
                    </div>
                  ))}
                </div>

                {currentExercise.data.categories.map((category: string, idx: number) => {
                  const colors = [
                    'from-orange-50 to-orange-100 border-orange-300',
                    'from-green-50 to-green-100 border-green-300',
                    'from-purple-50 to-purple-100 border-purple-300'
                  ];
                  const textColors = ['text-orange-800', 'text-green-800', 'text-purple-800'];
                  
                  return (
                    <div
                      key={category}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(category)}
                      className={`bg-gradient-to-br ${colors[idx % colors.length]} rounded-2xl p-6 min-h-[300px] border-2 border-dashed`}
                    >
                      <h3 className={`${textColors[idx % textColors.length]} mb-4`}>
                        📚 {category}
                      </h3>
                      <div className="space-y-2">
                        {(categoryBoxes[category] || []).map((item) => (
                          <div key={item.id} className="p-3 bg-white rounded-lg">
                            <div>{item.text}</div>
                            {item.vietnamese && (
                              <div className="text-sm text-gray-600">({item.vietnamese})</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {remainingItems.length === 0 && (
                <div className="mt-8 p-6 bg-green-50 rounded-2xl text-center">
                  <Trophy className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-green-800 mb-2">Tuyệt vời!</h3>
                  <p className="text-green-700">Bạn đã phân loại đúng tất cả các từ!</p>
                </div>
              )}
            </div>
          )}

          {/* Pronunciation Exercise */}
          {currentExerciseType === 'pronunciation' && currentExercise.type === 'pronunciation' && (
            <div>
              <h2 className="text-gray-800 mb-6">{currentExercise.data.title}</h2>
              <div className="space-y-6">
                {currentExercise.data.items.map((item: any) => (
                  <div key={item.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Volume2 className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="text-gray-800 text-xl">{item.word}</p>
                        <p className="text-sm text-gray-600">({item.meaning})</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">Chọn phiên âm đúng:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {item.options.map((option: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handlePronunciationSelect(item.id, option)}
                          disabled={pronunciationChecked}
                          className={`p-3 rounded-lg transition-all ${
                            pronunciationChecked
                              ? option === item.pronunciation
                                ? 'bg-green-500 text-white'
                                : pronunciationAnswers[item.id] === option
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                              : pronunciationAnswers[item.id] === option
                              ? 'bg-purple-500 text-white'
                              : 'bg-white border-2 border-gray-300 hover:border-purple-500'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {!pronunciationChecked && (
                  <Button onClick={checkPronunciation} className="w-full">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Kiểm tra đáp án
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Synonym Exercise */}
          {currentExerciseType === 'synonym' && currentExercise.type === 'synonym' && (
            <div>
              <h2 className="text-gray-800 mb-6">{currentExercise.data.title}</h2>
              <div className="space-y-6">
                {currentExercise.data.questions.map((question: any) => (
                  <div key={question.id} className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Brain className="w-6 h-6 text-indigo-600" />
                      <div>
                        <p className="text-gray-800 text-xl">"{question.word}"</p>
                        <p className="text-sm text-gray-600 uppercase">{question.type === 'synonym' ? 'Từ đồng nghĩa' : 'Từ trái nghĩa'}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{question.question}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {question.options.map((option: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handleSynonymSelect(question.id, option)}
                          disabled={synonymChecked}
                          className={`p-3 rounded-lg transition-all ${
                            synonymChecked
                              ? option === question.correctAnswer
                                ? 'bg-green-500 text-white'
                                : synonymAnswers[question.id] === option
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                              : synonymAnswers[question.id] === option
                              ? 'bg-indigo-500 text-white'
                              : 'bg-white border-2 border-gray-300 hover:border-indigo-500'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {!synonymChecked && (
                  <Button onClick={checkSynonym} className="w-full">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Kiểm tra đáp án
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}