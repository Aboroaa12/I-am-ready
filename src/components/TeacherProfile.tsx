import React, { useState, useEffect } from 'react';
import { User, Mail, School, BookOpen, Phone, Key, Edit, Save, X, Plus, Calendar, AlertTriangle } from 'lucide-react';
import { Teacher } from '../types';
import { useAccessCodes } from '../hooks/useAccessCodes';

interface TeacherProfileProps {
  teacher: Teacher;
  onUpdate: (updates: Partial<Teacher>) => void;
}

const TeacherProfile: React.FC<TeacherProfileProps> = ({ teacher, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: teacher.name,
    email: teacher.email,
    phone: teacher.phone || '',
    schoolName: teacher.schoolName || '',
    subjects: teacher.subjects?.join(', ') || '',
    grades: teacher.grades || []
  });
  
  const { accessCodes, teacherCodeLimit } = useAccessCodes(teacher.id);
  const usedCodes = accessCodes.length;
  const remainingCodes = teacherCodeLimit - usedCodes;
  
  // تحديث بيانات النموذج عند تغير بيانات المعلم
  useEffect(() => {
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone || '',
      schoolName: teacher.schoolName || '',
      subjects: teacher.subjects?.join(', ') || '',
      grades: teacher.grades || []
    });
  }, [teacher]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
  
  const handleSubmit = () => {
    const updatedTeacher = {
      ...teacher,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      schoolName: formData.schoolName,
      subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s),
      grades: formData.grades
    };
    
    onUpdate(updatedTeacher);
    setIsEditing(false);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{teacher.name}</h3>
              <p className="opacity-90">معلم اللغة الإنجليزية</p>
            </div>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              تعديل البيانات
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              إلغاء
            </button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  المواد التي يدرسها
                </label>
                <input
                  type="text"
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="مثال: اللغة الإنجليزية، الرياضيات (افصل بينها بفاصلة)"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الصفوف التي يدرسها *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
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
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                حفظ التغييرات
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-700">البريد الإلكتروني</h4>
                </div>
                <p className="text-gray-800">{teacher.email}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-gray-700">رقم الهاتف</h4>
                </div>
                <p className="text-gray-800">{teacher.phone || 'غير محدد'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <School className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-700">المدرسة</h4>
                </div>
                <p className="text-gray-800">{teacher.schoolName || 'غير محدد'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-gray-700">تاريخ الانضمام</h4>
                </div>
                <p className="text-gray-800">{new Date(teacher.joinDate).toLocaleDateString('ar-SA')}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <h4 className="font-semibold text-gray-700">الصفوف التي يدرسها</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {teacher.grades.map(grade => (
                    <span key={grade} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
                      الصف {grade}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-teal-600" />
                  <h4 className="font-semibold text-gray-700">المواد التي يدرسها</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects?.map((subject, index) => (
                    <span key={index} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm">
                      {subject}
                    </span>
                  )) || <span className="text-gray-500">غير محدد</span>}
                </div>
              </div>
            </div>
            
            {/* Access Code Limits */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200 mt-8">
              <div className="flex items-center gap-3 mb-4">
                <Key className="w-6 h-6 text-purple-600" />
                <h4 className="text-lg font-bold text-purple-800">حد رموز الدخول</h4>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-semibold">الرموز المستخدمة:</span>
                      <span className="text-purple-700 font-bold">{usedCodes} / {teacherCodeLimit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${usedCodes >= teacherCodeLimit ? 'bg-red-600' : 'bg-purple-600'}`}
                        style={{ width: `${Math.min(100, (usedCodes / teacherCodeLimit) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-600">
                    يمكنك إنشاء <span className="font-bold text-purple-700">{remainingCodes}</span> رمز دخول إضافي
                  </div>
                  
                  {usedCodes >= teacherCodeLimit && (
                    <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="text-sm text-red-700">
                        لقد وصلت إلى الحد الأقصى من رموز الدخول. يرجى حذف بعض الرموز القديمة أو الاتصال بالمدير لزيادة الحد المسموح به.
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <button
                    onClick={() => window.location.href = '#/access-codes'}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Key className="w-5 h-5" />
                    إدارة رموز الدخول
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherProfile;