import { VocabularyWord } from '../types';
import { grade1Vocabulary } from './grade1Data';
import { grade2Vocabulary } from './grade2Data';
import { grade3Vocabulary } from './grade3Data';
import { grade4Vocabulary } from './grade4Data';
import { grade5Vocabulary } from './grade5Data';
import { grade6Vocabulary } from './grade6Data';
import { grade8Vocabulary } from './grade8Data';
import { grade9Vocabulary } from './grade9Data';
import { grade10Vocabulary } from './grade10Data';
import { grade11Vocabulary } from './grade11Data';
import { grade12Vocabulary } from './grade12Data';
import { grade5AllVocabulary } from './grade5Data';

// Vocabulary organized by grade
export const vocabularyByGrade: { [key: number]: VocabularyWord[] } = {
  1: grade1Vocabulary,
  2: grade2Vocabulary,
  3: grade3Vocabulary,
  4: grade4Vocabulary,
  5: grade5AllVocabulary,
  6: grade6Vocabulary,
  8: grade8Vocabulary,
  9: grade9Vocabulary,
  10: grade10Vocabulary,
  11: grade11Vocabulary,
  12: grade12Vocabulary
};

// Get all vocabulary words
export const getAllVocabulary = (): VocabularyWord[] => {
  let allWords: VocabularyWord[] = [];
  Object.values(vocabularyByGrade).forEach(gradeWords => {
    allWords = [...allWords, ...gradeWords];
  });
  return allWords;
};

// Get vocabulary by grade
export const getVocabularyByGrade = (grade: number): VocabularyWord[] => {
  const words = vocabularyByGrade[grade] || [];
  console.log(`الصف ${grade}: تم تحميل ${words.length} كلمة`);
  return words;
};

// Get units by grade
export const getUnitsByGrade = (grade: number): string[] => {
  const words = vocabularyByGrade[grade] || [];
  const units = [...new Set(words.map(word => word.unit))];
  console.log(`الصف ${grade}: تم تحميل ${units.length} وحدة`);
  return units;
};

// Get words by unit
export const getWordsByUnit = (grade: number, unit: string): VocabularyWord[] => {
  const words = vocabularyByGrade[grade] || [];
  return words.filter(word => word.unit === unit);
};

// For backward compatibility with existing code
export const vocabularyWords = grade5Vocabulary;