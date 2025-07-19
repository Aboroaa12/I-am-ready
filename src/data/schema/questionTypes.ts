export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'essay' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  unit: string;
  grade: number;
  subject: string;
  tags?: string[];
  timeLimit?: number;
  points?: number;
}

export interface MultipleChoiceQuestion extends Question {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: number;
}

export interface TrueFalseQuestion extends Question {
  type: 'true-false';
  correctAnswer: boolean;
}

export interface FillBlankQuestion extends Question {
  type: 'fill-blank';
  correctAnswer: string;
  hints?: string[];
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  content: string;
  contentType: 'text' | 'image' | 'video' | 'audio' | 'interactive';
  subject: string;
  unit: string;
  grade: number;
  semester?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Investigation {
  id: string;
  title: string;
  objective: string;
  materials: string[];
  procedure: string[];
  expectedResults: string;
  conclusion: string;
  safetyNotes?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  grade: number;
  subject: string;
  unit: string;
  topic: string;
}

// Re-export specific question types from main types
export type { 
  VocabularyWord, 
  GrammarRule, 
  QuizQuestion,
  MathProblem,
  ScienceExperiment,
  IslamicContent,
  ArabicContent
} from '../../types';