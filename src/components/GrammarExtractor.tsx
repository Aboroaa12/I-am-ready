import React, { useState, useEffect } from 'react';
import { getGrammarByGrade } from '../data/grammar';
import { GrammarRule, QuizQuestion } from '../types';
import { Download, Search, Filter, BookOpen, X, RefreshCw, Lightbulb, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useGrammar } from '../hooks/useGrammar';
import { getGradeGradientColor } from '../utils/gradeColors';

const GrammarExtractor: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [units, setUnits] = useState<string[]>([]);
  const [grades, setGrades] = useState<number[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRule, setEditingRule] = useState<GrammarRule | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [activeTab, setActiveTab] = useState<'rules' | 'questions'>('rules');

  const { rules, questions, loading, error, addRule, updateRule, deleteRule, addQuestion, updateQuestion, deleteQuestion, refreshGrammar } = useGrammar();

  useEffect(() => {
    // Extract unique grades
    const uniqueGrades = [...new Set(rules.map(rule => rule.grade))].sort((a, b) => a - b);
    setGrades(uniqueGrades);
    
    // Extract unique units
    const uniqueUnits = [...new Set(rules.map(rule => rule.unit))];
    setUnits(uniqueUnits);
  }, [rules]);

  const filteredRules = rules.filter(rule => {
    // Apply grade filter
    if (selectedGrade !== null && rule.grade !== selectedGrade) {
      return false;
    }
    
    // Apply unit filter
    if (selectedUnit && rule.unit !== selectedUnit) {
      return false;
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return rule.title.toLowerCase().includes(term) || 
             rule.explanation.toLowerCase().includes(term) ||
             rule.examples.some(example => example.toLowerCase().includes(term));
    }
    
    return true;
  });

  const filteredQuestions = questions.filter(question => {
    // Apply grade filter
    if (selectedGrade !== null && question.grade !== selectedGrade) {
      return false;
    }
    
    // Apply unit filter
    if (selectedUnit && question.unit !== selectedUnit) {
      return false;
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return question.question.toLowerCase().includes(term) || 
             question.explanation.toLowerCase().includes(term) ||
             question.options.some(option => option.toLowerCase().includes(term));
    }
    
    return true;
  });

  const handleExport = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      if (activeTab === 'rules') {
        const csvContent = [
          ['العنوان', 'الشرح', 'الأمثلة', 'الوحدة', 'الصف'].join(','),
          ...filteredRules.map(rule => [
            `"${rule.title}"`,
            `"${rule.explanation}"`,
            `"${rule.examples.join(' | ')}"`,
            `"${rule.unit}"`,
            rule.grade
          ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'english_grammar.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const csvContent = [
          ['السؤال', 'الخيارات', 'الإجابة الصحيحة', 'الشرح', 'الوحدة', 'الصف'].join(','),
          ...filteredQuestions.map(question => [
            `"${question.question}"`,
            `"${question.options.join(' | ')}"`,
            question.correct,
            `"${question.explanation}"`,
            `"${question.unit}"`,
            question.grade
          ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'english_quiz_questions.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      setIsExporting(false);
    }, 1000);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGrade(null);
    setSelectedUnit(null);
  };

  const toggleRuleExpansion = (ruleId: string) => {
    const newExpanded = new Set(expandedRules);
    if (newExpanded.has(ruleId)) {
      newExpanded.delete(ruleId);
    } else {
      newExpanded.add(ruleId);
    }
    setExpandedRules(newExpanded);
  };

  const handleAddRule = () => {
    setEditingRule(null);
    setShowAddModal(true);
  };

  const handleEditRule = (rule: GrammarRule) => {
    setEditingRule(rule);
    setShowAddModal(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    setShowDeleteConfirm(ruleId);
  };

  const confirmDelete = async (ruleId: string) => {
    try {
      await deleteRule(ruleId);
      setShowDeleteConfirm(null);
      
      // Show success message
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'تم حذف القاعدة بنجاح';
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
    } catch (error) {
      console.error('Error deleting rule:', error);
      
      // Show error message
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'حدث خطأ أثناء حذف القاعدة';
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
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowQuestionModal(true);
  };

  const handleEditQuestion = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setShowQuestionModal(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      deleteQuestion(questionId);
    }
  };

  const getDifficultyColor = (rule: GrammarRule) => {
    const complexity = rule.examples.length + rule.explanation.length / 50;
    if (complexity < 5) return 'from-green-400 to-emerald-500';
    if (complexity < 8) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-t-xl p-6">
        <h3 className="text-2xl font-bold text-center mb-2 flex items-center justify-center gap-2">
          <Lightbulb className="w-8 h-8" />
          مستخرج قواعد اللغة
        </h3>
        <p className="text-center opacity-90">عرض وتصفية وتصدير جميع قواعد اللغة الإنجليزية</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
              بحث
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث في القواعد..."
                className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="md:w-1/4">
            <label htmlFor="grade" className="block text-sm font-semibold text-gray-700 mb-2">
              الصف
            </label>
            <select
              id="grade"
              value={selectedGrade === null ? '' : selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
            >
              <option value="">جميع الصفوف</option>
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  الصف {grade}
                </option>
              ))}
            </select>
          </div>

          <div className="md:w-1/4">
            <label htmlFor="unit" className="block text-sm font-semibold text-gray-700 mb-2">
              الوحدة
            </label>
            <select
              id="unit"
              value={selectedUnit || ''}
              onChange={(e) => setSelectedUnit(e.target.value || null)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors"
            >
              <option value="">جميع الوحدات</option>
              {units.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-gray-600">
            تم العثور على <span className="font-bold text-yellow-600">{activeTab === 'rules' ? filteredRules.length : filteredQuestions.length}</span> {activeTab === 'rules' ? 'قاعدة' : 'سؤال'}
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة ضبط
            </button>
            <button
              onClick={activeTab === 'rules' ? handleAddRule : handleAddQuestion}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              إضافة {activeTab === 'rules' ? 'قاعدة' : 'سؤال'}
            </button>
            <button
              onClick={handleExport}
              disabled={(activeTab === 'rules' ? filteredRules.length : filteredQuestions.length) === 0 || isExporting}
              className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري التصدير...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  تصدير CSV
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-4 flex gap-4">
        <button
          onClick={() => setActiveTab('rules')}
          className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
            activeTab === 'rules' 
              ? 'bg-yellow-100 text-yellow-800 font-semibold' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          قواعد اللغة ({rules.length})
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
            activeTab === 'questions' 
              ? 'bg-blue-100 text-blue-800 font-semibold' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          أسئلة الاختبارات ({questions.length})
        </button>
      </div>

      {/* Grammar Rules */}
      {activeTab === 'rules' && (
        <div className="bg-white rounded-b-xl p-6 shadow-xl">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل قواعد اللغة...</p>
            </div>
          ) : filteredRules.length > 0 ? (
            <div className="space-y-6">
              {filteredRules.map((rule, index) => {
                const isExpanded = expandedRules.has(rule.id || `rule-${index}`);
                const grammarIcon = getGrammarIcon(rule.title);
                const difficultyGradient = getDifficultyColor(rule);
                
                return (
                  <div 
                    key={rule.id || `rule-${index}`} 
                    className="bg-gradient-to-r from-yellow-50 to-orange-50 border-r-4 border-yellow-400 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => toggleRuleExpansion(rule.id || `rule-${index}`)}
                      >
                        <h4 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <span className="text-2xl">{grammarIcon}</span>
                          {rule.title}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            الصف {rule.grade}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                            {rule.unit}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditRule(rule)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                          title="تعديل"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRule(rule.id || `rule-${index}`)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                          title="حذف"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => toggleRuleExpansion(rule.id || `rule-${index}`)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                          title={isExpanded ? "طي" : "توسيع"}
                        >
                          {isExpanded ? <X className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="mt-4 space-y-4">
                        <p className="text-gray-700 text-lg leading-relaxed">{rule.explanation}</p>
                        <div className="space-y-2">
                          <h5 className="font-semibold text-gray-700">أمثلة:</h5>
                          <div className="space-y-2">
                            {rule.examples.map((example, exIndex) => (
                              <div key={exIndex} className="bg-white p-3 rounded-lg font-mono text-base shadow-sm border border-yellow-200">
                                {example}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Filter className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-500 mb-4">
                لم يتم العثور على قواعد تطابق معايير البحث الخاصة بك
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quiz Questions */}
      {activeTab === 'questions' && (
        <div className="bg-white rounded-b-xl p-6 shadow-xl">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل أسئلة الاختبارات...</p>
            </div>
          ) : filteredQuestions.length > 0 ? (
            <div className="space-y-6">
              {filteredQuestions.map((question, index) => (
                <div 
                  key={question.id || `question-${index}`} 
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 border-r-4 border-blue-400 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">{question.question}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          الصف {question.grade}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                          {question.unit}
                        </span>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <h5 className="font-semibold text-gray-700">الخيارات:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.options.map((option, optIndex) => (
                            <div 
                              key={optIndex} 
                              className={`p-3 rounded-lg border ${
                                optIndex === question.correct 
                                  ? 'bg-green-100 border-green-300 text-green-800' 
                                  : 'bg-white border-gray-200 text-gray-700'
                              }`}
                            >
                              {optIndex === question.correct && (
                                <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full mr-2">
                                  صحيح
                                </span>
                              )}
                              {option}
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          <h5 className="font-semibold text-yellow-800">الشرح:</h5>
                          <p className="text-yellow-700">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                        title="تعديل"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id || `question-${index}`)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                        title="حذف"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Filter className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-500 mb-4">
                لم يتم العثور على أسئلة تطابق معايير البحث الخاصة بك
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          )}
        </div>
      )}

      {/* Statistics */}
      {(activeTab === 'rules' ? filteredRules.length : filteredQuestions.length) > 0 && (
        <div className="mt-6 bg-yellow-50 rounded-xl p-6 border border-yellow-100">
          <h4 className="font-bold text-yellow-800 mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            إحصائيات {activeTab === 'rules' ? 'القواعد' : 'الأسئلة'}:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-100">
              <div className="text-sm text-gray-500 mb-1">عدد {activeTab === 'rules' ? 'القواعد' : 'الأسئلة'} حسب الصف</div>
              <div className="space-y-2">
                {grades.map(grade => {
                  const count = activeTab === 'rules' 
                    ? filteredRules.filter(rule => rule.grade === grade).length
                    : filteredQuestions.filter(question => question.grade === grade).length;
                  if (count === 0) return null;
                  return (
                    <div key={grade} className="flex items-center justify-between">
                      <span className="text-sm">الصف {grade}</span>
                      <span className="font-semibold text-yellow-600">{count} {activeTab === 'rules' ? 'قاعدة' : 'سؤال'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-100">
              <div className="text-sm text-gray-500 mb-1">الوحدات الأكثر شيوعاً</div>
              <div className="space-y-2">
                {units
                  .map(unit => ({
                    unit,
                    count: activeTab === 'rules'
                      ? filteredRules.filter(rule => rule.unit === unit).length
                      : filteredQuestions.filter(question => question.unit === unit).length
                  }))
                  .filter(item => item.count > 0)
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map(item => (
                    <div key={item.unit} className="flex items-center justify-between">
                      <span className="text-sm truncate max-w-[150px]">{item.unit}</span>
                      <span className="font-semibold text-yellow-600">{item.count} {activeTab === 'rules' ? 'قاعدة' : 'سؤال'}</span>
                    </div>
                  ))
                }
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-100">
              <div className="text-sm text-gray-500 mb-1">إحصائيات عامة</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">إجمالي {activeTab === 'rules' ? 'القواعد' : 'الأسئلة'}</span>
                  <span className="font-semibold text-yellow-600">
                    {activeTab === 'rules' ? filteredRules.length : filteredQuestions.length}
                  </span>
                </div>
                {activeTab === 'rules' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">متوسط الأمثلة لكل قاعدة</span>
                    <span className="font-semibold text-yellow-600">
                      {filteredRules.length > 0 
                        ? (filteredRules.reduce((acc, rule) => acc + rule.examples.length, 0) / filteredRules.length).toFixed(1)
                        : '0'}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm">عدد الوحدات</span>
                  <span className="font-semibold text-yellow-600">
                    {new Set(activeTab === 'rules' 
                      ? filteredRules.map(rule => rule.unit)
                      : filteredQuestions.map(question => question.unit)
                    ).size}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Rule Modal */}
      {showAddModal && (
        <GrammarRuleModal
          rule={editingRule}
          onClose={() => setShowAddModal(false)}
          onSave={async (ruleData) => {
            try {
              if (editingRule) {
                await updateRule(editingRule.id || '', ruleData);
              } else {
                await addRule(ruleData);
              }
              setShowAddModal(false);
              
              // Show success message
              const notification = document.createElement('div');
              notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
              notification.textContent = editingRule ? 'تم تحديث القاعدة بنجاح' : 'تمت إضافة القاعدة بنجاح';
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
            } catch (error) {
              console.error('Error saving rule:', error);
              
              // Show error message
              const notification = document.createElement('div');
              notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
              notification.textContent = 'حدث خطأ أثناء حفظ القاعدة';
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
            }
          }}
          units={units}
          grades={grades}
        />
      )}

      {/* Add/Edit Question Modal */}
      {showQuestionModal && (
        <QuizQuestionModal
          question={editingQuestion}
          onClose={() => setShowQuestionModal(false)}
          onSave={async (questionData) => {
            try {
              if (editingQuestion) {
                await updateQuestion(editingQuestion.id || '', questionData);
              } else {
                await addQuestion(questionData);
              }
              setShowQuestionModal(false);
              
              // Show success message
              const notification = document.createElement('div');
              notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
              notification.textContent = editingQuestion ? 'تم تحديث السؤال بنجاح' : 'تمت إضافة السؤال بنجاح';
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
            } catch (error) {
              console.error('Error saving question:', error);
              
              // Show error message
              const notification = document.createElement('div');
              notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
              notification.textContent = 'حدث خطأ أثناء حفظ السؤال';
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
            }
          }}
          units={units}
          grades={grades}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">تأكيد الحذف</h3>
              <p className="text-gray-600">
                هل أنت متأكد من حذف هذه القاعدة؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                نعم، حذف القاعدة
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface GrammarRuleModalProps {
  rule: GrammarRule | null;
  onClose: () => void;
  onSave: (ruleData: Omit<GrammarRule, 'id'>) => void;
  units: string[];
  grades: number[];
}

const GrammarRuleModal: React.FC<GrammarRuleModalProps> = ({ rule, onClose, onSave, units, grades }) => {
  const [formData, setFormData] = useState<Omit<GrammarRule, 'id'>>({
    title: rule?.title || '',
    explanation: rule?.explanation || '',
    examples: rule?.examples || [''],
    unit: rule?.unit || '',
    grade: rule?.grade || 5
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'grade' ? Number(value) : value
    }));
  };

  const handleExampleChange = (index: number, value: string) => {
    const newExamples = [...formData.examples];
    newExamples[index] = value;
    setFormData(prev => ({
      ...prev,
      examples: newExamples
    }));
  };

  const addExample = () => {
    setFormData(prev => ({
      ...prev,
      examples: [...prev.examples, '']
    }));
  };

  const removeExample = (index: number) => {
    if (formData.examples.length <= 1) return;
    const newExamples = [...formData.examples];
    newExamples.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      examples: newExamples
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clean empty examples
    const cleanedExamples = formData.examples.filter(ex => ex.trim() !== '');
    if (cleanedExamples.length === 0) {
      alert('يجب إضافة مثال واحد على الأقل');
      return;
    }
    onSave({
      ...formData,
      examples: cleanedExamples
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-6 rounded-t-xl">
          <h3 className="text-xl font-bold">
            {rule ? 'تعديل قاعدة لغوية' : 'إضافة قاعدة لغوية جديدة'}
          </h3>
          <p className="opacity-90 text-sm">
            {rule ? 'قم بتعديل بيانات القاعدة اللغوية' : 'قم بإدخال بيانات القاعدة اللغوية الجديدة'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              عنوان القاعدة *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="مثال: Present Simple Tense"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              شرح القاعدة *
            </label>
            <textarea
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="اشرح القاعدة بالتفصيل..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الأمثلة *
            </label>
            <div className="space-y-3">
              {formData.examples.map((example, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={example}
                    onChange={(e) => handleExampleChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder={`مثال ${index + 1}`}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => removeExample(index)}
                    disabled={formData.examples.length <= 1}
                    className="bg-red-100 text-red-700 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 p-3 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addExample}
                className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                إضافة مثال
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الصف *
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                  <option key={grade} value={grade}>الصف {grade}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الوحدة *
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="مثال: My Family"
                list="units-list"
              />
              <datalist id="units-list">
                {units.map(unit => (
                  <option key={unit} value={unit} />
                ))}
              </datalist>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              {rule ? 'حفظ التغييرات' : 'إضافة القاعدة'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface QuizQuestionModalProps {
  question: QuizQuestion | null;
  onClose: () => void;
  onSave: (questionData: Omit<QuizQuestion, 'id'>) => void;
  units: string[];
  grades: number[];
}

const QuizQuestionModal: React.FC<QuizQuestionModalProps> = ({ question, onClose, onSave, units, grades }) => {
  const [formData, setFormData] = useState<Omit<QuizQuestion, 'id'>>({
    question: question?.question || '',
    options: question?.options || ['', '', '', ''],
    correct: question?.correct || 0,
    explanation: question?.explanation || '',
    unit: question?.unit || '',
    grade: question?.grade || 5
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'grade' || name === 'correct' ? Number(value) : value
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Check for empty options
    if (formData.options.some(opt => opt.trim() === '')) {
      alert('يجب ملء جميع الخيارات');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
          <h3 className="text-xl font-bold">
            {question ? 'تعديل سؤال اختبار' : 'إضافة سؤال اختبار جديد'}
          </h3>
          <p className="opacity-90 text-sm">
            {question ? 'قم بتعديل بيانات سؤال الاختبار' : 'قم بإدخال بيانات سؤال الاختبار الجديد'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              السؤال *
            </label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أدخل نص السؤال..."
              dir="auto"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الخيارات *
            </label>
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="flex-none">
                    <input
                      type="radio"
                      name="correct"
                      value={index}
                      checked={formData.correct === index}
                      onChange={() => setFormData(prev => ({ ...prev, correct: index }))}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`الخيار ${index + 1}`}
                    dir="auto"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">اختر الإجابة الصحيحة بالنقر على الدائرة بجانب الخيار</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              شرح الإجابة *
            </label>
            <textarea
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="اشرح سبب كون الإجابة المختارة هي الصحيحة..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الصف *
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                  <option key={grade} value={grade}>الصف {grade}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الوحدة *
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="مثال: My Family"
                list="units-list"
              />
              <datalist id="units-list">
                {units.map(unit => (
                  <option key={unit} value={unit} />
                ))}
              </datalist>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              {question ? 'حفظ التغييرات' : 'إضافة السؤال'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GrammarExtractor;