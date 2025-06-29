import React, { useState } from 'react';
import { X, UserPlus, Save } from 'lucide-react';
import { Teacher } from '../types';
import { useTeacherData } from '../hooks/useTeacherData';

interface AddStudentModalProps {
  teacher: Teacher;
  onClose: () => void;
  onSuccess: () => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ teacher, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    studentNumber: '',
    grade: teacher.grades[0] || 5,
    parentEmail: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const { addStudent } = useTeacherData(teacher.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addStudent({
        name: formData.name,
        studentNumber: formData.studentNumber || undefined,
        grade: formData.grade,
        teacherId: teacher.id,
        parentEmail: formData.parentEmail || undefined,
        notes: formData.notes || undefined,
        isActive: true,
        progress: {
          totalScore: 0,
          currentStreak: 0,
          unitsCompleted: [],
          wordsLearned: 0,
          lastStudyDate: new Date().toISOString(),
          wordProgress: {},
          studySessions: [],
          totalStudyTime: 0
        },
        achievements: []
      });

      onSuccess();
    } catch (error) {
      console.error('Error adding student:', error);
      alert('حدث خطأ أثناء إضافة الطالب');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'grade' ? Number(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <UserPlus className="w-6 h-6" />
              إضافة طالب جديد
            </h2>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Student Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              اسم الطالب *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أدخل اسم الطالب الكامل"
            />
          </div>

          {/* Student Number */}
          <div>
            <label htmlFor="studentNumber" className="block text-sm font-semibold text-gray-700 mb-2">
              رقم الطالب
            </label>
            <input
              type="text"
              id="studentNumber"
              name="studentNumber"
              value={formData.studentNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="رقم الطالب (اختياري)"
            />
          </div>

          {/* Grade */}
          <div>
            <label htmlFor="grade" className="block text-sm font-semibold text-gray-700 mb-2">
              الصف *
            </label>
            <select
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {teacher.grades.map(grade => (
                <option key={grade} value={grade}>
                  الصف {grade}
                </option>
              ))}
            </select>
          </div>

          {/* Parent Email */}
          <div>
            <label htmlFor="parentEmail" className="block text-sm font-semibold text-gray-700 mb-2">
              بريد ولي الأمر
            </label>
            <input
              type="email"
              id="parentEmail"
              name="parentEmail"
              value={formData.parentEmail}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="parent@email.com"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
              ملاحظات
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ملاحظات إضافية عن الطالب (اختياري)"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  إضافة الطالب
                </>
              )}
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

export default AddStudentModal;