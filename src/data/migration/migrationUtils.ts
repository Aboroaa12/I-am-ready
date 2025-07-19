import { VocabularyWord, GrammarRule, QuizQuestion } from '../schema/questionTypes';
import { createContentCollection } from '../templates';

/**
 * Utility functions to help with data migration from legacy format to modular format
 */

export function migrateVocabularyUnit(
  legacyWords: VocabularyWord[],
  unitName: string,
  grade: number,
  subject: string = 'english'
): VocabularyWord[] {
  return legacyWords
    .filter(word => word.unit === unitName)
    .map(word => ({
      ...word,
      subject: word.subject || subject,
      grade: word.grade || grade,
      id: word.id || `${word.english}-${grade}-${unitName}`
    }));
}

export function migrateGrammarUnit(
  legacyGrammar: GrammarRule[],
  unitName: string,
  grade: number,
  subject: string = 'english'
): GrammarRule[] {
  return legacyGrammar
    .filter(rule => rule.unit === unitName)
    .map(rule => ({
      ...rule,
      subject: rule.subject || subject,
      grade: rule.grade || grade,
      id: rule.id || `${rule.title.toLowerCase().replace(/\s+/g, '-')}-${grade}-${unitName}`
    }));
}

export function migrateQuizUnit(
  legacyQuestions: QuizQuestion[],
  unitName: string,
  grade: number,
  subject: string = 'english'
): QuizQuestion[] {
  return legacyQuestions
    .filter(question => question.unit === unitName)
    .map(question => ({
      ...question,
      subject: question.subject || subject,
      grade: question.grade || grade,
      id: question.id || `quiz-${grade}-${unitName}-${legacyQuestions.indexOf(question)}`
    }));
}

export function createUnitFromLegacyData(
  legacyVocab: VocabularyWord[],
  legacyGrammar: GrammarRule[],
  legacyQuestions: QuizQuestion[],
  unitName: string,
  grade: number,
  subject: string = 'english'
) {
  const vocabulary = migrateVocabularyUnit(legacyVocab, unitName, grade, subject);
  const grammar = migrateGrammarUnit(legacyGrammar, unitName, grade, subject);
  const quiz = migrateQuizUnit(legacyQuestions, unitName, grade, subject);
  
  return {
    vocabulary,
    grammar,
    quiz,
    content: createContentCollection(vocabulary, grammar, unitName, grade, subject)
  };
}

export function extractUnitsFromLegacyData(
  legacyVocab: VocabularyWord[],
  legacyGrammar: GrammarRule[],
  legacyQuestions: QuizQuestion[]
): string[] {
  const vocabUnits = new Set(legacyVocab.map(word => word.unit));
  const grammarUnits = new Set(legacyGrammar.map(rule => rule.unit));
  const questionUnits = new Set(legacyQuestions.map(q => q.unit));
  
  return Array.from(new Set([...vocabUnits, ...grammarUnits, ...questionUnits]));
}

export function generateMigrationReport(
  grade: number,
  legacyVocab: VocabularyWord[],
  legacyGrammar: GrammarRule[],
  legacyQuestions: QuizQuestion[]
): string {
  const units = extractUnitsFromLegacyData(legacyVocab, legacyGrammar, legacyQuestions);
  
  let report = `# Migration Report for Grade ${grade}\n\n`;
  report += `## Summary\n`;
  report += `- Total vocabulary words: ${legacyVocab.length}\n`;
  report += `- Total grammar rules: ${legacyGrammar.length}\n`;
  report += `- Total quiz questions: ${legacyQuestions.length}\n`;
  report += `- Total units: ${units.length}\n\n`;
  
  report += `## Units to migrate:\n`;
  units.forEach(unit => {
    const vocabCount = legacyVocab.filter(w => w.unit === unit).length;
    const grammarCount = legacyGrammar.filter(r => r.unit === unit).length;
    const questionCount = legacyQuestions.filter(q => q.unit === unit).length;
    
    report += `- **${unit}**: ${vocabCount} words, ${grammarCount} grammar rules, ${questionCount} questions\n`;
  });
  
  return report;
}