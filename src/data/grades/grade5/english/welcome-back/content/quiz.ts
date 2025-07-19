import { QuizQuestion } from '../../../../schema/questionTypes';

export const welcomeBackQuiz: QuizQuestion[] = [
  {
    id: "welcome-back-quiz-1",
    question: "I _____ never been to London.",
    options: ["have", "has", "had", "having"],
    correct: 0,
    explanation: "نستخدم 'have' مع I في المضارع التام",
    unit: "Welcome Back",
    grade: 5,
    subject: "english"
  },
  {
    id: "welcome-back-quiz-2",
    question: "What does 'welcome' mean in Arabic?",
    options: ["وداع", "مرحباً", "شكراً", "عفواً"],
    correct: 1,
    explanation: "welcome تعني مرحباً",
    unit: "Welcome Back",
    grade: 5,
    subject: "english"
  }
];