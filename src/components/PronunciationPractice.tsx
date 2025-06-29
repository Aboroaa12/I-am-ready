import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle, XCircle, Play, Pause, Settings, Award, Headphones } from 'lucide-react';
import { speechEngine } from '../utils/speechEngine';

interface PronunciationPracticeProps {
  onScore: (points: number) => void;
}

const pronunciationGroups = [
  {
    sound: '/eə/',
    description: 'صوت الـ eə كما في hair',
    arabicDescription: 'صوت مركب من "إ" و "أ" مع إطالة خفيفة',
    words: [
      { word: 'hair', phonetic: '/heə/', arabic: 'شعر', difficulty: 'easy' },
      { word: 'fair', phonetic: '/feə/', arabic: 'عادل / فاتح', difficulty: 'easy' },
      { word: 'chair', phonetic: '/tʃeə/', arabic: 'كرسي', difficulty: 'medium' },
      { word: 'there', phonetic: '/ðeə/', arabic: 'هناك', difficulty: 'medium' }
    ]
  },
  {
    sound: '/eɪ/',
    description: 'صوت الـ eɪ كما في today',
    arabicDescription: 'صوت مركب من "إي" مع انتقال إلى "ي"',
    words: [
      { word: 'today', phonetic: '/təˈdeɪ/', arabic: 'اليوم', difficulty: 'easy' },
      { word: 'eight', phonetic: '/eɪt/', arabic: 'ثمانية', difficulty: 'easy' },
      { word: 'grey', phonetic: '/ɡreɪ/', arabic: 'رمادي', difficulty: 'medium' },
      { word: 'painting', phonetic: '/ˈpeɪntɪŋ/', arabic: 'رسم', difficulty: 'hard' }
    ]
  }
];

const PronunciationPractice: React.FC<PronunciationPracticeProps> = ({ onScore }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voiceInfo, setVoiceInfo] = useState<any>(null);
  const [practiceMode, setPracticeMode] = useState<'normal' | 'slow' | 'repeat'>('normal');
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set());

  useEffect(() => {
    const initializeSpeech = async () => {
      try {
        await speechEngine.initialize();
        setSpeechSupported(speechEngine.isSupported());
        if (speechEngine.isSupported()) {
          setVoiceInfo(speechEngine.getBestVoiceInfo());
          console.log('تم تهيئة نظام النطق في تمرين النطق');
        }
      } catch (error) {
        setSpeechSupported(false);
        console.error('فشل في تهيئة النطق:', error);
      }
    };

    initializeSpeech();
  }, []);

  const playPronunciation = async (word: string, options: { slow?: boolean; repeat?: boolean } = {}) => {
    if (!speechSupported) {
      showNotification('❌ النطق غير متاح في هذا المتصفح. جرب Chrome أو Edge', 'error');
      return;
    }

    if (currentlyPlaying === word) {
      speechEngine.stop();
      setCurrentlyPlaying(null);
      return;
    }

    try {
      setCurrentlyPlaying(word);
      
      const speechOptions = {
        slow: options.slow || practiceMode === 'slow',
        emphasis: true,
        rate: options.slow ? 0.5 : practiceMode === 'slow' ? 0.6 : 0.85,
        pitch: voiceInfo?.quality === 'premium' ? 1.1 : 1.05,
        volume: 1.0
      };

      await speechEngine.speak(word, speechOptions);
      
      // إذا كان في وضع التكرار، كرر الكلمة
      if (options.repeat || practiceMode === 'repeat') {
        await new Promise(resolve => setTimeout(resolve, 800));
        await speechEngine.speak(word, { ...speechOptions, rate: speechOptions.rate * 0.8 });
      }
      
      setCurrentlyPlaying(null);
      setCompletedWords(prev => new Set([...prev, word]));
      onScore(3);
      
      // رسائل تشجيعية متقدمة
      const encouragements = [
        `🎯 ${word} - نطق ممتاز!`,
        `🔊 استمع جيداً لـ ${word}`,
        `⭐ ${word} - أحسنت الاستماع!`,
        `🎵 نطق ${word} واضح ومفهوم!`
      ];
      
      const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      showNotification(randomEncouragement, 'success');
      
    } catch (error) {
      setCurrentlyPlaying(null);
      showNotification('❌ خطأ في تشغيل الصوت', 'error');
      console.error('خطأ في النطق:', error);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold max-w-md text-center`;
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
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
            <Headphones className="w-8 h-8" />
            تمرين النطق
          </h3>
          <p className="opacity-90 text-lg">تدرب على نطق الكلمات الإنجليزية</p>
        </div>
      </div>

      {/* Practice Mode Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          وضع التدريب:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setPracticeMode('normal')}
            className={`p-4 rounded-xl border-2 transition-all ${
              practiceMode === 'normal' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <Volume2 className="w-6 h-6 mx-auto mb-2" />
            <div className="font-semibold">نطق عادي</div>
            <div className="text-sm opacity-70">سرعة طبيعية</div>
          </button>
          
          <button
            onClick={() => setPracticeMode('slow')}
            className={`p-4 rounded-xl border-2 transition-all ${
              practiceMode === 'slow' 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <Play className="w-6 h-6 mx-auto mb-2" />
            <div className="font-semibold">نطق بطيء</div>
            <div className="text-sm opacity-70">للتعلم والتركيز</div>
          </button>
          
          <button
            onClick={() => setPracticeMode('repeat')}
            className={`p-4 rounded-xl border-2 transition-all ${
              practiceMode === 'repeat' 
                ? 'border-purple-500 bg-purple-50 text-purple-700' 
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <Award className="w-6 h-6 mx-auto mb-2" />
            <div className="font-semibold">تكرار مزدوج</div>
            <div className="text-sm opacity-70">نطق مرتين للحفظ</div>
          </button>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6">
        <h4 className="font-bold text-gray-800 mb-4">📊 تقدمك في التدريب:</h4>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-white rounded-full h-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
              style={{ width: `${(completedWords.size / 8) * 100}%` }}
            ></div>
          </div>
          <span className="font-bold text-gray-700">
            {completedWords.size} / 8 كلمة
          </span>
        </div>
      </div>

      {/* Pronunciation Groups */}
      <div className="space-y-6">
        {pronunciationGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6">
              <h4 className="text-2xl font-bold mb-2">{group.sound}</h4>
              <p className="text-lg opacity-90 mb-2">{group.description}</p>
              <p className="text-sm opacity-80">{group.arabicDescription}</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {group.words.map((item, wordIndex) => (
                  <button
                    key={wordIndex}
                    onClick={() => playPronunciation(item.word)}
                    disabled={currentlyPlaying === item.word}
                    className={`w-full bg-gradient-to-br from-blue-500 to-indigo-600 hover:scale-105 disabled:scale-100 disabled:opacity-70 text-white p-6 rounded-xl font-semibold transition-all shadow-md relative overflow-hidden ${
                      currentlyPlaying === item.word ? 'animate-pulse' : ''
                    } ${completedWords.has(item.word) ? 'ring-4 ring-green-300' : ''}`}
                  >
                    {/* Difficulty Badge */}
                    <div className="absolute top-2 right-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                      {item.difficulty === 'easy' ? '🟢 سهل' : 
                       item.difficulty === 'medium' ? '🟡 متوسط' : '🔴 صعب'}
                    </div>
                    
                    {/* Completed Badge */}
                    {completedWords.has(item.word) && (
                      <div className="absolute top-2 left-2 text-green-300">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-2 mb-3">
                      {currentlyPlaying === item.word ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span className="text-sm">يتم التشغيل...</span>
                        </div>
                      ) : (
                        <>
                          <Volume2 className="w-6 h-6" />
                          <span className="text-xl font-bold">{item.word}</span>
                        </>
                      )}
                    </div>
                    
                    <div className="text-sm opacity-90 font-mono bg-white/20 px-3 py-1 rounded mb-2">
                      {item.phonetic}
                    </div>
                    
                    <div className="text-sm opacity-90 font-medium">
                      {item.arabic}
                    </div>

                    {/* Practice Mode Indicator */}
                    <div className="absolute bottom-2 left-2 text-xs opacity-70">
                      {practiceMode === 'slow' && '🐌'}
                      {practiceMode === 'repeat' && '🔄'}
                      {practiceMode === 'normal' && '⚡'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Practice Tips */}
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
        <h5 className="font-bold text-green-800 mb-3 flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          نصائح للتدريب على النطق:
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
          <div className="flex items-center gap-2">
            <span>🎧</span>
            <span>استمع للكلمة عدة مرات</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔄</span>
            <span>كرر النطق بصوت عالٍ</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🐌</span>
            <span>استخدم الوضع البطيء للكلمات الصعبة</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📝</span>
            <span>اكتب الكلمة كما تسمعها</span>
          </div>
        </div>
      </div>

      {/* Audio System Info */}
      {!speechSupported && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
          <h4 className="font-bold text-red-800 mb-3 text-xl">⚠️ تحسين تجربة الصوت</h4>
          <p className="text-red-700 mb-4">
            للحصول على أفضل جودة صوت، استخدم أحد المتصفحات التالية:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg border border-red-200">
              <div className="font-bold">Chrome</div>
              <div className="text-green-600">🏆 الأفضل</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-red-200">
              <div className="font-bold">Edge</div>
              <div className="text-green-600">⭐ ممتاز</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-red-200">
              <div className="font-bold">Safari</div>
              <div className="text-yellow-600">👍 جيد</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-red-200">
              <div className="font-bold">Firefox</div>
              <div className="text-orange-600">📢 محدود</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PronunciationPractice;