export interface Grade {
  id: number;
  name: string;
  nameEn: string;
  description?: string;
  isActive: boolean;
  subjects: string[];
}

export interface GradeData {
  grade: Grade;
  subjects: { [subjectId: string]: any };
}

export interface GradeConfig {
  minGrade: number;
  maxGrade: number;
  availableGrades: number[];
}