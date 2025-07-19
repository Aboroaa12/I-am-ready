import { UnitTopic } from '../../../schema/subjectTypes';
import { familyContent } from './content';

export const familyUnit: UnitTopic = {
  id: 'family',
  name: 'العائلة',
  nameEn: 'Family',
  description: 'تعرف على أفراد العائلة',
  order: 1,
  content: familyContent
};

export * from './content';