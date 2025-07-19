export interface Subject {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  description: string;
  isActive: boolean;
  activities?: ActivityType[];
  createdAt?: string;
  updatedAt?: string;
  grade?: number | null;
  semester?: string;
}

export interface SubjectUnit {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  order: number;
  isActive: boolean;
  estimatedTime?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  topics: UnitTopic[];
}

export interface UnitTopic {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  order: number;
  content: ContentCollection;
}

export interface ContentCollection {
  vocabulary: VocabularyWord[];
  grammar: GrammarRule[];
  quiz: QuizQuestion[];
  activities: Activity[];
  flashcards: Flashcard[];
}

export interface Activity {
  id: string;
  type: ActivityType;
  name: string;
  description: string;
  content: any;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  type: 'vocabulary' | 'grammar' | 'concept';
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export type ActivityType = 'flashcards' | 'quiz' | 'memory' | 'pronunciation' | 'grammar' | 'spelling' | 'sentence-writing' | 'sentence-completion' | 'test-exercises';

// Re-export types from the main types file for backward compatibility
export type { VocabularyWord, GrammarRule, QuizQuestion } from '../../types';