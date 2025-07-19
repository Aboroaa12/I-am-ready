import { Grade, GradeData } from '../schema/gradeTypes';
import { grade1EnglishSubject, grade1EnglishUnits } from './english';

export const grade1: Grade = {
  id: 1,
  name: 'الصف الأول',
  nameEn: 'Grade 1',
  description: 'المرحلة الأساسية الأولى',
  isActive: true,
  subjects: ['english']
};

export const grade1Data: GradeData = {
  grade: grade1,
  subjects: {
    english: {
      subject: grade1EnglishSubject,
      units: grade1EnglishUnits
    }
  }
};

// Export all grade 1 content
export * from './english';