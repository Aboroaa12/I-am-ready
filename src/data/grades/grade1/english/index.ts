import { Subject, SubjectUnit } from '../../schema/subjectTypes';
import { familyUnit } from './family';
import { animalsUnit } from './animals';

export const grade1EnglishSubject: Subject = {
  id: 'english',
  name: 'اللغة الإنجليزية',
  nameEn: 'English',
  icon: '📚',
  color: 'from-blue-500 to-indigo-600',
  description: 'تعلم اللغة الإنجليزية من خلال المفردات والقواعد والتمارين التفاعلية',
  isActive: true,
  activities: ['flashcards', 'quiz', 'memory', 'pronunciation', 'grammar', 'spelling', 'sentence-writing', 'sentence-completion', 'test-exercises'],
  grade: 1
};

export const grade1EnglishUnits: SubjectUnit[] = [
  {
    id: 'family',
    name: 'العائلة',
    nameEn: 'Family',
    description: 'تعرف على أفراد العائلة',
    order: 1,
    isActive: true,
    estimatedTime: '30 دقيقة',
    difficulty: 'easy',
    topics: [familyUnit]
  },
  {
    id: 'animals',
    name: 'الحيوانات',
    nameEn: 'Animals',
    description: 'اكتشف عالم الحيوانات',
    order: 2,
    isActive: true,
    estimatedTime: '30 دقيقة',
    difficulty: 'easy',
    topics: [animalsUnit]
  }
];

// Export units and content
export * from './family';
export * from './animals';