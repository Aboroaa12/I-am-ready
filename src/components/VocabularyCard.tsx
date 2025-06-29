import React, { useState, useEffect } from 'react';
import { Volume2, RotateCcw, Play, Pause, VolumeX, Settings, Star, BookOpen, Zap, Award, Eye, EyeOff, Shuffle } from 'lucide-react';
import { VocabularyWord } from '../types';
import { speechEngine } from '../utils/speechEngine';

interface VocabularyCardProps {
  word: VocabularyWord;
  onPronounce?: () => void;
}

const VocabularyCard: React.FC<VocabularyCardProps> = ({ word, onPronounce }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voiceInfo, setVoiceInfo] = useState<any>(null);
  const [showVoiceInfo, setShowVoiceInfo] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [showPronunciation, setShowPronunciation] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const initializeSpeech = async () => {
      try {
        await speechEngine.initialize();
        const supported = speechEngine.isSupported();
        setSpeechSupported(supported);
        if (supported) {
          setVoiceInfo(speechEngine.getBestVoiceInfo());
          console.log('تم تهيئة نظام النطق في البطاقة');
        } else {
          setSpeechError('النطق غير متاح في هذا المتصفح');
        }
      } catch (error) {
        console.error('فشل في تهيئة النطق:', error);
        setSpeechSupported(false);
        setSpeechError('النطق غير متاح في هذا المتصفح');
      }
    };

    initializeSpeech();
  }, []);

  const handleFlip = () => {
    if (isFlipping) return; // منع القلب المتعدد
    
    setIsFlipping(true);
    setIsFlipped(!isFlipped);
    
    // إعادة تعيين حالة القلب بعد انتهاء الانتقال
    setTimeout(() => {
      setIsFlipping(false);
    }, 1200); // مدة أطول من الانتقال للتأكد
  };

  const handlePronounce = async (e: React.MouseEvent, slow: boolean = false) => {
    e.stopPropagation();
    
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
      setSpeechError(null);
      
      const wordToSpeak = word.english;
      console.log(`نطق الكلمة في البطاقة: ${wordToSpeak} - الترجمة: ${word.arabic} - الوحدة: ${word.unit}`);
      
      await speechEngine.speak(wordToSpeak, {
        slow,
        emphasis: true,
        rate: slow ? 0.6 : 0.85,
        pitch: 1.0,
        volume: 1.0
      });
      
      setIsPlaying(false);
      setPlayCount(prev => prev + 1);
      onPronounce?.();
      
      const encouragements = [
        `🎯 ${wordToSpeak} - نطق ممتاز!`,
        `🔊 استمع جيداً لـ ${wordToSpeak}`,
        `⭐ كرر نطق ${wordToSpeak}`,
        `🎵 ${wordToSpeak} - أحسنت الاستماع!`,
        `🏆 ${wordToSpeak} - تحسن رائع في النطق!`
      ];
      
      const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      showNotification(randomEncouragement, 'success');
      
    } catch (error) {
      setIsPlaying(false);
      console.error('خطأ في النطق:', error);
      setSpeechError('فشل في تشغيل النطق');
      
      // Handle specific timeout error
      if (error instanceof Error && error.message === 'Speech timeout') {
        showNotification('❌ خطأ في تشغيل الصوت: انتهت المهلة. يرجى التحقق من اتصال الإنترنت أو تجربة متصفح آخر (مثل Chrome أو Edge)', 'error');
      } else {
        showNotification('❌ خطأ في تشغيل الصوت. تأكد من أن المتصفح يدعم النطق', 'error');
      }
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-rose-500' : 'bg-sky-500';
    
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold text-sm`;
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

  const getVoiceQualityBadge = () => {
    if (!voiceInfo) return null;
    
    const qualityColors = {
      premium: 'bg-gradient-to-r from-violet-500 to-purple-500',
      high: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      medium: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      low: 'bg-slate-500'
    };

    const qualityLabels = {
      premium: '🏆',
      high: '⭐',
      medium: '👍',
      low: '📢'
    };

    return (
      <div className={`${qualityColors[voiceInfo.quality]} text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
        <span>{qualityLabels[voiceInfo.quality]}</span>
      </div>
    );
  };

  const getPartOfSpeechIcon = () => {
    const icons = {
      'noun': '📦',
      'verb': '⚡',
      'adjective': '🎨',
      'adverb': '🔄',
      'preposition': '🔗',
      'pronoun': '👤',
      'conjunction': '🤝',
      'interjection': '💬'
    };
    return icons[word.partOfSpeech as keyof typeof icons] || '📝';
  };

  const getDifficultyColor = () => {
    const colors = {
      'easy': 'from-green-400 to-emerald-500',
      'medium': 'from-yellow-400 to-orange-500',
      'hard': 'from-red-400 to-pink-500'
    };
    return colors[word.difficulty as keyof typeof colors] || 'from-blue-400 to-indigo-500';
  };

  // تقصير المثال إذا كان طويلاً
  const formatExampleSentence = (sentence: string) => {
    if (!sentence) return '';
    
    // إذا كان المثال أطول من 50 حرف، قم بتقصيره أكثر
    if (sentence.length > 50) {
      const words = sentence.split(' ');
      let shortened = '';
      for (const word of words) {
        if ((shortened + word).length > 45) break;
        shortened += (shortened ? ' ' : '') + word;
      }
      return shortened + '...';
    }
    return sentence;
  };

  // دالة محسنة لتمييز الكلمة المستهدفة في المثال - إصلاح نهائي للتكرار
  const highlightTargetWordInExample = (sentence: string, targetWord: string) => {
    if (!sentence || !targetWord) return sentence;
    
    // تنظيف الكلمة المستهدفة من أي أحرف خاصة
    const cleanTargetWord = targetWord.trim().toLowerCase();
    
    // إنشاء regex للبحث عن الكلمة كاملة فقط (مع تجاهل حالة الأحرف)
    const regex = new RegExp(`\\b(${cleanTargetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi');
    
    // تقسيم الجملة باستخدام regex مع الاحتفاظ بالكلمات المطابقة
    const parts = sentence.split(regex);
    
    const result = [];
    let isMatch = false;
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      if (part && part.toLowerCase() === cleanTargetWord) {
        // هذا جزء مطابق للكلمة المستهدفة
        result.push(
          <span 
            key={`highlight-${i}`} 
            className="bg-yellow-400 text-black px-1 py-0.5 rounded font-bold shadow-sm animate-pulse mx-0.5"
            style={{
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              boxShadow: '0 2px 4px rgba(255,255,0,0.3)',
              display: 'inline-block'
            }}
          >
            {part}
          </span>
        );
        isMatch = true;
      } else if (part) {
        // هذا نص عادي
        result.push(
          <span key={`text-${i}`} className="text-white">
            {part}
          </span>
        );
      }
    }
    
    return result.length > 0 ? result : <span className="text-white">{sentence}</span>;
  };

  // التأكد من عرض البيانات الصحيحة للكلمة
  const displayWord = word.english;
  const displayTranslation = word.arabic;
  const displayPronunciation = word.pronunciation;
  const displayUnit = word.unit;
  const displayExample = formatExampleSentence(word.exampleSentence || '');

  // التحقق من صحة البيانات
  if (!displayWord || !displayTranslation) {
    console.error('بيانات الكلمة غير صحيحة:', word);
    return null;
  }

  return (
    <div className="perspective-1000 h-64 relative group">
      {/* Enhanced Header Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {voiceInfo && getVoiceQualityBadge()}
        {word.difficulty && (
          <div className={`bg-gradient-to-r ${getDifficultyColor()} text-white px-2 py-1 rounded-full text-xs font-bold`}>
            {word.difficulty === 'easy' ? '🟢' : word.difficulty === 'medium' ? '🟡' : '🔴'}
          </div>
        )}
      </div>

      {/* Play Count Badge */}
      {playCount > 0 && (
        <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Zap className="w-3 h-3" />
          {playCount}
        </div>
      )}

      {/* Voice Info Toggle */}
      {speechSupported && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowVoiceInfo(!showVoiceInfo);
          }}
          className="absolute bottom-2 right-2 z-10 bg-white/20 hover:bg-white/30 text-white p-1 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <Settings className="w-3 h-3" />
        </button>
      )}

      {/* Enhanced Voice Information Panel */}
      {showVoiceInfo && voiceInfo && (
        <div className="absolute top-12 right-2 z-20 bg-white rounded-xl shadow-2xl p-4 text-xs border-2 border-slate-200 min-w-48 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            معلومات الصوت
          </div>
          <div className="space-y-2 text-slate-600">
            <div className="flex justify-between">
              <strong>المزود:</strong> 
              <span className="text-blue-600">{voiceInfo.provider}</span>
            </div>
            <div className="flex justify-between">
              <strong>الجودة:</strong> 
              <span className={`font-semibold ${
                voiceInfo.quality === 'premium' ? 'text-purple-600' :
                voiceInfo.quality === 'high' ? 'text-blue-600' :
                voiceInfo.quality === 'medium' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {voiceInfo.quality === 'premium' ? 'فائقة' :
                 voiceInfo.quality === 'high' ? 'عالية' :
                 voiceInfo.quality === 'medium' ? 'جيدة' : 'أساسية'}
              </span>
            </div>
            <div className="flex justify-between">
              <strong>اللهجة:</strong> 
              <span className="text-indigo-600">{voiceInfo.accent}</span>
            </div>
            <div className="flex justify-between">
              <strong>النوع:</strong> 
              <span className="text-pink-600">{voiceInfo.gender === 'female' ? 'أنثى' : 'ذكر'}</span>
            </div>
          </div>
        </div>
      )}

      <div 
        className={`relative w-full h-full transform-style-preserve-3d transition-all duration-1000 ease-in-out cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        } ${isFlipping ? 'pointer-events-none' : ''}`}
        onClick={handleFlip}
      >
        {/* Enhanced Front - الكلمة الإنجليزية */}
        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-xl p-4 text-white flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-600 overflow-hidden">
          {/* Top Section - Word and Part of Speech */}
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="flex items-center justify-center gap-2 mb-3 animate-in fade-in duration-700">
              <span className="text-2xl">{getPartOfSpeechIcon()}</span>
              <div className="text-xl font-bold leading-tight break-words max-w-full">
                {displayWord}
              </div>
            </div>
            {word.partOfSpeech && (
              <div className="text-xs opacity-75 bg-white/20 px-2 py-1 rounded-full mb-3 animate-in slide-in-from-bottom duration-700 delay-200">
                {word.partOfSpeech}
              </div>
            )}

            {/* Pronunciation Section */}
            {displayPronunciation && (
              <div className="mb-3 animate-in slide-in-from-bottom duration-700 delay-300">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPronunciation(!showPronunciation);
                  }}
                  className="text-xs opacity-90 font-mono bg-white/20 px-2 py-1 rounded-lg hover:bg-white/30 transition-all duration-300 flex items-center gap-1"
                >
                  {showPronunciation ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span className="transition-all duration-300">
                    {showPronunciation ? displayPronunciation : 'النطق'}
                  </span>
                </button>
              </div>
            )}
          </div>
          
          {/* Middle Section - Audio Controls */}
          <div className="flex justify-center gap-2 mb-3 animate-in slide-in-from-bottom duration-700 delay-400">
            <button
              onClick={(e) => handlePronounce(e, false)}
              disabled={!speechSupported}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm font-semibold ${
                speechSupported 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg' 
                  : 'bg-gray-500/50 cursor-not-allowed'
              } ${isPlaying ? 'animate-pulse bg-gradient-to-r from-purple-500 to-pink-500' : ''}`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>إيقاف</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>عادي</span>
                </>
              )}
            </button>

            <button
              onClick={(e) => handlePronounce(e, true)}
              disabled={!speechSupported || isPlaying}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm font-semibold ${
                speechSupported && !isPlaying
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg' 
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
            >
              <Play className="w-3 h-3" />
              <span>بطيء</span>
            </button>
          </div>

          {/* Bottom Section - Error/Status and Unit */}
          <div className="space-y-2 animate-in slide-in-from-bottom duration-700 delay-500">
            {/* Error Message */}
            {speechError && (
              <div className="text-xs text-red-300 text-center bg-red-500/20 px-2 py-1 rounded-lg animate-in fade-in duration-300">
                {speechError}
              </div>
            )}

            {!speechSupported && (
              <div className="text-xs opacity-80 text-center bg-red-500/20 px-2 py-1 rounded-lg animate-in fade-in duration-300">
                <VolumeX className="w-3 h-3 mx-auto mb-1" />
                الصوت غير متاح
              </div>
            )}

            {/* Unit and Flip Instruction */}
            <div className="flex justify-between items-center text-xs opacity-70">
              <div className="bg-white/10 px-2 py-1 rounded-full truncate max-w-[60%]">
                {displayUnit}
              </div>
              <div className="bg-white/10 px-2 py-1 rounded-full flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>اضغط للترجمة</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Back - الترجمة العربية - محسن للحجم وبدون زر العودة */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-xl p-3 text-white flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all duration-500 border border-emerald-500 overflow-hidden">
          {/* Top Section - Arabic Translation - مصغر */}
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="text-xl font-bold mb-2 leading-tight break-words max-w-full animate-in fade-in duration-700">
              {displayTranslation}
            </div>
            <div className="text-xs opacity-90 bg-white/20 px-2 py-1 rounded-full mb-2 truncate max-w-full animate-in slide-in-from-bottom duration-700 delay-200">
              {displayUnit}
            </div>
          </div>

          {/* Middle Section - Example Sentence مع تمييز الكلمة المستهدفة - مصغر */}
          {displayExample && (
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg mb-3 animate-in slide-in-from-bottom duration-700 delay-300">
              <div className="text-xs opacity-80 mb-1 text-center font-semibold">مثال:</div>
              <div className="text-center">
                <div 
                  className="text-xs leading-relaxed break-words font-medium"
                  dir="ltr"
                  style={{
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto',
                    lineHeight: '1.3'
                  }}
                >
                  {highlightTargetWordInExample(displayExample, displayWord)}
                </div>
                {word.exampleSentence && word.exampleSentence.length > 50 && (
                  <div className="text-xs opacity-70 mt-1 italic">
                    (مثال مختصر)
                  </div>
                )}
                <div className="text-xs opacity-70 mt-1 flex items-center justify-center gap-1">
                  <span className="bg-yellow-400 text-black px-1 py-0.5 rounded text-xs font-bold">
                    {displayWord}
                  </span>
                  <span>= الكلمة المستهدفة</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Bottom Section - Action Button - مصغر ومحسن للظهور الكامل */}
          <div className="space-y-2 animate-in slide-in-from-bottom duration-700 delay-400">
            <div className="flex justify-center">
              <button
                onClick={(e) => handlePronounce(e, false)}
                disabled={!speechSupported}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg border-2 text-sm ${
                  speechSupported 
                    ? 'bg-white text-emerald-700 hover:bg-emerald-50 border-white' 
                    : 'bg-gray-500/50 text-gray-300 cursor-not-allowed border-gray-400'
                } ${isPlaying ? 'animate-pulse' : ''}`}
              >
                {isPlaying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-700"></div>
                    <span>جاري التشغيل...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>كرر النطق</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Achievement Badge */}
          {playCount >= 3 && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-in fade-in duration-500">
              <Award className="w-3 h-3" />
              متدرب
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VocabularyCard;