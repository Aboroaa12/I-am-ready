import React, { useState, useEffect } from 'react';
import { Key, Plus, Copy, Calendar, User, Users, School, AlertTriangle, Check, X, RefreshCw, Save } from 'lucide-react';
import { teachersData } from '../data/gradeAccess';
import { getGradeGradientColor } from '../utils/gradeColors';
import { supabase } from '../lib/supabase';

interface AdminCodeGeneratorProps {
  onSuccess?: () => void;
}

const AdminCodeGenerator: React.FC<AdminCodeGeneratorProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    code: '',
    grade: 5,
    description: '',
    expiresAt: '',
    maxUsage: 30,
    isForTeacher: true,
    teacherId: '',
    teacherName: '',
    teacherPhone: '',
    isActive: true
  });
  
  const [teachers, setTeachers] = useState<any[]>([]);
  const [showCopied, setShowCopied] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [globalSettings, setGlobalSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // تحميل بيانات المعلمين
    loadTeachers();
    
    // تحميل الإعدادات العامة
    const savedSettings = localStorage.getItem('admin-access-code-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setGlobalSettings(settings);
      
      // تعيين تاريخ انتهاء افتراضي إذا كان مطلوباً
      if (settings.requireExpiry) {
        const defaultExpiry = new Date();
        defaultExpiry.setDate(defaultExpiry.getDate() + settings.defaultExpiryDays);
        setFormData(prev => ({
          ...prev,
          expiresAt: defaultExpiry.toISOString().split('T')[0]
        }));
      }
    }
  }, []);
  
  const loadTeachers = async () => {
    setLoading(true);
    try {
      // محاولة تحميل المعلمين من Supabase
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setTeachers(data);
      } else {
        // إذا لم يتم العثور على بيانات في Supabase، استخدم البيانات الثابتة
        const teachersList = Object.values(teachersData);
        setTeachers(teachersList);
      }
    } catch (err) {
      console.error('Error loading teachers:', err);
      
      // في حالة الفشل، استخدم البيانات الثابتة
      const teachersList = Object.values(teachersData);
      setTeachers(teachersList);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // إذا تم تغيير المعلم، قم بتحديث اسم المعلم ورقم هاتفه
    if (name === 'teacherId') {
      const selectedTeacher = teachers.find(t => t.id === value);
      if (selectedTeacher) {
        setFormData(prev => ({
          ...prev,
          teacherName: selectedTeacher.name,
          teacherPhone: selectedTeacher.phone || '',
          grade: selectedTeacher.grades[0] || 5
        }));
      }
    }
  };
  
  const generateRandomCode = () => {
    // إنشاء رمز عشوائي مكون من 8 أحرف وأرقام
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // تم إزالة الأحرف المتشابهة
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  
  const handleGenerateCode = () => {
    setFormData(prev => ({
      ...prev,
      code: generateRandomCode()
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من الإعدادات العامة
    if (globalSettings.requireExpiry && !formData.expiresAt) {
      alert('يجب تحديد تاريخ انتهاء للرمز');
      return;
    }
    
    if (globalSettings.requireDescription && !formData.description.trim()) {
      alert('يجب إدخال وصف للرمز');
      return;
    }
    
    // إذا لم يتم إدخال رمز، قم بتوليد رمز عشوائي
    let finalCode = formData.code;
    if (!finalCode) {
      finalCode = generateRandomCode();
    }
    
    try {
      // إنشاء رمز دخول جديد في Supabase
      const newCode = {
        id: crypto.randomUUID(),
        code: finalCode,
        grade: formData.grade,
        description: formData.description,
        teacher_id: formData.teacherId,
        teacher_name: formData.teacherName,
        teacher_phone: formData.teacherPhone,
        created_at: new Date().toISOString(),
        expires_at: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
        is_active: formData.isActive,
        usage_count: 0,
        max_usage: formData.maxUsage > 0 ? formData.maxUsage : null,
        is_teacher: formData.isForTeacher
      };
      
      const { error } = await supabase.from('access_codes').insert(newCode);
      
      if (error) {
        console.error('Error creating access code:', error);
        
        // في حالة الفشل، نحاول الإضافة محلياً
        const teacherCodesKey = `teacher-access-codes-${formData.teacherId}`;
        const savedCodes = localStorage.getItem(teacherCodesKey);
        const teacherCodes = savedCodes ? JSON.parse(savedCodes) : [];
        
        const localCode = {
          id: newCode.id,
          code: finalCode,
          grade: formData.grade,
          description: formData.description,
          teacherId: formData.teacherId,
          teacherName: formData.teacherName,
          teacherPhone: formData.teacherPhone,
          createdAt: new Date().toISOString(),
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
          isActive: formData.isActive,
          usageCount: 0,
          maxUsage: formData.maxUsage > 0 ? formData.maxUsage : null,
          isTeacher: formData.isForTeacher
        };
        
        teacherCodes.push(localCode);
        localStorage.setItem(teacherCodesKey, JSON.stringify(teacherCodes));
      }
      
      setGeneratedCode(finalCode);
      
      // إعادة تعيين النموذج
      setFormData({
        ...formData,
        code: '',
        description: '',
        expiresAt: ''
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      alert(`حدث خطأ أثناء إنشاء الرمز: ${error.message}`);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
        <div className="flex items-center gap-3">
          <Key className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">إنشاء رمز دخول للمعلم</h3>
            <p className="opacity-90">أنشئ رمز دخول خاص بمعلم محدد</p>
          </div>
        </div>
      </div>
      
      {generatedCode ? (
        <div className="p-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4 text-green-600">
              <Check className="w-8 h-8" />
              <h4 className="text-xl font-bold">تم إنشاء الرمز بنجاح!</h4>
            </div>
            
            <div className="bg-white border-2 border-green-300 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <div className="text-3xl font-mono font-bold text-green-700 mb-2">{generatedCode}</div>
              <p className="text-gray-600">يمكن للمعلم استخدام هذا الرمز للدخول إلى المنصة</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => copyToClipboard(generatedCode)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 justify-center"
              >
                <Copy className="w-5 h-5" />
                {showCopied ? 'تم النسخ!' : 'نسخ الرمز'}
              </button>
              
              <button
                onClick={() => setGeneratedCode(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 justify-center"
              >
                <Plus className="w-5 h-5" />
                إنشاء رمز جديد
              </button>
            </div>
            
            <div className="mt-6 text-sm text-gray-600">
              يمكنك مشاركة هذا الرمز مع المعلم عبر البريد الإلكتروني أو الرسائل النصية
            </div>
          </div>
          
          {/* Teacher Info Card */}
          <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              معلومات المعلم المرتبطة بالرمز
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-600">اسم المعلم</div>
                  <div className="font-semibold">{formData.teacherName}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <School className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-600">الصف</div>
                  <div className="font-semibold">الصف {formData.grade}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                اختر المعلم *
              </label>
              <select
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">اختر المعلم</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} - {Array.isArray(teacher.grades) ? teacher.grades.map((g: number) => `الصف ${g}`).join(', ') : 'غير محدد'}
                  </option>
                ))}
              </select>
              {loading && <p className="text-sm text-gray-500 mt-1">جاري تحميل المعلمين...</p>}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                رمز الدخول (اختياري)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="أدخل رمز الدخول أو اتركه فارغاً للتوليد التلقائي"
                />
                <button
                  type="button"
                  onClick={handleGenerateCode}
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded-lg transition-colors"
                  title="توليد رمز عشوائي"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
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
                وصف الرمز *
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required={globalSettings.requireDescription}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="مثال: رمز دخول للمعلم أحمد محمد"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                تاريخ انتهاء الصلاحية {globalSettings.requireExpiry ? '*' : '(اختياري)'}
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <input
                  type="date"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required={globalSettings.requireExpiry}
                />
              </div>
              {!globalSettings.requireExpiry && (
                <p className="text-xs text-gray-500 mt-1">اتركه فارغاً إذا كنت لا ترغب في تحديد تاريخ انتهاء</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الحد الأقصى للاستخدامات
              </label>
              <input
                type="number"
                name="maxUsage"
                value={formData.maxUsage}
                onChange={handleChange}
                min="0"
                max={globalSettings.maxUsagePerCode > 0 ? globalSettings.maxUsagePerCode : undefined}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="اتركه 0 لاستخدامات غير محدودة"
              />
              <p className="text-xs text-gray-500 mt-1">
                {globalSettings.maxUsagePerCode > 0 
                  ? `الحد الأقصى المسموح به: ${globalSettings.maxUsagePerCode} استخدام`
                  : 'اتركه 0 إذا كنت لا ترغب في تحديد عدد الاستخدامات'
                }
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                الرمز نشط
              </label>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isForTeacher"
                name="isForTeacher"
                checked={formData.isForTeacher}
                onChange={(e) => setFormData(prev => ({ ...prev, isForTeacher: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="isForTeacher" className="text-sm font-semibold text-gray-700">
                رمز خاص بالمعلم (وليس للطلاب)
              </label>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-semibold">معلومات هامة</p>
              <p className="text-yellow-700 text-sm">سيتم ربط رمز الدخول بالمعلم المحدد. يمكن للمعلم استخدام هذا الرمز للوصول إلى لوحة تحكم المعلم.</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!formData.teacherId}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <Key className="w-5 h-5" />
              إنشاء رمز الدخول
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminCodeGenerator;