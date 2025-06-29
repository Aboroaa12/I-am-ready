import { VocabularyWord, GrammarRule, QuizQuestion } from '../types';

// Grade 12 Vocabulary - Based on the curriculum themes
export const grade12Vocabulary: VocabularyWord[] = [
  // Theme 1: News and the Media
  { english: "accurate", arabic: "دقيق", unit: "News and the Media", pronunciation: "/ˈækjərət/", grade: 12, partOfSpeech: "adjective", exampleSentence: "It's important to provide accurate information in news reports.", difficulty: "medium" },
  { english: "basic", arabic: "أساسي", unit: "News and the Media", pronunciation: "/ˈbeɪsɪk/", grade: 12, partOfSpeech: "adjective", exampleSentence: "The article covered the basic facts of the story.", difficulty: "easy" },
  { english: "bizarre", arabic: "غريب", unit: "News and the Media", pronunciation: "/bɪˈzɑː/", grade: 12, partOfSpeech: "adjective", exampleSentence: "The newspaper reported a bizarre incident in the town.", difficulty: "medium" },
  { english: "documentary", arabic: "فيلم وثائقي", unit: "News and the Media", pronunciation: "/ˌdɒkjʊˈmentəri/", grade: 12, partOfSpeech: "noun", exampleSentence: "The documentary about climate change won several awards.", difficulty: "medium" },
  { english: "drown", arabic: "يغرق", unit: "News and the Media", pronunciation: "/draʊn/", grade: 12, partOfSpeech: "verb", exampleSentence: "The news reported that two people drowned in the flood.", difficulty: "easy" },
  { english: "ethical", arabic: "أخلاقي", unit: "News and the Media", pronunciation: "/ˈeθɪkəl/", grade: 12, partOfSpeech: "adjective", exampleSentence: "Journalists must follow ethical guidelines when reporting news.", difficulty: "medium" },
  { english: "freelance", arabic: "مستقل", unit: "News and the Media", pronunciation: "/ˈfriːlɑːns/", grade: 12, partOfSpeech: "adjective", exampleSentence: "She works as a freelance journalist for several newspapers.", difficulty: "medium" },
  { english: "iceberg", arabic: "جبل جليدي", unit: "News and the Media", pronunciation: "/ˈaɪsbɜːɡ/", grade: 12, partOfSpeech: "noun", exampleSentence: "The ship hit an iceberg and sank, according to news reports.", difficulty: "medium" },
  { english: "obsession", arabic: "هوس", unit: "News and the Media", pronunciation: "/əbˈseʃən/", grade: 12, partOfSpeech: "noun", exampleSentence: "The media's obsession with celebrities can be harmful.", difficulty: "hard" },
  { english: "prey", arabic: "فريسة", unit: "News and the Media", pronunciation: "/preɪ/", grade: 12, partOfSpeech: "noun", exampleSentence: "The documentary showed how lions hunt their prey.", difficulty: "medium" },
  { english: "pursue", arabic: "يلاحق", unit: "News and the Media", pronunciation: "/pəˈsjuː/", grade: 12, partOfSpeech: "verb", exampleSentence: "The journalist decided to pursue the story despite the risks.", difficulty: "hard" },
  { english: "survive", arabic: "ينجو", unit: "News and the Media", pronunciation: "/səˈvaɪv/", grade: 12, partOfSpeech: "verb", exampleSentence: "Only five people survived the accident, according to news reports.", difficulty: "medium" },
  { english: "tragic", arabic: "مأساوي", unit: "News and the Media", pronunciation: "/ˈtrædʒɪk/", grade: 12, partOfSpeech: "adjective", exampleSentence: "The newspaper described the event as a tragic loss for the community.", difficulty: "medium" },
  
  // Theme 2: Work and Careers
  { english: "analyse", arabic: "يحلل", unit: "Work and Careers", pronunciation: "/ˈænəlaɪz/", grade: 12, partOfSpeech: "verb", exampleSentence: "The team will analyse the market data before making a decision.", difficulty: "medium" },
  { english: "apply", arabic: "يتقدم بطلب", unit: "Work and Careers", pronunciation: "/əˈplaɪ/", grade: 12, partOfSpeech: "verb", exampleSentence: "I'm going to apply for the marketing position at that company.", difficulty: "easy" },
  { english: "candidate", arabic: "مرشح", unit: "Work and Careers", pronunciation: "/ˈkændɪdeɪt/", grade: 12, partOfSpeech: "noun", exampleSentence: "The company interviewed five candidates for the position.", difficulty: "medium" },
  { english: "consultant", arabic: "مستشار", unit: "Work and Careers", pronunciation: "/kənˈsʌltənt/", grade: 12, partOfSpeech: "noun", exampleSentence: "They hired a consultant to help improve their business processes.", difficulty: "medium" },
  { english: "convince", arabic: "يقنع", unit: "Work and Careers", pronunciation: "/kənˈvɪns/", grade: 12, partOfSpeech: "verb", exampleSentence: "She managed to convince the manager to adopt her new idea.", difficulty: "medium" },
  { english: "marketing", arabic: "تسويق", unit: "Work and Careers", pronunciation: "/ˈmɑːkɪtɪŋ/", grade: 12, partOfSpeech: "noun", exampleSentence: "The company invested heavily in marketing to promote their new product.", difficulty: "medium" },
  { english: "motivated", arabic: "متحفز", unit: "Work and Careers", pronunciation: "/ˈməʊtɪveɪtɪd/", grade: 12, partOfSpeech: "adjective", exampleSentence: "Employers look for motivated individuals who can work independently.", difficulty: "medium" },
  { english: "promote", arabic: "يروج", unit: "Work and Careers", pronunciation: "/prəˈməʊt/", grade: 12, partOfSpeech: "verb", exampleSentence: "The company will promote their new product on social media.", difficulty: "medium" },
  { english: "proposal", arabic: "اقتراح", unit: "Work and Careers", pronunciation: "/prəˈpəʊzəl/", grade: 12, partOfSpeech: "noun", exampleSentence: "She submitted a detailed proposal for the new project.", difficulty: "medium" },
  { english: "referee", arabic: "مرجع", unit: "Work and Careers", pronunciation: "/ˌrefəˈriː/", grade: 12, partOfSpeech: "noun", exampleSentence: "You should include at least two referees in your job application.", difficulty: "hard" },
  { english: "shift", arabic: "نوبة عمل", unit: "Work and Careers", pronunciation: "/ʃɪft/", grade: 12, partOfSpeech: "noun", exampleSentence: "Nurses often work night shifts at the hospital.", difficulty: "easy" },
  { english: "stressful", arabic: "مرهق", unit: "Work and Careers", pronunciation: "/ˈstresfʊl/", grade: 12, partOfSpeech: "adjective", exampleSentence: "Working in emergency services can be very stressful.", difficulty: "medium" },
  { english: "verbal", arabic: "شفهي", unit: "Work and Careers", pronunciation: "/ˈvɜːbəl/", grade: 12, partOfSpeech: "adjective", exampleSentence: "Good verbal communication skills are essential for this job.", difficulty: "medium" },
  
  // Theme 3: Health and Safety
  { english: "destruction", arabic: "دمار", unit: "Health and Safety", pronunciation: "/dɪˈstrʌkʃən/", grade: 12, partOfSpeech: "noun", exampleSentence: "The earthquake caused widespread destruction in the city.", difficulty: "hard" },
  { english: "earthquake", arabic: "زلزال", unit: "Health and Safety", pronunciation: "/ˈɜːθkweɪk/", grade: 12, partOfSpeech: "noun", exampleSentence: "The earthquake measured 7.2 on the Richter scale.", difficulty: "medium" },
  { english: "emergency", arabic: "حالة طوارئ", unit: "Health and Safety", pronunciation: "/ɪˈmɜːdʒənsi/", grade: 12, partOfSpeech: "noun", exampleSentence: "In case of emergency, call the ambulance immediately.", difficulty: "medium" },
  { english: "garbage", arabic: "قمامة", unit: "Health and Safety", pronunciation: "/ˈɡɑːbɪdʒ/", grade: 12, partOfSpeech: "noun", exampleSentence: "Proper disposal of garbage helps prevent health hazards.", difficulty: "easy" },
  { english: "hurricane", arabic: "إعصار", unit: "Health and Safety", pronunciation: "/ˈhʌrɪkən/", grade: 12, partOfSpeech: "noun", exampleSentence: "The hurricane caused severe damage to coastal areas.", difficulty: "medium" },
  { english: "jogging", arabic: "الجري الخفيف", unit: "Health and Safety", pronunciation: "/ˈdʒɒɡɪŋ/", grade: 12, partOfSpeech: "noun", exampleSentence: "Regular jogging can improve your cardiovascular health.", difficulty: "easy" },
  { english: "lifeguard", arabic: "منقذ", unit: "Health and Safety", pronunciation: "/ˈlaɪfɡɑːd/", grade: 12, partOfSpeech: "noun", exampleSentence: "The lifeguard rescued a child who was struggling in the water.", difficulty: "medium" },
  { english: "litter", arabic: "نفايات", unit: "Health and Safety", pronunciation: "/ˈlɪtə/", grade: 12, partOfSpeech: "noun", exampleSentence: "There are strict penalties for people who litter in public places.", difficulty: "easy" },
  { english: "posture", arabic: "وضعية الجسم", unit: "Health and Safety", pronunciation: "/ˈpɒstʃə/", grade: 12, partOfSpeech: "noun", exampleSentence: "Maintaining good posture is important for preventing back pain.", difficulty: "medium" },
  { english: "prone to", arabic: "عرضة لـ", unit: "Health and Safety", pronunciation: "/prəʊn tuː/", grade: 12, partOfSpeech: "adjective", exampleSentence: "People with certain medical conditions are more prone to infections.", difficulty: "hard" },
  { english: "restore", arabic: "يستعيد", unit: "Health and Safety", pronunciation: "/rɪˈstɔː/", grade: 12, partOfSpeech: "verb", exampleSentence: "The community worked together to restore services after the flood.", difficulty: "medium" },
  { english: "sore", arabic: "مؤلم", unit: "Health and Safety", pronunciation: "/sɔː/", grade: 12, partOfSpeech: "adjective", exampleSentence: "After exercising, my muscles were sore for two days.", difficulty: "easy" },
  { english: "torrential", arabic: "غزير", unit: "Health and Safety", pronunciation: "/təˈrenʃəl/", grade: 12, partOfSpeech: "adjective", exampleSentence: "Torrential rain caused flooding in many areas.", difficulty: "hard" },
  
  // Theme 4: Citizenship
  { english: "charity", arabic: "جمعية خيرية", unit: "Citizenship", pronunciation: "/ˈtʃærəti/", grade: 12, partOfSpeech: "noun", exampleSentence: "The charity provides food and shelter for homeless people.", difficulty: "medium" },
  { english: "diverse", arabic: "متنوع", unit: "Citizenship", pronunciation: "/daɪˈvɜːs/", grade: 12, partOfSpeech: "adjective", exampleSentence: "Our school has students from diverse cultural backgrounds.", difficulty: "medium" },
  { english: "donate", arabic: "يتبرع", unit: "Citizenship", pronunciation: "/dəʊˈneɪt/", grade: 12, partOfSpeech: "verb", exampleSentence: "Many people donate money to help those affected by natural disasters.", difficulty: "medium" },
  { english: "fundraise", arabic: "يجمع التبرعات", unit: "Citizenship", pronunciation: "/ˈfʌndreɪz/", grade: 12, partOfSpeech: "verb", exampleSentence: "The students will fundraise for the local hospital.", difficulty: "medium" },
  { english: "hospitable", arabic: "مضياف", unit: "Citizenship", pronunciation: "/hɒˈspɪtəbl/", grade: 12, partOfSpeech: "adjective", exampleSentence: "Omani people are known for being hospitable to visitors.", difficulty: "hard" },
  { english: "inspire", arabic: "يلهم", unit: "Citizenship", pronunciation: "/ɪnˈspaɪə/", grade: 12, partOfSpeech: "verb", exampleSentence: "Good leaders inspire others to take positive action.", difficulty: "medium" },
  { english: "proud", arabic: "فخور", unit: "Citizenship", pronunciation: "/praʊd/", grade: 12, partOfSpeech: "adjective", exampleSentence: "We are proud of our national heritage and traditions.", difficulty: "easy" },
  { english: "residence", arabic: "إقامة", unit: "Citizenship", pronunciation: "/ˈrezɪdəns/", grade: 12, partOfSpeech: "noun", exampleSentence: "You need to prove your residence to apply for certain services.", difficulty: "medium" },
  { english: "respect", arabic: "احترام", unit: "Citizenship", pronunciation: "/rɪˈspekt/", grade: 12, partOfSpeech: "verb", exampleSentence: "Good citizens respect the laws and customs of their country.", difficulty: "easy" },
  { english: "responsibility", arabic: "مسؤولية", unit: "Citizenship", pronunciation: "/rɪˌspɒnsəˈbɪləti/", grade: 12, partOfSpeech: "noun", exampleSentence: "Voting is an important responsibility of citizenship.", difficulty: "hard" },
  { english: "tolerance", arabic: "تسامح", unit: "Citizenship", pronunciation: "/ˈtɒlərəns/", grade: 12, partOfSpeech: "noun", exampleSentence: "Tolerance of different beliefs is essential in a diverse society.", difficulty: "medium" },
  { english: "uphold", arabic: "يدعم", unit: "Citizenship", pronunciation: "/ʌpˈhəʊld/", grade: 12, partOfSpeech: "verb", exampleSentence: "Citizens should uphold the values of their community.", difficulty: "medium" }
];

// Grade 12 Grammar Rules
export const grade12Grammar: GrammarRule[] = [
  {
    title: "Reported Speech (Advanced)",
    explanation: "نستخدم الكلام المنقول لنقل ما قاله شخص ما دون استخدام كلماته الدقيقة. في المستوى المتقدم، نتعامل مع تغييرات الزمن والضمائر وظروف الزمان والمكان وأفعال النقل المختلفة.",
    examples: [
      "Direct: \"I am writing an article.\" → Reported: She said (that) she was writing an article.",
      "Direct: \"We will publish this tomorrow.\" → Reported: They said (that) they would publish that the next day.",
      "Direct: \"Have you finished the report?\" → Reported: He asked if I had finished the report.",
      "Direct: \"Don't use unethical methods!\" → Reported: The editor warned the journalist not to use unethical methods."
    ],
    unit: "News and the Media",
    grade: 12
  },
  {
    title: "Modal Verbs of Obligation, Desirability and Necessity",
    explanation: "نستخدم الأفعال المساعدة للتعبير عن الالتزام والرغبة والضرورة في سياقات مختلفة، خاصة في بيئة العمل.",
    examples: [
      "You must submit your application before the deadline. (التزام قوي)",
      "You should include references in your CV. (نصيحة)",
      "Candidates need to have relevant experience. (ضرورة)",
      "You don't have to wear formal clothes to the interview. (عدم ضرورة)",
      "You might want to prepare answers to common interview questions. (اقتراح)"
    ],
    unit: "Work and Careers",
    grade: 12
  },
  {
    title: "Conditionals (Mixed and Advanced)",
    explanation: "نستخدم الجمل الشرطية المختلطة والمتقدمة للتعبير عن مواقف معقدة تجمع بين أزمنة مختلفة أو تتضمن هياكل نحوية متقدمة.",
    examples: [
      "If the hurricane hadn't been predicted, many more people would be in danger now. (ماضي تام في الشرط، مضارع في النتيجة)",
      "If I were you, I would have prepared an emergency kit. (مضارع في الشرط، ماضي تام في النتيجة)",
      "Had there been proper safety measures, the accident could have been avoided. (شرط مقلوب بدون 'if')",
      "Should you experience any symptoms, you must seek medical attention immediately. (شرط مع 'should' المقلوبة)"
    ],
    unit: "Health and Safety",
    grade: 12
  },
  {
    title: "Used to + Infinitive",
    explanation: "نستخدم 'used to + infinitive' للتعبير عن عادات أو حالات كانت موجودة في الماضي ولكنها لم تعد موجودة الآن.",
    examples: [
      "People used to throw garbage in the streets, but now they are more environmentally conscious.",
      "I used to live in the city center, but now I live in the suburbs.",
      "Did you use to volunteer when you were younger?",
      "He didn't use to respect other people's opinions, but now he's more tolerant."
    ],
    unit: "Citizenship",
    grade: 12
  },
  {
    title: "Cohesive Devices in Writing",
    explanation: "نستخدم أدوات الربط لإنشاء تماسك في الكتابة وربط الأفكار بطريقة منطقية ومتسلسلة.",
    examples: [
      "Firstly, we need to identify the problem. Secondly, we should analyse possible solutions. Finally, we can implement the best option.",
      "The charity helps homeless people. Moreover, it provides education for underprivileged children.",
      "Despite the challenges, the community remained united. Nevertheless, they needed external support.",
      "The government introduced new policies. As a result, citizenship applications increased significantly."
    ],
    unit: "Citizenship",
    grade: 12
  }
];

// Grade 12 Quiz Questions
export const grade12Questions: QuizQuestion[] = [
  {
    question: "She said she _____ working on an important news story.",
    options: ["is", "was", "has been", "will be"],
    correct: 1,
    explanation: "في الكلام المنقول، نحول المضارع البسيط 'am' إلى الماضي البسيط 'was'",
    unit: "News and the Media",
    grade: 12
  },
  {
    question: "The reporter asked if I _____ the documentary yet.",
    options: ["watched", "had watched", "have watched", "was watching"],
    correct: 1,
    explanation: "في الكلام المنقول، نحول المضارع التام 'have watched' إلى الماضي التام 'had watched'",
    unit: "News and the Media",
    grade: 12
  },
  {
    question: "Candidates _____ arrive on time for the interview.",
    options: ["must", "might", "could", "would"],
    correct: 0,
    explanation: "نستخدم 'must' للتعبير عن الالتزام القوي",
    unit: "Work and Careers",
    grade: 12
  },
  {
    question: "You _____ wear formal clothes to the interview, but it's recommended.",
    options: ["must", "should", "have to", "don't have to"],
    correct: 3,
    explanation: "نستخدم 'don't have to' للتعبير عن عدم الضرورة",
    unit: "Work and Careers",
    grade: 12
  },
  {
    question: "If the hurricane _____ predicted, many more people would be in danger now.",
    options: ["wasn't", "wouldn't be", "hadn't been", "isn't"],
    correct: 2,
    explanation: "نستخدم الماضي التام في الشرط المختلط عندما نتحدث عن حدث في الماضي له تأثير على الحاضر",
    unit: "Health and Safety",
    grade: 12
  },
  {
    question: "_____ there been proper safety measures, the accident could have been avoided.",
    options: ["If", "Had", "Would", "Should"],
    correct: 1,
    explanation: "نستخدم 'Had' في بداية الجملة كبديل لـ 'If there had been' في الشرط المقلوب",
    unit: "Health and Safety",
    grade: 12
  },
  {
    question: "People _____ throw garbage in the streets, but now they are more environmentally conscious.",
    options: ["use to", "used to", "were used to", "are used to"],
    correct: 1,
    explanation: "نستخدم 'used to' للتعبير عن عادة في الماضي لم تعد موجودة الآن",
    unit: "Citizenship",
    grade: 12
  },
  {
    question: "_____ the challenges, the community remained united.",
    options: ["Although", "Despite", "However", "Nevertheless"],
    correct: 1,
    explanation: "نستخدم 'Despite' متبوعة باسم أو عبارة اسمية للتعبير عن التناقض",
    unit: "Citizenship",
    grade: 12
  },
  {
    question: "The government introduced new policies. _____, citizenship applications increased.",
    options: ["Therefore", "However", "As a result", "Despite this"],
    correct: 2,
    explanation: "نستخدم 'As a result' للتعبير عن النتيجة المباشرة لحدث سابق",
    unit: "Citizenship",
    grade: 12
  },
  {
    question: "What does 'ethical' mean in Arabic?",
    options: ["دقيق", "مستقل", "أخلاقي", "مأساوي"],
    correct: 2,
    explanation: "ethical تعني أخلاقي باللغة العربية",
    unit: "News and the Media",
    grade: 12
  }
];