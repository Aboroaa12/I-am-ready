import { MultipleChoiceQuestion } from '../schema/questionTypes';

export function createMultipleChoiceQuestion(
  id: string,
  question: string,
  options: string[],
  correctAnswerIndex: number,
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  explanation?: string,
  unit: string = '',
  grade: number = 5,
  subject: string = 'english',
  tags: string[] = [],
  timeLimit?: number,
  points: number = 10
): MultipleChoiceQuestion {
  if (options.length < 2) {
    throw new Error('Multiple choice questions must have at least 2 options');
  }
  
  if (correctAnswerIndex < 0 || correctAnswerIndex >= options.length) {
    throw new Error('Correct answer index must be within the options range');
  }

  return {
    id,
    type: 'multiple-choice',
    question,
    options,
    correctAnswer: correctAnswerIndex,
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

export function createQuizFromVocabulary(
  vocabularyWords: any[],
  unit: string,
  grade: number,
  subject: string = 'english'
): MultipleChoiceQuestion[] {
  return vocabularyWords.map((word, index) => {
    // Create wrong options from other words
    const wrongOptions = vocabularyWords
      .filter(w => w.arabic !== word.arabic)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.arabic);
    
    const options = [word.arabic, ...wrongOptions].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(word.arabic);
    
    return createMultipleChoiceQuestion(
      `vocab-${word.english}-${index}`,
      `ما معنى كلمة "${word.english}"؟`,
      options,
      correctIndex,
      word.unit || unit,
      word.difficulty || 'medium',
      `${word.english} تعني ${word.arabic}`,
      unit,
      grade,
      subject,
      ['vocabulary', word.partOfSpeech || 'general'].filter(Boolean)
    );
  });
}