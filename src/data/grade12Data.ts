import { VocabularyWord, GrammarRule, QuizQuestion } from '../types';

// Grade 12 Vocabulary - Advanced level
export const grade12Vocabulary: VocabularyWord[] = [
  // Unit 1: Academic Excellence
  { english: "excellence", arabic: "تميز", unit: "Academic Excellence", pronunciation: "/ˈeksələns/", grade: 12, partOfSpeech: "noun", exampleSentence: "Academic excellence requires dedication.", difficulty: "hard" },
  { english: "achievement", arabic: "إنجاز", unit: "Academic Excellence", pronunciation: "/əˈtʃiːvmənt/", grade: 12, partOfSpeech: "noun", exampleSentence: "This is a remarkable achievement.", difficulty: "medium" },
  { english: "scholarship", arabic: "منحة دراسية", unit: "Academic Excellence", pronunciation: "/ˈskɒləʃɪp/", grade: 12, partOfSpeech: "noun", exampleSentence: "She received a scholarship to study abroad.", difficulty: "hard" },
  { english: "dissertation", arabic: "أطروحة", unit: "Academic Excellence", pronunciation: "/ˌdɪsəˈteɪʃn/", grade: 12, partOfSpeech: "noun", exampleSentence: "His dissertation was about renewable energy.", difficulty: "hard" },
  { english: "methodology", arabic: "منهجية", unit: "Academic Excellence", pronunciation: "/ˌmeθəˈdɒlədʒi/", grade: 12, partOfSpeech: "noun", exampleSentence: "The research methodology was very thorough.", difficulty: "hard" },

  // Unit 2: Global Citizenship
  { english: "citizenship", arabic: "مواطنة", unit: "Global Citizenship", pronunciation: "/ˈsɪtɪzənʃɪp/", grade: 12, partOfSpeech: "noun", exampleSentence: "Global citizenship means caring about the world.", difficulty: "hard" },
  { english: "diversity", arabic: "تنوع", unit: "Global Citizenship", pronunciation: "/daɪˈvɜːsəti/", grade: 12, partOfSpeech: "noun", exampleSentence: "Cultural diversity enriches our society.", difficulty: "medium" },
  { english: "tolerance", arabic: "تسامح", unit: "Global Citizenship", pronunciation: "/ˈtɒlərəns/", grade: 12, partOfSpeech: "noun", exampleSentence: "Tolerance is essential for peace.", difficulty: "medium" },
  { english: "cooperation", arabic: "تعاون", unit: "Global Citizenship", pronunciation: "/kəʊˌɒpəˈreɪʃn/", grade: 12, partOfSpeech: "noun", exampleSentence: "International cooperation solves global problems.", difficulty: "hard" },
  { english: "sustainability", arabic: "استدامة", unit: "Global Citizenship", pronunciation: "/səˌsteɪnəˈbɪləti/", grade: 12, partOfSpeech: "noun", exampleSentence: "Environmental sustainability is crucial.", difficulty: "hard" },

  // Unit 3: Career Preparation
  { english: "preparation", arabic: "إعداد", unit: "Career Preparation", pronunciation: "/ˌprepəˈreɪʃn/", grade: 12, partOfSpeech: "noun", exampleSentence: "Good preparation leads to success.", difficulty: "medium" },
  { english: "portfolio", arabic: "ملف أعمال", unit: "Career Preparation", pronunciation: "/pɔːtˈfəʊliəʊ/", grade: 12, partOfSpeech: "noun", exampleSentence: "She presented her portfolio to the employer.", difficulty: "hard" },
  { english: "networking", arabic: "بناء شبكة علاقات", unit: "Career Preparation", pronunciation: "/ˈnetwɜːkɪŋ/", grade: 12, partOfSpeech: "noun", exampleSentence: "Networking helps in finding job opportunities.", difficulty: "hard" },
  { english: "entrepreneurship", arabic: "ريادة الأعمال", unit: "Career Preparation", pronunciation: "/ˌɒntrəprəˈnɜːʃɪp/", grade: 12, partOfSpeech: "noun", exampleSentence: "Entrepreneurship requires creativity and risk-taking.", difficulty: "hard" },
  { english: "internship", arabic: "تدريب", unit: "Career Preparation", pronunciation: "/ˈɪntɜːnʃɪp/", grade: 12, partOfSpeech: "noun", exampleSentence: "The internship provided valuable experience.", difficulty: "medium" },

  // Unit 4: Critical Thinking
  { english: "analysis", arabic: "تحليل", unit: "Critical Thinking", pronunciation: "/əˈnæləsɪs/", grade: 12, partOfSpeech: "noun", exampleSentence: "Critical analysis is important in research.", difficulty: "hard" },
  { english: "evaluation", arabic: "تقييم", unit: "Critical Thinking", pronunciation: "/ɪˌvæljuˈeɪʃn/", grade: 12, partOfSpeech: "noun", exampleSentence: "The evaluation of the project was positive.", difficulty: "medium" },
  { english: "synthesis", arabic: "تركيب", unit: "Critical Thinking", pronunciation: "/ˈsɪnθəsɪs/", grade: 12, partOfSpeech: "noun", exampleSentence: "The synthesis of ideas led to innovation.", difficulty: "hard" },
  { english: "perspective", arabic: "منظور", unit: "Critical Thinking", pronunciation: "/pəˈspektɪv/", grade: 12, partOfSpeech: "noun", exampleSentence: "Different perspectives enrich our understanding.", difficulty: "medium" },
  { english: "hypothesis", arabic: "فرضية", unit: "Critical Thinking", pronunciation: "/haɪˈpɒθəsɪs/", grade: 12, partOfSpeech: "noun", exampleSentence: "The scientist tested her hypothesis.", difficulty: "hard" },

  // Unit 5: Future Challenges
  { english: "challenge", arabic: "تحدي", unit: "Future Challenges", pronunciation: "/ˈtʃælɪndʒ/", grade: 12, partOfSpeech: "noun", exampleSentence: "Climate change is a global challenge.", difficulty: "medium" },
  { english: "solution", arabic: "حل", unit: "Future Challenges", pronunciation: "/səˈluːʃn/", grade: 12, partOfSpeech: "noun", exampleSentence: "We need innovative solutions.", difficulty: "medium" },
  { english: "adaptation", arabic: "تكيف", unit: "Future Challenges", pronunciation: "/ˌædæpˈteɪʃn/", grade: 12, partOfSpeech: "noun", exampleSentence: "Adaptation to change is essential.", difficulty: "hard" },
  { english: "resilience", arabic: "مرونة", unit: "Future Challenges", pronunciation: "/rɪˈzɪliəns/", grade: 12, partOfSpeech: "noun", exampleSentence: "Resilience helps us overcome difficulties.", difficulty: "hard" },
  { english: "transformation", arabic: "تحول", unit: "Future Challenges", pronunciation: "/ˌtrænsfəˈmeɪʃn/", grade: 12, partOfSpeech: "noun", exampleSentence: "Digital transformation is changing society.", difficulty: "hard" }
];

// Grade 12 Grammar Rules
export const grade12Grammar: GrammarRule[] = [
  {
    title: "Advanced Conditional Structures",
    explanation: "التراكيب الشرطية المتقدمة تشمل الشرط المختلط والشرط مع wish و if only للتعبير عن مواقف معقدة.",
    examples: [
      "If I had studied harder, I would be in university now. (Mixed conditional)",
      "I wish I had more time for research. (Wish + past simple for present)",
      "If only we could solve climate change. (If only for strong wishes)",
      "Had I known about the scholarship, I would have applied. (Inverted conditional)",
      "Should you need assistance, please contact us. (Formal conditional)",
      "Were I to become a leader, I would promote sustainability. (Formal hypothetical)"
    ],
    unit: "Academic Excellence",
    grade: 12
  },
  {
    title: "Complex Passive Constructions",
    explanation: "التراكيب المبنية للمجهول المعقدة تشمل المبني للمجهول مع الأفعال المساعدة والتراكيب المتقدمة.",
    examples: [
      "The research is said to be groundbreaking. (Passive reporting)",
      "Students are expected to demonstrate critical thinking. (Passive expectation)",
      "The problem is believed to have been solved. (Perfect passive)",
      "New technologies are being developed constantly. (Continuous passive)",
      "The theory will have been proven by next year. (Future perfect passive)",
      "The methodology should be carefully considered. (Modal passive)"
    ],
    unit: "Critical Thinking",
    grade: 12
  },
  {
    title: "Advanced Discourse Markers",
    explanation: "أدوات الربط المتقدمة تساعد في تنظيم الأفكار وربط الجمل بطريقة أكثر تطوراً في الكتابة الأكاديمية.",
    examples: [
      "Furthermore, the research indicates significant progress. (Addition)",
      "Nevertheless, challenges remain to be addressed. (Contrast)",
      "Consequently, new policies must be implemented. (Result)",
      "In contrast, traditional methods are less effective. (Comparison)",
      "Moreover, sustainability requires global cooperation. (Emphasis)",
      "Hence, critical thinking skills are essential. (Conclusion)"
    ],
    unit: "Global Citizenship",
    grade: 12
  }
];

// Grade 12 Quiz Questions
export const grade12Questions: QuizQuestion[] = [
  {
    question: "If I _____ about the internship earlier, I would have applied.",
    options: ["knew", "had known", "know", "would know"],
    correct: 1,
    explanation: "في الشرط الثالث، نستخدم had + past participle في جملة الشرط",
    unit: "Career Preparation",
    grade: 12
  },
  {
    question: "The research _____ to be revolutionary.",
    options: ["says", "is said", "said", "saying"],
    correct: 1,
    explanation: "نستخدم المبني للمجهول مع التقرير: is said to be",
    unit: "Critical Thinking",
    grade: 12
  },
  {
    question: "_____, global cooperation is essential for sustainability.",
    options: ["However", "Furthermore", "Nevertheless", "In contrast"],
    correct: 1,
    explanation: "Furthermore تستخدم لإضافة معلومات داعمة",
    unit: "Global Citizenship",
    grade: 12
  },
  {
    question: "I wish I _____ more time for academic research.",
    options: ["have", "had", "will have", "would have"],
    correct: 1,
    explanation: "بعد wish نستخدم الماضي البسيط للتعبير عن تمني في الحاضر",
    unit: "Academic Excellence",
    grade: 12
  },
  {
    question: "The transformation of society _____ by technology.",
    options: ["is driving", "is being driven", "drives", "driven"],
    correct: 1,
    explanation: "نستخدم المبني للمجهول المستمر: is being + past participle",
    unit: "Future Challenges",
    grade: 12
  }
];