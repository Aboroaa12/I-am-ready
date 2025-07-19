import { TrueFalseQuestion } from '../schema/questionTypes';

export function createTrueFalseQuestion(
  id: string,
  question: string,
  correctAnswer: boolean,
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  explanation?: string,
  unit: string = '',
  grade: number = 5,
  subject: string = 'english',
  tags: string[] = [],
  timeLimit?: number,
  points: number = 5
): TrueFalseQuestion {
  return {
    id,
    type: 'true-false',
    question,
    correctAnswer,
    explanation,
    difficulty,
    topic,
    unit,
    grade,
    subject,
    tags,
    timeLimit,
    points
  };
}

export function createGrammarTrueFalse(
  grammarRule: any,
  unit: string,
  grade: number,
  subject: string = 'english'
): TrueFalseQuestion[] {
  const questions: TrueFalseQuestion[] = [];
  
  // Create true/false questions from grammar examples
  grammarRule.examples.forEach((example: string, index: number) => {
    // Create a true statement
    questions.push(createTrueFalseQuestion(
      `grammar-true-${grammarRule.title}-${index}`,
      `هل هذه الجملة صحيحة نحوياً؟ "${example}"`,
      true,
      grammarRule.title,
      'medium',
      `هذه الجملة صحيحة وفقاً لقاعدة: ${grammarRule.title}`,
      unit,
      grade,
      subject,
      ['grammar', 'true-false']
    ));
  });
  
  return questions;
}