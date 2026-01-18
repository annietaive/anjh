import { Vocabulary } from './allLessons';

/**
 * COMPLETE VOCABULARY DATABASE FOR ALL 48 UNITS
 * Each unit gets exactly 30 unique words - total 1,440 words
 * No duplication between units
 * Import from part1 (units 1-24) and part2 (units 25-48)
 */

import { 
  unit1Vocabulary, unit2Vocabulary, unit3Vocabulary, unit4Vocabulary,
  unit5Vocabulary, unit6Vocabulary, unit7Vocabulary, unit8Vocabulary,
  unit9Vocabulary, unit10Vocabulary, unit11Vocabulary, unit12Vocabulary,
  unit13Vocabulary, unit14Vocabulary, unit15Vocabulary, unit16Vocabulary,
  unit17Vocabulary, unit18Vocabulary, unit19Vocabulary, unit20Vocabulary,
  unit21Vocabulary, unit22Vocabulary, unit23Vocabulary, unit24Vocabulary,
  getVocabularyByUnitId as getVocabPart1
} from './unitVocabularyDatabase-part1';

import {
  unit25Vocabulary, unit26Vocabulary, unit27Vocabulary, unit28Vocabulary,
  unit29Vocabulary, unit30Vocabulary, unit31Vocabulary, unit32Vocabulary,
  unit33Vocabulary, unit34Vocabulary, unit35Vocabulary, unit36Vocabulary,
  unit37Vocabulary, unit38Vocabulary, unit39Vocabulary, unit40Vocabulary,
  unit41Vocabulary, unit42Vocabulary, unit43Vocabulary, unit44Vocabulary,
  unit45Vocabulary, unit46Vocabulary, unit47Vocabulary, unit48Vocabulary
} from './unitVocabularyDatabase-part2';

// ============================================================
// UNIT VOCABULARY MAP - Maps unit number to vocabulary array
// ============================================================

const unitVocabularyMap: Record<number, Vocabulary[]> = {
  // Grade 6 (Units 1-12)
  1: unit1Vocabulary,
  2: unit2Vocabulary,
  3: unit3Vocabulary,
  4: unit4Vocabulary,
  5: unit5Vocabulary,
  6: unit6Vocabulary,
  7: unit7Vocabulary,
  8: unit8Vocabulary,
  9: unit9Vocabulary,
  10: unit10Vocabulary,
  11: unit11Vocabulary,
  12: unit12Vocabulary,
  
  // Grade 7 (Units 13-24)
  13: unit13Vocabulary,
  14: unit14Vocabulary,
  15: unit15Vocabulary,
  16: unit16Vocabulary,
  17: unit17Vocabulary,
  18: unit18Vocabulary,
  19: unit19Vocabulary,
  20: unit20Vocabulary,
  21: unit21Vocabulary,
  22: unit22Vocabulary,
  23: unit23Vocabulary,
  24: unit24Vocabulary,
  
  // Grade 8 (Units 25-36) - Now complete from part2
  25: unit25Vocabulary,
  26: unit26Vocabulary,
  27: unit27Vocabulary,
  28: unit28Vocabulary,
  29: unit29Vocabulary,
  30: unit30Vocabulary,
  31: unit31Vocabulary,
  32: unit32Vocabulary,
  33: unit33Vocabulary,
  34: unit34Vocabulary,
  35: unit35Vocabulary,
  36: unit36Vocabulary,
  
  // Grade 9 (Units 37-48) - Now complete from part2
  37: unit37Vocabulary,
  38: unit38Vocabulary,
  39: unit39Vocabulary,
  40: unit40Vocabulary,
  41: unit41Vocabulary,
  42: unit42Vocabulary,
  43: unit43Vocabulary,
  44: unit44Vocabulary,
  45: unit45Vocabulary,
  46: unit46Vocabulary,
  47: unit47Vocabulary,
  48: unit48Vocabulary
};

// ============================================================
// PUBLIC API FUNCTIONS
// ============================================================

/**
 * Check if vocabulary exists for a specific unit number
 */
export function hasVocabularyForUnit(unitNumber: number): boolean {
  return unitNumber >= 1 && unitNumber <= 48 && 
         unitVocabularyMap[unitNumber] !== undefined &&
         unitVocabularyMap[unitNumber].length > 0;
}

/**
 * Get vocabulary for a specific unit number (1-48)
 * Returns exactly 30 unique words for the unit
 */
export function getVocabularyByUnitNumber(unitNumber: number): Vocabulary[] {
  if (!hasVocabularyForUnit(unitNumber)) {
    console.warn(`No vocabulary found for unit ${unitNumber}, returning empty array`);
    return [];
  }
  
  return unitVocabularyMap[unitNumber];
}

/**
 * Get all vocabulary across all units
 * Returns words from units that have vocabulary defined
 */
export function getAllVocabulary(): Vocabulary[] {
  const allVocab: Vocabulary[] = [];
  for (let i = 1; i <= 48; i++) {
    if (hasVocabularyForUnit(i)) {
      allVocab.push(...getVocabularyByUnitNumber(i));
    }
  }
  return allVocab;
}

/**
 * Get statistics about the vocabulary database
 */
export function getVocabularyStats() {
  let totalWords = 0;
  let unitsWithVocab = 0;
  
  for (let i = 1; i <= 48; i++) {
    if (hasVocabularyForUnit(i)) {
      totalWords += unitVocabularyMap[i].length;
      unitsWithVocab++;
    }
  }
  
  return {
    totalUnits: 48,
    unitsWithVocabulary: unitsWithVocab,
    wordsPerUnit: 30,
    totalWords: totalWords,
    grade6Words: 360, // 12 units × 30 (units 1-12)
    grade7Words: 360, // 12 units × 30 (units 13-24)
    grade8Words: 360, // 12 units × 30 (units 25-36) - Complete
    grade9Words: 360, // 12 units × 30 (units 37-48) - Complete
  };
}