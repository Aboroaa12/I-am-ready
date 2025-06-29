import React, { useState } from 'react';
import { BarChart3, TrendingUp, Clock, Target, Award, Filter, Download, RefreshCw } from 'lucide-react';
import { useWordProgress } from '../hooks/useWordProgress';
import { VocabularyWord } from '../types';

interface WordProgressReportProps {
  words: VocabularyWord[];
  onClose: () => void;
}

const WordProgressReport: React.FC<WordProgressReportProps> = ({ words, onClose }) => {
  const { wordProgress, studySessions, getStudyStatistics, getWordsByMasteryLevel } = useWordProgress();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'mastery' | 'lastReviewed'>('mastery');

  const statistics = getStudyStatistics();

  const getFilteredWords = () => {
    let filteredWords = words.filter(word => wordProgress[word.english]);
    
    switch (selectedFilter) {
      case 'low':
        filteredWords = filteredWords.filter(word => {
          const progress = wordProgress[word.english];
          return progress && progress.overallMastery < 40;
        });
        break;
      case 'medium':
        filteredWords = filteredWords.filter(word => {
          const progress = wordProgress[word.english];
          return progress && progress.overallMastery >= 40 && progress.overallMastery < 80;
        });
        break;
      case 'high':
        filteredWords = filteredWords.filter(word => {
          const progress = wordProgress[word.english];
          return progress && progress.overallMastery >= 80;
        });
        break;
    }

    // Sort words
    filteredWords.sort((a, b) => {
      const progressA = wordProgress[a.english];
      const progressB = wordProgress[b.english];
      
      switch (sortBy) {
        case 'name':
          return a.english.localeCompare(b.english);
        case 'mastery':
          return (progressB?.overallMastery || 0) - (progressA?.overallMastery || 0);
        case 'lastReviewed':
          return new Date(progressB?.lastReviewed || 0).getTime() - new Date(progressA?.lastReviewed || 0).getTime();
        default:
          return 0;
      }
    });

    return filteredWords;
  };

  const exportReport = () => {
    const reportData = words
      .filter(word => wordProgress[word.english])
      .map(word => {
        const progress = wordProgress[word.english];
        return {
          'الكلمة الإنجليزية': word.english,
          'الترجمة العربية': word.arabic,
          'الوحدة': word.unit,
          'إتقان النطق': `${progress.pronunciationMastery}%`,
          'إتقان التهجئة': `${progress.spellingMastery}%`,
          'إتقان الاستخدام': `${progress.usageMastery}%`,
          'إتقان القواعد': `${progress.grammarMastery}%`,
          'الإتقان العام': `${progress.overallMastery}%`,
          'عدد المراجعات': progress.reviewCount,
          'الإجابات الصحيحة': progress.correctAnswers,
          'الإجابات الخاطئة': progress.incorrectAnswers,
          'أفضل سلسلة': progress.bestStreak,
          'آخر مراجعة': new Date(progress.lastReviewed).toLocaleDateString('ar-SA'),
          'يحتاج مراجعة': progress.needsReview ? 'نعم' : 'لا'
        };
      });

    const csvContent = [
      Object.keys(reportData[0] || {}).join(','),
      ...reportData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `word_progress_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}س ${minutes}د`;
    }
    return `${minutes}د`;
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return 'text-green-600 bg-green-100';
    if (mastery >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredWords = getFilteredWords();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <BarChart3 className="w-8 h-8" />
              تقرير تقدم الكلمات المفصل
            </h2>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <Target className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-700">{statistics.totalWords}</div>
              <div className="text-blue-600">إجمالي الكلمات</div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <Award className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <div className="text-3xl font-bold text-green-700">{statistics.masteredWords}</div>
              <div className="text-green-600">كلمات متقنة</div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
              <div className="text-3xl font-bold text-yellow-700">{statistics.accuracy.toFixed(1)}%</div>
              <div className="text-yellow-600">دقة الإجابات</div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
              <Clock className="w-8 h-8 mx-auto text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-700">{formatTime(statistics.totalStudyTime)}</div>
              <div className="text-purple-600">وقت الدراسة</div>
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">إحصائيات مفصلة</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">توزيع الإتقان</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>متقن (80%+)</span>
                    <span className="font-bold text-green-600">{statistics.masteredWords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>متوسط (40-79%)</span>
                    <span className="font-bold text-yellow-600">{statistics.wordsInProgress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>يحتاج مراجعة (&lt;40%)</span>
                    <span className="font-bold text-red-600">{statistics.strugglingWords}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">جلسات الدراسة</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>إجمالي الجلسات</span>
                    <span className="font-bold">{statistics.totalSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>متوسط وقت الجلسة</span>
                    <span className="font-bold">{formatTime(statistics.averageSessionTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>أفضل سلسلة</span>
                    <span className="font-bold text-orange-600">{statistics.bestOverallStreak}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">الأداء العام</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>السلسلة الحالية</span>
                    <span className="font-bold text-blue-600">{statistics.currentStreak}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>معدل التحسن</span>
                    <span className="font-bold text-green-600">
                      {statistics.totalWords > 0 ? ((statistics.masteredWords / statistics.totalWords) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">جميع الكلمات</option>
                <option value="high">متقنة (80%+)</option>
                <option value="medium">متوسطة (40-79%)</option>
                <option value="low">تحتاج مراجعة (&lt;40%)</option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="mastery">ترتيب حسب الإتقان</option>
              <option value="name">ترتيب أبجدي</option>
              <option value="lastReviewed">آخر مراجعة</option>
            </select>

            <button
              onClick={exportReport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              تصدير التقرير
            </button>
          </div>

          {/* Words List */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h3 className="font-bold text-gray-800">
                الكلمات ({filteredWords.length})
              </h3>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {filteredWords.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredWords.map((word) => {
                    const progress = wordProgress[word.english];
                    return (
                      <div key={word.english} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-lg">{word.english}</h4>
                              <span className="text-gray-600">{word.arabic}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getMasteryColor(progress.overallMastery)}`}>
                                {progress.overallMastery}%
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">النطق:</span>
                                <span className={`ml-2 font-semibold ${getMasteryColor(progress.pronunciationMastery)}`}>
                                  {progress.pronunciationMastery}%
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">التهجئة:</span>
                                <span className={`ml-2 font-semibold ${getMasteryColor(progress.spellingMastery)}`}>
                                  {progress.spellingMastery}%
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">الاستخدام:</span>
                                <span className={`ml-2 font-semibold ${getMasteryColor(progress.usageMastery)}`}>
                                  {progress.usageMastery}%
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">القواعد:</span>
                                <span className={`ml-2 font-semibold ${getMasteryColor(progress.grammarMastery)}`}>
                                  {progress.grammarMastery}%
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>مراجعات: {progress.reviewCount}</span>
                              <span>صحيح: {progress.correctAnswers}</span>
                              <span>خطأ: {progress.incorrectAnswers}</span>
                              <span>أفضل سلسلة: {progress.bestStreak}</span>
                              <span>آخر مراجعة: {new Date(progress.lastReviewed).toLocaleDateString('ar-SA')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد كلمات تطابق الفلتر المحدد</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordProgressReport;