import { Lesson, Vocabulary, Grammar } from './allLessons';

export interface GeneratedExercise {
  type: 'matching' | 'fillblank' | 'ordering' | 'dragdrop' | 'pronunciation' | 'synonym';
  difficulty: 'easy' | 'medium' | 'hard';
  data: any;
}

// Generate exercises based on lesson grade and content
export function generateExercisesForLesson(lesson: Lesson): GeneratedExercise[] {
  const exercises: GeneratedExercise[] = [];
  
  // Add matching exercises (vocabulary) - 30 pairs
  exercises.push(generateMatchingExercise(lesson));
  
  // Add fill blank exercises (grammar focused) - 30 sentences
  exercises.push(generateFillBlankExercise(lesson));
  
  // Add ordering exercise (sentence structure) - 30 sentences
  exercises.push(generateOrderingExercise(lesson));
  
  // Add drag and drop exercise (categorization) - 30 items
  exercises.push(generateDragDropExercise(lesson));
  
  // Add pronunciation exercise for grades 6-7 - 30 words
  if (lesson.grade <= 7) {
    exercises.push(generatePronunciationExercise(lesson));
  }
  
  // Add synonym/antonym exercise for grades 8-9 - 30 questions
  if (lesson.grade >= 8) {
    exercises.push(generateSynonymExercise(lesson));
  }
  
  return exercises;
}

// MATCHING EXERCISE - Vocabulary matching (all grades) - 30 PAIRS
function generateMatchingExercise(lesson: Lesson): GeneratedExercise {
  const vocab = lesson.vocabulary; // Use all 30 vocabulary words
  
  const pairs = vocab.map((v, idx) => ({
    id: idx + 1,
    left: v.word,
    right: v.meaning,
    pronunciation: v.pronunciation
  }));
  
  return {
    type: 'matching',
    difficulty: lesson.grade <= 6 ? 'easy' : lesson.grade <= 8 ? 'medium' : 'hard',
    data: {
      pairs,
      title: `Ghép từ tiếng Anh với nghĩa tiếng Việt - ${lesson.title}`,
      showPronunciation: lesson.grade <= 7 // Show pronunciation for lower grades
    }
  };
}

// FILL BLANK EXERCISE - Grammar focused with grade-appropriate complexity - 30 SENTENCES
function generateFillBlankExercise(lesson: Lesson): GeneratedExercise {
  const sentences: any[] = [];
  const vocab = lesson.vocabulary;
  
  // Generate 30 sentences based on grade level
  if (lesson.grade === 6) {
    // Grade 6: Simple present, present continuous (30 sentences)
    for (let i = 0; i < 30; i++) {
      const vocabWord = vocab[i % vocab.length]?.word || 'study';
      if (i < 10) {
        // Present simple
        sentences.push({
          id: i + 1,
          text: getGrade6Sentence(i, vocabWord),
          answer: getGrade6Answer(i),
          options: getGrade6Options(i)
        });
      } else if (i < 20) {
        // Present continuous
        sentences.push({
          id: i + 1,
          text: getGrade6ContinuousSentence(i - 10, vocabWord),
          answer: getGrade6ContinuousAnswer(i - 10),
          options: getGrade6ContinuousOptions(i - 10)
        });
      } else {
        // Mixed review
        sentences.push({
          id: i + 1,
          text: getGrade6MixedSentence(i - 20, vocabWord),
          answer: getGrade6MixedAnswer(i - 20),
          options: getGrade6MixedOptions(i - 20)
        });
      }
    }
  } else if (lesson.grade === 7) {
    // Grade 7: Past simple, past continuous, present perfect (30 sentences)
    for (let i = 0; i < 30; i++) {
      const vocabWord = vocab[i % vocab.length]?.word || 'book';
      if (i < 10) {
        sentences.push({
          id: i + 1,
          text: getGrade7PastSentence(i, vocabWord),
          answer: getGrade7PastAnswer(i),
          options: getGrade7PastOptions(i)
        });
      } else if (i < 20) {
        sentences.push({
          id: i + 1,
          text: getGrade7ContinuousSentence(i - 10, vocabWord),
          answer: getGrade7ContinuousAnswer(i - 10),
          options: getGrade7ContinuousOptions(i - 10)
        });
      } else {
        sentences.push({
          id: i + 1,
          text: getGrade7PerfectSentence(i - 20, vocabWord),
          answer: getGrade7PerfectAnswer(i - 20),
          options: getGrade7PerfectOptions(i - 20)
        });
      }
    }
  } else if (lesson.grade === 8) {
    // Grade 8: Present perfect, modal verbs, passive voice (30 sentences)
    for (let i = 0; i < 30; i++) {
      if (i < 10) {
        sentences.push({
          id: i + 1,
          text: getGrade8PerfectSentence(i),
          answer: getGrade8PerfectAnswer(i),
          options: getGrade8PerfectOptions(i)
        });
      } else if (i < 20) {
        sentences.push({
          id: i + 1,
          text: getGrade8ModalSentence(i - 10),
          answer: getGrade8ModalAnswer(i - 10),
          options: getGrade8ModalOptions(i - 10)
        });
      } else {
        sentences.push({
          id: i + 1,
          text: getGrade8PassiveSentence(i - 20),
          answer: getGrade8PassiveAnswer(i - 20),
          options: getGrade8PassiveOptions(i - 20)
        });
      }
    }
  } else {
    // Grade 9: Conditional, passive voice, complex structures (30 sentences)
    for (let i = 0; i < 30; i++) {
      if (i < 10) {
        sentences.push({
          id: i + 1,
          text: getGrade9ConditionalSentence(i),
          answer: getGrade9ConditionalAnswer(i),
          options: getGrade9ConditionalOptions(i)
        });
      } else if (i < 20) {
        sentences.push({
          id: i + 1,
          text: getGrade9PassiveSentence(i - 10),
          answer: getGrade9PassiveAnswer(i - 10),
          options: getGrade9PassiveOptions(i - 10)
        });
      } else {
        sentences.push({
          id: i + 1,
          text: getGrade9ReportedSentence(i - 20),
          answer: getGrade9ReportedAnswer(i - 20),
          options: getGrade9ReportedOptions(i - 20)
        });
      }
    }
  }
  
  return {
    type: 'fillblank',
    difficulty: lesson.grade <= 6 ? 'easy' : lesson.grade <= 8 ? 'medium' : 'hard',
    data: {
      sentences,
      title: `Chọn từ đúng để điền vào chỗ trống - Lớp ${lesson.grade} (30 câu)`
    }
  };
}

// ORDERING EXERCISE - Sentence structure based on grade - 30 SENTENCES
function generateOrderingExercise(lesson: Lesson): GeneratedExercise {
  const sentences: { id: number, words: string[], correctOrder: string[] }[] = [];
  
  // Generate 30 sentences for each grade
  for (let i = 0; i < 30; i++) {
    const sentence = getOrderingSentence(lesson.grade, i);
    sentences.push({
      id: i + 1,
      ...sentence
    });
  }
  
  return {
    type: 'ordering',
    difficulty: lesson.grade <= 6 ? 'easy' : lesson.grade <= 8 ? 'medium' : 'hard',
    data: {
      sentences,
      title: `Sắp xếp các từ thành câu đúng - Lớp ${lesson.grade} (30 câu)`
    }
  };
}

// DRAG DROP EXERCISE - Word categorization based on topics - 30 ITEMS
function generateDragDropExercise(lesson: Lesson): GeneratedExercise {
  let items: any[];
  let categories: string[];
  
  if (lesson.grade === 6) {
    // Simple categories for Grade 6 - 30 items
    categories = ['School Items', 'Colors', 'Numbers'];
    items = [
      // School Items (10)
      { id: 1, text: 'pencil', category: 'School Items', vietnamese: 'bút chì' },
      { id: 2, text: 'notebook', category: 'School Items', vietnamese: 'vở' },
      { id: 3, text: 'ruler', category: 'School Items', vietnamese: 'thước kẻ' },
      { id: 4, text: 'eraser', category: 'School Items', vietnamese: 'tẩy' },
      { id: 5, text: 'pen', category: 'School Items', vietnamese: 'bút mực' },
      { id: 6, text: 'book', category: 'School Items', vietnamese: 'sách' },
      { id: 7, text: 'bag', category: 'School Items', vietnamese: 'cặp' },
      { id: 8, text: 'calculator', category: 'School Items', vietnamese: 'máy tính' },
      { id: 9, text: 'scissors', category: 'School Items', vietnamese: 'kéo' },
      { id: 10, text: 'compass', category: 'School Items', vietnamese: 'compa' },
      // Colors (10)
      { id: 11, text: 'red', category: 'Colors', vietnamese: 'màu đỏ' },
      { id: 12, text: 'blue', category: 'Colors', vietnamese: 'màu xanh dương' },
      { id: 13, text: 'green', category: 'Colors', vietnamese: 'màu xanh lá' },
      { id: 14, text: 'yellow', category: 'Colors', vietnamese: 'màu vàng' },
      { id: 15, text: 'orange', category: 'Colors', vietnamese: 'màu cam' },
      { id: 16, text: 'purple', category: 'Colors', vietnamese: 'màu tím' },
      { id: 17, text: 'pink', category: 'Colors', vietnamese: 'màu hồng' },
      { id: 18, text: 'black', category: 'Colors', vietnamese: 'màu đen' },
      { id: 19, text: 'white', category: 'Colors', vietnamese: 'màu trắng' },
      { id: 20, text: 'brown', category: 'Colors', vietnamese: 'màu nâu' },
      // Numbers (10)
      { id: 21, text: 'one', category: 'Numbers', vietnamese: 'số một' },
      { id: 22, text: 'two', category: 'Numbers', vietnamese: 'số hai' },
      { id: 23, text: 'three', category: 'Numbers', vietnamese: 'số ba' },
      { id: 24, text: 'four', category: 'Numbers', vietnamese: 'số bốn' },
      { id: 25, text: 'five', category: 'Numbers', vietnamese: 'số năm' },
      { id: 26, text: 'six', category: 'Numbers', vietnamese: 'số sáu' },
      { id: 27, text: 'seven', category: 'Numbers', vietnamese: 'số bảy' },
      { id: 28, text: 'eight', category: 'Numbers', vietnamese: 'số tám' },
      { id: 29, text: 'nine', category: 'Numbers', vietnamese: 'số chín' },
      { id: 30, text: 'ten', category: 'Numbers', vietnamese: 'số mười' }
    ];
  } else if (lesson.grade === 7) {
    // More complex categories for Grade 7 - 30 items
    categories = ['Verbs', 'Nouns', 'Adjectives'];
    items = [
      // Verbs (10)
      { id: 1, text: 'study', category: 'Verbs', vietnamese: 'học' },
      { id: 2, text: 'write', category: 'Verbs', vietnamese: 'viết' },
      { id: 3, text: 'learn', category: 'Verbs', vietnamese: 'học tập' },
      { id: 4, text: 'read', category: 'Verbs', vietnamese: 'đọc' },
      { id: 5, text: 'play', category: 'Verbs', vietnamese: 'chơi' },
      { id: 6, text: 'run', category: 'Verbs', vietnamese: 'chạy' },
      { id: 7, text: 'swim', category: 'Verbs', vietnamese: 'bơi' },
      { id: 8, text: 'sing', category: 'Verbs', vietnamese: 'hát' },
      { id: 9, text: 'dance', category: 'Verbs', vietnamese: 'nhảy' },
      { id: 10, text: 'cook', category: 'Verbs', vietnamese: 'nấu ăn' },
      // Nouns (10)
      { id: 11, text: 'teacher', category: 'Nouns', vietnamese: 'giáo viên' },
      { id: 12, text: 'student', category: 'Nouns', vietnamese: 'học sinh' },
      { id: 13, text: 'classroom', category: 'Nouns', vietnamese: 'lớp học' },
      { id: 14, text: 'library', category: 'Nouns', vietnamese: 'thư viện' },
      { id: 15, text: 'computer', category: 'Nouns', vietnamese: 'máy tính' },
      { id: 16, text: 'phone', category: 'Nouns', vietnamese: 'điện thoại' },
      { id: 17, text: 'house', category: 'Nouns', vietnamese: 'nhà' },
      { id: 18, text: 'car', category: 'Nouns', vietnamese: 'xe hơi' },
      { id: 19, text: 'bicycle', category: 'Nouns', vietnamese: 'xe đạp' },
      { id: 20, text: 'airport', category: 'Nouns', vietnamese: 'sân bay' },
      // Adjectives (10)
      { id: 21, text: 'happy', category: 'Adjectives', vietnamese: 'vui vẻ' },
      { id: 22, text: 'sad', category: 'Adjectives', vietnamese: 'buồn' },
      { id: 23, text: 'big', category: 'Adjectives', vietnamese: 'to, lớn' },
      { id: 24, text: 'small', category: 'Adjectives', vietnamese: 'nhỏ' },
      { id: 25, text: 'beautiful', category: 'Adjectives', vietnamese: 'đẹp' },
      { id: 26, text: 'ugly', category: 'Adjectives', vietnamese: 'xấu' },
      { id: 27, text: 'fast', category: 'Adjectives', vietnamese: 'nhanh' },
      { id: 28, text: 'slow', category: 'Adjectives', vietnamese: 'chậm' },
      { id: 29, text: 'hot', category: 'Adjectives', vietnamese: 'nóng' },
      { id: 30, text: 'cold', category: 'Adjectives', vietnamese: 'lạnh' }
    ];
  } else if (lesson.grade === 8) {
    // Topic-based categories for Grade 8 - 30 items
    categories = ['Technology', 'Environment', 'Health'];
    items = [
      // Technology (10)
      { id: 1, text: 'computer', category: 'Technology', vietnamese: 'máy tính' },
      { id: 2, text: 'smartphone', category: 'Technology', vietnamese: 'điện thoại thông minh' },
      { id: 3, text: 'internet', category: 'Technology', vietnamese: 'internet' },
      { id: 4, text: 'robot', category: 'Technology', vietnamese: 'người máy' },
      { id: 5, text: 'software', category: 'Technology', vietnamese: 'phần mềm' },
      { id: 6, text: 'hardware', category: 'Technology', vietnamese: 'phần cứng' },
      { id: 7, text: 'website', category: 'Technology', vietnamese: 'trang web' },
      { id: 8, text: 'application', category: 'Technology', vietnamese: 'ứng dụng' },
      { id: 9, text: 'tablet', category: 'Technology', vietnamese: 'máy tính bảng' },
      { id: 10, text: 'laptop', category: 'Technology', vietnamese: 'máy tính xách tay' },
      // Environment (10)
      { id: 11, text: 'pollution', category: 'Environment', vietnamese: 'ô nhiễm' },
      { id: 12, text: 'recycling', category: 'Environment', vietnamese: 'tái chế' },
      { id: 13, text: 'forest', category: 'Environment', vietnamese: 'rừng' },
      { id: 14, text: 'ocean', category: 'Environment', vietnamese: 'đại dương' },
      { id: 15, text: 'climate', category: 'Environment', vietnamese: 'khí hậu' },
      { id: 16, text: 'wildlife', category: 'Environment', vietnamese: 'động vật hoang dã' },
      { id: 17, text: 'conservation', category: 'Environment', vietnamese: 'bảo tồn' },
      { id: 18, text: 'renewable', category: 'Environment', vietnamese: 'tái tạo' },
      { id: 19, text: 'sustainable', category: 'Environment', vietnamese: 'bền vững' },
      { id: 20, text: 'ecosystem', category: 'Environment', vietnamese: 'hệ sinh thái' },
      // Health (10)
      { id: 21, text: 'exercise', category: 'Health', vietnamese: 'tập thể dục' },
      { id: 22, text: 'nutrition', category: 'Health', vietnamese: 'dinh dưỡng' },
      { id: 23, text: 'vitamin', category: 'Health', vietnamese: 'vitamin' },
      { id: 24, text: 'medicine', category: 'Health', vietnamese: 'thuốc' },
      { id: 25, text: 'hospital', category: 'Health', vietnamese: 'bệnh viện' },
      { id: 26, text: 'doctor', category: 'Health', vietnamese: 'bác sĩ' },
      { id: 27, text: 'fitness', category: 'Health', vietnamese: 'thể lực' },
      { id: 28, text: 'diet', category: 'Health', vietnamese: 'chế độ ăn' },
      { id: 29, text: 'wellness', category: 'Health', vietnamese: 'sức khỏe tốt' },
      { id: 30, text: 'therapy', category: 'Health', vietnamese: 'liệu pháp' }
    ];
  } else {
    // Abstract categories for Grade 9 - 30 items
    categories = ['Formal Language', 'Informal Language', 'Academic'];
    items = [
      // Formal (10)
      { id: 1, text: 'commence', category: 'Formal Language', vietnamese: 'bắt đầu (trang trọng)' },
      { id: 2, text: 'purchase', category: 'Formal Language', vietnamese: 'mua (trang trọng)' },
      { id: 3, text: 'assist', category: 'Formal Language', vietnamese: 'giúp đỡ (trang trọng)' },
      { id: 4, text: 'inquire', category: 'Formal Language', vietnamese: 'hỏi (trang trọng)' },
      { id: 5, text: 'terminate', category: 'Formal Language', vietnamese: 'kết thúc (trang trọng)' },
      { id: 6, text: 'obtain', category: 'Formal Language', vietnamese: 'đạt được (trang trọng)' },
      { id: 7, text: 'provide', category: 'Formal Language', vietnamese: 'cung cấp (trang trọng)' },
      { id: 8, text: 'utilize', category: 'Formal Language', vietnamese: 'sử dụng (trang trọng)' },
      { id: 9, text: 'require', category: 'Formal Language', vietnamese: 'yêu cầu (trang trọng)' },
      { id: 10, text: 'demonstrate', category: 'Formal Language', vietnamese: 'chứng minh (trang trọng)' },
      // Informal (10)
      { id: 11, text: 'start', category: 'Informal Language', vietnamese: 'bắt đầu' },
      { id: 12, text: 'buy', category: 'Informal Language', vietnamese: 'mua' },
      { id: 13, text: 'help', category: 'Informal Language', vietnamese: 'giúp đỡ' },
      { id: 14, text: 'ask', category: 'Informal Language', vietnamese: 'hỏi' },
      { id: 15, text: 'end', category: 'Informal Language', vietnamese: 'kết thúc' },
      { id: 16, text: 'get', category: 'Informal Language', vietnamese: 'đạt được' },
      { id: 17, text: 'give', category: 'Informal Language', vietnamese: 'cho' },
      { id: 18, text: 'use', category: 'Informal Language', vietnamese: 'dùng' },
      { id: 19, text: 'need', category: 'Informal Language', vietnamese: 'cần' },
      { id: 20, text: 'show', category: 'Informal Language', vietnamese: 'cho thấy' },
      // Academic (10)
      { id: 21, text: 'analyze', category: 'Academic', vietnamese: 'phân tích' },
      { id: 22, text: 'evaluate', category: 'Academic', vietnamese: 'đánh giá' },
      { id: 23, text: 'synthesize', category: 'Academic', vietnamese: 'tổng hợp' },
      { id: 24, text: 'hypothesis', category: 'Academic', vietnamese: 'giả thuyết' },
      { id: 25, text: 'research', category: 'Academic', vietnamese: 'nghiên cứu' },
      { id: 26, text: 'evidence', category: 'Academic', vietnamese: 'bằng chứng' },
      { id: 27, text: 'conclude', category: 'Academic', vietnamese: 'kết luận' },
      { id: 28, text: 'theory', category: 'Academic', vietnamese: 'lý thuyết' },
      { id: 29, text: 'experiment', category: 'Academic', vietnamese: 'thí nghiệm' },
      { id: 30, text: 'methodology', category: 'Academic', vietnamese: 'phương pháp luận' }
    ];
  }
  
  return {
    type: 'dragdrop',
    difficulty: lesson.grade <= 6 ? 'easy' : lesson.grade <= 8 ? 'medium' : 'hard',
    data: {
      items,
      categories,
      title: `Phân loại từ vào đúng nh��m - Lớp ${lesson.grade} (30 từ)`
    }
  };
}

// PRONUNCIATION EXERCISE - For grades 6-7 (phonics and sounds) - 30 WORDS
function generatePronunciationExercise(lesson: Lesson): GeneratedExercise {
  const vocab = lesson.vocabulary; // Use all 30 vocabulary words
  
  const items = vocab.map((v, idx) => ({
    id: idx + 1,
    word: v.word,
    pronunciation: v.pronunciation,
    meaning: v.meaning,
    // Create similar sounding words as distractors
    options: [
      v.pronunciation,
      v.pronunciation.replace(/ə/, 'æ'),
      v.pronunciation.replace(/iː/, 'ɪ'),
      v.pronunciation.replace(/aɪ/, 'eɪ')
    ].filter((item, index, self) => self.indexOf(item) === index).slice(0, 4)
  }));
  
  return {
    type: 'pronunciation',
    difficulty: 'easy',
    data: {
      items,
      title: `Chọn phiên âm đúng của từ - Lớp ${lesson.grade} (30 từ)`
    }
  };
}

// SYNONYM/ANTONYM EXERCISE - For grades 8-9 (advanced vocabulary) - 30 QUESTIONS
function generateSynonymExercise(lesson: Lesson): GeneratedExercise {
  let questions: any[] = [];
  
  if (lesson.grade === 8) {
    // Grade 8 - 30 questions
    const synonymPairs = [
      { word: 'happy', synonym: 'joyful', options: ['sad', 'joyful', 'angry', 'tired'] },
      { word: 'beautiful', synonym: 'pretty', options: ['ugly', 'pretty', 'bad', 'dark'] },
      { word: 'big', synonym: 'large', options: ['small', 'tiny', 'large', 'little'] },
      { word: 'smart', synonym: 'intelligent', options: ['stupid', 'intelligent', 'dumb', 'foolish'] },
      { word: 'quick', synonym: 'fast', options: ['slow', 'fast', 'lazy', 'tired'] },
      { word: 'angry', synonym: 'mad', options: ['happy', 'mad', 'joyful', 'pleased'] },
      { word: 'sad', synonym: 'unhappy', options: ['joyful', 'happy', 'unhappy', 'glad'] },
      { word: 'tiny', synonym: 'small', options: ['big', 'huge', 'small', 'large'] },
      { word: 'strong', synonym: 'powerful', options: ['weak', 'powerful', 'feeble', 'frail'] },
      { word: 'brave', synonym: 'courageous', options: ['scared', 'afraid', 'courageous', 'timid'] },
      { word: 'difficult', synonym: 'hard', options: ['easy', 'simple', 'hard', 'basic'] },
      { word: 'funny', synonym: 'amusing', options: ['boring', 'dull', 'amusing', 'serious'] },
      { word: 'kind', synonym: 'nice', options: ['mean', 'cruel', 'nice', 'harsh'] },
      { word: 'old', synonym: 'ancient', options: ['new', 'young', 'ancient', 'modern'] },
      { word: 'wonderful', synonym: 'amazing', options: ['terrible', 'awful', 'amazing', 'bad'] }
    ];
    
    const antonymPairs = [
      { word: 'difficult', antonym: 'easy', options: ['hard', 'easy', 'complex', 'tough'] },
      { word: 'hot', antonym: 'cold', options: ['warm', 'cold', 'boiling', 'heated'] },
      { word: 'tall', antonym: 'short', options: ['high', 'short', 'big', 'huge'] },
      { word: 'clean', antonym: 'dirty', options: ['pure', 'neat', 'dirty', 'tidy'] },
      { word: 'rich', antonym: 'poor', options: ['wealthy', 'poor', 'affluent', 'prosperous'] },
      { word: 'thick', antonym: 'thin', options: ['fat', 'thin', 'wide', 'broad'] },
      { word: 'loud', antonym: 'quiet', options: ['noisy', 'quiet', 'deafening', 'booming'] },
      { word: 'full', antonym: 'empty', options: ['filled', 'packed', 'empty', 'complete'] },
      { word: 'early', antonym: 'late', options: ['soon', 'late', 'prompt', 'timely'] },
      { word: 'bright', antonym: 'dark', options: ['light', 'shiny', 'dark', 'brilliant'] },
      { word: 'safe', antonym: 'dangerous', options: ['secure', 'dangerous', 'protected', 'guarded'] },
      { word: 'wide', antonym: 'narrow', options: ['broad', 'narrow', 'vast', 'spacious'] },
      { word: 'deep', antonym: 'shallow', options: ['profound', 'shallow', 'bottomless', 'far'] },
      { word: 'soft', antonym: 'hard', options: ['gentle', 'hard', 'smooth', 'tender'] },
      { word: 'fresh', antonym: 'stale', options: ['new', 'stale', 'crisp', 'recent'] }
    ];
    
    // Add synonyms (15 questions)
    synonymPairs.forEach((pair, idx) => {
      questions.push({
        id: idx + 1,
        type: 'synonym',
        word: pair.word,
        question: `Which word is a SYNONYM of "${pair.word}"?`,
        options: pair.options,
        correctAnswer: pair.synonym
      });
    });
    
    // Add antonyms (15 questions)
    antonymPairs.forEach((pair, idx) => {
      questions.push({
        id: idx + 16,
        type: 'antonym',
        word: pair.word,
        question: `Which word is an ANTONYM of "${pair.word}"?`,
        options: pair.options,
        correctAnswer: pair.antonym
      });
    });
  } else {
    // Grade 9 - more advanced (30 questions)
    const synonymPairs = [
      { word: 'abundant', synonym: 'plentiful', options: ['scarce', 'plentiful', 'rare', 'limited'] },
      { word: 'significant', synonym: 'important', options: ['minor', 'important', 'trivial', 'small'] },
      { word: 'adequate', synonym: 'sufficient', options: ['insufficient', 'sufficient', 'lacking', 'short'] },
      { word: 'crucial', synonym: 'vital', options: ['unimportant', 'vital', 'trivial', 'minor'] },
      { word: 'evident', synonym: 'obvious', options: ['hidden', 'obvious', 'unclear', 'vague'] },
      { word: 'fundamental', synonym: 'basic', options: ['advanced', 'basic', 'complex', 'detailed'] },
      { word: 'genuine', synonym: 'authentic', options: ['fake', 'authentic', 'false', 'counterfeit'] },
      { word: 'hostile', synonym: 'unfriendly', options: ['friendly', 'kind', 'unfriendly', 'warm'] },
      { word: 'immense', synonym: 'huge', options: ['tiny', 'small', 'huge', 'little'] },
      { word: 'justify', synonym: 'explain', options: ['confuse', 'explain', 'hide', 'conceal'] },
      { word: 'keen', synonym: 'eager', options: ['reluctant', 'unwilling', 'eager', 'hesitant'] },
      { word: 'lucid', synonym: 'clear', options: ['unclear', 'vague', 'clear', 'confusing'] },
      { word: 'meticulous', synonym: 'careful', options: ['careless', 'careful', 'sloppy', 'messy'] },
      { word: 'notable', synonym: 'remarkable', options: ['ordinary', 'remarkable', 'common', 'typical'] },
      { word: 'obscure', synonym: 'unclear', options: ['clear', 'obvious', 'unclear', 'evident'] }
    ];
    
    const antonymPairs = [
      { word: 'ancient', antonym: 'modern', options: ['old', 'modern', 'historic', 'traditional'] },
      { word: 'complex', antonym: 'simple', options: ['complicated', 'simple', 'intricate', 'difficult'] },
      { word: 'defend', antonym: 'attack', options: ['protect', 'guard', 'attack', 'shield'] },
      { word: 'expand', antonym: 'contract', options: ['grow', 'contract', 'increase', 'enlarge'] },
      { word: 'flexible', antonym: 'rigid', options: ['elastic', 'rigid', 'bendable', 'adaptable'] },
      { word: 'generous', antonym: 'selfish', options: ['giving', 'selfish', 'kind', 'charitable'] },
      { word: 'harmony', antonym: 'conflict', options: ['peace', 'conflict', 'agreement', 'unity'] },
      { word: 'inferior', antonym: 'superior', options: ['lower', 'worse', 'superior', 'poor'] },
      { word: 'gradual', antonym: 'sudden', options: ['slow', 'sudden', 'steady', 'progressive'] },
      { word: 'optimistic', antonym: 'pessimistic', options: ['hopeful', 'pessimistic', 'positive', 'confident'] },
      { word: 'permanent', antonym: 'temporary', options: ['lasting', 'temporary', 'eternal', 'endless'] },
      { word: 'praise', antonym: 'criticize', options: ['compliment', 'criticize', 'admire', 'applaud'] },
      { word: 'reject', antonym: 'accept', options: ['refuse', 'accept', 'deny', 'decline'] },
      { word: 'scarce', antonym: 'abundant', options: ['rare', 'abundant', 'limited', 'few'] },
      { word: 'transparent', antonym: 'opaque', options: ['clear', 'opaque', 'see-through', 'visible'] }
    ];
    
    // Add synonyms (15 questions)
    synonymPairs.forEach((pair, idx) => {
      questions.push({
        id: idx + 1,
        type: 'synonym',
        word: pair.word,
        question: `Which word is a SYNONYM of "${pair.word}"?`,
        options: pair.options,
        correctAnswer: pair.synonym
      });
    });
    
    // Add antonyms (15 questions)
    antonymPairs.forEach((pair, idx) => {
      questions.push({
        id: idx + 16,
        type: 'antonym',
        word: pair.word,
        question: `Which word is an ANTONYM of "${pair.word}"?`,
        options: pair.options,
        correctAnswer: pair.antonym
      });
    });
  }
  
  return {
    type: 'synonym',
    difficulty: lesson.grade === 8 ? 'medium' : 'hard',
    data: {
      questions,
      title: `Từ đồng nghĩa và trái nghĩa - Lớp ${lesson.grade} (30 câu)`
    }
  };
}

// Helper functions for Grade 6 Fill Blank
function getGrade6Sentence(idx: number, vocab: string): string {
  const sentences = [
    `I ___ ${vocab} every day.`,
    `She ___ to school by bus.`,
    `They ___ Math on Monday.`,
    `He ___ breakfast at 7 AM.`,
    `We ___ our grandparents on weekends.`,
    `My brother ___ video games.`,
    `The sun ___ in the east.`,
    `Cats ___ milk.`,
    `My teacher ___ English.`,
    `Students ___ uniforms.`
  ];
  return sentences[idx % sentences.length];
}

function getGrade6Answer(idx: number): string {
  const answers = ['use', 'goes', 'have', 'eats', 'visit', 'plays', 'rises', 'drink', 'teaches', 'wear'];
  return answers[idx % answers.length];
}

function getGrade6Options(idx: number): string[] {
  const options = [
    ['use', 'uses', 'using', 'used'],
    ['go', 'goes', 'going', 'went'],
    ['have', 'has', 'having', 'had'],
    ['eat', 'eats', 'eating', 'ate'],
    ['visit', 'visits', 'visiting', 'visited'],
    ['play', 'plays', 'playing', 'played'],
    ['rise', 'rises', 'rising', 'rose'],
    ['drink', 'drinks', 'drinking', 'drank'],
    ['teach', 'teaches', 'teaching', 'taught'],
    ['wear', 'wears', 'wearing', 'wore']
  ];
  return options[idx % options.length];
}

function getGrade6ContinuousSentence(idx: number, vocab: string): string {
  const sentences = [
    `I ___ studying now.`,
    `She ___ reading a book.`,
    `They ___ playing football.`,
    `He ___ watching TV.`,
    `We ___ doing homework.`,
    `My sister ___ cooking dinner.`,
    `The children ___ singing.`,
    `You ___ learning English.`,
    `Tom ___ listening to music.`,
    `The students ___ working hard.`
  ];
  return sentences[idx % sentences.length];
}

function getGrade6ContinuousAnswer(idx: number): string {
  const answers = ['am', 'is', 'are', 'is', 'are', 'is', 'are', 'are', 'is', 'are'];
  return answers[idx % answers.length];
}

function getGrade6ContinuousOptions(idx: number): string[] {
  const options = [
    ['am', 'is', 'are', 'be'],
    ['am', 'is', 'are', 'be'],
    ['am', 'is', 'are', 'be'],
    ['am', 'is', 'are', 'be'],
    ['am', 'is', 'are', 'be'],
    ['am', 'is', 'are', 'be'],
    ['am', 'is', 'are', 'be'],
    ['am', 'is', 'are', 'be'],
    ['am', 'is', 'are', 'be'],
    ['am', 'is', 'are', 'be']
  ];
  return options[idx % options.length];
}

function getGrade6MixedSentence(idx: number, vocab: string): string {
  const sentences = [
    `My mom ___ cooking right now.`,
    `I ___ to school every day.`,
    `They ___ playing games at the moment.`,
    `She ___ her homework after school.`,
    `We ___ studying for the test now.`,
    `He ___ soccer on Sundays.`,
    `The cat ___ sleeping on the sofa.`,
    `Birds ___ in the trees.`,
    `My dad ___ working in the office.`,
    `Children ___ cartoons on TV.`
  ];
  return sentences[idx % sentences.length];
}

function getGrade6MixedAnswer(idx: number): string {
  const answers = ['is', 'go', 'are', 'does', 'are', 'plays', 'is', 'sing', 'is', 'watch'];
  return answers[idx % answers.length];
}

function getGrade6MixedOptions(idx: number): string[] {
  const options = [
    ['am', 'is', 'are', 'be'],
    ['go', 'goes', 'going', 'went'],
    ['is', 'am', 'are', 'be'],
    ['do', 'does', 'doing', 'did'],
    ['am', 'is', 'are', 'be'],
    ['play', 'plays', 'playing', 'played'],
    ['am', 'is', 'are', 'be'],
    ['sing', 'sings', 'singing', 'sang'],
    ['am', 'is', 'are', 'be'],
    ['watch', 'watches', 'watching', 'watched']
  ];
  return options[idx % options.length];
}

// Similar helper functions for Grade 7, 8, 9...
function getGrade7PastSentence(idx: number, vocab: string): string {
  const sentences = [
    `Yesterday, I ___ a new ${vocab}.`,
    `Last week, she ___ her friend.`,
    `We ___ to the beach last summer.`,
    `They ___ dinner at 7 PM.`,
    `He ___ soccer yesterday.`,
    `I ___ my homework last night.`,
    `She ___ to the market this morning.`,
    `We ___ a movie last weekend.`,
    `They ___ English last year.`,
    `My father ___ a car last month.`
  ];
  return sentences[idx % sentences.length];
}

function getGrade7PastAnswer(idx: number): string {
  const answers = ['bought', 'visited', 'went', 'had', 'played', 'did', 'went', 'watched', 'studied', 'bought'];
  return answers[idx % answers.length];
}

function getGrade7PastOptions(idx: number): string[] {
  const options = [
    ['buy', 'bought', 'buying', 'will buy'],
    ['visit', 'visited', 'visiting', 'will visit'],
    ['go', 'went', 'going', 'will go'],
    ['have', 'had', 'having', 'will have'],
    ['play', 'played', 'playing', 'will play'],
    ['do', 'did', 'doing', 'will do'],
    ['go', 'went', 'going', 'will go'],
    ['watch', 'watched', 'watching', 'will watch'],
    ['study', 'studied', 'studying', 'will study'],
    ['buy', 'bought', 'buying', 'will buy']
  ];
  return options[idx % options.length];
}

function getGrade7ContinuousSentence(idx: number, vocab: string): string {
  const sentences = [
    `While I ___ TV, my mom came home.`,
    `She ___ studying when I called.`,
    `They ___ football when it rained.`,
    `We ___ dinner at 7 PM yesterday.`,
    `He ___ his homework at that time.`,
    `I ___ to music all evening.`,
    `The children ___ in the park.`,
    `You ___ sleeping when I arrived.`,
    `My sister ___ a book last night.`,
    `The students ___ hard for the test.`
  ];
  return sentences[idx % sentences.length];
}

function getGrade7ContinuousAnswer(idx: number): string {
  const answers = ['was watching', 'was studying', 'were playing', 'were having', 'was doing', 'was listening', 'were playing', 'were sleeping', 'was reading', 'were working'];
  return answers[idx % answers.length];
}

function getGrade7ContinuousOptions(idx: number): string[] {
  const options = [
    ['watch', 'watched', 'was watching', 'am watching'],
    ['study', 'studied', 'was studying', 'am studying'],
    ['play', 'played', 'were playing', 'are playing'],
    ['have', 'had', 'were having', 'are having'],
    ['do', 'did', 'was doing', 'am doing'],
    ['listen', 'listened', 'was listening', 'am listening'],
    ['play', 'played', 'were playing', 'are playing'],
    ['sleep', 'slept', 'were sleeping', 'are sleeping'],
    ['read', 'read', 'was reading', 'am reading'],
    ['work', 'worked', 'were working', 'are working']
  ];
  return options[idx % options.length];
}

function getGrade7PerfectSentence(idx: number, vocab: string): string {
  const sentences = [
    `She ___ English for three years.`,
    `I ___ this movie before.`,
    `They ___ in this city since 2020.`,
    `We ___ each other for a long time.`,
    `He ___ his homework already.`,
    `You ___ to Paris, right?`,
    `My parents ___ married for 20 years.`,
    `The students ___ this topic before.`,
    `I ___ breakfast yet.`,
    `She ___ her keys somewhere.`
  ];
  return sentences[idx % sentences.length];
}

function getGrade7PerfectAnswer(idx: number): string {
  const answers = ['has studied', 'have seen', 'have lived', 'have known', 'has done', 'have been', 'have been', 'have studied', "haven't eaten", 'has lost'];
  return answers[idx % answers.length];
}

function getGrade7PerfectOptions(idx: number): string[] {
  const options = [
    ['study', 'studied', 'has studied', 'studying'],
    ['see', 'saw', 'have seen', 'seeing'],
    ['live', 'lived', 'have lived', 'living'],
    ['know', 'knew', 'have known', 'knowing'],
    ['do', 'did', 'has done', 'doing'],
    ['are', 'were', 'have been', 'being'],
    ['are', 'were', 'have been', 'being'],
    ['study', 'studied', 'have studied', 'studying'],
    ["don't eat", "didn't eat", "haven't eaten", "aren't eating"],
    ['lose', 'lost', 'has lost', 'losing']
  ];
  return options[idx % options.length];
}

// Grade 8 helpers
function getGrade8PerfectSentence(idx: number): string {
  const sentences = [
    `I ___ this book already.`,
    `She ___ in this company since 2020.`,
    `They ___ their homework yet.`,
    `We ___ to Japan before.`,
    `He ___ his keys.`,
    `You ___ that movie, right?`,
    `The students ___ the test.`,
    `I ___ him for ages.`,
    `She ___ her project.`,
    `They ___ dinner already.`
  ];
  return sentences[idx % sentences.length];
}

function getGrade8PerfectAnswer(idx: number): string {
  const answers = ['have read', 'has worked', "haven't finished", 'have been', 'has lost', 'have seen', 'have finished', "haven't seen", 'has completed', 'have had'];
  return answers[idx % answers.length];
}

function getGrade8PerfectOptions(idx: number): string[] {
  const options = [
    ['read', 'have read', 'was reading', 'will read'],
    ['work', 'has worked', 'was working', 'will work'],
    ['finish', "haven't finished", 'was finishing', 'will finish'],
    ['be', 'have been', 'was being', 'will be'],
    ['lose', 'has lost', 'was losing', 'will lose'],
    ['see', 'have seen', 'was seeing', 'will see'],
    ['finish', 'have finished', 'was finishing', 'will finish']
  ];
  return options[idx % options.length];
}

function getGrade8ModalSentence(idx: number): string {
  const sentences = [
    `You ___ wear a helmet when riding.`,
    `Students ___ respect their teachers.`,
    `We ___ protect the environment.`,
    `He ___ study harder for the exam.`,
    `Children ___ obey their parents.`,
    `You ___ smoke in public places.`,
    `We ___ be late for school.`,
    `She ___ speak three languages.`,
    `You ___ help your friends.`,
    `They ___ finish this by tomorrow.`
  ];
  return sentences[idx % sentences.length];
}

function getGrade8ModalAnswer(idx: number): string {
  const answers = ['should', 'should', 'must', 'should', 'must', "mustn't", "shouldn't", 'can', 'should', 'must'];
  return answers[idx % answers.length];
}

function getGrade8ModalOptions(idx: number): string[] {
  const options = [
    ['can', 'should', 'may', 'will'],
    ['must', 'should', 'can', 'may'],
    ['should', 'must', 'can', 'will'],
    ['can', 'could', 'may', 'might'],
    ['should', 'must', 'ought to', 'have to'],
    ['may', 'might', 'can', 'could'],
    ['must', 'have to', 'should', 'need to']
  ];
  return options[idx % options.length];
}

function getGrade8PassiveSentence(idx: number): string {
  const sentences = [
    `This book ___ by a famous author.`,
    `The letter ___ yesterday.`,
    `English ___ in many countries.`,
    `The homework ___ by Friday.`,
    `This problem ___ soon.`,
    `The house ___ last year.`,
    `The car ___ now.`,
    `Many trees ___ every year.`,
    `The report ___ tomorrow.`,
    `The room ___ every day.`
  ];
  return sentences[idx % sentences.length];
}

function getGrade8PassiveAnswer(idx: number): string {
  const answers = ['was written', 'was sent', 'is spoken', 'must be completed', 'will be solved', 'was built', 'is being repaired', 'are planted', 'will be submitted', 'is cleaned'];
  return answers[idx % answers.length];
}

function getGrade8PassiveOptions(idx: number): string[] {
  const options = [
    ['write', 'wrote', 'was written', 'is written'],
    ['speak', 'spoke', 'is spoken', 'was spoken'],
    ['make', 'made', 'is made', 'was made'],
    ['build', 'built', 'was built', 'is built'],
    ['sell', 'sold', 'is sold', 'was sold'],
    ['use', 'used', 'is used', 'was used'],
    ['teach', 'taught', 'is taught', 'was taught']
  ];
  return options[idx % options.length];
}

// Grade 9 helpers
function getGrade9ConditionalSentence(idx: number): string {
  const sentences = [
    `If I ___ rich, I would travel the world.`,
    `If she ___ harder, she would pass.`,
    `If we ___ time, we would help you.`,
    `If he ___ you, what would he do?`,
    `If they ___ the truth, they would tell you.`,
    `If I ___ wings, I would fly.`,
    `If she ___ fluent English, she would get the job.`,
    `If we ___ more money, we would buy a house.`,
    `If he ___ the answer, he would say it.`,
    `If they ___ free, they would come.`
  ];
  return sentences[idx % sentences.length];
}

function getGrade9ConditionalAnswer(idx: number): string {
  const answers = ['were', 'studied', 'had', 'were', 'knew', 'had', 'spoke', 'had', 'knew', 'were'];
  return answers[idx % answers.length];
}

function getGrade9ConditionalOptions(idx: number): string[] {
  const options = [
    ['am', 'was', 'were', 'will be'],
    ['know', 'knew', 'would know', 'will know'],
    ['have', 'had', 'would have', 'will have'],
    ['go', 'went', 'would go', 'will go'],
    ['be', 'was', 'were', 'would be'],
    ['tell', 'told', 'would tell', 'will tell'],
    ['can', 'could', 'would be able to', 'will be able to'],
    ['rain', 'rained', 'would rain', 'will rain'],
    ['come', 'came', 'would come', 'will come'],
    ['study', 'studied', 'would study', 'will study']
  ];
  return options[idx % options.length];
}

function getGrade9PassiveSentence(idx: number): string {
  const sentences = [
    `This letter ___ by my sister yesterday.`,
    `The house ___ in 1990.`,
    `English ___ in many schools.`,
    `The problem ___ soon.`,
    `The book ___ last year.`,
    `The car ___ now.`,
    `The bridge ___ next month.`,
    `The message ___ already.`,
    `The work ___ by tomorrow.`,
    `The decision ___ yesterday.`
  ];
  return sentences[idx % sentences.length];
}

function getGrade9PassiveAnswer(idx: number): string {
  const answers = ['was written', 'was built', 'is taught', 'will be solved', 'was published', 'is being fixed', 'will be built', 'has been sent', 'must be completed', 'was made'];
  return answers[idx % answers.length];
}

function getGrade9PassiveOptions(idx: number): string[] {
  const options = [
    ['writes', 'wrote', 'was written', 'has written'],
    ['builds', 'built', 'was built', 'has built'],
    ['teaches', 'taught', 'is taught', 'has taught'],
    ['solves', 'solved', 'will be solved', 'has solved'],
    ['publishes', 'published', 'was published', 'has published'],
    ['fixes', 'fixed', 'is being fixed', 'has fixed'],
    ['builds', 'built', 'will be built', 'has built'],
    ['sends', 'sent', 'has been sent', 'has sent'],
    ['completes', 'completed', 'must be completed', 'has completed'],
    ['makes', 'made', 'was made', 'has made']
  ];
  return options[idx % options.length];
}

function getGrade9ReportedSentence(idx: number): string {
  const sentences = [
    `She asked me where I ___ the day before.`,
    `He said that he ___ tired.`,
    `They told me they ___ the movie.`,
    `She said she ___ help me.`,
    `He asked if I ___ his brother.`,
    `They said they ___ to the party.`,
    `She told me she ___ the book.`,
    `He said he ___ there before.`,
    `They asked where I ___.`,
    `She said she ___ finish it.`
  ];
  return sentences[idx % sentences.length];
}

function getGrade9ReportedAnswer(idx: number): string {
  const answers = ['had been', 'was', 'had seen', 'would', 'knew', 'would go', 'had read', 'had been', 'lived', 'would'];
  return answers[idx % answers.length];
}

function getGrade9ReportedOptions(idx: number): string[] {
  const options = [
    ['was', 'am', 'had been', 'have been'],
    ['is', 'was', 'had been', 'will be'],
    ['see', 'saw', 'had seen', 'have seen'],
    ['will', 'would', 'can', 'could'],
    ['know', 'knew', 'had known', 'have known'],
    ['go', 'will go', 'would go', 'went'],
    ['read', 'reads', 'had read', 'have read'],
    ['is', 'was', 'had been', 'will be'],
    ['live', 'lived', 'had lived', 'have lived'],
    ['will', 'would', 'can', 'could']
  ];
  return options[idx % options.length];
}

// Ordering sentence helpers
function getOrderingSentence(grade: number, idx: number): { words: string[], correctOrder: string[] } {
  const sentences: Record<number, { words: string[], correctOrder: string[] }[]> = {
    6: [
      { words: ['is', 'This', 'my', 'school', 'new'], correctOrder: ['This', 'is', 'my', 'new', 'school'] },
      { words: ['has', 'She', 'a', 'cat', 'black'], correctOrder: ['She', 'has', 'a', 'black', 'cat'] },
      { words: ['like', 'I', 'very', 'English', 'much'], correctOrder: ['I', 'like', 'English', 'very', 'much'] },
      { words: ['go', 'We', 'to', 'school', 'every', 'day'], correctOrder: ['We', 'go', 'to', 'school', 'every', 'day'] },
      { words: ['playing', 'are', 'They', 'football', 'now'], correctOrder: ['They', 'are', 'playing', 'football', 'now'] },
      { words: ['My', 'teaches', 'teacher', 'Math', 'us'], correctOrder: ['My', 'teacher', 'teaches', 'us', 'Math'] },
      { words: ['in', 'live', 'I', 'Hanoi'], correctOrder: ['I', 'live', 'in', 'Hanoi'] },
      { words: ['have', 'I', 'two', 'sisters'], correctOrder: ['I', 'have', 'two', 'sisters'] },
      { words: ['likes', 'She', 'reading', 'books'], correctOrder: ['She', 'likes', 'reading', 'books'] },
      { words: ['My', 'is', 'big', 'house', 'very'], correctOrder: ['My', 'house', 'is', 'very', 'big'] },
      { words: ['does', 'He', 'homework', 'his', 'every', 'day'], correctOrder: ['He', 'does', 'his', 'homework', 'every', 'day'] },
      { words: ['are', 'There', 'students', '30', 'in', 'my', 'class'], correctOrder: ['There', 'are', '30', 'students', 'in', 'my', 'class'] },
      { words: ['play', 'We', 'after', 'school', 'football'], correctOrder: ['We', 'play', 'football', 'after', 'school'] },
      { words: ['breakfast', 'I', 'at', '7', 'have', 'AM'], correctOrder: ['I', 'have', 'breakfast', 'at', '7', 'AM'] },
      { words: ['My', 'works', 'father', 'in', 'a', 'hospital'], correctOrder: ['My', 'father', 'works', 'in', 'a', 'hospital'] },
      { words: ['She', 'to', 'goes', 'school', 'by', 'bus'], correctOrder: ['She', 'goes', 'to', 'school', 'by', 'bus'] },
      { words: ['watching', 'am', 'I', 'TV', 'now'], correctOrder: ['I', 'am', 'watching', 'TV', 'now'] },
      { words: ['They', 'are', 'my', 'friends', 'best'], correctOrder: ['They', 'are', 'my', 'best', 'friends'] },
      { words: ['cat', 'The', 'sleeping', 'is', 'on', 'the', 'sofa'], correctOrder: ['The', 'cat', 'is', 'sleeping', 'on', 'the', 'sofa'] },
      { words: ['nice', 'is', 'a', 'She', 'girl'], correctOrder: ['She', 'is', 'a', 'nice', 'girl'] },
      { words: ['love', 'I', 'my', 'family', 'very', 'much'], correctOrder: ['I', 'love', 'my', 'family', 'very', 'much'] },
      { words: ['has', 'My', 'brother', 'many', 'toys'], correctOrder: ['My', 'brother', 'has', 'many', 'toys'] },
      { words: ['We', 'learn', 'English', 'on', 'Monday'], correctOrder: ['We', 'learn', 'English', 'on', 'Monday'] },
      { words: ['hot', 'The', 'is', 'weather', 'today'], correctOrder: ['The', 'weather', 'is', 'hot', 'today'] },
      { words: ['plays', 'He', 'guitar', 'the', 'well'], correctOrder: ['He', 'plays', 'the', 'guitar', 'well'] },
      { words: ['My', 'likes', 'mother', 'cooking'], correctOrder: ['My', 'mother', 'likes', 'cooking'] },
      { words: ['are', 'We', 'happy', 'very'], correctOrder: ['We', 'are', 'very', 'happy'] },
      { words: ['dog', 'is', 'The', 'in', 'the', 'garden'], correctOrder: ['The', 'dog', 'is', 'in', 'the', 'garden'] },
      { words: ['go', 'I', 'to', 'bed', 'at', '10', 'PM'], correctOrder: ['I', 'go', 'to', 'bed', 'at', '10', 'PM'] },
      { words: ['sister', 'My', 'beautiful', 'is', 'very'], correctOrder: ['My', 'sister', 'is', 'very', 'beautiful'] }
    ],
    7: [
      { words: ['went', 'I', 'to', 'the', 'cinema', 'yesterday'], correctOrder: ['I', 'went', 'to', 'the', 'cinema', 'yesterday'] },
      { words: ['was', 'She', 'studying', 'when', 'I', 'called'], correctOrder: ['She', 'was', 'studying', 'when', 'I', 'called'] },
      { words: ['have', 'We', 'lived', 'here', 'since', '2020'], correctOrder: ['We', 'have', 'lived', 'here', 'since', '2020'] },
      { words: ['visited', 'They', 'Ha', 'Long', 'Bay', 'last', 'summer'], correctOrder: ['They', 'visited', 'Ha', 'Long', 'Bay', 'last', 'summer'] },
      { words: ['has', 'He', 'finished', 'his', 'homework', 'already'], correctOrder: ['He', 'has', 'finished', 'his', 'homework', 'already'] },
      { words: ['Last', 'week', ',', 'I', 'bought', 'a', 'new', 'book'], correctOrder: ['Last', 'week', ',', 'I', 'bought', 'a', 'new', 'book'] },
      { words: ['were', 'playing', 'They', 'football', 'when', 'it', 'rained'], correctOrder: ['They', 'were', 'playing', 'football', 'when', 'it', 'rained'] },
      { words: ['seen', 'have', 'I', 'never', 'that', 'movie'], correctOrder: ['I', 'have', 'never', 'seen', 'that', 'movie'] },
      { words: ['did', 'What', 'you', 'do', 'yesterday', '?'], correctOrder: ['What', 'did', 'you', 'do', 'yesterday', '?'] },
      { words: ['was', 'reading', 'She', 'a', 'book', 'at', 'that', 'time'], correctOrder: ['She', 'was', 'reading', 'a', 'book', 'at', 'that', 'time'] },
      { words: ['known', 'have', 'We', 'each', 'other', 'for', 'years'], correctOrder: ['We', 'have', 'known', 'each', 'other', 'for', 'years'] },
      { words: ['My', 'family', 'went', 'to', 'the', 'beach', 'last', 'weekend'], correctOrder: ['My', 'family', 'went', 'to', 'the', 'beach', 'last', 'weekend'] },
      { words: ['studied', 'has', 'She', 'English', 'for', 'three', 'years'], correctOrder: ['She', 'has', 'studied', 'English', 'for', 'three', 'years'] },
      { words: ['I', 'was', 'watching', 'TV', 'when', 'you', 'called'], correctOrder: ['I', 'was', 'watching', 'TV', 'when', 'you', 'called'] },
      { words: ['lived', 'They', 'in', 'Hanoi', 'when', 'they', 'were', 'young'], correctOrder: ['They', 'lived', 'in', 'Hanoi', 'when', 'they', 'were', 'young'] },
      { words: ['been', 'have', 'You', 'to', 'Paris', ',', 'right', '?'], correctOrder: ['You', 'have', 'been', 'to', 'Paris', ',', 'right', '?'] },
      { words: ['ate', 'We', 'dinner', 'at', '7', 'PM', 'yesterday'], correctOrder: ['We', 'ate', 'dinner', 'at', '7', 'PM', 'yesterday'] },
      { words: ['working', 'was', 'He', 'hard', 'all', 'day'], correctOrder: ['He', 'was', 'working', 'hard', 'all', 'day'] },
      { words: ['learned', 'has', 'My', 'brother', 'to', 'drive'], correctOrder: ['My', 'brother', 'has', 'learned', 'to', 'drive'] },
      { words: ['came', 'When', 'I', 'home', ',', 'my', 'mom', 'was', 'cooking'], correctOrder: ['When', 'I', 'came', 'home', ',', 'my', 'mom', 'was', 'cooking'] },
      { words: ['played', 'They', 'soccer', 'last', 'Sunday'], correctOrder: ['They', 'played', 'soccer', 'last', 'Sunday'] },
      { words: ['has', 'She', 'just', 'finished', 'her', 'project'], correctOrder: ['She', 'has', 'just', 'finished', 'her', 'project'] },
      { words: ['were', 'We', 'sleeping', 'at', 'midnight'], correctOrder: ['We', 'were', 'sleeping', 'at', 'midnight'] },
      { words: ['met', 'I', 'my', 'friend', 'yesterday', 'afternoon'], correctOrder: ['I', 'met', 'my', 'friend', 'yesterday', 'afternoon'] },
      { words: ['been', 'has', 'He', 'sick', 'for', 'a', 'week'], correctOrder: ['He', 'has', 'been', 'sick', 'for', 'a', 'week'] },
      { words: ['was', 'raining', 'It', 'when', 'we', 'left'], correctOrder: ['It', 'was', 'raining', 'when', 'we', 'left'] },
      { words: ['finished', 'have', 'The', 'students', 'the', 'test'], correctOrder: ['The', 'students', 'have', 'finished', 'the', 'test'] },
      { words: ['bought', 'My', 'father', 'a', 'new', 'car', 'last', 'month'], correctOrder: ['My', 'father', 'bought', 'a', 'new', 'car', 'last', 'month'] },
      { words: ['playing', 'were', 'The', 'children', 'in', 'the', 'park'], correctOrder: ['The', 'children', 'were', 'playing', 'in', 'the', 'park'] },
      { words: ['has', 'My', 'sister', 'graduated', 'from', 'university'], correctOrder: ['My', 'sister', 'has', 'graduated', 'from', 'university'] }
    ],
    8: [
      { words: ['have', 'I', 'never', 'been', 'to', 'London'], correctOrder: ['I', 'have', 'never', 'been', 'to', 'London'] },
      { words: ['should', 'You', 'respect', 'your', 'teachers'], correctOrder: ['You', 'should', 'respect', 'your', 'teachers'] },
      { words: ['written', 'was', 'This', 'book', 'by', 'him'], correctOrder: ['This', 'book', 'was', 'written', 'by', 'him'] },
      { words: ['worked', 'has', 'She', 'here', 'since', '2020'], correctOrder: ['She', 'has', 'worked', 'here', 'since', '2020'] },
      { words: ['must', 'We', 'protect', 'the', 'environment'], correctOrder: ['We', 'must', 'protect', 'the', 'environment'] },
      { words: ['If', 'it', 'rains', ',', 'we', 'will', 'stay', 'home'], correctOrder: ['If', 'it', 'rains', ',', 'we', 'will', 'stay', 'home'] },
      { words: ['haven\'t', 'They', 'finished', 'their', 'homework', 'yet'], correctOrder: ['They', 'haven\'t', 'finished', 'their', 'homework', 'yet'] },
      { words: ['English', 'is', 'spoken', 'in', 'many', 'countries'], correctOrder: ['English', 'is', 'spoken', 'in', 'many', 'countries'] },
      { words: ['have', 'I', 'read', 'this', 'book', 'already'], correctOrder: ['I', 'have', 'read', 'this', 'book', 'already'] },
      { words: ['can', 'She', 'speak', 'three', 'languages'], correctOrder: ['She', 'can', 'speak', 'three', 'languages'] },
      { words: ['been', 'have', 'We', 'friends', 'for', '10', 'years'], correctOrder: ['We', 'have', 'been', 'friends', 'for', '10', 'years'] },
      { words: ['must', 'be', 'The', 'homework', 'completed', 'by', 'Friday'], correctOrder: ['The', 'homework', 'must', 'be', 'completed', 'by', 'Friday'] },
      { words: ['should', 'You', 'study', 'harder', 'for', 'the', 'exam'], correctOrder: ['You', 'should', 'study', 'harder', 'for', 'the', 'exam'] },
      { words: ['has', 'My', 'brother', 'lost', 'his', 'keys'], correctOrder: ['My', 'brother', 'has', 'lost', 'his', 'keys'] },
      { words: ['is', 'The', 'car', 'being', 'repaired', 'now'], correctOrder: ['The', 'car', 'is', 'being', 'repaired', 'now'] },
      { words: ['haven\'t', 'I', 'seen', 'him', 'for', 'ages'], correctOrder: ['I', 'haven\'t', 'seen', 'him', 'for', 'ages'] },
      { words: ['may', 'We', 'go', 'to', 'the', 'beach', 'tomorrow'], correctOrder: ['We', 'may', 'go', 'to', 'the', 'beach', 'tomorrow'] },
      { words: ['built', 'was', 'The', 'house', 'last', 'year'], correctOrder: ['The', 'house', 'was', 'built', 'last', 'year'] },
      { words: ['has', 'She', 'completed', 'her', 'project'], correctOrder: ['She', 'has', 'completed', 'her', 'project'] },
      { words: ['mustn\'t', 'You', 'smoke', 'in', 'public', 'places'], correctOrder: ['You', 'mustn\'t', 'smoke', 'in', 'public', 'places'] },
      { words: ['have', 'They', 'lived', 'in', 'this', 'city', 'for', '5', 'years'], correctOrder: ['They', 'have', 'lived', 'in', 'this', 'city', 'for', '5', 'years'] },
      { words: ['will', 'be', 'The', 'problem', 'solved', 'soon'], correctOrder: ['The', 'problem', 'will', 'be', 'solved', 'soon'] },
      { words: ['should', 'Children', 'obey', 'their', 'parents'], correctOrder: ['Children', 'should', 'obey', 'their', 'parents'] },
      { words: ['has', 'He', 'been', 'to', 'Japan', 'twice'], correctOrder: ['He', 'has', 'been', 'to', 'Japan', 'twice'] },
      { words: ['is', 'cleaned', 'The', 'room', 'every', 'day'], correctOrder: ['The', 'room', 'is', 'cleaned', 'every', 'day'] },
      { words: ['haven\'t', 'We', 'decided', 'what', 'to', 'do', 'yet'], correctOrder: ['We', 'haven\'t', 'decided', 'what', 'to', 'do', 'yet'] },
      { words: ['can\'t', 'You', 'park', 'here'], correctOrder: ['You', 'can\'t', 'park', 'here'] },
      { words: ['taught', 'is', 'Math', 'by', 'Mr', 'Smith'], correctOrder: ['Math', 'is', 'taught', 'by', 'Mr', 'Smith'] },
      { words: ['has', 'My', 'sister', 'graduated', 'from', 'college'], correctOrder: ['My', 'sister', 'has', 'graduated', 'from', 'college'] },
      { words: ['should', 'We', 'help', 'each', 'other'], correctOrder: ['We', 'should', 'help', 'each', 'other'] }
    ],
    9: [
      { words: ['would', 'If', 'I', 'you', 'were', ',', 'I', 'study', 'harder'], correctOrder: ['If', 'I', 'were', 'you', ',', 'I', 'would', 'study', 'harder'] },
      { words: ['written', 'was', 'This', 'letter', 'by', 'my', 'sister'], correctOrder: ['This', 'letter', 'was', 'written', 'by', 'my', 'sister'] },
      { words: ['asked', 'She', 'me', 'where', 'I', 'had', 'been'], correctOrder: ['She', 'asked', 'me', 'where', 'I', 'had', 'been'] },
      { words: ['If', 'had', 'I', 'known', ',', 'I', 'would', 'have', 'helped'], correctOrder: ['If', 'I', 'had', 'known', ',', 'I', 'would', 'have', 'helped'] },
      { words: ['spoken', 'is', 'English', 'in', 'many', 'countries'], correctOrder: ['English', 'is', 'spoken', 'in', 'many', 'countries'] },
      { words: ['wish', 'I', 'I', 'could', 'speak', 'French'], correctOrder: ['I', 'wish', 'I', 'could', 'speak', 'French'] },
      { words: ['By', 'the', 'time', 'I', 'arrived', ',', 'they', 'had', 'left'], correctOrder: ['By', 'the', 'time', 'I', 'arrived', ',', 'they', 'had', 'left'] },
      { words: ['built', 'was', 'The', 'house', 'in', '1990'], correctOrder: ['The', 'house', 'was', 'built', 'in', '1990'] },
      { words: ['said', 'He', 'that', 'he', 'was', 'tired'], correctOrder: ['He', 'said', 'that', 'he', 'was', 'tired'] },
      { words: ['If', 'had', 'she', 'studied', ',', 'she', 'would', 'have', 'passed'], correctOrder: ['If', 'she', 'had', 'studied', ',', 'she', 'would', 'have', 'passed'] },
      { words: ['be', 'will', 'The', 'problem', 'solved', 'soon'], correctOrder: ['The', 'problem', 'will', 'be', 'solved', 'soon'] },
      { words: ['told', 'She', 'me', 'that', 'she', 'would', 'help'], correctOrder: ['She', 'told', 'me', 'that', 'she', 'would', 'help'] },
      { words: ['If', 'were', 'I', 'rich', ',', 'I', 'would', 'travel'], correctOrder: ['If', 'I', 'were', 'rich', ',', 'I', 'would', 'travel'] },
      { words: ['had', 'started', 'The', 'movie', 'already', 'when', 'we', 'arrived'], correctOrder: ['The', 'movie', 'had', 'already', 'started', 'when', 'we', 'arrived'] },
      { words: ['published', 'was', 'The', 'book', 'last', 'year'], correctOrder: ['The', 'book', 'was', 'published', 'last', 'year'] },
      { words: ['asked', 'He', 'me', 'if', 'I', 'knew', 'his', 'brother'], correctOrder: ['He', 'asked', 'me', 'if', 'I', 'knew', 'his', 'brother'] },
      { words: ['If', 'had', 'time', 'I', ',', 'I', 'would', 'visit', 'you'], correctOrder: ['If', 'I', 'had', 'time', ',', 'I', 'would', 'visit', 'you'] },
      { words: ['sent', 'was', 'The', 'message', 'yesterday'], correctOrder: ['The', 'message', 'was', 'sent', 'yesterday'] },
      { words: ['said', 'They', 'that', 'they', 'would', 'come'], correctOrder: ['They', 'said', 'that', 'they', 'would', 'come'] },
      { words: ['If', 'she', 'had', 'money', ',', 'she', 'would', 'buy', 'it'], correctOrder: ['If', 'she', 'had', 'money', ',', 'she', 'would', 'buy', 'it'] },
      { words: ['had', 'been', 'He', 'told', 'me', 'he', 'there', 'before'], correctOrder: ['He', 'told', 'me', 'he', 'had', 'been', 'there', 'before'] },
      { words: ['fixed', 'is', 'being', 'The', 'car', 'now'], correctOrder: ['The', 'car', 'is', 'being', 'fixed', 'now'] },
      { words: ['wish', 'I', 'I', 'had', 'wings'], correctOrder: ['I', 'wish', 'I', 'had', 'wings'] },
      { words: ['By', 'next', 'year', ',', 'I', 'will', 'have', 'graduated'], correctOrder: ['By', 'next', 'year', ',', 'I', 'will', 'have', 'graduated'] },
      { words: ['made', 'was', 'The', 'decision', 'yesterday'], correctOrder: ['The', 'decision', 'was', 'made', 'yesterday'] },
      { words: ['asked', 'She', 'where', 'I', 'lived'], correctOrder: ['She', 'asked', 'where', 'I', 'lived'] },
      { words: ['If', 'he', 'knew', 'the', 'answer', ',', 'he', 'would', 'tell', 'us'], correctOrder: ['If', 'he', 'knew', 'the', 'answer', ',', 'he', 'would', 'tell', 'us'] },
      { words: ['completed', 'must', 'be', 'The', 'work', 'by', 'tomorrow'], correctOrder: ['The', 'work', 'must', 'be', 'completed', 'by', 'tomorrow'] },
      { words: ['told', 'He', 'me', 'that', 'he', 'had', 'seen', 'the', 'movie'], correctOrder: ['He', 'told', 'me', 'that', 'he', 'had', 'seen', 'the', 'movie'] },
      { words: ['If', 'I', 'were', 'you', ',', 'I', 'wouldn\'t', 'do', 'that'], correctOrder: ['If', 'I', 'were', 'you', ',', 'I', 'wouldn\'t', 'do', 'that'] }
    ]
  };
  
  const gradeSentences = sentences[grade] || sentences[6];
  return gradeSentences[idx % gradeSentences.length];
}

// Get difficulty color for UI
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'hard':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

// Get difficulty text in Vietnamese
export function getDifficultyText(difficulty: string): string {
  switch (difficulty) {
    case 'easy':
      return 'Dễ';
    case 'medium':
      return 'Trung bình';
    case 'hard':
      return 'Khó';
    default:
      return 'Bình thường';
  }
}
