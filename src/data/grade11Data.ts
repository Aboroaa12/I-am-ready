import { VocabularyWord, GrammarRule, QuizQuestion } from '../types';

// Grade 11 Vocabulary - Based on the curriculum
export const grade11Vocabulary: VocabularyWord[] = [
  // Unit 1: Higher Education
  { english: "university", arabic: "جامعة", unit: "Higher Education", pronunciation: "/ˌjuːnɪˈvɜːsəti/", grade: 11, partOfSpeech: "noun", exampleSentence: "She wants to study medicine at university." },
  { english: "academic", arabic: "أكاديمي", unit: "Higher Education", pronunciation: "/ˌækəˈdemɪk/", grade: 11, partOfSpeech: "adjective", exampleSentence: "His academic achievements are impressive." },
  { english: "scholarship", arabic: "منحة دراسية", unit: "Higher Education", pronunciation: "/ˈskɒləʃɪp/", grade: 11, partOfSpeech: "noun", exampleSentence: "She received a scholarship to study abroad." },
  { english: "degree", arabic: "شهادة جامعية", unit: "Higher Education", pronunciation: "/dɪˈɡriː/", grade: 11, partOfSpeech: "noun", exampleSentence: "He has a degree in computer science." },
  { english: "lecture", arabic: "محاضرة", unit: "Higher Education", pronunciation: "/ˈlektʃə/", grade: 11, partOfSpeech: "noun", exampleSentence: "The professor gave an interesting lecture on climate change." },
  { english: "research", arabic: "بحث علمي", unit: "Higher Education", pronunciation: "/rɪˈsɜːtʃ/", grade: 11, partOfSpeech: "noun", exampleSentence: "She is conducting research on renewable energy." },
  { english: "campus", arabic: "حرم جامعي", unit: "Higher Education", pronunciation: "/ˈkæmpəs/", grade: 11, partOfSpeech: "noun", exampleSentence: "The university campus has many facilities for students." },
  { english: "graduate", arabic: "يتخرج", unit: "Higher Education", pronunciation: "/ˈɡrædʒueɪt/", grade: 11, partOfSpeech: "verb", exampleSentence: "She will graduate next year with a degree in engineering." },
  
  // Unit 2: Globalization
  { english: "globalization", arabic: "عولمة", unit: "Globalization", pronunciation: "/ˌɡləʊbəlaɪˈzeɪʃn/", grade: 11, partOfSpeech: "noun", exampleSentence: "Globalization has connected people around the world." },
  { english: "economy", arabic: "اقتصاد", unit: "Globalization", pronunciation: "/ɪˈkɒnəmi/", grade: 11, partOfSpeech: "noun", exampleSentence: "The global economy is affected by many factors." },
  { english: "trade", arabic: "تجارة", unit: "Globalization", pronunciation: "/treɪd/", grade: 11, partOfSpeech: "noun", exampleSentence: "International trade has increased significantly in recent years." },
  { english: "multinational", arabic: "متعدد الجنسيات", unit: "Globalization", pronunciation: "/ˌmʌltiˈnæʃnəl/", grade: 11, partOfSpeech: "adjective", exampleSentence: "Many multinational companies have offices in different countries." },
  { english: "import", arabic: "يستورد", unit: "Globalization", pronunciation: "/ɪmˈpɔːt/", grade: 11, partOfSpeech: "verb", exampleSentence: "The country imports most of its oil." },
  { english: "export", arabic: "يصدر", unit: "Globalization", pronunciation: "/ɪkˈspɔːt/", grade: 11, partOfSpeech: "verb", exampleSentence: "They export fruits to European countries." },
  { english: "currency", arabic: "عملة", unit: "Globalization", pronunciation: "/ˈkʌrənsi/", grade: 11, partOfSpeech: "noun", exampleSentence: "The dollar is a global currency." },
  { english: "market", arabic: "سوق", unit: "Globalization", pronunciation: "/ˈmɑːkɪt/", grade: 11, partOfSpeech: "noun", exampleSentence: "The company is expanding into new markets." },
  
  // Unit 3: Environmental Sustainability
  { english: "sustainability", arabic: "استدامة", unit: "Environmental Sustainability", pronunciation: "/səˌsteɪnəˈbɪləti/", grade: 11, partOfSpeech: "noun", exampleSentence: "Environmental sustainability is crucial for future generations." },
  { english: "renewable", arabic: "متجدد", unit: "Environmental Sustainability", pronunciation: "/rɪˈnjuːəbl/", grade: 11, partOfSpeech: "adjective", exampleSentence: "Solar power is a renewable energy source." },
  { english: "conservation", arabic: "حفاظ", unit: "Environmental Sustainability", pronunciation: "/ˌkɒnsəˈveɪʃn/", grade: 11, partOfSpeech: "noun", exampleSentence: "Wildlife conservation is important to protect endangered species." },
  { english: "biodiversity", arabic: "تنوع بيولوجي", unit: "Environmental Sustainability", pronunciation: "/ˌbaɪəʊdaɪˈvɜːsəti/", grade: 11, partOfSpeech: "noun", exampleSentence: "Rainforests have incredible biodiversity." },
  { english: "ecosystem", arabic: "نظام بيئي", unit: "Environmental Sustainability", pronunciation: "/ˈiːkəʊsɪstəm/", grade: 11, partOfSpeech: "noun", exampleSentence: "Human activities can damage fragile ecosystems." },
  { english: "carbon footprint", arabic: "بصمة كربونية", unit: "Environmental Sustainability", pronunciation: "/ˈkɑːbən ˈfʊtprɪnt/", grade: 11, partOfSpeech: "noun", exampleSentence: "We should try to reduce our carbon footprint." },
  { english: "deforestation", arabic: "إزالة الغابات", unit: "Environmental Sustainability", pronunciation: "/diːˌfɒrɪˈsteɪʃn/", grade: 11, partOfSpeech: "noun", exampleSentence: "Deforestation contributes to climate change." },
  { english: "pollution", arabic: "تلوث", unit: "Environmental Sustainability", pronunciation: "/pəˈluːʃn/", grade: 11, partOfSpeech: "noun", exampleSentence: "Air pollution is a major problem in big cities." },
  
  // Unit 4: Innovation and Technology
  { english: "innovation", arabic: "ابتكار", unit: "Innovation and Technology", pronunciation: "/ˌɪnəˈveɪʃn/", grade: 11, partOfSpeech: "noun", exampleSentence: "Innovation drives progress in technology." },
  { english: "artificial intelligence", arabic: "ذكاء اصطناعي", unit: "Innovation and Technology", pronunciation: "/ˌɑːtɪfɪʃl ɪnˈtelɪdʒəns/", grade: 11, partOfSpeech: "noun", exampleSentence: "Artificial intelligence is transforming many industries." },
  { english: "automation", arabic: "أتمتة", unit: "Innovation and Technology", pronunciation: "/ˌɔːtəˈmeɪʃn/", grade: 11, partOfSpeech: "noun", exampleSentence: "Automation has replaced many manual jobs." },
  { english: "biotechnology", arabic: "تقنية حيوية", unit: "Innovation and Technology", pronunciation: "/ˌbaɪəʊtekˈnɒlədʒi/", grade: 11, partOfSpeech: "noun", exampleSentence: "Biotechnology is used in medicine and agriculture." },
  { english: "nanotechnology", arabic: "تقنية النانو", unit: "Innovation and Technology", pronunciation: "/ˌnænəʊtekˈnɒlədʒi/", grade: 11, partOfSpeech: "noun", exampleSentence: "Nanotechnology deals with extremely small structures." },
  { english: "robotics", arabic: "علم الروبوتات", unit: "Innovation and Technology", pronunciation: "/rəʊˈbɒtɪks/", grade: 11, partOfSpeech: "noun", exampleSentence: "Robotics is an exciting field of engineering." },
  { english: "virtual reality", arabic: "واقع افتراضي", unit: "Innovation and Technology", pronunciation: "/ˌvɜːtʃuəl riˈæləti/", grade: 11, partOfSpeech: "noun", exampleSentence: "Virtual reality creates immersive experiences." },
  { english: "algorithm", arabic: "خوارزمية", unit: "Innovation and Technology", pronunciation: "/ˈælɡərɪðəm/", grade: 11, partOfSpeech: "noun", exampleSentence: "Algorithms are used to solve complex problems." },
  
  // Unit 5: Literature and Arts
  { english: "literature", arabic: "أدب", unit: "Literature and Arts", pronunciation: "/ˈlɪtrətʃə/", grade: 11, partOfSpeech: "noun", exampleSentence: "She has always been interested in English literature." },
  { english: "poetry", arabic: "شعر", unit: "Literature and Arts", pronunciation: "/ˈpəʊɪtri/", grade: 11, partOfSpeech: "noun", exampleSentence: "Poetry expresses emotions through language." },
  { english: "novel", arabic: "رواية", unit: "Literature and Arts", pronunciation: "/ˈnɒvl/", grade: 11, partOfSpeech: "noun", exampleSentence: "She is writing her first novel." },
  { english: "character", arabic: "شخصية", unit: "Literature and Arts", pronunciation: "/ˈkærəktə/", grade: 11, partOfSpeech: "noun", exampleSentence: "The main character in the story is very interesting." },
  { english: "plot", arabic: "حبكة", unit: "Literature and Arts", pronunciation: "/plɒt/", grade: 11, partOfSpeech: "noun", exampleSentence: "The plot of the movie was full of unexpected twists." },
  { english: "theme", arabic: "موضوع", unit: "Literature and Arts", pronunciation: "/θiːm/", grade: 11, partOfSpeech: "noun", exampleSentence: "Love is a common theme in literature." },
  { english: "metaphor", arabic: "استعارة", unit: "Literature and Arts", pronunciation: "/ˈmetəfə/", grade: 11, partOfSpeech: "noun", exampleSentence: "The author uses metaphors to describe the character's feelings." },
  { english: "symbolism", arabic: "رمزية", unit: "Literature and Arts", pronunciation: "/ˈsɪmbəlɪzəm/", grade: 11, partOfSpeech: "noun", exampleSentence: "Symbolism is an important literary device." }
];

// Grade 11 Grammar Rules
export const grade11Grammar: GrammarRule[] = [
  {
    title: "Advanced Passive Constructions",
    explanation: "نستخدم تراكيب المبني للمجهول المتقدمة مثل 'have something done' و 'is said to be' و 'is thought to have been'.",
    examples: [
      "I had my car repaired yesterday. (ترتيب شخص آخر للقيام بعمل ما)",
      "The professor is said to be an expert in this field. (يُقال إن)",
      "The ancient manuscript is believed to have been written in the 12th century. (يُعتقد أن)",
      "English is known to be spoken in many countries. (من المعروف أن)"
    ],
    unit: "Higher Education",
    grade: 11
  },
  {
    title: "Inversion for Emphasis",
    explanation: "نستخدم القلب النحوي (تغيير ترتيب الكلمات) للتأكيد أو للتعبير عن المواقف الرسمية.",
    examples: [
      "Never have I seen such a beautiful sunset. (بدلاً من: I have never seen such a beautiful sunset.)",
      "Not only did she win the competition, but she also broke the record. (بدلاً من: She not only won the competition, but she also broke the record.)",
      "Rarely does he arrive on time. (بدلاً من: He rarely arrives on time.)",
      "Should you need any assistance, please contact us. (بدلاً من: If you should need any assistance, please contact us.)"
    ],
    unit: "Globalization",
    grade: 11
  },
  {
    title: "Participle Clauses",
    explanation: "نستخدم جمل المشاركة (الحال) لتقصير الجمل وربطها بطريقة أكثر إيجازاً.",
    examples: [
      "Walking home, I saw an old friend. (= While I was walking home, I saw an old friend.)",
      "Having finished his work, he went home. (= After he had finished his work, he went home.)",
      "Worried about the exam, she studied all night. (= Because she was worried about the exam, she studied all night.)",
      "Given more time, I could have done a better job. (= If I had been given more time, I could have done a better job.)"
    ],
    unit: "Environmental Sustainability",
    grade: 11
  },
  {
    title: "Cleft Sentences",
    explanation: "نستخدم الجمل المنقسمة للتأكيد على جزء معين من الجملة.",
    examples: [
      "It was John who called you yesterday. (وليس شخص آخر)",
      "What I need is a good night's sleep. (وليس شيء آخر)",
      "It was in Paris that they first met. (وليس في مكان آخر)",
      "The reason why I'm late is that my car broke down. (تأكيد على السبب)"
    ],
    unit: "Innovation and Technology",
    grade: 11
  },
  {
    title: "Advanced Conditionals and Wishes",
    explanation: "نستخدم تراكيب شرطية متقدمة وجمل التمني للتعبير عن مواقف افتراضية أو غير واقعية.",
    examples: [
      "If it weren't for your help, I wouldn't have succeeded. (لولا مساعدتك، لما نجحت)",
      "I wish I had studied harder when I was at school. (أتمنى لو درست بجد أكثر عندما كنت في المدرسة)",
      "If only we could turn back time. (لو أننا نستطيع إعادة الزمن)",
      "Suppose you won the lottery, what would you do? (افترض أنك ربحت اليانصيب، ماذا ستفعل؟)"
    ],
    unit: "Literature and Arts",
    grade: 11
  }
];

// Grade 11 Quiz Questions
export const grade11Questions: QuizQuestion[] = [
  {
    question: "I _____ my car serviced last week.",
    options: ["have", "had", "did", "made"],
    correct: 1,
    explanation: "نستخدم 'had' في تركيب 'have something done' للتعبير عن ترتيب شخص آخر للقيام بعمل ما",
    unit: "Higher Education",
    grade: 11
  },
  {
    question: "The professor _____ to be working on a groundbreaking research project.",
    options: ["says", "is said", "is saying", "has said"],
    correct: 1,
    explanation: "نستخدم 'is said to' للتعبير عن ما يقوله الناس عن شخص أو شيء ما",
    unit: "Higher Education",
    grade: 11
  },
  {
    question: "_____ had I seen such a beautiful performance.",
    options: ["Never", "Not never", "Never before", "Not only"],
    correct: 0,
    explanation: "نستخدم القلب النحوي مع 'Never' في بداية الجملة للتأكيد",
    unit: "Globalization",
    grade: 11
  },
  {
    question: "Not only _____ the exam, but she also got the highest score.",
    options: ["she passed", "did she pass", "passed she", "she did pass"],
    correct: 1,
    explanation: "بعد 'Not only' في بداية الجملة، نستخدم القلب النحوي (did she pass)",
    unit: "Globalization",
    grade: 11
  },
  {
    question: "_____ the report, she went home.",
    options: ["Having finished", "She finished", "Finished", "After finishing"],
    correct: 0,
    explanation: "نستخدم 'Having finished' (جملة المشاركة) لتقصير الجملة 'After she had finished the report, she went home'",
    unit: "Environmental Sustainability",
    grade: 11
  },
  {
    question: "_____ about the environmental impact, the company decided to change its policies.",
    options: ["It worried", "Worried", "Being worried", "It was worried"],
    correct: 2,
    explanation: "نستخدم 'Being worried' (جملة المشاركة) لتقصير الجملة 'Because the company was worried about the environmental impact, it decided to change its policies'",
    unit: "Environmental Sustainability",
    grade: 11
  },
  {
    question: "It was _____ who discovered penicillin.",
    options: ["Alexander Fleming", "Alexander Fleming he", "that Alexander Fleming", "when Alexander Fleming"],
    correct: 0,
    explanation: "في الجملة المنقسمة التي تبدأ بـ 'It was'، نضع الاسم مباشرة بعدها ثم 'who' إذا كان الاسم لشخص",
    unit: "Innovation and Technology",
    grade: 11
  },
  {
    question: "_____ I need is some time to think about it.",
    options: ["That", "What", "Which", "It is"],
    correct: 1,
    explanation: "نستخدم 'What' في بداية الجملة المنقسمة للتأكيد على الشيء المطلوب",
    unit: "Innovation and Technology",
    grade: 11
  },
  {
    question: "If only I _____ how to solve this problem.",
    options: ["know", "knew", "have known", "would know"],
    correct: 1,
    explanation: "بعد 'If only' نستخدم الماضي البسيط (knew) للتعبير عن تمني في الحاضر",
    unit: "Literature and Arts",
    grade: 11
  },
  {
    question: "I wish I _____ to the concert last night.",
    options: ["went", "go", "had gone", "would go"],
    correct: 2,
    explanation: "بعد 'I wish' نستخدم الماضي التام (had gone) للتعبير عن تمني في الماضي",
    unit: "Literature and Arts",
    grade: 11
  }
];