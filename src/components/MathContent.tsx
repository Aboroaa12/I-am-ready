import React, { useState, useEffect } from 'react';
import { Calculator, Plus, Edit, Trash2, Search, Filter, Save, X, AlertTriangle, RefreshCw } from 'lucide-react';
import { MathProblem, Subject } from '../types';
import { supabase } from '../lib/supabase';

interface MathContentProps {
  subject?: Subject;
}

const MathContent: React.FC<MathContentProps> = ({ subject }) => {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState<MathProblem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [grades, setGrades] = useState<number[]>([]);

  useEffect(() => {
    loadProblems();
  }, [subject]);

  const loadProblems = async () => {
    setLoading(true);
    try {
      let query = supabase.from('math_problems').select('*');
      
      if (subject) {
        query = query.eq('subject', subject.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const formattedProblems: MathProblem[] = data.map(problem => ({
          id: problem.id,
          question: problem.question,
          options: problem.options,
          answer: problem.answer,
          solution: problem.solution,
          difficulty: problem.difficulty,
          topic: problem.topic,
          unit: problem.unit,
          grade: problem.grade,
          subject: problem.subject,
          imageUrl: problem.image_url
        }));
        
        setProblems(formattedProblems);
        
        // Extract unique topics and grades
        const uniqueTopics = [...new Set(formattedProblems.map(problem => problem.topic))];
        const uniqueGrades = [...new Set(formattedProblems.map(problem => problem.grade))].sort((a, b) => a - b);
        
        setTopics(uniqueTopics);
        setGrades(uniqueGrades);
      } else {
        setProblems([]);
        setTopics([]);
        setGrades([]);
      }
    } catch (err) {
      console.error('Error loading math problems:', err);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProblem = () => {
    setEditingProblem(null);
    setShowAddModal(true);
  };

  const handleEditProblem = (problem: MathProblem) => {
    setEditingProblem(problem);
    setShowAddModal(true);
  };

  const handleDeleteProblem = (problemId: string) => {
    setShowDeleteConfirm(problemId);
  };

  const confirmDelete = async (problemId: string) => {
    try {
      // Delete problem from Supabase
      const { error } = await supabase
        .from('math_problems')
        .delete()
        .eq('id', problemId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setProblems(prev => prev.filter(problem => problem.id !== problemId));
      setShowDeleteConfirm(null);
      
      // Show success message
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'تم حذف المسألة بنجاح';
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
    } catch (err) {
      console.error('Error deleting math problem:', err);
      
      // Show error message
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'حدث خطأ أثناء حذف المسألة';
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

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGrade(null);
    setSelectedTopic(null);
    setSelectedDifficulty(null);
  };

  const filteredProblems = problems.filter(problem => {
    // Apply grade filter
    if (selectedGrade !== null && problem.grade !== selectedGrade) {
      return false;
    }
    
    // Apply topic filter
    if (selectedTopic && problem.topic !== selectedTopic) {
      return false;
    }
    
    // Apply difficulty filter
    if (selectedDifficulty && problem.difficulty !== selectedDifficulty) {
      return false;
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return problem.question.toLowerCase().includes(term) || 
             problem.topic.toLowerCase().includes(term) ||
             problem.solution.toLowerCase().includes(term);
    }
    
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'سهل';
      case 'medium': return 'متوسط';
      case 'hard': return 'صعب';
      default: return difficulty;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Calculator className="w-8 h-8 text-green-600" />
            محتوى الرياضيات {subject ? `- ${subject.name}` : ''}
          </h2>
          <p className="text-gray-600">إضافة وتعديل وحذف مسائل الرياضيات</p>
        </div>
        <button
          onClick={handleAddProblem}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          إضافة مسألة جديدة
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
              بحث
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث في المسائل..."
                className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
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

          <div>
            <label htmlFor="grade" className="block text-sm font-semibold text-gray-700 mb-2">
              الصف
            </label>
            <select
              id="grade"
              value={selectedGrade === null ? '' : selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
            >
              <option value="">جميع الصفوف</option>
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  الصف {grade}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="topic" className="block text-sm font-semibold text-gray-700 mb-2">
              الموضوع
            </label>
            <select
              id="topic"
              value={selectedTopic || ''}
              onChange={(e) => setSelectedTopic(e.target.value || null)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
            >
              <option value="">جميع المواضيع</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-semibold text-gray-700 mb-2">
              مستوى الصعوبة
            </label>
            <select
              id="difficulty"
              value={selectedDifficulty || ''}
              onChange={(e) => setSelectedDifficulty(e.target.value || null)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
            >
              <option value="">جميع المستويات</option>
              <option value="easy">سهل</option>
              <option value="medium">متوسط</option>
              <option value="hard">صعب</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-gray-600">
            تم العثور على <span className="font-bold text-green-600">{filteredProblems.length}</span> مسألة
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
              onClick={loadProblems}
              className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              تحديث
            </button>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل المسائل...</p>
          </div>
        ) : filteredProblems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">المسألة</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">الصف</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">الموضوع</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">الصعوبة</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProblems.map((problem) => (
                  <tr key={problem.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-800">{problem.question}</div>
                      <div className="text-sm text-gray-600">الإجابة: {problem.answer}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                        الصف {problem.grade}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
                        {problem.topic}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                        {getDifficultyLabel(problem.difficulty)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProblem(problem)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProblem(problem.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
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
              <Calculator className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مسائل</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedGrade || selectedTopic || selectedDifficulty
                ? 'لم يتم العثور على مسائل تطابق معايير البحث'
                : 'لم يتم إضافة أي مسائل بعد'
              }
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-t-xl">
              <h3 className="text-xl font-bold">
                {editingProblem ? 'تعديل مسألة رياضية' : 'إضافة مسألة رياضية جديدة'}
              </h3>
              <p className="opacity-90 text-sm">
                {editingProblem ? 'قم بتعديل بيانات المسألة' : 'قم بإدخال بيانات المسألة الجديدة'}
              </p>
            </div>
            
            <form className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    نص المسألة *
                  </label>
                  <textarea
                    name="question"
                    value={editingProblem?.question || ''}
                    onChange={(e) => setEditingProblem(prev => prev ? { ...prev, question: e.target.value } : null)}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="أدخل نص المسألة الرياضية"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الإجابة الصحيحة *
                  </label>
                  <input
                    type="text"
                    name="answer"
                    value={editingProblem?.answer || ''}
                    onChange={(e) => setEditingProblem(prev => prev ? { ...prev, answer: e.target.value } : null)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="أدخل الإجابة الصحيحة"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    مستوى الصعوبة *
                  </label>
                  <select
                    name="difficulty"
                    value={editingProblem?.difficulty || 'medium'}
                    onChange={(e) => setEditingProblem(prev => prev ? { ...prev, difficulty: e.target.value as any } : null)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="easy">سهل</option>
                    <option value="medium">متوسط</option>
                    <option value="hard">صعب</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الموضوع *
                  </label>
                  <input
                    type="text"
                    name="topic"
                    value={editingProblem?.topic || ''}
                    onChange={(e) => setEditingProblem(prev => prev ? { ...prev, topic: e.target.value } : null)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="مثال: الجبر، الهندسة، الإحصاء"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الوحدة *
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={editingProblem?.unit || ''}
                    onChange={(e) => setEditingProblem(prev => prev ? { ...prev, unit: e.target.value } : null)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="أدخل اسم الوحدة"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الصف *
                  </label>
                  <select
                    name="grade"
                    value={editingProblem?.grade || 5}
                    onChange={(e) => setEditingProblem(prev => prev ? { ...prev, grade: Number(e.target.value) } : null)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                      <option key={grade} value={grade}>الصف {grade}</option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الحل التفصيلي *
                  </label>
                  <textarea
                    name="solution"
                    value={editingProblem?.solution || ''}
                    onChange={(e) => setEditingProblem(prev => prev ? { ...prev, solution: e.target.value } : null)}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="اشرح خطوات الحل بالتفصيل"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رابط الصورة (اختياري)
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={editingProblem?.imageUrl || ''}
                    onChange={(e) => setEditingProblem(prev => prev ? { ...prev, imageUrl: e.target.value } : null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="أدخل رابط الصورة التوضيحية (إن وجدت)"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الخيارات (للأسئلة متعددة الاختيارات، اتركها فارغة للأسئلة المفتوحة)
                  </label>
                  <div className="space-y-2">
                    {(editingProblem?.options || ['', '', '', '']).map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => {
                          if (editingProblem) {
                            const newOptions = [...(editingProblem.options || ['', '', '', ''])];
                            newOptions[index] = e.target.value;
                            setEditingProblem({ ...editingProblem, options: newOptions });
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-2"
                        placeholder={`الخيار ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (editingProblem) {
                      // Update problem in Supabase
                      supabase
                        .from('math_problems')
                        .update({
                          question: editingProblem.question,
                          options: editingProblem.options,
                          answer: editingProblem.answer,
                          solution: editingProblem.solution,
                          difficulty: editingProblem.difficulty,
                          topic: editingProblem.topic,
                          unit: editingProblem.unit,
                          grade: editingProblem.grade,
                          subject: editingProblem.subject || subject?.id || 'math',
                          image_url: editingProblem.imageUrl,
                          updated_at: new Date().toISOString()
                        })
                        .eq('id', editingProblem.id)
                        .then(({ error }) => {
                          if (error) {
                            throw error;
                          }
                          
                          // Update local state
                          setProblems(prev => prev.map(p => 
                            p.id === editingProblem.id ? editingProblem : p
                          ));
                          
                          setShowAddModal(false);
                          
                          // Show success message
                          const notification = document.createElement('div');
                          notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
                          notification.textContent = 'تم تحديث المسألة بنجاح';
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
                        })
                        .catch(err => {
                          console.error('Error updating math problem:', err);
                          
                          // Show error message
                          const notification = document.createElement('div');
                          notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
                          notification.textContent = 'حدث خطأ أثناء تحديث المسألة';
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
                        });
                    } else {
                      // Add new problem
                      const newProblem: MathProblem = {
                        id: crypto.randomUUID(),
                        question: '',
                        answer: '',
                        solution: '',
                        difficulty: 'medium',
                        topic: '',
                        unit: '',
                        grade: 5,
                        subject: subject?.id || 'math',
                        options: ['', '', '', '']
                      };
                      
                      supabase
                        .from('math_problems')
                        .insert({
                          id: newProblem.id,
                          question: newProblem.question,
                          options: newProblem.options,
                          answer: newProblem.answer,
                          solution: newProblem.solution,
                          difficulty: newProblem.difficulty,
                          topic: newProblem.topic,
                          unit: newProblem.unit,
                          grade: newProblem.grade,
                          subject: newProblem.subject,
                          image_url: newProblem.imageUrl,
                          created_at: new Date().toISOString()
                        })
                        .then(({ error }) => {
                          if (error) {
                            throw error;
                          }
                          
                          // Update local state
                          setProblems(prev => [newProblem, ...prev]);
                          
                          setShowAddModal(false);
                          
                          // Show success message
                          const notification = document.createElement('div');
                          notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
                          notification.textContent = 'تمت إضافة المسألة بنجاح';
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
                        })
                        .catch(err => {
                          console.error('Error adding math problem:', err);
                          
                          // Show error message
                          const notification = document.createElement('div');
                          notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
                          notification.textContent = 'حدث خطأ أثناء إضافة المسألة';
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
                        });
                    }
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingProblem ? 'حفظ التغييرات' : 'إضافة المسألة'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
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
                هل أنت متأكد من حذف هذه المسألة؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                نعم، حذف المسألة
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

export default MathContent;