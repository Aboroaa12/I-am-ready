import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, Trophy, Target, Clock, Zap, Star, Lightbulb, RotateCcw, Settings, Shuffle } from 'lucide-react';
import { VocabularyWord } from '../types';

interface SentenceCompletionProps {
  words: VocabularyWord[];
  onScore: (points: number) => void;
  onStreak: (increment: boolean) => void;
  grade: number;
}

interface CompletionQuestion {
  sentence: string;
  correctWord: string;
  options: string[];
  correctIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  hint?: string;
}

const SentenceCompletion: React.FC<SentenceCompletionProps> = ({ words, onScore, onStreak, grade }) => {
  const [questions, setQuestions] = useState<CompletionQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameComplete, setGameComplete] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  const totalQuestions = Math.min(10, words.length);

  useEffect(() => {
    generateQuestions();
  }, [words, difficulty]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !gameComplete && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult && questions.length > 0) {
      handleTimeout();
    }
  }, [timeLeft, showResult, gameComplete, questions.length]);

  const generateQuestions = () => {
    if (words.length === 0) return;

    const selectedWords = words
      .filter(word => word.exampleSentence)
      .sort(() => Math.random() - 0.5)
      .slice(0, totalQuestions);

    const generatedQuestions: CompletionQuestion[] = selectedWords.map(word => {
      const sentence = word.exampleSentence!;
      const targetWord = word.english;
      
      // Create sentence with blank
      const blankSentence = sentence.replace(new RegExp(`\\b${targetWord}\\b`, 'gi'), '____');
      
      // Generate wrong options
      const wrongOptions = words
        .filter(w => w.english !== targetWord && w.partOfSpeech === word.partOfSpeech)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.english);

      // If not enough words of same type, add random words
      while (wrongOptions.length < 3) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        if (randomWord.english !== targetWord && !wrongOptions.includes(randomWord.english)) {
          wrongOptions.push(randomWord.english);
        }
      }

      const options = [targetWord, ...wrongOptions].sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(targetWord);

      return {
        sentence: blankSentence,
        correctWord: targetWord,
        options,
        correctIndex,
        difficulty: getDifficultyLevel(sentence, targetWord),
        hint: `معنى الكلمة: ${word.arabic}`
      };
    });

    setQuestions(generatedQuestions);
  };

  const getDifficultyLevel = (sentence: string, word: string): 'easy' | 'medium' | 'hard' => {
    const sentenceLength = sentence.split(' ').length;
    const wordLength = word.length;
    
    if (sentenceLength <= 6 && wordLength <= 5) return 'easy';
    if (sentenceLength <= 10 && wordLength <= 8) return 'medium';
    return 'hard';
  };

  const handleTimeout = () => {
    setSelectedAnswer(-1);
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
      
      // Calculate points based on difficulty and hints used
      let points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
      if (timeLeft > 30) points += 5; // Speed bonus
      if (newStreak >= 3) points += newStreak; // Streak bonus
      if (showHint) points -= 3; // Hint penalty
      
      onScore(Math.max(points, 5));
      onStreak(true);
    } else {
      setStreak(0);
      onStreak(false);
    }

    setTimeout(nextQuestion, 3000);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 >= questions.length) {
      setGameComplete(true);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
      setTimeLeft(45);
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(45);
    setGameComplete(false);
    setShowHint(false);
    setHintsUsed(0);
    generateQuestions();
  };

  const toggleHint = () => {
    if (!showHint) {
      setHintsUsed(prev => prev + 1);
    }
    setShowHint(!showHint);
  };

  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري تحضير الأسئلة...</p>
      </div>
    );
  }

  if (gameComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-4">🎉 انتهى التمرين!</h3>
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
              <div className="text-2xl font-bold">{hintsUsed}</div>
              <div className="text-sm opacity-80">تلميحات مستخدمة</div>
            </div>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <div className="mb-6">
            {percentage >= 90 ? (
              <p className="text-2xl text-indigo-600 font-bold">🏆 ممتاز! إتقان كامل!</p>
            ) : percentage >= 80 ? (
              <p className="text-2xl text-blue-600 font-bold">🎉 ممتاز! أداء رائع!</p>
            ) : percentage >= 70 ? (
              <p className="text-2xl text-green-600 font-bold">👍 جيد جداً!</p>
            ) : percentage >= 60 ? (
              <p className="text-2xl text-yellow-600 font-bold">📚 جيد! تحتاج مراجعة!</p>
            ) : (
              <p className="text-2xl text-red-600 font-bold">💪 راجع الكلمات!</p>
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
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
          >
            <RotateCcw className="w-5 h-5 inline mr-2" />
            تمرين جديد
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">✍️ إكمال الجملة</h3>
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
            currentQ.difficulty === 'easy' ? 'bg-green-500' :
            currentQ.difficulty === 'medium' ? 'bg-yellow-500' :
            'bg-red-500'
          }`}>
            {currentQ.difficulty === 'easy' ? 'سهل' : currentQ.difficulty === 'medium' ? 'متوسط' : 'صعب'}
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
          <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">
            أكمل الجملة بالكلمة المناسبة:
          </h4>
          <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
            <p className="text-lg font-semibold text-center" dir="ltr">
              {currentQ.sentence}
            </p>
          </div>
        </div>

        {/* Hint */}
        {showHint && currentQ.hint && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-yellow-800">تلميح:</span>
            </div>
            <p className="text-yellow-700">{currentQ.hint}</p>
          </div>
        )}

        {/* Options with proper text direction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentQ.options.map((option: string, index: number) => {
            let buttonClass = "p-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-md border-2 ";
            
            // Determine text direction - English words should be LTR
            const isArabic = /[\u0600-\u06FF]/.test(option);
            const textDirection = isArabic ? 'rtl' : 'ltr';
            const textAlign = isArabic ? 'text-right' : 'text-left';
            
            if (showResult) {
              if (index === currentQ.correctIndex) {
                buttonClass += "bg-green-500 text-white border-green-600";
              } else if (index === selectedAnswer) {
                buttonClass += "bg-red-500 text-white border-red-600";
              } else {
                buttonClass += "bg-gray-300 text-gray-600 border-gray-300";
              }
            } else {
              buttonClass += "bg-indigo-50 hover:bg-indigo-100 text-gray-800 border-indigo-200 hover:border-indigo-400";
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

        {/* Hint Button */}
        {!showResult && !showHint && currentQ.hint && (
          <div className="text-center mb-6">
            <button
              onClick={toggleHint}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <Lightbulb className="w-4 h-4" />
              إظهار تلميح
            </button>
          </div>
        )}

        {/* Result Feedback */}
        {showResult && (
          <div className={`p-6 rounded-xl text-center font-semibold border-2 ${
            selectedAnswer === -1 ? 'bg-orange-100 text-orange-800 border-orange-300' :
            selectedAnswer === currentQ.correctIndex 
              ? 'bg-green-100 text-green-800 border-green-300' 
              : 'bg-red-100 text-red-800 border-red-300'
          }`}>
            <div className="flex items-center justify-center gap-3 mb-3">
              {selectedAnswer === -1 ? (
                <>
                  <Clock className="w-8 h-8" />
                  <span className="text-xl">⏰ انتهى الوقت!</span>
                </>
              ) : selectedAnswer === currentQ.correctIndex ? (
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
            <p className="text-lg mb-2">
              <strong>الإجابة الصحيحة:</strong> 
              <span className="ml-2 font-bold" dir="ltr">{currentQ.options[currentQ.correctIndex]}</span>
            </p>
            <div className="bg-white/50 rounded-lg p-3 mt-3">
              <p className="text-base" dir="ltr">
                {currentQ.sentence.replace('____', currentQ.correctWord)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SentenceCompletion;