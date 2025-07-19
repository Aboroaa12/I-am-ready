import { GrammarRule } from '../../../../schema/questionTypes';

export const welcomeBackGrammar: GrammarRule[] = [
  {
    id: "welcome-back-present-perfect",
    title: "الأزمنة المركبة (Present Perfect Tense)",
    explanation: "نستخدم المضارع التام للتحدث عن أحداث حصلت في الماضي ولها تأثير على الحاضر. نكونه باستخدام have/has + past participle.",
    examples: [
      "I have visited many countries. - لقد زرت دولاً كثيرة",
      "She has finished her homework. - لقد أنهت واجبها المنزلي",
      "We have lived here for five years. - لقد عشنا هنا لمدة خمس سنوات",
      "They have never seen snow. - لم يروا الثلج قط",
      "He has already eaten lunch. - لقد تناول الغداء بالفعل",
      "Have you ever been to Paris? - هل سبق لك أن ذهبت إلى باريس؟"
    ],
    unit: "Welcome Back",
    grade: 5,
    subject: "english"
  }
];