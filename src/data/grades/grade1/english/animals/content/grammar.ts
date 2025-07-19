import { GrammarRule } from '../../../../schema/questionTypes';

export const animalsGrammar: GrammarRule[] = [
  {
    id: "animals-be-verb",
    title: "فعل الكون (am, is, are)",
    explanation: "نستخدم 'am' مع I، و 'is' مع He/She/It، و 'are' مع You/We/They.",
    examples: [
      "I am seven years old. - عمري سبع سنوات",
      "She is my sister. - هي أختي",
      "You are nice. - أنت لطيف",
      "The cat is black. - القطة سوداء",
      "We are friends. - نحن أصدقاء",
      "They are happy. - هم سعداء"
    ],
    unit: "Animals",
    grade: 1,
    subject: "english"
  }
];