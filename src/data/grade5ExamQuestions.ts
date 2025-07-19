import { QuizQuestion, VocabularyWord } from '../types';

// أسئلة الاستماع 1 - المواهب
export const listeningTalentsQuestions = [
  {
    id: 'listening-talents-1',
    type: 'picture-matching',
    instruction: 'You are going to hear five short dialogues about Talents. Match the pictures with the dialogues.',
    dialogues: [
      {
        id: 1,
        audio: '/audio/grade5/talents/dialogue1.mp3',
        transcript: 'A: What can you do? B: I can play the piano very well. I practice every day.',
        correctPicture: 'A' // صورة البيانو
      },
      {
        id: 2,
        audio: '/audio/grade5/talents/dialogue2.mp3',
        transcript: 'A: That\'s amazing! How did you learn to dance like that? B: I take dance classes twice a week.',
        correctPicture: 'B' // صورة الرقص
      },
      {
        id: 3,
        audio: '/audio/grade5/talents/dialogue3.mp3',
        transcript: 'A: Your painting is beautiful! B: Thank you. I love to paint landscapes and flowers.',
        correctPicture: 'C' // صورة الرسم
      },
      {
        id: 4,
        audio: '/audio/grade5/talents/dialogue4.mp3',
        transcript: 'A: Can you teach me how to sing like you? B: Sure! I learned from my music teacher.',
        correctPicture: 'D' // صورة الغناء
      },
      {
        id: 5,
        audio: '/audio/grade5/talents/dialogue5.mp3',
        transcript: 'A: How long have you been playing football? B: I started when I was six years old.',
        correctPicture: 'E' // صورة كرة القدم
      }
    ],
    pictures: ['Piano', 'Dancing', 'Painting', 'Singing', 'Football', 'Reading'],
    marks: 5
  }
];

// أسئلة الاستماع 2 - متحف الفضاء
export const listeningSpaceQuestions = [
  {
    id: 'space-distance-earth-moon',
    question: 'What is the distance from Earth to the Moon?',
    options: ['384,400 km', '149 million km', '778 million km'],
    correct: 0,
    explanation: 'The Moon is approximately 384,400 kilometers away from Earth.',
    audio: '/audio/grade5/space/earth-moon-distance.mp3',
    transcript: 'Ali: How far is the Moon from Earth? Reem: The Moon is about 384,400 kilometers away from our planet.'
  },
  {
    id: 'space-travel-time-mars',
    question: 'How long does it take to travel to Mars?',
    options: ['6-9 months', '2-3 weeks', '1-2 years'],
    correct: 0,
    explanation: 'It takes about 6-9 months to travel to Mars depending on the spacecraft and trajectory.',
    audio: '/audio/grade5/space/mars-travel-time.mp3',
    transcript: 'Reem: If we wanted to go to Mars, how long would it take? Ali: Scientists say it would take about 6 to 9 months to reach Mars.'
  },
  {
    id: 'space-largest-planet',
    question: 'Which is the largest planet in our solar system?',
    options: ['Saturn', 'Jupiter', 'Neptune'],
    correct: 1,
    explanation: 'Jupiter is the largest planet in our solar system.',
    audio: '/audio/grade5/space/largest-planet.mp3',
    transcript: 'Ali: Which planet is the biggest in our solar system? Reem: That\'s Jupiter! It\'s much larger than all the other planets.'
  },
  {
    id: 'space-asteroid-belt',
    question: 'Where is the asteroid belt located?',
    options: ['Between Earth and Mars', 'Between Mars and Jupiter', 'Between Jupiter and Saturn'],
    correct: 1,
    explanation: 'The asteroid belt is located between Mars and Jupiter.',
    audio: '/audio/grade5/space/asteroid-belt.mp3',
    transcript: 'Reem: I learned that there\'s a belt of rocks in space. Ali: Yes, the asteroid belt is between Mars and Jupiter.'
  },
  {
    id: 'space-famous-telescope',
    question: 'What is the name of the famous space telescope?',
    options: ['Hubble Telescope', 'Galileo Telescope', 'Newton Telescope'],
    correct: 0,
    explanation: 'The Hubble Space Telescope is one of the most famous space telescopes.',
    audio: '/audio/grade5/space/hubble-telescope.mp3',
    transcript: 'Ali: What\'s that famous telescope in space called? Reem: It\'s the Hubble Space Telescope. It takes amazing pictures of space!'
  }
];

// أسئلة المفردات - مطابقة الصور مع الكلمات
export const vocabularyPictureMatching = [
  {
    id: 'vocab-picture-1',
    picture: 'bakery.jpg',
    description: 'A place where bread, cakes, and pastries are made and sold',
    options: ['bakery', 'butcher', 'greengrocer', 'fishmonger', 'pharmacy', 'kiosk'],
    correct: 0,
    explanation: 'A bakery is where bread and cakes are sold.'
  },
  {
    id: 'vocab-picture-2',
    picture: 'escalator.jpg',
    description: 'Moving stairs that take people up and down in buildings',
    options: ['elevator', 'escalator', 'stairs', 'ladder', 'bridge', 'tunnel'],
    correct: 1,
    explanation: 'An escalator is a moving staircase.'
  },
  {
    id: 'vocab-picture-3',
    picture: 'purse.jpg',
    description: 'A small bag used to carry money and cards',
    options: ['wallet', 'purse', 'backpack', 'suitcase', 'briefcase', 'handbag'],
    correct: 1,
    explanation: 'A purse is a small bag for carrying money and personal items.'
  },
  {
    id: 'vocab-picture-4',
    picture: 'optician.jpg',
    description: 'A shop where glasses and contact lenses are sold',
    options: ['pharmacy', 'optician', 'dentist', 'hospital', 'clinic', 'library'],
    correct: 1,
    explanation: 'An optician sells glasses and eye care products.'
  },
  {
    id: 'vocab-picture-5',
    picture: 'newsstand.jpg',
    description: 'A small shop that sells newspapers, magazines, and snacks',
    options: ['bookstore', 'library', 'kiosk', 'cafe', 'restaurant', 'market'],
    correct: 2,
    explanation: 'A kiosk (newsstand) sells newspapers, magazines, and small items.'
  }
];

// أسئلة القواعد
export const grammarQuestions = [
  {
    id: 'grammar-relative-clause-1',
    question: 'The book _______ I bought yesterday is very interesting.',
    options: ['who', 'which', 'where', 'when'],
    correct: 1,
    explanation: 'We use "which" for things and objects.',
    unit: 'Grammar - Relative Clauses',
    grade: 5
  },
  {
    id: 'grammar-relative-clause-2',
    question: 'The teacher _______ teaches us English is very kind.',
    options: ['who', 'which', 'where', 'when'],
    correct: 0,
    explanation: 'We use "who" for people.',
    unit: 'Grammar - Relative Clauses',
    grade: 5
  },
  {
    id: 'grammar-comparative-1',
    question: 'This car is _______ than that one.',
    options: ['fast', 'faster', 'fastest', 'more fast'],
    correct: 1,
    explanation: 'We add -er to short adjectives to make comparatives.',
    unit: 'Grammar - Comparatives',
    grade: 5
  },
  {
    id: 'grammar-future-1',
    question: 'Tomorrow, we _______ visit the museum.',
    options: ['are', 'will', 'was', 'were'],
    correct: 1,
    explanation: 'We use "will" to talk about future plans.',
    unit: 'Grammar - Future Tense',
    grade: 5
  },
  {
    id: 'grammar-modal-1',
    question: 'She _______ swim when she was five years old.',
    options: ['can', 'could', 'will', 'would'],
    correct: 1,
    explanation: 'We use "could" to talk about past ability.',
    unit: 'Grammar - Modals',
    grade: 5
  }
];

// أسئلة القراءة 1 - مطابقة النصوص مع الصور
export const readingTextPictureMatching = [
  {
    id: 'reading-text-1',
    text: 'I use it to call my friends and family. It fits in my pocket and I can send messages with it.',
    options: ['Computer', 'Television', 'Mobile phone', 'Radio', 'Camera'],
    correct: 2,
    explanation: 'A mobile phone is used for calling and messaging.'
  },
  {
    id: 'reading-text-2',
    text: 'It has many books and magazines. People go there to read quietly and borrow books.',
    options: ['Bookstore', 'Library', 'School', 'Museum', 'Cinema'],
    correct: 1,
    explanation: 'A library is where people borrow books and read quietly.'
  },
  {
    id: 'reading-text-3',
    text: 'People wear it on their wrist to know what time it is. It has numbers and hands that move.',
    options: ['Bracelet', 'Ring', 'Watch', 'Necklace', 'Earring'],
    correct: 2,
    explanation: 'A watch is worn on the wrist to tell time.'
  },
  {
    id: 'reading-text-4',
    text: 'It flies in the sky and takes people from one country to another very quickly.',
    options: ['Car', 'Train', 'Ship', 'Airplane', 'Bicycle'],
    correct: 3,
    explanation: 'An airplane flies and transports people between countries.'
  },
  {
    id: 'reading-text-5',
    text: 'Children play with it. It has four wheels and you can push or pull it around.',
    options: ['Ball', 'Doll', 'Toy car', 'Puzzle', 'Book'],
    correct: 2,
    explanation: 'A toy car has four wheels and children can push or pull it.'
  }
];

// أسئلة القراءة 2 - صح أم خطأ
export const readingComprehensionText = {
  title: 'A Day at the Science Museum',
  text: `Last Friday, Ahmed and his class visited the Science Museum in Muscat. They arrived at 9:00 AM and met their guide, Dr. Fatima. 

First, they visited the Space Gallery. Ahmed learned that the Earth is 150 million kilometers away from the Sun. He was amazed to discover that light from the Sun takes 8 minutes to reach Earth.

Next, they went to the Technology Hall. The students saw old computers from the 1980s and compared them to modern smartphones. Ahmed's friend Sara was surprised to learn that the first computer was as big as a room!

After that, they explored the Ocean World section. They learned that the deepest part of the ocean is called the Mariana Trench, and it's deeper than Mount Everest is tall. Ahmed thought the colorful fish models were beautiful.

Finally, they visited the Dinosaur Exhibition. The guide explained that dinosaurs lived millions of years ago. Ahmed's favorite was the T-Rex skeleton because it was 12 meters long!

The students had lunch at the museum café and bought souvenirs from the gift shop. Ahmed bought a small telescope and Sara bought a book about space. They returned to school at 3:00 PM, feeling excited about everything they had learned.`,
  
  questions: [
    {
      id: 'reading-comp-1',
      statement: 'Ahmed and his class visited the Science Museum on Friday.',
      correct: true,
      explanation: 'The text states "Last Friday, Ahmed and his class visited the Science Museum".'
    },
    {
      id: 'reading-comp-2',
      statement: 'Dr. Fatima was their science teacher.',
      correct: false,
      explanation: 'Dr. Fatima was their guide at the museum, not their teacher.'
    },
    {
      id: 'reading-comp-3',
      statement: 'Light from the Sun takes 8 minutes to reach Earth.',
      correct: true,
      explanation: 'The text mentions "light from the Sun takes 8 minutes to reach Earth".'
    },
    {
      id: 'reading-comp-4',
      statement: 'The first computer was smaller than a smartphone.',
      correct: false,
      explanation: 'The text says the first computer "was as big as a room", which is much larger than a smartphone.'
    },
    {
      id: 'reading-comp-5',
      statement: 'Ahmed bought a book about space from the gift shop.',
      correct: false,
      explanation: 'Ahmed bought a telescope, while Sara bought the book about space.'
    }
  ]
};

// مواضيع الكتابة
export const writingTopics = [
  {
    id: 'writing-descriptive-1',
    type: 'descriptive',
    topic: 'My Favorite Place',
    instruction: 'Write a descriptive text of at least 40 words about your favorite place. Describe what it looks like and why you like it.',
    minWords: 40,
    criteria: ['Clear description', 'Good organization', 'Appropriate vocabulary', 'Correct grammar']
  },
  {
    id: 'writing-email-1',
    type: 'email',
    topic: 'Email about a school trip',
    instruction: 'Write an email to your friend about a recent school trip. Describe where you went, what you saw, and what you learned. Write at least 40 words.',
    minWords: 40,
    situation: 'Your name is Omar/Maryam. Write to your friend Khalid/Aisha about your visit to the National Museum.',
    criteria: ['Email format', 'Clear content', 'Good organization', 'Appropriate vocabulary', 'Correct grammar']
  }
];

// تصدير جميع الأسئلة
export const grade5ExamQuestions = {
  listening: {
    talents: listeningTalentsQuestions,
    space: listeningSpaceQuestions
  },
  vocabulary: vocabularyPictureMatching,
  grammar: grammarQuestions,
  reading: {
    textPictureMatching: readingTextPictureMatching,
    comprehension: readingComprehensionText
  },
  writing: writingTopics
};