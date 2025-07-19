import { Subject, SubjectUnit } from '../../schema/subjectTypes';
import { welcomeBackUnit } from './welcome-back';

export const grade5EnglishSubject: Subject = {
  id: 'english',
  name: 'اللغة الإنجليزية',
  nameEn: 'English',
  icon: '📚',
  color: 'from-blue-500 to-indigo-600',
  description: 'تعلم اللغة الإنجليزية من خلال المفردات والقواعد والتمارين التفاعلية',
  isActive: true,
  activities: ['flashcards', 'quiz', 'memory', 'pronunciation', 'grammar', 'spelling', 'sentence-writing', 'sentence-completion', 'test-exercises'],
  grade: 5
};

export const grade5EnglishUnits: SubjectUnit[] = [
  {
    id: 'welcome-back',
    name: 'مرحباً بالعودة',
    nameEn: 'Welcome Back',
    description: 'تعلم كلمات الترحيب والعودة للمدرسة',
    order: 1,
    isActive: true,
    estimatedTime: '45 دقيقة',
    difficulty: 'medium',
    topics: [welcomeBackUnit]
  }
];

// Export units and content
export * from './welcome-back';