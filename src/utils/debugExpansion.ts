// Debug exercise expansion
import { allLessons, allLessonsRaw } from '../data/allLessons';

export function debugExpansion(lessonId: number = 1) {
  console.log('🐛 DEBUG EXERCISE EXPANSION');
  console.log('='.repeat(60));
  
  const rawLesson = allLessonsRaw.find(l => l.id === lessonId);
  const enhancedLesson = allLessons.find(l => l.id === lessonId);
  
  if (!rawLesson || !enhancedLesson) {
    console.error('Lesson not found!');
    return;
  }
  
  console.log(`\n📚 Lesson ${lessonId}: ${rawLesson.title}`);
  console.log('─'.repeat(60));
  
  console.log('\n📊 RAW DATA:');
  console.log(`  Vocabulary: ${rawLesson.vocabulary.length} words`);
  console.log(`  Exercises: ${rawLesson.exercises.length} exercises`);
  console.log(`  Exercise IDs: [${rawLesson.exercises.map(e => e.id).join(', ')}]`);
  
  console.log('\n✨ ENHANCED DATA:');
  console.log(`  Vocabulary: ${enhancedLesson.vocabulary.length} words`);
  console.log(`  Exercises: ${enhancedLesson.exercises.length} exercises`);
  console.log(`  Exercise IDs: [${enhancedLesson.exercises.map(e => e.id).join(', ')}]`);
  
  console.log('\n📈 EXPANSION STATUS:');
  const vocabExpanded = enhancedLesson.vocabulary.length > rawLesson.vocabulary.length;
  const exerciseExpanded = enhancedLesson.exercises.length > rawLesson.exercises.length;
  
  console.log(`  Vocabulary expanded: ${vocabExpanded ? '✅ YES' : '❌ NO'}`);
  console.log(`  Exercises expanded: ${exerciseExpanded ? '✅ YES' : '❌ NO'}`);
  
  if (!exerciseExpanded && rawLesson.exercises.length < 30) {
    console.error('\n❌ ERROR: Exercises should be expanded but are not!');
    console.log('  This means the expansion system is not working.');
  } else if (exerciseExpanded) {
    console.log(`\n✅ SUCCESS: Expanded from ${rawLesson.exercises.length} to ${enhancedLesson.exercises.length} exercises`);
  }
  
  // Show sample exercises
  console.log('\n📝 SAMPLE EXERCISES (first 5 and last 5):');
  const first5 = enhancedLesson.exercises.slice(0, 5);
  const last5 = enhancedLesson.exercises.slice(-5);
  
  console.log('\n  First 5:');
  first5.forEach((ex, idx) => {
    console.log(`    ${idx + 1}. [ID:${ex.id}] ${ex.type}: ${ex.question.substring(0, 50)}...`);
  });
  
  console.log('\n  Last 5:');
  last5.forEach((ex, idx) => {
    const actualIdx = enhancedLesson.exercises.length - 5 + idx;
    console.log(`    ${actualIdx + 1}. [ID:${ex.id}] ${ex.type}: ${ex.question.substring(0, 50)}...`);
  });
  
  console.log('\n' + '='.repeat(60));
  
  return {
    raw: rawLesson,
    enhanced: enhancedLesson,
    expanded: exerciseExpanded
  };
}

// Auto-run for lesson 1
if (typeof window !== 'undefined') {
  console.log('\n💡 Usage: debugExpansion(lessonId)');
  console.log('Example: debugExpansion(1) to check Lesson 1\n');
  debugExpansion(1);
}
