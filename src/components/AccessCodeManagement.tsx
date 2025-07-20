import React, { useState, useEffect } from 'react';
import { Key, Plus, Edit, Trash2, Copy, RefreshCw, CheckCircle, XCircle, AlertTriangle, Download, Calendar } from 'lucide-react';
import { Teacher, Student, AccessCode } from '../types';
import { getGradeGradientColor, getGradeLightColor } from '../utils/gradeColors';
import { useAccessCodes } from '../hooks/useAccessCodes';

interface AccessCodeManagementProps {
  teacher: Teacher;
  students: Student[];
  onRefresh: () => void;
}

const AccessCodeManagement: React.FC<AccessCodeManagementProps> = ({ teacher, students, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCode, setEditingCode] = useState<AccessCode | null>(null);
  const [sortBy, setSortBy] = useState<'createdAt' | 'expiresAt' | 'grade' | 'usageCount'>('createdAt');
  const [showCopiedMessage, setShowCopiedMessage] = useState<string | null>(null);
  
  const { 
    accessCodes, 
    addAccessCode, 
    updateAccessCode, 
    deleteAccessCode, 
    generateRandomCode,
    loading,
    teacherCodeLimit
  } = useAccessCodes(teacher.id);

  const filteredCodes = accessCodes
    .filter(code => {
      const matchesSearch = code.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           code.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = selectedGrade === null || code.grade === selectedGrade;
      return matchesSearch && matchesGrade;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'expiresAt':
          if (!a.expiresAt && !b.expiresAt) return 0;
          if (!a.expiresAt) return 1;
          if (!b.expiresAt) return -1;
          return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
        case 'grade':
          return a.grade - b.grade;
        case 'usageCount':
          return (b.usageCount || 0) - (a.usageCount || 0);
        default:
          return 0;
      }
    });

  const handleAddCode = () => {
    if (accessCodes.length >= teacherCodeLimit) {
      // إظهار رسالة خطأ
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = `لقد وصلت إلى الحد الأقصى المسموح به من رموز الدخول (${teacherCodeLimit}). يرجى حذف بعض الرموز القديمة أو الاتصال بالمدير لزيادة الحد.`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -100%)';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 5000);
      
      return;
    }
    
    setEditingCode(null);
    setShowAddModal(true);
  };

  const handleEditCode = (code: AccessCode) => {
    setEditingCode(code);
    setShowAddModal(true);
  };

  const handleDeleteCode = (codeId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الرمز؟ لن يتمكن الطلاب من استخدامه للدخول.')) {
      deleteAccessCode(codeId);
      onRefresh();
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setShowCopiedMessage(code);
      setTimeout(() => setShowCopiedMessage(null), 2000);
    });
  };

  const exportCodes = () => {
    const csvContent = [
      ['الرمز', 'الصف', 'الوصف', 'تاريخ الإنشاء', 'تاريخ الانتهاء', 'عدد الاستخدامات', 'الحالة'].join(','),
      ...filteredCodes.map(code => [
        code.code,
        code.grade,
        code.description,
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
    link.setAttribute('download', `access_codes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isCodeExpired = (code: AccessCode): boolean => {
    if (!code.expiresAt) return false;
    return new Date(code.expiresAt).getTime() < Date.now();
  };

  const getCodeStatus = (code: AccessCode): { status: string, color: string } => {
    if (!code.isActive) return { status: 'غير نشط', color: 'text-gray-600 bg-gray-100' };
    if (isCodeExpired(code)) return { status: 'منتهي', color: 'text-red-600 bg-red-100' };
    
    const expiresIn = code.expiresAt ? Math.floor((new Date(code.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
    
    if (expiresIn !== null) {
      if (expiresIn <= 3) return { status: `ينتهي خلال ${expiresIn} أيام`, color: 'text-orange-600 bg-orange-100' };
      if (expiresIn <= 7) return { status: `ينتهي خلال ${expiresIn} أيام`, color: 'text-yellow-600 bg-yellow-100' };
      return { status: 'نشط', color: 'text-green-600 bg-green-100' };
    }
    
    return { status: 'نشط', color: 'text-green-600 bg-green-100' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Key className="w-8 h-8 text-blue-600" />
            إدارة رموز الدخول
          </h2>
          <p className="text-gray-600">إنشاء وإدارة رموز الدخول للطلاب</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportCodes}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            تصدير الرموز
          </button>
          <button
            onClick={handleAddCode}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            إنشاء رمز جديد
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-semibold">إجمالي الرموز</p>
              <p className="text-2xl font-bold text-blue-700">{accessCodes.length}</p>
            </div>
            <Key className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-semibold">الرموز النشطة</p>
              <p className="text-2xl font-bold text-green-700">
                {accessCodes.filter(code => code.isActive && !isCodeExpired(code)).length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-semibold">تنتهي قريباً</p>
              <p className="text-2xl font-bold text-yellow-700">
                {accessCodes.filter(code => {
                  if (!code.expiresAt || !code.isActive) return false;
                  const daysLeft = Math.floor((new Date(code.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  return daysLeft >= 0 && daysLeft <= 7;
                }).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-semibold">الحد المسموح</p>
              <p className="text-2xl font-bold text-purple-700">
                {teacherCodeLimit}
              </p>
            </div>
            <div className="relative">
              <Key className="w-8 h-8 text-purple-500" />
              {accessCodes.length >= teacherCodeLimit && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  !
                </div>
              )}
            </div>
          </div>
          <div className="mt-1 text-xs text-purple-700">
            المستخدم: {accessCodes.length} / {teacherCodeLimit}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في الرموز..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <select
            value={selectedGrade || ''}
            onChange={(e) => setSelectedGrade(e.target.value ? Number(e.target.value) : null)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">جميع الصفوف</option>
            {teacher.grades.map(grade => (
              <option key={grade} value={grade}>الصف {grade}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="createdAt">ترتيب حسب تاريخ الإنشاء</option>
            <option value="expiresAt">ترتيب حسب تاريخ الانتهاء</option>
            <option value="grade">ترتيب حسب الصف</option>
            <option value="usageCount">ترتيب حسب عدد الاستخدامات</option>
          </select>
        </div>
      </div>

      {/* Access Codes List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {accessCodes.length >= teacherCodeLimit && (
          <div className="bg-red-50 border-b border-red-200 p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-red-800 font-semibold">لقد وصلت إلى الحد الأقصى من رموز الدخول</p>
              <p className="text-red-700 text-sm">لإنشاء رموز جديدة، يرجى حذف بعض الرموز القديمة أو الاتصال بالمدير لزيادة الحد المسموح به.</p>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">الرمز</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">الصف</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">الوصف</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">تاريخ الإنشاء</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">تاريخ الانتهاء</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">الاستخدامات</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">الحالة</th>
                <th className="text-right py-4 px-6 font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCodes.map((code) => {
                const codeStatus = getCodeStatus(code);
                
                return (
                  <tr key={code.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold">{code.code}</span>
                        <button
                          onClick={() => handleCopyCode(code.code)}
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                          title="نسخ الرمز"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {showCopiedMessage === code.code && (
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            تم النسخ!
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`bg-gradient-to-r ${getGradeGradientColor(code.grade)} text-white px-2 py-1 rounded-full text-sm font-semibold`}>
                        الصف {code.grade}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-800">{code.description}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">
                        <div>{new Date(code.createdAt).toLocaleDateString('ar-SA')}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(code.createdAt).toLocaleDateString('ar-SA-u-ca-islamic')}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">
                        {code.expiresAt ? (
                          <div>
                            <div>{new Date(code.expiresAt).toLocaleDateString('ar-SA')}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(code.expiresAt).toLocaleDateString('ar-SA-u-ca-islamic')}
                            </div>
                          </div>
                        ) : 'غير محدد'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-semibold text-gray-800">
                        {code.usageCount || 0}
                        {code.maxUsage ? ` / ${code.maxUsage}` : ''}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${codeStatus.color}`}>
                        {codeStatus.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCode(code)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
                          title="تعديل الرمز"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCode(code.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                          title="حذف الرمز"
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

        {filteredCodes.length === 0 && (
          <div className="text-center py-12">
            <Key className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد رموز دخول</h3>
            <p className="text-gray-500">
              {searchTerm || selectedGrade 
                ? 'لم يتم العثور على رموز تطابق معايير البحث'
                : 'لم تقم بإنشاء أي رموز دخول بعد'
              }
            </p>
            {!searchTerm && selectedGrade === null && (
              <button
                onClick={handleAddCode}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                إنشاء رمز جديد
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <AccessCodeModal
          teacher={teacher}
          editingCode={editingCode}
          onClose={() => {
            setShowAddModal(false);
            setEditingCode(null);
          }}
          onSave={(codeData) => {
            try {
              if (editingCode) {
                updateAccessCode(editingCode.id, codeData);
              } else {
                addAccessCode(codeData);
              }
              setShowAddModal(false);
              setEditingCode(null);
              onRefresh();
            } catch (error: any) {
              // إظهار رسالة الخطأ
              alert(error.message);
            }
          }}
          onGenerateCode={generateRandomCode}
        />
      )}
    </div>
  );
};

interface AccessCodeModalProps {
  teacher: Teacher;
  editingCode: AccessCode | null;
  onClose: () => void;
  onSave: (codeData: Omit<AccessCode, 'id' | 'createdAt' | 'teacherId' | 'usageCount'>) => void;
  onGenerateCode: () => string;
}

const AccessCodeModal: React.FC<AccessCodeModalProps> = ({ 
  teacher, 
  editingCode, 
  onClose, 
  onSave,
  onGenerateCode
}) => {
  const [formData, setFormData] = useState({
    code: editingCode?.code || '',
    grade: editingCode?.grade || teacher.grades[0] || 5,
    description: editingCode?.description || '',
    expiresAt: editingCode?.expiresAt ? new Date(editingCode.expiresAt).toISOString().split('T')[0] : '',
    isActive: editingCode?.isActive ?? true,
    maxUsage: editingCode?.maxUsage || 0
  });

  // تحميل إعدادات رموز الدخول العامة
  const [globalSettings, setGlobalSettings] = useState<any>({
    requireExpiry: false,
    defaultExpiryDays: 90,
    maxUsagePerCode: 30,
    requireDescription: true,
    allowTeacherCustomCodes: true
  });
  
  useEffect(() => {
    // تحميل الإعدادات العامة
    const savedSettings = localStorage.getItem('admin-access-code-settings');
    if (savedSettings) {
      setGlobalSettings(JSON.parse(savedSettings));
      
      // تطبيق الإعدادات الافتراضية إذا كان إنشاء رمز جديد
      if (!editingCode) {
        const settings = JSON.parse(savedSettings);
        
        // تعيين تاريخ انتهاء افتراضي إذا كان مطلوباً
        if (settings.requireExpiry) {
          const defaultExpiry = new Date();
          defaultExpiry.setDate(defaultExpiry.getDate() + settings.defaultExpiryDays);
          setFormData(prev => ({
            ...prev,
            expiresAt: defaultExpiry.toISOString().split('T')[0]
          }));
        } else {
          // تعيين تاريخ انتهاء افتراضي إلى 1/3/2026 إذا لم تكن هناك إعدادات
          setFormData(prev => ({
            ...prev,
            expiresAt: '2026-03-01'
          }));
        }
        
        // تعيين الحد الأقصى للاستخدامات
        if (settings.maxUsagePerCode > 0) {
          setFormData(prev => ({
            ...prev,
            maxUsage: settings.maxUsagePerCode
          }));
        }
      } else {
        // للتعديل، إذا لم يكن هناك تاريخ انتهاء، استخدم التاريخ الافتراضي
        if (!editingCode.expiresAt) {
          setFormData(prev => ({
            ...prev,
            expiresAt: '2026-03-01'
          }));
        }
      }
    } else {
      // إذا لم تكن هناك إعدادات محفوظة، استخدم التاريخ الافتراضي
      setFormData(prev => ({
        ...prev,
        expiresAt: '2026-03-01'
      }));
      }
    }
  }, [editingCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleGenerateCode = () => {
    // التحقق مما إذا كان مسموحاً للمعلم بإنشاء رموز مخصصة
    if (!globalSettings.allowTeacherCustomCodes && !editingCode) {
      // إظهار رسالة خطأ
      alert('غير مسموح للمعلمين بإنشاء رموز مخصصة. سيتم إنشاء رمز عشوائي عند الحفظ.');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      code: onGenerateCode()
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    
    // إذا لم يكن مسموحاً للمعلم بإنشاء رموز مخصصة، استخدم رمزاً عشوائياً
    let finalCode = formData.code;
    if (!globalSettings.allowTeacherCustomCodes && !editingCode) {
      finalCode = onGenerateCode();
    }
    
    onSave({
      code: finalCode,
      grade: formData.grade,
      description: formData.description,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined,
      isActive: formData.isActive,
      maxUsage: formData.maxUsage > 0 ? formData.maxUsage : undefined,
      teacherName: teacher.name,
      teacherPhone: teacher.phone
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <Key className="w-6 h-6" />
            {editingCode ? 'تعديل رمز الدخول' : 'إنشاء رمز دخول جديد'}
          </h3>
          <p className="opacity-90 text-sm">
            {editingCode ? 'قم بتعديل بيانات رمز الدخول' : 'قم بإنشاء رمز دخول جديد للطلاب'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              رمز الدخول *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                placeholder="أدخل رمز الدخول"
                disabled={!globalSettings.allowTeacherCustomCodes && !editingCode}
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
            {!globalSettings.allowTeacherCustomCodes && !editingCode && (
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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الوصف *
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="مثال: رمز دخول لطلاب الصف الخامس - المجموعة أ"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              تاريخ الانتهاء {globalSettings.requireExpiry ? '*' : '(اختياري)'}
            </label>
            <input
              type="date"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required={globalSettings.requireExpiry}
            />
            {!globalSettings.requireExpiry && (
              <p className="text-xs text-gray-500 mt-1">اتركه فارغاً إذا كنت لا ترغب في تحديد تاريخ انتهاء</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الحد الأقصى للاستخدامات (اختياري)
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

          {/* Warning for editing */}
          {editingCode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-yellow-800 font-semibold">تنبيه عند تعديل الرمز</p>
                <p className="text-yellow-700 text-sm">تعديل الرمز نفسه قد يؤثر على الطلاب الذين يستخدمونه حالياً. يفضل إنشاء رمز جديد بدلاً من تعديل الرمز الحالي.</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {editingCode ? 'حفظ التغييرات' : 'إنشاء الرمز'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccessCodeManagement;