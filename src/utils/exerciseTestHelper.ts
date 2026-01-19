// ============================================================================
// Exercise Test Helper
// ============================================================================
// Utilities to test and verify exercise data
// ============================================================================

import { allLessons, getTotalExercisesCount } from '../data/allLessons';

/**
 * Get exercise statistics for all lessons
 */
export function getExerciseStats() {
  const stats = allLessons.map(lesson => ({
    id: lesson.id,
    unit: lesson.unit,
    grade: lesson.grade,
    title: lesson.title,
    exerciseCount: lesson.exercises.length,
    vocabularyCount: lesson.vocabulary.length,
    exerciseTypes: getExerciseTypeDistribution(lesson.exercises),
  }));

  const totalExercises = getTotalExercisesCount();
  const avgExercises = totalExercises / allLessons.length;
  const minExercises = Math.min(...stats.map(s => s.exerciseCount));
  const maxExercises = Math.max(...stats.map(s => s.exerciseCount));
  
  const lessonsWith30 = stats.filter(s => s.exerciseCount === 30).length;
  const lessonsWithLess = stats.filter(s => s.exerciseCount < 30);

  console.log('📊 EXERCISE STATISTICS');
  console.log('='.repeat(60));
  console.log(`Total Lessons: ${allLessons.length}`);
  console.log(`Total Exercises: ${totalExercises}`);
  console.log(`Average per Lesson: ${avgExercises.toFixed(1)}`);
  console.log(`Min: ${minExercises}, Max: ${maxExercises}`);
  console.log(`Lessons with 30 exercises: ${lessonsWith30}/${allLessons.length}`);
  console.log('='.repeat(60));

  if (lessonsWithLess.length > 0) {
    console.log('\n⚠️ LESSONS WITH LESS THAN 30 EXERCISES:');
    lessonsWithLess.forEach(lesson => {
      console.log(`  • Lesson ${lesson.id} (Unit ${lesson.unit}, Grade ${lesson.grade}): ${lesson.exerciseCount} exercises`);
      console.log(`    Title: ${lesson.title}`);
    });
  }

  return stats;
}

/**
 * Get exercise type distribution
 */
function getExerciseTypeDistribution(exercises: any[]) {
  const distribution: { [key: string]: number } = {};
  exercises.forEach(ex => {
    distribution[ex.type] = (distribution[ex.type] || 0) + 1;
  });
  return distribution;
}

/**
 * Check answer diversity for multiple-choice questions
 */
export function checkAnswerDiversity() {
  console.log('\n📊 ANSWER DIVERSITY CHECK');
  console.log('='.repeat(60));

  let totalMC = 0;
  let diverseAnswers = 0;
  const answerDistribution: { [key: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0 };

  allLessons.forEach(lesson => {
    lesson.exercises.forEach(ex => {
      if (ex.type === 'multiple-choice' && typeof ex.correctAnswer === 'number') {
        totalMC++;
        answerDistribution[ex.correctAnswer as number]++;
      }
    });
  });

  console.log(`Total Multiple-Choice Questions: ${totalMC}`);
  console.log('\nCorrect Answer Distribution:');
  Object.entries(answerDistribution).forEach(([position, count]) => {
    const percentage = ((count / totalMC) * 100).toFixed(1);
    const bar = '█'.repeat(Math.floor(count / totalMC * 50));
    console.log(`  Position ${position}: ${count} (${percentage}%) ${bar}`);
  });

  // Check if answers are diverse (each position should be ~25%)
  const idealPercentage = 25;
  const tolerance = 10; // 10% tolerance
  let allDiverse = true;
  
  Object.entries(answerDistribution).forEach(([position, count]) => {
    const percentage = (count / totalMC) * 100;
    if (Math.abs(percentage - idealPercentage) > tolerance) {
      allDiverse = false;
    }
  });

  if (allDiverse) {
    console.log('\n✅ Answer distribution is diverse!');
  } else {
    console.log('\n⚠️ Answer distribution is NOT diverse - some positions are overused');
  }

  console.log('='.repeat(60));
  
  return answerDistribution;
}

/**
 * Test specific lesson exercises
 */
export function testLessonExercises(lessonId: number) {
  const lesson = allLessons.find(l => l.id === lessonId);
  
  if (!lesson) {
    console.error(`Lesson ${lessonId} not found`);
    return;
  }

  console.log(`\n📚 LESSON ${lessonId} - ${lesson.title}`);
  console.log('='.repeat(60));
  console.log(`Grade: ${lesson.grade}, Unit: ${lesson.unit}`);
  console.log(`Vocabulary Count: ${lesson.vocabulary.length}`);
  console.log(`Exercise Count: ${lesson.exercises.length}`);
  console.log('='.repeat(60));

  const typeDistribution = getExerciseTypeDistribution(lesson.exercises);
  console.log('\nExercise Type Distribution:');
  Object.entries(typeDistribution).forEach(([type, count]) => {
    console.log(`  • ${type}: ${count}`);
  });

  console.log('\nSample Exercises:');
  lesson.exercises.slice(0, 5).forEach((ex, idx) => {
    console.log(`\n${idx + 1}. [${ex.type}] ${ex.question}`);
    if (ex.options) {
      ex.options.forEach((opt, i) => {
        const marker = i === ex.correctAnswer ? '✓' : ' ';
        console.log(`   ${marker} ${i}. ${opt}`);
      });
    } else {
      console.log(`   Answer: ${ex.correctAnswer}`);
    }
  });

  return lesson;
}

/**
 * Find lessons with issues
 */
export function findIssues() {
  console.log('\n🔍 FINDING ISSUES IN EXERCISES');
  console.log('='.repeat(60));

  const issues: string[] = [];

  allLessons.forEach(lesson => {
    // Check exercise count
    if (lesson.exercises.length < 30) {
      issues.push(`Lesson ${lesson.id}: Only ${lesson.exercises.length} exercises (expected 30)`);
    }

    // Check for duplicate IDs
    const ids = lesson.exercises.map(ex => ex.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      issues.push(`Lesson ${lesson.id}: Duplicate exercise IDs found`);
    }

    // Check for missing options in multiple-choice
    lesson.exercises.forEach((ex, idx) => {
      if (ex.type === 'multiple-choice') {
        if (!ex.options || ex.options.length !== 4) {
          issues.push(`Lesson ${lesson.id}, Exercise ${idx + 1}: Multiple-choice should have 4 options`);
        }
      }
    });
  });

  if (issues.length === 0) {
    console.log('✅ No issues found!');
  } else {
    console.log(`⚠️ Found ${issues.length} issues:\n`);
    issues.forEach(issue => console.log(`  • ${issue}`));
  }

  console.log('='.repeat(60));
  
  return issues;
}

/**
 * Display help
 */
export function showHelp() {
  console.log('\n📖 EXERCISE TEST HELPER - COMMANDS');
  console.log('='.repeat(60));
  console.log('Available functions:');
  console.log('  • getExerciseStats()');
  console.log('    → Show statistics for all exercises');
  console.log('  • checkAnswerDiversity()');
  console.log('    → Check if multiple-choice answers are diverse');
  console.log('  • testLessonExercises(lessonId)');
  console.log('    → Test exercises for a specific lesson');
  console.log('  • findIssues()');
  console.log('    → Find issues in exercise data');
  console.log('='.repeat(60));
  console.log('\nExample usage:');
  console.log('  const helper = await import("/utils/exerciseTestHelper.ts");');
  console.log('  helper.getExerciseStats();');
  console.log('  helper.checkAnswerDiversity();');
  console.log('  helper.testLessonExercises(1);');
  console.log('  helper.findIssues();');
  console.log('='.repeat(60));
}

// Auto-show help on import in browser
if (typeof window !== 'undefined') {
  showHelp();
}
