import { UnitTopic } from '../../../schema/subjectTypes';
import { welcomeBackContent } from './content';

export const welcomeBackUnit: UnitTopic = {
  id: 'welcome-back',
  name: 'مرحباً بالعودة',
  nameEn: 'Welcome Back',
  description: 'تعلم كلمات الترحيب والعودة للمدرسة',
  order: 1,
  content: welcomeBackContent
};

export * from './content';