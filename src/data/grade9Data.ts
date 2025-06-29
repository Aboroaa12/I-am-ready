import { VocabularyWord, GrammarRule, QuizQuestion } from '../types';

// Grade 9 Vocabulary - Based on the curriculum
export const grade9Vocabulary: VocabularyWord[] = [
  // Unit 1: Global Citizens
  { english: "global", arabic: "عالمي", unit: "Global Citizens", pronunciation: "/ˈɡləʊbl/", grade: 9, partOfSpeech: "adjective", exampleSentence: "Climate change is a global issue." },
  { english: "citizen", arabic: "مواطن", unit: "Global Citizens", pronunciation: "/ˈsɪtɪzn/", grade: 9, partOfSpeech: "noun", exampleSentence: "Every citizen has rights and responsibilities." },
  { english: "responsibility", arabic: "مسؤولية", unit: "Global Citizens", pronunciation: "/rɪˌspɒnsəˈbɪləti/", grade: 9, partOfSpeech: "noun", exampleSentence: "It's our responsibility to protect the environment." },
  { english: "volunteer", arabic: "متطوع", unit: "Global Citizens", pronunciation: "/ˌvɒlənˈtɪə/", grade: 9, partOfSpeech: "noun", exampleSentence: "She works as a volunteer at the local hospital." },
  { english: "community", arabic: "مجتمع", unit: "Global Citizens", pronunciation: "/kəˈmjuːnəti/", grade: 9, partOfSpeech: "noun", exampleSentence: "We need to help our local community." },
  { english: "environment", arabic: "بيئة", unit: "Global Citizens", pronunciation: "/ɪnˈvaɪrənmənt/", grade: 9, partOfSpeech: "noun", exampleSentence: "We must protect our environment for future generations." },
  { english: "sustainable", arabic: "مستدام", unit: "Global Citizens", pronunciation: "/səˈsteɪnəbl/", grade: 9, partOfSpeech: "adjective", exampleSentence: "We need to find sustainable solutions to environmental problems." },
  { english: "recycle", arabic: "إعادة تدوير", unit: "Global Citizens", pronunciation: "/ˌriːˈsaɪkl/", grade: 9, partOfSpeech: "verb", exampleSentence: "It's important to recycle paper, plastic, and glass." },
  
  // Unit 2: Technology Today
  { english: "technology", arabic: "تكنولوجيا", unit: "Technology Today", pronunciation: "/tekˈnɒlədʒi/", grade: 9, partOfSpeech: "noun", exampleSentence: "Modern technology has changed the way we live." },
  { english: "innovation", arabic: "ابتكار", unit: "Technology Today", pronunciation: "/ˌɪnəˈveɪʃn/", grade: 9, partOfSpeech: "noun", exampleSentence: "This company is known for its innovation in smartphone design." },
  { english: "artificial intelligence", arabic: "ذكاء اصطناعي", unit: "Technology Today", pronunciation: "/ˌɑːtɪfɪʃl ɪnˈtelɪdʒəns/", grade: 9, partOfSpeech: "noun", exampleSentence: "Artificial intelligence is changing many industries." },
  { english: "virtual reality", arabic: "واقع افتراضي", unit: "Technology Today", pronunciation: "/ˌvɜːtʃuəl riˈæləti/", grade: 9, partOfSpeech: "noun", exampleSentence: "Virtual reality games are becoming more realistic." },
  { english: "social media", arabic: "وسائل التواصل الاجتماعي", unit: "Technology Today", pronunciation: "/ˌsəʊʃl ˈmiːdiə/", grade: 9, partOfSpeech: "noun", exampleSentence: "Many teenagers spend hours on social media every day." },
  { english: "digital", arabic: "رقمي", unit: "Technology Today", pronunciation: "/ˈdɪdʒɪtl/", grade: 9, partOfSpeech: "adjective", exampleSentence: "We live in a digital age." },
  { english: "cybersecurity", arabic: "أمن سيبراني", unit: "Technology Today", pronunciation: "/ˌsaɪbəsɪˈkjʊərəti/", grade: 9, partOfSpeech: "noun", exampleSentence: "Cybersecurity is important to protect our personal information online." },
  { english: "algorithm", arabic: "خوارزمية", unit: "Technology Today", pronunciation: "/ˈælɡərɪðəm/", grade: 9, partOfSpeech: "noun", exampleSentence: "Search engines use complex algorithms to find information." },
  
  // Unit 3: Health and Fitness
  { english: "nutrition", arabic: "تغذية", unit: "Health and Fitness", pronunciation: "/njuːˈtrɪʃn/", grade: 9, partOfSpeech: "noun", exampleSentence: "Good nutrition is essential for health." },
  { english: "exercise", arabic: "تمرين", unit: "Health and Fitness", pronunciation: "/ˈeksəsaɪz/", grade: 9, partOfSpeech: "noun", exampleSentence: "Regular exercise helps keep you healthy." },
  { english: "balanced diet", arabic: "نظام غذائي متوازن", unit: "Health and Fitness", pronunciation: "/ˌbælənst ˈdaɪət/", grade: 9, partOfSpeech: "noun", exampleSentence: "A balanced diet includes fruits, vegetables, and protein." },
  { english: "mental health", arabic: "صحة نفسية", unit: "Health and Fitness", pronunciation: "/ˌmentl ˈhelθ/", grade: 9, partOfSpeech: "noun", exampleSentence: "Mental health is as important as physical health." },
  { english: "wellbeing", arabic: "رفاهية", unit: "Health and Fitness", pronunciation: "/ˌwelˈbiːɪŋ/", grade: 9, partOfSpeech: "noun", exampleSentence: "The program focuses on student wellbeing." },
  { english: "lifestyle", arabic: "نمط حياة", unit: "Health and Fitness", pronunciation: "/ˈlaɪfstaɪl/", grade: 9, partOfSpeech: "noun", exampleSentence: "A healthy lifestyle includes good sleep habits." },
  { english: "hydration", arabic: "ترطيب", unit: "Health and Fitness", pronunciation: "/haɪˈdreɪʃn/", grade: 9, partOfSpeech: "noun", exampleSentence: "Proper hydration is important during exercise." },
  { english: "mindfulness", arabic: "اليقظة الذهنية", unit: "Health and Fitness", pronunciation: "/ˈmaɪndfəlnəs/", grade: 9, partOfSpeech: "noun", exampleSentence: "Mindfulness practices can reduce stress." },
  
  // Unit 4: Career Paths
  { english: "career", arabic: "مهنة", unit: "Career Paths", pronunciation: "/kəˈrɪə/", grade: 9, partOfSpeech: "noun", exampleSentence: "She has had a successful career in medicine." },
  { english: "profession", arabic: "مهنة", unit: "Career Paths", pronunciation: "/prəˈfeʃn/", grade: 9, partOfSpeech: "noun", exampleSentence: "Teaching is a rewarding profession." },
  { english: "qualification", arabic: "مؤهل", unit: "Career Paths", pronunciation: "/ˌkwɒlɪfɪˈkeɪʃn/", grade: 9, partOfSpeech: "noun", exampleSentence: "You need specific qualifications for this job." },
  { english: "resume", arabic: "سيرة ذاتية", unit: "Career Paths", pronunciation: "/ˈrezjuːmeɪ/", grade: 9, partOfSpeech: "noun", exampleSentence: "I updated my resume before applying for the job." },
  { english: "interview", arabic: "مقابلة", unit: "Career Paths", pronunciation: "/ˈɪntəvjuː/", grade: 9, partOfSpeech: "noun", exampleSentence: "I have a job interview tomorrow." },
  { english: "skill", arabic: "مهارة", unit: "Career Paths", pronunciation: "/skɪl/", grade: 9, partOfSpeech: "noun", exampleSentence: "Communication is an important skill in any job." },
  { english: "experience", arabic: "خبرة", unit: "Career Paths", pronunciation: "/ɪkˈspɪəriəns/", grade: 9, partOfSpeech: "noun", exampleSentence: "She has five years of experience in marketing." },
  { english: "internship", arabic: "تدريب عملي", unit: "Career Paths", pronunciation: "/ˈɪntɜːnʃɪp/", grade: 9, partOfSpeech: "noun", exampleSentence: "The internship gave me valuable work experience." },
  
  // Unit 5: Cultural Exchange
  { english: "culture", arabic: "ثقافة", unit: "Cultural Exchange", pronunciation: "/ˈkʌltʃə/", grade: 9, partOfSpeech: "noun", exampleSentence: "Every country has its own unique culture." },
  { english: "tradition", arabic: "تقليد", unit: "Cultural Exchange", pronunciation: "/trəˈdɪʃn/", grade: 9, partOfSpeech: "noun", exampleSentence: "This festival is an important tradition in our country." },
  { english: "diversity", arabic: "تنوع", unit: "Cultural Exchange", pronunciation: "/daɪˈvɜːsəti/", grade: 9, partOfSpeech: "noun", exampleSentence: "Cultural diversity makes our society stronger." },
  { english: "heritage", arabic: "تراث", unit: "Cultural Exchange", pronunciation: "/ˈherɪtɪdʒ/", grade: 9, partOfSpeech: "noun", exampleSentence: "We should preserve our cultural heritage." },
  { english: "customs", arabic: "عادات", unit: "Cultural Exchange", pronunciation: "/ˈkʌstəmz/", grade: 9, partOfSpeech: "noun", exampleSentence: "Different countries have different customs and traditions." },
  { english: "exchange", arabic: "تبادل", unit: "Cultural Exchange", pronunciation: "/ɪksˈtʃeɪndʒ/", grade: 9, partOfSpeech: "noun", exampleSentence: "The cultural exchange program helped students learn about other countries." },
  { english: "identity", arabic: "هوية", unit: "Cultural Exchange", pronunciation: "/aɪˈdentəti/", grade: 9, partOfSpeech: "noun", exampleSentence: "Language is an important part of cultural identity." },
  { english: "perspective", arabic: "وجهة نظر", unit: "Cultural Exchange", pronunciation: "/pəˈspektɪv/", grade: 9, partOfSpeech: "noun", exampleSentence: "Traveling gives you a new perspective on the world." }
];

// Grade 9 Grammar Rules
export const grade9Grammar: GrammarRule[] = [
  {
    title: "Present Perfect Continuous",
    explanation: "نستخدم المضارع التام المستمر للتعبير عن أحداث بدأت في الماضي واستمرت حتى الوقت الحاضر، مع التركيز على استمرارية الحدث.",
    examples: [
      "I have been studying English for five years.",
      "She has been working on this project since January.",
      "They have been living in Oman for ten years.",
      "How long have you been waiting here?"
    ],
    unit: "Global Citizens",
    grade: 9
  },
  {
    title: "Past Perfect",
    explanation: "نستخدم الماضي التام للتعبير عن حدث وقع قبل حدث آخر في الماضي.",
    examples: [
      "By the time I arrived, the meeting had already started.",
      "She had finished her homework before dinner.",
      "They had never seen such a beautiful place before they visited Oman.",
      "I realized that I had forgotten my passport at home."
    ],
    unit: "Technology Today",
    grade: 9
  },
  {
    title: "Conditionals (First, Second, and Third)",
    explanation: "نستخدم الجمل الشرطية للتعبير عن مواقف محتملة أو غير محتملة أو مستحيلة.",
    examples: [
      "If it rains tomorrow, we will cancel the picnic. (First conditional - حالة محتملة في المستقبل)",
      "If I had more time, I would learn another language. (Second conditional - حالة غير محتملة في الحاضر)",
      "If she had studied harder, she would have passed the exam. (Third conditional - حالة مستحيلة في الماضي)",
      "What would you do if you won the lottery? (Second conditional)"
    ],
    unit: "Career Paths",
    grade: 9
  },
  {
    title: "Reported Speech",
    explanation: "نستخدم الكلام المنقول لنقل ما قاله شخص ما دون استخدام كلماته الدقيقة.",
    examples: [
      "Direct: \"I am tired.\" → Reported: He said (that) he was tired.",
      "Direct: \"I will call you tomorrow.\" → Reported: She said (that) she would call me the next day.",
      "Direct: \"Have you finished your homework?\" → Reported: He asked me if I had finished my homework.",
      "Direct: \"Don't touch that!\" → Reported: She told me not to touch that."
    ],
    unit: "Cultural Exchange",
    grade: 9
  },
  {
    title: "Passive Voice",
    explanation: "نستخدم المبني للمجهول عندما يكون التركيز على الحدث أكثر من الفاعل، أو عندما لا نعرف من هو الفاعل.",
    examples: [
      "Active: People speak English all over the world. → Passive: English is spoken all over the world.",
      "Active: Someone stole my bike. → Passive: My bike was stolen.",
      "Active: They will announce the results tomorrow. → Passive: The results will be announced tomorrow.",
      "Active: They have built a new hospital. → Passive: A new hospital has been built."
    ],
    unit: "Health and Fitness",
    grade: 9
  }
];

// Grade 9 Quiz Questions
export const grade9Questions: QuizQuestion[] = [
  {
    question: "She _____ in this company for five years.",
    options: ["works", "is working", "has been working", "worked"],
    correct: 2,
    explanation: "نستخدم المضارع التام المستمر (has been working) للتعبير عن حدث بدأ في الماضي واستمر حتى الوقت الحاضر",
    unit: "Global Citizens",
    grade: 9
  },
  {
    question: "By the time we arrived at the cinema, the film _____.",
    options: ["started", "has started", "had started", "was starting"],
    correct: 2,
    explanation: "نستخدم الماضي التام (had started) للتعبير عن حدث وقع قبل حدث آخر في الماضي",
    unit: "Technology Today",
    grade: 9
  },
  {
    question: "If I _____ more time, I would learn another language.",
    options: ["have", "had", "will have", "would have"],
    correct: 1,
    explanation: "نستخدم 'had' في الجملة الشرطية الثانية (Second conditional) للتعبير عن حالة غير محتملة في الحاضر",
    unit: "Career Paths",
    grade: 9
  },
  {
    question: "She said she _____ to the party the next day.",
    options: ["will come", "comes", "would come", "came"],
    correct: 2,
    explanation: "في الكلام المنقول، نحول 'will come' إلى 'would come'",
    unit: "Cultural Exchange",
    grade: 9
  },
  {
    question: "The Eiffel Tower _____ by millions of tourists every year.",
    options: ["visits", "is visited", "visited", "has visited"],
    correct: 1,
    explanation: "نستخدم المبني للمجهول (is visited) لأن التركيز على الحدث وليس الفاعل",
    unit: "Health and Fitness",
    grade: 9
  },
  {
    question: "If she _____ harder, she would have passed the exam.",
    options: ["studied", "studies", "had studied", "would study"],
    correct: 2,
    explanation: "نستخدم 'had studied' في الجملة الشرطية الثالثة (Third conditional) للتعبير عن حالة مستحيلة في الماضي",
    unit: "Career Paths",
    grade: 9
  },
  {
    question: "_____ you _____ your homework yet?",
    options: ["Did / finish", "Have / finished", "Are / finishing", "Do / finish"],
    correct: 1,
    explanation: "نستخدم المضارع التام (Have ... finished) للسؤال عن حدث قد يكون انتهى في وقت غير محدد في الماضي",
    unit: "Global Citizens",
    grade: 9
  },
  {
    question: "The news _____ on TV last night.",
    options: ["was announced", "were announced", "announced", "is announced"],
    correct: 0,
    explanation: "نستخدم المبني للمجهول في الماضي البسيط (was announced) لأن 'news' تعامل كمفرد",
    unit: "Technology Today",
    grade: 9
  },
  {
    question: "He asked me where _____.",
    options: ["do I live", "I lived", "I live", "did I live"],
    correct: 1,
    explanation: "في الكلام المنقول، نحول السؤال المباشر 'Where do you live?' إلى 'where I lived'",
    unit: "Cultural Exchange",
    grade: 9
  },
  {
    question: "You should eat healthy food and exercise regularly if you want to _____.",
    options: ["stay fit", "staying fit", "stayed fit", "to stay fit"],
    correct: 0,
    explanation: "بعد 'want to' نستخدم الفعل في صيغة المصدر (stay)",
    unit: "Health and Fitness",
    grade: 9
  }
];