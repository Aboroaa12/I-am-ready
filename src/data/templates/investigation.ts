import { Investigation } from '../schema/questionTypes';

export function createInvestigation(
  id: string,
  title: string,
  objective: string,
  materials: string[],
  procedure: string[],
  expectedResults: string,
  conclusion: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  estimatedTime: number = 30,
  grade: number = 5,
  subject: string = 'science',
  unit: string = '',
  topic: string = '',
  safetyNotes: string[] = []
): Investigation {
  return {
    id,
    title,
    objective,
    materials,
    procedure,
    expectedResults,
    conclusion,
    safetyNotes,
    difficulty,
    estimatedTime,
    grade,
    subject,
    unit,
    topic
  };
}

export function createSimpleInvestigation(
  title: string,
  question: string,
  materials: string[],
  steps: string[],
  grade: number,
  subject: string = 'science',
  unit: string = '',
  topic: string = ''
): Investigation {
  return createInvestigation(
    `investigation-${title.toLowerCase().replace(/\s+/g, '-')}`,
    title,
    `التحقق من: ${question}`,
    materials,
    steps,
    'سيتم تحديد النتائج بناءً على الملاحظات',
    'سيتم استخلاص الخلاصة من النتائج المحصل عليها',
    'medium',
    45,
    grade,
    subject,
    unit,
    topic,
    ['اتبع تعليمات السلامة', 'استخدم المواد بحذر']
  );
}