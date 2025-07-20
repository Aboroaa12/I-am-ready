import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Search, Filter, Mail, Phone, School, Calendar, Key, Save, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Teacher } from '../types';

const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedTeachers: Teacher[] = data.map(teacher => ({
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          phone: teacher.phone || '',
          grades: teacher.grades,
          students: teacher.students || [],
          joinDate: teacher.join_date,
          isActive: teacher.is_active,
          schoolName: teacher.school_name || '',
          subjects: teacher.subjects || []
        }));
        
        setTeachers(formattedTeachers);
      }
    } catch (err) {
      console.error('Error loading teachers:', err);
      // Load from local storage as fallback
      const savedTeachers = localStorage.getItem('admin-teachers');
      if (savedTeachers) {
        setTeachers(JSON.parse(savedTeachers));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = () => {
    setEditingTeacher(null);
    setShowAddModal(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setShowAddModal(true);
  };

  const handleDeleteTeacher = (teacherId: string) => {
    setShowDeleteConfirm(teacherId);
  };

  const hasValidSupabaseCredentials = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return supabaseUrl && supabaseKey && supabaseUrl !== 'your-supabase-url' && supabaseKey !== 'your-supabase-anon-key';
  };

  const confirmDelete = async (teacherId: string) => {
    try {
      if (hasValidSupabaseCredentials()) {
        // Delete related access codes first
        const { error: accessCodeError } = await supabase
          .from('access_codes')
          .delete()
          .eq('teacher_id', teacherId);
        
        if (accessCodeError) {
          console.error('Error deleting access codes:', accessCodeError);
          // Continue with teacher deletion even if access code deletion fails
        }
        
      // Delete teacher from Supabase
        const { error: teacherError } = await supabase
        .from('teachers')
        .delete()
        .eq('id', teacherId);
      
        if (teacherError) {
          console.error('Error deleting teacher:', teacherError);
          throw new Error(`فشل في حذف المعلم: ${teacherError.message}`);
        }
        
        // Update local state only after successful database deletion
        setTeachers(prev => prev.filter(t => t.id !== teacherId));
        
        // Also remove from localStorage to prevent reload issues
        const updatedTeachers = teachers.filter(t => t.id !== teacherId);
        localStorage.setItem('admin-teachers', JSON.stringify(updatedTeachers));
        
      } else {
        // If no valid Supabase connection, only update local storage
        const updatedTeachers = teachers.filter(t => t.id !== teacherId);
        setTeachers(updatedTeachers);
        localStorage.setItem('admin-teachers', JSON.stringify(updatedTeachers));
      }
      
      setShowDeleteConfirm(null);
      
      // Show success message
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'تم حذف المعلم بنجاح';
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
      console.error('Error deleting teacher:', err);
      
      // Show error message
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'حدث خطأ أثناء حذف المعلم';
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

  const handleSaveTeacher = async (teacherData: Omit<Teacher, 'id' | 'joinDate' | 'students'>) => {
    try {
      if (hasValidSupabaseCredentials()) {
        if (editingTeacher) {
          // Update existing teacher
          const { error } = await supabase
            .from('teachers')
            .update({
              name: teacherData.name,
              email: teacherData.email,
              phone: teacherData.phone,
              grades: teacherData.grades,
              school_name: teacherData.schoolName,
              subjects: teacherData.subjects,
              is_active: teacherData.isActive
            })
            .eq('id', editingTeacher.id);

          if (error) {
            throw new Error(`فشل في تحديث المعلم: ${error.message}`);
          }

          // Update local state
          setTeachers(prev => prev.map(t => 
            t.id === editingTeacher.id 
              ? { ...editingTeacher, ...teacherData }
              : t
          ));

          // Update localStorage
          const updatedTeachers = teachers.map(t => 
            t.id === editingTeacher.id 
              ? { ...editingTeacher, ...teacherData }
              : t
          );
          localStorage.setItem('admin-teachers', JSON.stringify(updatedTeachers));

          alert('تم تحديث بيانات المعلم بنجاح');
          
              phone: newTeacher.phone,
              grades: newTeacher.grades,
              school_name: newTeacher.schoolName,
              subjects: newTeacher.subjects,
              is_active: newTeacher.isActive,
              join_date: newTeacher.joinDate
            }])
            .select()
            .single();

          if (error) {
            throw new Error(`فشل في إضافة المعلم: ${error.message}`);
          }

          const formattedTeacher: Teacher = {
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            grades: data.grades,
            students: [],
            joinDate: data.join_date,
            isActive: data.is_active,
            schoolName: data.school_name || '',
            subjects: data.subjects || []
          };

          // Update local state
          setTeachers(prev => [formattedTeacher, ...prev]);

          // Update localStorage
          const updatedTeachers = [formattedTeacher, ...teachers];
          localStorage.setItem('admin-teachers', JSON.stringify(updatedTeachers));

          alert('تم إضافة المعلم بنجاح');
        }
      } else {
        // Fallback to localStorage only
        if (editingTeacher) {
          const updatedTeachers = teachers.map(t => 
            t.id === editingTeacher.id 
              ? { ...editingTeacher, ...teacherData }
              : t
          );
          setTeachers(updatedTeachers);
          localStorage.setItem('admin-teachers', JSON.stringify(updatedTeachers));
        } else {
          const newTeacher: Teacher = {
            ...teacherData,
            id: Date.now().toString(),
            joinDate: new Date().toISOString(),
            students: []
          };
          const updatedTeachers = [newTeacher, ...teachers];
          setTeachers(updatedTeachers);
          localStorage.setItem('admin-teachers', JSON.stringify(updatedTeachers));
        }
        alert('تم حفظ بيانات المعلم محلياً');
      }

      setShowAddModal(false);
      setEditingTeacher(null);

    } catch (error) {
      console.error('Error saving teacher:', error);
      alert(error instanceof Error ? error.message : 'حدث خطأ أثناء حفظ بيانات المعلم');
    }
  };

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.schoolName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            إدارة المعلمين
          </h2>
          <p className="text-gray-600">إضافة وتعديل وحذف المعلمين</p>
        </div>
        <button
          onClick={handleAddTeacher}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          إضافة معلم جديد
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث عن معلم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Teachers List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل بيانات المعلمين...</p>
          </div>
        ) : filteredTeachers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">المعلم</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">البريد الإلكتروني</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">الصفوف</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">المدرسة</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">الحالة</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-800">{teacher.name}</div>
                      <div className="text-sm text-gray-600">{teacher.phone}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{teacher.email}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {teacher.grades.map(grade => (
                          <span key={grade} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            الصف {grade}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{teacher.schoolName || 'غير محدد'}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        teacher.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {teacher.isActive ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditTeacher(teacher)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
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
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">لا يوجد معلمين</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'لم يتم العثور على معلمين يطابقون معايير البحث' : 'لم يتم إضافة أي معلمين بعد'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddTeacher}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                إضافة معلم جديد
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
              <h3 className="text-xl font-bold">
                {editingTeacher ? 'تعديل بيانات المعلم' : 'إضافة معلم جديد'}
              </h3>
              <p className="opacity-90 text-sm">
                {editingTeacher ? 'قم بتعديل بيانات المعلم' : 'قم بإدخال بيانات المعلم الجديد'}
              </p>
            </div>
            
            <TeacherForm 
              teacher={editingTeacher}
              onClose={() => {
                  setShowAddModal(false);
                setEditingTeacher(null);
              }}
              onSave={handleSaveTeacher}
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
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">تأكيد الحذف</h3>
              <p className="text-gray-600">
                هل أنت متأكد من حذف هذا المعلم؟ سيتم حذف جميع بياناته ورموز الدخول المرتبطة به.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                نعم، حذف المعلم
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

interface TeacherFormProps {
  teacher: Teacher | null;
  onClose: () => void;
  onSave: (teacherData: Omit<Teacher, 'id' | 'joinDate' | 'students'>) => void;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ teacher, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: teacher?.name || '',
    email: teacher?.email || '',
    phone: teacher?.phone || '',
    grades: teacher?.grades || [5],
    schoolName: teacher?.schoolName || '',
    subjects: teacher?.subjects || [],
    isActive: teacher?.isActive ?? true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleGradeChange = (grade: number) => {
    setFormData(prev => {
      const newGrades = prev.grades.includes(grade)
        ? prev.grades.filter(g => g !== grade)
        : [...prev.grades, grade];
      return { ...prev, grades: newGrades };
    });
  };

  return (
    <form className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            الاسم الكامل *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="أدخل اسم المعلم"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            البريد الإلكتروني *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="example@school.edu"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            رقم الهاتف
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="05xxxxxxxx"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            اسم المدرسة
          </label>
          <input
            type="text"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="أدخل اسم المدرسة"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            الصفوف التي يدرسها *
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
              <label key={grade} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.grades.includes(grade)}
                  onChange={() => handleGradeChange(grade)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm">الصف {grade}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            المواد التي يدرسها
          </label>
          <input
            type="text"
            value={formData.subjects.join(', ')}
            onChange={handleSubjectsChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="مثال: اللغة الإنجليزية، الرياضيات (افصل بينها بفاصلة)"
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
            <span className="text-gray-700">المعلم نشط</span>
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
          {teacher ? 'حفظ التغييرات' : 'إضافة المعلم'}
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

export default TeacherManagement;