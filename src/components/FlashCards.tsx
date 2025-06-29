import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle, XCircle, RotateCcw, Star, Trophy, Target, Zap, Award, Clock, Settings } from 'lucide-react';
import { VocabularyWord } from '../types';
import { speechEngine } from '../utils/speechEngine';

interface FlashCardsProps {
  words: VocabularyWord[];
  onScore: (points: number) => void;
  onStreak: (increment: boolean) => void;
}

interface WordProgress {
  word: VocabularyWord;
  pronunciationAttempts: number;
  spellingAttempts: number;
  usageAttempts: number;
  grammarAttempts: number;
  pronunciationCorrect: number;
  spellingCorrect: number;
  usageCorrect: number;
  grammarCorrect: number;
  overallMastery: number;
  lastReviewed: Date;
}

const FlashCards: React.FC<FlashCardsProps> = ({ words, onScore, onStreak }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [currentStage, setCurrentStage] = useState<'pronunciation' | 'spelling' | 'usage' | 'grammar'>('pronunciation');
  const [wordProgress, setWordProgress] = useState<Map<string, WordProgress>>(new Map());
  const [sessionComplete, setSessionComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [settings, setSettings] = useState({
    autoAdvance: true,
    showHints: true,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard'
  });

  const currentWord = words[currentIndex];
  const totalWords = words.length;
  const completedWords = Array.from(wordProgress.values()).filter(p => p.overallMastery >= 80).length;

  useEffect(() => {
    const initializeSpeech = async () => {
      try {
        await speechEngine.initialize();
        setSpeechSupported(speechEngine.isSupported());
      } catch (error) {
        setSpeechSupported(false);
      }
    };
    initializeSpeech();
  }, []);

  useEffect(() => {
    // Initialize progress for all words
    words.forEach(word => {
      if (!wordProgress.has(word.english)) {
        wordProgress.set(word.english, {
          word,
          pronunciationAttempts: 0,
          spellingAttempts: 0,
          usageAttempts: 0,
          grammarAttempts: 0,
          pronunciationCorrect: 0,
          spellingCorrect: 0,
          usageCorrect: 0,
          grammarCorrect: 0,
          overallMastery: 0,
          lastReviewed: new Date()
        });
      }
    });
  }, [words]);

  const playPronunciation = async () => {
    if (!speechSupported || !currentWord) return;

    if (isPlaying) {
      speechEngine.stop();
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);
      await speechEngine.speak(currentWord.english, {
        rate: 0.8,
        pitch: 1.0,
        volume: 1.0,
        emphasis: true
      });
      setIsPlaying(false);
    } catch (error) {
      setIsPlaying(false);
      console.error('Error playing pronunciation:', error);
    }
  };

  const updateWordProgress = (correct: boolean) => {
    if (!currentWord) return;

    const progress = wordProgress.get(currentWord.english);
    if (!progress) return;

    // Update attempts and correct answers for current stage
    switch (currentStage) {
      case 'pronunciation':
        progress.pronunciationAttempts++;
        if (correct) progress.pronunciationCorrect++;
        break;
      case 'spelling':
        progress.spellingAttempts++;
        if (correct) progress.spellingCorrect++;
        break;
      case 'usage':
        progress.usageAttempts++;
        if (correct) progress.usageCorrect++;
        break;
      case 'grammar':
        progress.grammarAttempts++;
        if (correct) progress.grammarCorrect++;
        break;
    }

    // Calculate overall mastery
    const stages = ['pronunciation', 'spelling', 'usage', 'grammar'] as const;
    let totalMastery = 0;
    let stagesWithAttempts = 0;

    stages.forEach(stage => {
      const attempts = progress[`${stage}Attempts` as keyof WordProgress] as number;
      const correct = progress[`${stage}Correct` as keyof WordProgress] as number;
      if (attempts > 0) {
        totalMastery += (correct / attempts) * 100;
        stagesWithAttempts++;
      }
    });

    progress.overallMastery = stagesWithAttempts > 0 ? totalMastery / stagesWithAttempts : 0;
    progress.lastReviewed = new Date();

    setWordProgress(new Map(wordProgress));
  };

  const handleCorrect = () => {
    updateWordProgress(true);
    const newScore = score + getStagePoints();
    const newStreak = streak + 1;
    
    setScore(newScore);
    setStreak(newStreak);
    setBestStreak(Math.max(bestStreak, newStreak));
    
    onScore(getStagePoints());
    onStreak(true);

    if (settings.autoAdvance) {
      setTimeout(nextStage, 1000);
    }
  };

  const handleIncorrect = () => {
    updateWordProgress(false);
    setStreak(0);
    onStreak(false);

    if (settings.autoAdvance) {
      setTimeout(nextStage, 1500);
    }
  };

  const getStagePoints = () => {
    const basePoints = {
      pronunciation: 10,
      spelling: 15,
      usage: 20,
      grammar: 25
    };
    
    const difficultyMultiplier = {
      easy: 1,
      medium: 1.2,
      hard: 1.5
    };

    return Math.round(basePoints[currentStage] * difficultyMultiplier[settings.difficulty]);
  };

  const nextStage = () => {
    const stages: Array<typeof currentStage> = ['pronunciation', 'spelling', 'usage', 'grammar'];
    const currentStageIndex = stages.indexOf(currentStage);
    
    if (currentStageIndex < stages.length - 1) {
      setCurrentStage(stages[currentStageIndex + 1]);
      setShowAnswer(false);
    } else {
      nextWord();
    }
  };

  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentStage('pronunciation');
      setShowAnswer(false);
    } else {
      setSessionComplete(true);
    }
  };

  const restartSession = () => {
    setCurrentIndex(0);
    setCurrentStage('pronunciation');
    setShowAnswer(false);
    setScore(0);
    setStreak(0);
    setSessionComplete(false);
    setWordProgress(new Map());
  };

  const getStageTitle = () => {
    const titles = {
      pronunciation: '🔊 النطق',
      spelling: '✍️ التهجئة',
      usage: '📝 الاستخدام',
      grammar: '📚 القواعد'
    };
    return titles[currentStage];
  };

  const getStageDescription = () => {
    const descriptions = {
      pronunciation: 'استمع للكلمة وكررها',
      spelling: 'تهجى الكلمة بشكل صحيح',
      usage: 'استخدم الكلمة في جملة',
      grammar: 'حدد نوع الكلمة النحوي'
    };
    return descriptions[currentStage];
  };

  const renderStageContent = () => {
    if (!currentWord) return null;

    switch (currentStage) {
      case 'pronunciation':
        return (
          <div className="text-center space-y-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="text-xl font-bold text-blue-800 mb-4">استمع ونطق الكلمة</h4>
              <div className="text-3xl font-bold mb-4" dir="ltr">{currentWord.english}</div>
              <div className="text-lg text-gray-600 mb-4">{currentWord.arabic}</div>
              <button
                onClick={playPronunciation}
                disabled={!speechSupported}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                <Volume2 className="w-5 h-5" />
                {isPlaying ? 'جاري التشغيل...' : 'استمع للنطق'}
              </button>
            </div>
            {!showAnswer && (
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowAnswer(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  أظهر النطق الصوتي
                </button>
              </div>
            )}
            {showAnswer && (
              <div className="bg-green-50 rounded-xl p-6">
                <div className="text-lg font-mono mb-4" dir="ltr">{currentWord.pronunciation}</div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleCorrect}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    نطقت بشكل صحيح
                  </button>
                  <button
                    onClick={handleIncorrect}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    أحتاج مزيد من التدريب
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'spelling':
        return (
          <div className="text-center space-y-6">
            <div className="bg-purple-50 rounded-xl p-6">
              <h4 className="text-xl font-bold text-purple-800 mb-4">تهجى الكلمة</h4>
              <div className="text-lg text-gray-600 mb-4">{currentWord.arabic}</div>
              <button
                onClick={playPronunciation}
                disabled={!speechSupported}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto mb-4"
              >
                <Volume2 className="w-4 h-4" />
                استمع
              </button>
            </div>
            {!showAnswer && (
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowAnswer(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  أظهر التهجئة
                </button>
              </div>
            )}
            {showAnswer && (
              <div className="bg-green-50 rounded-xl p-6">
                <div className="text-2xl font-bold mb-4 font-mono" dir="ltr">{currentWord.english}</div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleCorrect}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    هجيت بشكل صحيح
                  </button>
                  <button
                    onClick={handleIncorrect}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    أحتاج مزيد من التدريب
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'usage':
        return (
          <div className="text-center space-y-6">
            <div className="bg-green-50 rounded-xl p-6">
              <h4 className="text-xl font-bold text-green-800 mb-4">استخدم الكلمة في جملة</h4>
              <div className="text-2xl font-bold mb-2" dir="ltr">{currentWord.english}</div>
              <div className="text-lg text-gray-600 mb-4">{currentWord.arabic}</div>
            </div>
            {!showAnswer && (
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowAnswer(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  أظهر مثال
                </button>
              </div>
            )}
            {showAnswer && (
              <div className="bg-green-50 rounded-xl p-6">
                <div className="text-lg mb-4" dir="ltr">{currentWord.exampleSentence}</div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleCorrect}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    فهمت الاستخدام
                  </button>
                  <button
                    onClick={handleIncorrect}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    أحتاج مزيد من الأمثلة
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'grammar':
        return (
          <div className="text-center space-y-6">
            <div className="bg-orange-50 rounded-xl p-6">
              <h4 className="text-xl font-bold text-orange-800 mb-4">ما نوع هذه الكلمة؟</h4>
              <div className="text-2xl font-bold mb-2" dir="ltr">{currentWord.english}</div>
              <div className="text-lg text-gray-600 mb-4">{currentWord.arabic}</div>
            </div>
            {!showAnswer && (
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowAnswer(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  أظهر نوع الكلمة
                </button>
              </div>
            )}
            {showAnswer && (
              <div className="bg-green-50 rounded-xl p-6">
                <div className="text-lg mb-4">
                  نوع الكلمة: <span className="font-bold">{currentWord.partOfSpeech}</span>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleCorrect}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    عرفت النوع
                  </button>
                  <button
                    onClick={handleIncorrect}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    أحتاج مراجعة القواعد
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (sessionComplete) {
    const accuracy = totalWords > 0 ? (completedWords / totalWords) * 100 : 0;
    
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-3xl font-bold mb-4">🎉 انتهت الجلسة!</h3>
          <div className="grid grid-cols-2 gap-4 text-lg">
            <div>
              <div className="text-2xl font-bold">{score}</div>
              <div className="text-sm opacity-80">النقاط الإجمالية</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{accuracy.toFixed(1)}%</div>
              <div className="text-sm opacity-80">الدقة</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{bestStreak}</div>
              <div className="text-sm opacity-80">أفضل سلسلة</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{completedWords}</div>
              <div className="text-sm opacity-80">كلمات متقنة</div>
            </div>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <button
            onClick={restartSession}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
          >
            <RotateCcw className="w-5 h-5 inline mr-2" />
            جلسة جديدة
          </button>
        </div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8 text-center">
        <div className="text-gray-500">لا توجد كلمات متاحة</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">🎴 بطاقات المراجعة التفاعلية</h3>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold">{score}</div>
              <div className="text-xs opacity-80">النقاط</div>
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
        
        <div className="flex justify-between items-center text-sm opacity-90 mb-4">
          <span>الكلمة {currentIndex + 1} من {totalWords}</span>
          <span>{getStageTitle()}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalWords) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-b-xl p-8">
        <div className="text-center mb-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-2">{getStageTitle()}</h4>
          <p className="text-gray-600">{getStageDescription()}</p>
        </div>

        {renderStageContent()}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
                setCurrentStage('pronunciation');
                setShowAnswer(false);
              }
            }}
            disabled={currentIndex === 0}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
          >
            الكلمة السابقة
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-600">المرحلة الحالية</div>
            <div className="flex gap-2 mt-1">
              {['pronunciation', 'spelling', 'usage', 'grammar'].map((stage, index) => (
                <div
                  key={stage}
                  className={`w-3 h-3 rounded-full ${
                    stage === currentStage ? 'bg-purple-600' : 
                    ['pronunciation', 'spelling', 'usage', 'grammar'].indexOf(currentStage) > index ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={nextStage}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {currentStage === 'grammar' ? 'الكلمة التالية' : 'المرحلة التالية'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashCards;