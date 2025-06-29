import React, { useState, useEffect } from 'react';
import { Key, Plus, Copy, Calendar, User, Users, School, AlertTriangle, Check, X, RefreshCw } from 'lucide-react';
import { Teacher } from '../types';
import { useAccessCodes } from '../hooks/useAccessCodes';
import { getGradeGradientColor } from '../utils/gradeColors';

interface TeacherCodeGeneratorProps {
  teacher: Teacher;
  onSuccess: () => void;
}

const TeacherCodeGenerator: React.FC<TeacherCodeGeneratorProps> = ({ teacher, onSuccess }) => {
  const [formData, setFormData] = useState({
    code: '',
    grade: teacher.grades[0] || 5,
    description: '',
    expiresAt: '',
    maxUsage: 30,
    isForClass: false,
    classId: '',
    isForStudent: false,
    studentId: '',
    teacherPhone: teacher.phone || '',
    teacherName: teacher.name
  });
  
  const [showCopied, setShowCopied] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [globalSettings, setGlobalSettings] = useState<any>({});
  
  const { 
    accessCodes, 
    addAccessCode, 
    generateRandomCode,
    teacherCodeLimit
  } = useAccessCodes(teacher.id);
  
  const usedCodes = accessCodes.length;
  const remainingCodes = teacherCodeLimit - usedCodes;
  
  useEffect(() => {
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
      
      // تعيين الحد الأقصى للاستخدامات
      if (settings.maxUsagePerCode > 0) {
        setFormData(prev => ({
          ...prev,
          maxUsage: settings.maxUsagePerCode
        }));
      }
    }
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const handleGenerateCode = () => {
    // التحقق مما إذا كان مسموحاً للمعلم بإنشاء رموز مخصصة
    if (!globalSettings.allowTeacherCustomCodes) {
      // إظهار رسالة خطأ
      alert('غير مسموح للمعلمين بإنشاء رموز مخصصة. سيتم إنشاء رمز عشوائي عند الحفظ.');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      code: generateRandomCode()
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من الحد الأقصى للرموز
    if (usedCodes >= teacherCodeLimit) {
      alert(`لقد وصلت إلى الحد الأقصى المسموح به من رموز الدخول (${teacherCodeLimit}). يرجى حذف بعض الرموز القديمة أو الاتصال بالمدير لزيادة الحد.`);
      return;
    }
    
    // التحقق من الإعدادات العامة
    if (globalSettings.requireExpiry && !formData.expiresAt) {
      alert('يجب تحديد تاريخ انتهاء للرمز');
      return;
    }
    
    if (globalSettings.requireDescription && !formData.description.trim()) {
      alert('يجب إدخال وصف للرمز');
      return;
    }
    
    // إذا لم يكن مسموحاً للمعلم بإنشاء رموز مخصصة، استخدم رمزاً عشوائياً
    let finalCode = formData.code;
    if (!globalSettings.allowTeacherCustomCodes || !finalCode) {
      finalCode = generateRandomCode();
    }
    
    try {
      const newCode = addAccessCode({
        code: finalCode,
        grade: formData.grade,
        description: formData.description,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined,
        isActive: true,
        maxUsage: formData.maxUsage > 0 ? formData.maxUsage : undefined,
        studentId: formData.isForStudent ? formData.studentId : undefined,
        classRoomId: formData.isForClass ? formData.classId : undefined,
        teacherName: formData.teacherName,
        teacherPhone: formData.teacherPhone
      });
      
      setGeneratedCode(finalCode);
      
      // إعادة تعيين النموذج
      setFormData({
        ...formData,
        code: '',
        description: '',
        isForClass: false,
        classId: '',
        isForStudent: false,
        studentId: ''
      });
      
      onSuccess();
    } catch (error: any) {
      alert(error.message);
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
            <h3 className="text-xl font-bold">إنشاء رمز دخول جديد</h3>
            <p className="opacity-90">أنشئ رمز دخول للطلاب للوصول إلى المحتوى التعليمي</p>
          </div>
        </div>
      </div>
      
      {/* Access Code Limits Warning */}
      {usedCodes >= teacherCodeLimit ? (
        <div className="bg-red-50 border-b border-red-200 p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <div>
            <p className="text-red-800 font-semibold">لقد وصلت إلى الحد الأقصى من رموز الدخول</p>
            <p className="text-red-700 text-sm">لإنشاء رموز جديدة، يرجى حذف بعض الرموز القديمة أو الاتصال بالمدير لزيادة الحد المسموح به.</p>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border-b border-blue-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-blue-800 font-semibold">الرموز المتاحة: {remainingCodes} من أصل {teacherCodeLimit}</p>
            </div>
          </div>
          <div className="text-sm text-blue-700">
            يمكنك إنشاء {remainingCodes} رمز دخول إضافي
          </div>
        </div>
      )}
      
      {generatedCode ? (
        <div className="p-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4 text-green-600">
              <Check className="w-8 h-8" />
              <h4 className="text-xl font-bold">تم إنشاء الرمز بنجاح!</h4>
            </div>
            
            <div className="bg-white border-2 border-green-300 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <div className="text-3xl font-mono font-bold text-green-700 mb-2">{generatedCode}</div>
              <p className="text-gray-600">يمكن للطلاب استخدام هذا الرمز للدخول إلى المنصة</p>
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
              يمكنك مشاركة هذا الرمز مع طلابك عبر البريد الإلكتروني أو الرسائل النصية
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
                  <div className="text-sm text-gray-600">المدرسة</div>
                  <div className="font-semibold">{teacher.schoolName || 'غير محدد'}</div>
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
                رمز الدخول {globalSettings.allowTeacherCustomCodes ? '(اختياري)' : ''}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="أدخل رمز الدخول أو اتركه فارغاً للتوليد التلقائي"
                  disabled={!globalSettings.allowTeacherCustomCodes}
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
              {!globalSettings.allowTeacherCustomCodes && (
                <p className="text-xs text-red-500 mt-1">غير مسموح للمعلمين بإنشاء رموز مخصصة. سيتم إنشاء رمز عشوائي عند الحفظ.</p>
              )}
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
                {teacher.grades.map(grade => (
                  <option key={grade} value={grade}>الصف {grade}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
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
                placeholder="مثال: رمز دخول لطلاب الصف الخامس - المجموعة أ"
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
            
            <div className="md:col-span-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isForClass"
                    name="isForClass"
                    checked={formData.isForClass}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        isForClass: e.target.checked,
                        isForStudent: e.target.checked ? false : prev.isForStudent
                      }));
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isForClass" className="text-sm font-semibold text-gray-700">
                    رمز مخصص لفصل دراسي
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isForStudent"
                    name="isForStudent"
                    checked={formData.isForStudent}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        isForStudent: e.target.checked,
                        isForClass: e.target.checked ? false : prev.isForClass
                      }));
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isForStudent" className="text-sm font-semibold text-gray-700">
                    رمز مخصص لطالب
                  </label>
                </div>
              </div>
              
              {formData.isForClass && (
                <div className="mt-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    اختر الفصل
                  </label>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    <select
                      name="classId"
                      value={formData.classId}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">اختر الفصل</option>
                      <option value="class-5a">الصف الخامس أ</option>
                      <option value="class-5b">الصف الخامس ب</option>
                    </select>
                  </div>
                </div>
              )}
              
              {formData.isForStudent && (
                <div className="mt-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    اختر الطالب
                  </label>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <select
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">اختر الطالب</option>
                      <option value="student-1">أحمد محمد علي</option>
                      <option value="student-2">فاطمة أحمد</option>
                      <option value="student-3">محمد عبدالله</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-yellow-800 font-semibold">معلومات هامة</p>
                  <p className="text-yellow-700 text-sm">سيتم ربط رمز الدخول باسمك ورقم هاتفك. يمكن للطلاب استخدام هذا الرمز للوصول إلى المحتوى التعليمي للصف المحدد.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={usedCodes >= teacherCodeLimit}
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

export default TeacherCodeGenerator;