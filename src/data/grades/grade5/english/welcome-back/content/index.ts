// Export all content for Welcome Back unit
export * from './vocabulary';
export * from './grammar';
export * from './quiz';

import { welcomeBackVocabulary } from './vocabulary';
import { welcomeBackGrammar } from './grammar';
import { welcomeBackQuiz } from './quiz';
import { createContentCollection } from '../../../../templates';

export const welcomeBackContent = createContentCollection(
  welcomeBackVocabulary,
  welcomeBackGrammar,
  'Welcome Back',
  5,
  'english'
);