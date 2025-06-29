import { VocabularyWord, GrammarRule, QuizQuestion } from '../types';

// Grade 2 Vocabulary - Basic level words
export const grade2Vocabulary: VocabularyWord[] = [
  // Unit 1: Home
  { english: "house", arabic: "منزل", unit: "Home", pronunciation: "/haʊs/", grade: 2, partOfSpeech: "noun", exampleSentence: "I live in a big house.", difficulty: "easy" },
  { english: "room", arabic: "غرفة", unit: "Home", pronunciation: "/ruːm/", grade: 2, partOfSpeech: "noun", exampleSentence: "My room is clean.", difficulty: "easy" },
  { english: "kitchen", arabic: "مطبخ", unit: "Home", pronunciation: "/ˈkɪtʃɪn/", grade: 2, partOfSpeech: "noun", exampleSentence: "Mom cooks in the kitchen.", difficulty: "easy" },
  { english: "bedroom", arabic: "غرفة نوم", unit: "Home", pronunciation: "/ˈbedruːm/", grade: 2, partOfSpeech: "noun", exampleSentence: "I sleep in my bedroom.", difficulty: "easy" },
  { english: "bathroom", arabic: "حمام", unit: "Home", pronunciation: "/ˈbɑːθruːm/", grade: 2, partOfSpeech: "noun", exampleSentence: "I wash my hands in the bathroom.", difficulty: "easy" },
  { english: "door", arabic: "باب", unit: "Home", pronunciation: "/dɔː/", grade: 2, partOfSpeech: "noun", exampleSentence: "Please close the door.", difficulty: "easy" },
  { english: "window", arabic: "نافذة", unit: "Home", pronunciation: "/ˈwɪndəʊ/", grade: 2, partOfSpeech: "noun", exampleSentence: "I look out the window.", difficulty: "easy" },

  // Unit 2: Toys and Games
  { english: "toy", arabic: "لعبة", unit: "Toys and Games", pronunciation: "/tɔɪ/", grade: 2, partOfSpeech: "noun", exampleSentence: "This is my favorite toy.", difficulty: "easy" },
  { english: "ball", arabic: "كرة", unit: "Toys and Games", pronunciation: "/bɔːl/", grade: 2, partOfSpeech: "noun", exampleSentence: "Let's play with the ball.", difficulty: "easy" },
  { english: "doll", arabic: "دمية", unit: "Toys and Games", pronunciation: "/dɒl/", grade: 2, partOfSpeech: "noun", exampleSentence: "The doll has beautiful hair.", difficulty: "easy" },
  { english: "puzzle", arabic: "أحجية", unit: "Toys and Games", pronunciation: "/ˈpʌzl/", grade: 2, partOfSpeech: "noun", exampleSentence: "I can solve this puzzle.", difficulty: "easy" },
  { english: "game", arabic: "لعبة", unit: "Toys and Games", pronunciation: "/ɡeɪm/", grade: 2, partOfSpeech: "noun", exampleSentence: "We play a fun game.", difficulty: "easy" },
  { english: "bicycle", arabic: "دراجة", unit: "Toys and Games", pronunciation: "/ˈbaɪsɪkl/", grade: 2, partOfSpeech: "noun", exampleSentence: "I ride my bicycle to school.", difficulty: "easy" },

  // Unit 3: Weather
  { english: "sun", arabic: "شمس", unit: "Weather", pronunciation: "/sʌn/", grade: 2, partOfSpeech: "noun", exampleSentence: "The sun is bright today.", difficulty: "easy" },
  { english: "rain", arabic: "مطر", unit: "Weather", pronunciation: "/reɪn/", grade: 2, partOfSpeech: "noun", exampleSentence: "I like the sound of rain.", difficulty: "easy" },
  { english: "snow", arabic: "ثلج", unit: "Weather", pronunciation: "/snəʊ/", grade: 2, partOfSpeech: "noun", exampleSentence: "Snow is white and cold.", difficulty: "easy" },
  { english: "wind", arabic: "ريح", unit: "Weather", pronunciation: "/wɪnd/", grade: 2, partOfSpeech: "noun", exampleSentence: "The wind blows the leaves.", difficulty: "easy" },
  { english: "hot", arabic: "حار", unit: "Weather", pronunciation: "/hɒt/", grade: 2, partOfSpeech: "adjective", exampleSentence: "Today is very hot.", difficulty: "easy" },
  { english: "cold", arabic: "بارد", unit: "Weather", pronunciation: "/kəʊld/", grade: 2, partOfSpeech: "adjective", exampleSentence: "Winter is cold.", difficulty: "easy" },

  // Unit 4: Clothes
  { english: "shirt", arabic: "قميص", unit: "Clothes", pronunciation: "/ʃɜːt/", grade: 2, partOfSpeech: "noun", exampleSentence: "I wear a blue shirt.", difficulty: "easy" },
  { english: "pants", arabic: "بنطلون", unit: "Clothes", pronunciation: "/pænts/", grade: 2, partOfSpeech: "noun", exampleSentence: "My pants are black.", difficulty: "easy" },
  { english: "dress", arabic: "فستان", unit: "Clothes", pronunciation: "/dres/", grade: 2, partOfSpeech: "noun", exampleSentence: "She wears a pretty dress.", difficulty: "easy" },
  { english: "shoes", arabic: "حذاء", unit: "Clothes", pronunciation: "/ʃuːz/", grade: 2, partOfSpeech: "noun", exampleSentence: "I need new shoes.", difficulty: "easy" },
  { english: "hat", arabic: "قبعة", unit: "Clothes", pronunciation: "/hæt/", grade: 2, partOfSpeech: "noun", exampleSentence: "The hat protects from sun.", difficulty: "easy" },
  { english: "jacket", arabic: "سترة", unit: "Clothes", pronunciation: "/ˈdʒækɪt/", grade: 2, partOfSpeech: "noun", exampleSentence: "I wear a jacket when it's cold.", difficulty: "easy" },

  // Unit 5: Actions
  { english: "run", arabic: "يجري", unit: "Actions", pronunciation: "/rʌn/", grade: 2, partOfSpeech: "verb", exampleSentence: "I can run fast.", difficulty: "easy" },
  { english: "walk", arabic: "يمشي", unit: "Actions", pronunciation: "/wɔːk/", grade: 2, partOfSpeech: "verb", exampleSentence: "Let's walk to the park.", difficulty: "easy" },
  { english: "jump", arabic: "يقفز", unit: "Actions", pronunciation: "/dʒʌmp/", grade: 2, partOfSpeech: "verb", exampleSentence: "The frog can jump high.", difficulty: "easy" },
  { english: "sing", arabic: "يغني", unit: "Actions", pronunciation: "/sɪŋ/", grade: 2, partOfSpeech: "verb", exampleSentence: "She likes to sing songs.", difficulty: "easy" },
  { english: "dance", arabic: "يرقص", unit: "Actions", pronunciation: "/dɑːns/", grade: 2, partOfSpeech: "verb", exampleSentence: "We dance at the party.", difficulty: "easy" },
  { english: "swim", arabic: "يسبح", unit: "Actions", pronunciation: "/swɪm/", grade: 2, partOfSpeech: "verb", exampleSentence: "Fish swim in the water.", difficulty: "easy" },

  // Unit 6: Transportation
  { english: "car", arabic: "سيارة", unit: "Transportation", pronunciation: "/kɑː/", grade: 2, partOfSpeech: "noun", exampleSentence: "Dad drives the car.", difficulty: "easy" },
  { english: "bus", arabic: "حافلة", unit: "Transportation", pronunciation: "/bʌs/", grade: 2, partOfSpeech: "noun", exampleSentence: "I take the bus to school.", difficulty: "easy" },
  { english: "train", arabic: "قطار", unit: "Transportation", pronunciation: "/treɪn/", grade: 2, partOfSpeech: "noun", exampleSentence: "The train is very long.", difficulty: "easy" },
  { english: "plane", arabic: "طائرة", unit: "Transportation", pronunciation: "/pleɪn/", grade: 2, partOfSpeech: "noun", exampleSentence: "The plane flies in the sky.", difficulty: "easy" },
  { english: "boat", arabic: "قارب", unit: "Transportation", pronunciation: "/bəʊt/", grade: 2, partOfSpeech: "noun", exampleSentence: "We sail in a boat.", difficulty: "easy" },

  // Unit 7: Time
  { english: "morning", arabic: "صباح", unit: "Time", pronunciation: "/ˈmɔːnɪŋ/", grade: 2, partOfSpeech: "noun", exampleSentence: "I wake up in the morning.", difficulty: "easy" },
  { english: "afternoon", arabic: "بعد الظهر", unit: "Time", pronunciation: "/ˌɑːftəˈnuːn/", grade: 2, partOfSpeech: "noun", exampleSentence: "We play in the afternoon.", difficulty: "easy" },
  { english: "night", arabic: "ليل", unit: "Time", pronunciation: "/naɪt/", grade: 2, partOfSpeech: "noun", exampleSentence: "Stars shine at night.", difficulty: "easy" },
  { english: "today", arabic: "اليوم", unit: "Time", pronunciation: "/təˈdeɪ/", grade: 2, partOfSpeech: "noun", exampleSentence: "Today is Monday.", difficulty: "easy" },
  { english: "tomorrow", arabic: "غداً", unit: "Time", pronunciation: "/təˈmɒrəʊ/", grade: 2, partOfSpeech: "noun", exampleSentence: "Tomorrow is Tuesday.", difficulty: "easy" },
  { english: "yesterday", arabic: "أمس", unit: "Time", pronunciation: "/ˈjestədeɪ/", grade: 2, partOfSpeech: "noun", exampleSentence: "Yesterday was sunny.", difficulty: "easy" }
];

// Grade 2 Grammar Rules - Basic structures
export const grade2Grammar: GrammarRule[] = [
  {
    title: "المضارع البسيط (Simple Present)",
    explanation: "نستخدم المضارع البسيط للتحدث عن العادات والحقائق. نضيف 's' مع He/She/It.",
    examples: [
      "I play every day. - ألعب كل يوم",
      "She plays with dolls. - تلعب بالدمى",
      "We eat breakfast. - نتناول الفطار",
      "He runs fast. - يجري بسرعة",
      "They sing songs. - يغنون الأغاني",
      "The bird flies. - الطائر يطير"
    ],
    unit: "Home",
    grade: 2
  },
  {
    title: "حروف الجر البسيطة (in, on, under)",
    explanation: "حروف الجر تخبرنا عن موقع الأشياء. in = في، on = على، under = تحت.",
    examples: [
      "The book is in the bag. - الكتاب في الحقيبة",
      "The cat is on the table. - القطة على الطاولة",
      "The ball is under the chair. - الكرة تحت الكرسي",
      "I live in a house. - أسكن في منزل",
      "The hat is on my head. - القبعة على رأسي",
      "The dog is under the tree. - الكلب تحت الشجرة"
    ],
    unit: "Toys and Games",
    grade: 2
  },
  {
    title: "أسئلة What و Where",
    explanation: "نستخدم What لسؤال عن الشيء، و Where لسؤال عن المكان.",
    examples: [
      "What is this? - ما هذا؟",
      "Where is the book? - أين الكتاب؟",
      "What color is it? - ما لونه؟",
      "Where do you live? - أين تسكن؟",
      "What is your name? - ما اسمك؟",
      "Where is the bathroom? - أين الحمام؟"
    ],
    unit: "Weather",
    grade: 2
  },
  {
    title: "الصفات البسيطة (Simple Adjectives)",
    explanation: "الصفات تصف الأسماء. نضعها عادة قبل الاسم في الإنجليزية.",
    examples: [
      "a big house - منزل كبير",
      "a small car - سيارة صغيرة",
      "a red apple - تفاحة حمراء",
      "a happy child - طفل سعيد",
      "a cold day - يوم بارد",
      "a beautiful dress - فستان جميل"
    ],
    unit: "Clothes",
    grade: 2
  },
  {
    title: "فعل Like مع ing",
    explanation: "عندما نقول ما نحبه من الأنشطة، نستخدم like + فعل مع ing.",
    examples: [
      "I like swimming. - أحب السباحة",
      "She likes dancing. - تحب الرقص",
      "We like playing. - نحب اللعب",
      "He likes running. - يحب الجري",
      "They like singing. - يحبون الغناء",
      "I like reading books. - أحب قراءة الكتب"
    ],
    unit: "Actions",
    grade: 2
  },
  {
    title: "فعل Can للقدرة",
    explanation: "نستخدم can للتعبير عن القدرة على فعل شيء.",
    examples: [
      "I can swim. - أستطيع السباحة",
      "She can sing. - تستطيع الغناء",
      "We can play. - نستطيع اللعب",
      "Can you run? - هل تستطيع الجري؟",
      "Birds can fly. - الطيور تستطيع الطيران",
      "Fish can swim. - الأسماك تستطيع السباحة"
    ],
    unit: "Transportation",
    grade: 2
  }
];

// Grade 2 Quiz Questions - Basic level
export const grade2Questions: QuizQuestion[] = [
  {
    question: "She _____ with her toys every day.",
    options: ["play", "plays", "playing", "played"],
    correct: 1,
    explanation: "نضيف 's' مع She في المضارع البسيط",
    unit: "Home",
    grade: 2
  },
  {
    question: "The book is _____ the table.",
    options: ["in", "on", "under", "at"],
    correct: 1,
    explanation: "نستخدم 'on' عندما يكون الشيء على سطح شيء آخر",
    unit: "Toys and Games",
    grade: 2
  },
  {
    question: "_____ is your favorite color?",
    options: ["What", "Where", "When", "Who"],
    correct: 0,
    explanation: "نستخدم 'What' للسؤال عن الأشياء",
    unit: "Weather",
    grade: 2
  },
  {
    question: "I have a _____ car.",
    options: ["red beautiful", "beautiful red", "beautifully red", "red beauty"],
    correct: 1,
    explanation: "الصفة تأتي قبل الاسم",
    unit: "Clothes",
    grade: 2
  },
  {
    question: "I like _____ games.",
    options: ["play", "plays", "playing", "played"],
    correct: 2,
    explanation: "نستخدم الفعل مع ing بعد like",
    unit: "Actions",
    grade: 2
  },
  {
    question: "Birds _____ fly.",
    options: ["can", "can't", "cannot", "could"],
    correct: 0,
    explanation: "الطيور تستطيع الطيران",
    unit: "Transportation",
    grade: 2
  },
  {
    question: "The cat is _____ the chair.",
    options: ["in", "on", "under", "into"],
    correct: 2,
    explanation: "تحت الكرسي",
    unit: "Time",
    grade: 2
  },
  {
    question: "We _____ to school every morning.",
    options: ["go", "goes", "going", "went"],
    correct: 0,
    explanation: "نستخدم الفعل الأساسي مع We",
    unit: "Home",
    grade: 2
  },
  {
    question: "_____ do you live?",
    options: ["What", "Where", "When", "Why"],
    correct: 1,
    explanation: "نستخدم 'Where' للسؤال عن المكان",
    unit: "Toys and Games",
    grade: 2
  },
  {
    question: "I _____ ride a bicycle.",
    options: ["can", "am", "is", "are"],
    correct: 0,
    explanation: "نستخدم 'can' للتعبير عن القدرة",
    unit: "Weather",
    grade: 2
  }
]; 