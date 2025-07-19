// Main data export file
export * from './schema';
export * from './templates';
export * from './grades';
export * from './utils/dataAccess';

// Re-export for backward compatibility
export { getVocabularyByGrade, getGrammarByGrade, getQuestionsByGrade, getUnitsByGrade, getWordsByUnit } from './utils/dataAccess';
export * from './grade5MathData';

// Export legacy data for gradual migration
export * from './vocabulary';
export * from './grammar';