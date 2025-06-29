import React, { useState, useEffect } from 'react';
import { BookOpen, Key, Eye, EyeOff, GraduationCap, Shield, Users, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { gradeAccessCodes, getGradeByCode } from '../data/gradeAccess';
import { GradeAccess } from '../types';
import { getGradeGradientColor, getGradeLightColor } from '../utils/gradeColors';
import { supabase, hasValidSupabaseCredentials } from '../lib/supabase';

interface LoginScreenProps {
  onLogin: (gradeAccess: GradeAccess) => void;
  selectedGrade?: number;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, selectedGrade }) => {
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [accessCodes, setAccessCodes] = useState<{[grade: number]: GradeAccess[]}>({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // التحقق من الاتصال بـ Supabase
    const checkConnection = async () => {
      if (!hasValidSupabaseCredentials()) {
        setIsConnected(false);
        return;
      }

      try {
        const { data, error } = await supabase.from('health_check').select('*').limit(1);
        setIsConnected(!error);
      } catch (err) {
        setIsConnected(false);
      }
    };
    
    checkConnection();
    
    // Check for grade parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const gradeParam = urlParams.get('grade');
    
    if (gradeParam) {
      const selectedGrade = parseInt(gradeParam, 10);
      // Clear URL parameter after reading it
      window.history.replaceState({}, document.title, window.location.pathname);
      // Set the selected grade for the login screen
      // setSelectedGrade(selectedGrade);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // محاكاة تأخير التحقق
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // أولاً، نتحقق من الرمز في Supabase إذا كانت المتغيرات صحيحة
      if (isConnected && hasValidSupabaseCredentials()) {
        // البحث في جدول access_codes أولاً
        const { data: accessCodeData, error: accessCodeError } = await supabase
          .from('access_codes')
          .select('*')
          .eq('code', code.trim())
          .eq('is_active', true);
        
        // إذا لم يكن هناك خطأ ووجدت بيانات في access_codes
        if (!accessCodeError && accessCodeData && accessCodeData.length > 0) {
          const accessCode = accessCodeData[0]; // أخذ أول نتيجة
          
          // التحقق من صلاحية الرمز
          if (accessCode.expires_at && new Date(accessCode.expires_at) < new Date()) {
            setError('رمز الدخول منتهي الصلاحية');
            setIsLoading(false);
            return;
          }
          
          // التحقق من عدد مرات الاستخدام (للمعلمين والمديرين فقط)
          if (accessCode.is_teacher && accessCode.max_usage && accessCode.usage_count >= accessCode.max_usage) {
            setError('تم الوصول إلى الحد الأقصى لاستخدام هذا الرمز');
            setIsLoading(false);
            return;
          }
          
          // تحديث عدد مرات الاستخدام
          await supabase
            .from('access_codes')
            .update({ usage_count: (accessCode.usage_count || 0) + 1 })
            .eq('id', accessCode.id);
          
          // تسجيل الدخول
          const access: GradeAccess = {
            grade: accessCode.grade,
            name: `الصف ${accessCode.grade}`,
            code: accessCode.code,
            isTeacher: accessCode.is_teacher,
            isAdmin: accessCode.is_admin,
            teacherId: accessCode.teacher_id
          };
          
          // إذا كان هناك صف محدد وكان المستخدم مديراً، قم بتعيين الصف المحدد
          if (selectedGrade !== undefined && access.isAdmin) {
            onLogin({ ...access, grade: selectedGrade });
          } else {
            onLogin(access);
          }
          
          setIsLoading(false);
          return;
        }
        
        // إذا لم نجد في access_codes للمعلمين، نبحث عن access_codes للطلاب
        const { data: studentAccessData, error: studentAccessError } = await supabase
          .from('access_codes')
          .select(`
            *,
            students (
              id,
              name,
              grade,
              last_active
            )
          `)
          .eq('code', code.trim())
          .eq('is_active', true)
          .eq('is_teacher', false)
          .eq('is_admin', false)
          .not('student_id', 'is', null);
        
        // إذا لم يكن هناك خطأ ووجدت بيانات للطلاب
        if (!studentAccessError && studentAccessData && studentAccessData.length > 0) {
          const studentAccess = studentAccessData[0]; // أخذ أول نتيجة
          
          // التحقق من صلاحية المفتاح
          if (studentAccess.expires_at && new Date(studentAccess.expires_at) < new Date()) {
            setError('مفتاح الطالب منتهي الصلاحية');
            setIsLoading(false);
            return;
          }
          
          // للطلاب: لا يوجد حد أقصى للاستخدام، فقط انتهاء الصلاحية
          
          // تحديث عدد مرات الاستخدام
          await supabase
            .from('access_codes')
            .update({ 
              usage_count: (studentAccess.usage_count || 0) + 1
            })
            .eq('id', studentAccess.id);
          
          // تحديث آخر نشاط للطالب
          if (studentAccess.student_id) {
            await supabase
              .from('students')
              .update({ 
                last_active: new Date().toISOString()
              })
              .eq('id', studentAccess.student_id);
          }
          
          // تسجيل دخول الطالب
          const access: GradeAccess = {
            grade: studentAccess.grade,
            name: `${studentAccess.students?.name || 'طالب'} - الصف ${studentAccess.grade}`,
            code: studentAccess.code,
            isTeacher: false,
            isAdmin: false,
            isStudent: true,
            studentName: studentAccess.students?.name || 'طالب',
            studentKeyId: studentAccess.student_id
          };
          
          onLogin(access);
          setIsLoading(false);
          return;
        }
        
        // إذا كان هناك خطأ غير متوقع
        if ((accessCodeError && accessCodeError.code !== 'PGRST116') || 
            (studentAccessError && studentAccessError.code !== 'PGRST116')) {
          console.error('Supabase error:', accessCodeError || studentAccessError);
          // لا نرمي خطأ هنا، بل نتابع للتحقق من الرموز المحلية
        }
      }
      
      // إذا لم يتم العثور على الرمز في Supabase أو حدث خطأ، نتحقق من الرموز الثابتة
      const gradeAccess = getGradeByCode(code.trim());
      
      if (gradeAccess) {
        // إذا كان هناك صف محدد وكان المستخدم مديراً، قم بتعيين الصف المحدد
        if (selectedGrade !== undefined && gradeAccess.isAdmin) {
          onLogin({ ...gradeAccess, grade: selectedGrade });
        } else {
          onLogin(gradeAccess);
        }
      } else {
        setError('الرمز السري غير صحيح. يرجى المحاولة مرة أخرى.');
      }
    } catch (err: any) {
      console.error('Error during login:', err);
      setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const getGradeIcon = (grade: number) => {
    if (grade === 0) return <Shield className="w-8 h-8" />;
    if (grade <= 6) return <BookOpen className="w-8 h-8" />;
    if (grade <= 9) return <GraduationCap className="w-8 h-8" />;
    return <Users className="w-8 h-8" />;
  };

  // Get unique grades for display (excluding teacher and admin entries)
  const uniqueGrades = Array.from(
    new Set(
      gradeAccessCodes
        .filter(grade => !grade.isTeacher && !grade.isAdmin)
        .map(grade => grade.grade)
    )
  ).sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 shadow-2xl mb-6">
            <BookOpen className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">
              أنا مستعد
            </h1>
            <p className="text-blue-100">
              للصفوف من الأول إلى الثاني عشر
            </p>
            <p className="text-yellow-200 font-semibold mt-2">
              حالياً يدعم فقط اللغة الإنجليزية لكل الصفوف ماعدا الصف السابع والثامن
            </p>
          </div>
        </div>



        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <Key className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">دخول آمن</h2>
            <p className="text-gray-600">أدخل الرمز السري للوصول إلى محتوى صفك</p>
            {selectedGrade !== undefined && (
              <div className="mt-2 bg-blue-50 text-blue-700 p-2 rounded-lg">
                <p className="font-semibold">الدخول إلى {gradeAccessCodes.find(g => g.grade === selectedGrade && !g.isTeacher && !g.isAdmin)?.name}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
                الرمز السري
              </label>
              <div className="relative">
                <input
                  type={showCode ? "text" : "password"}
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-center font-mono text-lg"
                  placeholder="أدخل الرمز السري"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  جاري التحقق...
                </>
              ) : (
                <>
                  <Key className="w-5 h-5" />
                  دخول
                </>
              )}
            </button>
          </form>
        </div>

        {/* Grade Information */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">المواد المتاحة</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg text-center shadow-md cursor-pointer transition-transform hover:scale-105">
              <div className="flex items-center justify-center mb-1">
                <span className="text-2xl">📚</span>
              </div>
              <div className="text-xs font-semibold">اللغة الإنجليزية</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-3 rounded-lg text-center shadow-md cursor-pointer transition-transform hover:scale-105">
              <div className="flex items-center justify-center mb-1">
                <span className="text-2xl">🔢</span>
              </div>
              <div className="text-xs font-semibold">الرياضيات</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-3 rounded-lg text-center shadow-md cursor-pointer transition-transform hover:scale-105">
              <div className="flex items-center justify-center mb-1">
                <span className="text-2xl">🔬</span>
              </div>
              <div className="text-xs font-semibold">العلوم</div>
            </div>
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-3 rounded-lg text-center shadow-md cursor-pointer transition-transform hover:scale-105">
              <div className="flex items-center justify-center mb-1">
                <span className="text-2xl">☪️</span>
              </div>
              <div className="text-xs font-semibold">التربية الإسلامية</div>
            </div>
            <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white p-3 rounded-lg text-center shadow-md cursor-pointer transition-transform hover:scale-105">
              <div className="flex items-center justify-center mb-1">
                <span className="text-2xl">📖</span>
              </div>
              <div className="text-xs font-semibold">اللغة العربية</div>
            </div>
            <div className="bg-gradient-to-r from-gray-500 to-slate-600 text-white p-3 rounded-lg text-center shadow-md cursor-pointer transition-transform hover:scale-105">
              <div className="flex items-center justify-center mb-1">
                <Shield className="w-6 h-6" />
              </div>
              <div className="text-xs font-semibold">وصول المدير</div>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mt-6 text-center">
          <div className={`${isConnected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border rounded-xl p-4`}>
            <p className={`text-sm ${isConnected ? 'text-green-700' : 'text-yellow-700'}`}>
              <strong>{isConnected ? '✓ متصل بقاعدة البيانات' : '⚠️ وضع غير متصل'}</strong><br />
              {isConnected 
                ? 'البيانات متزامنة ومحدثة تلقائياً'
                : hasValidSupabaseCredentials() 
                  ? 'سيتم تخزين البيانات محلياً ومزامنتها عند توفر الاتصال'
                  : 'يرجى تحديث متغيرات البيئة في ملف .env للاتصال بقاعدة البيانات'
              }
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-blue-700 text-sm">
              <strong>تحتاج مساعدة؟</strong><br />
              تواصل مع معلمك للحصول على الرمز السري الخاص بصفك
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;