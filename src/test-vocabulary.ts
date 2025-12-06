/**
 * Test script to verify vocabulary database for all units
 * Run this to check if vocabulary is loaded correctly
 */

import { hasVocabularyForUnit, getVocabularyByUnitNumber, getVocabularyStats } from './data/unitVocabularyDatabase';

console.log('='.repeat(60));
console.log('VOCABULARY DATABASE TEST');
console.log('='.repeat(60));

// Test statistics
const stats = getVocabularyStats();
console.log('\n📊 Overall Statistics:');
console.log(`  Total Units: ${stats.totalUnits}`);
console.log(`  Units with Vocabulary: ${stats.unitsWithVocabulary}`);
console.log(`  Total Words: ${stats.totalWords}`);
console.log(`  Grade 6 Words: ${stats.grade6Words}`);
console.log(`  Grade 7 Words: ${stats.grade7Words}`);
console.log(`  Grade 8 Words: ${stats.grade8Words}`);
console.log(`  Grade 9 Words: ${stats.grade9Words}`);

// Test each grade
const grades = [
  { grade: 6, startUnit: 1, endUnit: 12 },
  { grade: 7, startUnit: 13, endUnit: 24 },
  { grade: 8, startUnit: 25, endUnit: 36 },
  { grade: 9, startUnit: 37, endUnit: 48 }
];

for (const { grade, startUnit, endUnit } of grades) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`GRADE ${grade} (Units ${startUnit}-${endUnit})`);
  console.log('='.repeat(60));
  
  for (let unit = startUnit; unit <= endUnit; unit++) {
    const hasVocab = hasVocabularyForUnit(unit);
    const vocab = getVocabularyByUnitNumber(unit);
    const count = vocab.length;
    
    const status = count === 0 ? '❌ EMPTY' : count === 30 ? '✅ OK' : `⚠️  ${count} words`;
    
    console.log(`  Unit ${unit.toString().padStart(2)}: ${status}`);
    
    // Show first 3 words as sample
    if (count > 0) {
      console.log(`    Sample: ${vocab.slice(0, 3).map(v => v.word).join(', ')}`);
    }
  }
}

console.log('\n' + '='.repeat(60));
console.log('TEST COMPLETE');
console.log('='.repeat(60));
