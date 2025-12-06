// Quick test to verify all lessons have 18 exercises
import { allLessons } from '../data/allLessons';

console.log('🧪 TESTING EXERCISE COUNT');
console.log('='.repeat(70));

let allPassed = true;
let totalExercises = 0;

allLessons.forEach((lesson, index) => {
  const count = lesson.exercises.length;
  totalExercises += count;
  
  const status = count === 18 ? '✅' : '❌';
  const message = count === 18 
    ? '' 
    : ` <- WARNING: Expected 18, got ${count}`;
  
  console.log(`${status} Lesson ${lesson.id} (${lesson.title}): ${count} exercises${message}`);
  
  if (count !== 18) {
    allPassed = false;
    // Show exercise IDs
    console.log(`   IDs: [${lesson.exercises.map(e => e.id).join(', ')}]`);
  }
});

console.log('='.repeat(70));
console.log(`Total Lessons: ${allLessons.length}`);
console.log(`Total Exercises: ${totalExercises}`);
console.log(`Expected Total: ${allLessons.length * 18} (48 lessons × 18)`);
console.log(`Status: ${allPassed ? '✅ ALL PASS' : '❌ SOME FAILED'}`);
console.log('='.repeat(70));
