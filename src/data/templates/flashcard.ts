import { Flashcard } from '../schema/subjectTypes';
import { VocabularyWord } from '../schema/questionTypes';

export function createFlashcard(
  id: string,
  front: string,
  back: string,
  type: 'vocabulary' | 'grammar' | 'concept' = 'vocabulary',
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  tags: string[] = []
): Flashcard {
  return {
    id,
    front,
    back,
    type,
    difficulty,
    tags
  };
}

export function createVocabularyFlashcard(
  word: VocabularyWord,
  includeExample: boolean = false
): Flashcard {
  const front = word.english;
  let back = word.arabic;
  
  if (word.pronunciation) {
    back += `\n\nالنطق: ${word.pronunciation}`;
  }
  
  if (includeExample && word.exampleSentence) {
    back += `\n\nمثال: ${word.exampleSentence}`;
  }
  
  return createFlashcard(
    `flashcard-${word.english}`,
    front,
    back,
    'vocabulary',
    word.difficulty || 'medium',
    [word.unit, word.partOfSpeech || 'general', `grade-${word.grade}`].filter(Boolean)
  );
}

export function createGrammarFlashcard(
  grammarRule: any,
  exampleIndex: number = 0
): Flashcard {
  const front = grammarRule.title;
  let back = grammarRule.explanation;
  
  if (grammarRule.examples && grammarRule.examples[exampleIndex]) {
    back += `\n\nمثال: ${grammarRule.examples[exampleIndex]}`;
  }
  
  return createFlashcard(
    `flashcard-grammar-${grammarRule.title}-${exampleIndex}`,
    front,
    back,
    'grammar',
    'medium',
    [grammarRule.unit, 'grammar', `grade-${grammarRule.grade}`]
  );
}

export function createFlashcardsFromVocabulary(
  vocabularyWords: VocabularyWord[],
  includeExamples: boolean = false
): Flashcard[] {
  return vocabularyWords.map(word => createVocabularyFlashcard(word, includeExamples));
}