import { Exercise, Vocabulary, Grammar } from './allLessons';

/**
 * Generate 18 UNIQUE exercises for each unit based on:
 * - Unit's 30 vocabulary words (unique per unit)
 * - Unit number (for variation)
 * - Grammar topics
 */
export function generate18ExercisesForUnit(
  unitTitle: string,
  unitNumber: number,
  grade: number,
  vocabulary: Vocabulary[],
  grammar: Grammar[]
): Exercise[] {
  const exercises: Exercise[] = [];
  
  // Ensure we have enough vocabulary
  if (vocabulary.length < 10) {
    console.warn(`⚠️ Unit ${unitNumber} has only ${vocabulary.length} vocabulary words`);
    return createFallbackExercises(unitTitle, unitNumber);
  }
  
  // ============ SECTION 1: VOCABULARY MULTIPLE CHOICE (6 exercises) ============
  for (let i = 1; i <= 6; i++) {
    try {
      const vocabIndex = i - 1;
      if (vocabIndex >= vocabulary.length) break;
      
      const vocab = vocabulary[vocabIndex];
      
      if (i === 1) {
        // Ex 1: Word meaning
        const distractors = getDistractorMeanings(vocab, vocabulary, i, 3);
        const options = shuffle([vocab.meaning, ...distractors]);
        exercises.push({
          id: i,
          type: 'multiple-choice',
          question: `What does "${vocab.word}" mean?`,
          options: options,
          correctAnswer: options.indexOf(vocab.meaning),
          explanation: `"${vocab.word}" means ${vocab.meaning}.`
        });
      } else if (i === 2) {
        // Ex 2: Complete sentence with word
        const distractorWords = getDistractorWords(vocab, vocabulary, i, 3);
        const options = shuffle([vocab.word, ...distractorWords]);
        const sentenceWithBlank = createSentenceWithBlank(vocab);
        exercises.push({
          id: i,
          type: 'multiple-choice',
          question: `Choose the correct word: "${sentenceWithBlank}"`,
          options: options,
          correctAnswer: options.indexOf(vocab.word),
          explanation: `The correct answer is "${vocab.word}" (${vocab.meaning}).`
        });
      } else if (i === 3) {
        // Ex 3: Correct usage in context
        const wrongSentences = createWrongSentences(vocab, vocabulary);
        const options = shuffle([vocab.example, ...wrongSentences]);
        exercises.push({
          id: i,
          type: 'multiple-choice',
          question: `Which sentence uses "${vocab.word}" correctly?`,
          options: options,
          correctAnswer: options.indexOf(vocab.example),
          explanation: `The correct usage is: "${vocab.example}"`
        });
      } else if (i === 4) {
        // Ex 4: Contextual meaning
        const distractors = getDistractorMeanings(vocab, vocabulary, i, 3);
        const options = shuffle([vocab.meaning, ...distractors]);
        exercises.push({
          id: i,
          type: 'multiple-choice',
          question: `What is the meaning of "${vocab.word}" in this context: "${vocab.example}"?`,
          options: options,
          correctAnswer: options.indexOf(vocab.meaning),
          explanation: `In this context, "${vocab.word}" means ${vocab.meaning}.`
        });
      } else if (i === 5) {
        // Ex 5: Fill in sentence
        const distractorWords = getDistractorWords(vocab, vocabulary, i, 3);
        const options = shuffle([vocab.word, ...distractorWords]);
        const sentence = createSentenceWithBlank(vocab);
        exercises.push({
          id: i,
          type: 'multiple-choice',
          question: `Fill in: "${sentence}"`,
          options: options,
          correctAnswer: options.indexOf(vocab.word),
          explanation: `The correct word is "${vocab.word}" (${vocab.meaning}).`
        });
      } else if (i === 6) {
        // Ex 6: Best fit
        const distractorWords = getDistractorWords(vocab, vocabulary, i, 3);
        const options = shuffle([vocab.word, ...distractorWords]);
        exercises.push({
          id: i,
          type: 'multiple-choice',
          question: `Which word best fits: "${createSimpleContext(vocab)}"?`,
          options: options,
          correctAnswer: options.indexOf(vocab.word),
          explanation: `The answer is "${vocab.word}" which means ${vocab.meaning}.`
        });
      }
    } catch (error) {
      console.error(`Error generating exercise ${i}:`, error);
    }
  }
  
  // ============ SECTION 2: VOCABULARY FILL IN THE BLANK (6 exercises) ============
  for (let i = 7; i <= 12; i++) {
    try {
      const vocabIndex = i - 1;
      if (vocabIndex >= vocabulary.length) break;
      
      const vocab = vocabulary[vocabIndex];
      const sentenceWithBlank = createSentenceWithBlank(vocab, i - 7); // Pass index for variation
      
      exercises.push({
        id: i,
        type: 'fill-blank',
        question: sentenceWithBlank,
        correctAnswer: vocab.word.toLowerCase(),
        explanation: `The correct answer is "${vocab.word}" (${vocab.meaning}).`
      });
    } catch (error) {
      console.error(`Error generating exercise ${i}:`, error);
    }
  }
  
  // ============ SECTION 3: GRAMMAR EXERCISES (3 exercises) ============
  try {
    const grammarExercises = createGrammarExercises(grammar, grade, unitNumber, vocabulary);
    for (let i = 0; i < 3; i++) {
      if (grammarExercises[i]) {
        exercises.push({
          ...grammarExercises[i],
          id: 13 + i
        });
      } else {
        const defaultGrammar = createDefaultGrammarExercises(grade, unitNumber, vocabulary);
        exercises.push({
          ...defaultGrammar[i % defaultGrammar.length],
          id: 13 + i
        });
      }
    }
  } catch (error) {
    console.error(`Error generating grammar exercises:`, error);
    const defaultGrammar = createDefaultGrammarExercises(grade, unitNumber, vocabulary);
    for (let i = 0; i < 3; i++) {
      exercises.push({
        ...defaultGrammar[i % defaultGrammar.length],
        id: 13 + i
      });
    }
  }
  
  // ============ SECTION 4: MIXED/APPLICATION (3 exercises) ============
  try {
    // Ex 16: Reading comprehension
    const vocabIndex16_1 = Math.min(12, vocabulary.length - 1);
    const vocabIndex16_2 = Math.min(13, vocabulary.length - 1);
    const vocab16_1 = vocabulary[vocabIndex16_1];
    const vocab16_2 = vocabulary[vocabIndex16_2];
    const context16 = `In the passage: "Students need ${vocab16_1.word} to understand the lesson. They should also ${vocab16_2.word} regularly."`;
    const distractors16 = getDistractorMeanings(vocab16_1, vocabulary, 16, 3);
    const options16 = shuffle([vocab16_1.meaning, ...distractors16]);
    
    exercises.push({
      id: 16,
      type: 'multiple-choice',
      question: `${context16}\n\nWhat does "${vocab16_1.word}" mean?`,
      options: options16,
      correctAnswer: options16.indexOf(vocab16_1.meaning),
      explanation: `"${vocab16_1.word}" means ${vocab16_1.meaning}.`
    });
  } catch (error) {
    console.error('Error generating exercise 16:', error);
  }
  
  try {
    // Ex 17: Sentence completion
    const vocabIndex17 = Math.min(14, vocabulary.length - 1);
    const vocab17 = vocabulary[vocabIndex17];
    const sentence17 = createContextualSentence(vocab17, unitTitle);
    
    exercises.push({
      id: 17,
      type: 'fill-blank',
      question: sentence17,
      correctAnswer: vocab17.word.toLowerCase(),
      explanation: `The answer is "${vocab17.word}" meaning ${vocab17.meaning}.`
    });
  } catch (error) {
    console.error('Error generating exercise 17:', error);
  }
  
  try {
    // Ex 18: Application
    const vocabIndex18 = Math.min(15, vocabulary.length - 1);
    const vocab18 = vocabulary[vocabIndex18];
    const distractorWords18 = getDistractorWords(vocab18, vocabulary, 18, 3);
    const options18 = shuffle([vocab18.word, ...distractorWords18]);
    const realWorldSentence = createRealWorldContext(vocab18, unitTitle);
    
    exercises.push({
      id: 18,
      type: 'multiple-choice',
      question: `Complete the sentence: "${realWorldSentence}"`,
      options: options18,
      correctAnswer: options18.indexOf(vocab18.word),
      explanation: `The correct answer is "${vocab18.word}" (${vocab18.meaning}).`
    });
  } catch (error) {
    console.error('Error generating exercise 18:', error);
  }
  
  // Ensure exactly 18 exercises
  while (exercises.length < 18) {
    const missingId = exercises.length + 1;
    console.warn(`⚠️ Unit ${unitNumber}: Missing exercise ${missingId}, adding fallback...`);
    exercises.push({
      id: missingId,
      type: 'multiple-choice',
      question: `Review question ${missingId} for ${unitTitle}`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      explanation: 'This is a review exercise.'
    });
  }
  
  return exercises.slice(0, 18); // Ensure exactly 18
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Shuffle array randomly
 */
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get distractor meanings from other vocabulary words
 */
function getDistractorMeanings(
  targetVocab: Vocabulary,
  allVocab: Vocabulary[],
  seed: number,
  count: number
): string[] {
  const distractors: string[] = [];
  const used = new Set([targetVocab.meaning]);
  
  // Use seed to get different distractors for each question
  const startIndex = (seed * 3) % allVocab.length;
  
  for (let i = 0; i < allVocab.length && distractors.length < count; i++) {
    const index = (startIndex + i) % allVocab.length;
    const vocab = allVocab[index];
    
    if (!used.has(vocab.meaning) && vocab.word !== targetVocab.word) {
      distractors.push(vocab.meaning);
      used.add(vocab.meaning);
    }
  }
  
  // Fill with generic distractors if needed
  const genericDistractors = [
    'một loại đồ vật', 'một hành động', 'một tính chất',
    'một địa điểm', 'một người', 'một sự việc',
    'một trạng thái', 'một cảm xúc', 'một ý tưởng'
  ];
  
  for (let i = 0; distractors.length < count && i < genericDistractors.length; i++) {
    if (!used.has(genericDistractors[i])) {
      distractors.push(genericDistractors[i]);
      used.add(genericDistractors[i]);
    }
  }
  
  return distractors.slice(0, count);
}

/**
 * Get distractor words from other vocabulary
 */
function getDistractorWords(
  targetVocab: Vocabulary,
  allVocab: Vocabulary[],
  seed: number,
  count: number
): string[] {
  const distractors: string[] = [];
  const used = new Set([targetVocab.word.toLowerCase()]);
  
  const startIndex = (seed * 5) % allVocab.length;
  
  for (let i = 0; i < allVocab.length && distractors.length < count; i++) {
    const index = (startIndex + i) % allVocab.length;
    const vocab = allVocab[index];
    
    if (!used.has(vocab.word.toLowerCase())) {
      distractors.push(vocab.word);
      used.add(vocab.word.toLowerCase());
    }
  }
  
  return distractors.slice(0, count);
}

/**
 * Create a sentence with blank from vocabulary example
 */
function createSentenceWithBlank(vocab: Vocabulary, index: number): string {
  if (vocab.example && vocab.example.includes(vocab.word)) {
    return vocab.example.replace(vocab.word, '___');
  }
  
  // Create simple sentence if no example
  const contexts = [
    `I need ___ for this. (Tôi cần ___ cho việc này)`,
    `We use ___ for learning. (Chúng ta sử dụng ___ để học)`,
    `The teacher gave us ___ yesterday. (Giáo viên đã cho chúng tôi ___ hôm qua)`,
    `Students should ___ every day. (Học sinh nên ___ mỗi ngày)`,
    `This is a very ___ thing to do. (Đây là một việc rất ___ để làm)`,
  ];
  
  const hash = vocab.word.length + vocab.word.charCodeAt(0) + index;
  const contextIndex = hash % contexts.length;
  
  return contexts[contextIndex];
}

/**
 * Create wrong sentences for distraction
 */
function createWrongSentences(vocab: Vocabulary, allVocab: Vocabulary[]): string[] {
  const wrong: string[] = [];
  
  // Try to use examples from other vocab as wrong answers
  for (let i = 0; i < allVocab.length && wrong.length < 3; i++) {
    if (allVocab[i].word !== vocab.word && allVocab[i].example) {
      // Replace their word with target word to create wrong usage
      const wrongSentence = allVocab[i].example.replace(allVocab[i].word, vocab.word);
      if (wrongSentence !== vocab.example) {
        wrong.push(wrongSentence);
      }
    }
  }
  
  // Fill with generic wrong sentences
  while (wrong.length < 3) {
    wrong.push(`This is an incorrect example using ${vocab.word}.`);
  }
  
  return wrong.slice(0, 3);
}

/**
 * Create simple context sentence
 */
function createSimpleContext(vocab: Vocabulary): string {
  const contexts = [
    `You need ___ to complete this task.`,
    `Students should ___ every day.`,
    `This is a very ___ thing to do.`,
    `We use ___ for learning.`,
    `The teacher gave us ___ yesterday.`,
  ];
  
  const hash = vocab.word.length + vocab.word.charCodeAt(0);
  const contextIndex = hash % contexts.length;
  
  return contexts[contextIndex];
}

/**
 * Create contextual sentence related to unit topic
 */
function createContextualSentence(vocab: Vocabulary, unitTitle: string): string {
  if (vocab.example && vocab.example.includes(vocab.word)) {
    return vocab.example.replace(vocab.word, '___');
  }
  
  return `In ${unitTitle}, we learn about ___. (Chúng ta học về ___)`;
}

/**
 * Create real-world context
 */
function createRealWorldContext(vocab: Vocabulary, unitTitle: string): string {
  const contexts = [
    `In real life, students often use ___ when studying.`,
    `When learning about ${unitTitle}, you need ___.`,
    `Teachers recommend using ___ for better understanding.`,
    `A good way to practice is with ___.`,
    `Many students find ___ very helpful.`,
  ];
  
  const hash = vocab.word.length * unitTitle.length;
  const index = hash % contexts.length;
  
  return contexts[index];
}

/**
 * Create grammar exercises based on grammar topics
 */
function createGrammarExercises(
  grammar: Grammar[],
  grade: number,
  unitNumber: number,
  vocabulary: Vocabulary[]
): Exercise[] {
  const exercises: Exercise[] = [];
  
  if (grammar.length === 0) {
    return createDefaultGrammarExercises(grade, unitNumber, vocabulary);
  }
  
  // Create exercises from grammar topics
  grammar.slice(0, 3).forEach((grammarTopic, index) => {
    const exampleIndex = (unitNumber + index) % grammarTopic.examples.length;
    const example = grammarTopic.examples[exampleIndex];
    
    // Create fill-in-the-blank from example
    const words = example.split(' ');
    if (words.length >= 3) {
      // Find a key word to blank out (prefer verbs/nouns)
      const blankIndex = Math.min(2 + index, words.length - 1);
      const correctWord = words[blankIndex];
      const sentence = [...words];
      sentence[blankIndex] = '___';
      
      exercises.push({
        id: index + 1,
        type: 'fill-blank',
        question: sentence.join(' '),
        correctAnswer: correctWord.toLowerCase().replace(/[.,!?]/g, ''),
        explanation: `${grammarTopic.rule}\nExample: ${example}`
      });
    }
  });
  
  return exercises;
}

/**
 * Create default grammar exercises when no grammar topics provided
 */
function createDefaultGrammarExercises(
  grade: number,
  unitNumber: number,
  vocabulary: Vocabulary[]
): Exercise[] {
  const exercises: Exercise[] = [];
  
  const grammarPatterns = getGrammarPatternsByGrade(grade);
  
  // Use unit number to select different patterns
  for (let i = 0; i < 3; i++) {
    const patternIndex = (unitNumber + i) % grammarPatterns.length;
    const pattern = grammarPatterns[patternIndex];
    
    exercises.push({
      id: i + 1,
      type: 'multiple-choice',
      question: pattern.question,
      options: pattern.options,
      correctAnswer: pattern.correctAnswer,
      explanation: pattern.explanation
    });
  }
  
  return exercises;
}

/**
 * Get grammar patterns by grade level
 */
function getGrammarPatternsByGrade(grade: number) {
  const patterns: Record<number, any[]> = {
    6: [
      {
        question: "She ___ to school every day.",
        options: ["go", "goes", "going", "went"],
        correctAnswer: 1,
        explanation: "Use 'goes' with third person singular in present simple."
      },
      {
        question: "They ___ studying right now.",
        options: ["is", "am", "are", "be"],
        correctAnswer: 2,
        explanation: "Use 'are' with plural subject in present continuous."
      },
      {
        question: "I ___ my homework yesterday.",
        options: ["do", "does", "did", "doing"],
        correctAnswer: 2,
        explanation: "Use 'did' for past simple with time marker 'yesterday'."
      }
    ],
    7: [
      {
        question: "Yesterday, I ___ a movie.",
        options: ["watch", "watched", "watching", "watches"],
        correctAnswer: 1,
        explanation: "Use past simple 'watched' with time marker 'yesterday'."
      },
      {
        question: "She ___ English for 3 years.",
        options: ["study", "studied", "has studied", "studying"],
        correctAnswer: 2,
        explanation: "Use present perfect 'has studied' with duration 'for 3 years'."
      },
      {
        question: "While I ___ TV, the phone rang.",
        options: ["watch", "watched", "was watching", "am watching"],
        correctAnswer: 2,
        explanation: "Use past continuous with 'while' for interrupted action."
      }
    ],
    8: [
      {
        question: "I ___ finished my homework.",
        options: ["have", "has", "had", "having"],
        correctAnswer: 0,
        explanation: "Use 'have' with first person in present perfect."
      },
      {
        question: "You ___ wear a helmet when riding.",
        options: ["can", "should", "may", "will"],
        correctAnswer: 1,
        explanation: "Use 'should' for advice and recommendations."
      },
      {
        question: "This letter ___ by my friend.",
        options: ["write", "writes", "wrote", "was written"],
        correctAnswer: 3,
        explanation: "Use passive voice 'was written' for completed past action."
      }
    ],
    9: [
      {
        question: "If I ___ rich, I would travel.",
        options: ["am", "was", "were", "be"],
        correctAnswer: 2,
        explanation: "Use 'were' in second conditional for unreal situations."
      },
      {
        question: "The house ___ built in 1990.",
        options: ["is", "was", "has", "had"],
        correctAnswer: 1,
        explanation: "Use 'was' for passive voice in past simple."
      },
      {
        question: "She asked where I ___.",
        options: ["live", "lived", "living", "lives"],
        correctAnswer: 1,
        explanation: "Use past simple in reported speech when reporting verb is past."
      }
    ]
  };
  
  return patterns[grade] || patterns[6];
}

/**
 * Create fallback exercises when generation fails
 */
function createFallbackExercises(unitTitle: string, unitNumber: number): Exercise[] {
  const exercises: Exercise[] = [];
  
  for (let i = 1; i <= 18; i++) {
    exercises.push({
      id: i,
      type: i <= 12 ? 'fill-blank' : 'multiple-choice',
      question: `Exercise ${i} for ${unitTitle}`,
      ...(i <= 12 
        ? { correctAnswer: 'answer', explanation: 'This is a placeholder exercise.' }
        : { options: ['A', 'B', 'C', 'D'], correctAnswer: 0, explanation: 'This is a placeholder exercise.' }
      )
    });
  }
  
  return exercises;
}

// ============================================================================
// LEGACY FUNCTION - For backward compatibility
// ============================================================================

export function generate15ExercisesForUnit(
  unitTitle: string,
  unitNumber: number,
  grade: number,
  vocabulary: Vocabulary[],
  grammar: Grammar[]
): Exercise[] {
  // Just use the 18-exercise function and take first 15
  return generate18ExercisesForUnit(unitTitle, unitNumber, grade, vocabulary, grammar).slice(0, 15);
}