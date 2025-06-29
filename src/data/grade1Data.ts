import { VocabularyWord, GrammarRule, QuizQuestion } from '../types';

// Grade 1 Vocabulary - Very basic level words
export const grade1Vocabulary: VocabularyWord[] = [
  // Unit 1: Family
  { english: "family", arabic: "عائلة", unit: "Family", pronunciation: "/ˈfæməli/", grade: 1, partOfSpeech: "noun", exampleSentence: "I love my family.", difficulty: "easy" },
  { english: "mother", arabic: "أم", unit: "Family", pronunciation: "/ˈmʌðə/", grade: 1, partOfSpeech: "noun", exampleSentence: "My mother is kind.", difficulty: "easy" },
  { english: "father", arabic: "أب", unit: "Family", pronunciation: "/ˈfɑːðə/", grade: 1, partOfSpeech: "noun", exampleSentence: "My father works hard.", difficulty: "easy" },
  { english: "sister", arabic: "أخت", unit: "Family", pronunciation: "/ˈsɪstə/", grade: 1, partOfSpeech: "noun", exampleSentence: "My sister is funny.", difficulty: "easy" },
  { english: "brother", arabic: "أخ", unit: "Family", pronunciation: "/ˈbrʌðə/", grade: 1, partOfSpeech: "noun", exampleSentence: "My brother plays soccer.", difficulty: "easy" },
  { english: "baby", arabic: "طفل صغير", unit: "Family", pronunciation: "/ˈbeɪbi/", grade: 1, partOfSpeech: "noun", exampleSentence: "The baby is sleeping.", difficulty: "easy" },

  // Unit 2: Animals
  { english: "cat", arabic: "قطة", unit: "Animals", pronunciation: "/kæt/", grade: 1, partOfSpeech: "noun", exampleSentence: "The cat is cute.", difficulty: "easy" },
  { english: "dog", arabic: "كلب", unit: "Animals", pronunciation: "/dɒɡ/", grade: 1, partOfSpeech: "noun", exampleSentence: "My dog is friendly.", difficulty: "easy" },
  { english: "bird", arabic: "طائر", unit: "Animals", pronunciation: "/bɜːd/", grade: 1, partOfSpeech: "noun", exampleSentence: "The bird can fly.", difficulty: "easy" },
  { english: "fish", arabic: "سمكة", unit: "Animals", pronunciation: "/fɪʃ/", grade: 1, partOfSpeech: "noun", exampleSentence: "Fish live in water.", difficulty: "easy" },
  { english: "rabbit", arabic: "أرنب", unit: "Animals", pronunciation: "/ˈræbɪt/", grade: 1, partOfSpeech: "noun", exampleSentence: "The rabbit is white.", difficulty: "easy" },
  { english: "horse", arabic: "حصان", unit: "Animals", pronunciation: "/hɔːs/", grade: 1, partOfSpeech: "noun", exampleSentence: "The horse runs fast.", difficulty: "easy" },

  // Unit 3: Colors
  { english: "red", arabic: "أحمر", unit: "Colors", pronunciation: "/red/", grade: 1, partOfSpeech: "adjective", exampleSentence: "The apple is red.", difficulty: "easy" },
  { english: "blue", arabic: "أزرق", unit: "Colors", pronunciation: "/bluː/", grade: 1, partOfSpeech: "adjective", exampleSentence: "The sky is blue.", difficulty: "easy" },
  { english: "green", arabic: "أخضر", unit: "Colors", pronunciation: "/ɡriːn/", grade: 1, partOfSpeech: "adjective", exampleSentence: "Grass is green.", difficulty: "easy" },
  { english: "yellow", arabic: "أصفر", unit: "Colors", pronunciation: "/ˈjeləʊ/", grade: 1, partOfSpeech: "adjective", exampleSentence: "The sun is yellow.", difficulty: "easy" },
  { english: "black", arabic: "أسود", unit: "Colors", pronunciation: "/blæk/", grade: 1, partOfSpeech: "adjective", exampleSentence: "My hair is black.", difficulty: "easy" },
  { english: "white", arabic: "أبيض", unit: "Colors", pronunciation: "/waɪt/", grade: 1, partOfSpeech: "adjective", exampleSentence: "Snow is white.", difficulty: "easy" },

  // Unit 4: Numbers
  { english: "one", arabic: "واحد", unit: "Numbers", pronunciation: "/wʌn/", grade: 1, partOfSpeech: "noun", exampleSentence: "I have one book.", difficulty: "easy" },
  { english: "two", arabic: "اثنان", unit: "Numbers", pronunciation: "/tuː/", grade: 1, partOfSpeech: "noun", exampleSentence: "I see two cats.", difficulty: "easy" },
  { english: "three", arabic: "ثلاثة", unit: "Numbers", pronunciation: "/θriː/", grade: 1, partOfSpeech: "noun", exampleSentence: "There are three birds.", difficulty: "easy" },
  { english: "four", arabic: "أربعة", unit: "Numbers", pronunciation: "/fɔː/", grade: 1, partOfSpeech: "noun", exampleSentence: "I have four pencils.", difficulty: "easy" },
  { english: "five", arabic: "خمسة", unit: "Numbers", pronunciation: "/faɪv/", grade: 1, partOfSpeech: "noun", exampleSentence: "Give me five apples.", difficulty: "easy" },

  // Unit 5: Body Parts
  { english: "head", arabic: "رأس", unit: "Body Parts", pronunciation: "/hed/", grade: 1, partOfSpeech: "noun", exampleSentence: "I touch my head.", difficulty: "easy" },
  { english: "eye", arabic: "عين", unit: "Body Parts", pronunciation: "/aɪ/", grade: 1, partOfSpeech: "noun", exampleSentence: "I see with my eyes.", difficulty: "easy" },
  { english: "nose", arabic: "أنف", unit: "Body Parts", pronunciation: "/nəʊz/", grade: 1, partOfSpeech: "noun", exampleSentence: "I smell with my nose.", difficulty: "easy" },
  { english: "mouth", arabic: "فم", unit: "Body Parts", pronunciation: "/maʊθ/", grade: 1, partOfSpeech: "noun", exampleSentence: "I eat with my mouth.", difficulty: "easy" },
  { english: "hand", arabic: "يد", unit: "Body Parts", pronunciation: "/hænd/", grade: 1, partOfSpeech: "noun", exampleSentence: "I wave my hand.", difficulty: "easy" },
  { english: "foot", arabic: "قدم", unit: "Body Parts", pronunciation: "/fʊt/", grade: 1, partOfSpeech: "noun", exampleSentence: "I walk with my feet.", difficulty: "easy" },

  // Unit 6: Food
  { english: "apple", arabic: "تفاحة", unit: "Food", pronunciation: "/ˈæpl/", grade: 1, partOfSpeech: "noun", exampleSentence: "The apple is sweet.", difficulty: "easy" },
  { english: "banana", arabic: "موزة", unit: "Food", pronunciation: "/bəˈnɑːnə/", grade: 1, partOfSpeech: "noun", exampleSentence: "I like bananas.", difficulty: "easy" },
  { english: "bread", arabic: "خبز", unit: "Food", pronunciation: "/bred/", grade: 1, partOfSpeech: "noun", exampleSentence: "I eat bread for breakfast.", difficulty: "easy" },
  { english: "milk", arabic: "حليب", unit: "Food", pronunciation: "/mɪlk/", grade: 1, partOfSpeech: "noun", exampleSentence: "Milk is white.", difficulty: "easy" },
  { english: "water", arabic: "ماء", unit: "Food", pronunciation: "/ˈwɔːtə/", grade: 1, partOfSpeech: "noun", exampleSentence: "I drink water.", difficulty: "easy" },

  // Unit 7: School
  { english: "book", arabic: "كتاب", unit: "School", pronunciation: "/bʊk/", grade: 1, partOfSpeech: "noun", exampleSentence: "I read a book.", difficulty: "easy" },
  { english: "pen", arabic: "قلم", unit: "School", pronunciation: "/pen/", grade: 1, partOfSpeech: "noun", exampleSentence: "I write with a pen.", difficulty: "easy" },
  { english: "desk", arabic: "مكتب", unit: "School", pronunciation: "/desk/", grade: 1, partOfSpeech: "noun", exampleSentence: "My desk is clean.", difficulty: "easy" },
  { english: "chair", arabic: "كرسي", unit: "School", pronunciation: "/tʃeə/", grade: 1, partOfSpeech: "noun", exampleSentence: "I sit on a chair.", difficulty: "easy" },
  { english: "school", arabic: "مدرسة", unit: "School", pronunciation: "/skuːl/", grade: 1, partOfSpeech: "noun", exampleSentence: "I go to school.", difficulty: "easy" }
];

// Grade 1 Grammar Rules - Very basic structures
export const grade1Grammar: GrammarRule[] = [
  {
    title: "أدوات التعريف والتنكير (A, An, The)",
    explanation: "نستخدم 'a' قبل الكلمات التي تبدأ بحرف ساكن، و 'an' قبل الكلمات التي تبدأ بحرف متحرك، و 'the' للإشارة إلى شيء محدد.",
    examples: [
      "a cat - قطة",
      "an apple - تفاحة", 
      "the book - الكتاب",
      "a dog - كلب",
      "an orange - برتقالة",
      "the sun - الشمس"
    ],
    unit: "Family",
    grade: 1
  },
  {
    title: "الضمائر البسيطة (I, You, He, She, It)",
    explanation: "الضمائر تحل محل الأسماء. نستخدم I للمتكلم، You للمخاطب، He للذكر، She للأنثى، It للأشياء.",
    examples: [
      "I am happy. - أنا سعيد",
      "You are my friend. - أنت صديقي", 
      "He is tall. - هو طويل",
      "She is kind. - هي لطيفة",
      "It is red. - إنه أحمر",
      "I love you. - أحبك"
    ],
    unit: "Animals",
    grade: 1
  },
  {
    title: "فعل الكون (am, is, are)",
    explanation: "نستخدم 'am' مع I، و 'is' مع He/She/It، و 'are' مع You/We/They.",
    examples: [
      "I am seven years old. - عمري سبع سنوات",
      "She is my sister. - هي أختي",
      "You are nice. - أنت لطيف",
      "The cat is black. - القطة سوداء",
      "We are friends. - نحن أصدقاء",
      "They are happy. - هم سعداء"
    ],
    unit: "Colors",
    grade: 1
  },
  {
    title: "الجمع البسيط (Adding -s)",
    explanation: "لجعل الكلمة جمع، نضيف عادة حرف 's' في النهاية.",
    examples: [
      "cat → cats - قطة → قطط",
      "dog → dogs - كلب → كلاب",
      "book → books - كتاب → كتب", 
      "apple → apples - تفاحة → تفاح",
      "bird → birds - طائر → طيور",
      "hand → hands - يد → أيدي"
    ],
    unit: "Numbers",
    grade: 1
  },
  {
    title: "أفعال بسيطة (Simple Verbs)",
    explanation: "الأفعال تخبرنا عما يفعله الشخص أو الشيء.",
    examples: [
      "I eat. - أنا آكل",
      "She runs. - هي تجري",
      "He sleeps. - هو ينام",
      "We play. - نحن نلعب",
      "They sing. - هم يغنون",
      "The bird flies. - الطائر يطير"
    ],
    unit: "Body Parts",
    grade: 1
  },
  {
    title: "الأسئلة البسيطة (Simple Questions)",
    explanation: "لتكوين سؤال، نضع فعل الكون في البداية أو نستخدم كلمات الاستفهام.",
    examples: [
      "Are you happy? - هل أنت سعيد؟",
      "Is she your sister? - هل هي أختك؟",
      "What is this? - ما هذا؟",
      "Where is the cat? - أين القطة؟",
      "How are you? - كيف حالك؟",
      "Who is that? - من ذلك؟"
    ],
    unit: "Food",
    grade: 1
  }
];

// Grade 1 Quiz Questions - Very easy level
export const grade1Questions: QuizQuestion[] = [
  {
    question: "I _____ a student.",
    options: ["am", "is", "are", "be"],
    correct: 0,
    explanation: "نستخدم 'am' مع الضمير I",
    unit: "Family",
    grade: 1
  },
  {
    question: "The cat _____ black.",
    options: ["am", "is", "are", "be"],
    correct: 1,
    explanation: "نستخدم 'is' مع المفرد الغائب",
    unit: "Animals",
    grade: 1
  },
  {
    question: "Choose the correct article: _____ apple",
    options: ["a", "an", "the", "no article"],
    correct: 1,
    explanation: "نستخدم 'an' قبل الكلمات التي تبدأ بحرف متحرك",
    unit: "Colors",
    grade: 1
  },
  {
    question: "What is the plural of 'book'?",
    options: ["book", "books", "bookes", "bookies"],
    correct: 1,
    explanation: "نضيف 's' للحصول على الجمع",
    unit: "Numbers",
    grade: 1
  },
  {
    question: "You _____ my friend.",
    options: ["am", "is", "are", "be"],
    correct: 2,
    explanation: "نستخدم 'are' مع الضمير You",
    unit: "Body Parts",
    grade: 1
  },
  {
    question: "Choose the correct article: _____ dog",
    options: ["a", "an", "the", "any"],
    correct: 0,
    explanation: "نستخدم 'a' قبل الكلمات التي تبدأ بحرف ساكن",
    unit: "Food",
    grade: 1
  },
  {
    question: "What is the plural of 'cat'?",
    options: ["cat", "cats", "cates", "kitties"],
    correct: 1,
    explanation: "نضيف 's' في النهاية للجمع",
    unit: "School",
    grade: 1
  },
  {
    question: "She _____ my sister.",
    options: ["am", "is", "are", "be"],
    correct: 1,
    explanation: "نستخدم 'is' مع الضمير She",
    unit: "Family",
    grade: 1
  },
  {
    question: "Choose the correct sentence:",
    options: ["I are happy", "I am happy", "I is happy", "I be happy"],
    correct: 1,
    explanation: "الجملة الصحيحة هي 'I am happy'",
    unit: "Animals",
    grade: 1
  },
  {
    question: "The birds _____ in the sky.",
    options: ["am", "is", "are", "be"],
    correct: 2,
    explanation: "نستخدم 'are' مع الجمع",
    unit: "Colors",
    grade: 1
  }
]; 