// Export all content for Animals unit
export * from './vocabulary';
export * from './grammar';
export * from './quiz';

import { animalsVocabulary } from './vocabulary';
import { animalsGrammar } from './grammar';
import { animalsQuiz } from './quiz';
import { createContentCollection } from '../../../../templates';

export const animalsContent = createContentCollection(
  animalsVocabulary,
  animalsGrammar,
  'Animals',
  1,
  'english'
);