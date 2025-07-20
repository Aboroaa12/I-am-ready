export interface VocabularyWord {
  id?: string;
  english: string;
  arabic: string;
  unit: string;
  pronunciation?: string;
  grade: number;
  partOfSpeech?: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'pronoun' | 'conjunction' | 'interjection';
  exampleSentence?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  subject?: string;
}

export interface WordKnowledge {
  wordId: string; // english word as unique identifier
  pronunciationMastery: number; // 0-100
  spellingMastery: number; // 0-100
  usageMastery: number; // 0-100 (sentence usage)
  grammarMastery: number; // 0-100 (part of speech knowledge)
  overallMastery: number; // calculated average
  lastReviewed: string; // ISO date string
  reviewCount: number;
  correctAnswers: number;
  incorrectAnswers: number;
  streak: number; // current correct streak
  bestStreak: number;
  timeSpent: number; // in seconds
  difficultyLevel: 'easy' | 'medium' | 'hard';
  needsReview: boolean;
  masteryHistory: MasteryRecord[];
}

export interface MasteryRecord {
  date: string;
  pronunciationScore: number;
  spellingScore: number;
  usageScore: number;
  grammarScore: number;
  overallScore: number;
  activityType: 'pronunciation' | 'spelling' | 'usage' | 'grammar' | 'mixed';
}

export interface StudySession {
  id: string;
  startTime: string;
  endTime?: string;
  wordsStudied: string[];
  totalScore: number;
  activitiesCompleted: string[];
  duration: number; // in seconds
  studentId?: string;
}

export interface WordProgress {
  [wordId: string]: WordKnowledge;
}

export interface GrammarRule {
  id?: string;
  title: string;
  explanation: string;
  examples: string[];
  unit: string;
  grade: number;
  subject?: string;
}

export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  unit: string;
  grade: number;
  subject?: string;
}

export interface UserProgress {
  totalScore: number;
  currentStreak: number;
  unitsCompleted: string[];
  wordsLearned: number;
  lastStudyDate: string;
  currentGrade?: number;
  wordProgress: WordProgress;
  studySessions: StudySession[];
  totalStudyTime: number; // in seconds
  studentId?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  achieved: boolean;
  achievedDate?: string;
}

export interface SentenceExercise {
  word: string;
  arabic: string;
  sampleSentence: string;
  hints: string[];
}

export interface GradeAccess {
  grade: number;
  name: string;
  code: string;
  isAdmin?: boolean;
  isTeacher?: boolean;
  isStudent?: boolean;
  teacherId?: string;
  teacherName?: string;
  studentName?: string;
  studentKeyId?: string;
}

export interface Student {
  id: string;
  name: string;
  grade: number;
  teacherId: string;
  joinDate: string;
  lastActive: string;
  isActive: boolean;
  progress: UserProgress;
  achievements: Achievement[];
  notes?: string;
  parentEmail?: string;
  studentNumber?: string;
  classRoomIds?: string[];
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  grades: number[];
  students?: string[];
  joinDate: string;
  isActive: boolean;
  schoolName?: string;
  subjects?: string[];
}

export interface ClassRoom {
  id: string;
  name: string;
  grade: number;
  teacherId: string;
  students?: string[];
  createdAt?: string;
  createdDate?: string;
  isActive: boolean;
  description?: string;
  lastActivity?: string;
  subject?: string;
}

export interface StudentActivity {
  id: string;
  studentId: string;
  activityType: ActivityType;
  startTime: string;
  endTime?: string;
  score: number;
  wordsStudied: string[];
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  unit: string;
  grade: number;
  subject?: string;
}

export interface StudentReport {
  studentId: string;
  studentName: string;
  grade: number;
  reportPeriod: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalActivities: number;
    totalTimeSpent: number; // in seconds
    averageScore: number;
    wordsLearned: number;
    unitsCompleted: string[];
    strongAreas: string[];
    improvementAreas: string[];
  };
  weeklyProgress: {
    week: string;
    activitiesCount: number;
    averageScore: number;
    timeSpent: number;
  }[];
  wordMastery: {
    wordId: string;
    word: string;
    arabic: string;
    masteryLevel: number;
    lastPracticed: string;
  }[];
  recommendations: string[];
}

export interface TeacherDashboard {
  teacherId: string;
  totalStudents: number;
  activeStudents: number;
  classRooms: ClassRoom[];
  recentActivities: StudentActivity[];
  topPerformers: {
    studentId: string;
    studentName: string;
    score: number;
    improvement: number;
  }[];
  strugglingStudents: {
    studentId: string;
    studentName: string;
    issueAreas: string[];
    lastActive: string;
  }[];
  weeklyStats: {
    week: string;
    totalActivities: number;
    averageScore: number;
    activeStudents: number;
  }[];
}

export interface AccessCode {
  id: string;
  code: string;
  grade: number;
  description: string;
  teacherId: string;
  teacherName?: string;
  teacherPhone?: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
  usageCount?: number;
  maxUsage?: number;
  studentId?: string;
  classRoomId?: string;
}

export interface Subject {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  description: string;
  isActive: boolean;
  activities?: ActivityType[];
  createdAt?: string;
  updatedAt?: string;
  grade?: number | null;
  semester?: string;
}

export interface SubjectActivity {
  subjectId: string;
  activityType: ActivityType;
  isEnabled: boolean;
  description?: string;
}

export const defaultSubjects: Subject[] = [
  {
    id: 'english',
    name: 'اللغة الإنجليزية',
    nameEn: 'English',
    icon: '🇺🇸',
    color: 'from-blue-500 to-indigo-600',
    description: 'تعلم اللغة الإنجليزية من خلال المفردات والقواعد والتمارين التفاعلية',
    isActive: true,
    activities: ['flashcards', 'quiz', 'memory', 'pronunciation', 'grammar', 'spelling', 'sentence-writing', 'sentence-completion', 'test-exercises']
  },
];

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  content: string;
  contentType: 'text' | 'image' | 'video' | 'audio' | 'interactive';
  subject: string;
  unit: string;
  grade: number;
  semester?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}


export type ActivityType = 'flashcards' | 'quiz' | 'memory' | 'pronunciation' | 'grammar' | 'spelling' | 'sentence-writing' | 'sentence-completion' | 'test-exercises';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type UserRole = 'student' | 'teacher' | 'admin';
export type ReportPeriod = 'week' | 'month' | 'term' | 'year';