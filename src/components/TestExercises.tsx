import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, Trophy, Clock, Zap, BookOpen, Headphones, Edit, FileText, Lightbulb } from 'lucide-react';
import { VocabularyWord } from '../types';

interface TestExercisesProps {
  grade: number;
  onScore: (points: number) => void;
  onStreak: (increment: boolean) => void;
}

interface TestQuestion {
  id: string;
  skill: string;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  audio?: string;
  image?: string;
  text?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const TestExercises: React.FC<TestExercisesProps> = ({ grade, onScore, onStreak }) => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Available skills for each grade
  const skillsByGrade: Record<number, string[]> = {
    5: ['Listening 1', 'Listening 2', 'Vocabulary', 'Grammar', 'Reading 1', 'Reading 2', 'Writing 1', 'Writing 2'],
    6: ['Listening 1', 'Listening 2', 'Vocabulary', 'Grammar', 'Reading 1', 'Reading 2', 'Writing 1', 'Writing 2'],
    // Add more grades as needed
  };

  // Sample questions for Grade 5
  const sampleQuestionsGrade5: Record<string, TestQuestion[]> = {
    'Listening 1': [
      {
        id: 'l1-1',
        skill: 'Listening 1',
        question: 'Listen to the audio and choose the correct answer: What is the boy\'s favorite animal?',
        options: ['Lion', 'Elephant', 'Tiger', 'Giraffe'],
        correctAnswer: 1, // Elephant
        explanation: 'In the audio, the boy says "I love elephants because they are big and smart."',
        difficulty: 'easy'
      },
      {
        id: 'l1-2',
        skill: 'Listening 1',
        question: 'Listen to the conversation and answer: Where are the children going?',
        options: ['To the zoo', 'To the park', 'To the museum', 'To the library'],
        correctAnswer: 2, // To the museum
        explanation: 'In the conversation, the teacher says "Today we are going to visit the museum."',
        difficulty: 'medium'
      },
      {
        id: 'l1-3',
        skill: 'Listening 1',
        question: 'Listen to the story and choose the correct answer: What happened to the boy\'s toy?',
        options: ['He lost it', 'His friend took it', 'It broke', 'His sister hid it'],
        correctAnswer: 3, // His sister hid it
        explanation: 'In the story, the boy says "My sister hid my toy as a joke."',
        difficulty: 'medium'
      }
    ],
    'Listening 2': [
      {
        id: 'l2-1',
        skill: 'Listening 2',
        question: 'Listen to the weather forecast and choose the correct answer: What will the weather be like tomorrow?',
        options: ['Sunny', 'Rainy', 'Cloudy', 'Windy'],
        correctAnswer: 0, // Sunny
        explanation: 'The weather forecast says "Tomorrow will be sunny with clear skies."',
        difficulty: 'medium'
      },
      {
        id: 'l2-2',
        skill: 'Listening 2',
        question: 'Listen to the announcement and answer: What time does the school trip start?',
        options: ['8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM'],
        correctAnswer: 2, // 9:00 AM
        explanation: 'The announcement says "The bus will leave at 9:00 AM sharp."',
        difficulty: 'medium'
      },
      {
        id: 'l2-3',
        skill: 'Listening 2',
        question: 'Listen to the instructions and choose what you need to do first:',
        options: ['Open your books', 'Write your name', 'Listen carefully', 'Raise your hand'],
        correctAnswer: 1, // Write your name
        explanation: 'The instructions say "First, write your name at the top of the page."',
        difficulty: 'hard'
      }
    ],
    'Vocabulary': [
      {
        id: 'v-1',
        skill: 'Vocabulary',
        question: 'Choose the correct meaning of the word "enormous":',
        options: ['Very small', 'Very big', 'Very fast', 'Very slow'],
        correctAnswer: 1, // Very big
        explanation: 'Enormous means very big or huge.',
        difficulty: 'easy'
      },
      {
        id: 'v-2',
        skill: 'Vocabulary',
        question: 'Which word means "a place where you can borrow books"?',
        options: ['Hospital', 'School', 'Library', 'Museum'],
        correctAnswer: 2, // Library
        explanation: 'A library is a place where you can borrow books.',
        difficulty: 'easy'
      },
      {
        id: 'v-3',
        skill: 'Vocabulary',
        question: 'Choose the word that means "to look at words and understand them":',
        options: ['Write', 'Speak', 'Listen', 'Read'],
        correctAnswer: 3, // Read
        explanation: 'To read means to look at words and understand them.',
        difficulty: 'easy'
      },
      {
        id: 'v-4',
        skill: 'Vocabulary',
        question: 'What is the opposite of "happy"?',
        options: ['Sad', 'Angry', 'Tired', 'Excited'],
        correctAnswer: 0, // Sad
        explanation: 'The opposite of happy is sad.',
        difficulty: 'easy'
      },
      {
        id: 'v-5',
        skill: 'Vocabulary',
        question: 'Which word describes something that happens every day?',
        options: ['Weekly', 'Monthly', 'Daily', 'Yearly'],
        correctAnswer: 2, // Daily
        explanation: 'Daily means something that happens every day.',
        difficulty: 'medium'
      }
    ],
    'Grammar': [
      {
        id: 'g-1',
        skill: 'Grammar',
        question: 'Choose the correct sentence:',
        options: [
          'She have a new book.',
          'She has a new book.',
          'She having a new book.',
          'She haves a new book.'
        ],
        correctAnswer: 1, // She has a new book.
        explanation: 'We use "has" with he/she/it in the present simple tense.',
        difficulty: 'easy'
      },
      {
        id: 'g-2',
        skill: 'Grammar',
        question: 'Complete the sentence: "They _____ playing football now."',
        options: ['is', 'are', 'am', 'be'],
        correctAnswer: 1, // are
        explanation: 'We use "are" with they/we/you in the present continuous tense.',
        difficulty: 'easy'
      },
      {
        id: 'g-3',
        skill: 'Grammar',
        question: 'Choose the correct past tense form of "go":',
        options: ['goed', 'gone', 'went', 'going'],
        correctAnswer: 2, // went
        explanation: '"Went" is the past tense of "go".',
        difficulty: 'medium'
      },
      {
        id: 'g-4',
        skill: 'Grammar',
        question: 'Which sentence is in the future tense?',
        options: [
          'I am eating lunch.',
          'I eat lunch.',
          'I will eat lunch.',
          'I ate lunch.'
        ],
        correctAnswer: 2, // I will eat lunch.
        explanation: 'We use "will" to form the future simple tense.',
        difficulty: 'medium'
      },
      {
        id: 'g-5',
        skill: 'Grammar',
        question: 'Choose the correct comparative form: "This book is _____ than that one."',
        options: ['more big', 'bigger', 'most big', 'biggest'],
        correctAnswer: 1, // bigger
        explanation: 'For short adjectives like "big", we add "-er" to form the comparative.',
        difficulty: 'medium'
      }
    ],
    'Reading 1': [
      {
        id: 'r1-1',
        skill: 'Reading 1',
        question: 'Read the text and answer the question:\n\nSara loves animals. She has a cat and a dog. Her cat is black and her dog is brown. She plays with them every day.\n\nWhat color is Sara\'s dog?',
        options: ['Black', 'White', 'Brown', 'Gray'],
        correctAnswer: 2, // Brown
        explanation: 'The text says "Her cat is black and her dog is brown."',
        text: 'Sara loves animals. She has a cat and a dog. Her cat is black and her dog is brown. She plays with them every day.',
        difficulty: 'easy'
      },
      {
        id: 'r1-2',
        skill: 'Reading 1',
        question: 'Read the text and answer the question:\n\nTom went to the park on Saturday. He played football with his friends. They had a lot of fun. After that, they ate ice cream.\n\nWhen did Tom go to the park?',
        options: ['Friday', 'Saturday', 'Sunday', 'Monday'],
        correctAnswer: 1, // Saturday
        explanation: 'The text says "Tom went to the park on Saturday."',
        text: 'Tom went to the park on Saturday. He played football with his friends. They had a lot of fun. After that, they ate ice cream.',
        difficulty: 'easy'
      },
      {
        id: 'r1-3',
        skill: 'Reading 1',
        question: 'Read the text and answer the question:\n\nMy name is Ali. I am 10 years old. I live in Muscat with my family. I have two brothers and one sister. My favorite subject is Science.\n\nHow many brothers does Ali have?',
        options: ['One', 'Two', 'Three', 'Four'],
        correctAnswer: 1, // Two
        explanation: 'The text says "I have two brothers and one sister."',
        text: 'My name is Ali. I am 10 years old. I live in Muscat with my family. I have two brothers and one sister. My favorite subject is Science.',
        difficulty: 'easy'
      }
    ],
    'Reading 2': [
      {
        id: 'r2-1',
        skill: 'Reading 2',
        question: 'Read the text and answer the question:\n\nThe desert is a very dry place. It doesn\'t rain much in the desert. Many plants and animals live in the desert. They have special ways to survive with little water. Camels can live for many days without drinking water.\n\nWhy can camels survive in the desert?',
        options: [
          'They don\'t need water',
          'They can live for many days without water',
          'They drink a lot of water',
          'They eat special plants'
        ],
        correctAnswer: 1, // They can live for many days without water
        explanation: 'The text says "Camels can live for many days without drinking water."',
        text: 'The desert is a very dry place. It doesn\'t rain much in the desert. Many plants and animals live in the desert. They have special ways to survive with little water. Camels can live for many days without drinking water.',
        difficulty: 'medium'
      },
      {
        id: 'r2-2',
        skill: 'Reading 2',
        question: 'Read the text and answer the question:\n\nOman is a beautiful country in the Middle East. It has mountains, beaches, and deserts. The capital city is Muscat. People in Oman speak Arabic. Oman is famous for its dates and frankincense.\n\nWhat is the capital city of Oman?',
        options: ['Dubai', 'Salalah', 'Muscat', 'Nizwa'],
        correctAnswer: 2, // Muscat
        explanation: 'The text says "The capital city is Muscat."',
        text: 'Oman is a beautiful country in the Middle East. It has mountains, beaches, and deserts. The capital city is Muscat. People in Oman speak Arabic. Oman is famous for its dates and frankincense.',
        difficulty: 'medium'
      },
      {
        id: 'r2-3',
        skill: 'Reading 2',
        question: 'Read the text and answer the question:\n\nThe water cycle has four main stages. First, water from oceans, lakes, and rivers evaporates and becomes water vapor. Then, the water vapor rises and forms clouds. Next, the water falls back to Earth as rain or snow. Finally, the water flows back to oceans, lakes, and rivers.\n\nWhat is the first stage of the water cycle?',
        options: [
          'Water forms clouds',
          'Water falls as rain',
          'Water flows to oceans',
          'Water evaporates'
        ],
        correctAnswer: 3, // Water evaporates
        explanation: 'The text says "First, water from oceans, lakes, and rivers evaporates and becomes water vapor."',
        text: 'The water cycle has four main stages. First, water from oceans, lakes, and rivers evaporates and becomes water vapor. Then, the water vapor rises and forms clouds. Next, the water falls back to Earth as rain or snow. Finally, the water flows back to oceans, lakes, and rivers.',
        difficulty: 'hard'
      }
    ],
    'Writing 1': [
      {
        id: 'w1-1',
        skill: 'Writing 1',
        question: 'Choose the correct order of words to make a sentence:',
        options: [
          'cat the is black',
          'the cat is black',
          'black is the cat',
          'is black the cat'
        ],
        correctAnswer: 1, // the cat is black
        explanation: 'The correct word order in English is: article + noun + verb + adjective.',
        difficulty: 'easy'
      },
      {
        id: 'w1-2',
        skill: 'Writing 1',
        question: 'Which sentence has the correct punctuation?',
        options: [
          'where is your book',
          'where is your book.',
          'where is your book?',
          'where, is your book'
        ],
        correctAnswer: 2, // where is your book?
        explanation: 'Questions should end with a question mark (?).',
        difficulty: 'easy'
      },
      {
        id: 'w1-3',
        skill: 'Writing 1',
        question: 'Choose the sentence with the correct capitalization:',
        options: [
          'my friend ahmed lives in muscat.',
          'My friend ahmed lives in muscat.',
          'My friend Ahmed lives in muscat.',
          'My friend Ahmed lives in Muscat.'
        ],
        correctAnswer: 3, // My friend Ahmed lives in Muscat.
        explanation: 'We capitalize the first letter of sentences, names of people, and names of places.',
        difficulty: 'medium'
      }
    ],
    'Writing 2': [
      {
        id: 'w2-1',
        skill: 'Writing 2',
        question: 'Which is the best topic sentence for a paragraph about healthy food?',
        options: [
          'I like apples and bananas.',
          'There are many types of food.',
          'Eating healthy food is important for our bodies.',
          'My mother cooks delicious meals.'
        ],
        correctAnswer: 2, // Eating healthy food is important for our bodies.
        explanation: 'A good topic sentence introduces the main idea of the paragraph.',
        difficulty: 'medium'
      },
      {
        id: 'w2-2',
        skill: 'Writing 2',
        question: 'Choose the best concluding sentence for a paragraph about your school:',
        options: [
          'Schools are important places.',
          'I go to school every day.',
          'My school has many classrooms.',
          'I am proud to be a student at my wonderful school.'
        ],
        correctAnswer: 3, // I am proud to be a student at my wonderful school.
        explanation: 'A good concluding sentence summarizes the main idea and gives a final thought.',
        difficulty: 'hard'
      },
      {
        id: 'w2-3',
        skill: 'Writing 2',
        question: 'Which sentence does NOT belong in a paragraph about animals in the zoo?',
        options: [
          'The lions are very big and strong.',
          'The monkeys are funny and playful.',
          'My favorite subject is Mathematics.',
          'The elephants have long trunks.'
        ],
        correctAnswer: 2, // My favorite subject is Mathematics.
        explanation: 'This sentence is about school subjects, not about animals in the zoo.',
        difficulty: 'medium'
      }
    ]
  };

  // Sample questions for other grades can be added similarly

  useEffect(() => {
    if (selectedSkill) {
      loadQuestions(selectedSkill);
    }
  }, [selectedSkill, grade]);

  const loadQuestions = (skill: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real application, you would fetch questions from an API
      // For now, we'll use the sample questions
      let questionsForSkill: TestQuestion[] = [];
      
      if (grade === 5) {
        questionsForSkill = sampleQuestionsGrade5[skill] || [];
      }
      // Add more grades as needed
      
      if (questionsForSkill.length === 0) {
        setError(`No questions available for ${skill} in Grade ${grade}`);
      } else {
        setQuestions(questionsForSkill);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setTimeLeft(60); // 60 seconds per question
        setTestComplete(false);
      }
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSkill && questions.length > 0 && !testComplete && !showResult) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [selectedSkill, questions, currentQuestionIndex, testComplete, showResult]);

  useEffect(() => {
    // Clean up audio when component unmounts or when audio changes
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [audioElement]);

  const handleTimeout = () => {
    setSelectedAnswer(null);
    setShowResult(true);
    setStreak(0);
    onStreak(false);
    
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const handleAnswer = (answer: string | number) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setBestStreak(Math.max(bestStreak, newStreak));
      
      // Calculate points based on difficulty and time left
      let points = 10;
      if (currentQuestion.difficulty === 'medium') points = 15;
      if (currentQuestion.difficulty === 'hard') points = 20;
      
      // Bonus for quick answers
      if (timeLeft > 45) points += 5;
      
      // Streak bonus
      if (newStreak >= 3) points += newStreak;
      
      onScore(points);
      onStreak(true);
    } else {
      setStreak(0);
      onStreak(false);
    }
    
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 >= questions.length) {
      setTestComplete(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(60);
      
      // Stop any playing audio
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
        setIsAudioPlaying(false);
      }
    }
  };

  const restartTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeLeft(60);
    setTestComplete(false);
    setStreak(0);
    
    // Stop any playing audio
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
      setIsAudioPlaying(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (!audioUrl) return;
    
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
    }
    
    const audio = new Audio(audioUrl);
    setAudioElement(audio);
    
    audio.onplay = () => setIsAudioPlaying(true);
    audio.onpause = () => setIsAudioPlaying(false);
    audio.onended = () => setIsAudioPlaying(false);
    audio.onerror = () => {
      console.warn('Audio file not available for this question');
      setIsAudioPlaying(false);
    };
    
    audio.play().catch(err => {
      console.warn('Audio playback not available:', err.message);
      setIsAudioPlaying(false);
    });
  };

  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  // Get current question safely
  const currentQuestion = questions.length > 0 && currentQuestionIndex < questions.length 
    ? questions[currentQuestionIndex] 
    : null;

  if (!selectedSkill) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl p-6">
          <h3 className="text-2xl font-bold text-center">اختبارات تفاعلية</h3>
          <p className="text-center opacity-90">اختر المهارة التي تريد التدرب عليها</p>
        </div>
        
        <div className="bg-white rounded-b-xl p-8 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {(skillsByGrade[grade] || []).map((skill) => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className="bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
              >
                <div className="flex flex-col items-center gap-3">
                  {skill.includes('Listening') && <Headphones className="w-8 h-8" />}
                  {skill.includes('Vocabulary') && <BookOpen className="w-8 h-8" />}
                  {skill.includes('Grammar') && <Lightbulb className="w-8 h-8" />}
                  {skill.includes('Reading') && <FileText className="w-8 h-8" />}
                  {skill.includes('Writing') && <Edit className="w-8 h-8" />}
                  <span>{skill}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري تحميل الأسئلة...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 text-center">
        <div className="text-red-500 mb-4">⚠️</div>
        <p className="text-red-600 font-bold mb-2">{error}</p>
        <button
          onClick={() => setSelectedSkill(null)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors mt-4"
        >
          العودة للاختيار
        </button>
      </div>
    );
  }

  if (testComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-4">🎉 انتهى الاختبار!</h3>
          <div className="text-6xl font-bold mb-2">{percentage}%</div>
          <p className="text-xl mb-4">
            {score} / {questions.length} إجابة صحيحة
          </p>
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{bestStreak}</div>
              <div className="text-sm opacity-80">أفضل سلسلة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{selectedSkill}</div>
              <div className="text-sm opacity-80">المهارة</div>
            </div>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <div className="mb-6">
            {percentage >= 90 ? (
              <p className="text-2xl text-green-600 font-bold">🏆 ممتاز! أداء استثنائي!</p>
            ) : percentage >= 80 ? (
              <p className="text-2xl text-blue-600 font-bold">🎉 جيد جداً! أداء رائع!</p>
            ) : percentage >= 70 ? (
              <p className="text-2xl text-yellow-600 font-bold">👍 جيد! استمر في التحسن!</p>
            ) : percentage >= 60 ? (
              <p className="text-2xl text-orange-600 font-bold">📚 مقبول! تحتاج إلى مزيد من التدريب</p>
            ) : (
              <p className="text-2xl text-red-600 font-bold">💪 لا تيأس! واصل المحاولة!</p>
            )}
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={restartTest}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
            >
              إعادة الاختبار
            </button>
            <button
              onClick={() => setSelectedSkill(null)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
            >
              اختيار مهارة أخرى
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0 || !currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 text-center">
        <p className="text-gray-600">لا توجد أسئلة متاحة لهذه المهارة حالياً.</p>
        <button
          onClick={() => setSelectedSkill(null)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors mt-4"
        >
          العودة للاختيار
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">{selectedSkill}</h3>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold">{score}</div>
              <div className="text-xs opacity-80">النتيجة</div>
            </div>
            {streak > 0 && (
              <div className="text-center">
                <div className="text-lg font-bold flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {streak}
                </div>
                <div className="text-xs opacity-80">سلسلة</div>
              </div>
            )}
            <div className="text-center">
              <div className={`text-lg font-bold flex items-center gap-1 ${timeLeft <= 10 ? 'text-red-300 animate-pulse' : ''}`}>
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs opacity-80">وقت</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm opacity-90">
          <span>السؤال {currentQuestionIndex + 1} / {questions.length}</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            currentQuestion.difficulty === 'easy' ? 'bg-green-500' :
            currentQuestion.difficulty === 'medium' ? 'bg-yellow-500' :
            'bg-red-500'
          }`}>
            {currentQuestion.difficulty === 'easy' ? 'سهل' : 
             currentQuestion.difficulty === 'medium' ? 'متوسط' : 'صعب'}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mt-4">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Content */}
      <div className="bg-white rounded-b-xl p-8 shadow-xl">
        {/* Audio Player for Listening Questions */}
        {currentQuestion.skill.includes('Listening') && (
          <div className="mb-6 text-center">
            <button
              onClick={() => currentQuestion.audio && playAudio(currentQuestion.audio)}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg flex items-center gap-2 mx-auto ${isAudioPlaying ? 'animate-pulse' : ''}`}
              disabled={!currentQuestion.audio}
            >
              <Headphones className="w-5 h-5" />
              {isAudioPlaying ? 'جاري التشغيل...' : 'استمع للتسجيل'}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              {currentQuestion.audio ? 'اضغط على الزر للاستماع إلى التسجيل الصوتي' : 'التسجيل الصوتي غير متوفر حالياً'}
            </p>
          </div>
        )}

        {/* Reading Text */}
        {currentQuestion.skill.includes('Reading') && currentQuestion.text && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h4 className="font-bold text-blue-800 mb-2">اقرأ النص التالي:</h4>
            <p className="text-gray-800 whitespace-pre-line">{currentQuestion.text}</p>
          </div>
        )}

        {/* Question */}
        <div className="mb-6">
          <h4 className="text-xl font-bold text-gray-800 mb-4">{currentQuestion.question}</h4>
          
          {/* Image if available */}
          {currentQuestion.image && (
            <div className="mb-4">
              <img 
                src={currentQuestion.image} 
                alt="Question image" 
                className="max-w-full h-auto rounded-lg mx-auto"
              />
            </div>
          )}
        </div>

        {/* Options */}
        {currentQuestion.options && (
          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "w-full p-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-md ";
              
              // Determine text direction based on content
              const isArabic = /[\u0600-\u06FF]/.test(option);
              const textDirection = isArabic ? 'rtl' : 'ltr';
              const textAlign = isArabic ? 'text-right' : 'text-left';
              
              if (showResult) {
                if (index === currentQuestion.correctAnswer) {
                  buttonClass += "bg-green-500 text-white";
                } else if (index === selectedAnswer) {
                  buttonClass += "bg-red-500 text-white";
                } else {
                  buttonClass += "bg-gray-300 text-gray-600";
                }
              } else {
                buttonClass += "bg-blue-50 hover:bg-blue-100 text-gray-800 border-2 border-blue-200 hover:border-blue-400";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`${buttonClass} ${textAlign}`}
                  dir={textDirection}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option}</span>
                    {showResult && index === currentQuestion.correctAnswer && (
                      <CheckCircle className="w-6 h-6" />
                    )}
                    {showResult && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                      <XCircle className="w-6 h-6" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Text Input for Writing Questions */}
        {currentQuestion.skill.includes('Writing') && !currentQuestion.options && (
          <div className="mb-6">
            <textarea
              className="w-full h-32 p-4 border-2 border-blue-300 rounded-xl focus:border-blue-500 focus:outline-none"
              placeholder="اكتب إجابتك هنا..."
              disabled={showResult}
            ></textarea>
            
            {!showResult && (
              <button
                onClick={() => handleAnswer("submitted")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg mt-4"
              >
                تقديم الإجابة
              </button>
            )}
          </div>
        )}

        {/* Result Feedback */}
        {showResult && currentQuestion.explanation && (
          <div className={`p-6 rounded-xl text-center font-semibold ${
            selectedAnswer === currentQuestion.correctAnswer 
              ? 'bg-green-100 text-green-800 border-2 border-green-300' 
              : 'bg-red-100 text-red-800 border-2 border-red-300'
          }`}>
            <div className="flex items-center justify-center gap-3 mb-3">
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <>
                  <CheckCircle className="w-8 h-8" />
                  <span className="text-xl">✅ إجابة صحيحة!</span>
                  {streak > 1 && (
                    <span className="ml-2 text-indigo-600">🔥 سلسلة {streak}!</span>
                  )}
                </>
              ) : (
                <>
                  <XCircle className="w-8 h-8" />
                  <span className="text-xl">❌ إجابة خاطئة!</span>
                </>
              )}
            </div>
            <p className="text-lg">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setSelectedSkill(null)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            العودة للاختيار
          </button>

          {showResult && (
            <button
              onClick={nextQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              {currentQuestionIndex + 1 >= questions.length ? 'إنهاء الاختبار' : 'السؤال التالي'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestExercises;