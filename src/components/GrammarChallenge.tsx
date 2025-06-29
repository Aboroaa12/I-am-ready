import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Lightbulb, ArrowRight, Trophy, Target, Clock, Zap } from 'lucide-react';
import { getGrammarByGrade, getQuestionsByGrade } from '../data/grammar';
import { QuizQuestion } from '../types';

interface GrammarChallengeProps {
  onScore: (points: number) => void;
  onStreak: (increment: boolean) => void;
  grade?: number;
}

const GrammarChallenge: React.FC<GrammarChallengeProps> = ({ onScore, onStreak, grade = 5 }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameComplete, setGameComplete] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const totalQuestions = 10;

  useEffect(() => {
    generateQuestions();
  }, [grade, difficulty]);

  useEffect(() => {
    if (timeLeft > 0 && !showExplanation && !gameComplete && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showExplanation && questions.length > 0) {
      handleTimeout();
    }
  }, [timeLeft, showExplanation, gameComplete, questions.length]);

  const generateQuestions = () => {
    const grammarQuestions = getQuestionsByGrade(grade);
    
    if (grammarQuestions.length === 0) {
      // إنشاء أسئلة افتراضية إذا لم توجد أسئلة للصف
      const defaultQuestions: QuizQuestion[] = [
        {
          question: "She _____ to school every day.",
          options: ["go", "goes", "going", "went"],
          correct: 1,
          explanation: "نستخدم 'goes' مع ضمير الغائب المفرد (she) في المضارع البسيط",
          unit: "Grammar Basics",
          grade: grade
        },
        {
          question: "I _____ my homework yesterday.",
          options: ["do", "did", "doing", "done"],
          correct: 1,
          explanation: "نستخدم 'did' للتعبير عن فعل حدث في الماضي",
          unit: "Grammar Basics",
          grade: grade
        },
        {
          question: "There _____ many books on the table.",
          options: ["is", "are", "was", "were"],
          correct: 1,
          explanation: "نستخدم 'are' مع الأسماء الجمع (books) في المضارع",
          unit: "Grammar Basics",
          grade: grade
        }
      ];
      setQuestions(defaultQuestions);
      return;
    }

    let filteredQuestions = [...grammarQuestions];
    
    // تطبيق مستوى الصعوبة
    if (difficulty === 'easy') {
      // اختيار الأسئلة الأساسية
      filteredQuestions = filteredQuestions.filter((_, index) => index % 3 === 0);
    } else if (difficulty === 'hard') {
      // اختيار الأسئلة المتقدمة
      filteredQuestions = filteredQuestions.filter((_, index) => index % 2 === 1);
    }
    
    const shuffledQuestions = filteredQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(totalQuestions, filteredQuestions.length));
    
    setQuestions(shuffledQuestions);
  };

  const handleTimeout = () => {
    setSelectedAnswer(-1); // إشارة للوقت المنتهي
    setShowExplanation(true);
    setStreak(0);
    onStreak(false);
    
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const isCorrect = answerIndex === questions[currentQuestion].correct;
    if (isCorrect) {
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setBestStreak(Math.max(bestStreak, newStreak));
      
      // نقاط إضافية حسب الصعوبة والسرعة
      let points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
      if (timeLeft > 30) points += 5; // بونص للسرعة
      if (newStreak >= 3) points += newStreak; // بونص للسلسلة
      
      onScore(points);
      onStreak(true);
    } else {
      setStreak(0);
      onStreak(false);
    }

    setTimeout(() => {
      nextQuestion();
    }, 4000);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 >= questions.length) {
      setGameComplete(true);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(45);
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(45);
    setGameComplete(false);
    generateQuestions();
  };

  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري تحضير أسئلة القواعد...</p>
      </div>
    );
  }

  if (gameComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-4">🎉 انتهى التحدي!</h3>
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
              <div className="text-2xl font-bold">{difficulty}</div>
              <div className="text-sm opacity-80">المستوى</div>
            </div>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <div className="mb-6">
            {percentage >= 90 ? (
              <p className="text-2xl text-purple-600 font-bold">🏆 خبير في القواعد!</p>
            ) : percentage >= 80 ? (
              <p className="text-2xl text-blue-600 font-bold">🎉 ممتاز في القواعد!</p>
            ) : percentage >= 70 ? (
              <p className="text-2xl text-green-600 font-bold">👍 جيد جداً!</p>
            ) : percentage >= 60 ? (
              <p className="text-2xl text-yellow-600 font-bold">📚 تحتاج مراجعة!</p>
            ) : (
              <p className="text-2xl text-red-600 font-bold">💪 راجع القواعد!</p>
            )}
          </div>
          
          <div className="flex justify-center gap-4 mb-6">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="easy">سهل</option>
              <option value="medium">متوسط</option>
              <option value="hard">صعب</option>
            </select>
          </div>
          
          <button
            onClick={restartGame}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
          >
            🔄 تحدي جديد
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">⚡ تحدي القواعد</h3>
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
          <span>السؤال {currentQuestion + 1} / {questions.length}</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            difficulty === 'easy' ? 'bg-green-500' :
            difficulty === 'medium' ? 'bg-yellow-500' :
            'bg-red-500'
          }`}>
            {difficulty === 'easy' ? 'سهل' : difficulty === 'medium' ? 'متوسط' : 'صعب'}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mt-4">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="p-8">
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">{currentQ.unit}</div>
          <h4 className="text-2xl font-bold text-gray-800 text-center mb-4" dir="ltr">
            {currentQ.question}
          </h4>
        </div>

        {/* Options with proper text direction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentQ.options.map((option, index) => {
            let buttonClass = "p-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-md border-2 ";
            
            // Determine text direction based on content
            const isArabic = /[\u0600-\u06FF]/.test(option);
            const textDirection = isArabic ? 'rtl' : 'ltr';
            const textAlign = isArabic ? 'text-right' : 'text-left';
            
            if (showExplanation) {
              if (index === currentQ.correct) {
                buttonClass += "bg-green-500 text-white border-green-600";
              } else if (index === selectedAnswer) {
                buttonClass += "bg-red-500 text-white border-red-600";
              } else {
                buttonClass += "bg-gray-300 text-gray-600 border-gray-300";
              }
            } else {
              buttonClass += "bg-purple-50 hover:bg-purple-100 text-gray-800 border-purple-200 hover:border-purple-400";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showExplanation}
                className={`${buttonClass} ${textAlign}`}
                dir={textDirection}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{option}</span>
                  {showExplanation && index === currentQ.correct && (
                    <CheckCircle className="w-6 h-6" />
                  )}
                  {showExplanation && index === selectedAnswer && index !== currentQ.correct && (
                    <XCircle className="w-6 h-6" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`p-6 rounded-xl ${
            selectedAnswer === -1 ? 'bg-orange-50 border-2 border-orange-200' :
            selectedAnswer === currentQ.correct 
              ? 'bg-green-50 border-2 border-green-200' 
              : 'bg-red-50 border-2 border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              <Lightbulb className={`w-6 h-6 mt-1 ${
                selectedAnswer === -1 ? 'text-orange-600' :
                selectedAnswer === currentQ.correct ? 'text-green-600' : 'text-red-600'
              }`} />
              <div>
                <h5 className="font-bold text-lg mb-2">
                  {selectedAnswer === -1 ? '⏰ انتهى الوقت!' :
                   selectedAnswer === currentQ.correct ? '✅ صحيح!' : '❌ خطأ!'}
                  {streak > 1 && selectedAnswer === currentQ.correct && (
                    <span className="ml-2 text-purple-600">🔥 سلسلة {streak}!</span>
                  )}
                </h5>
                <p className="text-gray-700 mb-2">
                  <strong>الإجابة الصحيحة:</strong> 
                  <span className="ml-2" dir="ltr">{currentQ.options[currentQ.correct]}</span>
                </p>
                <p className="text-gray-700">{currentQ.explanation}</p>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <button
                onClick={nextQuestion}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {currentQuestion + 1 >= questions.length ? 'إنهاء التحدي' : 'السؤال التالي'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrammarChallenge;