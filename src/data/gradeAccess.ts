import { GradeAccess, Teacher } from '../types';

// Access codes for different grades
export const gradeAccessCodes: GradeAccess[] = [
  { grade: 0, name: 'المدير', code: 'ADMIN2024', isAdmin: true },
  { grade: 1, name: 'الصف الأول', code: 'GRADE1' },
  { grade: 2, name: 'الصف الثاني', code: 'GRADE2' },
  { grade: 3, name: 'الصف الثالث', code: 'GRADE3' },
  { grade: 4, name: 'الصف الرابع', code: 'GRADE4' },
  { grade: 5, name: 'الصف الخامس', code: 'GRADE5' },
  { grade: 6, name: 'الصف السادس', code: 'GRADE6' },
  { grade: 7, name: 'الصف السابع', code: 'GRADE7' },
  { grade: 8, name: 'الصف الثامن', code: 'GRADE8KEY1' },
  { grade: 9, name: 'الصف التاسع', code: 'GRADE9' },
  { grade: 10, name: 'الصف العاشر', code: 'GRADE10' },
  { grade: 11, name: 'الصف الحادي عشر', code: 'GRADE11' },
  { grade: 12, name: 'الصف الثاني عشر', code: 'GRADE12' },
  { grade: 5, name: 'معلم اللغة الإنجليزية', code: 'TEACHER5', isTeacher: true, teacherId: 'teacher-1' },
  { grade: 6, name: 'معلم اللغة الإنجليزية', code: 'TEACHER6', isTeacher: true, teacherId: 'teacher-1' },
  { grade: 8, name: 'معلم اللغة الإنجليزية', code: 'TEACHER8', isTeacher: true, teacherId: 'teacher-1' },
  { grade: 9, name: 'معلم اللغة الإنجليزية', code: 'TEACHER9', isTeacher: true, teacherId: 'teacher-2' },
  { grade: 10, name: 'معلم اللغة الإنجليزية', code: 'TEACHER10', isTeacher: true, teacherId: 'teacher-2' },
  { grade: 11, name: 'معلم اللغة الإنجليزية', code: 'TEACHER11', isTeacher: true, teacherId: 'teacher-3' },
  { grade: 12, name: 'معلم اللغة الإنجليزية', code: 'TEACHER12', isTeacher: true, teacherId: 'teacher-3' }
];

// Teacher data
export const teachersData: { [key: string]: Teacher } = {
  'teacher-1': {
    id: 'teacher-1',
    name: 'فاطمة أحمد',
    email: 'fatima@school.edu',
    phone: '96895123456',
    grades: [5, 6, 8],
    students: [],
    joinDate: '2023-08-15T00:00:00.000Z',
    isActive: true,
    schoolName: 'مدرسة الأمل الدولية',
    subjects: ['اللغة الإنجليزية']
  },
  'teacher-2': {
    id: 'teacher-2',
    name: 'محمد علي',
    email: 'mohammed@school.edu',
    phone: '96895789012',
    grades: [9, 10],
    students: [],
    joinDate: '2022-09-01T00:00:00.000Z',
    isActive: true,
    schoolName: 'مدرسة الأمل الدولية',
    subjects: ['اللغة الإنجليزية']
  },
  'teacher-3': {
    id: 'teacher-3',
    name: 'خالد سعيد',
    email: 'khalid@school.edu',
    phone: '96895345678',
    grades: [11, 12],
    students: [],
    joinDate: '2021-08-20T00:00:00.000Z',
    isActive: true,
    schoolName: 'مدرسة الأمل الدولية',
    subjects: ['اللغة الإنجليزية']
  }
};

// Get grade access by code
export const getGradeByCode = (code: string): GradeAccess | null => {
  const gradeAccess = gradeAccessCodes.find(
    access => access.code.toLowerCase() === code.toLowerCase()
  );
  return gradeAccess || null;
};

// Get teacher by code
export const getTeacherByCode = (code: string): Teacher | null => {
  const gradeAccess = getGradeByCode(code);
  if (gradeAccess && gradeAccess.isTeacher && gradeAccess.teacherId) {
    return teachersData[gradeAccess.teacherId] || null;
  }
  return null;
};