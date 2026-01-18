// This file merges the original 40 units with the additional 8 Grade 9 units
import { lessons as original40Units, type Lesson } from './lessons';
import { grade9UnitsAdditional } from './grade9-additional-units';
import { enhanceLesson, enhanceAllLessons } from './lessonEnhancer';

// Merge all 48 units together
const rawLessons: Lesson[] = [
  ...original40Units,
  ...grade9UnitsAdditional
];

// Export enhanced lessons with 30 vocabulary words and 18 exercises each
export const allLessons: Lesson[] = enhanceAllLessons(rawLessons);

// Export raw lessons (without enhancement) if needed
export const allLessonsRaw: Lesson[] = rawLessons;

// Re-export types
export type { 
  Vocabulary,
  Grammar,
  Exercise,
  Listening,
  Speaking,
  Reading,
  Writing,
  Lesson
} from './lessons';

// Re-export helper functions from lessons.ts
export { getAllGrades } from './lessons';

// Override getLessonsByGrade to use enhanced allLessons
export function getLessonsByGrade(grade: 6 | 7 | 8 | 9): Lesson[] {
  return allLessons.filter(lesson => lesson.grade === grade);
}

// Add getLessonById function - returns enhanced lesson
export function getLessonById(id: number): Lesson | undefined {
  return allLessons.find(lesson => lesson.id === id);
}

// Get lesson statistics
export function getLessonStats(lessonId: number): {
  vocabularyCount: number;
  exerciseCount: number;
  totalLessons: number;
} {
  const lesson = getLessonById(lessonId);
  return {
    vocabularyCount: lesson?.vocabulary.length || 0,
    exerciseCount: lesson?.exercises.length || 0,
    totalLessons: allLessons.length
  };
}

// Get all vocabulary count across all lessons
export function getTotalVocabularyCount(): number {
  return allLessons.reduce((sum, lesson) => sum + lesson.vocabulary.length, 0);
}

// Get all exercises count across all lessons
export function getTotalExercisesCount(): number {
  return allLessons.reduce((sum, lesson) => sum + lesson.exercises.length, 0);
}