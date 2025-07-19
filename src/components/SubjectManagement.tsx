import React, { useState, useEffect } from 'react';
import { Book, Plus, Edit, Trash2, Search, Filter, Save, X, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { Subject } from '../types';
import { supabase } from '../lib/supabase';
import { getGradeGradientColor } from '../utils/gradeColors';

const SubjectManagement: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Grade and semester selection
  const [grades, setGrades] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const [semesters, setSemesters] = useState<string[]>(['الفصل الأول', 'الفصل الثاني', 'الفصل الصيفي']);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);

  // Predefined subject colors
  const subjectColors = {
    english: { color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-100', text: 'text-blue-800' },
    math: { color: 'from-green-500 to-teal-600', bg: 'bg-green-100', text: 'text-green-800' },
    science: { color: 'from-purple-500 to-violet-600', bg: 'bg-purple-100', text: 'text-purple-800' },
    islamic: { color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-100', text: 'text-emerald-800' },
    arabic: { color: 'from-amber-500 to-yellow-600', bg: 'bg-amber-100', text: 'text-amber-800' },
    social: { color: 'from-orange-500 to-red-600', bg: 'bg-orange-100', text: 'text-orange-800' },
    art: { color: 'from-pink-500 to-rose-600', bg: 'bg-pink-100', text: 'text-pink-800' },
    pe: { color: 'from-red-500 to-pink-600', bg: 'bg-red-100', text: 'text-red-800' },
    default: { color: 'from-gray-500 to-slate-600', bg: 'bg-gray-100', text: 'text-gray-800' }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    setLoading(true);
    try {
      // Try to load subjects from Supabase
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const formattedSubjects: Subject[] = data.map(subject => ({
          id: subject.id,
          name: subject.name,
          nameEn: subject.name_en,
          icon: subject.icon,
          color: subject.color,
          description: subject.description,
          isActive: subject.is_active,
          createdAt: subject.created_at,
          updatedAt: subject.updated_at
        }));
        
        setSubjects(formattedSubjects);
      } else {
        // If no data found, use default subjects
        const defaultSubjects = getDefaultSubjects();
        setSubjects(defaultSubjects);
        
        // Try to add default subjects to Supabase
        for (const subject of defaultSubjects) {
          await supabase.from('subjects').insert({
            id: subject.id,
            name: subject.name,
            name_en: subject.nameEn,
            icon: subject.icon,
            color: subject.color,
            description: subject.description,
            is_active: subject.isActive,
            created_at: subject.createdAt
          });
        }
      }
    } catch (err) {
      console.error('Error loading subjects:', err);
      // Load from local storage as fallback
      const savedSubjects = localStorage.getItem('admin-subjects');
      if (savedSubjects) {
        setSubjects(JSON.parse(savedSubjects));
      } else {
        // Use default subjects if nothing in local storage
        const defaultSubjects = getDefaultSubjects();
        setSubjects(defaultSubjects);
        localStorage.setItem('admin-subjects', JSON.stringify(defaultSubjects));
      }
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSubjects = (): Subject[] => {
    return [
      {
        id: 'english',
        name: 'اللغة الإنجليزية',
        nameEn: 'English',
        icon: '📚',
        color: 'from-blue-500 to-indigo-600',
        description: 'تعلم اللغة الإنجليزية من خلال المفردات والقواعد والتمارين التفاعلية',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'math',
        name: 'الرياضيات',
        nameEn: 'Mathematics',
        icon: '🔢',
        color: 'from-green-500 to-teal-600',
        description: 'تعلم الرياضيات من خلال المسائل والتمارين التفاعلية',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'science',
        name: 'العلوم',
        nameEn: 'Science',
        icon: '🔬',
        color: 'from-purple-500 to-violet-600',
        description: 'تعلم العلوم من خلال التجارب والمفاهيم العلمية (للصفوف 1-8)',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'physics',
        name: 'الفيزياء',
        nameEn: 'Physics',
        icon: '⚛️',
        color: 'from-blue-500 to-cyan-600',
        description: 'دراسة الفيزياء والظواهر الطبيعية (للصفوف 9-12)',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'chemistry',
        name: 'الكيمياء',
        nameEn: 'Chemistry',
        icon: '🧪',
        color: 'from-green-500 to-emerald-600',
        description: 'دراسة الكيمياء والتفاعلات الكيميائية (للصفوف 9-12)',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'biology',
        name: 'الأحياء',
        nameEn: 'Biology',
        icon: '🧬',
        color: 'from-teal-500 to-green-600',
        description: 'دراسة علم الأحياء والكائنات الحية (للصفوف 9-12)',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'islamic',
        name: 'التربية الإسلامية',
        nameEn: 'Islamic Education',
        icon: '☪️',
        color: 'from-emerald-500 to-green-600',
        description: 'تعلم التربية الإسلامية من خلال القرآن والحديث والفقه',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'arabic',
        name: 'اللغة العربية',
        nameEn: 'Arabic',
        icon: '📖',
        color: 'from-amber-500 to-yellow-600',
        description: 'تعلم اللغة العربية من خلال القراءة والكتابة والقواعد',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
  };

  const handleAddSubject = () => {
    setEditingSubject(null);
    setShowAddModal(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setShowAddModal(true);
  };

  const handleDeleteSubject = (subjectId: string) => {
    setShowDeleteConfirm(subjectId);
  };

  const confirmDelete = async (subjectId: string) => {
    try {
      // Delete subject from Supabase
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setSubjects(prev => prev.filter(s => s.id !== subjectId));
      setShowDeleteConfirm(null);
      
      // Show success message
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'تم حذف المادة بنجاح';
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
      console.error('Error deleting subject:', err);
      
      // Show error message
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'حدث خطأ أثناء حذف المادة';
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

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (selectedGrade !== null && subject.id.includes(selectedGrade.toString())) ||
    (selectedSemester !== null && subject.description.includes(selectedSemester))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Book className="w-8 h-8 text-blue-600" />
            إدارة المواد الدراسية
          </h2>
          <p className="text-gray-600">إضافة وتعديل وحذف المواد الدراسية</p>
        </div>
        <button
          onClick={handleAddSubject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          إضافة مادة جديدة
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              بحث
            </label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث عن مادة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الصف الدراسي
            </label>
            <select
              value={selectedGrade === null ? '' : selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع الصفوف</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>الصف {grade}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الفصل الدراسي
            </label>
            <select
              value={selectedSemester === null ? '' : selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value || null)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع الفصول</option>
              {semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))
        ) : filteredSubjects.length > 0 ? (
          filteredSubjects.map((subject) => (
            <div key={subject.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`bg-gradient-to-br ${subject.color} text-white p-3 rounded-xl shadow-md`}>
                    <span className="text-2xl">{subject.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{subject.name}</h3>
                    <p className="text-sm text-gray-600">{subject.nameEn}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {subject.id.includes('5') && (
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getGradeGradientColor(5)} text-white`}>
                          الصف 5
                        </span>
                      )}
                      {subject.id.includes('8') && (
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getGradeGradientColor(8)} text-white`}>
                          الصف 8
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditSubject(subject)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                    title="تعديل"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubject(subject.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                    title="حذف"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{subject.description}</p>
              
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  subject.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {subject.isActive ? 'نشط' : 'غير نشط'}
                </span>
                {selectedSemester && (
                  <span className="text-sm text-gray-500">
                    {selectedSemester}
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  تاريخ الإضافة: {new Date(subject.createdAt).toLocaleDateString('ar-SA')}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-xl shadow-lg p-12 text-center">
            <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد مواد</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'لم يتم العثور على مواد تطابق معايير البحث' : 'لم يتم إضافة أي مواد بعد'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddSubject}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                إضافة مادة جديدة
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
              <h3 className="text-xl font-bold">
                {editingSubject ? 'تعديل المادة الدراسية' : 'إضافة مادة دراسية جديدة'}
              </h3>
              <p className="opacity-90 text-sm">
                {editingSubject ? 'قم بتعديل بيانات المادة الدراسية' : 'قم بإدخال بيانات المادة الدراسية الجديدة'}
              </p>
            </div>
            
            <SubjectForm 
              subject={editingSubject}
              onClose={() => setShowAddModal(false)}
              onSave={async (subjectData) => {
                try {
                  if (editingSubject) {
                    // Update subject
                    const { error } = await supabase
                      .from('subjects')
                      .update({
                        name: subjectData.name,
                        name_en: subjectData.nameEn,
                        icon: subjectData.icon,
                        color: subjectData.color,
                        description: subjectData.description,
                        is_active: subjectData.isActive,
                        updated_at: new Date().toISOString()
                      })
                      .eq('id', editingSubject.id);
                    
                    if (error) throw error;
                    
                    // Update local state
                    setSubjects(prev => prev.map(s => 
                      s.id === editingSubject.id ? { ...s, ...subjectData } : s
                    ));
                  } else {
                    // Add new subject
                    const newSubjectId = subjectData.nameEn.toLowerCase().replace(/\s+/g, '-');
                    const { error } = await supabase
                      .from('subjects')
                      .insert({
                        id: newSubjectId,
                        name: subjectData.name,
                        name_en: subjectData.nameEn,
                        icon: subjectData.icon,
                        color: subjectData.color,
                        description: subjectData.description,
                        is_active: subjectData.isActive,
                        created_at: new Date().toISOString()
                      });
                    
                    if (error) throw error;
                    
                    // Update local state
                    const newSubject: Subject = {
                      id: newSubjectId,
                      ...subjectData,
                      createdAt: new Date().toISOString()
                    };
                    
                    setSubjects(prev => [...prev, newSubject]);
                  }
                  
                  setShowAddModal(false);
                  
                  // Show success message
                  const notification = document.createElement('div');
                  notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
                  notification.textContent = editingSubject ? 'تم تحديث المادة بنجاح' : 'تمت إضافة المادة بنجاح';
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
                  console.error('Error saving subject:', err);
                  
                  // Show error message
                  const notification = document.createElement('div');
                  notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
                  notification.textContent = 'حدث خطأ أثناء حفظ المادة';
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
              subjectColors={subjectColors}
            />
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
                هل أنت متأكد من حذف هذه المادة؟ سيتم حذف جميع المحتويات المرتبطة بها.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                نعم، حذف المادة
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

interface SubjectFormProps {
  subject: Subject | null;
  onClose: () => void;
  onSave: (subjectData: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => void;
  subjectColors: Record<string, { color: string; bg: string; text: string }>;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ subject, onClose, onSave, subjectColors }) => {
  const [formData, setFormData] = useState({
    name: subject?.name || '',
    nameEn: subject?.nameEn || '',
    icon: subject?.icon || '📚',
    color: subject?.color || 'from-blue-500 to-indigo-600',
    description: subject?.description || '',
    isActive: subject?.isActive ?? true,
    grade: subject?.grade || null,
    semester: subject?.semester || ''
  });

  const icons = ['📚', '🔢', '🔬', '☪️', '📖', '🌍', '🎨', '🏃', '🧠', '💻', '🔍', '📝', '🧪', '📊', '🔤'];
  
  const colorOptions = Object.entries(subjectColors).map(([key, value]) => ({
    id: key,
    gradient: value.color,
    bg: value.bg,
    text: value.text
  }));

  // Add new color options for science subjects
  const additionalColors = [
    { id: 'physics', gradient: 'from-blue-500 to-cyan-600', bg: 'bg-cyan-100', text: 'text-cyan-800' },
    { id: 'chemistry', gradient: 'from-green-500 to-emerald-600', bg: 'bg-emerald-100', text: 'text-emerald-800' },
    { id: 'biology', gradient: 'from-teal-500 to-green-600', bg: 'bg-teal-100', text: 'text-teal-800' }
  ];
  
  const allColorOptions = [...colorOptions, ...additionalColors];

  const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const semesters = ['الفصل الأول', 'الفصل الثاني', 'الفصل الصيفي'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <form className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            اسم المادة بالعربية * 
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="مثال: الرياضيات"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            اسم المادة بالإنجليزية *
          </label>
          <input
            type="text"
            name="nameEn"
            value={formData.nameEn}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="مثال: Mathematics"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            الصف الدراسي
          </label>
          <select
            name="grade"
            value={formData.grade || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, grade: Number(e.target.value) }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">اختر الصف</option>
            {grades.map(grade => (
              <option key={grade} value={grade}>الصف {grade}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            الفصل الدراسي
          </label>
          <select
            name="semester"
            value={formData.semester || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">اختر الفصل</option>
            {semesters.map(semester => (
              <option key={semester} value={semester}>{semester}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            الأيقونة
          </label>
          <div className="grid grid-cols-5 gap-2 mb-2">
            {icons.map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, icon }))}
                className={`p-2 text-2xl rounded-lg transition-all ${
                  formData.icon === icon 
                    ? 'bg-blue-100 border-2 border-blue-500 scale-110' 
                    : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
          <input
            type="text"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="أدخل رمز إيموجي"
            maxLength={2}
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            لون المادة
          </label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {allColorOptions.map(color => (
              <button
                key={color.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, color: color.gradient }))}
                className={`h-10 rounded-lg transition-all ${
                  formData.color === color.gradient 
                    ? 'ring-2 ring-offset-2 ring-blue-500 scale-105' 
                    : ''
                }`}
              >
                <div className={`h-full w-full rounded-lg bg-gradient-to-r ${color.gradient}`}></div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            وصف المادة *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="أدخل وصفاً مختصراً للمادة"
          />
        </div>
        
        <div className="flex items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">المادة نشطة</span>
          </label>
        </div>
      </div>
      
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => onSave(formData)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {subject ? 'حفظ التغييرات' : 'إضافة المادة'}
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
  );
};

export default SubjectManagement;