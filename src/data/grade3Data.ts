import { VocabularyWord, GrammarRule, QuizQuestion } from '../types';

// Grade 3 Vocabulary - Intermediate basic level
export const grade3Vocabulary: VocabularyWord[] = [
  // Unit 1: My School
  { english: "school", arabic: "مدرسة", unit: "My School", pronunciation: "/skuːl/", grade: 3, partOfSpeech: "noun", exampleSentence: "I go to school every day.", difficulty: "easy" },
  { english: "teacher", arabic: "معلم", unit: "My School", pronunciation: "/ˈtiːtʃə/", grade: 3, partOfSpeech: "noun", exampleSentence: "My teacher is very kind.", difficulty: "easy" },
  { english: "student", arabic: "طالب", unit: "My School", pronunciation: "/ˈstjuːdnt/", grade: 3, partOfSpeech: "noun", exampleSentence: "I am a good student.", difficulty: "easy" },
  { english: "classroom", arabic: "فصل دراسي", unit: "My School", pronunciation: "/ˈklɑːsruːm/", grade: 3, partOfSpeech: "noun", exampleSentence: "Our classroom is big.", difficulty: "medium" },
  { english: "book", arabic: "كتاب", unit: "My School", pronunciation: "/bʊk/", grade: 3, partOfSpeech: "noun", exampleSentence: "I read my book.", difficulty: "easy" },
  { english: "pencil", arabic: "قلم رصاص", unit: "My School", pronunciation: "/ˈpensl/", grade: 3, partOfSpeech: "noun", exampleSentence: "I write with a pencil.", difficulty: "easy" },

  // Unit 2: My Friends
  { english: "friend", arabic: "صديق", unit: "My Friends", pronunciation: "/frend/", grade: 3, partOfSpeech: "noun", exampleSentence: "She is my best friend.", difficulty: "easy" },
  { english: "play", arabic: "يلعب", unit: "My Friends", pronunciation: "/pleɪ/", grade: 3, partOfSpeech: "verb", exampleSentence: "We play together.", difficulty: "easy" },
  { english: "share", arabic: "يشارك", unit: "My Friends", pronunciation: "/ʃeə/", grade: 3, partOfSpeech: "verb", exampleSentence: "I share my toys.", difficulty: "medium" },
  { english: "help", arabic: "يساعد", unit: "My Friends", pronunciation: "/help/", grade: 3, partOfSpeech: "verb", exampleSentence: "Friends help each other.", difficulty: "easy" },
  { english: "kind", arabic: "لطيف", unit: "My Friends", pronunciation: "/kaɪnd/", grade: 3, partOfSpeech: "adjective", exampleSentence: "My friend is very kind.", difficulty: "medium" },

  // Unit 3: Food and Drinks
  { english: "food", arabic: "طعام", unit: "Food and Drinks", pronunciation: "/fuːd/", grade: 3, partOfSpeech: "noun", exampleSentence: "I like healthy food.", difficulty: "easy" },
  { english: "breakfast", arabic: "فطار", unit: "Food and Drinks", pronunciation: "/ˈbrekfəst/", grade: 3, partOfSpeech: "noun", exampleSentence: "I eat breakfast at home.", difficulty: "medium" },
  { english: "lunch", arabic: "غداء", unit: "Food and Drinks", pronunciation: "/lʌntʃ/", grade: 3, partOfSpeech: "noun", exampleSentence: "We have lunch at school.", difficulty: "medium" },
  { english: "dinner", arabic: "عشاء", unit: "Food and Drinks", pronunciation: "/ˈdɪnə/", grade: 3, partOfSpeech: "noun", exampleSentence: "Dinner is at seven o'clock.", difficulty: "medium" },
  { english: "hungry", arabic: "جائع", unit: "Food and Drinks", pronunciation: "/ˈhʌŋɡri/", grade: 3, partOfSpeech: "adjective", exampleSentence: "I am hungry.", difficulty: "medium" },

  // Unit 4: My Day
  { english: "wake up", arabic: "يستيقظ", unit: "My Day", pronunciation: "/weɪk ʌp/", grade: 3, partOfSpeech: "verb", exampleSentence: "I wake up at seven.", difficulty: "medium" },
  { english: "brush", arabic: "ينظف بالفرشاة", unit: "My Day", pronunciation: "/brʌʃ/", grade: 3, partOfSpeech: "verb", exampleSentence: "I brush my teeth.", difficulty: "medium" },
  { english: "wash", arabic: "يغسل", unit: "My Day", pronunciation: "/wɒʃ/", grade: 3, partOfSpeech: "verb", exampleSentence: "I wash my hands.", difficulty: "easy" },
  { english: "sleep", arabic: "ينام", unit: "My Day", pronunciation: "/sliːp/", grade: 3, partOfSpeech: "verb", exampleSentence: "I sleep at night.", difficulty: "easy" },

  // Unit 5: Sports and Games
  { english: "sport", arabic: "رياضة", unit: "Sports and Games", pronunciation: "/spɔːt/", grade: 3, partOfSpeech: "noun", exampleSentence: "Football is my favorite sport.", difficulty: "medium" },
  { english: "football", arabic: "كرة القدم", unit: "Sports and Games", pronunciation: "/ˈfʊtbɔːl/", grade: 3, partOfSpeech: "noun", exampleSentence: "We play football at school.", difficulty: "medium" },
  { english: "basketball", arabic: "كرة السلة", unit: "Sports and Games", pronunciation: "/ˈbɑːskɪtbɔːl/", grade: 3, partOfSpeech: "noun", exampleSentence: "Basketball is fun to play.", difficulty: "hard" },
  { english: "swimming", arabic: "سباحة", unit: "Sports and Games", pronunciation: "/ˈswɪmɪŋ/", grade: 3, partOfSpeech: "noun", exampleSentence: "I love swimming in summer.", difficulty: "medium" },

  // Unit 6: Seasons and Weather
  { english: "season", arabic: "فصل", unit: "Seasons and Weather", pronunciation: "/ˈsiːzn/", grade: 3, partOfSpeech: "noun", exampleSentence: "Spring is my favorite season.", difficulty: "medium" },
  { english: "spring", arabic: "ربيع", unit: "Seasons and Weather", pronunciation: "/sprɪŋ/", grade: 3, partOfSpeech: "noun", exampleSentence: "Flowers bloom in spring.", difficulty: "medium" },
  { english: "summer", arabic: "صيف", unit: "Seasons and Weather", pronunciation: "/ˈsʌmə/", grade: 3, partOfSpeech: "noun", exampleSentence: "Summer is very hot.", difficulty: "easy" },
  { english: "autumn", arabic: "خريف", unit: "Seasons and Weather", pronunciation: "/ˈɔːtəm/", grade: 3, partOfSpeech: "noun", exampleSentence: "Leaves fall in autumn.", difficulty: "medium" },
  { english: "winter", arabic: "شتاء", unit: "Seasons and Weather", pronunciation: "/ˈwɪntə/", grade: 3, partOfSpeech: "noun", exampleSentence: "It snows in winter.", difficulty: "easy" },
  { english: "sunny", arabic: "مشمس", unit: "Seasons and Weather", pronunciation: "/ˈsʌni/", grade: 3, partOfSpeech: "adjective", exampleSentence: "Today is sunny.", difficulty: "easy" },
  { english: "rainy", arabic: "ممطر", unit: "Seasons and Weather", pronunciation: "/ˈreɪni/", grade: 3, partOfSpeech: "adjective", exampleSentence: "It's a rainy day.", difficulty: "medium" }
];

// Grade 3 Grammar Rules
export const grade3Grammar: GrammarRule[] = [
  {
    title: "المضارع المستمر (Present Continuous)",
    explanation: "نستخدم المضارع المستمر للتحدث عن أحداث تحدث الآن. التركيب: am/is/are + فعل مع ing",
    examples: [
      "I am reading a book. - أنا أقرأ كتاباً",
      "She is playing with her friends. - هي تلعب مع أصدقائها",
      "We are studying English. - نحن ندرس الإنجليزية",
      "They are eating lunch. - هم يتناولون الغداء",
      "He is swimming in the pool. - هو يسبح في المسبح",
      "The children are running in the park. - الأطفال يجرون في الحديقة"
    ],
    unit: "My School",
    grade: 3
  },
  {
    title: "أسئلة What time و When",
    explanation: "نستخدم What time للسؤال عن الوقت المحدد، و When للسؤال عن الوقت العام.",
    examples: [
      "What time do you wake up? - في أي وقت تستيقظ؟",
      "When do you go to school? - متى تذهب إلى المدرسة؟",
      "What time is it? - كم الساعة؟",
      "When is your birthday? - متى عيد ميلادك؟",
      "What time do you have lunch? - في أي وقت تتناول الغداء؟",
      "When do you play football? - متى تلعب كرة القدم؟"
    ],
    unit: "My Day",
    grade: 3
  },
  {
    title: "الصفات الوصفية (Descriptive Adjectives)",
    explanation: "الصفات تصف الأسماء وتأتي عادة قبل الاسم أو بعد فعل الكون.",
    examples: [
      "She is a kind friend. - هي صديقة لطيفة",
      "The weather is sunny today. - الطقس مشمس اليوم",
      "I have a big classroom. - لدي فصل دراسي كبير",
      "This is delicious food. - هذا طعام لذيذ",
      "He is a fast runner. - هو عداء سريع",
      "We live in a beautiful city. - نعيش في مدينة جميلة"
    ],
    unit: "My Friends",
    grade: 3
  }
];

// Grade 3 Quiz Questions
export const grade3Questions: QuizQuestion[] = [
  {
    question: "I _____ reading a book now.",
    options: ["am", "is", "are", "be"],
    correct: 0,
    explanation: "نستخدم 'am' مع I في المضارع المستمر",
    unit: "My School",
    grade: 3
  },
  {
    question: "She _____ playing with her friends.",
    options: ["am", "is", "are", "be"],
    correct: 1,
    explanation: "نستخدم 'is' مع She في المضارع المستمر",
    unit: "My Friends",
    grade: 3
  },
  {
    question: "_____ time do you wake up?",
    options: ["What", "When", "Where", "Who"],
    correct: 0,
    explanation: "نستخدم 'What time' للسؤال عن الوقت المحدد",
    unit: "My Day",
    grade: 3
  },
  {
    question: "The weather is _____ today.",
    options: ["sun", "sunny", "sunning", "suns"],
    correct: 1,
    explanation: "sunny هي الصفة الصحيحة لوصف الطقس المشمس",
    unit: "Seasons and Weather",
    grade: 3
  },
  {
    question: "We _____ football at school.",
    options: ["play", "plays", "playing", "played"],
    correct: 0,
    explanation: "نستخدم الفعل الأساسي 'play' مع We",
    unit: "Sports and Games",
    grade: 3
  }
];