import React, { useState, useEffect, useRef } from 'react';
import { Volume2, CheckCircle, XCircle, ArrowRight, ArrowLeft, RotateCcw, Settings, Target, Trophy, Clock, Zap, Eye, EyeOff, Shuffle, Play, Pause } from 'lucide-react';
import { VocabularyWord } from '../types';
import { speechEngine } from '../utils/speechEngine';

interface SpellingExerciseProps {
  words: VocabularyWord[];
  onScore: (points: number) => void;
  onStreak: (increment: boolean) => void;
}

interface SpellingSettings {
  wordCount: number;
  showHints: boolean;
  playAudioOnStart: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // بالثواني، 0 = بدون حد زمني
  shuffleWords: boolean;
  showProgress: boolean;
  allowSkip: boolean;
}

interface LetterInput {
  letter: string;
  isCorrect: boolean | null;
  isRevealed: boolean;
}

const SpellingExercise: React.FC<SpellingExerciseProps> = ({ words, onScore, onStreak }) => {
  const [settings, setSettings] = useState<SpellingSettings>({
    wordCount: 10,
    showHints: true,
    playAudioOnStart: true,
    difficulty: 'medium',
    timeLimit: 0,
    shuffleWords: true,
    showProgress: true,
    allowSkip: false
  });

  const [exerciseWords, setExerciseWords] = useState<VocabularyWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<LetterInput[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWord, setShowWord] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);

  // مراجع للحقول النصية للتركيز التلقائي
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const currentWord = exerciseWords[currentWordIndex];

  useEffect(() => {
    const initializeSpeech = async () => {
      try {
        await speechEngine.initialize();
        setSpeechSupported(speechEngine.isSupported());
        console.log('تم تهيئة نظام النطق في تمرين التهجئة');
      } catch (error) {
        setSpeechSupported(false);
        console.error('فشل في تهيئة النطق:', error);
      }
    };

    initializeSpeech();
  }, []);

  // إعداد التمرين
  const setupExercise = () => {
    let selectedWords = [...words];
    
    // تطبيق الصعوبة
    if (settings.difficulty === 'easy') {
      selectedWords = selectedWords.filter(word => word.english.length <= 6);
    } else if (settings.difficulty === 'hard') {
      selectedWords = selectedWords.filter(word => word.english.length >= 8);
    }

    // خلط الكلمات إذا كان مطلوباً
    if (settings.shuffleWords) {
      selectedWords = selectedWords.sort(() => Math.random() - 0.5);
    }

    // اختيار العدد المطلوب
    const finalWords = selectedWords.slice(0, settings.wordCount);
    setExerciseWords(finalWords);
    setCurrentWordIndex(0);
    setIsCompleted(false);
    setScore(0);
    setCorrectWords(0);
    setMistakes(0);
    setCurrentStreak(0);
    setHintsUsed(0);
    setStartTime(new Date());

    if (finalWords.length > 0) {
      initializeWordInput(finalWords[0]);
      if (settings.timeLimit > 0) {
        setTimeLeft(settings.timeLimit);
      }
    }
  };

  // تهيئة إدخال الكلمة
  const initializeWordInput = (word: VocabularyWord) => {
    const inputs: LetterInput[] = word.english.split('').map(letter => ({
      letter: letter === ' ' ? ' ' : '',
      isCorrect: letter === ' ' ? true : null,
      isRevealed: letter === ' '
    }));
    setUserInputs(inputs);
    setShowWord(false);
    
    // إعداد مراجع الحقول النصية
    inputRefs.current = new Array(inputs.length).fill(null);
    
    // التركيز على أول حقل نصي بعد تحميل الكلمة
    setTimeout(() => {
      const firstInputIndex = inputs.findIndex(input => input.letter !== ' ' && !input.isRevealed);
      if (firstInputIndex !== -1 && inputRefs.current[firstInputIndex]) {
        inputRefs.current[firstInputIndex]?.focus();
      }
    }, 100);
  };

  // بدء التمرين
  const startExercise = async () => {
    setupExercise();
    setExerciseStarted(true);
    setShowSettings(false);

    if (settings.playAudioOnStart && exerciseWords.length > 0) {
      await playWordAudio(exerciseWords[0]);
    }
  };

  // تشغيل صوت الكلمة
  const playWordAudio = async (word: VocabularyWord) => {
    if (!speechSupported) {
      showNotification('❌ النطق غير متاح في هذا المتصفح. جرب Chrome أو Edge', 'error');
      return;
    }

    if (isPlaying) {
      speechEngine.stop();
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);
      await speechEngine.speak(word.english, {
        rate: 0.8,
        pitch: 1.0,
        volume: 1.0,
        emphasis: true
      });
      setIsPlaying(false);
    } catch (error) {
      setIsPlaying(false);
      console.error('خطأ في تشغيل الصوت:', error);
      showNotification('❌ خطأ في تشغيل الصوت', 'error');
    }
  };

  // العثور على الحقل التالي القابل للتحرير
  const findNextEditableInput = (currentIndex: number): number => {
    for (let i = currentIndex + 1; i < userInputs.length; i++) {
      if (userInputs[i].letter !== ' ' && !userInputs[i].isRevealed) {
        return i;
      }
    }
    return -1;
  };

  // التعامل مع إدخال الحرف
  const handleLetterInput = (index: number, letter: string) => {
    if (!currentWord || userInputs[index].isRevealed) return;

    const newInputs = [...userInputs];
    const correctLetter = currentWord.english[index].toLowerCase();
    const inputLetter = letter.toLowerCase();

    newInputs[index] = {
      letter: letter.toUpperCase(),
      isCorrect: inputLetter === correctLetter,
      isRevealed: false
    };

    setUserInputs(newInputs);

    // إذا كان الحرف صحيحاً، انتقل للحرف التالي
    if (inputLetter === correctLetter) {
      const nextIndex = findNextEditableInput(index);
      if (nextIndex !== -1) {
        setTimeout(() => {
          inputRefs.current[nextIndex]?.focus();
        }, 100);
      }
      
      // إضافة تأثير بصري للحرف الصحيح
      showLetterFeedback(index, true);
    } else {
      // تأثير بصري للحرف الخاطئ
      showLetterFeedback(index, false);
    }

    // التحقق من اكتمال الكلمة
    const allFilled = newInputs.every(input => input.letter !== '' || input.isRevealed);
    if (allFilled) {
      setTimeout(() => {
        checkWordCompletion(newInputs);
      }, 300);
    }
  };

  // إظهار تغذية راجعة بصرية للحرف
  const showLetterFeedback = (index: number, isCorrect: boolean) => {
    const inputElement = inputRefs.current[index];
    if (inputElement) {
      if (isCorrect) {
        inputElement.classList.add('animate-pulse');
        setTimeout(() => {
          inputElement.classList.remove('animate-pulse');
        }, 500);
      } else {
        inputElement.classList.add('animate-shake');
        setTimeout(() => {
          inputElement.classList.remove('animate-shake');
        }, 500);
      }
    }
  };

  // التعامل مع مفاتيح الكيبورد
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // السماح بالانتقال بين الحقول باستخدام الأسهم
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = findNextEditableInput(index);
      if (nextIndex !== -1) {
        inputRefs.current[nextIndex]?.focus();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      for (let i = index - 1; i >= 0; i--) {
        if (userInputs[i].letter !== ' ' && !userInputs[i].isRevealed) {
          inputRefs.current[i]?.focus();
          break;
        }
      }
    } else if (e.key === 'Backspace') {
      // مسح الحرف الحالي والانتقال للحرف السابق
      if (userInputs[index].letter === '') {
        for (let i = index - 1; i >= 0; i--) {
          if (userInputs[i].letter !== ' ' && !userInputs[i].isRevealed) {
            inputRefs.current[i]?.focus();
            break;
          }
        }
      }
    }
  };

  // التحقق من اكتمال الكلمة
  const checkWordCompletion = (inputs: LetterInput[]) => {
    const isCorrect = inputs.every(input => input.isCorrect === true);
    
    if (isCorrect) {
      // كلمة صحيحة
      const points = calculatePoints();
      setScore(prev => prev + points);
      setCorrectWords(prev => prev + 1);
      setCurrentStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) {
          setBestStreak(newStreak);
        }
        return newStreak;
      });
      onScore(points);
      onStreak(true);
      
      showNotification(`✅ ممتاز! +${points} نقطة`, 'success');
      
      setTimeout(() => {
        nextWord();
      }, 1500);
    } else {
      // كلمة خاطئة
      setMistakes(prev => prev + 1);
      setCurrentStreak(0);
      onStreak(false);
      showNotification('❌ حاول مرة أخرى', 'error');
      
      // التركيز على أول حرف خاطئ
      const firstWrongIndex = inputs.findIndex(input => input.isCorrect === false);
      if (firstWrongIndex !== -1) {
        setTimeout(() => {
          inputRefs.current[firstWrongIndex]?.focus();
          inputRefs.current[firstWrongIndex]?.select();
        }, 1000);
      }
    }
  };

  // حساب النقاط
  const calculatePoints = () => {
    let basePoints = 10;
    
    // نقاط إضافية حسب الصعوبة
    if (settings.difficulty === 'medium') basePoints += 5;
    if (settings.difficulty === 'hard') basePoints += 10;
    
    // نقاط إضافية للسلسلة
    basePoints += Math.min(currentStreak * 2, 20);
    
    // خصم نقاط للتلميحات
    basePoints -= hintsUsed * 2;
    
    // نقاط إضافية للسرعة (إذا كان هناك حد زمني)
    if (settings.timeLimit > 0 && timeLeft > settings.timeLimit * 0.5) {
      basePoints += 5;
    }
    
    return Math.max(basePoints, 5);
  };

  // الانتقال للكلمة التالية
  const nextWord = () => {
    if (currentWordIndex + 1 >= exerciseWords.length) {
      completeExercise();
    } else {
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      initializeWordInput(exerciseWords[nextIndex]);
      
      if (settings.playAudioOnStart) {
        setTimeout(() => {
          playWordAudio(exerciseWords[nextIndex]);
        }, 500);
      }
    }
  };

  // تخطي الكلمة
  const skipWord = () => {
    if (!settings.allowSkip) return;
    
    setMistakes(prev => prev + 1);
    setCurrentStreak(0);
    showNotification('⏭️ تم تخطي الكلمة', 'info');
    nextWord();
  };

  // إظهار تلميح
  const showHint = () => {
    if (!settings.showHints) return;
    
    const emptyIndices = userInputs
      .map((input, index) => ({ input, index }))
      .filter(({ input }) => input.letter === '' && !input.isRevealed)
      .map(({ index }) => index);
    
    if (emptyIndices.length > 0) {
      const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      const newInputs = [...userInputs];
      newInputs[randomIndex] = {
        letter: currentWord.english[randomIndex].toUpperCase(),
        isCorrect: true,
        isRevealed: true
      };
      setUserInputs(newInputs);
      setHintsUsed(prev => prev + 1);
      showNotification('💡 تلميح مستخدم', 'info');
      
      // التركيز على الحرف التالي
      const nextIndex = findNextEditableInput(randomIndex);
      if (nextIndex !== -1) {
        setTimeout(() => {
          inputRefs.current[nextIndex]?.focus();
        }, 200);
      }
    }
  };

  // إظهار/إخفاء الكلمة
  const toggleShowWord = () => {
    setShowWord(!showWord);
    if (!showWord) {
      setHintsUsed(prev => prev + 1);
      showNotification('👁️ تم إظهار الكلمة', 'info');
    }
  };

  // إكمال التمرين
  const completeExercise = () => {
    setIsCompleted(true);
    const endTime = new Date();
    const duration = startTime ? (endTime.getTime() - startTime.getTime()) / 1000 : 0;
    
    // حفظ الإحصائيات
    const accuracy = exerciseWords.length > 0 ? (correctWords / exerciseWords.length) * 100 : 0;
    
    showNotification(`🎉 تم إكمال التمرين! دقة: ${accuracy.toFixed(1)}%`, 'success');
  };

  // إعادة بدء التمرين
  const restartExercise = () => {
    setExerciseStarted(false);
    setIsCompleted(false);
    setShowSettings(true);
  };

  // إظهار الإشعارات
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translate(-50%, -100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  // مؤقت العد التنازلي
  useEffect(() => {
    if (exerciseStarted && !isCompleted && settings.timeLimit > 0 && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && settings.timeLimit > 0 && exerciseStarted) {
      completeExercise();
    }
  }, [timeLeft, exerciseStarted, isCompleted, settings.timeLimit]);

  // تنسيق الوقت
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // إذا لم يبدأ التمرين، عرض الإعدادات
  if (!exerciseStarted || showSettings) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-xl p-6">
          <h3 className="text-3xl font-bold text-center mb-2 flex items-center justify-center gap-3">
            <Target className="w-8 h-8" />
            تمرين التهجئة التفاعلي
          </h3>
          <p className="text-center opacity-90">اختبر مهاراتك في تهجئة الكلمات الإنجليزية</p>
        </div>

        <div className="bg-white rounded-b-xl p-8 shadow-xl">
          <h4 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            إعدادات التمرين
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* عدد الكلمات */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                عدد الكلمات ({settings.wordCount})
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={settings.wordCount}
                onChange={(e) => setSettings(prev => ({ ...prev, wordCount: Number(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5</span>
                <span>25</span>
                <span>50</span>
              </div>
            </div>

            {/* مستوى الصعوبة */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                مستوى الصعوبة
              </label>
              <select
                value={settings.difficulty}
                onChange={(e) => setSettings(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              >
                <option value="easy">سهل (كلمات قصيرة)</option>
                <option value="medium">متوسط (جميع الكلمات)</option>
                <option value="hard">صعب (كلمات طويلة)</option>
              </select>
            </div>

            {/* الحد الزمني */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الحد الزمني (ثانية) - {settings.timeLimit === 0 ? 'بدون حد' : settings.timeLimit}
              </label>
              <input
                type="range"
                min="0"
                max="300"
                step="30"
                value={settings.timeLimit}
                onChange={(e) => setSettings(prev => ({ ...prev, timeLimit: Number(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>بدون حد</span>
                <span>2.5 دقيقة</span>
                <span>5 دقائق</span>
              </div>
            </div>

            {/* خيارات إضافية */}
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.showHints}
                  onChange={(e) => setSettings(prev => ({ ...prev, showHints: e.target.checked }))}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-gray-700">إظهار التلميحات</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.playAudioOnStart}
                  onChange={(e) => setSettings(prev => ({ ...prev, playAudioOnStart: e.target.checked }))}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-gray-700">تشغيل الصوت تلقائياً</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.shuffleWords}
                  onChange={(e) => setSettings(prev => ({ ...prev, shuffleWords: e.target.checked }))}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-gray-700">خلط ترتيب الكلمات</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.allowSkip}
                  onChange={(e) => setSettings(prev => ({ ...prev, allowSkip: e.target.checked }))}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-gray-700">السماح بتخطي الكلمات</span>
              </label>
            </div>
          </div>

          {/* معلومات التمرين */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <h5 className="font-bold text-green-800 mb-3">معلومات التمرين:</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-green-700">{Math.min(settings.wordCount, words.length)}</div>
                <div className="text-green-600">كلمة</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-700">{settings.difficulty === 'easy' ? 'سهل' : settings.difficulty === 'medium' ? 'متوسط' : 'صعب'}</div>
                <div className="text-green-600">الصعوبة</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-700">{settings.timeLimit === 0 ? 'بدون حد' : formatTime(settings.timeLimit)}</div>
                <div className="text-green-600">الوقت</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-700">{settings.showHints ? 'متاحة' : 'غير متاحة'}</div>
                <div className="text-green-600">التلميحات</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={startExercise}
              disabled={words.length === 0}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-bold text-xl transition-all hover:scale-105 shadow-lg disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
            >
              <Play className="w-6 h-6" />
              بدء التمرين
            </button>
          </div>
        </div>
      </div>
    );
  }

  // إذا اكتمل التمرين، عرض النتائج
  if (isCompleted) {
    const accuracy = exerciseWords.length > 0 ? (correctWords / exerciseWords.length) * 100 : 0;
    const duration = startTime ? (new Date().getTime() - startTime.getTime()) / 1000 : 0;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-xl p-6">
          <h3 className="text-3xl font-bold text-center mb-2 flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8" />
            نتائج التمرين
          </h3>
          <p className="text-center opacity-90">تهانينا على إكمال تمرين التهجئة!</p>
        </div>

        <div className="bg-white rounded-b-xl p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-green-100 p-6 rounded-xl text-center border border-green-200">
              <div className="text-3xl font-bold text-green-700 mb-2">{score}</div>
              <div className="text-green-600">النقاط الإجمالية</div>
            </div>
            
            <div className="bg-blue-100 p-6 rounded-xl text-center border border-blue-200">
              <div className="text-3xl font-bold text-blue-700 mb-2">{accuracy.toFixed(1)}%</div>
              <div className="text-blue-600">الدقة</div>
            </div>
            
            <div className="bg-purple-100 p-6 rounded-xl text-center border border-purple-200">
              <div className="text-3xl font-bold text-purple-700 mb-2">{bestStreak}</div>
              <div className="text-purple-600">أفضل سلسلة</div>
            </div>
            
            <div className="bg-orange-100 p-6 rounded-xl text-center border border-orange-200">
              <div className="text-3xl font-bold text-orange-700 mb-2">{formatTime(Math.floor(duration))}</div>
              <div className="text-orange-600">الوقت المستغرق</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h5 className="font-bold text-gray-800 mb-4">تفاصيل الأداء:</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex justify-between">
                <span>الكلمات الصحيحة:</span>
                <span className="font-bold text-green-600">{correctWords}</span>
              </div>
              <div className="flex justify-between">
                <span>الأخطاء:</span>
                <span className="font-bold text-red-600">{mistakes}</span>
              </div>
              <div className="flex justify-between">
                <span>التلميحات المستخدمة:</span>
                <span className="font-bold text-blue-600">{hintsUsed}</span>
              </div>
              <div className="flex justify-between">
                <span>إجمالي الكلمات:</span>
                <span className="font-bold text-gray-600">{exerciseWords.length}</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            {accuracy >= 90 && (
              <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4">
                <div className="text-2xl mb-2">🏆</div>
                <div className="font-bold text-yellow-800">أداء ممتاز!</div>
                <div className="text-yellow-700">حققت دقة عالية جداً في التهجئة</div>
              </div>
            )}

            <div className="flex justify-center gap-4">
              <button
                onClick={restartExercise}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                تمرين جديد
              </button>
              
              <button
                onClick={() => setShowSettings(true)}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <Settings className="w-5 h-5" />
                تغيير الإعدادات
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // واجهة التمرين الرئيسية
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header مع الإحصائيات */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <Target className="w-8 h-8" />
            <div>
              <h3 className="text-2xl font-bold">تمرين التهجئة</h3>
              <p className="opacity-90">الكلمة {currentWordIndex + 1} من {exerciseWords.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {settings.timeLimit > 0 && (
              <div className="text-center">
                <div className={`text-2xl font-bold ${timeLeft <= 30 ? 'text-red-300' : ''}`}>
                  <Clock className="w-5 h-5 inline mr-1" />
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm opacity-80">الوقت المتبقي</div>
              </div>
            )}
            
            <div className="text-center">
              <div className="text-2xl font-bold">
                <Zap className="w-5 h-5 inline mr-1" />
                {currentStreak}
              </div>
              <div className="text-sm opacity-80">السلسلة</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold">{score}</div>
              <div className="text-sm opacity-80">النقاط</div>
            </div>
          </div>
        </div>

        {/* شريط التقدم */}
        {settings.showProgress && (
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentWordIndex + 1) / exerciseWords.length) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* منطقة التمرين */}
      <div className="bg-white rounded-b-xl p-8 shadow-xl">
        {currentWord && (
          <>
            {/* معلومات الكلمة */}
            <div className="text-center mb-8">
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button
                    onClick={() => playWordAudio(currentWord)}
                    disabled={isPlaying || !speechSupported}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white p-4 rounded-full transition-all hover:scale-110 shadow-lg"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-700 mb-1">استمع وتهجى:</div>
                    <div className="text-2xl font-bold text-blue-700">{currentWord.arabic}</div>
                    {currentWord.pronunciation && (
                      <div className="text-sm text-gray-500 font-mono mt-1">{currentWord.pronunciation}</div>
                    )}
                  </div>
                </div>

                {/* إظهار الكلمة (اختياري) */}
                {showWord && (
                  <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4">
                    <div className="text-yellow-800 font-bold text-xl" dir="ltr">{currentWord.english}</div>
                  </div>
                )}
              </div>
            </div>

            {/* منطقة إدخال الحروف - اتجاه من اليسار إلى اليمين */}
            <div className="flex justify-center mb-8">
              <div className="flex gap-2 flex-wrap justify-center max-w-4xl" dir="ltr">
                {userInputs.map((input, index) => (
                  <div key={index} className="relative">
                    {input.letter === ' ' ? (
                      <div className="w-4 h-16 flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          maxLength={1}
                          value={input.letter}
                          onChange={(e) => handleLetterInput(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          disabled={input.isRevealed}
                          className={`w-16 h-16 text-center text-2xl font-bold border-4 rounded-xl transition-all focus:outline-none ${
                            input.isRevealed
                              ? 'bg-blue-100 border-blue-400 text-blue-700'
                              : input.isCorrect === true
                              ? 'bg-green-100 border-green-400 text-green-700'
                              : input.isCorrect === false
                              ? 'bg-red-100 border-red-400 text-red-700 animate-shake'
                              : 'bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                          }`}
                        />
                        
                        {/* خط تحت الحرف */}
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 rounded"></div>
                        
                        {/* رقم الموضع */}
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-semibold">
                          {index + 1}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => playWordAudio(currentWord)}
                disabled={isPlaying || !speechSupported}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <Volume2 className="w-5 h-5" />
                {isPlaying ? 'جاري التشغيل...' : 'استمع للكلمة'}
              </button>

              {settings.showHints && (
                <button
                  onClick={showHint}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  💡 تلميح
                </button>
              )}

              <button
                onClick={toggleShowWord}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
              >
                {showWord ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                {showWord ? 'إخفاء الكلمة' : 'إظهار الكلمة'}
              </button>

              {settings.allowSkip && (
                <button
                  onClick={skipWord}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  تخطي
                </button>
              )}

              <button
                onClick={() => setShowSettings(true)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <Settings className="w-5 h-5" />
                الإعدادات
              </button>
            </div>

            {/* نصائح */}
            <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
              <h5 className="font-bold text-green-800 mb-3">💡 نصائح للتهجئة:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
                <div className="flex items-center gap-2">
                  <span>🎧</span>
                  <span>استمع للكلمة عدة مرات</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⌨️</span>
                  <span>استخدم الأسهم للتنقل بين الحروف</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔤</span>
                  <span>فكر في الأصوات التي تسمعها</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⚡</span>
                  <span>الانتقال التلقائي للحرف التالي عند الصحة</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📝</span>
                  <span>ابدأ بالحروف التي تعرفها</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💡</span>
                  <span>استخدم التلميحات عند الحاجة</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SpellingExercise;