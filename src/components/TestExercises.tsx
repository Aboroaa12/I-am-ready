import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, Trophy, Clock, Zap, BookOpen, Headphones, Edit, FileText, Lightbulb } from 'lucide-react';
import { VocabularyWord } from '../types';
import { grade5ExamStyleQuestions } from '../data/grade5Data';

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
        question: 'Listen to the dialogue about talents and choose: What talent is the person describing?',
        options: ['Playing piano', 'Dancing', 'Singing', 'Painting'],
        correctAnswer: 0, // Playing piano
        explanation: 'In the audio, the person says "I can play the piano very well. I practice every day."',
        difficulty: 'easy'
      },
      {
        id: 'l1-2',
        skill: 'Listening 1',
        question: 'Listen to the talent show dialogue: What does the girl want to learn?',
        options: ['How to paint', 'How to dance', 'How to sing', 'How to play guitar'],
        correctAnswer: 1, // How to dance
        explanation: 'In the dialogue, the girl asks "Can you teach me how to dance like that?"',
        difficulty: 'medium'
      },
      {
        id: 'l1-3',
        skill: 'Listening 1',
        question: 'Listen to the conversation about talents: Where did the boy learn his talent?',
        options: ['At school', 'From his father', 'At a music center', 'From YouTube'],
        correctAnswer: 2, // At a music center
        explanation: 'The boy mentions "I learned to play drums at the local music center."',
        difficulty: 'medium'
      }
    ],
    'Listening 2': [
      {
        id: 'l2-1',
        skill: 'Listening 2',
        question: 'Listen to the space museum dialogue: What is the distance from Earth to the Moon?',
        options: ['384,400 km', '149 million km', '778 million km', '1.4 billion km'],
        correctAnswer: 0, // 384,400 km
        explanation: 'The guide explains that the Moon is approximately 384,400 kilometers from Earth.',
        difficulty: 'medium'
      },
      {
        id: 'l2-2',
        skill: 'Listening 2',
        question: 'Listen to the space facts: How long does it take to travel to Mars?',
        options: ['6-9 months', '2-3 weeks', '1-2 years', '3-4 months'],
        correctAnswer: 0, // 6-9 months
        explanation: 'The dialogue mentions that it takes about 6 to 9 months to reach Mars.',
        difficulty: 'medium'
      },
      {
        id: 'l2-3',
        skill: 'Listening 2',
        question: 'Listen to the museum guide: Which planet is known as the "Red Planet"?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1, // Mars
        explanation: 'The guide explains that Mars is called the "Red Planet" because of its reddish appearance.',
        difficulty: 'hard'
      }
    ],
    'Vocabulary': [
      {
        id: 'v-1',
        skill: 'Vocabulary',
        question: 'Look at the picture and choose the correct word: [Picture of a bakery]',
        options: ['butcher', 'bakery', 'pharmacy', 'kiosk'],
        correctAnswer: 1,
        explanation: 'A bakery is where bread and cakes are sold.',
        difficulty: 'easy'
      },
      {
        id: 'v-2',
        skill: 'Vocabulary',
        question: 'Look at the picture and choose the correct word: [Picture of an escalator]',
        options: ['elevator', 'escalator', 'stairs', 'ladder'],
        correctAnswer: 1,
        explanation: 'An escalator is a moving staircase.',
        difficulty: 'easy'
      },
      {
        id: 'v-3',
        skill: 'Vocabulary',
        question: 'Look at the picture and choose the correct word: [Picture of a wallet]',
        options: ['purse', 'wallet', 'bag', 'suitcase'],
        correctAnswer: 1,
        explanation: 'A wallet is used to carry money and cards.',
        difficulty: 'easy'
      },
      {
        id: 'v-4',
        skill: 'Vocabulary',
        question: 'Look at the picture and choose the correct word: [Picture of a fishmonger]',
        options: ['butcher', 'baker', 'fishmonger', 'greengrocer'],
        correctAnswer: 2,
        explanation: 'A fishmonger sells fresh fish.',
        difficulty: 'medium'
      },
      {
        id: 'v-5',
        skill: 'Vocabulary',
        question: 'Look at the picture and choose the correct word: [Picture of a pharmacy]',
        options: ['hospital', 'clinic', 'pharmacy', 'dentist'],
        correctAnswer: 2,
        explanation: 'A pharmacy is where you buy medicine.',
        difficulty: 'medium'
      }
    ],
    'Grammar': [
      {
        id: 'g-1',
        skill: 'Grammar',
        question: 'The book _______ I bought yesterday is very interesting.',
        options: ['who', 'which', 'where', 'when'],
        correctAnswer: 1,
        explanation: 'نستخدم "which" مع الأشياء والأماكن',
        difficulty: 'easy'
      },
      {
        id: 'g-2',
        skill: 'Grammar',
        question: 'The teacher _______ teaches us English is very kind.',
        options: ['who', 'which', 'where', 'when'],
        correctAnswer: 0,
        explanation: 'نستخدم "who" مع الأشخاص',
        difficulty: 'easy'
      },
      {
        id: 'g-3',
        skill: 'Grammar',
        question: 'This car is _______ than that one.',
        options: ['fast', 'faster', 'fastest', 'more fast'],
        correctAnswer: 1,
        explanation: 'نضيف -er للصفات القصيرة في المقارنة',
        difficulty: 'medium'
      },
      {
        id: 'g-4',
        skill: 'Grammar',
        question: 'Tomorrow, we _______ visit the museum.',
        options: ['are', 'will', 'was', 'were'],
        correctAnswer: 1,
        explanation: 'نستخدم "will" للتحدث عن المستقبل',
        difficulty: 'easy'
      },
      {
        id: 'g-5',
        skill: 'Grammar',
        question: 'She _______ swim when she was five years old.',
        options: ['can', 'could', 'will', 'would'],
        correctAnswer: 1,
        explanation: 'نستخدم "could" للتحدث عن القدرة في الماضي',
        difficulty: 'medium'
      }
    ],
    'Reading 1': [
      {
        id: 'r1-1',
        skill: 'Reading 1',
        question: 'Read the description and choose the correct picture: "I use it to call my friends and family. It fits in my pocket and I can send messages with it."',
        options: ['Computer', 'Television', 'Mobile phone', 'Radio'],
        correctAnswer: 2,
        explanation: 'A mobile phone is used for calling and messaging and fits in your pocket.',
        difficulty: 'easy'
      },
      {
        id: 'r1-2',
        skill: 'Reading 1',
        question: 'Read the description and choose the correct picture: "It has many books and magazines. People go there to read quietly and borrow books."',
        options: ['Bookstore', 'Library', 'School', 'Museum'],
        correctAnswer: 1,
        explanation: 'A library is where people borrow books and read quietly.',
        difficulty: 'easy'
      },
      {
        id: 'r1-3',
        skill: 'Reading 1',
        question: 'Read the description and choose the correct picture: "People wear it on their wrist to know what time it is. It has numbers and hands that move."',
        options: ['Bracelet', 'Ring', 'Watch', 'Necklace'],
        correctAnswer: 2,
        explanation: 'A watch is worn on the wrist to tell time.',
        difficulty: 'medium'
      }
    ],
    'Reading 2': [
      {
        id: 'r2-1',
        skill: 'Reading 2',
        question: 'Read the text and answer True or False: "Last Saturday, Omar went to the bookstore with his father. They bought three books and a magazine. Omar was very happy because he found his favorite story book." - Omar went to the bookstore on Saturday.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'The text states that Omar went to the bookstore "Last Saturday".',
        text: 'Last Saturday, Omar went to the bookstore with his father. They bought three books and a magazine. Omar was very happy because he found his favorite story book.',
        difficulty: 'easy'
      },
      {
        id: 'r2-2',
        skill: 'Reading 2',
        question: 'Based on the same text - Omar bought four books.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'The text says they bought three books and a magazine, not four books.',
        text: 'Last Saturday, Omar went to the bookstore with his father. They bought three books and a magazine. Omar was very happy because he found his favorite story book.',
        difficulty: 'medium'
      }
    ],
    'Writing 1': [
      {
        id: 'w1-1',
        skill: 'Writing 1',
        question: 'Write a descriptive text of at least 40 words about "My Favorite Place". Your writing should be clear and organized.',
        options: [],
        correctAnswer: 0,
        explanation: 'This is a free writing task. Students should describe their favorite place with clear details and good organization.',
        difficulty: 'medium'
      }
    ],
    'Writing 2': [
      {
        id: 'w2-1',
        skill: 'Writing 2',
        question: 'Write an email to your friend about a school trip. Describe where you went, what you saw, and what you learned. Write at least 40 words.',
        options: [],
        correctAnswer: 0,
        explanation: 'Students should write an email format describing a school trip with clear details.',
        difficulty: 'medium'
      }
    ]
  };

  // إضافة الأسئلة الجديدة إلى الصف الخامس
  if (grade === 5) {
    // دمج الأسئلة الجديدة مع الموجودة
    Object.keys(sampleQuestionsGrade5).forEach(skill => {
      if (sampleQuestionsGrade5[skill]) {
        // إضافة المزيد من التنوع للأسئلة
        const existingQuestions = sampleQuestionsGrade5[skill];
        sampleQuestionsGrade5[skill] = existingQuestions;
      }
    });
  }

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