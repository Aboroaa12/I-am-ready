import { VocabularyWord, GrammarRule, QuizQuestion } from '../schema/questionTypes';
import { getGradeData, getGradeSubjectData, getGradeSubjectUnitData } from '../grades';

// Legacy compatibility functions
export function getVocabularyByGrade(grade: number): VocabularyWord[] {
  const gradeData = getGradeData(grade);
  if (!gradeData) return [];
  
  const vocabulary: VocabularyWord[] = [];
  
  // Extract vocabulary from all subjects and units
  Object.values(gradeData.subjects).forEach((subjectData: any) => {
    if (subjectData.units) {
      subjectData.units.forEach((unit: any) => {
        if (unit.topics) {
          unit.topics.forEach((topic: any) => {
            if (topic.content?.vocabulary) {
              vocabulary.push(...topic.content.vocabulary);
            }
          });
        }
      });
    }
  });
  
  return vocabulary;
}

export function getGrammarByGrade(grade: number): GrammarRule[] {
  const gradeData = getGradeData(grade);
  if (!gradeData) return [];
  
  const grammar: GrammarRule[] = [];
  
  // Extract grammar from all subjects and units
  Object.values(gradeData.subjects).forEach((subjectData: any) => {
    if (subjectData.units) {
      subjectData.units.forEach((unit: any) => {
        if (unit.topics) {
          unit.topics.forEach((topic: any) => {
            if (topic.content?.grammar) {
              grammar.push(...topic.content.grammar);
            }
          });
        }
      });
    }
  });
  
  return grammar;
}

export function getQuestionsByGrade(grade: number): QuizQuestion[] {
  const gradeData = getGradeData(grade);
  if (!gradeData) return [];
  
  const questions: QuizQuestion[] = [];
  
  // Extract questions from all subjects and units
  Object.values(gradeData.subjects).forEach((subjectData: any) => {
    if (subjectData.units) {
      subjectData.units.forEach((unit: any) => {
        if (unit.topics) {
          unit.topics.forEach((topic: any) => {
            if (topic.content?.quiz) {
              questions.push(...topic.content.quiz);
            }
          });
        }
      });
    }
  });
  
  return questions;
}

export function getUnitsByGrade(grade: number): string[] {
  const vocabulary = getVocabularyByGrade(grade);
  return [...new Set(vocabulary.map(word => word.unit))];
}

export function getWordsByUnit(grade: number, unit: string): VocabularyWord[] {
  const vocabulary = getVocabularyByGrade(grade);
  return vocabulary.filter(word => word.unit === unit);
}

// New modular access functions
export function getVocabularyByGradeAndSubject(grade: number, subject: string): VocabularyWord[] {
  const subjectData = getGradeSubjectData(grade, subject);
  if (!subjectData?.units) return [];
  
  const vocabulary: VocabularyWord[] = [];
  subjectData.units.forEach((unit: any) => {
    if (unit.topics) {
      unit.topics.forEach((topic: any) => {
        if (topic.content?.vocabulary) {
          vocabulary.push(...topic.content.vocabulary);
        }
      });
    }
  });
  
  return vocabulary;
}

export function getVocabularyByUnit(grade: number, subject: string, unitId: string): VocabularyWord[] {
  const unitData = getGradeSubjectUnitData(grade, subject, unitId);
  if (!unitData?.topics) return [];
  
  const vocabulary: VocabularyWord[] = [];
  unitData.topics.forEach((topic: any) => {
    if (topic.content?.vocabulary) {
      vocabulary.push(...topic.content.vocabulary);
    }
  });
  
  return vocabulary;
}