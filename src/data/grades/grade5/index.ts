import { Grade, GradeData } from '../schema/gradeTypes';
import { grade5EnglishSubject, grade5EnglishUnits } from './english';

export const grade5: Grade = {
  id: 5,
  name: 'الصف الخامس',
  nameEn: 'Grade 5',
  description: 'المرحلة الأساسية المتوسطة',
  isActive: true,
  subjects: ['english']
};

export const grade5Data: GradeData = {
  grade: grade5,
  subjects: {
    english: {
      subject: grade5EnglishSubject,
      units: grade5EnglishUnits
    }
  }
};

// Export all grade 5 content
export * from './english';