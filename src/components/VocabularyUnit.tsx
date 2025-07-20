import React, { useState, useEffect } from 'react';
import { VocabularyWord, GrammarRule } from '../types';
import VocabularyCard from './VocabularyCard';
import { BookOpen, Lightbulb, ChevronDown, ChevronUp, Play, Volume2, Sparkles, Target, Award, Users, Brain, Zap, Star, CheckCircle, Trophy, Rocket, PenTool } from 'lucide-react';
import { speechEngine } from '../utils/speechEngine';

interface VocabularyUnitProps {
  title: string;
  words: VocabularyWord[];
  grammarRules?: GrammarRule[];
  onWordPronounce?: (word: string) => void;
}

const VocabularyUnit: React.FC<VocabularyUnitProps> = ({ 
  title, 
  words, 
  grammarRules, 
  onWordPronounce,
}) => {
  const [expandedRules, setExpandedRules] = useState<Set<number>>(new Set());
  const [showAllWords, setShowAllWords] = useState(false);
  const [playingExample, setPlayingExample] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [words, grammarRules]);
  const toggleRuleExpansion = (index: number) => {
    const newExpanded = new Set(expandedRules);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRules(newExpanded);
  };

  const playExampleSentence = async (example: string, exampleIndex: string) => {
    if (playingExample === exampleIndex) {
      speechEngine.stop();
      setPlayingExample(null);
      return;
    }

    try {
      setPlayingExample(exampleIndex);
      await speechEngine.speak(example, {
        rate: 0.8,
        pitch: 1.0,
        volume: 1.0
      });
      setPlayingExample(null);
    } catch (error) {
      console.error('خطأ في نطق المثال:', error);
      setPlayingExample(null);
    }
  };

  // Always show all words if there are 12 or fewer
  const wordsToShow = words.length <= 12 ? words : (showAllWords ? words : words.slice(0, 12));

  const getGrammarIcon = (title: string) => {
    if (title.toLowerCase().includes('greeting') || title.toLowerCase().includes('تحيات')) return '👋';
    if (title.toLowerCase().includes('this') || title.toLowerCase().includes('that') || title.toLowerCase().includes('إشارة')) return '👆';
    if (title.toLowerCase().includes('is') || title.toLowerCase().includes('are') || title.toLowerCase().includes('جمل')) return '🔗';
    if (title.toLowerCase().includes('number') || title.toLowerCase().includes('عد') || title.toLowerCase().includes('أرقام')) return '🔢';
    if (title.toLowerCase().includes('plural')) return '📚';
    if (title.toLowerCase().includes('have') || title.toLowerCase().includes('has')) return '🤲';
    if (title.toLowerCase().includes('like')) return '❤️';
    if (title.toLowerCase().includes('article')) return '📝';
    if (title.toLowerCase().includes('preposition')) return '📍';
    if (title.toLowerCase().includes('continuous')) return '⏰';
    if (title.toLowerCase().includes('adjective')) return '🎨';
    if (title.toLowerCase().includes('question')) return '❓';
    if (title.toLowerCase().includes('comparative')) return '⚖️';
    if (title.toLowerCase().includes('must') || title.toLowerCase().includes('should')) return '⚠️';
    if (title.toLowerCase().includes('perfect')) return '✅';
    if (title.toLowerCase().includes('passive')) return '🔄';
    if (title.toLowerCase().includes('conditional')) return '🔀';
    if (title.toLowerCase().includes('reported')) return '💬';
    if (title.toLowerCase().includes('cohesive') || title.toLowerCase().includes('cohesion')) return '🔗';
    if (title.toLowerCase().includes('used to')) return '⏮️';
    return '📖';
  };

  const getDifficultyColor = (rule: GrammarRule) => {
    const complexity = rule.examples.length + rule.explanation.length / 50;
    if (complexity < 5) return 'from-green-400 to-emerald-500';
    if (complexity < 8) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getGrammarLevel = (rule: GrammarRule) => {
    const complexity = rule.examples.length + rule.explanation.length / 50;
    if (complexity < 5) return { level: 'مبتدئ', color: 'text-green-600', bg: 'bg-green-100' };
    if (complexity < 8) return { level: 'متوسط', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'متقدم', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getChallengeText = (ruleIndex: number, rule: GrammarRule) => {
    const challenges = [
      {
        title: "تحدي الإبداع",
        text: "أنشئ قصة قصيرة من 5 جمل باستخدام هذه القاعدة والكلمات الجديدة التي تعلمتها!",
        icon: <PenTool className="w-5 h-5 text-white" />,
        color: "from-purple-500 to-pink-600"
      },
      {
        title: "تحدي المحادثة",
        text: "تدرب مع زميلك على محادثة قصيرة باستخدام هذه القاعدة لمدة 3 دقائق!",
        icon: <Users className="w-5 h-5 text-white" />,
        color: "from-blue-500 to-indigo-600"
      },
      {
        title: "تحدي التطبيق",
        text: "اكتب 5 جمل مختلفة باستخدام هذه القاعدة واطلب من معلمك تقييمها!",
        icon: <Trophy className="w-5 h-5 text-white" />,
        color: "from-orange-500 to-red-600"
      },
      {
        title: "تحدي الذاكرة",
        text: "احفظ مثالين من الأمثلة وأعد كتابتهما غداً من الذاكرة!",
        icon: <Brain className="w-5 h-5 text-white" />,
        color: "from-teal-500 to-cyan-600"
      },
      {
        title: "تحدي الاستكشاف",
        text: "ابحث عن 3 أمثلة إضافية لهذه القاعدة في كتابك أو على الإنترنت!",
        icon: <Rocket className="w-5 h-5 text-white" />,
        color: "from-green-500 to-emerald-600"
      }
    ];

    return challenges[ruleIndex % challenges.length];
  };

  const getDifficultyBadge = (difficulty: string) => {
    const badges = {
      easy: { text: 'سهل', color: 'bg-green-100 text-green-800', icon: '🟢' },
      medium: { text: 'متوسط', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' },
      hard: { text: 'صعب', color: 'bg-red-100 text-red-800', icon: '🔴' }
    };
    
    const badge = badges[difficulty as keyof typeof badges] || badges.medium;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <span>{badge.icon}</span>
        {badge.text}
      </span>
    );
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="space-y-12">
      {/* Enhanced Header */}
      <div className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-50 to-teal-100 rounded-3xl opacity-50"></div>
        <div className="relative z-10 py-8 px-6">
          <h2 className="text-4xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
          <div className="flex items-center justify-center gap-4 text-slate-600">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span>{words.length} كلمة</span>
            </div>
            {grammarRules && grammarRules.length > 0 && (
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-500" />
                <span>{grammarRules.length} قاعدة</span>
              </div>
            )}
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 mx-auto rounded-full mt-4"></div>
        </div>
      </div>

      {/* Enhanced Vocabulary Cards Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-yellow-500" />
            المفردات التفاعلية
          </h3>
          {words.length > 12 && (
            <button
              onClick={() => setShowAllWords(!showAllWords)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
            >
              {showAllWords ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  إظهار أقل
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  إظهار الكل ({words.length})
                </>
              )}
            </button>
          )}
        </div>

        {words.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {wordsToShow.map((word, index) => (
              <VocabularyCard
                key={`${word.english}-${index}`}
                word={word}
                onPronounce={() => onWordPronounce?.(word.english)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
            <p className="text-yellow-700 text-lg">
              لا توجد مفردات متاحة لهذه الوحدة
            </p>
            <p className="text-yellow-600 mt-2">يرجى اختيار وحدة أخرى أو التواصل مع المعلم</p>
          </div>
        )}

        {!showAllWords && words.length > 12 && (
          <div className="text-center">
            <p className="text-slate-600 mb-4">
              يتم عرض {wordsToShow.length} من أصل {words.length} كلمة
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Grammar Rules */}
      {grammarRules && grammarRules.length > 0 && (
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-2xl shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                القواعد النحوية التفاعلية
              </span>
            </h3>
            <p className="text-slate-600 text-lg">
              تعلم القواعد الأساسية بطريقة تفاعلية وممتعة مع أمثلة عملية
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-600 mx-auto rounded-full mt-3"></div>
          </div>

          <div className="grid gap-8">
            {grammarRules.map((rule, index) => {
              const isExpanded = expandedRules.has(index);
              const grammarIcon = getGrammarIcon(rule.title);
              const difficultyGradient = getDifficultyColor(rule);
              const levelInfo = getGrammarLevel(rule);
              const challengeInfo = getChallengeText(index, rule);
              
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-3xl shadow-2xl border border-amber-100 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.01] group"
                >
                  {/* Enhanced Rule Header */}
                  <div 
                    className={`bg-gradient-to-r ${difficultyGradient} p-8 cursor-pointer relative overflow-hidden`}
                    onClick={() => toggleRuleExpansion(index)}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                      <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
                    </div>
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <span className="text-3xl">{grammarIcon}</span>
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-white mb-2 leading-tight">
                            {rule.title}
                          </h4>
                          <div className="flex items-center gap-4 text-white/90 text-sm">
                            <span className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              {rule.examples.length} أمثلة
                            </span>
                            <span className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              الصف {rule.grade}
                            </span>
                            <span className={`${levelInfo.bg} ${levelInfo.color} px-3 py-1 rounded-full font-semibold`}>
                              {levelInfo.level}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all duration-300 group-hover:scale-110">
                          {isExpanded ? (
                            <ChevronUp className="w-6 h-6 text-white" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Rule Content */}
                  {isExpanded && (
                    <div className="p-8 space-y-8 animate-in slide-in-from-top duration-500">
                      {/* Enhanced Explanation */}
                      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-amber-200 shadow-inner">
                        <h5 className="font-bold text-amber-800 mb-4 flex items-center gap-3 text-xl">
                          <div className="bg-amber-500 p-2 rounded-lg">
                            <Lightbulb className="w-5 h-5 text-white" />
                          </div>
                          الشرح التفصيلي:
                        </h5>
                        <p className="text-slate-700 text-lg leading-relaxed font-medium">
                          {rule.explanation}
                        </p>
                      </div>

                      {/* Enhanced Examples with Speech */}
                      <div className="space-y-6">
                        <h5 className="font-bold text-slate-800 text-xl flex items-center gap-3">
                          <div className="bg-blue-500 p-2 rounded-lg">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          أمثلة تطبيقية متنوعة:
                        </h5>
                        <div className="grid gap-4">
                          {rule.examples.map((example, exIndex) => {
                            const exampleId = `${index}-${exIndex}`;
                            const isPlaying = playingExample === exampleId;
                            
                            return (
                              <div 
                                key={exIndex} 
                                className="group bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-300"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-3">
                                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                                        {exIndex + 1}
                                      </div>
                                      <span className="text-sm text-blue-600 font-bold bg-blue-100 px-3 py-1 rounded-full">
                                        مثال {exIndex + 1}
                                      </span>
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-100 shadow-sm">
                                      <p className="text-slate-800 font-mono text-lg leading-relaxed" dir="ltr">
                                        {example}
                                      </p>
                                    </div>
                                  </div>
                                  <button 
                                    className={`p-3 rounded-xl transition-all duration-300 ml-4 hover:scale-110 shadow-lg ${
                                      isPlaying 
                                        ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' 
                                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                                    } text-white opacity-0 group-hover:opacity-100`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      playExampleSentence(example, exampleId);
                                    }}
                                  >
                                    {isPlaying ? (
                                      <div className="flex items-center gap-1">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                      </div>
                                    ) : (
                                      <Volume2 className="w-5 h-5" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Enhanced Practice Tips */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
                          <div className="flex items-start gap-4">
                            <div className="bg-green-500 p-3 rounded-xl shadow-lg">
                              <Target className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h6 className="font-bold text-green-800 mb-3 text-lg">💡 نصيحة ذكية للتعلم:</h6>
                              <p className="text-green-700 leading-relaxed font-medium">
                                {getRandomLearningTip().arabic}
                              </p>
                              <p className="text-green-600 text-sm mt-2 italic" dir="ltr">
                                {getRandomLearningTip().english}
                              </p>
                              <div className="mt-3 bg-green-100 p-3 rounded-lg">
                                <p className="text-green-800 text-sm font-semibold">
                                  🎯 {getRandomGoal().arabic}
                                </p>
                                <p className="text-green-600 text-xs mt-1" dir="ltr">
                                  {getRandomGoal().english}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={`bg-gradient-to-r ${challengeInfo.color} border-2 border-purple-200 rounded-2xl p-6 shadow-lg text-white`}>
                          <div className="flex items-start gap-4">
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                              {challengeInfo.icon}
                            </div>
                            <div>
                              <h6 className="font-bold mb-3 text-lg">🚀 {challengeInfo.title}:</h6>
                              <p className="leading-relaxed font-medium opacity-95">
                                {challengeInfo.text}
                              </p>
                              <div className="mt-4 bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                                <p className="text-sm font-semibold">
                                  ⭐ مكافأة: +10 نقاط عند إكمال التحدي!
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Indicator */}
                      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-indigo-500 p-2 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-indigo-800 text-lg">
                              🎉 تم استكشاف هذه القاعدة بنجاح!
                            </span>
                          </div>
                          <div className="text-indigo-600 text-sm font-semibold bg-indigo-100 px-3 py-1 rounded-full">
                            قاعدة {index + 1} من {grammarRules.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Enhanced Grammar Summary */}
          <div className="bg-gradient-to-r from-purple-100 via-blue-50 to-teal-100 rounded-3xl p-8 border-2 border-purple-200 shadow-2xl">
            <div className="text-center">
              <h4 className="text-2xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                🏆 ملخص إنجازاتك في القواعد
              </h4>
              <p className="text-slate-600 mb-6 text-lg">
                أحسنت! لقد استكشفت {grammarRules.length} قاعدة نحوية مهمة في هذه الوحدة
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-purple-200 shadow-lg">
                  <div className="text-2xl font-bold text-purple-700 mb-1">
                    {grammarRules.reduce((total, rule) => total + rule.examples.length, 0)}
                  </div>
                  <span className="text-purple-600 font-semibold">مثال تطبيقي</span>
                </div>
                <div className="bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-blue-200 shadow-lg">
                  <div className="text-2xl font-bold text-blue-700 mb-1">
                    {grammarRules[0]?.grade}
                  </div>
                  <span className="text-blue-600 font-semibold">مستوى الصف</span>
                </div>
                <div className="bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-teal-200 shadow-lg">
                  <div className="text-2xl font-bold text-teal-700 mb-1">
                    100%
                  </div>
                  <span className="text-teal-600 font-semibold">معدل الإكمال</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No content message */}
      {words.length === 0 && (!grammarRules || grammarRules.length === 0) && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
          <BookOpen className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
          <h3 className="text-2xl font-bold text-yellow-700 mb-2">لا يوجد محتوى متاح</h3>
          <p className="text-yellow-600">
            لا توجد مفردات أو قواعد متاحة لهذه الوحدة حالياً. يرجى اختيار وحدة أخرى أو التواصل مع المعلم.
          </p>
        </div>
      )}
    </div>
  );
};

// نصائح تعليمية متنوعة ومحفزة
const getRandomLearningTip = () => {
  const tips = [
    {
      arabic: "العلم نور يضيء طريق المستقبل، فلا تتوقف عن التعلم أبداً",
      english: "Knowledge is light that illuminates the path to the future, never stop learning"
    },
    {
      arabic: "المثابرة مفتاح النجاح، والتكرار يؤدي إلى الإتقان",
      english: "Perseverance is the key to success, and repetition leads to mastery"
    },
    {
      arabic: "كل خطأ هو فرصة للتعلم والتحسن، لا تخف من المحاولة",
      english: "Every mistake is an opportunity to learn and improve, don't be afraid to try"
    },
    {
      arabic: "الطموح يدفعك للأمام، والعمل الجاد يحقق الأحلام",
      english: "Ambition drives you forward, and hard work makes dreams come true"
    },
    {
      arabic: "التعلم رحلة مدى الحياة، استمتع بكل خطوة فيها",
      english: "Learning is a lifelong journey, enjoy every step of it"
    },
    {
      arabic: "الصبر والممارسة يحولان الصعب إلى سهل",
      english: "Patience and practice turn the difficult into easy"
    },
    {
      arabic: "اجعل من كل يوم فرصة لتعلم شيء جديد",
      english: "Make every day an opportunity to learn something new"
    },
    {
      arabic: "النجاح يأتي لمن يؤمن بقدراته ويعمل بجد",
      english: "Success comes to those who believe in their abilities and work hard"
    },
    {
      arabic: "التحدي يقوي العزيمة ويطور المهارات",
      english: "Challenges strengthen determination and develop skills"
    },
    {
      arabic: "العقل الذي ينفتح على فكرة جديدة لا يعود أبداً لحجمه الأصلي",
      english: "A mind that opens to a new idea never returns to its original size"
    }
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
};

// أهداف يومية متنوعة
const getRandomGoal = () => {
  const goals = [
    {
      arabic: "هدف اليوم: تعلم 5 كلمات جديدة واستخدمها في جمل",
      english: "Today's goal: Learn 5 new words and use them in sentences"
    },
    {
      arabic: "تحدي اليوم: اقرأ نص قصير وحاول فهمه بدون ترجمة",
      english: "Today's challenge: Read a short text and try to understand it without translation"
    },
    {
      arabic: "مهمة اليوم: مارس النطق لمدة 10 دقائق",
      english: "Today's task: Practice pronunciation for 10 minutes"
    },
    {
      arabic: "هدف الأسبوع: أكمل وحدة كاملة بنجاح",
      english: "This week's goal: Complete a full unit successfully"
    },
    {
      arabic: "تحدي الشهر: احصل على 500 نقطة في التمارين",
      english: "This month's challenge: Get 500 points in exercises"
    },
    {
      arabic: "مهمة اليوم: اكتب فقرة قصيرة باللغة الإنجليزية",
      english: "Today's task: Write a short paragraph in English"
    },
    {
      arabic: "هدف اليوم: حل 10 أسئلة قواعد بدون أخطاء",
      english: "Today's goal: Solve 10 grammar questions without errors"
    },
    {
      arabic: "تحدي اليوم: استمع لحوار وحاول تكراره",
      english: "Today's challenge: Listen to a dialogue and try to repeat it"
    }
  ];
  
  return goals[Math.floor(Math.random() * goals.length)];
};

export default VocabularyUnit;