import React, { useState, useEffect } from 'react';
import { Book, Search, Filter, Download, Plus, Edit, Trash2, X, Check, RefreshCw, AlertTriangle, Save } from 'lucide-react';
import { useGrammar } from '../hooks/useGrammar';
import { GrammarRule, QuizQuestion } from '../types';

const GrammarExtractor: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [units, setUnits] = useState<string[]>([]);
  const [grades, setGrades] = useState<number[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRule, setEditingRule] = useState<GrammarRule | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'rules' | 'questions'>('rules');

  const { rules, questions, loading, error, addRule, addQuestion, updateRule, updateQuestion, deleteRule, deleteQuestion, refreshGrammar } = useGrammar();

  useEffect(() => {
    // استخراج الصفوف الفريدة
    const uniqueGrades = [...new Set(rules.map(rule => rule.grade))].sort((a, b) => a - b);
    setGrades(uniqueGrades);
    
    // استخراج الوحدات الفريدة
    const uniqueUnits = [...new Set(rules.map(rule => rule.unit))].sort();
    setUnits(uniqueUnits);
  }, [rules]);

  // Update units when grade filter changes
  useEffect(() => {
    if (selectedGrade !== null) {
      const gradeRules = rules.filter(rule => rule.grade === selectedGrade);
      const gradeUnits = [...new Set(gradeRules.map(rule => rule.unit))].sort();
      setUnits(gradeUnits);
      
      // Reset unit selection if current unit is not available for selected grade
      if (selectedUnit && !gradeUnits.includes(selectedUnit)) {
        setSelectedUnit(null);
      }
    } else {
      // Show all units when no grade is selected
      const allUnits = [...new Set(rules.map(rule => rule.unit))].sort();
      setUnits(allUnits);
    }
  }, [selectedGrade, rules]);

  const filteredRules = rules.filter(rule => {
    // تطبيق فلتر الصف
    if (selectedGrade !== null && rule.grade !== selectedGrade) {
      return false;
    }
    
    // تطبيق فلتر الوحدة
    if (selectedUnit && rule.unit !== selectedUnit) {
      return false;
    }
    
    // تطبيق البحث
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return rule.title.toLowerCase().includes(term) || 
             rule.explanation.includes(term) ||
             rule.unit.toLowerCase().includes(term) ||
             rule.examples.some(example => example.toLowerCase().includes(term));
    }
    
    return true;
  });

  const filteredQuestions = questions.filter(question => {
    // تطبيق فلتر الصف
    if (selectedGrade !== null && question.grade !== selectedGrade) {
      return false;
    }
    
    // تطبيق فلتر الوحدة
    if (selectedUnit && question.unit !== selectedUnit) {
      return false;
    }
    
    // تطبيق البحث
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return question.question.toLowerCase().includes(term) || 
             question.explanation.toLowerCase().includes(term) ||
             question.unit.toLowerCase().includes(term) ||
             question.options.some(option => option.toLowerCase().includes(term));
    }
    
    return true;
  });

  const handleExportRules = () => {
    setIsExporting(true);
    
    setTimeout(() => {
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
      link.setAttribute('download', `grammar_rules_${selectedGrade ? `grade_${selectedGrade}_` : ''}${selectedUnit ? `${selectedUnit.replace(/\s+/g, '_')}_` : ''}${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
    }, 1000);
  };

  const handleExportQuestions = () => {
    setIsExporting(true);
    
    setTimeout(() => {
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
      link.setAttribute('download', `grammar_questions_${selectedGrade ? `grade_${selectedGrade}_` : ''}${selectedUnit ? `${selectedUnit.replace(/\s+/g, '_')}_` : ''}${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
    }, 1000);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGrade(null);
    setSelectedUnit(null);
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
      
      // إظهار رسالة نجاح
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
      
      // إظهار رسالة خطأ
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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-xl p-6">
        <h3 className="text-2xl font-bold text-center mb-2 flex items-center justify-center gap-2">
          <Book className="w-8 h-8" />
          مستخرج القواعد النحوية
        </h3>
        <p className="text-center opacity-90">عرض وتصفية وتصدير جميع قواعد المنهج</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 font-semibold transition-colors ${
              activeTab === 'rules'
                ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                : 'border-transparent text-gray-600 hover:text-indigo-600'
            }`}
          >
            <Book className="w-5 h-5" />
            القواعد النحوية ({filteredRules.length})
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 font-semibold transition-colors ${
              activeTab === 'questions'
                ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                : 'border-transparent text-gray-600 hover:text-indigo-600'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            أسئلة القواعد ({filteredQuestions.length})
          </button>
        </div>
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
                className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
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
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
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
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
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
            تم العثور على <span className="font-bold text-indigo-600">
              {activeTab === 'rules' ? filteredRules.length : filteredQuestions.length}
            </span> {activeTab === 'rules' ? 'قاعدة' : 'سؤال'}
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
              onClick={handleAddRule}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              إضافة {activeTab === 'rules' ? 'قاعدة' : 'سؤال'}
            </button>
            <button
              onClick={activeTab === 'rules' ? handleExportRules : handleExportQuestions}
              disabled={(activeTab === 'rules' ? filteredRules.length : filteredQuestions.length) === 0 || isExporting}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
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

      {/* Content */}
      <div className="bg-white rounded-b-xl p-6 shadow-xl">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل القواعد...</p>
          </div>
        ) : activeTab === 'rules' ? (
          // Grammar Rules Table
          filteredRules.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      العنوان
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الشرح
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      عدد الأمثلة
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الوحدة
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الصف
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRules.map((rule, index) => (
                    <tr key={rule.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {rule.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {rule.explanation}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {rule.examples.length} أمثلة
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {rule.unit}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          الصف {rule.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditRule(rule)}
                            className="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRule(rule.id || '')}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Book className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد قواعد نحوية</h3>
              <p className="text-gray-500 mb-4">
                لم يتم العثور على قواعد تطابق معايير البحث الخاصة بك
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          )
        ) : (
          // Grammar Questions Table
          filteredQuestions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      السؤال
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الخيارات
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجابة الصحيحة
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الوحدة
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الصف
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredQuestions.map((question, index) => (
                    <tr key={question.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                        {question.question}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {question.options.length} خيارات
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span className="font-semibold text-green-600">
                          {question.options[question.correct]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {question.unit}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                          الصف {question.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex gap-2">
                          <button
                            className="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <AlertTriangle className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أسئلة قواعد</h3>
              <p className="text-gray-500 mb-4">
                لم يتم العثور على أسئلة تطابق معايير البحث الخاصة بك
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          )
        )}
      </div>

      {/* Statistics */}
      {(filteredRules.length > 0 || filteredQuestions.length > 0) && (
        <div className="mt-6 bg-indigo-50 rounded-xl p-6 border border-indigo-100">
          <h4 className="font-bold text-indigo-800 mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            إحصائيات القواعد:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
              <div className="text-sm text-gray-500 mb-1">القواعد حسب الصف</div>
              <div className="space-y-2">
                {grades.map(grade => {
                  const count = filteredRules.filter(rule => rule.grade === grade).length;
                  if (count === 0) return null;
                  return (
                    <div key={grade} className="flex items-center justify-between">
                      <span className="text-sm">الصف {grade}</span>
                      <span className="font-semibold text-indigo-600">{count} قاعدة</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
              <div className="text-sm text-gray-500 mb-1">الوحدات الأكثر شيوعاً</div>
              <div className="space-y-2">
                {units
                  .map(unit => ({
                    unit,
                    count: filteredRules.filter(rule => rule.unit === unit).length
                  }))
                  .filter(item => item.count > 0)
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map(item => (
                    <div key={item.unit} className="flex items-center justify-between">
                      <span className="text-sm truncate max-w-[150px]">{item.unit}</span>
                      <span className="font-semibold text-indigo-600">{item.count} قاعدة</span>
                    </div>
                  ))
                }
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
              <div className="text-sm text-gray-500 mb-1">إحصائيات عامة</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">إجمالي القواعد</span>
                  <span className="font-semibold text-indigo-600">{filteredRules.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">إجمالي الأسئلة</span>
                  <span className="font-semibold text-indigo-600">{filteredQuestions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">عدد الوحدات</span>
                  <span className="font-semibold text-indigo-600">
                    {new Set(filteredRules.map(rule => rule.unit)).size}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Rule Modal */}
      {showAddModal && (
        <RuleModal
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
              
              // إظهار رسالة نجاح
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
              
              // إظهار رسالة خطأ
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

interface RuleModalProps {
  rule: GrammarRule | null;
  onClose: () => void;
  onSave: (ruleData: Omit<GrammarRule, 'id'>) => void;
}

const RuleModal: React.FC<RuleModalProps> = ({ rule, onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<GrammarRule, 'id'>>({
    title: rule?.title || '',
    explanation: rule?.explanation || '',
    examples: rule?.examples || [''],
    unit: rule?.unit || '',
    grade: rule?.grade || 5,
    subject: rule?.subject || 'english'
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
    setFormData(prev => ({ ...prev, examples: newExamples }));
  };

  const addExample = () => {
    setFormData(prev => ({ ...prev, examples: [...prev.examples, ''] }));
  };

  const removeExample = (index: number) => {
    if (formData.examples.length > 1) {
      const newExamples = formData.examples.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, examples: newExamples }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty examples
    const filteredExamples = formData.examples.filter(example => example.trim());
    onSave({ ...formData, examples: filteredExamples });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-xl">
          <h3 className="text-xl font-bold">
            {rule ? 'تعديل قاعدة نحوية' : 'إضافة قاعدة نحوية جديدة'}
          </h3>
          <p className="opacity-90 text-sm">
            {rule ? 'قم بتعديل بيانات القاعدة النحوية' : 'قم بإدخال بيانات القاعدة النحوية الجديدة'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="مثال: المضارع البسيط"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الصف *
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                  <option key={grade} value={grade}>الصف {grade}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الوحدة *
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="مثال: Welcome Back"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                شرح القاعدة *
              </label>
              <textarea
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="اكتب شرحاً مفصلاً للقاعدة النحوية..."
              />
            </div>
            
            <div className="md:col-span-2">
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
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder={`مثال ${index + 1}`}
                      dir="ltr"
                    />
                    {formData.examples.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExample(index)}
                        className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addExample}
                  className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  إضافة مثال
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
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

export default GrammarExtractor;