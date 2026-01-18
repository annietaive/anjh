import { Lesson, Vocabulary, Exercise } from './allLessons';
import { getVocabularyForUnit } from './vocabularyExpander';
import { generate18ExercisesForUnit } from './exerciseExpander';

/**
 * Enhances a lesson by expanding vocabulary to 30 words and exercises to 18
 * This function takes an existing lesson and enriches it with comprehensive content
 * NOW: Only expands if lesson has less than required amount
 */
export function enhanceLesson(lesson: Lesson): Lesson {
  // Calculate global unit number (1-48) from lesson ID
  // lesson.id directly maps to global unit number
  const globalUnitNumber = lesson.id;
  
  // Get vocabulary - expand to 30 if needed
  const expandedVocabulary = lesson.vocabulary.length < 30
    ? getVocabularyForUnit(lesson.title, globalUnitNumber, lesson.grade)
    : lesson.vocabulary;
  
  // Get exercises - expand to 18 ONLY if less than 18
  const expandedExercises = lesson.exercises.length < 18
    ? generate18ExercisesForUnit(
        lesson.title,
        lesson.unit,
        lesson.grade,
        expandedVocabulary,
        lesson.grammar
      )
    : lesson.exercises;
  
  return {
    ...lesson,
    vocabulary: expandedVocabulary,
    exercises: expandedExercises
  };
}

/**
 * Enhances all lessons in an array
 */
export function enhanceAllLessons(lessons: Lesson[]): Lesson[] {
  return lessons.map(lesson => enhanceLesson(lesson));
}

/**
 * Get enhanced lesson by ID
 */
export function getEnhancedLessonById(lessons: Lesson[], id: number): Lesson | undefined {
  const lesson = lessons.find(l => l.id === id);
  return lesson ? enhanceLesson(lesson) : undefined;
}

/**
 * Get enhanced lessons by grade
 */
export function getEnhancedLessonsByGrade(lessons: Lesson[], grade: 6 | 7 | 8 | 9): Lesson[] {
  return lessons.filter(l => l.grade === grade).map(l => enhanceLesson(l));
}

/**
 * Check if a lesson needs enhancement
 */
export function needsEnhancement(lesson: Lesson): boolean {
  return lesson.vocabulary.length < 30 || lesson.exercises.length < 18;
}

/**
 * Get lesson statistics
 */
export function getLessonStats(lesson: Lesson): {
  vocabularyCount: number;
  exerciseCount: number;
  needsEnhancement: boolean;
} {
  return {
    vocabularyCount: lesson.vocabulary.length,
    exerciseCount: lesson.exercises.length,
    needsEnhancement: needsEnhancement(lesson)
  };
}