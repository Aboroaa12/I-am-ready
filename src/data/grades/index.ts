// Export all grades
export * from './grade1';
export * from './grade5';

import { grade1Data } from './grade1';
import { grade5Data } from './grade5';
import { GradeData } from '../schema/gradeTypes';

export const allGradesData: { [gradeId: number]: GradeData } = {
  1: grade1Data,
  5: grade5Data
};

// Utility functions for accessing grade data
export function getGradeData(gradeId: number): GradeData | null {
  return allGradesData[gradeId] || null;
}

export function getGradeSubjectData(gradeId: number, subjectId: string): any | null {
  const gradeData = getGradeData(gradeId);
  return gradeData?.subjects[subjectId] || null;
}

export function getGradeSubjectUnitData(gradeId: number, subjectId: string, unitId: string): any | null {
  const subjectData = getGradeSubjectData(gradeId, subjectId);
  return subjectData?.units?.find((unit: any) => unit.id === unitId) || null;
}

export function getAvailableGrades(): number[] {
  return Object.keys(allGradesData).map(Number).sort();
}

export function getAvailableSubjects(gradeId: number): string[] {
  const gradeData = getGradeData(gradeId);
  return gradeData?.grade.subjects || [];
}