import { QuizQuestion } from '../../../../schema/questionTypes';

export const animalsQuiz: QuizQuestion[] = [
  {
    id: "animals-quiz-1",
    question: "The cat _____ black.",
    options: ["am", "is", "are", "be"],
    correct: 1,
    explanation: "نستخدم 'is' مع المفرد الغائب",
    unit: "Animals",
    grade: 1,
    subject: "english"
  },
  {
    id: "animals-quiz-2",
    question: "What is the plural of 'cat'?",
    options: ["cat", "cats", "cates", "kitties"],
    correct: 1,
    explanation: "نضيف 's' في النهاية للجمع",
    unit: "Animals",
    grade: 1,
    subject: "english"
  }
];