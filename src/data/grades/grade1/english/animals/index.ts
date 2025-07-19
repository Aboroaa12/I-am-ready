import { UnitTopic } from '../../../schema/subjectTypes';
import { animalsContent } from './content';

export const animalsUnit: UnitTopic = {
  id: 'animals',
  name: 'الحيوانات',
  nameEn: 'Animals',
  description: 'اكتشف عالم الحيوانات',
  order: 2,
  content: animalsContent
};

export * from './content';