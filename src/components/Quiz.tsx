import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, ArrowRight, Trophy, Target, Zap } from 'lucide-react';
import { VocabularyWord } from '../types';

interface QuizProps {
  words: VocabularyWord[];
  onScore: (points: number) => void;
  onStreak: (increment: boolean) => void;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  word: VocabularyWord;
  type: 'meaning' | 'usage' | 'spelling';
}

const Quiz: React.FC<QuizProps> = ({ words, onScore, onStreak }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizComplete, setQuizComplete] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const totalQuestions = Math.min(10, words.length);

  useEffect(() => {
    if (words.length > 0) {
      generateQuestions();
    }
  }, [words]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !quizComplete && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult && questions.length > 0) {
      handleTimeout();
    }
  }, [timeLeft, showResult, quizComplete, questions.length]);

  const generateQuestions = () => {
    if (words.length === 0) return;
    
    const shuffledWords = [...words].sort(() => Math.random() - 0.5).slice(0, totalQuestions);
    const generatedQuestions: QuizQuestion[] = [];
    
    shuffledWords.forEach((word, index) => {
      const questionTypes: ('meaning' | 'usage' | 'spelling')[] = ['meaning', 'usage', 'spelling'];
      const questionType = questionTypes[index % questionTypes.length];
      
      let question: QuizQuestion;
      
      switch (questionType) {
        case 'meaning':
          question = generateMeaningQuestion(word);
          break;
        case 'usage':
          question = generateUsageQuestion(word);
          break;
        case 'spelling':
          question = generateSpellingQuestion(word);
          break;
        default:
          question = generateMeaningQuestion(word);
      }
      
      generatedQuestions.push(question);
    });
    
    setQuestions(generatedQuestions);
  };

  const generateMeaningQuestion = (word: VocabularyWord): QuizQuestion => {
    const correctAnswer = word.arabic;
    const wrongAnswers = words
      .filter(w => w.arabic !== correctAnswer && w.unit === word.unit)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.arabic);
    
    // إذا لم نجد كلمات كافية من نفس الوحدة، استخدم كلمات من وحدات أخرى
    if (wrongAnswers.length < 3) {
      const additionalWrong = words
        .filter(w => w.arabic !== correctAnswer && !wrongAnswers.includes(w.arabic))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3 - wrongAnswers.length)
        .map(w => w.arabic);
      wrongAnswers.push(...additionalWrong);
    }
    
    const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `ما معنى كلمة "${word.english}"؟`,
      options,
      correctIndex,
      word,
      type: 'meaning'
    };
  };

  const generateUsageQuestion = (word: VocabularyWord): QuizQuestion => {
    const sentence = word.exampleSentence || `I use the ${word.english} every day.`;
    const blankedSentence = sentence.replace(new RegExp(word.english, 'gi'), '____');
    
    const correctAnswer = word.english;
    const wrongAnswers = words
      .filter(w => w.english !== correctAnswer && w.partOfSpeech === word.partOfSpeech)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.english);
    
    if (wrongAnswers.length < 3) {
      const additionalWrong = words
        .filter(w => w.english !== correctAnswer && !wrongAnswers.includes(w.english))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3 - wrongAnswers.length)
        .map(w => w.english);
      wrongAnswers.push(...additionalWrong);
    }
    
    const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `أكمل الجملة: "${blankedSentence}"`,
      options,
      correctIndex,
      word,
      type: 'usage'
    };
  };

  const generateSpellingQuestion = (word: VocabularyWord): QuizQuestion => {
    const correctAnswer = word.english;
    
    // إنشاء أخطاء إملائية شائعة
    const wrongAnswers = [
      generateSpellingError(word.english, 'substitute'),
      generateSpellingError(word.english, 'omit'),
      generateSpellingError(word.english, 'add')
    ].filter(w => w !== correctAnswer);
    
    const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(correctAnswer);

    return {
      question: `ما هي الطريقة الصحيحة لكتابة كلمة "${word.arabic}"؟`,
      options,
      correctIndex,
      word,
      type: 'spelling'
    };
  };

  const generateSpellingError = (word: string, errorType: 'substitute' | 'omit' | 'add'): string => {
    const letters = word.split('');
    
    switch (errorType) {
      case 'substitute':
        if (letters.length > 1) {
          const randomIndex = Math.floor(Math.random() * letters.length);
          const substitutes = 'abcdefghijklmnopqrstuvwxyz';
          letters[randomIndex] = substitutes[Math.floor(Math.random() * substitutes.length)];
        }
        break;
      case 'omit':
        if (letters.length > 2) {
          const randomIndex = Math.floor(Math.random() * letters.length);
          letters.splice(randomIndex, 1);
        }
        break;
      case 'add':
        const randomIndex = Math.floor(Math.random() * (letters.length + 1));
        const additionalLetters = 'abcdefghijklmnopqrstuvwxyz';
        letters.splice(randomIndex, 0, additionalLetters[Math.floor(Math.random() * additionalLetters.length)]);
        break;
    }
    
    return letters.join('');
  };

  const handleTimeout = () => {
    setShowResult(true);
    setStreak(0);
    onStreak(false);
    setTimeout(nextQuestion, 2000);
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === questions[currentQuestion].correctIndex;
    if (isCorrect) {
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setBestStreak(Math.max(bestStreak, newStreak));
      onScore(15);
      onStreak(true);
    } else {
      setStreak(0);
      onStreak(false);
    }

    setTimeout(nextQuestion, 2500);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 >= totalQuestions) {
      setQuizComplete(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(30);
    setQuizComplete(false);
    setStreak(0);
    generateQuestions();
  };

  if (words.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8 text-center">
        <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">لا توجد كلمات متاحة</h3>
        <p className="text-gray-600">يرجى اختيار وحدة تحتوي على كلمات للاختبار</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري تحضير الأسئلة...</p>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((score / totalQuestions) * 100);
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-4">🎉 انتهى الاختبار!</h3>
          <div className="text-6xl font-bold mb-2">{percentage}%</div>
          <p className="text-xl">
            {score} / {totalQuestions} إجابة صحيحة
          </p>
          <div className="mt-4 flex justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{bestStreak}</div>
              <div className="text-sm opacity-80">أفضل سلسلة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{streak}</div>
              <div className="text-sm opacity-80">السلسلة النهائية</div>
            </div>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <div className="mb-6">
            {percentage >= 90 ? (
              <p className="text-2xl text-green-600 font-bold">🏆 ممتاز جداً! أنت محترف!</p>
            ) : percentage >= 80 ? (
              <p className="text-2xl text-blue-600 font-bold">🎉 ممتاز! استمر في التقدم!</p>
            ) : percentage >= 70 ? (
              <p className="text-2xl text-yellow-600 font-bold">👍 جيد جداً! تحسن ملحوظ!</p>
            ) : percentage >= 60 ? (
              <p className="text-2xl text-orange-600 font-bold">📚 جيد! راجع الكلمات مرة أخرى</p>
            ) : (
              <p className="text-2xl text-red-600 font-bold">💪 لا تيأس! المراجعة هي الحل</p>
            )}
          </div>
          
          <button
            onClick={restartQuiz}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
          >
            🔄 إعادة الاختبار
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">
            السؤال {currentQuestion + 1} / {totalQuestions}
          </span>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-300 animate-pulse' : ''}`}>
              {timeLeft}s
            </span>
          </div>
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
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="p-8">
        <div className="mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            currentQ.type === 'meaning' ? 'bg-blue-100 text-blue-800' :
            currentQ.type === 'usage' ? 'bg-green-100 text-green-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {currentQ.type === 'meaning' ? '📖 معنى الكلمة' :
             currentQ.type === 'usage' ? '🎯 استخدام الكلمة' :
             '✍️ تهجئة الكلمة'}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          {currentQ.question}
        </h3>

        {/* Options with proper text direction */}
        <div className="space-y-4 mb-8">
          {currentQ.options.map((option: string, index: number) => {
            let buttonClass = "w-full p-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-md ";
            
            // Determine text direction based on content
            const isArabic = /[\u0600-\u06FF]/.test(option);
            const textDirection = isArabic ? 'rtl' : 'ltr';
            const textAlign = isArabic ? 'text-right' : 'text-left';
            
            if (showResult) {
              if (index === currentQ.correctIndex) {
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
                  {showResult && index === currentQ.correctIndex && (
                    <CheckCircle className="w-6 h-6" />
                  )}
                  {showResult && index === selectedAnswer && index !== currentQ.correctIndex && (
                    <XCircle className="w-6 h-6" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Result Feedback */}
        {showResult && (
          <div className={`p-4 rounded-xl text-center font-semibold ${
            selectedAnswer === currentQ.correctIndex 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {selectedAnswer === currentQ.correctIndex ? (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6" />
                ✅ إجابة صحيحة! ممتاز!
                {streak > 1 && <span className="ml-2">🔥 سلسلة {streak}!</span>}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <XCircle className="w-6 h-6" />
                <span>❌ إجابة خاطئة. الإجابة الصحيحة: </span>
                <span 
                  className="font-bold"
                  dir={/[\u0600-\u06FF]/.test(currentQ.options[currentQ.correctIndex]) ? 'rtl' : 'ltr'}
                >
                  {currentQ.options[currentQ.correctIndex]}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;