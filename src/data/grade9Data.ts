import { VocabularyWord, GrammarRule, QuizQuestion } from '../types';

// Grade 9 Vocabulary - Advanced intermediate level
export const grade9Vocabulary: VocabularyWord[] = [
  // Unit 1: Personal Development
  { english: "development", arabic: "تطوير", unit: "Personal Development", pronunciation: "/dɪˈveləpmənt/", grade: 9, partOfSpeech: "noun", exampleSentence: "Personal development is important for success.", difficulty: "medium" },
  { english: "skill", arabic: "مهارة", unit: "Personal Development", pronunciation: "/skɪl/", grade: 9, partOfSpeech: "noun", exampleSentence: "Communication is an important skill.", difficulty: "medium" },
  { english: "confidence", arabic: "ثقة", unit: "Personal Development", pronunciation: "/ˈkɒnfɪdəns/", grade: 9, partOfSpeech: "noun", exampleSentence: "She speaks with confidence.", difficulty: "medium" },
  { english: "leadership", arabic: "قيادة", unit: "Personal Development", pronunciation: "/ˈliːdəʃɪp/", grade: 9, partOfSpeech: "noun", exampleSentence: "Good leadership inspires others.", difficulty: "hard" },
  { english: "responsibility", arabic: "مسؤولية", unit: "Personal Development", pronunciation: "/rɪˌspɒnsəˈbɪləti/", grade: 9, partOfSpeech: "noun", exampleSentence: "Taking responsibility shows maturity.", difficulty: "hard" },

  // Unit 2: Science and Innovation
  { english: "science", arabic: "علم", unit: "Science and Innovation", pronunciation: "/ˈsaɪəns/", grade: 9, partOfSpeech: "noun", exampleSentence: "Science helps us understand the world.", difficulty: "medium" },
  { english: "innovation", arabic: "ابتكار", unit: "Science and Innovation", pronunciation: "/ˌɪnəˈveɪʃn/", grade: 9, partOfSpeech: "noun", exampleSentence: "Innovation drives progress.", difficulty: "hard" },
  { english: "experiment", arabic: "تجربة", unit: "Science and Innovation", pronunciation: "/ɪkˈsperɪmənt/", grade: 9, partOfSpeech: "noun", exampleSentence: "The experiment was successful.", difficulty: "medium" },
  { english: "discovery", arabic: "اكتشاف", unit: "Science and Innovation", pronunciation: "/dɪˈskʌvəri/", grade: 9, partOfSpeech: "noun", exampleSentence: "This discovery will change medicine.", difficulty: "medium" },
  { english: "research", arabic: "بحث", unit: "Science and Innovation", pronunciation: "/rɪˈsɜːtʃ/", grade: 9, partOfSpeech: "noun", exampleSentence: "Scientific research is very important.", difficulty: "medium" },

  // Unit 3: Social Issues
  { english: "society", arabic: "مجتمع", unit: "Social Issues", pronunciation: "/səˈsaɪəti/", grade: 9, partOfSpeech: "noun", exampleSentence: "We live in a diverse society.", difficulty: "medium" },
  { english: "equality", arabic: "مساواة", unit: "Social Issues", pronunciation: "/ɪˈkwɒləti/", grade: 9, partOfSpeech: "noun", exampleSentence: "Equality is a basic human right.", difficulty: "hard" },
  { english: "justice", arabic: "عدالة", unit: "Social Issues", pronunciation: "/ˈdʒʌstɪs/", grade: 9, partOfSpeech: "noun", exampleSentence: "Justice should be fair for everyone.", difficulty: "medium" },
  { english: "community", arabic: "مجتمع محلي", unit: "Social Issues", pronunciation: "/kəˈmjuːnəti/", grade: 9, partOfSpeech: "noun", exampleSentence: "Our community works together.", difficulty: "medium" },
  { english: "volunteer", arabic: "متطوع", unit: "Social Issues", pronunciation: "/ˌvɒlənˈtɪə/", grade: 9, partOfSpeech: "noun", exampleSentence: "She is a volunteer at the hospital.", difficulty: "medium" },

  // Unit 4: Career and Future
  { english: "career", arabic: "مهنة", unit: "Career and Future", pronunciation: "/kəˈrɪə/", grade: 9, partOfSpeech: "noun", exampleSentence: "I want a career in medicine.", difficulty: "medium" },
  { english: "profession", arabic: "مهنة", unit: "Career and Future", pronunciation: "/prəˈfeʃn/", grade: 9, partOfSpeech: "noun", exampleSentence: "Teaching is a noble profession.", difficulty: "medium" },
  { english: "qualification", arabic: "مؤهل", unit: "Career and Future", pronunciation: "/ˌkwɒlɪfɪˈkeɪʃn/", grade: 9, partOfSpeech: "noun", exampleSentence: "Good qualifications help you get a job.", difficulty: "hard" },
  { english: "interview", arabic: "مقابلة", unit: "Career and Future", pronunciation: "/ˈɪntəvjuː/", grade: 9, partOfSpeech: "noun", exampleSentence: "I have a job interview tomorrow.", difficulty: "medium" },
  { english: "experience", arabic: "خبرة", unit: "Career and Future", pronunciation: "/ɪkˈspɪəriəns/", grade: 9, partOfSpeech: "noun", exampleSentence: "Work experience is very valuable.", difficulty: "medium" },

  // Unit 5: Communication and Media
  { english: "communication", arabic: "تواصل", unit: "Communication and Media", pronunciation: "/kəˌmjuːnɪˈkeɪʃn/", grade: 9, partOfSpeech: "noun", exampleSentence: "Good communication is essential.", difficulty: "hard" },
  { english: "media", arabic: "وسائل الإعلام", unit: "Communication and Media", pronunciation: "/ˈmiːdiə/", grade: 9, partOfSpeech: "noun", exampleSentence: "Social media is very popular.", difficulty: "medium" },
  { english: "information", arabic: "معلومات", unit: "Communication and Media", pronunciation: "/ˌɪnfəˈmeɪʃn/", grade: 9, partOfSpeech: "noun", exampleSentence: "We need accurate information.", difficulty: "medium" },
  { english: "message", arabic: "رسالة", unit: "Communication and Media", pronunciation: "/ˈmesɪdʒ/", grade: 9, partOfSpeech: "noun", exampleSentence: "I sent her a message.", difficulty: "easy" },
  { english: "network", arabic: "شبكة", unit: "Communication and Media", pronunciation: "/ˈnetwɜːk/", grade: 9, partOfSpeech: "noun", exampleSentence: "The internet is a global network.", difficulty: "medium" }
];

// Grade 9 Grammar Rules
export const grade9Grammar: GrammarRule[] = [
  {
    title: "المبني للمجهول (Passive Voice)",
    explanation: "نستخدم المبني للمجهول عندما نريد التركيز على الحدث وليس على من قام به. التركيب: be + past participle",
    examples: [
      "The experiment was conducted by scientists. - أُجريت التجربة من قبل العلماء",
      "New discoveries are made every day. - تُكتشف اكتشافات جديدة كل يوم",
      "The message has been sent. - تم إرسال الرسالة",
      "The problem will be solved soon. - ستُحل المشكلة قريباً",
      "English is spoken worldwide. - تُتحدث الإنجليزية في جميع أنحاء العالم",
      "The research is being done carefully. - يتم إجراء البحث بعناية"
    ],
    unit: "Science and Innovation",
    grade: 9
  },
  {
    title: "الجمل الشرطية الثانية (Second Conditional)",
    explanation: "نستخدم الشرط الثاني للتحدث عن مواقف خيالية أو غير محتملة. التركيب: If + past simple, would + infinitive",
    examples: [
      "If I had more time, I would volunteer. - لو كان لدي وقت أكثر، لتطوعت",
      "If she were a scientist, she would discover new things. - لو كانت عالمة، لاكتشفت أشياء جديدة",
      "If we lived in a perfect society, there would be no problems. - لو عشنا في مجتمع مثالي، لما كانت هناك مشاكل",
      "If technology didn't exist, life would be different. - لو لم تكن التكنولوجيا موجودة، لكانت الحياة مختلفة",
      "If I could choose any career, I would be a doctor. - لو استطعت اختيار أي مهنة، لكنت طبيباً",
      "If communication were perfect, there would be no misunderstandings. - لو كان التواصل مثالياً، لما كانت هناك سوء فهم"
    ],
    unit: "Personal Development",
    grade: 9
  },
  {
    title: "الأفعال المساعدة للاحتمال (Modal Verbs of Possibility)",
    explanation: "نستخدم might, may, could للتعبير عن الاحتمال، و must للتعبير عن التأكيد القوي.",
    examples: [
      "She might become a leader. - قد تصبح قائدة",
      "This discovery may change everything. - قد يغير هذا الاكتشاف كل شيء",
      "Technology could solve many problems. - يمكن للتكنولوجيا أن تحل مشاكل كثيرة",
      "He must be very experienced. - لابد أنه ذو خبرة كبيرة",
      "The research might take years. - قد يستغرق البحث سنوات",
      "Social media may influence society. - قد تؤثر وسائل التواصل على المجتمع"
    ],
    unit: "Career and Future",
    grade: 9
  }
];

// Grade 9 Quiz Questions
export const grade9Questions: QuizQuestion[] = [
  {
    question: "The experiment _____ by the students yesterday.",
    options: ["conducted", "was conducted", "is conducted", "conducts"],
    correct: 1,
    explanation: "نستخدم المبني للمجهول في الماضي: was/were + past participle",
    unit: "Science and Innovation",
    grade: 9
  },
  {
    question: "If I _____ a scientist, I would discover new medicines.",
    options: ["am", "was", "were", "be"],
    correct: 2,
    explanation: "في الشرط الثاني، نستخدم 'were' مع جميع الضمائر",
    unit: "Personal Development",
    grade: 9
  },
  {
    question: "She _____ become a doctor in the future.",
    options: ["must", "might", "should", "would"],
    correct: 1,
    explanation: "نستخدم 'might' للتعبير عن احتمال في المستقبل",
    unit: "Career and Future",
    grade: 9
  },
  {
    question: "Good communication _____ essential for success.",
    options: ["am", "is", "are", "be"],
    correct: 1,
    explanation: "communication مفرد، لذا نستخدم 'is'",
    unit: "Communication and Media",
    grade: 9
  },
  {
    question: "If technology _____ exist, life would be very different.",
    options: ["don't", "doesn't", "didn't", "won't"],
    correct: 2,
    explanation: "في الشرط الثاني، نستخدم الماضي البسيط في جملة الشرط",
    unit: "Social Issues",
    grade: 9
  }
];