// Quick check for exercise count
import { allLessons } from '../data/allLessons';

export function quickCheck() {
  console.log('🔍 QUICK EXERCISE CHECK');
  console.log('='.repeat(60));
  
  // Check first 5 lessons
  for (let i = 0; i < 5; i++) {
    const lesson = allLessons[i];
    console.log(`\nLesson ${lesson.id}: ${lesson.title}`);
    console.log(`  Grade: ${lesson.grade}, Unit: ${lesson.unit}`);
    console.log(`  Exercises: ${lesson.exercises.length}`);
    console.log(`  Exercise IDs: ${lesson.exercises.map(e => e.id).join(', ')}`);
    
    if (lesson.exercises.length < 30) {
      console.warn(`  ⚠️ WARNING: Only ${lesson.exercises.length} exercises!`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
}

// Auto-run
if (typeof window !== 'undefined') {
  quickCheck();
}
