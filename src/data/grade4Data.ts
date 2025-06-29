import { VocabularyWord, GrammarRule, QuizQuestion } from '../types';

// Grade 4 Vocabulary - More advanced basic level
export const grade4Vocabulary: VocabularyWord[] = [
  // Unit 1: Nature and Environment
  { english: "environment", arabic: "بيئة", unit: "Nature and Environment", pronunciation: "/ɪnˈvaɪrənmənt/", grade: 4, partOfSpeech: "noun", exampleSentence: "We must protect our environment.", difficulty: "medium" },
  { english: "nature", arabic: "طبيعة", unit: "Nature and Environment", pronunciation: "/ˈneɪtʃə/", grade: 4, partOfSpeech: "noun", exampleSentence: "Nature is beautiful and important.", difficulty: "medium" },
  { english: "forest", arabic: "غابة", unit: "Nature and Environment", pronunciation: "/ˈfɒrɪst/", grade: 4, partOfSpeech: "noun", exampleSentence: "The forest is full of trees.", difficulty: "medium" },
  { english: "ocean", arabic: "محيط", unit: "Nature and Environment", pronunciation: "/ˈəʊʃn/", grade: 4, partOfSpeech: "noun", exampleSentence: "The ocean is very deep.", difficulty: "medium" },
  { english: "mountain", arabic: "جبل", unit: "Nature and Environment", pronunciation: "/ˈmaʊntɪn/", grade: 4, partOfSpeech: "noun", exampleSentence: "The mountain is very high.", difficulty: "medium" },

  // Unit 2: Technology and Communication
  { english: "computer", arabic: "حاسوب", unit: "Technology and Communication", pronunciation: "/kəmˈpjuːtə/", grade: 4, partOfSpeech: "noun", exampleSentence: "I use a computer for my homework.", difficulty: "medium" },
  { english: "internet", arabic: "إنترنت", unit: "Technology and Communication", pronunciation: "/ˈɪntənet/", grade: 4, partOfSpeech: "noun", exampleSentence: "The internet helps us learn.", difficulty: "medium" },
  { english: "telephone", arabic: "هاتف", unit: "Technology and Communication", pronunciation: "/ˈtelɪfəʊn/", grade: 4, partOfSpeech: "noun", exampleSentence: "I call my grandmother on the telephone.", difficulty: "medium" },
  { english: "message", arabic: "رسالة", unit: "Technology and Communication", pronunciation: "/ˈmesɪdʒ/", grade: 4, partOfSpeech: "noun", exampleSentence: "She sent me a message.", difficulty: "medium" },
  { english: "information", arabic: "معلومات", unit: "Technology and Communication", pronunciation: "/ˌɪnfəˈmeɪʃn/", grade: 4, partOfSpeech: "noun", exampleSentence: "We need more information about this topic.", difficulty: "medium" }
];

// Grade 4 Grammar Rules
export const grade4Grammar: GrammarRule[] = [
  {
    title: "المستقبل البسيط (Simple Future)",
    explanation: "نستخدم المستقبل البسيط للتحدث عن أحداث ستحدث في المستقبل. التركيب: will + فعل أساسي",
    examples: [
      "I will study hard. - سأدرس بجد",
      "She will visit us tomorrow. - ستزورنا غداً",
      "We will protect the environment. - سنحمي البيئة",
      "They will use computers. - سيستخدمون الحاسوب",
      "He will send a message. - سيرسل رسالة",
      "It will rain tomorrow. - ستمطر غداً"
    ],
    unit: "Nature and Environment",
    grade: 4
  },
  {
    title: "الأسئلة بـ How many و How much",
    explanation: "نستخدم 'How many' مع الأشياء المعدودة و 'How much' مع الأشياء غير المعدودة.",
    examples: [
      "How many books do you have? - كم كتاباً لديك؟",
      "How much water do you drink? - كم من الماء تشرب؟",
      "How many friends are coming? - كم صديقاً قادم؟",
      "How much time do we have? - كم من الوقت لدينا؟",
      "How many computers are there? - كم حاسوباً هناك؟",
      "How much information do you need? - كم من المعلومات تحتاج؟"
    ],
    unit: "Technology and Communication",
    grade: 4
  }
];

// Grade 4 Quiz Questions
export const grade4Questions: QuizQuestion[] = [
  {
    question: "Tomorrow, I _____ visit my grandmother.",
    options: ["will", "would", "was", "am"],
    correct: 0,
    explanation: "نستخدم 'will' للمستقبل البسيط",
    unit: "Nature and Environment",
    grade: 4
  },
  {
    question: "_____ computers do you have at home?",
    options: ["How much", "How many", "How often", "How long"],
    correct: 1,
    explanation: "نستخدم 'How many' مع الأشياء المعدودة",
    unit: "Technology and Communication",
    grade: 4
  }
]; 