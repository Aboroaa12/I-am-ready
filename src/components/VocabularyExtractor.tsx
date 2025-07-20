import React, { useState, useEffect } from 'react';
import { getAllVocabulary } from '../data/vocabulary';
import { VocabularyWord } from '../types';
import { Download, Search, Filter, BookOpen, X, Check, RefreshCw, Plus, Edit, Trash2, AlertTriangle, Key, Shield, Users } from 'lucide-react';
import { useVocabulary } from '../hooks/useVocabulary';
import { getGradeGradientColor } from '../utils/gradeColors';
import AdminCodeGenerator from './AdminCodeGenerator';
import StudentCodeGenerator from './StudentCodeGenerator';
import BulkStudentCodeGenerator from './BulkStudentCodeGenerator';

const VocabularyExtractor: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [units, setUnits] = useState<string[]>([]);
  const [grades, setGrades] = useState<number[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabularyWord | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showAdminCodeGenerator, setShowAdminCodeGenerator] = useState(false);
  const [showStudentCodeGenerator, setShowStudentCodeGenerator] = useState(false);
  const [showBulkStudentGenerator, setShowBulkStudentGenerator] = useState(false);

  const { words, loading, error, addWord, updateWord, deleteWord, refreshWords } = useVocabulary();

  useEffect(() => {
    // استخراج الصفوف الفريدة
    const uniqueGrades = [...new Set(words.map(word => word.grade))].sort((a, b) => a - b);
    setGrades(uniqueGrades);
    
    // استخراج الوحدات الفريدة
    const uniqueUnits = [...new Set(words.map(word => word.unit))].sort();
    setUnits(uniqueUnits);
  }, [words]);

  // Update units when grade filter changes
  useEffect(() => {
    if (selectedGrade !== null) {
      const gradeWords = words.filter(word => word.grade === selectedGrade);
      const gradeUnits = [...new Set(gradeWords.map(word => word.unit))].sort();
      setUnits(gradeUnits);
      
      // Reset unit selection if current unit is not available for selected grade
      if (selectedUnit && !gradeUnits.includes(selectedUnit)) {
        setSelectedUnit(null);
      }
    } else {
      // Show all units when no grade is selected
      const allUnits = [...new Set(words.map(word => word.unit))].sort();
      setUnits(allUnits);
    }
  }, [selectedGrade, words]);

  const filteredWords = words.filter(word => {
    // تطبيق فلتر الصف
    if (selectedGrade !== null && word.grade !== selectedGrade) {
      return false;
    }
    
    // تطبيق فلتر الوحدة
    if (selectedUnit && word.unit !== selectedUnit) {
      return false;
    }
    
    // تطبيق البحث
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return word.english.toLowerCase().includes(term) || 
             word.arabic.includes(term) ||
             word.unit.toLowerCase().includes(term) ||
             (word.pronunciation && word.pronunciation.toLowerCase().includes(term));
    }
    
    return true;
  });

  const handleExport = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      const csvContent = [
        ['الإنجليزية', 'العربية', 'النطق', 'الوحدة', 'الصف', 'نوع الكلمة', 'مثال', 'الصعوبة'].join(','),
        ...filteredWords.map(word => [
          `"${word.english}"`,
          `"${word.arabic}"`,
          `"${word.pronunciation || ''}"`,
          `"${word.unit}"`,
          word.grade,
          `"${word.partOfSpeech || ''}"`,
          `"${word.exampleSentence || ''}"`,
          `"${word.difficulty || ''}"`,
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `english_vocabulary_${selectedGrade ? `grade_${selectedGrade}_` : ''}${selectedUnit ? `${selectedUnit.replace(/\s+/g, '_')}_` : ''}${new Date().toISOString().split('T')[0]}.csv`);
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

  const handleAddWord = () => {
    setEditingWord(null);
    setShowAddModal(true);
  };

  const handleEditWord = (word: VocabularyWord) => {
    setEditingWord(word);
    setShowAddModal(true);
  };

  const handleDeleteWord = (wordId: string) => {
    setShowDeleteConfirm(wordId);
  };

  const confirmDelete = async (wordId: string) => {
    try {
      await deleteWord(wordId);
      setShowDeleteConfirm(null);
      
      // إظهار رسالة نجاح
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'تم حذف الكلمة بنجاح';
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
      console.error('Error deleting word:', error);
      
      // إظهار رسالة خطأ
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'حدث خطأ أثناء حذف الكلمة';
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl p-6">
        <h3 className="text-2xl font-bold text-center mb-2 flex items-center justify-center gap-2">
          <BookOpen className="w-8 h-8" />
          مستخرج المفردات
        </h3>
        <p className="text-center opacity-90">عرض وتصفية وتصدير جميع كلمات المنهج</p>
      </div>

      {/* Admin Key Generation Section - مخصص للمدير فقط */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 border-b border-purple-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl shadow-lg">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                🔐 مولد رموز الدخول - المدير العام
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">مدير فقط</span>
              </h3>
              <p className="opacity-90">إنشاء وإدارة رموز الدخول للمعلمين والطلاب - تحكم كامل في النظام</p>
              <div className="flex items-center gap-4 mt-2 text-sm opacity-80">
                <span>👨‍🏫 رموز المعلمين</span>
                <span>👨‍🎓 رموز الطلاب الفردية</span>
                <span>👥 رموز المجموعات</span>
                <span>🏫 رموز الفصول</span>
                <span>⚙️ تحكم شامل</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowAdminCodeGenerator(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Key className="w-5 h-5" />
              إنشاء رمز معلم
            </button>
            <button
              onClick={() => setShowStudentCodeGenerator(true)}
              className="bg-green-500/80 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Users className="w-5 h-5" />
              رمز طالب فردي
            </button>
            <button
              onClick={() => setShowBulkStudentGenerator(true)}
              className="bg-blue-500/80 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Users className="w-5 h-5" />
              رموز مجموعة
            </button>
            <div className="text-xs opacity-75 text-center mt-1">
              🔒 صلاحيات المدير العليا
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">👨‍🏫</div>
            <div className="text-sm opacity-90">المعلمين</div>
            <div className="text-lg font-bold">∞</div>
            <div className="text-xs opacity-75">غير محدود</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">👨‍🎓</div>
            <div className="text-sm opacity-90">الطلاب الأفراد</div>
            <div className="text-lg font-bold">∞</div>
            <div className="text-xs opacity-75">رمز لكل طالب</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">👥</div>
            <div className="text-sm opacity-90">المجموعات</div>
            <div className="text-lg font-bold">∞</div>
            <div className="text-xs opacity-75">رمز للمجموعة</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">🏫</div>
            <div className="text-sm opacity-90">الفصول</div>
            <div className="text-lg font-bold">∞</div>
            <div className="text-xs opacity-75">رمز للفصل</div>
          </div>
        </div>
        
        {/* Admin Features */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <h4 className="font-bold text-white mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            مميزات المدير الحصرية:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
              <span>🔓</span>
              <span>رموز بدون حدود زمنية</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
              <span>👥</span>
              <span>إنشاء رموز مجموعات</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
              <span>⚙️</span>
              <span>تحكم في جميع الإعدادات</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
              <span>📊</span>
              <span>تقارير شاملة</span>
            </div>
          </div>
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
                placeholder="ابحث عن كلمة..."
                className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
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
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
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
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
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
            تم العثور على <span className="font-bold text-blue-600">{filteredWords.length}</span> كلمة
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
              onClick={handleAddWord}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              إضافة كلمة
            </button>
            <button
              onClick={handleExport}
              disabled={filteredWords.length === 0 || isExporting}
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

      {/* Words Table */}
      <div className="bg-white rounded-b-xl p-6 shadow-xl overflow-x-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل المفردات...</p>
          </div>
        ) : filteredWords.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإنجليزية
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العربية
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  النطق
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
              {filteredWords.map((word, index) => (
                <tr key={`${word.english}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {word.english}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {word.arabic}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {word.pronunciation || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {word.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      الصف {word.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditWord(word)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteWord(word.id || `${word.english}-${index}`)}
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
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-500 mb-4">
              لم يتم العثور على كلمات تطابق معايير البحث الخاصة بك
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

      {/* Statistics */}
      {filteredWords.length > 0 && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            إحصائيات المفردات:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
              <div className="text-sm text-gray-500 mb-1">عدد الكلمات حسب الصف</div>
              <div className="space-y-2">
                {grades.map(grade => {
                  const count = filteredWords.filter(word => word.grade === grade).length;
                  if (count === 0) return null;
                  return (
                    <div key={grade} className="flex items-center justify-between">
                      <span className="text-sm">الصف {grade}</span>
                      <span className="font-semibold text-blue-600">{count} كلمة</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
              <div className="text-sm text-gray-500 mb-1">الوحدات الأكثر شيوعاً</div>
              <div className="space-y-2">
                {units
                  .map(unit => ({
                    unit,
                    count: filteredWords.filter(word => word.unit === unit).length
                  }))
                  .filter(item => item.count > 0)
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map(item => (
                    <div key={item.unit} className="flex items-center justify-between">
                      <span className="text-sm truncate max-w-[150px]">{item.unit}</span>
                      <span className="font-semibold text-blue-600">{item.count} كلمة</span>
                    </div>
                  ))
                }
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
              <div className="text-sm text-gray-500 mb-1">إحصائيات عامة</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">إجمالي الكلمات</span>
                  <span className="font-semibold text-blue-600">{filteredWords.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">الكلمات مع نطق</span>
                  <span className="font-semibold text-blue-600">
                    {filteredWords.filter(word => word.pronunciation).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">عدد الوحدات</span>
                  <span className="font-semibold text-blue-600">
                    {new Set(filteredWords.map(word => word.unit)).size}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Word Modal */}
      {showAddModal && (
        <WordModal
          word={editingWord}
          units={units}
          onClose={() => setShowAddModal(false)}
          onSave={async (wordData) => {
            try {
              if (editingWord) {
                await updateWord(editingWord.id || '', wordData);
              } else {
                await addWord(wordData);
              }
              setShowAddModal(false);
              
              // إظهار رسالة نجاح
              const notification = document.createElement('div');
              notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
              notification.textContent = editingWord ? 'تم تحديث الكلمة بنجاح' : 'تمت إضافة الكلمة بنجاح';
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
              console.error('Error saving word:', error);
              
              // إظهار رسالة خطأ
              const notification = document.createElement('div');
              notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
              notification.textContent = 'حدث خطأ أثناء حفظ الكلمة';
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
                هل أنت متأكد من حذف هذه الكلمة؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                نعم، حذف الكلمة
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

      {/* Admin Code Generator Modal */}
      {showAdminCodeGenerator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-600" />
                إنشاء رمز دخول للمعلم - المدير فقط
              </h3>
              <button
                onClick={() => setShowAdminCodeGenerator(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <AdminCodeGenerator 
              onSuccess={() => {
                // إظهار رسالة نجاح
                const notification = document.createElement('div');
                notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
                notification.textContent = 'تم إنشاء رمز المعلم بنجاح';
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
              }}
            />
          </div>
        </div>
      )}

      {/* Student Code Generator Modal */}
      {showStudentCodeGenerator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-6 h-6 text-green-600" />
                إنشاء رمز دخول لطالب فردي - المدير
              </h3>
              <button
                onClick={() => setShowStudentCodeGenerator(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <StudentCodeGenerator 
              onSuccess={() => {
                const notification = document.createElement('div');
                notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
                notification.textContent = 'تم إنشاء رمز الطالب بنجاح';
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
              }}
            />
          </div>
        </div>
      )}

      {/* Bulk Student Code Generator Modal */}
      {showBulkStudentGenerator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                إنشاء رموز دخول لمجموعة طلاب - المدير
              </h3>
              <button
                onClick={() => setShowBulkStudentGenerator(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <BulkStudentCodeGenerator 
              onSuccess={(count) => {
                const notification = document.createElement('div');
                notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
                notification.textContent = `تم إنشاء ${count} رمز دخول للطلاب بنجاح`;
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
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface WordModalProps {
  word: VocabularyWord | null;
  onClose: () => void;
  onSave: (wordData: Omit<VocabularyWord, 'id'>) => void;
  units: string[];
}

const WordModal: React.FC<WordModalProps> = ({ word, onClose, onSave, units }) => {
  const [formData, setFormData] = useState<Omit<VocabularyWord, 'id'>>({
    english: word?.english || '',
    arabic: word?.arabic || '',
    unit: word?.unit || '',
    pronunciation: word?.pronunciation || '',
    grade: word?.grade || 5,
    partOfSpeech: word?.partOfSpeech || 'noun',
    exampleSentence: word?.exampleSentence || '',
    difficulty: word?.difficulty || 'medium'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'grade' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
          <h3 className="text-xl font-bold">
            {word ? 'تعديل كلمة' : 'إضافة كلمة جديدة'}
          </h3>
          <p className="opacity-90 text-sm">
            {word ? 'قم بتعديل بيانات الكلمة' : 'قم بإدخال بيانات الكلمة الجديدة'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الكلمة الإنجليزية *
              </label>
              <input
                type="text"
                name="english"
                value={formData.english}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل الكلمة بالإنجليزية"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الترجمة العربية *
              </label>
              <input
                type="text"
                name="arabic"
                value={formData.arabic}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل الترجمة العربية"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                النطق
              </label>
              <input
                type="text"
                name="pronunciation"
                value={formData.pronunciation}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="مثال: /həˈləʊ/"
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
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                نوع الكلمة
              </label>
              <select
                name="partOfSpeech"
                value={formData.partOfSpeech}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="noun">اسم (Noun)</option>
                <option value="verb">فعل (Verb)</option>
                <option value="adjective">صفة (Adjective)</option>
                <option value="adverb">ظرف (Adverb)</option>
                <option value="preposition">حرف جر (Preposition)</option>
                <option value="pronoun">ضمير (Pronoun)</option>
                <option value="conjunction">أداة ربط (Conjunction)</option>
                <option value="interjection">تعجب (Interjection)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                مستوى الصعوبة
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="easy">سهل (Easy)</option>
                <option value="medium">متوسط (Medium)</option>
                <option value="hard">صعب (Hard)</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                مثال على استخدام الكلمة
              </label>
              <textarea
                name="exampleSentence"
                value={formData.exampleSentence}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل جملة توضح استخدام الكلمة"
                dir="ltr"
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              {word ? 'حفظ التغييرات' : 'إضافة الكلمة'}
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

export default VocabularyExtractor;