import React, { useState, useEffect } from 'react';
import { Plus, Key, Users, Calendar, Eye, EyeOff, Trash2, RefreshCw, CheckCircle, XCircle, Edit2, Save, X, Clock, AlertTriangle, RotateCcw } from 'lucide-react';
import { supabase, hasValidSupabaseCredentials } from '../lib/supabase';

interface StudentKey {
  id: string;
  student_name: string;
  key_code: string;
  grade: number;
  expires_at: string;
  is_active: boolean;
  created_at: string;
  usage_count: number;
  last_used_at?: string;
  created_by?: string;
  notes?: string;
  access_code_id?: string; // Original access code ID for updates
}

const StudentManagement: React.FC = () => {
  const [studentKeys, setStudentKeys] = useState<StudentKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({});
  
  // Form state
  const [formData, setFormData] = useState({
    student_name: '',
    grade: 1,
    expires_at: ''
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadStudentKeys();
  }, []);

  const loadStudentKeys = async () => {
    setLoading(true);
    try {
      if (hasValidSupabaseCredentials()) {
        // Load access codes for students (where student_id is not null)
        const { data: accessCodes, error: accessError } = await supabase
          .from('access_codes')
          .select(`
            *,
            students (
              id,
              name,
              grade,
              join_date,
              last_active,
              is_active
            )
          `)
          .not('student_id', 'is', null)
          .eq('is_teacher', false)
          .eq('is_admin', false)
          .order('created_at', { ascending: false });
        
        if (accessError) {
          console.error('Error loading student access codes:', accessError);
        } else {
          // Convert access codes to student key format for display
          const studentKeysData = (accessCodes || []).map(code => ({
            id: code.student_id,
            student_name: code.students?.name || 'غير محدد',
            key_code: code.code,
            grade: code.grade,
            expires_at: code.expires_at,
            is_active: code.is_active,
            created_at: code.created_at,
            usage_count: code.usage_count || 0,
            last_used_at: code.students?.last_active,
            created_by: 'admin',
            notes: code.description,
            access_code_id: code.id // Store original access code ID for updates
          }));
          
          setStudentKeys(studentKeysData);
        }
      }
    } catch (error) {
      console.error('Error loading student keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomKey = (): string => {
    const prefix = 'STU';
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    const grade = formData.grade.toString().padStart(2, '0');
    return `${prefix}${grade}${randomPart}`;
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.student_name.trim()) {
      newErrors.student_name = 'اسم الطالب مطلوب';
    }
    
    if (formData.grade < 1 || formData.grade > 12) {
      newErrors.grade = 'الصف يجب أن يكون بين 1 و 12';
    }
    
    if (!formData.expires_at) {
      newErrors.expires_at = 'تاريخ انتهاء الصلاحية مطلوب';
    } else {
      const expiryDate = new Date(formData.expires_at);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (expiryDate <= today) {
        newErrors.expires_at = 'تاريخ انتهاء الصلاحية يجب أن يكون في المستقبل';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (hasValidSupabaseCredentials()) {
        // Step 1: Create student record first
        const studentData = {
          name: formData.student_name.trim(),
          grade: formData.grade,
          teacher_id: null, // No teacher assigned for now
          join_date: new Date().toISOString(),
          last_active: new Date().toISOString(),
          is_active: true,
          notes: `طالب تم إنشاؤه من لوحة تحكم المدير`,
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
          console.error('Error creating student record:', studentError);
          alert('حدث خطأ أثناء إنشاء سجل الطالب: ' + studentError.message);
          return;
        }
        
        // Step 2: Generate access code for the student (unlimited usage until expiration)
        const keyCode = generateRandomKey();
        
        const accessCodeData = {
          code: keyCode,
          grade: formData.grade,
          description: `مفتاح دخول للطالب: ${formData.student_name.trim()} - الصف ${formData.grade}`,
          teacher_id: null,
          expires_at: formData.expires_at,
          is_active: true,
          usage_count: 0,
          max_usage: null, // Unlimited usage until expiration
          student_id: studentRecord.id,
          teacher_name: null,
          teacher_phone: null,
          is_teacher: false,
          is_admin: false
        };
        
        const { data: accessCodeRecord, error: accessCodeError } = await supabase
          .from('access_codes')
          .insert([accessCodeData])
          .select()
          .single();
        
        if (accessCodeError) {
          console.error('Error creating access code:', accessCodeError);
          // If access code creation fails, delete the student record to maintain consistency
          await supabase.from('students').delete().eq('id', studentRecord.id);
          alert('حدث خطأ أثناء إنشاء مفتاح الدخول: ' + accessCodeError.message);
          return;
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
        
        const { error: progressError } = await supabase
          .from('user_progress')
          .insert([progressData]);
        
        if (progressError) {
          console.warn('Warning creating progress record:', progressError);
          // Don't fail the whole operation for progress record
        }
        
        // Add to local state (convert access code to student key format for display)
        const studentKeyDisplay = {
          id: studentRecord.id,
          student_name: studentRecord.name,
          key_code: accessCodeRecord.code,
          grade: accessCodeRecord.grade,
          expires_at: accessCodeRecord.expires_at,
          is_active: accessCodeRecord.is_active,
          created_at: accessCodeRecord.created_at,
          usage_count: accessCodeRecord.usage_count || 0,
          last_used_at: null,
          created_by: 'admin',
          notes: accessCodeRecord.description,
          access_code_id: accessCodeRecord.id
        };
        
        setStudentKeys([studentKeyDisplay, ...studentKeys]);
        
        alert(`تم إنشاء الطالب ومفتاح الدخول بنجاح!\nمفتاح الدخول: ${keyCode}\nصالح حتى: ${formData.expires_at}\nاستخدامات غير محدودة حتى انتهاء الصلاحية`);
      }
      
      // Reset form
      setFormData({
        student_name: '',
        grade: 1,
        expires_at: ''
      });
      setShowAddForm(false);
      setErrors({});
      
    } catch (error) {
      console.error('Error creating student and access key:', error);
      alert('حدث خطأ أثناء إنشاء الطالب ومفتاح الدخول');
    }
  };

  const toggleKeyActive = async (keyId: string, currentStatus: boolean) => {
    try {
      if (hasValidSupabaseCredentials()) {
        // Find the student key to get access_code_id
        const studentKey = studentKeys.find(key => key.id === keyId);
        if (!studentKey?.access_code_id) {
          alert('لم يتم العثور على معرف مفتاح الدخول');
          return;
        }

        const { error } = await supabase
          .from('access_codes')
          .update({ is_active: !currentStatus })
          .eq('id', studentKey.access_code_id);
        
        if (error) {
          console.error('Error updating key status:', error);
          alert('حدث خطأ أثناء تحديث حالة المفتاح: ' + error.message);
          return;
        }
        
        // Also update student status
        await supabase
          .from('students')
          .update({ is_active: !currentStatus })
          .eq('id', keyId);
        
        setStudentKeys(studentKeys.map(key => 
          key.id === keyId ? { ...key, is_active: !currentStatus } : key
        ));
        
        const statusText = !currentStatus ? 'تم تفعيل' : 'تم إلغاء تفعيل';
        alert(`${statusText} مفتاح الطالب بنجاح`);
      }
    } catch (error) {
      console.error('Error updating key status:', error);
      alert('حدث خطأ أثناء تحديث حالة المفتاح');
    }
  };

  const reactivateExpiredKey = async (keyId: string) => {
    try {
      if (hasValidSupabaseCredentials()) {
        // Find the student key to get access_code_id
        const studentKey = studentKeys.find(key => key.id === keyId);
        if (!studentKey?.access_code_id) {
          alert('لم يتم العثور على معرف مفتاح الدخول');
          return;
        }

        // Ask for new expiration date
        const newExpiryInput = prompt('أدخل تاريخ انتهاء الصلاحية الجديد (YYYY-MM-DD):');
        if (!newExpiryInput) {
          return; // User cancelled
        }

        const newExpiryDate = new Date(newExpiryInput);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (newExpiryDate <= today) {
          alert('تاريخ انتهاء الصلاحية يجب أن يكون في المستقبل');
          return;
        }

        const { error } = await supabase
          .from('access_codes')
          .update({ 
            expires_at: newExpiryInput,
            is_active: true 
          })
          .eq('id', studentKey.access_code_id);
        
        if (error) {
          console.error('Error reactivating key:', error);
          alert('حدث خطأ أثناء إعادة تفعيل المفتاح: ' + error.message);
          return;
        }
        
        // Also update student status
        await supabase
          .from('students')
          .update({ is_active: true })
          .eq('id', keyId);
        
        setStudentKeys(studentKeys.map(key => 
          key.id === keyId ? { 
            ...key, 
            expires_at: newExpiryInput,
            is_active: true 
          } : key
        ));
        
        alert(`تم إعادة تفعيل مفتاح الطالب بنجاح!\nتاريخ انتهاء الصلاحية الجديد: ${newExpiryInput}`);
      }
    } catch (error) {
      console.error('Error reactivating key:', error);
      alert('حدث خطأ أثناء إعادة تفعيل المفتاح');
    }
  };

  const deleteStudentKey = async (keyId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطالب ومفتاح الدخول الخاص به؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      return;
    }
    
    try {
      if (hasValidSupabaseCredentials()) {
        // Find the student key to get access_code_id
        const studentKey = studentKeys.find(key => key.id === keyId);
        if (!studentKey?.access_code_id) {
          alert('لم يتم العثور على معرف مفتاح الدخول');
          return;
        }

        // Delete in order: progress -> access_code -> student
        // Delete user progress first
        await supabase
          .from('user_progress')
          .delete()
          .eq('student_id', keyId);
        
        // Delete achievements
        await supabase
          .from('achievements')
          .delete()
          .eq('student_id', keyId);
        
        // Delete student activities
        await supabase
          .from('student_activities')
          .delete()
          .eq('student_id', keyId);
        
        // Delete access code
        const { error: accessCodeError } = await supabase
          .from('access_codes')
          .delete()
          .eq('id', studentKey.access_code_id);
        
        if (accessCodeError) {
          console.error('Error deleting access code:', accessCodeError);
          alert('حدث خطأ أثناء حذف مفتاح الدخول: ' + accessCodeError.message);
          return;
        }
        
        // Delete student record
        const { error: studentError } = await supabase
          .from('students')
          .delete()
          .eq('id', keyId);
        
        if (studentError) {
          console.error('Error deleting student:', studentError);
          alert('حدث خطأ أثناء حذف سجل الطالب: ' + studentError.message);
          return;
        }
        
        setStudentKeys(studentKeys.filter(key => key.id !== keyId));
        alert('تم حذف الطالب ومفتاح الدخول بنجاح');
      }
    } catch (error) {
      console.error('Error deleting student and key:', error);
      alert('حدث خطأ أثناء حذف الطالب ومفتاح الدخول');
    }
  };

  const toggleShowKey = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const isExpired = (expiresAt: string): boolean => {
    return new Date(expiresAt) <= new Date();
  };

  const getKeyStatus = (key: StudentKey) => {
    if (!key.is_active) return { status: 'inactive', color: 'text-gray-500', bg: 'bg-gray-100', text: 'غير مفعل' };
    if (isExpired(key.expires_at)) return { status: 'expired', color: 'text-red-600', bg: 'bg-red-100', text: 'منتهي الصلاحية' };
    return { status: 'active', color: 'text-green-600', bg: 'bg-green-100', text: 'مفعل' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTodayDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // At least tomorrow
    return today.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="mr-3 text-gray-600">جاري تحميل مفاتيح الطلاب...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-600" />
            إدارة مفاتيح الطلاب
          </h3>
          <p className="text-gray-600 mt-2">إنشاء وإدارة مفاتيح الدخول للطلاب</p>
        </div>
        
          <div className="flex gap-3">
            <button
            onClick={loadStudentKeys}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            تحديث
          </button>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            إضافة طالب جديد
            </button>
        </div>
      </div>

      {/* Add Student Form */}
      {showAddForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              إضافة طالب جديد
            </h4>
            <button
              onClick={() => {
                setShowAddForm(false);
                setErrors({});
                setFormData({
                  student_name: '',
                  grade: 1,
                  expires_at: ''
                });
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
        </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الطالب *
                </label>
                <input
                  type="text"
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.student_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="أدخل اسم الطالب"
                />
                {errors.student_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.student_name}</p>
                )}
          </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الصف *
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.grade ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      الصف {i + 1}
                    </option>
                  ))}
                </select>
                {errors.grade && (
                  <p className="text-red-500 text-sm mt-1">{errors.grade}</p>
                )}
          </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ انتهاء الصلاحية *
                </label>
                <input
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  min={getTodayDate()}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.expires_at ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.expires_at && (
                  <p className="text-red-500 text-sm mt-1">{errors.expires_at}</p>
                )}
            </div>
          </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                إنشاء المفتاح
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Student Keys List */}
      <div className="space-y-4">
        {studentKeys.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد مفاتيح طلاب</h3>
            <p className="text-gray-500 mb-6">ابدأ بإنشاء مفتاح دخول للطلاب</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              إضافة طالب جديد
            </button>
          </div>
        ) : (
          studentKeys.map((key) => {
            const keyStatus = getKeyStatus(key);
            return (
              <div key={key.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
          <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">{key.student_name}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${keyStatus.bg} ${keyStatus.color}`}>
                        {keyStatus.text}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        الصف {key.grade}
                      </span>
          </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        <span className="font-medium">المفتاح:</span>
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 px-2 py-1 rounded">
                            {showKeys[key.id] ? key.key_code : '••••••••'}
                          </code>
                          <button
                            onClick={() => toggleShowKey(key.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {showKeys[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
        </div>
      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">تاريخ الإنشاء:</span>
                        <div>
                          <div>{formatDate(key.created_at)}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(key.created_at).toLocaleDateString('ar-SA-u-ca-islamic')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">ينتهي في:</span>
                        {editingKey === key.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="date"
                              defaultValue={key.expires_at.split('T')[0]}
                              min={getTodayDate()}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  reactivateExpiredKey(key.id);
                                } else if (e.key === 'Escape') {
                                  setEditingKey(null);
                                }
                              }}
                              onBlur={(e) => reactivateExpiredKey(key.id)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                              autoFocus
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className={isExpired(key.expires_at) ? 'text-red-600 font-medium' : ''}>
                              <div>{formatDate(key.expires_at)}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(key.expires_at).toLocaleDateString('ar-SA-u-ca-islamic')}
                              </div>
                            </div>
                            <button
                              onClick={() => setEditingKey(key.id)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        <span className="font-medium">الاستخدام:</span>
                        <span>
                          {key.usage_count}
                      </span>
                      </div>
                    </div>
                    
                    {key.last_used_at && (
                      <div className="mt-2 text-sm text-gray-500">
                        آخر استخدام: {formatDate(key.last_used_at)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isExpired(key.expires_at) ? (
                      <button
                        onClick={() => reactivateExpiredKey(key.id)}
                        className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                        title="إعادة تفعيل مع تاريخ جديد"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    ) : (
                        <button
                        onClick={() => toggleKeyActive(key.id, key.is_active)}
                        className={`p-2 rounded-lg transition-colors ${
                          key.is_active 
                            ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={key.is_active ? 'إلغاء تفعيل المفتاح' : 'تفعيل المفتاح'}
                      >
                        {key.is_active ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </button>
                    )}
                    
                        <button
                      onClick={() => deleteStudentKey(key.id)}
                      className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                      title="حذف المفتاح"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
        </div>

                {isExpired(key.expires_at) && key.is_active && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        هذا المفتاح منتهي الصلاحية. استخدم زر إعادة التفعيل لتحديد تاريخ صلاحية جديد.
                      </span>
                    </div>
                  </div>
                )}
          </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentManagement;