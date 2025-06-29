import React, { useState, useEffect } from 'react';
import { Key, Plus, Edit, Trash2, Copy, RefreshCw, Download, Calendar, Clock, AlertTriangle, CheckCircle, XCircle, Save } from 'lucide-react';
import { teachersData } from '../data/gradeAccess';
import { supabase } from '../lib/supabase';
import AdminCodeGenerator from './AdminCodeGenerator';

const AccessCodeSettings: React.FC = () => {
  const [teacherLimits, setTeacherLimits] = useState(() => {
    const savedLimits = localStorage.getItem('admin-teacher-code-limits');
    return savedLimits ? JSON.parse(savedLimits) : {
      'teacher-001': 20,
      'teacher-002': 20,
      'teacher-003': 20,
      'teacher-004': 20,
      'teacher-005': 20,
      'default': 20
    };
  });
  
  const [globalSettings, setGlobalSettings] = useState(() => {
    const savedSettings = localStorage.getItem('admin-access-code-settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      defaultExpiryDays: 90,
      requireExpiry: false,
      maxUsagePerCode: 30,
      requireDescription: true,
      allowTeacherCustomCodes: true
    };
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [accessCodes, setAccessCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [editingCode, setEditingCode] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  useEffect(() => {
    // تحميل جميع رموز الدخول من جميع المعلمين
    loadAllAccessCodes();
    
    // تحميل الإعدادات من Supabase
    loadSettingsFromSupabase();
    
    // تحميل المعلمين
    loadTeachers();
  }, []);
  
  const loadTeachers = async () => {
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
        
        // تحديث teacherNames بناءً على البيانات المحملة
        const teacherNamesObj: {[key: string]: string} = {};
        data.forEach(teacher => {
          const gradesText = Array.isArray(teacher.grades) ? 
            ` - ${teacher.grades.map((g: number) => `الصف ${g}`).join(', ')}` : '';
          teacherNamesObj[teacher.id] = `${teacher.name}${gradesText}`;
        });
        
        // إضافة الحد الافتراضي
        teacherNamesObj['default'] = 'الحد الافتراضي للمعلمين الجدد';
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
    }
  };
  
  const loadSettingsFromSupabase = async () => {
    try {
      // تحميل إعدادات رموز الدخول
      const { data: accessCodeSettings, error: accessCodeError } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'access_code_settings')
        .single();
      
      if (!accessCodeError && accessCodeSettings) {
        setGlobalSettings(accessCodeSettings.value);
        localStorage.setItem('admin-access-code-settings', JSON.stringify(accessCodeSettings.value));
      }
      
      // تحميل حدود رموز الدخول للمعلمين
      const { data: teacherLimitsData, error: teacherLimitsError } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'teacher_code_limits')
        .single();
      
      if (!teacherLimitsError && teacherLimitsData) {
        setTeacherLimits(teacherLimitsData.value);
        localStorage.setItem('admin-teacher-code-limits', JSON.stringify(teacherLimitsData.value));
      }
    } catch (error) {
      console.error('Error loading settings from Supabase:', error);
    }
  };
  
  const loadAllAccessCodes = async () => {
    setLoading(true);
    try {
      // محاولة تحميل جميع رموز الدخول من Supabase
      const { data, error } = await supabase
        .from('access_codes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        // تحويل البيانات من تنسيق Supabase إلى تنسيق التطبيق
        const formattedCodes = data.map(code => ({
          id: code.id,
          code: code.code,
          grade: code.grade,
          description: code.description,
          teacherId: code.teacher_id,
          teacherName: code.teacher_name,
          teacherPhone: code.teacher_phone,
          createdAt: code.created_at,
          expiresAt: code.expires_at,
          isActive: code.is_active,
          usageCount: code.usage_count || 0,
          maxUsage: code.max_usage,
          studentId: code.student_id,
          classRoomId: code.class_room_id,
          isTeacher: code.is_teacher
        }));
        
        setAccessCodes(formattedCodes);
        setLoading(false);
        return;
      }
      
      // إذا فشل التحميل من Supabase، نحاول تحميل البيانات من التخزين المحلي
      const allCodes: any[] = [];
      
      // تحميل رموز الدخول من جميع المعلمين
      Object.keys(teachersData).forEach(teacherId => {
        const savedCodes = localStorage.getItem(`teacher-access-codes-${teacherId}`);
        if (savedCodes) {
          const teacherCodes = JSON.parse(savedCodes);
          // إضافة اسم المعلم لكل رمز
          const codesWithTeacherInfo = teacherCodes.map((code: any) => ({
            ...code,
            teacherName: teachersData[teacherId as keyof typeof teachersData].name,
            teacherId
          }));
          allCodes.push(...codesWithTeacherInfo);
        }
      });
      
      setAccessCodes(allCodes);
    } catch (error) {
      console.error('Error loading access codes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveSettings = async () => {
    try {
      // حفظ الإعدادات في Supabase
      const { error: accessCodeError } = await supabase
        .from('settings')
        .update({ value: globalSettings })
        .eq('key', 'access_code_settings');
      
      if (accessCodeError) {
        throw accessCodeError;
      }
      
      const { error: teacherLimitsError } = await supabase
        .from('settings')
        .update({ value: teacherLimits })
        .eq('key', 'teacher_code_limits');
      
      if (teacherLimitsError) {
        throw teacherLimitsError;
      }
      
      // حفظ الإعدادات في التخزين المحلي
      localStorage.setItem('admin-teacher-code-limits', JSON.stringify(teacherLimits));
      localStorage.setItem('admin-access-code-settings', JSON.stringify(globalSettings));
      setIsEditing(false);
      
      // إظهار رسالة نجاح
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'تم حفظ الإعدادات بنجاح';
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
    } catch (error) {
      console.error('Error saving settings to Supabase:', error);
      
      // حفظ الإعدادات في التخزين المحلي فقط
      localStorage.setItem('admin-teacher-code-limits', JSON.stringify(teacherLimits));
      localStorage.setItem('admin-access-code-settings', JSON.stringify(globalSettings));
      setIsEditing(false);
      
      // إظهار رسالة نجاح مع تحذير
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'تم حفظ الإعدادات محلياً فقط. فشل الحفظ في قاعدة البيانات.';
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
  
  const handleLimitChange = (teacherId: string, value: number) => {
    setTeacherLimits(prev => ({
      ...prev,
      [teacherId]: value
    }));
  };
  
  const handleGlobalSettingChange = (setting: string, value: any) => {
    setGlobalSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  const getTeacherNames = () => {
    const result: {[key: string]: string} = {
      'default': 'الحد الافتراضي للمعلمين الجدد'
    };
    
    // إضافة المعلمين من قائمة المعلمين المحملة
    teachers.forEach(teacher => {
      const gradesText = Array.isArray(teacher.grades) ? 
        ` - ${teacher.grades.map((g: number) => `الصف ${g}`).join(', ')}` : '';
      result[teacher.id] = `${teacher.name}${gradesText}`;
    });
    
    return result;
  };
  
  const teacherNames = getTeacherNames();
  
  const filteredTeachers = Object.entries(teacherNames).filter(([id, name]) => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getCodeStatus = (code: any): { status: string, color: string } => {
    if (!code.isActive) return { status: 'غير نشط', color: 'text-gray-600 bg-gray-100' };
    
    if (code.expiresAt) {
      const expiryDate = new Date(code.expiresAt);
      if (expiryDate.getTime() < Date.now()) {
        return { status: 'منتهي', color: 'text-red-600 bg-red-100' };
      }
      
      const daysLeft = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 3) {
        return { status: `ينتهي خلال ${daysLeft} أيام`, color: 'text-orange-600 bg-orange-100' };
      }
      if (daysLeft <= 7) {
        return { status: `ينتهي خلال ${daysLeft} أيام`, color: 'text-yellow-600 bg-yellow-100' };
      }
    }
    
    return { status: 'نشط', color: 'text-green-600 bg-green-100' };
  };
  
  const filteredCodes = accessCodes.filter(code => 
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.teacherName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const teacherCodes = filteredCodes.filter(code => code.isTeacher);
  const studentCodes = filteredCodes.filter(code => !code.isTeacher);

  const handleEditCode = (code: any) => {
    setEditingCode(code);
    setShowEditModal(true);
  };

  const handleDeleteCode = async (codeId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الرمز؟')) {
      try {
        // حذف الرمز من Supabase
        const { error } = await supabase
          .from('access_codes')
          .delete()
          .eq('id', codeId);
        
        if (error) {
          throw error;
        }
        
        // تحديث القائمة
        setAccessCodes(prev => prev.filter(code => code.id !== codeId));
        
        // إظهار رسالة نجاح
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
        notification.textContent = 'تم حذف الرمز بنجاح';
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
      } catch (error) {
        console.error('Error deleting access code:', error);
        
        // إظهار رسالة خطأ
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
        notification.textContent = 'حدث خطأ أثناء حذف الرمز';
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
    }
  };

  const handleUpdateCode = async (updatedCode: any) => {
    try {
      // تحديث الرمز في Supabase
      const { error } = await supabase
        .from('access_codes')
        .update({
          code: updatedCode.code,
          grade: updatedCode.grade,
          description: updatedCode.description,
          expires_at: updatedCode.expiresAt,
          is_active: updatedCode.isActive,
          max_usage: updatedCode.maxUsage,
          teacher_name: updatedCode.teacherName,
          teacher_phone: updatedCode.teacherPhone
        })
        .eq('id', updatedCode.id);
      
      if (error) {
        throw error;
      }
      
      // تحديث القائمة
      setAccessCodes(prev => prev.map(code => 
        code.id === updatedCode.id ? updatedCode : code
      ));
      
      setShowEditModal(false);
      
      // إظهار رسالة نجاح
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'تم تحديث الرمز بنجاح';
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
    } catch (error) {
      console.error('Error updating access code:', error);
      
      // إظهار رسالة خطأ
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = 'حدث خطأ أثناء تحديث الرمز';
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
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Key className="w-8 h-8 text-blue-600" />
            إدارة رموز الدخول
          </h2>
          <p className="text-gray-600">إنشاء وتعديل وحذف رموز الدخول للمعلمين والطلاب</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowGeneratorModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            إنشاء رمز معلم
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isEditing ? 'إلغاء' : 'تعديل الإعدادات'}
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <Key className="w-6 h-6 text-purple-600" />
            إعدادات رموز الدخول
          </h3>
          
          {isEditing && (
            <button
              onClick={handleSaveSettings}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4 inline mr-2" />
              حفظ التغييرات
            </button>
          )}
        </div>
        
        <div className="bg-purple-50 p-6 rounded-xl mb-8 border border-purple-200">
          <h4 className="text-lg font-bold text-purple-800 mb-4">حدود رموز الدخول للمعلمين</h4>
          <p className="text-purple-700 mb-4">
            تحديد الحد الأقصى لعدد رموز الدخول التي يمكن لكل معلم إنشاؤها للطلاب
          </p>
          
          {/* Search */}
          {Object.keys(teacherNames).length > 5 && (
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="البحث عن معلم..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          )}
          
          <div className="grid gap-4">
            {filteredTeachers.map(([teacherId, name]) => (
              <div key={teacherId} className="flex items-center justify-between bg-white p-4 rounded-lg border border-purple-100">
                <div className="font-semibold text-gray-800">{name}</div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={teacherLimits[teacherId]}
                      onChange={(e) => handleLimitChange(teacherId, parseInt(e.target.value))}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                    />
                  ) : (
                    <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-bold">
                      {teacherLimits[teacherId]} رمز
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h4 className="text-lg font-bold text-blue-800 mb-4">الإعدادات العامة لرموز الدخول</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-blue-100">
              <div>
                <div className="font-semibold text-gray-800">مدة صلاحية الرمز الافتراضية</div>
                <div className="text-sm text-gray-600">عدد الأيام التي يبقى فيها الرمز صالحاً</div>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={globalSettings.defaultExpiryDays}
                    onChange={(e) => handleGlobalSettingChange('defaultExpiryDays', parseInt(e.target.value))}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                  />
                ) : (
                  <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold">
                    {globalSettings.defaultExpiryDays} يوم
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-blue-100">
              <div>
                <div className="font-semibold text-gray-800">إلزام المعلمين بتحديد تاريخ انتهاء</div>
                <div className="text-sm text-gray-600">يجب على المعلمين تحديد تاريخ انتهاء لكل رمز</div>
              </div>
              <div>
                {isEditing ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={globalSettings.requireExpiry}
                      onChange={(e) => handleGlobalSettingChange('requireExpiry', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                ) : (
                  <div className={`px-4 py-2 rounded-lg font-bold ${globalSettings.requireExpiry ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {globalSettings.requireExpiry ? 'نعم' : 'لا'}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-blue-100">
              <div>
                <div className="font-semibold text-gray-800">الحد الأقصى لاستخدامات الرمز الواحد</div>
                <div className="text-sm text-gray-600">عدد المرات التي يمكن استخدام الرمز فيها</div>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={globalSettings.maxUsagePerCode}
                    onChange={(e) => handleGlobalSettingChange('maxUsagePerCode', parseInt(e.target.value))}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                  />
                ) : (
                  <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold">
                    {globalSettings.maxUsagePerCode} مرة
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-blue-100">
              <div>
                <div className="font-semibold text-gray-800">إلزام المعلمين بإدخال وصف للرمز</div>
                <div className="text-sm text-gray-600">يجب على المعلمين إدخال وصف لكل رمز</div>
              </div>
              <div>
                {isEditing ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={globalSettings.requireDescription}
                      onChange={(e) => handleGlobalSettingChange('requireDescription', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                ) : (
                  <div className={`px-4 py-2 rounded-lg font-bold ${globalSettings.requireDescription ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {globalSettings.requireDescription ? 'نعم' : 'لا'}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-blue-100">
              <div>
                <div className="font-semibold text-gray-800">السماح للمعلمين بإنشاء رموز مخصصة</div>
                <div className="text-sm text-gray-600">السماح للمعلمين بتحديد نص الرمز بأنفسهم</div>
              </div>
              <div>
                {isEditing ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={globalSettings.allowTeacherCustomCodes}
                      onChange={(e) => handleGlobalSettingChange('allowTeacherCustomCodes', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                ) : (
                  <div className={`px-4 py-2 rounded-lg font-bold ${globalSettings.allowTeacherCustomCodes ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {globalSettings.allowTeacherCustomCodes ? 'نعم' : 'لا'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Teachers Codes */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <Key className="w-6 h-6 text-blue-600" />
            رموز دخول المعلمين
          </h3>
          
          <div className="flex gap-2">
            <button
              onClick={loadAllAccessCodes}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
              title="تحديث"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => {
                // تصدير رموز المعلمين
                const csvContent = [
                  ['الرمز', 'الصف', 'الوصف', 'المعلم', 'تاريخ الإنشاء', 'تاريخ الانتهاء', 'عدد الاستخدامات', 'الحالة'].join(','),
                  ...teacherCodes.map(code => [
                    code.code,
                    code.grade,
                    code.description || '',
                    code.teacherName || '',
                    new Date(code.createdAt).toLocaleDateString('ar-SA'),
                    code.expiresAt ? new Date(code.expiresAt).toLocaleDateString('ar-SA') : 'غير محدد',
                    code.usageCount || 0,
                    code.isActive ? 'نشط' : 'غير نشط'
                  ].join(','))
                ].join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', `teacher_access_codes_${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              تصدير
            </button>
            
            <button
              onClick={() => setShowGeneratorModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إنشاء رمز معلم
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="البحث في الرموز..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل رموز الدخول...</p>
          </div>
        ) : (
          <>
            {teacherCodes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الرمز</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الصف</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الوصف</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">المعلم</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">تاريخ الإنشاء</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">تاريخ الانتهاء</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الاستخدامات</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الحالة</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {teacherCodes.map((code) => {
                      const codeStatus = getCodeStatus(code);
                      
                      return (
                        <tr key={code.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold">{code.code}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(code.code);
                                  // إظهار رسالة نجاح
                                  const notification = document.createElement('div');
                                  notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
                                  notification.textContent = 'تم نسخ الرمز بنجاح';
                                  document.body.appendChild(notification);
                                  
                                  setTimeout(() => {
                                    notification.style.opacity = '0';
                                    notification.style.transform = 'translate(-50%, -100%)';
                                    setTimeout(() => {
                                      if (document.body.contains(notification)) {
                                        document.body.removeChild(notification);
                                      }
                                    }, 300);
                                  }, 2000);
                                }}
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                                title="نسخ الرمز"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                              الصف {code.grade}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-gray-800">{code.description || '-'}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-gray-800">{code.teacherName || '-'}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(code.createdAt).toLocaleDateString('ar-SA')}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-600">
                              {code.expiresAt ? (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {new Date(code.expiresAt).toLocaleDateString('ar-SA')}
                                </div>
                              ) : (
                                'غير محدد'
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm font-semibold text-gray-800">
                              {code.usageCount || 0}
                              {code.maxUsage ? ` / ${code.maxUsage}` : ''}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${codeStatus.color}`}>
                              {codeStatus.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditCode(code)}
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
                                title="تعديل"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCode(code.id)}
                                className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Key className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد رموز دخول للمعلمين</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'لم يتم العثور على رموز تطابق معايير البحث' : 'لم يتم إنشاء أي رموز دخول للمعلمين بعد'}
                </p>
                
                <button
                  onClick={() => setShowGeneratorModal(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  إنشاء رمز معلم جديد
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Students Codes */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <Key className="w-6 h-6 text-green-600" />
            رموز دخول الطلاب
          </h3>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                // تصدير رموز الطلاب
                const csvContent = [
                  ['الرمز', 'الصف', 'الوصف', 'المعلم', 'تاريخ الإنشاء', 'تاريخ الانتهاء', 'عدد الاستخدامات', 'الحالة'].join(','),
                  ...studentCodes.map(code => [
                    code.code,
                    code.grade,
                    code.description || '',
                    code.teacherName || '',
                    new Date(code.createdAt).toLocaleDateString('ar-SA'),
                    code.expiresAt ? new Date(code.expiresAt).toLocaleDateString('ar-SA') : 'غير محدد',
                    code.usageCount || 0,
                    code.isActive ? 'نشط' : 'غير نشط'
                  ].join(','))
                ].join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', `student_access_codes_${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              تصدير
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل رموز الدخول...</p>
          </div>
        ) : (
          <>
            {studentCodes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الرمز</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الصف</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الوصف</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">المعلم</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">تاريخ الإنشاء</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">تاريخ الانتهاء</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الاستخدامات</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الحالة</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {studentCodes.map((code) => {
                      const codeStatus = getCodeStatus(code);
                      
                      return (
                        <tr key={code.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold">{code.code}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(code.code);
                                  // إظهار رسالة نجاح
                                  const notification = document.createElement('div');
                                  notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
                                  notification.textContent = 'تم نسخ الرمز بنجاح';
                                  document.body.appendChild(notification);
                                  
                                  setTimeout(() => {
                                    notification.style.opacity = '0';
                                    notification.style.transform = 'translate(-50%, -100%)';
                                    setTimeout(() => {
                                      if (document.body.contains(notification)) {
                                        document.body.removeChild(notification);
                                      }
                                    }, 300);
                                  }, 2000);
                                }}
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                                title="نسخ الرمز"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                              الصف {code.grade}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-gray-800">{code.description || '-'}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-gray-800">{code.teacherName || '-'}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(code.createdAt).toLocaleDateString('ar-SA')}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-600">
                              {code.expiresAt ? (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {new Date(code.expiresAt).toLocaleDateString('ar-SA')}
                                </div>
                              ) : (
                                'غير محدد'
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm font-semibold text-gray-800">
                              {code.usageCount || 0}
                              {code.maxUsage ? ` / ${code.maxUsage}` : ''}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${codeStatus.color}`}>
                              {codeStatus.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditCode(code)}
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
                                title="تعديل"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCode(code.id)}
                                className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Key className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد رموز دخول للطلاب</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'لم يتم العثور على رموز تطابق معايير البحث' : 'لم يتم إنشاء أي رموز دخول للطلاب بعد'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Modal for generating teacher code */}
      {showGeneratorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setShowGeneratorModal(false)}
                className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-gray-700 p-2 rounded-full transition-colors z-10"
              >
                <XCircle className="w-5 h-5" />
              </button>
              
              <AdminCodeGenerator 
                onSuccess={() => {
                  loadAllAccessCodes();
                  setTimeout(() => setShowGeneratorModal(false), 3000);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Code Modal */}
      {showEditModal && editingCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <Key className="w-6 h-6" />
                تعديل رمز الدخول
              </h3>
              <p className="opacity-90 text-sm">
                قم بتعديل بيانات رمز الدخول
              </p>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateCode(editingCode);
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رمز الدخول *
                </label>
                <input
                  type="text"
                  value={editingCode.code}
                  onChange={(e) => setEditingCode({...editingCode, code: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الصف *
                </label>
                <select
                  value={editingCode.grade}
                  onChange={(e) => setEditingCode({...editingCode, grade: parseInt(e.target.value)})}
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
                  الوصف *
                </label>
                <input
                  type="text"
                  value={editingCode.description}
                  onChange={(e) => setEditingCode({...editingCode, description: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  تاريخ انتهاء الصلاحية
                </label>
                <input
                  type="date"
                  value={editingCode.expiresAt ? new Date(editingCode.expiresAt).toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditingCode({...editingCode, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : null})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الحد الأقصى للاستخدامات
                </label>
                <input
                  type="number"
                  value={editingCode.maxUsage || 0}
                  onChange={(e) => setEditingCode({...editingCode, maxUsage: parseInt(e.target.value) || null})}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  اتركه 0 إذا كنت لا ترغب في تحديد عدد الاستخدامات
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingCode.isActive}
                  onChange={(e) => setEditingCode({...editingCode, isActive: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                  الرمز نشط
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  حفظ التغييرات
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessCodeSettings;