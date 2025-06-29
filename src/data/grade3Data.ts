import { VocabularyWord, GrammarRule, QuizQuestion } from '../types';

// Grade 3 Vocabulary - Intermediate basic level
export const grade3Vocabulary: VocabularyWord[] = [
  // Unit 1: Friends and Friendship
  { english: "friend", arabic: "صديق", unit: "Friends and Friendship", pronunciation: "/frend/", grade: 3, partOfSpeech: "noun", exampleSentence: "Sarah is my best friend.", difficulty: "easy" },
  { english: "kind", arabic: "لطيف", unit: "Friends and Friendship", pronunciation: "/kaɪnd/", grade: 3, partOfSpeech: "adjective", exampleSentence: "She is very kind to everyone.", difficulty: "easy" },
  { english: "helpful", arabic: "مفيد", unit: "Friends and Friendship", pronunciation: "/ˈhelpfəl/", grade: 3, partOfSpeech: "adjective", exampleSentence: "My friend is always helpful.", difficulty: "easy" },
  { english: "share", arabic: "يشارك", unit: "Friends and Friendship", pronunciation: "/ʃeə/", grade: 3, partOfSpeech: "verb", exampleSentence: "I share my toys with friends.", difficulty: "easy" },
  { english: "care", arabic: "يهتم", unit: "Friends and Friendship", pronunciation: "/keə/", grade: 3, partOfSpeech: "verb", exampleSentence: "Good friends care about each other.", difficulty: "easy" },

  // Unit 2: Sports and Activities
  { english: "football", arabic: "كرة القدم", unit: "Sports and Activities", pronunciation: "/ˈfʊtbɔːl/", grade: 3, partOfSpeech: "noun", exampleSentence: "We play football in the park.", difficulty: "easy" },
  { english: "basketball", arabic: "كرة السلة", unit: "Sports and Activities", pronunciation: "/ˈbɑːskɪtbɔːl/", grade: 3, partOfSpeech: "noun", exampleSentence: "Basketball is fun to play.", difficulty: "easy" },
  { english: "swimming", arabic: "سباحة", unit: "Sports and Activities", pronunciation: "/ˈswɪmɪŋ/", grade: 3, partOfSpeech: "noun", exampleSentence: "Swimming is good exercise.", difficulty: "easy" },
  { english: "drawing", arabic: "رسم", unit: "Sports and Activities", pronunciation: "/ˈdrɔːɪŋ/", grade: 3, partOfSpeech: "noun", exampleSentence: "I love drawing pictures.", difficulty: "easy" },
  { english: "reading", arabic: "قراءة", unit: "Sports and Activities", pronunciation: "/ˈriːdɪŋ/", grade: 3, partOfSpeech: "noun", exampleSentence: "Reading books is my hobby.", difficulty: "easy" },

  // Unit 3: Food and Meals
  { english: "breakfast", arabic: "فطار", unit: "Food and Meals", pronunciation: "/ˈbrekfəst/", grade: 3, partOfSpeech: "noun", exampleSentence: "I eat breakfast every morning.", difficulty: "easy" },
  { english: "lunch", arabic: "غداء", unit: "Food and Meals", pronunciation: "/lʌntʃ/", grade: 3, partOfSpeech: "noun", exampleSentence: "We have lunch at school.", difficulty: "easy" },
  { english: "dinner", arabic: "عشاء", unit: "Food and Meals", pronunciation: "/ˈdɪnə/", grade: 3, partOfSpeech: "noun", exampleSentence: "My family eats dinner together.", difficulty: "easy" },
  { english: "vegetables", arabic: "خضروات", unit: "Food and Meals", pronunciation: "/ˈvedʒtəblz/", grade: 3, partOfSpeech: "noun", exampleSentence: "Vegetables are healthy food.", difficulty: "easy" },
  { english: "fruits", arabic: "فواكه", unit: "Food and Meals", pronunciation: "/fruːts/", grade: 3, partOfSpeech: "noun", exampleSentence: "I eat fruits every day.", difficulty: "easy" }
];

// Grade 3 Grammar Rules
export const grade3Grammar: GrammarRule[] = [
  {
    title: "المضارع المستمر (Present Continuous)",
    explanation: "نستخدم المضارع المستمر للتحدث عن أحداث تحدث الآن. التركيب: am/is/are + فعل + ing",
    examples: [
      "I am reading a book. - أنا أقرأ كتاباً",
      "She is playing football. - هي تلعب كرة القدم",
      "They are eating lunch. - هم يتناولون الغداء",
      "We are studying English. - نحن ندرس الإنجليزية",
      "He is drawing a picture. - هو يرسم صورة",
      "The children are swimming. - الأطفال يسبحون"
    ],
    unit: "Friends and Friendship",
    grade: 3
  },
  {
    title: "الماضي البسيط (Simple Past)",
    explanation: "نستخدم الماضي البسيط للتحدث عن أحداث حدثت في الماضي وانتهت.",
    examples: [
      "I played football yesterday. - لعبت كرة القدم أمس",
      "She visited her friend. - زارت صديقتها",
      "We watched a movie. - شاهدنا فيلماً",
      "He finished his homework. - أنهى واجبه",
      "They walked to school. - مشوا إلى المدرسة",
      "I helped my mother. - ساعدت أمي"
    ],
    unit: "Sports and Activities",
    grade: 3
  }
];

// Grade 3 Quiz Questions
export const grade3Questions: QuizQuestion[] = [
  {
    question: "I _____ reading a book right now.",
    options: ["am", "is", "are", "was"],
    correct: 0,
    explanation: "نستخدم 'am' مع I في المضارع المستمر",
    unit: "Friends and Friendship",
    grade: 3
  },
  {
    question: "She _____ football yesterday.",
    options: ["play", "plays", "played", "playing"],
    correct: 2,
    explanation: "نستخدم الماضي البسيط للأحداث التي حدثت أمس",
    unit: "Sports and Activities",
    grade: 3
  }
]; 