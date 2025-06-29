import { GrammarRule, QuizQuestion } from '../types';
import { grade1Grammar, grade1Questions } from './grade1Data';
import { grade2Grammar, grade2Questions } from './grade2Data';
import { grade3Grammar, grade3Questions } from './grade3Data';
import { grade4Grammar, grade4Questions } from './grade4Data';
import { grade5Grammar, grade5Questions } from './grade5Data';
import { grade6Grammar, grade6Questions } from './grade6Data';
import { grade9Grammar, grade9Questions } from './grade9Data';
import { grade10Grammar, grade10Questions } from './grade10Data';
import { grade11Grammar, grade11Questions } from './grade11Data';
import { grade12Grammar, grade12Questions } from './grade12Data';

// Grammar rules organized by grade
export const grammarByGrade: { [key: number]: GrammarRule[] } = {
  1: grade1Grammar,
  2: grade2Grammar,
  3: grade3Grammar,
  4: grade4Grammar,
  5: grade5Grammar,
  6: grade6Grammar,
  9: grade9Grammar,
  10: grade10Grammar,
  11: grade11Grammar,
  12: grade12Grammar
};

export const questionsByGrade: { [key: number]: QuizQuestion[] } = {
  1: grade1Questions,
  2: grade2Questions,
  3: grade3Questions,
  4: grade4Questions,
  5: grade5Questions,
  6: grade6Questions,
  9: grade9Questions,
  10: grade10Questions,
  11: grade11Questions,
  12: grade12Questions
};

export const getGrammarByGrade = (grade: number): GrammarRule[] => {
  const rules = grammarByGrade[grade] || [];
  console.log(`الصف ${grade}: تم تحميل ${rules.length} قاعدة نحوية`);
  return rules;
};

export const getQuestionsByGrade = (grade: number): QuizQuestion[] => {
  const questions = questionsByGrade[grade] || [];
  console.log(`الصف ${grade}: تم تحميل ${questions.length} سؤال`);
  return questions;
};

// For backward compatibility with existing code
export const grammarRules = grade5Grammar;
export const grammarQuestions = grade5Questions;