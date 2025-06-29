import { VocabularyWord, GrammarRule, QuizQuestion } from '../types';

// Grade 6 Vocabulary - Based on the curriculum scope and sequence with corrected examples
export const grade6Vocabulary: VocabularyWord[] = [
  // Unit 1: The WOW! Team
  { english: "energetic", arabic: "نشيط", unit: "The WOW! Team", pronunciation: "/ˌenəˈdʒetɪk/", grade: 6, partOfSpeech: "adjective", exampleSentence: "She is very energetic and loves to play sports." },
  { english: "fun", arabic: "مرح", unit: "The WOW! Team", pronunciation: "/fʌn/", grade: 6, partOfSpeech: "adjective", exampleSentence: "The party was really fun and exciting." },
  { english: "pretty", arabic: "جميل", unit: "The WOW! Team", pronunciation: "/ˈprɪti/", grade: 6, partOfSpeech: "adjective", exampleSentence: "She has a pretty smile." },
  { english: "kind", arabic: "لطيف", unit: "The WOW! Team", pronunciation: "/kaɪnd/", grade: 6, partOfSpeech: "adjective", exampleSentence: "He is very kind to animals." },
  { english: "brave", arabic: "شجاع", unit: "The WOW! Team", pronunciation: "/breɪv/", grade: 6, partOfSpeech: "adjective", exampleSentence: "The brave firefighter saved the cat." },
  { english: "clever", arabic: "ذكي", unit: "The WOW! Team", pronunciation: "/ˈklevə/", grade: 6, partOfSpeech: "adjective", exampleSentence: "She is clever at solving puzzles." },
  { english: "height", arabic: "طول", unit: "The WOW! Team", pronunciation: "/haɪt/", grade: 6, partOfSpeech: "noun", exampleSentence: "What is your height?" },
  { english: "chatty", arabic: "كثير الكلام", unit: "The WOW! Team", pronunciation: "/ˈtʃæti/", grade: 6, partOfSpeech: "adjective", exampleSentence: "My sister is very chatty in the morning." },
  { english: "friendly", arabic: "ودود", unit: "The WOW! Team", pronunciation: "/ˈfrendli/", grade: 6, partOfSpeech: "adjective", exampleSentence: "The new student is friendly and helpful." },
  { english: "handsome", arabic: "وسيم", unit: "The WOW! Team", pronunciation: "/ˈhænsəm/", grade: 6, partOfSpeech: "adjective", exampleSentence: "He is a handsome young man." },
  { english: "creative", arabic: "مبدع", unit: "The WOW! Team", pronunciation: "/kriˈeɪtɪv/", grade: 6, partOfSpeech: "adjective", exampleSentence: "She is creative and loves to paint." },
  { english: "tall", arabic: "طويل", unit: "The WOW! Team", pronunciation: "/tɔːl/", grade: 6, partOfSpeech: "adjective", exampleSentence: "The basketball player is very tall." },
  
  // Unit 2: Free-time fun
  // Sports
  { english: "skiing", arabic: "التزلج", unit: "Free-time fun", pronunciation: "/ˈskiːɪŋ/", grade: 6, partOfSpeech: "noun", exampleSentence: "I love skiing in the mountains." },
  { english: "swimming", arabic: "السباحة", unit: "Free-time fun", pronunciation: "/ˈswɪmɪŋ/", grade: 6, partOfSpeech: "noun", exampleSentence: "Swimming is good exercise." },
  { english: "skating", arabic: "التزلج على الجليد", unit: "Free-time fun", pronunciation: "/ˈskeɪtɪŋ/", grade: 6, partOfSpeech: "noun", exampleSentence: "Ice skating is fun in winter." },
  { english: "cycling", arabic: "ركوب الدراجة", unit: "Free-time fun", pronunciation: "/ˈsaɪklɪŋ/", grade: 6, partOfSpeech: "noun", exampleSentence: "Cycling is good for your health." },
  { english: "scooting", arabic: "ركوب السكوتر", unit: "Free-time fun", pronunciation: "/ˈskuːtɪŋ/", grade: 6, partOfSpeech: "noun", exampleSentence: "Scooting to school is faster than walking." },
  { english: "volleyball", arabic: "كرة الطائرة", unit: "Free-time fun", pronunciation: "/ˈvɒlibɔːl/", grade: 6, partOfSpeech: "noun", exampleSentence: "We play volleyball at the beach." },
  { english: "hockey", arabic: "الهوكي", unit: "Free-time fun", pronunciation: "/ˈhɒki/", grade: 6, partOfSpeech: "noun", exampleSentence: "Hockey is popular in Canada." },
  { english: "badminton", arabic: "الريشة الطائرة", unit: "Free-time fun", pronunciation: "/ˈbædmɪntən/", grade: 6, partOfSpeech: "noun", exampleSentence: "Badminton requires quick reflexes." },
  { english: "karate", arabic: "الكاراتيه", unit: "Free-time fun", pronunciation: "/kəˈrɑːti/", grade: 6, partOfSpeech: "noun", exampleSentence: "He practices karate every evening." },
  { english: "gymnastics", arabic: "الجمباز", unit: "Free-time fun", pronunciation: "/dʒɪmˈnæstɪks/", grade: 6, partOfSpeech: "noun", exampleSentence: "Gymnastics requires flexibility and strength." },
  { english: "athletics", arabic: "ألعاب القوى", unit: "Free-time fun", pronunciation: "/æθˈletɪks/", grade: 6, partOfSpeech: "noun", exampleSentence: "Athletics includes running and jumping." },
  
  // Hobbies
  { english: "photography", arabic: "التصوير", unit: "Free-time fun", pronunciation: "/fəˈtɒɡrəfi/", grade: 6, partOfSpeech: "noun", exampleSentence: "Photography is my favorite hobby." },
  { english: "puzzles", arabic: "الألغاز", unit: "Free-time fun", pronunciation: "/ˈpʌzlz/", grade: 6, partOfSpeech: "noun", exampleSentence: "I enjoy solving puzzles in my free time." },
  { english: "gardening", arabic: "البستنة", unit: "Free-time fun", pronunciation: "/ˈɡɑːdnɪŋ/", grade: 6, partOfSpeech: "noun", exampleSentence: "Gardening helps me relax." },
  { english: "board games", arabic: "ألعاب الطاولة", unit: "Free-time fun", pronunciation: "/bɔːd ɡeɪmz/", grade: 6, partOfSpeech: "noun", exampleSentence: "We play board games on rainy days." },
  { english: "shows", arabic: "عروض", unit: "Free-time fun", pronunciation: "/ʃəʊz/", grade: 6, partOfSpeech: "noun", exampleSentence: "The children put on shows for their parents." },
  { english: "video games", arabic: "ألعاب الفيديو", unit: "Free-time fun", pronunciation: "/ˈvɪdiəʊ ɡeɪmz/", grade: 6, partOfSpeech: "noun", exampleSentence: "Video games can be educational and fun." },
  { english: "instruments", arabic: "آلات موسيقية", unit: "Free-time fun", pronunciation: "/ˈɪnstrəmənts/", grade: 6, partOfSpeech: "noun", exampleSentence: "She plays several musical instruments." },
  { english: "models", arabic: "نماذج", unit: "Free-time fun", pronunciation: "/ˈmɒdlz/", grade: 6, partOfSpeech: "noun", exampleSentence: "He likes making model airplanes." },
  { english: "videos", arabic: "فيديوهات", unit: "Free-time fun", pronunciation: "/ˈvɪdiəʊz/", grade: 6, partOfSpeech: "noun", exampleSentence: "They make funny videos for their friends." },
  { english: "cards", arabic: "البطاقات", unit: "Free-time fun", pronunciation: "/kɑːdz/", grade: 6, partOfSpeech: "noun", exampleSentence: "He collects baseball cards." },
  { english: "cartoons", arabic: "الرسوم المتحركة", unit: "Free-time fun", pronunciation: "/kɑːˈtuːnz/", grade: 6, partOfSpeech: "noun", exampleSentence: "Children love watching cartoons on TV." },
  { english: "diary", arabic: "مذكرات", unit: "Free-time fun", pronunciation: "/ˈdaɪəri/", grade: 6, partOfSpeech: "noun", exampleSentence: "She writes in her diary every night." },
  
  // Unit 3: Technology
  // Devices
  { english: "password", arabic: "كلمة المرور", unit: "Technology", pronunciation: "/ˈpɑːswɜːd/", grade: 6, partOfSpeech: "noun", exampleSentence: "Don't share your password with anyone." },
  { english: "app", arabic: "تطبيق", unit: "Technology", pronunciation: "/æp/", grade: 6, partOfSpeech: "noun", exampleSentence: "This app helps me learn new languages." },
  { english: "laptop", arabic: "حاسوب محمول", unit: "Technology", pronunciation: "/ˈlæptɒp/", grade: 6, partOfSpeech: "noun", exampleSentence: "I use my laptop for schoolwork." },
  { english: "camera", arabic: "كاميرا", unit: "Technology", pronunciation: "/ˈkæmərə/", grade: 6, partOfSpeech: "noun", exampleSentence: "The digital camera takes clear photos." },
  { english: "headphones", arabic: "سماعات رأس", unit: "Technology", pronunciation: "/ˈhedfəʊnz/", grade: 6, partOfSpeech: "noun", exampleSentence: "I use headphones to listen to music." },
  { english: "speaker", arabic: "مكبر صوت", unit: "Technology", pronunciation: "/ˈspiːkə/", grade: 6, partOfSpeech: "noun", exampleSentence: "The speaker is very loud and clear." },
  { english: "smartphone", arabic: "هاتف ذكي", unit: "Technology", pronunciation: "/ˈsmɑːtfəʊn/", grade: 6, partOfSpeech: "noun", exampleSentence: "My smartphone has many useful features." },
  { english: "website", arabic: "موقع إلكتروني", unit: "Technology", pronunciation: "/ˈwebsaɪt/", grade: 6, partOfSpeech: "noun", exampleSentence: "This website has lots of educational games." },
  { english: "reader", arabic: "قارئ إلكتروني", unit: "Technology", pronunciation: "/ˈriːdə/", grade: 6, partOfSpeech: "noun", exampleSentence: "An e-reader can store thousands of books." },
  { english: "screen", arabic: "شاشة", unit: "Technology", pronunciation: "/skriːn/", grade: 6, partOfSpeech: "noun", exampleSentence: "The computer screen is very bright." },
  { english: "printer", arabic: "طابعة", unit: "Technology", pronunciation: "/ˈprɪntə/", grade: 6, partOfSpeech: "noun", exampleSentence: "The printer is out of paper." },
  { english: "devices", arabic: "أجهزة", unit: "Technology", pronunciation: "/dɪˈvaɪsɪz/", grade: 6, partOfSpeech: "noun", exampleSentence: "Modern devices make life easier." },
  
  // Using technology
  { english: "online", arabic: "متصل بالإنترنت", unit: "Technology", pronunciation: "/ˈɒnlaɪn/", grade: 6, partOfSpeech: "adjective", exampleSentence: "I go online to research my homework." },
  { english: "upload", arabic: "رفع", unit: "Technology", pronunciation: "/ˌʌpˈləʊd/", grade: 6, partOfSpeech: "verb", exampleSentence: "I upload photos to share with friends." },
  { english: "download", arabic: "تنزيل", unit: "Technology", pronunciation: "/ˌdaʊnˈləʊd/", grade: 6, partOfSpeech: "verb", exampleSentence: "You can download the app for free." },
  { english: "search", arabic: "بحث", unit: "Technology", pronunciation: "/sɜːtʃ/", grade: 6, partOfSpeech: "verb", exampleSentence: "I search the internet for information." },
  { english: "press", arabic: "ضغط", unit: "Technology", pronunciation: "/pres/", grade: 6, partOfSpeech: "verb", exampleSentence: "Press the button to start the machine." },
  { english: "click", arabic: "نقر", unit: "Technology", pronunciation: "/klɪk/", grade: 6, partOfSpeech: "verb", exampleSentence: "Click on the icon to open the program." },
  { english: "message", arabic: "رسالة", unit: "Technology", pronunciation: "/ˈmesɪdʒ/", grade: 6, partOfSpeech: "noun", exampleSentence: "I send a message to my friend every day." },
  { english: "selfie", arabic: "صورة ذاتية", unit: "Technology", pronunciation: "/ˈselfi/", grade: 6, partOfSpeech: "noun", exampleSentence: "She takes a selfie with her friends." },
  
  // Unit 4: Places
  // Places and buildings
  { english: "castle", arabic: "قلعة", unit: "Places", pronunciation: "/ˈkɑːsl/", grade: 6, partOfSpeech: "noun", exampleSentence: "The old castle has many towers." },
  { english: "harbour", arabic: "ميناء", unit: "Places", pronunciation: "/ˈhɑːbə/", grade: 6, partOfSpeech: "noun", exampleSentence: "Ships dock at the harbour." },
  { english: "stadium", arabic: "ملعب", unit: "Places", pronunciation: "/ˈsteɪdiəm/", grade: 6, partOfSpeech: "noun", exampleSentence: "The football stadium holds 50,000 people." },
  { english: "tower", arabic: "برج", unit: "Places", pronunciation: "/ˈtaʊə/", grade: 6, partOfSpeech: "noun", exampleSentence: "The tower is 100 meters tall." },
  { english: "skyscraper", arabic: "ناطحة سحاب", unit: "Places", pronunciation: "/ˈskaɪskreɪpə/", grade: 6, partOfSpeech: "noun", exampleSentence: "The skyscraper has 80 floors." },
  { english: "factory", arabic: "مصنع", unit: "Places", pronunciation: "/ˈfæktri/", grade: 6, partOfSpeech: "noun", exampleSentence: "The factory produces cars." },
  { english: "hospital", arabic: "مستشفى", unit: "Places", pronunciation: "/ˈhɒspɪtl/", grade: 6, partOfSpeech: "noun", exampleSentence: "The hospital has excellent doctors." },
  { english: "palace", arabic: "قصر", unit: "Places", pronunciation: "/ˈpæləs/", grade: 6, partOfSpeech: "noun", exampleSentence: "The royal palace is very beautiful." },
  { english: "pool", arabic: "حمام سباحة", unit: "Places", pronunciation: "/puːl/", grade: 6, partOfSpeech: "noun", exampleSentence: "The swimming pool is open all day." },
  { english: "centre", arabic: "مركز", unit: "Places", pronunciation: "/ˈsentə/", grade: 6, partOfSpeech: "noun", exampleSentence: "The sports centre has a gym and pool." },
  { english: "building", arabic: "مبنى", unit: "Places", pronunciation: "/ˈbɪldɪŋ/", grade: 6, partOfSpeech: "noun", exampleSentence: "The office building is very modern." },
  { english: "apartment", arabic: "شقة", unit: "Places", pronunciation: "/əˈpɑːtmənt/", grade: 6, partOfSpeech: "noun", exampleSentence: "They live in a small apartment." },
  
  // Parts of buildings
  { english: "ceiling", arabic: "سقف", unit: "Places", pronunciation: "/ˈsiːlɪŋ/", grade: 6, partOfSpeech: "noun", exampleSentence: "The ceiling is painted white." },
  { english: "floor", arabic: "أرضية", unit: "Places", pronunciation: "/flɔː/", grade: 6, partOfSpeech: "noun", exampleSentence: "The floor is made of wood." },
  { english: "wall", arabic: "جدار", unit: "Places", pronunciation: "/wɔːl/", grade: 6, partOfSpeech: "noun", exampleSentence: "The wall is painted blue." },
  { english: "roof", arabic: "سطح", unit: "Places", pronunciation: "/ruːf/", grade: 6, partOfSpeech: "noun", exampleSentence: "The roof protects us from rain." },
  { english: "corner", arabic: "زاوية", unit: "Places", pronunciation: "/ˈkɔːnə/", grade: 6, partOfSpeech: "noun", exampleSentence: "Put the chair in the corner." },
  { english: "corridor", arabic: "ممر", unit: "Places", pronunciation: "/ˈkɒrɪdɔː/", grade: 6, partOfSpeech: "noun", exampleSentence: "Walk down the corridor to find the exit." },
  { english: "stairs", arabic: "درج", unit: "Places", pronunciation: "/steəz/", grade: 6, partOfSpeech: "noun", exampleSentence: "Take the stairs to the second floor." },
  { english: "steps", arabic: "درجات", unit: "Places", pronunciation: "/steps/", grade: 6, partOfSpeech: "noun", exampleSentence: "There are ten steps to the door." },
  { english: "lift", arabic: "مصعد", unit: "Places", pronunciation: "/lɪft/", grade: 6, partOfSpeech: "noun", exampleSentence: "Take the lift to the top floor." },
  { english: "escalator", arabic: "سلم متحرك", unit: "Places", pronunciation: "/ˈeskəleɪtə/", grade: 6, partOfSpeech: "noun", exampleSentence: "The escalator goes up and down." },
  { english: "entrance", arabic: "مدخل", unit: "Places", pronunciation: "/ˈentrəns/", grade: 6, partOfSpeech: "noun", exampleSentence: "The main entrance is on the left." },
  { english: "exit", arabic: "مخرج", unit: "Places", pronunciation: "/ˈeksɪt/", grade: 6, partOfSpeech: "noun", exampleSentence: "The emergency exit is clearly marked." },
  
  // Additional places
  { english: "college", arabic: "كلية", unit: "Places", pronunciation: "/ˈkɒlɪdʒ/", grade: 6, partOfSpeech: "noun", exampleSentence: "She studies at the local college." },
  { english: "airport", arabic: "مطار", unit: "Places", pronunciation: "/ˈeəpɔːt/", grade: 6, partOfSpeech: "noun", exampleSentence: "The airport is very busy today." },
  { english: "bridge", arabic: "جسر", unit: "Places", pronunciation: "/brɪdʒ/", grade: 6, partOfSpeech: "noun", exampleSentence: "The bridge crosses the river." },
  { english: "station", arabic: "محطة", unit: "Places", pronunciation: "/ˈsteɪʃn/", grade: 6, partOfSpeech: "noun", exampleSentence: "The fire station is near the school." },
  { english: "theatre", arabic: "مسرح", unit: "Places", pronunciation: "/ˈθɪətə/", grade: 6, partOfSpeech: "noun", exampleSentence: "We watched a play at the theatre." },
  { english: "office", arabic: "مكتب", unit: "Places", pronunciation: "/ˈɒfɪs/", grade: 6, partOfSpeech: "noun", exampleSentence: "My father works in an office." },
  { english: "square", arabic: "ساحة", unit: "Places", pronunciation: "/skweə/", grade: 6, partOfSpeech: "noun", exampleSentence: "The town square has a fountain." }
];

// Grade 6 Grammar Rules
export const grade6Grammar: GrammarRule[] = [
  {
    title: "Present simple",
    explanation: "نستخدم المضارع البسيط للتعبير عن الحقائق والعادات والأنشطة المتكررة",
    examples: [
      "I think I'm quite clever because I'm good at Maths and Science.",
      "She plays volleyball every weekend.",
      "They don't like doing puzzles.",
      "Do you collect cards?"
    ],
    unit: "The WOW! Team",
    grade: 6
  },
  {
    title: "Present simple vs Present continuous",
    explanation: "نستخدم المضارع البسيط للعادات والأنشطة المتكررة، ونستخدم المضارع المستمر للأنشطة التي تحدث الآن",
    examples: [
      "I do karate every Monday. (عادة متكررة)",
      "Look! I'm doing it now. (يحدث الآن)",
      "She plays the piano on Tuesdays. (عادة متكررة)",
      "She's playing the piano right now. (يحدث الآن)"
    ],
    unit: "Free-time fun",
    grade: 6
  },
  {
    title: "State verbs",
    explanation: "أفعال الحالة هي أفعال لا تستخدم عادة في الزمن المستمر لأنها تعبر عن حالات وليس أفعال",
    examples: [
      "He doesn't like doing photography.",
      "Do you know this song?",
      "I understand the rules.",
      "She loves playing the piano."
    ],
    unit: "Free-time fun",
    grade: 6
  },
  {
    title: "could/couldn't",
    explanation: "نستخدم could/couldn't للتعبير عن القدرة في الماضي",
    examples: [
      "We couldn't use the computers.",
      "She could play the piano when she was five.",
      "Could you ride a bike when you were four?",
      "I couldn't speak English when I was young."
    ],
    unit: "Technology",
    grade: 6
  },
  {
    title: "had to/didn't have to",
    explanation: "نستخدم had to للتعبير عن الضرورة في الماضي، و didn't have to للتعبير عن عدم الضرورة في الماضي",
    examples: [
      "She had to use a pen.",
      "They had to wait for the bus.",
      "I didn't have to do my homework yesterday.",
      "Did you have to go to school on Saturday?"
    ],
    unit: "Technology",
    grade: 6
  },
  {
    title: "Comparative adverbs",
    explanation: "نستخدم الظروف المقارنة للمقارنة بين طريقة أداء الأفعال",
    examples: [
      "I can play the piano better than you.",
      "She runs faster than her brother.",
      "He speaks more quietly than his friend.",
      "They work harder than we do."
    ],
    unit: "Technology",
    grade: 6
  },
  {
    title: "Relative pronouns",
    explanation: "نستخدم ضمائر الوصل لربط الجمل وإعطاء معلومات إضافية",
    examples: [
      "He's the doctor who she saw in the hospital.",
      "A stadium is the place where you can watch sports matches.",
      "What's the book that/which you want to read?",
      "I remember the time when you went to hospital."
    ],
    unit: "Places",
    grade: 6
  },
  {
    title: "Past continuous",
    explanation: "نستخدم الماضي المستمر للتعبير عن أحداث كانت مستمرة في وقت معين في الماضي",
    examples: [
      "She was playing in the garden when it started to rain.",
      "They were watching TV when I called.",
      "What were you doing at 7 o'clock yesterday?",
      "I wasn't sleeping when you sent the message."
    ],
    unit: "Places",
    grade: 6
  },
  {
    title: "Imperatives",
    explanation: "نستخدم صيغة الأمر لإعطاء التعليمات والتوجيهات",
    examples: [
      "Go through the door.",
      "Take the first right.",
      "Don't turn left at the traffic lights.",
      "Walk straight ahead."
    ],
    unit: "Places",
    grade: 6
  }
];

// Grade 6 Quiz Questions
export const grade6Questions: QuizQuestion[] = [
  {
    question: "I think I'm quite _____ because I'm good at Maths and Science.",
    options: ["energetic", "clever", "pretty", "kind"],
    correct: 1,
    explanation: "نستخدم كلمة clever للتعبير عن الذكاء والقدرة على التعلم بسرعة",
    unit: "The WOW! Team",
    grade: 6
  },
  {
    question: "Look! She _____ a selfie right now.",
    options: ["takes", "is taking", "take", "taking"],
    correct: 1,
    explanation: "نستخدم المضارع المستمر (is taking) للتعبير عن فعل يحدث الآن",
    unit: "Free-time fun",
    grade: 6
  },
  {
    question: "He _____ like doing photography.",
    options: ["don't", "doesn't", "isn't", "aren't"],
    correct: 1,
    explanation: "نستخدم doesn't مع ضمير الغائب المفرد (he) في النفي في المضارع البسيط",
    unit: "Free-time fun",
    grade: 6
  },
  {
    question: "When I was young, I _____ use a computer.",
    options: ["can't", "couldn't", "didn't can", "don't can"],
    correct: 1,
    explanation: "نستخدم couldn't للتعبير عن عدم القدرة في الماضي",
    unit: "Technology",
    grade: 6
  },
  {
    question: "Yesterday, she _____ use her sister's laptop.",
    options: ["has to", "have to", "had to", "having to"],
    correct: 2,
    explanation: "نستخدم had to للتعبير عن الضرورة في الماضي",
    unit: "Technology",
    grade: 6
  },
  {
    question: "My brother plays the guitar _____ than me.",
    options: ["good", "better", "best", "well"],
    correct: 1,
    explanation: "نستخدم better كظرف مقارنة من good/well",
    unit: "Technology",
    grade: 6
  },
  {
    question: "A stadium is the place _____ you can watch sports matches.",
    options: ["who", "which", "where", "when"],
    correct: 2,
    explanation: "نستخدم where للإشارة إلى المكان في جمل الوصل",
    unit: "Places",
    grade: 6
  },
  {
    question: "She _____ playing in the garden when it started to rain.",
    options: ["is", "was", "were", "are"],
    correct: 1,
    explanation: "نستخدم was مع ضمائر المفرد (she) في الماضي المستمر",
    unit: "Places",
    grade: 6
  },
  {
    question: "_____ through the door and take the first right.",
    options: ["Going", "Go", "Goes", "Went"],
    correct: 1,
    explanation: "نستخدم صيغة الأمر (Go) لإعطاء التوجيهات",
    unit: "Places",
    grade: 6
  },
  {
    question: "He's the doctor _____ she saw in the hospital.",
    options: ["who", "which", "where", "when"],
    correct: 0,
    explanation: "نستخدم who للإشارة إلى الأشخاص في جمل الوصل",
    unit: "Places",
    grade: 6
  }
];