import { VocabularyWord, GrammarRule, QuizQuestion } from '../types';

// Grade 5 Vocabulary - Intermediate level words
export const grade5Vocabulary: VocabularyWord[] = [
  // Unit 1: Welcome Back
  { english: "welcome", arabic: "مرحباً", unit: "Welcome Back", pronunciation: "/ˈwelkəm/", grade: 5, partOfSpeech: "noun", exampleSentence: "They gave us a warm welcome at the hotel." },
  { english: "return", arabic: "يعود", unit: "Welcome Back", pronunciation: "/rɪˈtɜːn/", grade: 5, partOfSpeech: "verb", exampleSentence: "We will return to school next week." },
  { english: "friend", arabic: "صديق", unit: "Welcome Back", pronunciation: "/frend/", grade: 5, partOfSpeech: "noun", exampleSentence: "She is my best friend." },
  { english: "classroom", arabic: "فصل دراسي", unit: "Welcome Back", pronunciation: "/ˈklɑːsruːm/", grade: 5, partOfSpeech: "noun", exampleSentence: "Our classroom is on the second floor." },
  { english: "teacher", arabic: "معلم", unit: "Welcome Back", pronunciation: "/ˈtiːtʃə/", grade: 5, partOfSpeech: "noun", exampleSentence: "Our teacher is very kind." },
  { english: "student", arabic: "طالب", unit: "Welcome Back", pronunciation: "/ˈstjuːdnt/", grade: 5, partOfSpeech: "noun", exampleSentence: "He is a hardworking student." },

  // Unit 2: Talent Show
  { english: "talent", arabic: "موهبة", unit: "Talent Show", pronunciation: "/ˈtælənt/", grade: 5, partOfSpeech: "noun", exampleSentence: "She has a talent for singing." },
  { english: "show", arabic: "عرض", unit: "Talent Show", pronunciation: "/ʃəʊ/", grade: 5, partOfSpeech: "noun", exampleSentence: "We watched a great show last night." },
  { english: "perform", arabic: "يؤدي", unit: "Talent Show", pronunciation: "/pəˈfɔːm/", grade: 5, partOfSpeech: "verb", exampleSentence: "She will perform a song at the talent show." },
  { english: "stage", arabic: "مسرح", unit: "Talent Show", pronunciation: "/steɪdʒ/", grade: 5, partOfSpeech: "noun", exampleSentence: "The performers stood on the stage." },
  { english: "audience", arabic: "جمهور", unit: "Talent Show", pronunciation: "/ˈɔːdiəns/", grade: 5, partOfSpeech: "noun", exampleSentence: "The audience clapped after the performance." },
  { english: "sing", arabic: "يغني", unit: "Talent Show", pronunciation: "/sɪŋ/", grade: 5, partOfSpeech: "verb", exampleSentence: "She can sing very well." },
  { english: "dance", arabic: "يرقص", unit: "Talent Show", pronunciation: "/dɑːns/", grade: 5, partOfSpeech: "verb", exampleSentence: "They dance beautifully together." },
  { english: "play", arabic: "يعزف", unit: "Talent Show", pronunciation: "/pleɪ/", grade: 5, partOfSpeech: "verb", exampleSentence: "He plays the piano in the talent show." },
  { english: "instrument", arabic: "آلة موسيقية", unit: "Talent Show", pronunciation: "/ˈɪnstrəmənt/", grade: 5, partOfSpeech: "noun", exampleSentence: "The violin is a beautiful instrument." },
  { english: "practice", arabic: "يتدرب", unit: "Talent Show", pronunciation: "/ˈpræktɪs/", grade: 5, partOfSpeech: "verb", exampleSentence: "You need to practice every day to improve." },
  { english: "nervous", arabic: "متوتر", unit: "Talent Show", pronunciation: "/ˈnɜːvəs/", grade: 5, partOfSpeech: "adjective", exampleSentence: "I feel nervous before performing on stage." },
  { english: "confident", arabic: "واثق", unit: "Talent Show", pronunciation: "/ˈkɒnfɪdənt/", grade: 5, partOfSpeech: "adjective", exampleSentence: "She is confident about her singing abilities." },

  // Unit 3: Then and Now
  { english: "past", arabic: "ماضي", unit: "Then and Now", pronunciation: "/pɑːst/", grade: 5, partOfSpeech: "noun", exampleSentence: "In the past, people didn't have smartphones." },
  { english: "present", arabic: "حاضر", unit: "Then and Now", pronunciation: "/ˈpreznt/", grade: 5, partOfSpeech: "noun", exampleSentence: "We should focus on the present, not worry about the future." },
  { english: "change", arabic: "يتغير", unit: "Then and Now", pronunciation: "/tʃeɪndʒ/", grade: 5, partOfSpeech: "verb", exampleSentence: "Technology changes very quickly." },
  { english: "modern", arabic: "حديث", unit: "Then and Now", pronunciation: "/ˈmɒdn/", grade: 5, partOfSpeech: "adjective", exampleSentence: "We live in a modern world with advanced technology." },
  { english: "traditional", arabic: "تقليدي", unit: "Then and Now", pronunciation: "/trəˈdɪʃənl/", grade: 5, partOfSpeech: "adjective", exampleSentence: "My grandmother wears traditional clothes." },
  { english: "history", arabic: "تاريخ", unit: "Then and Now", pronunciation: "/ˈhɪstri/", grade: 5, partOfSpeech: "noun", exampleSentence: "I love learning about history." },

  // Unit 4: Let's Explore!
  { english: "adventure", arabic: "مغامرة", unit: "Let's Explore!", pronunciation: "/ədˈventʃə/", grade: 5, partOfSpeech: "noun", exampleSentence: "We went on an exciting adventure in the forest." },
  { english: "explore", arabic: "يستكشف", unit: "Let's Explore!", pronunciation: "/ɪkˈsplɔː/", grade: 5, partOfSpeech: "verb", exampleSentence: "Let's explore the mysterious cave together." },
  { english: "discover", arabic: "يكتشف", unit: "Let's Explore!", pronunciation: "/dɪˈskʌvə/", grade: 5, partOfSpeech: "verb", exampleSentence: "Scientists discover new species every year." },
  { english: "journey", arabic: "رحلة", unit: "Let's Explore!", pronunciation: "/ˈdʒɜːni/", grade: 5, partOfSpeech: "noun", exampleSentence: "Our journey to the mountains was unforgettable." },
  { english: "map", arabic: "خريطة", unit: "Let's Explore!", pronunciation: "/mæp/", grade: 5, partOfSpeech: "noun", exampleSentence: "We need a map to find our way." },
  { english: "compass", arabic: "بوصلة", unit: "Let's Explore!", pronunciation: "/ˈkʌmpəs/", grade: 5, partOfSpeech: "noun", exampleSentence: "A compass helps you find direction." },

  // Unit 5: Off to the Shops
  { english: "shopping", arabic: "تسوق", unit: "Off to the Shops", pronunciation: "/ˈʃɒpɪŋ/", grade: 5, partOfSpeech: "noun", exampleSentence: "I love going shopping with my friends." },
  { english: "buy", arabic: "يشتري", unit: "Off to the Shops", pronunciation: "/baɪ/", grade: 5, partOfSpeech: "verb", exampleSentence: "I want to buy a new shirt." },
  { english: "sell", arabic: "يبيع", unit: "Off to the Shops", pronunciation: "/sel/", grade: 5, partOfSpeech: "verb", exampleSentence: "They sell fresh fruit at this market." },
  { english: "price", arabic: "سعر", unit: "Off to the Shops", pronunciation: "/praɪs/", grade: 5, partOfSpeech: "noun", exampleSentence: "What's the price of this book?" },
  { english: "expensive", arabic: "غالي", unit: "Off to the Shops", pronunciation: "/ɪkˈspensɪv/", grade: 5, partOfSpeech: "adjective", exampleSentence: "This restaurant is very expensive." },
  { english: "cheap", arabic: "رخيص", unit: "Off to the Shops", pronunciation: "/tʃiːp/", grade: 5, partOfSpeech: "adjective", exampleSentence: "These shoes are cheap and comfortable." },

  // Unit 6: Adventure Stories
  { english: "adventure", arabic: "مغامرة", unit: "Adventure Stories", pronunciation: "/ədˈventʃə/", grade: 5, partOfSpeech: "noun", exampleSentence: "We went on an exciting adventure in the forest." },
  { english: "explore", arabic: "يستكشف", unit: "Adventure Stories", pronunciation: "/ɪkˈsplɔː/", grade: 5, partOfSpeech: "verb", exampleSentence: "Let's explore the mysterious cave together." },
  { english: "treasure", arabic: "كنز", unit: "Adventure Stories", pronunciation: "/ˈtreʒə/", grade: 5, partOfSpeech: "noun", exampleSentence: "The pirates buried their treasure on the island." },
  { english: "discover", arabic: "يكتشف", unit: "Adventure Stories", pronunciation: "/dɪˈskʌvə/", grade: 5, partOfSpeech: "verb", exampleSentence: "Scientists discover new species every year." },
  { english: "journey", arabic: "رحلة", unit: "Adventure Stories", pronunciation: "/ˈdʒɜːni/", grade: 5, partOfSpeech: "noun", exampleSentence: "Our journey to the mountains was unforgettable." },
  { english: "brave", arabic: "شجاع", unit: "Adventure Stories", pronunciation: "/breɪv/", grade: 5, partOfSpeech: "adjective", exampleSentence: "The brave knight saved the princess." },

  // Unit 7: Science and Nature
  { english: "environment", arabic: "بيئة", unit: "Science and Nature", pronunciation: "/ɪnˈvaɪrənmənt/", grade: 5, partOfSpeech: "noun", exampleSentence: "We must protect our environment for future generations." },
  { english: "pollution", arabic: "تلوث", unit: "Science and Nature", pronunciation: "/pəˈluːʃn/", grade: 5, partOfSpeech: "noun", exampleSentence: "Air pollution is a serious problem in big cities." },
  { english: "recycle", arabic: "يعيد التدوير", unit: "Science and Nature", pronunciation: "/riːˈsaɪkl/", grade: 5, partOfSpeech: "verb", exampleSentence: "We should recycle plastic bottles and paper." },
  { english: "experiment", arabic: "تجربة", unit: "Science and Nature", pronunciation: "/ɪkˈsperɪmənt/", grade: 5, partOfSpeech: "noun", exampleSentence: "The science experiment was very interesting." },
  { english: "observe", arabic: "يلاحظ", unit: "Science and Nature", pronunciation: "/əbˈzɜːv/", grade: 5, partOfSpeech: "verb", exampleSentence: "Students observe the plants growing in the garden." },
  { english: "microscope", arabic: "مجهر", unit: "Science and Nature", pronunciation: "/ˈmaɪkrəskəʊp/", grade: 5, partOfSpeech: "noun", exampleSentence: "We used a microscope to see tiny organisms." },

  // Unit 8: Technology and Communication
  { english: "technology", arabic: "تكنولوجيا", unit: "Technology and Communication", pronunciation: "/tekˈnɒlədʒi/", grade: 5, partOfSpeech: "noun", exampleSentence: "Modern technology makes our lives easier." },
  { english: "computer", arabic: "حاسوب", unit: "Technology and Communication", pronunciation: "/kəmˈpjuːtə/", grade: 5, partOfSpeech: "noun", exampleSentence: "I use my computer to do homework and play games." },
  { english: "internet", arabic: "إنترنت", unit: "Technology and Communication", pronunciation: "/ˈɪntənet/", grade: 5, partOfSpeech: "noun", exampleSentence: "The internet helps us find information quickly." },
  { english: "communicate", arabic: "يتواصل", unit: "Technology and Communication", pronunciation: "/kəˈmjuːnɪkeɪt/", grade: 5, partOfSpeech: "verb", exampleSentence: "We communicate with friends through video calls." },
  { english: "message", arabic: "رسالة", unit: "Technology and Communication", pronunciation: "/ˈmesɪdʒ/", grade: 5, partOfSpeech: "noun", exampleSentence: "She sent me a message on my phone." },
  { english: "invention", arabic: "اختراع", unit: "Technology and Communication", pronunciation: "/ɪnˈvenʃn/", grade: 5, partOfSpeech: "noun", exampleSentence: "The telephone was an important invention." },

  // Unit 9: Health and Fitness
  { english: "exercise", arabic: "تمرين", unit: "Health and Fitness", pronunciation: "/ˈeksəsaɪz/", grade: 5, partOfSpeech: "noun", exampleSentence: "Regular exercise keeps us healthy and strong." },
  { english: "nutrition", arabic: "تغذية", unit: "Health and Fitness", pronunciation: "/njuːˈtrɪʃn/", grade: 5, partOfSpeech: "noun", exampleSentence: "Good nutrition is important for growing children." },
  { english: "vitamin", arabic: "فيتامين", unit: "Health and Fitness", pronunciation: "/ˈvɪtəmɪn/", grade: 5, partOfSpeech: "noun", exampleSentence: "Oranges contain vitamin C which is good for health." },
  { english: "muscle", arabic: "عضلة", unit: "Health and Fitness", pronunciation: "/ˈmʌsl/", grade: 5, partOfSpeech: "noun", exampleSentence: "Swimming helps build strong muscles." },
  { english: "energy", arabic: "طاقة", unit: "Health and Fitness", pronunciation: "/ˈenədʒi/", grade: 5, partOfSpeech: "noun", exampleSentence: "Eating breakfast gives us energy for the day." },
  { english: "balance", arabic: "توازن", unit: "Health and Fitness", pronunciation: "/ˈbæləns/", grade: 5, partOfSpeech: "noun", exampleSentence: "Yoga helps improve balance and flexibility." },

  // Unit 10: Community and Culture
  { english: "community", arabic: "مجتمع", unit: "Community and Culture", pronunciation: "/kəˈmjuːnəti/", grade: 5, partOfSpeech: "noun", exampleSentence: "Our community works together to keep the neighborhood clean." },
  { english: "tradition", arabic: "تقليد", unit: "Community and Culture", pronunciation: "/trəˈdɪʃn/", grade: 5, partOfSpeech: "noun", exampleSentence: "It's a family tradition to have dinner together every Sunday." },
  { english: "celebrate", arabic: "يحتفل", unit: "Community and Culture", pronunciation: "/ˈseləbreɪt/", grade: 5, partOfSpeech: "verb", exampleSentence: "We celebrate our national day with fireworks and parades." },
  { english: "festival", arabic: "مهرجان", unit: "Community and Culture", pronunciation: "/ˈfestɪvl/", grade: 5, partOfSpeech: "noun", exampleSentence: "The music festival attracts visitors from around the world." },
  { english: "volunteer", arabic: "متطوع", unit: "Community and Culture", pronunciation: "/ˌvɒlənˈtɪə/", grade: 5, partOfSpeech: "noun", exampleSentence: "Many volunteers help at the local food bank." },
  { english: "respect", arabic: "احترام", unit: "Community and Culture", pronunciation: "/rɪˈspekt/", grade: 5, partOfSpeech: "noun", exampleSentence: "We should show respect for people of all cultures." }
];

// Grade 5 Grammar Rules - Intermediate structures
export const grade5Grammar: GrammarRule[] = [
  {
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
    grade: 5
  },
  {
    title: "الجمل الشرطية البسيطة (First Conditional)",
    explanation: "نستخدم الجملة الشرطية الأولى للتحدث عن احتمالات مستقبلية. التركيب: If + present simple, will + base verb.",
    examples: [
      "If it rains, we will stay inside. - إذا أمطرت، سنبقى في الداخل",
      "If you study hard, you will pass the exam. - إذا درست بجد، ستنجح في الامتحان",
      "If we recycle, we will help the environment. - إذا أعدنا التدوير، سنساعد البيئة",
      "If she comes early, we will start the meeting. - إذا جاءت مبكراً، سنبدأ الاجتماع",
      "If they practice, they will improve. - إذا تدربوا، سيتحسنون",
      "If you eat vegetables, you will be healthy. - إذا أكلت الخضار، ستكون بصحة جيدة"
    ],
    unit: "Let's Explore!",
    grade: 5
  },
  {
    title: "المقارنات (Comparative and Superlative)",
    explanation: "نستخدم المقارنات للمقارنة بين شيئين أو أكثر. للصفات القصيرة نضيف -er/-est، وللطويلة نستخدم more/most.",
    examples: [
      "This computer is faster than that one. - هذا الحاسوب أسرع من ذلك",
      "She is the smartest student in class. - هي أذكى طالبة في الصف",
      "Technology is more advanced now. - التكنولوجيا أكثر تطوراً الآن",
      "This is the most interesting book. - هذا أكثر الكتب إثارة للاهتمام",
      "Running is better than walking for exercise. - الجري أفضل من المشي للتمرين",
      "This is the healthiest food option. - هذا أصح خيار طعام"
    ],
    unit: "Off to the Shops",
    grade: 5
  },
  {
    title: "الأفعال المساعدة (Modal Verbs)",
    explanation: "الأفعال المساعدة مثل can, could, should, must تعبر عن القدرة والإمكانية والنصيحة والضرورة.",
    examples: [
      "You should exercise regularly. - يجب أن تتمرن بانتظام",
      "We must protect our environment. - يجب أن نحمي بيئتنا",
      "Children can learn languages easily. - يستطيع الأطفال تعلم اللغات بسهولة",
      "Could you help me with this? - هل يمكنك مساعدتي في هذا؟",
      "You might need a jacket today. - قد تحتاج إلى سترة اليوم",
      "We ought to respect our elders. - يجب أن نحترم كبار السن"
    ],
    unit: "Then and Now",
    grade: 5
  },
  {
    title: "الجمل المعقدة (Complex Sentences)",
    explanation: "الجمل المعقدة تحتوي على جملة رئيسية وجملة فرعية مرتبطة بأدوات ربط مثل because, although, when, while.",
    examples: [
      "We celebrate festivals because they bring us together. - نحتفل بالمهرجانات لأنها تجمعنا",
      "Although it was raining, we went to the park. - رغم أنه كان يمطر، ذهبنا إلى الحديقة",
      "When volunteers help, communities become stronger. - عندما يساعد المتطوعون، تصبح المجتمعات أقوى",
      "While technology advances, we must remember traditions. - بينما تتقدم التكنولوجيا، يجب أن نتذكر التقاليد",
      "Since exercise is important, we should do it daily. - بما أن التمرين مهم، يجب أن نمارسه يومياً",
      "Before we start the experiment, we need safety equipment. - قبل أن نبدأ التجربة، نحتاج معدات السلامة"
    ],
    unit: "Community and Culture",
    grade: 5
  },
  {
    title: "أزمنة المضارع (Present Tenses)",
    explanation: "نستخدم المضارع البسيط للعادات والحقائق، والمضارع المستمر للأحداث الجارية الآن.",
    examples: [
      "She sings in the talent show every year. - تغني في عرض المواهب كل عام",
      "He is singing on stage right now. - هو يغني على المسرح الآن",
      "They practice their performance every day. - يتدربون على أدائهم كل يوم",
      "We are practicing our dance for the show. - نحن نتدرب على رقصتنا للعرض",
      "The audience always claps after a good performance. - يصفق الجمهور دائماً بعد الأداء الجيد",
      "Look! The audience is clapping for her. - انظر! الجمهور يصفق لها"
    ],
    unit: "Talent Show",
    grade: 5
  }
];

// Grade 5 Quiz Questions - Intermediate level
export const grade5Questions: QuizQuestion[] = [
  {
    question: "I _____ never been to London.",
    options: ["have", "has", "had", "having"],
    correct: 0,
    explanation: "نستخدم 'have' مع I في المضارع التام",
    unit: "Welcome Back",
    grade: 5
  },
  {
    question: "If we _____ the environment, future generations will benefit.",
    options: ["protect", "will protect", "protected", "protecting"],
    correct: 0,
    explanation: "في الجملة الشرطية الأولى، نستخدم المضارع البسيط بعد if",
    unit: "Let's Explore!",
    grade: 5
  },
  {
    question: "This smartphone is _____ than my old phone.",
    options: ["more fast", "faster", "most fast", "fastest"],
    correct: 1,
    explanation: "fast صفة قصيرة، نضيف -er للمقارنة",
    unit: "Off to the Shops",
    grade: 5
  },
  {
    question: "You _____ eat more vegetables to stay healthy.",
    options: ["can", "should", "might", "could"],
    correct: 1,
    explanation: "should تعبر عن النصيحة",
    unit: "Then and Now",
    grade: 5
  },
  {
    question: "_____ it was cold, we enjoyed the festival.",
    options: ["Because", "Although", "When", "If"],
    correct: 1,
    explanation: "Although تعبر عن التناقض",
    unit: "Community and Culture",
    grade: 5
  },
  {
    question: "What does 'adventure' mean in Arabic?",
    options: ["رحلة", "مغامرة", "كنز", "اكتشاف"],
    correct: 1,
    explanation: "adventure تعني مغامرة",
    unit: "Adventure Stories",
    grade: 5
  },
  {
    question: "We use a _____ to see very small things.",
    options: ["telescope", "microscope", "computer", "camera"],
    correct: 1,
    explanation: "المجهر (microscope) يستخدم لرؤية الأشياء الصغيرة جداً",
    unit: "Science and Nature",
    grade: 5
  },
  {
    question: "The _____ helps us find information quickly.",
    options: ["television", "radio", "internet", "newspaper"],
    correct: 2,
    explanation: "الإنترنت يساعدنا في العثور على المعلومات بسرعة",
    unit: "Technology and Communication",
    grade: 5
  },
  {
    question: "Regular _____ keeps us healthy and strong.",
    options: ["sleeping", "eating", "exercise", "reading"],
    correct: 2,
    explanation: "التمرين المنتظم يحافظ على صحتنا وقوتنا",
    unit: "Health and Fitness",
    grade: 5
  },
  {
    question: "A _____ is someone who helps others without payment.",
    options: ["teacher", "volunteer", "doctor", "student"],
    correct: 1,
    explanation: "المتطوع هو شخص يساعد الآخرين دون مقابل",
    unit: "Community and Culture",
    grade: 5
  },
  {
    question: "She _____ in the talent show next week.",
    options: ["performs", "is performing", "performed", "has performed"],
    correct: 1,
    explanation: "نستخدم المضارع المستمر (is performing) للتعبير عن حدث مخطط له في المستقبل القريب",
    unit: "Talent Show",
    grade: 5
  },
  {
    question: "What does 'talent' mean in Arabic?",
    options: ["عرض", "مسرح", "موهبة", "جمهور"],
    correct: 2,
    explanation: "talent تعني موهبة",
    unit: "Talent Show",
    grade: 5
  }
];

// أسئلة امتحانية إضافية مشابهة لورقة الامتحان التجريبية
export const grade5ExamStyleQuestions: QuizQuestion[] = [
  // أسئلة القواعد - الضمائر الوصلية
  {
    question: "The book _______ I bought yesterday is very interesting.",
    options: ["who", "which", "where", "when"],
    correct: 1,
    explanation: "نستخدم 'which' مع الأشياء والأماكن",
    unit: "Grammar - Relative Clauses",
    grade: 5
  },
  {
    question: "The teacher _______ teaches us English is very kind.",
    options: ["who", "which", "where", "when"],
    correct: 0,
    explanation: "نستخدم 'who' مع الأشخاص",
    unit: "Grammar - Relative Clauses", 
    grade: 5
  },
  
  // أسئلة القواعد - المقارنات
  {
    question: "This car is _______ than that one.",
    options: ["fast", "faster", "fastest", "more fast"],
    correct: 1,
    explanation: "نضيف -er للصفات القصيرة في المقارنة",
    unit: "Grammar - Comparatives",
    grade: 5
  },
  {
    question: "Mount Everest is the _______ mountain in the world.",
    options: ["high", "higher", "highest", "more high"],
    correct: 2,
    explanation: "نضيف -est للصفات القصيرة في التفضيل",
    unit: "Grammar - Superlatives",
    grade: 5
  },
  
  // أسئلة القواعد - المستقبل
  {
    question: "Tomorrow, we _______ visit the museum.",
    options: ["are", "will", "was", "were"],
    correct: 1,
    explanation: "نستخدم 'will' للتحدث عن المستقبل",
    unit: "Grammar - Future Tense",
    grade: 5
  },
  {
    question: "Next week, my family _______ travel to Dubai.",
    options: ["will", "was", "are", "were"],
    correct: 0,
    explanation: "نستخدم 'will' للخطط المستقبلية",
    unit: "Grammar - Future Tense",
    grade: 5
  },
  
  // أسئلة القواعد - الأفعال الناقصة
  {
    question: "She _______ swim when she was five years old.",
    options: ["can", "could", "will", "would"],
    correct: 1,
    explanation: "نستخدم 'could' للتحدث عن القدرة في الماضي",
    unit: "Grammar - Modals",
    grade: 5
  },
  {
    question: "The tourist was sad because he _______ find a good restaurant.",
    options: ["can", "could", "couldn't", "can't"],
    correct: 2,
    explanation: "نستخدم 'couldn't' للتعبير عن عدم القدرة في الماضي",
    unit: "Grammar - Modals",
    grade: 5
  },
  
  // أسئلة فهم القراءة - صح أم خطأ
  {
    question: "Read the text and answer: 'Last Saturday, Omar went to the bookstore with his father. They bought three books and a magazine. Omar was very happy because he found his favorite story book.' - Omar went to the bookstore on Saturday.",
    options: ["True", "False"],
    correct: 0,
    explanation: "النص يذكر أن عمر ذهب إلى المكتبة يوم السبت الماضي",
    unit: "Reading Comprehension",
    grade: 5
  },
  {
    question: "Based on the same text - Omar bought four books.",
    options: ["True", "False"],
    correct: 1,
    explanation: "النص يذكر أنهم اشتروا ثلاثة كتب ومجلة، وليس أربعة كتب",
    unit: "Reading Comprehension",
    grade: 5
  },
  
  // أسئلة المفردات - مطابقة الوصف
  {
    question: "What do you call a place where you can buy fresh bread and cakes?",
    options: ["butcher", "bakery", "pharmacy", "kiosk"],
    correct: 1,
    explanation: "المخبز (bakery) هو المكان الذي يُباع فيه الخبز والكعك",
    unit: "Vocabulary - Shops",
    grade: 5
  },
  {
    question: "What do you call moving stairs in a building?",
    options: ["elevator", "escalator", "ladder", "stairs"],
    correct: 1,
    explanation: "السلم المتحرك يُسمى escalator",
    unit: "Vocabulary - Buildings",
    grade: 5
  }
];