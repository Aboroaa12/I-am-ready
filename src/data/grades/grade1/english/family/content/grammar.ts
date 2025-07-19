import { GrammarRule } from '../../../../schema/questionTypes';

export const familyGrammar: GrammarRule[] = [
  {
    id: "family-articles",
    title: "أدوات التعريف والتنكير (A, An, The)",
    explanation: "نستخدم 'a' قبل الكلمات التي تبدأ بحرف ساكن، و 'an' قبل الكلمات التي تبدأ بحرف متحرك، و 'the' للإشارة إلى شيء محدد.",
    examples: [
      "a cat - قطة",
      "an apple - تفاحة", 
      "the book - الكتاب",
      "a dog - كلب",
      "an orange - برتقالة",
      "the sun - الشمس"
    ],
    unit: "Family",
    grade: 1,
    subject: "english"
  },
  {
    id: "family-pronouns",
    title: "الضمائر البسيطة (I, You, He, She, It)",
    explanation: "الضمائر تحل محل الأسماء. نستخدم I للمتكلم، You للمخاطب، He للذكر، She للأنثى، It للأشياء.",
    examples: [
      "I am happy. - أنا سعيد",
      "You are my friend. - أنت صديقي", 
      "He is tall. - هو طويل",
      "She is kind. - هي لطيفة",
      "It is red. - إنه أحمر",
      "I love you. - أحبك"
    ],
    unit: "Family",
    grade: 1,
    subject: "english"
  }
];