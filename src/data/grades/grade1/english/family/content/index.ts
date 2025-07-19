// Export all content for Family unit
export * from './vocabulary';
export * from './grammar';
export * from './quiz';

import { familyVocabulary } from './vocabulary';
import { familyGrammar } from './grammar';
import { familyQuiz } from './quiz';
import { createContentCollection } from '../../../../templates';

export const familyContent = createContentCollection(
  familyVocabulary,
  familyGrammar,
  'Family',
  1,
  'english'
);