import React, { useState } from 'react';
import { Key, User, Calendar, AlertTriangle, Check, RefreshCw, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface StudentCodeGeneratorProps {
  onSuccess: () => void;
}

const StudentCodeGenerator: React.FC<StudentCodeGeneratorProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    gender: 'male' as 'male' | 'female',
    grade: 1,
    expiresAt: '2026-03-01',
    notes: ''
  });
  
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateRandomCode = (): string => {
    const prefix = 'STU';
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    const grade = formData.grade.toString().padStart(2, '0');
    return `${prefix}${grade}${randomPart}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'grade' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Create student record
      const studentData = {
        name: formData.studentName.trim(),
        gender: formData.gender,
        grade: formData.grade,
        teacher_id: null,
        join_date: new Date().toISOString(),
        last_active: new Date().toISOString(),
        is_active: true,
        notes: formData.notes || `طالب تم إنشاؤه من لوحة تحكم المدير`,
        parent_email: null,
        student_number: null,
        class_room_ids: []
      };
      
      const { data: studentRecord, error: studentError } = await supabase
        .from('students')
        .insert([studentData])
        .select()
        .single();
      
      if (studentError) {
        throw new Error(`فشل في إنشاء سجل الطالب: ${studentError.message}`);
      }
      
      // Step 2: Generate access code
      const keyCode = generateRandomCode();
      
      const accessCodeData = {
        code: keyCode,
        grade: formData.grade,
        description: `مفتاح دخول للطالب: ${formData.studentName.trim()} - الصف ${formData.grade}`,
        teacher_id: null,
        expires_at: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
        is_active: true,
        usage_count: 0,
        max_usage: null, // Unlimited usage until expiration
        student_id: studentRecord.id,
        teacher_name: null,
        teacher_phone: null,
        is_teacher: false,
        is_admin: false
      };
      
      const { error: accessCodeError } = await supabase
        .from('access_codes')
        .insert([accessCodeData]);
      
      if (accessCodeError) {
        // If access code creation fails, delete the student record
        await supabase.from('students').delete().eq('id', studentRecord.id);
        throw new Error(`فشل في إنشاء مفتاح الدخول: ${accessCodeError.message}`);
      }
      
      // Step 3: Create student progress record
      const progressData = {
        student_id: studentRecord.id,
        total_score: 0,
        current_streak: 0,
        units_completed: [],
        words_learned: 0,
        last_study_date: new Date().toISOString(),
        word_progress: {},
        study_sessions: [],
        total_study_time: 0
      };
      
      await supabase.from('user_progress').insert([progressData]);
      
      setGeneratedCode(keyCode);
      onSuccess();
      
    } catch (error: any) {
      console.error('Error creating student and access code:', error);
      alert(`حدث خطأ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getTodayDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  if (generatedCode) {
    return (
      <div className="p-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-green-600">
            <Check className="w-8 h-8" />
            <h4 className="text-xl font-bold">تم إنشاء رمز الطالب بنجاح!</h4>
          </div>
          
          <div className="bg-white border-2 border-green-300 rounded-lg p-4 mb-6">
            <div className="text-3xl font-mono font-bold text-green-700 mb-2">{generatedCode}</div>
            <p className="text-gray-600">رمز دخول خاص بالطالب: {formData.studentName}</p>
          </div>
          
          <div className="flex justify-center gap-3">
            <button
              onClick={() => copyToClipboard(generatedCode)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              نسخ الرمز
            </button>
            <button
              onClick={() => {
                setGeneratedCode(null);
                setFormData({
                  studentName: '',
                  gender: 'male',
                  grade: 1,
                  expiresAt: '',
                  notes: ''
                });
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              إنشاء رمز جديد
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-800 mb-2">إنشاء رمز دخول لطالب فردي</h4>
        <p className="text-blue-700 text-sm">
          سيتم إنشاء سجل طالب جديد مع رمز دخول خاص به. الرمز صالح للاستخدام غير المحدود حتى تاريخ الانتهاء.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            اسم الطالب *
          </label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="أدخل اسم الطالب الكامل"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            الجنس *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="male">ذكر 👨‍🎓</option>
            <option value="female">أنثى 👩‍🎓</option>
          </select>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                الصف {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            تاريخ انتهاء الصلاحية (اختياري)
          </label>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              min={getTodayDate()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">اتركه فارغاً إذا كنت لا ترغب في تحديد تاريخ انتهاء</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ملاحظات (اختياري)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="ملاحظات إضافية عن الطالب..."
          />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div>
          <p className="text-yellow-800 font-semibold">معلومات هامة</p>
          <p className="text-yellow-700 text-sm">
            سيتم إنشاء سجل طالب جديد في النظام مع رمز دخول خاص. الرمز صالح للاستخدام غير المحدود حتى تاريخ الانتهاء المحدد.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !formData.studentName.trim()}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              جاري الإنشاء...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              إنشاء رمز الطالب
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default StudentCodeGenerator;