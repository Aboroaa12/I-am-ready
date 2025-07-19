// Export all template functions
export * from './multipleChoice';
export * from './trueFalse';
export * from './flashcard';
export * from './investigation';

// Utility functions for creating content collections
import { VocabularyWord, GrammarRule } from '../schema/questionTypes';
import { ContentCollection } from '../schema/subjectTypes';
import { createQuizFromVocabulary } from './multipleChoice';
import { createFlashcardsFromVocabulary } from './flashcard';

export function createContentCollection(
  vocabulary: VocabularyWord[] = [],
  grammar: GrammarRule[] = [],
  unit: string = '',
  grade: number = 5,
  subject: string = 'english'
): ContentCollection {
  return {
    vocabulary,
    grammar,
    quiz: createQuizFromVocabulary(vocabulary, unit, grade, subject),
    activities: [],
    flashcards: createFlashcardsFromVocabulary(vocabulary)
  };
}

export function createUnitFromLegacyData(
  unitName: string,
  vocabulary: VocabularyWord[],
  grammar: GrammarRule[],
  grade: number,
  subject: string = 'english'
): ContentCollection {
  return createContentCollection(vocabulary, grammar, unitName, grade, subject);
}