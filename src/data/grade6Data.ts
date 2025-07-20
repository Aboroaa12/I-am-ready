import { VocabularyWord, GrammarRule, QuizQuestion } from '../types';

// Grade 6 Vocabulary - Upper intermediate level
export const grade6Vocabulary: VocabularyWord[] = [
  // Unit 1: My Country
  { english: "country", arabic: "بلد", unit: "My Country", pronunciation: "/ˈkʌntri/", grade: 6, partOfSpeech: "noun", exampleSentence: "I love my country.", difficulty: "easy" },
  { english: "capital", arabic: "عاصمة", unit: "My Country", pronunciation: "/ˈkæpɪtl/", grade: 6, partOfSpeech: "noun", exampleSentence: "Muscat is the capital of Oman.", difficulty: "medium" },
  { english: "culture", arabic: "ثقافة", unit: "My Country", pronunciation: "/ˈkʌltʃə/", grade: 6, partOfSpeech: "noun", exampleSentence: "Our culture is very rich.", difficulty: "medium" },
  { english: "tradition", arabic: "تقليد", unit: "My Country", pronunciation: "/trəˈdɪʃn/", grade: 6, partOfSpeech: "noun", exampleSentence: "This is an old tradition.", difficulty: "medium" },
  { english: "heritage", arabic: "تراث", unit: "My Country", pronunciation: "/ˈherɪtɪdʒ/", grade: 6, partOfSpeech: "noun", exampleSentence: "We must preserve our heritage.", difficulty: "hard" },

  // Unit 2: Travel and Places
  { english: "travel", arabic: "يسافر", unit: "Travel and Places", pronunciation: "/ˈtrævl/", grade: 6, partOfSpeech: "verb", exampleSentence: "I love to travel to new places.", difficulty: "medium" },
  { english: "journey", arabic: "رحلة", unit: "Travel and Places", pronunciation: "/ˈdʒɜːni/", grade: 6, partOfSpeech: "noun", exampleSentence: "Our journey was very exciting.", difficulty: "medium" },
  { english: "airport", arabic: "مطار", unit: "Travel and Places", pronunciation: "/ˈeəpɔːt/", grade: 6, partOfSpeech: "noun", exampleSentence: "We arrived at the airport early.", difficulty: "medium" },
  { english: "hotel", arabic: "فندق", unit: "Travel and Places", pronunciation: "/həʊˈtel/", grade: 6, partOfSpeech: "noun", exampleSentence: "The hotel was very comfortable.", difficulty: "easy" },
  { english: "tourist", arabic: "سائح", unit: "Travel and Places", pronunciation: "/ˈtʊərɪst/", grade: 6, partOfSpeech: "noun", exampleSentence: "Many tourists visit our country.", difficulty: "medium" },

  // Unit 3: Health and Body
  { english: "health", arabic: "صحة", unit: "Health and Body", pronunciation: "/helθ/", grade: 6, partOfSpeech: "noun", exampleSentence: "Good health is very important.", difficulty: "medium" },
  { english: "exercise", arabic: "تمرين", unit: "Health and Body", pronunciation: "/ˈeksəsaɪz/", grade: 6, partOfSpeech: "noun", exampleSentence: "Exercise keeps us healthy.", difficulty: "medium" },
  { english: "medicine", arabic: "دواء", unit: "Health and Body", pronunciation: "/ˈmedsn/", grade: 6, partOfSpeech: "noun", exampleSentence: "Take your medicine on time.", difficulty: "medium" },
  { english: "doctor", arabic: "طبيب", unit: "Health and Body", pronunciation: "/ˈdɒktə/", grade: 6, partOfSpeech: "noun", exampleSentence: "The doctor is very kind.", difficulty: "easy" },
  { english: "hospital", arabic: "مستشفى", unit: "Health and Body", pronunciation: "/ˈhɒspɪtl/", grade: 6, partOfSpeech: "noun", exampleSentence: "My sister works at the hospital.", difficulty: "medium" },

  // Unit 4: Environment
  { english: "environment", arabic: "بيئة", unit: "Environment", pronunciation: "/ɪnˈvaɪrənmənt/", grade: 6, partOfSpeech: "noun", exampleSentence: "We must protect our environment.", difficulty: "hard" },
  { english: "pollution", arabic: "تلوث", unit: "Environment", pronunciation: "/pəˈluːʃn/", grade: 6, partOfSpeech: "noun", exampleSentence: "Air pollution is dangerous.", difficulty: "medium" },
  { english: "recycle", arabic: "يعيد التدوير", unit: "Environment", pronunciation: "/riːˈsaɪkl/", grade: 6, partOfSpeech: "verb", exampleSentence: "We should recycle plastic bottles.", difficulty: "hard" },
  { english: "nature", arabic: "طبيعة", unit: "Environment", pronunciation: "/ˈneɪtʃə/", grade: 6, partOfSpeech: "noun", exampleSentence: "I love spending time in nature.", difficulty: "medium" },
  { english: "forest", arabic: "غابة", unit: "Environment", pronunciation: "/ˈfɒrɪst/", grade: 6, partOfSpeech: "noun", exampleSentence: "The forest is full of trees.", difficulty: "medium" },

  // Unit 5: Technology
  { english: "technology", arabic: "تكنولوجيا", unit: "Technology", pronunciation: "/tekˈnɒlədʒi/", grade: 6, partOfSpeech: "noun", exampleSentence: "Technology helps us learn.", difficulty: "hard" },
  { english: "computer", arabic: "حاسوب", unit: "Technology", pronunciation: "/kəmˈpjuːtə/", grade: 6, partOfSpeech: "noun", exampleSentence: "I use a computer for homework.", difficulty: "medium" },
  { english: "internet", arabic: "إنترنت", unit: "Technology", pronunciation: "/ˈɪntənet/", grade: 6, partOfSpeech: "noun", exampleSentence: "The internet is very useful.", difficulty: "medium" },
  { english: "mobile", arabic: "هاتف محمول", unit: "Technology", pronunciation: "/ˈməʊbaɪl/", grade: 6, partOfSpeech: "noun", exampleSentence: "My mobile phone is new.", difficulty: "medium" },
  { english: "website", arabic: "موقع إلكتروني", unit: "Technology", pronunciation: "/ˈwebsaɪt/", grade: 6, partOfSpeech: "noun", exampleSentence: "This website is very helpful.", difficulty: "medium" }
];

// Grade 6 Grammar Rules
export const grade6Grammar: GrammarRule[] = [
  {
    title: "الماضي البسيط (Simple Past)",
    explanation: "نستخدم الماضي البسيط للتحدث عن أحداث حصلت وانتهت في الماضي. نضيف -ed للأفعال المنتظمة.",
    examples: [
      "I visited my grandmother yesterday. - زرت جدتي أمس",
      "She played football last week. - لعبت كرة القدم الأسبوع الماضي",
      "We traveled to Dubai last month. - سافرنا إلى دبي الشهر الماضي",
      "They studied English at school. - درسوا الإنجليزية في المدرسة",
      "He worked in the hospital. - عمل في المستشفى",
      "The children enjoyed the trip. - استمتع الأطفال بالرحلة"
    ],
    unit: "My Country",
    grade: 6
  },
  {
    title: "المقارنة والتفضيل (Comparative and Superlative)",
    explanation: "نستخدم المقارنة للمقارنة بين شيئين، والتفضيل للمقارنة بين ثلاثة أشياء أو أكثر.",
    examples: [
      "This car is faster than that one. - هذه السيارة أسرع من تلك",
      "She is the smartest student in class. - هي أذكى طالبة في الصف",
      "Technology is more advanced now. - التكنولوجيا أكثر تطوراً الآن",
      "This is the most beautiful place. - هذا أجمل مكان",
      "Exercise is better than medicine. - التمرين أفضل من الدواء",
      "This is the cleanest environment. - هذه أنظف بيئة"
    ],
    unit: "Travel and Places",
    grade: 6
  },
  {
    title: "المستقبل بـ going to",
    explanation: "نستخدم going to للتحدث عن خطط مستقبلية أو توقعات مبنية على أدلة حالية.",
    examples: [
      "I am going to visit the doctor. - سأزور الطبيب",
      "She is going to recycle the bottles. - ستعيد تدوير الزجاجات",
      "We are going to travel next summer. - سنسافر الصيف القادم",
      "They are going to use the computer. - سيستخدمون الحاسوب",
      "It is going to rain today. - ستمطر اليوم",
      "The environment is going to improve. - ستتحسن البيئة"
    ],
    unit: "Health and Body",
    grade: 6
  }
];

// Grade 6 Quiz Questions
export const grade6Questions: QuizQuestion[] = [
  {
    question: "Yesterday, I _____ my friend at the mall.",
    options: ["meet", "met", "meeting", "meets"],
    correct: 1,
    explanation: "نستخدم الماضي البسيط 'met' للتعبير عن حدث في الماضي",
    unit: "My Country",
    grade: 6
  },
  {
    question: "This computer is _____ than the old one.",
    options: ["fast", "faster", "fastest", "more fast"],
    correct: 1,
    explanation: "نضيف -er للصفات القصيرة في المقارنة",
    unit: "Technology",
    grade: 6
  },
  {
    question: "We _____ going to visit the hospital tomorrow.",
    options: ["am", "is", "are", "be"],
    correct: 2,
    explanation: "نستخدم 'are' مع We في المستقبل بـ going to",
    unit: "Health and Body",
    grade: 6
  },
  {
    question: "She is the _____ student in our class.",
    options: ["smart", "smarter", "smartest", "more smart"],
    correct: 2,
    explanation: "نستخدم التفضيل 'smartest' للمقارنة بين أكثر من شيئين",
    unit: "Travel and Places",
    grade: 6
  },
  {
    question: "We should _____ plastic to protect the environment.",
    options: ["recycle", "recycled", "recycling", "recycles"],
    correct: 0,
    explanation: "نستخدم الفعل الأساسي بعد should",
    unit: "Environment",
    grade: 6
  }
];