import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Trophy, Star, CheckCircle, Clock, Users, Target, Sparkles, ChevronRight, Award, Brain, Zap } from 'lucide-react';
import { VocabularyWord, GrammarRule, Subject } from '../types';
import { getVocabularyByGrade, getUnitsByGrade } from '../data/vocabulary';
import { getGrammarByGrade } from '../data/grammar';
import VocabularyUnit from './VocabularyUnit';

interface SubjectUnitsProps {
  subject: Subject;
  grade: number;
  onUnitSelect: (unitName: string, words: VocabularyWord[], grammar?: GrammarRule[]) => void;
  getUnitProgress?: (subjectId: string, unitName: string) => {
    isCompleted: boolean;
    totalScore: number;
    sessionsCount: number;
    lastStudyDate: string | null;
  };
  getSubjectProgress?: (subjectId: string) => {
    totalScore: number;
    unitsCompleted: number;
    sessionsCount: number;
    lastStudyDate: string | null;
  };
}

interface UnitData {
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  words: VocabularyWord[];
  grammar: GrammarRule[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  totalWords: number;
}

const SubjectUnits: React.FC<SubjectUnitsProps> = ({ subject, grade, onUnitSelect, getUnitProgress, getSubjectProgress }) => {
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [units, setUnits] = useState<UnitData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnitsForSubject();
  }, [subject, grade]);

  const loadUnitsForSubject = async () => {
    setLoading(true);
    
    if (subject.id === 'english') {
      const allWords = getVocabularyByGrade(grade);
      const allGrammar = getGrammarByGrade(grade);
      const availableUnits = getUnitsByGrade(grade);
      
      const unitsData: UnitData[] = availableUnits.map((unitName, index) => {
        const unitWords = allWords.filter(word => word.unit === unitName);
        const unitGrammar = allGrammar.filter(rule => rule.unit === unitName);
        
        return {
          name: getUnitNameInArabic(unitName, grade),
          nameEn: unitName,
          description: getUnitDescription(unitName, grade),
          icon: getUnitIcon(unitName, index),
          color: getUnitColor(index),
          words: unitWords,
          grammar: unitGrammar,
          difficulty: getDifficultyLevel(unitWords.length, unitGrammar.length),
          estimatedTime: getEstimatedTime(unitWords.length, unitGrammar.length),
          totalWords: unitWords.length
        };
      });
      
      setUnits(unitsData);
    } else {
      setUnits([]);
    }
    
    setLoading(false);
  };

  const getUnitNameInArabic = (unitName: string, grade: number): string => {
    const translations: { [key: string]: string } = {
      // Grade 5 units
      'Welcome Back': 'مرحباً بالعودة',
      'Talent Show': 'عرض المواهب',
      'Then and Now': 'الآن والماضي',
      "Let's Explore!": 'هيا نستكشف!',
      'Off to the Shops': 'إلى المتاجر',
      'Adventure Stories': 'قصص المغامرة',
      'Science and Nature': 'العلوم والطبيعة',
      'Technology and Communication': 'التكنولوجيا والتواصل',
      'Health and Fitness': 'الصحة واللياقة',
      'Community and Culture': 'المجتمع والثقافة',
      
      // Grade 10 units
      'Future Aspirations': 'الطموحات المستقبلية',
      'Science and Discovery': 'العلوم والاكتشاف',
      'Media and Communication': 'الإعلام والتواصل',
      'Global Challenges': 'التحديات العالمية',
      'Arts and Culture': 'الفنون والثقافة',
      
      // Add more grades as needed
      'Family': 'العائلة',
      'Animals': 'الحيوانات',
      'Colors': 'الألوان',
      'Numbers': 'الأرقام',
      'Body Parts': 'أجزاء الجسم',
      'Food': 'الطعام',
      'School': 'المدرسة',
      'Home': 'المنزل',
      'Toys': 'الألعاب',
      'Weather': 'الطقس'
    };
    
    return translations[unitName] || unitName;
  };

  const getUnitDescription = (unitName: string, grade: number): string => {
    const descriptions: { [key: string]: string } = {
      'Welcome Back': 'تعلم كلمات الترحيب والعودة للمدرسة',
      'Talent Show': 'اكتشف كلمات المواهب والعروض',
      'Then and Now': 'قارن بين الماضي والحاضر',
      "Let's Explore!": 'انطلق في رحلة استكشافية مثيرة',
      'Off to the Shops': 'تعلم كلمات التسوق والأسعار',
      'Adventure Stories': 'اقرأ قصص المغامرة المشوقة',
      'Science and Nature': 'اكتشف عجائب العلوم والطبيعة',
      'Technology and Communication': 'تعرف على التكنولوجيا الحديثة',
      'Health and Fitness': 'تعلم أهمية الصحة والرياضة',
      'Community and Culture': 'اكتشف ثقافات المجتمع',
      
      // Grade 10 descriptions
      'Future Aspirations': 'استكشف طموحاتك وأهدافك المستقبلية',
      'Science and Discovery': 'اكتشف عالم العلوم والاختراعات',
      'Media and Communication': 'تعلم عن وسائل الإعلام والتواصل الحديثة',
      'Global Challenges': 'فهم التحديات العالمية المعاصرة',
      'Arts and Culture': 'استكشف عالم الفنون والثقافات المختلفة',
      
      'Family': 'تعرف على أفراد العائلة',
      'Animals': 'اكتشف عالم الحيوانات',
      'Colors': 'تعلم الألوان الجميلة',
      'Numbers': 'العد والأرقام',
      'Body Parts': 'أجزاء جسم الإنسان',
      'Food': 'أنواع الطعام المختلفة'
    };
    
    return descriptions[unitName] || 'وحدة تعليمية تفاعلية';
  };

  const getUnitIcon = (unitName: string, index: number): string => {
    const icons: { [key: string]: string } = {
      'Welcome Back': '👋',
      'Talent Show': '🎭',
      'Then and Now': '⏰',
      "Let's Explore!": '🧭',
      'Off to the Shops': '🛍️',
      'Adventure Stories': '📚',
      'Science and Nature': '🔬',
      'Technology and Communication': '💻',
      'Health and Fitness': '💪',
      'Community and Culture': '🏛️',
      
      'Family': '👨‍👩‍👧‍👦',
      'Animals': '🦁',
      'Colors': '🎨',
      'Numbers': '🔢',
      'Body Parts': '👤',
      'Food': '🍎',
      'School': '🏫',
      'Home': '🏠',
      'Toys': '🧸',
      'Weather': '🌤️'
    };
    
    return icons[unitName] || ['📖', '📝', '📚', '📋', '📊'][index % 5];
  };

  const getUnitColor = (index: number): string => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600',
      'from-purple-400 to-purple-600',
      'from-orange-400 to-orange-600',
      'from-pink-400 to-pink-600',
      'from-teal-400 to-teal-600',
      'from-indigo-400 to-indigo-600',
      'from-red-400 to-red-600',
      'from-yellow-400 to-yellow-600',
      'from-cyan-400 to-cyan-600'
    ];
    
    return colors[index % colors.length];
  };

  const getDifficultyLevel = (wordCount: number, grammarCount: number): 'easy' | 'medium' | 'hard' => {
    const total = wordCount + grammarCount * 2;
    if (total < 15) return 'easy';
    if (total < 25) return 'medium';
    return 'hard';
  };

  const getEstimatedTime = (wordCount: number, grammarCount: number): string => {
    const minutes = Math.max(15, (wordCount * 2) + (grammarCount * 5));
    if (minutes < 60) return `${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} ساعة ${remainingMinutes > 0 ? `${remainingMinutes} دقيقة` : ''}`;
  };

  const createPlaceholderUnits = (subject: Subject, grade: number): UnitData[] => {
    // Create placeholder units for other subjects
    const baseUnits = [
      { name: 'الوحدة الأولى', nameEn: 'Unit 1', icon: '📖' },
      { name: 'الوحدة الثانية', nameEn: 'Unit 2', icon: '📝' },
      { name: 'الوحدة الثالثة', nameEn: 'Unit 3', icon: '📚' },
      { name: 'الوحدة الرابعة', nameEn: 'Unit 4', icon: '📋' },
      { name: 'الوحدة الخامسة', nameEn: 'Unit 5', icon: '📊' }
    ];

    return baseUnits.map((unit, index) => ({
      name: unit.name,
      nameEn: unit.nameEn,
      description: `وحدة تعليمية في مادة ${subject.name}`,
      icon: unit.icon,
      color: getUnitColor(index),
      words: [],
      grammar: [],
      difficulty: 'medium' as const,
      estimatedTime: '30 دقيقة',
      totalWords: 0
    }));
  };

  const getDifficultyBadge = (difficulty: 'easy' | 'medium' | 'hard') => {
    const badges = {
      easy: { text: 'سهل', color: 'bg-green-100 text-green-800', icon: '🟢' },
      medium: { text: 'متوسط', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' },
      hard: { text: 'صعب', color: 'bg-red-100 text-red-800', icon: '🔴' }
    };
    
    const badge = badges[difficulty];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <span>{badge.icon}</span>
        {badge.text}
      </span>
    );
  };

  const handleUnitClick = (unit: UnitData) => {
    if (unit.words.length > 0) {
      setSelectedUnit(unit.nameEn);
      onUnitSelect(unit.nameEn, unit.words, unit.grammar);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (selectedUnit) {
    const unit = units.find(u => u.nameEn === selectedUnit);
    if (unit) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setSelectedUnit(null)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              العودة للوحدات
            </button>
          </div>
          <VocabularyUnit
            title={unit.name}
            words={unit.words}
            grammarRules={unit.grammar}
            subject={subject.id}
          />
        </div>
      );
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
            <span className="text-3xl">{subject.icon}</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              وحدات مادة {subject.name}
            </h1>
            <p className="text-slate-600 mt-2">الصف {grade === 0 ? 'الإداري' : grade}</p>
          </div>
        </div>
        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 mx-auto rounded-full"></div>
      </div>

      {/* Subject Progress Summary */}
      {getSubjectProgress && (
        (() => {
          const subjectProgress = getSubjectProgress(subject.id);
          return (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                تقدمك في هذه المادة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-white rounded-lg p-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Trophy className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">النقاط المحققة</p>
                    <p className="text-xl font-bold text-slate-800">{subjectProgress.totalScore}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-lg p-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">الوحدات المكتملة</p>
                    <p className="text-xl font-bold text-slate-800">{subjectProgress.unitsCompleted}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-lg p-4">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">جلسات الدراسة</p>
                    <p className="text-xl font-bold text-slate-800">{subjectProgress.sessionsCount}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()
      )}

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit, index) => (
          <div
            key={unit.nameEn}
            onClick={() => handleUnitClick(unit)}
            className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
              unit.words.length > 0 ? 'cursor-pointer hover:scale-105' : 'opacity-75 cursor-not-allowed'
            }`}
          >
            {/* Unit Header */}
            <div className={`bg-gradient-to-r ${unit.color} p-6 text-white`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">{unit.icon}</span>
                {getDifficultyBadge(unit.difficulty)}
              </div>
              <h3 className="text-xl font-bold mb-2">{unit.name}</h3>
              <p className="text-white/90 text-sm">{unit.description}</p>
            </div>

            {/* Unit Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-slate-600">
                      {unit.totalWords} كلمة
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-slate-600">{unit.estimatedTime}</span>
                  </div>
                </div>

                {/* Progress Indicator */}
                {getUnitProgress && (
                  (() => {
                    const progress = getUnitProgress(subject.id, unit.nameEn);
                    return (
                      <div className="space-y-2">
                        {progress.isCompleted && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">مكتملة</span>
                          </div>
                        )}
                        {progress.totalScore > 0 && (
                          <div className="flex items-center gap-2 text-blue-600">
                            <Trophy className="w-4 h-4" />
                            <span className="text-sm">{progress.totalScore} نقطة</span>
                          </div>
                        )}
                        {progress.sessionsCount > 0 && (
                          <div className="flex items-center gap-2 text-purple-600">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">{progress.sessionsCount} جلسة</span>
                          </div>
                        )}
                      </div>
                    );
                  })()
                )}

                {/* Grammar Rules */}
                {unit.grammar.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-slate-600">
                      {unit.grammar.length} قاعدة نحوية
                    </span>
                  </div>
                )}

                {/* Action Button */}
                {unit.words.length > 0 ? (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-slate-700">
                      ابدأ التعلم
                    </span>
                    <div className="flex items-center gap-2 text-blue-600 group-hover:text-blue-800 transition-colors">
                      <Play className="w-4 h-4" />
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-100">
                    <span className="text-sm text-slate-500">قريباً...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {units.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center shadow-lg">
            <span className="text-6xl">{subject.icon}</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">ليست متوفرة الآن</h3>
          <p className="text-lg text-gray-600 mb-4">نعمل على إضافة محتوى هذه المادة</p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 max-w-md mx-auto border border-blue-200">
            <p className="text-gray-700 text-center">
              <span className="font-semibold">المحتوى قيد التطوير</span>
            </p>
            <p className="text-sm text-gray-600 text-center mt-2">
              سيكون متاحاً قريباً
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectUnits; 