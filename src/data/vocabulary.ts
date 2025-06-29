import { VocabularyWord } from '../types';
import { grade1Vocabulary } from './grade1Data';
import { grade2Vocabulary } from './grade2Data';
import { grade3Vocabulary } from './grade3Data';
import { grade4Vocabulary } from './grade4Data';
import { grade5Vocabulary } from './grade5Data';
import { grade6Vocabulary } from './grade6Data';
import { grade9Vocabulary } from './grade9Data';
import { grade10Vocabulary } from './grade10Data';
import { grade11Vocabulary } from './grade11Data';
import { grade12Vocabulary } from './grade12Data';

// تحديث البيانات لتشمل معلومات أكثر تفصيلاً
const enhanceVocabularyData = (words: VocabularyWord[]): VocabularyWord[] => {
  return words.map(word => ({
    ...word,
    partOfSpeech: word.partOfSpeech || getPartOfSpeech(word.english),
    exampleSentence: word.exampleSentence || generateExampleSentence(word),
    difficulty: word.difficulty || getDifficulty(word.english)
  }));
};

const getPartOfSpeech = (word: string): VocabularyWord['partOfSpeech'] => {
  const nouns = ['cat', 'dog', 'book', 'house', 'school', 'teacher', 'student', 'family', 'mother', 'father', 'computer', 'phone', 'car', 'tree', 'water', 'food', 'apple', 'banana', 'baby', 'sister', 'brother', 'talent', 'show', 'stage', 'audience', 'adventure', 'treasure', 'map', 'compass', 'cave', 'forest', 'mountain', 'shopping', 'market', 'store', 'price', 'money', 'customer'];
  const verbs = ['run', 'walk', 'eat', 'drink', 'play', 'study', 'read', 'write', 'swim', 'jump', 'sing', 'dance', 'cook', 'sleep', 'work', 'help', 'learn', 'teach', 'perform', 'explore', 'discover', 'remember', 'miss', 'buy', 'sell', 'change'];
  const adjectives = ['big', 'small', 'happy', 'sad', 'beautiful', 'ugly', 'hot', 'cold', 'fast', 'slow', 'good', 'bad', 'new', 'old', 'young', 'tall', 'short', 'kind', 'clever', 'brave', 'red', 'blue', 'green', 'yellow', 'black', 'white', 'excited', 'modern', 'expensive', 'cheap'];
  const interjections = ['hello', 'goodbye', 'yes', 'no', 'please', 'thank you', 'welcome'];
  const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  
  if (nouns.includes(word.toLowerCase())) return 'noun';
  if (verbs.includes(word.toLowerCase())) return 'verb';
  if (adjectives.includes(word.toLowerCase())) return 'adjective';
  if (interjections.includes(word.toLowerCase())) return 'interjection';
  if (numbers.includes(word.toLowerCase())) return 'noun'; // Numbers are treated as nouns
  
  // تخمين بناءً على النهايات الشائعة
  if (word.endsWith('ing')) return 'verb';
  if (word.endsWith('ly')) return 'adverb';
  if (word.endsWith('tion') || word.endsWith('sion')) return 'noun';
  if (word.endsWith('ful') || word.endsWith('less')) return 'adjective';
  
  return 'noun'; // افتراضي
};

const generateExampleSentence = (word: VocabularyWord): string => {
  const templates = {
    noun: [
      `I have a ${word.english}.`,
      `The ${word.english} is very nice.`,
      `She likes the ${word.english}.`,
      `We use the ${word.english} every day.`
    ],
    verb: [
      `I ${word.english} every day.`,
      `She can ${word.english} very well.`,
      `They ${word.english} together.`,
      `We like to ${word.english}.`
    ],
    adjective: [
      `The cat is very ${word.english}.`,
      `She looks ${word.english} today.`,
      `This book is ${word.english}.`,
      `I feel ${word.english}.`
    ],
    interjection: [
      `${word.english}! How are you?`,
      `She said "${word.english}" to everyone.`,
      `${word.english}, I am fine.`,
      `We always say "${word.english}".`
    ]
  };
  
  const partOfSpeech = word.partOfSpeech || 'noun';
  const sentenceTemplates = templates[partOfSpeech as keyof typeof templates] || templates.noun;
  return sentenceTemplates[Math.floor(Math.random() * sentenceTemplates.length)];
};

const getDifficulty = (word: string): VocabularyWord['difficulty'] => {
  if (word.length <= 4) return 'easy';
  if (word.length <= 7) return 'medium';
  return 'hard';
};

// إنشاء مجموعة فريدة من الكلمات لكل صف مع تحسين الجودة
const createUniqueWordSet = (words: VocabularyWord[]): VocabularyWord[] => {
  const uniqueWords = new Map<string, VocabularyWord>();
  
  words.forEach(word => {
    const key = word.english.toLowerCase().trim();
    if (!uniqueWords.has(key)) {
      uniqueWords.set(key, word);
    } else {
      // إذا كانت الكلمة موجودة، احتفظ بالنسخة الأكثر تفصيلاً
      const existing = uniqueWords.get(key)!;
      const enhanced = {
        ...existing,
        pronunciation: word.pronunciation || existing.pronunciation,
        exampleSentence: word.exampleSentence || existing.exampleSentence,
        partOfSpeech: word.partOfSpeech || existing.partOfSpeech
      };
      uniqueWords.set(key, enhanced);
    }
  });
  
  return Array.from(uniqueWords.values()).sort((a, b) => a.english.localeCompare(b.english));
};

// كلمات نموذجية للصفوف مع التحسينات والتأكد من عدم التكرار
export const sampleVocabularyByGrade: { [key: number]: VocabularyWord[] } = {
  1: createUniqueWordSet(enhanceVocabularyData(grade1Vocabulary)),
  2: createUniqueWordSet(enhanceVocabularyData(grade2Vocabulary)),
  3: createUniqueWordSet(enhanceVocabularyData(grade3Vocabulary)),
  4: createUniqueWordSet(enhanceVocabularyData(grade4Vocabulary)),
  5: createUniqueWordSet(enhanceVocabularyData(grade5Vocabulary)),
  6: createUniqueWordSet(enhanceVocabularyData(grade6Vocabulary)),
  9: createUniqueWordSet(enhanceVocabularyData(grade9Vocabulary)),
  10: createUniqueWordSet(enhanceVocabularyData(grade10Vocabulary)),
  11: createUniqueWordSet(enhanceVocabularyData(grade11Vocabulary)),
  12: createUniqueWordSet(enhanceVocabularyData(grade12Vocabulary))
};

export const getVocabularyByGrade = (grade: number): VocabularyWord[] => {
  const words = sampleVocabularyByGrade[grade] || [];
  
  console.log(`الصف ${grade}: تم تحميل ${words.length} كلمة فريدة`);
  
  // التحقق من عدم وجود تكرار
  const wordCounts = new Map<string, number>();
  words.forEach(word => {
    const key = word.english.toLowerCase();
    wordCounts.set(key, (wordCounts.get(key) || 0) + 1);
  });
  
  const duplicates = Array.from(wordCounts.entries()).filter(([_, count]) => count > 1);
  if (duplicates.length > 0) {
    console.warn(`تم العثور على كلمات مكررة في الصف ${grade}:`, duplicates);
  }
  
  return words;
};

export const getAllVocabulary = (): VocabularyWord[] => {
  return Object.values(sampleVocabularyByGrade).flat();
};

export const getUnitsByGrade = (grade: number): string[] => {
  const words = getVocabularyByGrade(grade);
  const units = [...new Set(words.map(word => word.unit))];
  console.log(`الصف ${grade}: تم تحميل ${units.length} وحدة فريدة:`, units);
  return units;
};

// للتوافق مع الكود الحالي
export const vocabularyData = grade5Vocabulary;
export const units = getUnitsByGrade(5);