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
  subject?: string; // Added subject field
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
  studentId?: string; // للربط مع الطالب
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
  subject?: string; // Added subject field
}

export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  unit: string;
  grade: number;
  subject?: string; // Added subject field
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
  studentId?: string; // للربط مع الطالب
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
  studentName?: string;
  studentKeyId?: string;
}

// نظام إدارة الطلاب
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
  grades: number[]; // الصفوف التي يدرسها
  students?: string[]; // معرفات الطلاب
  joinDate: string;
  isActive: boolean;
  schoolName?: string;
  subjects?: string[]; // المواد التي يدرسها
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
  subject?: string; // المادة الدراسية
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
  subject?: string; // Added subject field
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
  studentId?: string; // إذا كان الرمز مخصصًا لطالب محدد
  classRoomId?: string; // إذا كان الرمز مخصصًا لفصل محدد
}

// Subject interface for managing different subjects
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

// Default subjects configuration
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
  {
    id: 'math',
    name: 'الرياضيات',
    nameEn: 'Mathematics',
    icon: '🔢',
    color: 'from-green-500 to-teal-600',
    description: 'تعلم الرياضيات من خلال المسائل والتمارين التفاعلية',
    isActive: true,
    activities: ['quiz', 'memory', 'test-exercises']
  },
  {
    id: 'science',
    name: 'العلوم',
    nameEn: 'Science',
    icon: '🔬',
    color: 'from-purple-500 to-violet-600',
    description: 'تعلم العلوم من خلال التجارب والمفاهيم العلمية (للصفوف 1-8)',
    isActive: true,
    // activities: ['quiz', 'memory', 'test-exercises'] // COMMENTED: Will be enabled when science content is added
    // activities: ['flashcards', 'quiz', 'memory', 'pronunciation', 'grammar', 'spelling', 'sentence-writing', 'sentence-completion', 'test-exercises'] // RESTORE: Uncomment when adding science content
  },
  {
    id: 'physics',
    name: 'الفيزياء',
    nameEn: 'Physics',
    icon: '⚛️',
    color: 'from-blue-500 to-cyan-600',
    description: 'دراسة الفيزياء والظواهر الطبيعية (للصفوف 9-12)',
    isActive: true,
    // activities: ['quiz', 'memory', 'test-exercises'] // COMMENTED: Will be enabled when physics content is added
  },
  {
    id: 'chemistry',
    name: 'الكيمياء',
    nameEn: 'Chemistry',
    icon: '🧪',
    color: 'from-green-500 to-emerald-600',
    description: 'دراسة الكيمياء والتفاعلات الكيميائية (للصفوف 9-12)',
    isActive: true,
    // activities: ['quiz', 'memory', 'test-exercises'] // COMMENTED: Will be enabled when chemistry content is added
  },
  {
    id: 'biology',
    name: 'الأحياء',
    nameEn: 'Biology',
    icon: '🧬',
    color: 'from-teal-500 to-green-600',
    description: 'دراسة علم الأحياء والكائنات الحية (للصفوف 9-12)',
    isActive: true,
    // activities: ['quiz', 'memory', 'test-exercises'] // COMMENTED: Will be enabled when biology content is added
  },
  {
    id: 'islamic',
    name: 'التربية الإسلامية',
    nameEn: 'Islamic Education',
    icon: '☪️',
    color: 'from-emerald-500 to-green-600',
    description: 'تعلم التربية الإسلامية من خلال القرآن والحديث والفقه',
    isActive: true,
    // activities: ['quiz', 'memory', 'test-exercises'] // COMMENTED: Will be enabled when islamic content is added
    // activities: ['flashcards', 'quiz', 'memory', 'pronunciation', 'grammar', 'spelling', 'sentence-writing', 'sentence-completion', 'test-exercises'] // RESTORE: Uncomment when adding islamic content
  },
  {
    id: 'arabic',
    name: 'اللغة العربية',
    nameEn: 'Arabic',
    icon: '📖',
    color: 'from-amber-500 to-yellow-600',
    description: 'تعلم اللغة العربية من خلال القراءة والكتابة والقواعد',
    isActive: true,
    // activities: ['quiz', 'memory', 'test-exercises'] // COMMENTED: Will be enabled when arabic content is added
    // activities: ['flashcards', 'quiz', 'memory', 'pronunciation', 'grammar', 'spelling', 'sentence-writing', 'sentence-completion', 'test-exercises'] // RESTORE: Uncomment when adding arabic content
  }
];

// Content item for different subjects
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

// Math-specific interfaces
export interface MathProblem {
  id: string;
  question: string;
  options?: string[];
  answer: string;
  solution: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  unit: string;
  grade: number;
  subject: string;
  imageUrl?: string;
  createdAt?: string;
}

// Science-specific interfaces
export interface ScienceExperiment {
  id: string;
  title: string;
  objective: string;
  materials: string[];
  procedure: string[];
  conclusion: string;
  safetyNotes: string[];
  topic: string;
  unit: string;
  grade: number;
  subject: string;
  imageUrl?: string;
}

// Islamic Education-specific interfaces
export interface IslamicContent {
  id: string;
  title: string;
  type: 'quran' | 'hadith' | 'fiqh' | 'seerah' | 'akhlaq';
  arabicText: string;
  translation?: string;
  explanation: string;
  topic: string;
  unit: string;
  grade: number;
  subject: string;
}

// Arabic Language-specific interfaces
export interface ArabicContent {
  id: string;
  title: string;
  type: 'reading' | 'grammar' | 'writing' | 'literature';
  text: string;
  explanation: string;
  examples: string[];
  exercises: ArabicExercise[];
  topic: string;
  unit: string;
  grade: number;
  subject: string;
}

export interface ArabicExercise {
  id: string;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type ActivityType = 'flashcards' | 'quiz' | 'memory' | 'pronunciation' | 'grammar' | 'spelling' | 'sentence-writing' | 'sentence-completion' | 'test-exercises';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type UserRole = 'student' | 'teacher' | 'admin';
export type ReportPeriod = 'week' | 'month' | 'term' | 'year';