import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getGradeByCode } from '../data/gradeAccess';
import AdminPanel from './AdminPanel';
import TeacherDashboard from './TeacherDashboard';
import { Teacher } from '../types';

interface LoginScreenProps {
  onLogin: (grade: number, accessCode?: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gradeAccess, setGradeAccess] = useState<any>(null);

  useEffect(() => {
    if (accessCode) {
      const accessData = getGradeByCode(accessCode);
      setGradeAccess(accessData);
    }
  }, [accessCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const accessData = getGradeByCode(accessCode);
      
      if (accessData?.isAdmin) {
        return;
      }

      // Check access codes in database
      const { data: codes, error: codeError } = await supabase
        .from('access_codes')
        .select('*')
        .eq('code', accessCode)
        .eq('is_active', true);

      if (codeError) throw codeError;

      if (!codes || codes.length === 0) {
        setError('رمز الدخول غير صحيح');
        return;
      }

      const code = codes[0];

      // Check if it's a teacher code
      if (code.is_teacher) {
        // Get teacher data
        const { data: teachers, error: teacherError } = await supabase
          .from('teachers')
          .select('*')
          .eq('id', code.teacher_id);

        if (teacherError) throw teacherError;

        if (teachers && teachers.length > 0) {
          const teacher = teachers[0];
          // Render teacher dashboard directly
          return;
        }
      }

      // Handle student login
      onLogin(code.grade, accessCode);

    } catch (err) {
      console.error('Login error:', err);
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  // Check if admin
  if (gradeAccess.isAdmin) {
    return <AdminPanel />;
  }

  // Check if teacher
  if (gradeAccess.isTeacher && gradeAccess.teacherId) {
    const teacher: Teacher = {
      id: gradeAccess.teacherId,
      name: gradeAccess.teacherName || 'معلم',
      email: '',
      grades: [],
      students: [],
      join_date: new Date().toISOString(),
      is_active: true,
      code_limit: 20
    };

    return <TeacherDashboard teacher={teacher} onLogout={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">أنا مستعد</h1>
          <p className="text-gray-600">منصة التعلم التفاعلية</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
              رمز الدخول
            </label>
            <input
              type="text"
              id="accessCode"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل رمز الدخول"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'جاري التحقق...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;