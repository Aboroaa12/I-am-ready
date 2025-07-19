import { QuizQuestion } from '../../../../schema/questionTypes';

export const familyQuiz: QuizQuestion[] = [
  {
    id: "family-quiz-1",
    question: "I _____ a student.",
    options: ["am", "is", "are", "be"],
    correct: 0,
    explanation: "نستخدم 'am' مع الضمير I",
    unit: "Family",
    grade: 1,
    subject: "english"
  },
  {
    id: "family-quiz-2",
    question: "She _____ my sister.",
    options: ["am", "is", "are", "be"],
    correct: 1,
    explanation: "نستخدم 'is' مع الضمير She",
    unit: "Family",
    grade: 1,
    subject: "english"
  },
  {
    id: "family-quiz-3",
    question: "Choose the correct article: _____ apple",
    options: ["a", "an", "the", "no article"],
    correct: 1,
    explanation: "نستخدم 'an' قبل الكلمات التي تبدأ بحرف متحرك",
    unit: "Family",
    grade: 1,
    subject: "english"
  }
];