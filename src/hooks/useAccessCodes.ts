import { useState, useEffect } from 'react';
import { AccessCode } from '../types';
import { supabase } from '../lib/supabase';

const ACCESS_CODES_STORAGE_KEY = 'teacher-access-codes';

export const useAccessCodes = (teacherId: string) => {
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teacherCodeLimit, setTeacherCodeLimit] = useState(20); // الحد الافتراضي

  useEffect(() => {
    loadAccessCodes();
    getTeacherCodeLimit(teacherId).then(limit => setTeacherCodeLimit(limit));
  }, [teacherId]);

  const loadAccessCodes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // محاولة تحميل الرموز من Supabase
      const { data, error } = await supabase
        .from('access_codes')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // تحويل البيانات من تنسيق Supabase إلى تنسيق التطبيق
        const formattedCodes: AccessCode[] = data.map(code => ({
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
          classRoomId: code.class_room_id
        }));
        
        setAccessCodes(formattedCodes);
      } else {
        // إذا لم يتم العثور على بيانات، نحاول تحميلها من التخزين المحلي
        const savedCodes = localStorage.getItem(`${ACCESS_CODES_STORAGE_KEY}-${teacherId}`);
        if (savedCodes) {
          setAccessCodes(JSON.parse(savedCodes));
        } else {
          // إذا لم يتم العثور على بيانات في التخزين المحلي، نقوم بإنشاء بيانات نموذجية
          const sampleCodes = generateSampleAccessCodes(teacherId);
          setAccessCodes(sampleCodes);
          localStorage.setItem(`${ACCESS_CODES_STORAGE_KEY}-${teacherId}`, JSON.stringify(sampleCodes));
          
          // محاولة إضافة البيانات النموذجية إلى Supabase
          for (const code of sampleCodes) {
            await supabase.from('access_codes').insert({
              id: code.id,
              code: code.code,
              grade: code.grade,
              description: code.description,
              teacher_id: code.teacherId,
              teacher_name: code.teacherName,
              teacher_phone: code.teacherPhone,
              created_at: code.createdAt,
              expires_at: code.expiresAt,
              is_active: code.isActive,
              usage_count: code.usageCount || 0,
              max_usage: code.maxUsage,
              student_id: code.studentId,
              class_room_id: code.classRoomId
            });
          }
        }
      }
    } catch (err: any) {
      console.error('Error loading access codes:', err);
      setError(err.message);
      
      // في حالة الفشل، نحاول تحميل البيانات من التخزين المحلي
      const savedCodes = localStorage.getItem(`${ACCESS_CODES_STORAGE_KEY}-${teacherId}`);
      if (savedCodes) {
        setAccessCodes(JSON.parse(savedCodes));
      } else {
        const sampleCodes = generateSampleAccessCodes(teacherId);
        setAccessCodes(sampleCodes);
        localStorage.setItem(`${ACCESS_CODES_STORAGE_KEY}-${teacherId}`, JSON.stringify(sampleCodes));
      }
    } finally {
      setLoading(false);
    }
  };

  const addAccessCode = async (codeData: Omit<AccessCode, 'id' | 'createdAt' | 'teacherId' | 'usageCount'>) => {
    // التحقق من حد الرموز المسموح به للمعلم
    if (accessCodes.length >= teacherCodeLimit) {
      throw new Error(`لقد وصلت إلى الحد الأقصى المسموح به من رموز الدخول (${teacherCodeLimit}). يرجى حذف بعض الرموز القديمة أو الاتصال بالمدير لزيادة الحد.`);
    }
    
    // التحقق من عدم تكرار الرمز
    const codeExists = accessCodes.some(code => code.code === codeData.code);
    if (codeExists) {
      throw new Error('هذا الرمز موجود بالفعل. يرجى اختيار رمز آخر.');
    }
    
    const newCode: AccessCode = {
      id: crypto.randomUUID(),
      ...codeData,
      teacherId,
      createdAt: new Date().toISOString(),
      usageCount: 0
    };

    try {
      // إضافة الرمز إلى Supabase
      const { error } = await supabase.from('access_codes').insert({
        id: newCode.id,
        code: newCode.code,
        grade: newCode.grade,
        description: newCode.description,
        teacher_id: newCode.teacherId,
        teacher_name: newCode.teacherName,
        teacher_phone: newCode.teacherPhone,
        created_at: newCode.createdAt,
        expires_at: newCode.expiresAt,
        is_active: newCode.isActive,
        usage_count: 0,
        max_usage: newCode.maxUsage,
        student_id: newCode.studentId,
        class_room_id: newCode.classRoomId
      });
      
      if (error) {
        throw error;
      }
      
      // تحديث الحالة المحلية
      const updatedCodes = [...accessCodes, newCode];
      setAccessCodes(updatedCodes);
      
      // تحديث التخزين المحلي (للنسخ الاحتياطي)
      localStorage.setItem(`${ACCESS_CODES_STORAGE_KEY}-${teacherId}`, JSON.stringify(updatedCodes));
      
      return newCode;
    } catch (err: any) {
      console.error('Error adding access code:', err);
      setError(err.message);
      
      // في حالة الفشل، نحاول الإضافة محلياً
      const updatedCodes = [...accessCodes, newCode];
      setAccessCodes(updatedCodes);
      localStorage.setItem(`${ACCESS_CODES_STORAGE_KEY}-${teacherId}`, JSON.stringify(updatedCodes));
      
      return newCode;
    }
  };

  const updateAccessCode = async (codeId: string, updates: Partial<Omit<AccessCode, 'id' | 'teacherId' | 'createdAt'>>) => {
    // التحقق من عدم تكرار الرمز
    if (updates.code) {
      const codeExists = accessCodes.some(code => code.code === updates.code && code.id !== codeId);
      if (codeExists) {
        throw new Error('هذا الرمز موجود بالفعل. يرجى اختيار رمز آخر.');
      }
    }
    
    try {
      // تحديث الرمز في Supabase
      const supabaseUpdates: any = {};
      
      if (updates.code) supabaseUpdates.code = updates.code;
      if (updates.grade) supabaseUpdates.grade = updates.grade;
      if (updates.description) supabaseUpdates.description = updates.description;
      if (updates.expiresAt !== undefined) supabaseUpdates.expires_at = updates.expiresAt;
      if (updates.isActive !== undefined) supabaseUpdates.is_active = updates.isActive;
      if (updates.maxUsage !== undefined) supabaseUpdates.max_usage = updates.maxUsage;
      if (updates.studentId !== undefined) supabaseUpdates.student_id = updates.studentId;
      if (updates.classRoomId !== undefined) supabaseUpdates.class_room_id = updates.classRoomId;
      if (updates.teacherName) supabaseUpdates.teacher_name = updates.teacherName;
      if (updates.teacherPhone) supabaseUpdates.teacher_phone = updates.teacherPhone;
      
      const { error } = await supabase
        .from('access_codes')
        .update(supabaseUpdates)
        .eq('id', codeId);
      
      if (error) {
        throw error;
      }
      
      // تحديث الحالة المحلية
      const updatedCodes = accessCodes.map(code =>
        code.id === codeId ? { ...code, ...updates } : code
      );
      setAccessCodes(updatedCodes);
      
      // تحديث التخزين المحلي (للنسخ الاحتياطي)
      localStorage.setItem(`${ACCESS_CODES_STORAGE_KEY}-${teacherId}`, JSON.stringify(updatedCodes));
    } catch (err: any) {
      console.error('Error updating access code:', err);
      setError(err.message);
      
      // في حالة الفشل، نحاول التحديث محلياً
      const updatedCodes = accessCodes.map(code =>
        code.id === codeId ? { ...code, ...updates } : code
      );
      setAccessCodes(updatedCodes);
      localStorage.setItem(`${ACCESS_CODES_STORAGE_KEY}-${teacherId}`, JSON.stringify(updatedCodes));
    }
  };

  const deleteAccessCode = async (codeId: string) => {
    try {
      // حذف الرمز من Supabase
      const { error } = await supabase
        .from('access_codes')
        .delete()
        .eq('id', codeId);
      
      if (error) {
        throw error;
      }
      
      // تحديث الحالة المحلية
      const updatedCodes = accessCodes.filter(code => code.id !== codeId);
      setAccessCodes(updatedCodes);
      
      // تحديث التخزين المحلي (للنسخ الاحتياطي)
      localStorage.setItem(`${ACCESS_CODES_STORAGE_KEY}-${teacherId}`, JSON.stringify(updatedCodes));
    } catch (err: any) {
      console.error('Error deleting access code:', err);
      setError(err.message);
      
      // في حالة الفشل، نحاول الحذف محلياً
      const updatedCodes = accessCodes.filter(code => code.id !== codeId);
      setAccessCodes(updatedCodes);
      localStorage.setItem(`${ACCESS_CODES_STORAGE_KEY}-${teacherId}`, JSON.stringify(updatedCodes));
    }
  };

  const incrementUsageCount = async (code: string) => {
    try {
      // تحديث عدد مرات الاستخدام في Supabase
      const { data, error } = await supabase
        .from('access_codes')
        .select('id, usage_count')
        .eq('code', code)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const newCount = (data.usage_count || 0) + 1;
        
        const { error: updateError } = await supabase
          .from('access_codes')
          .update({ usage_count: newCount })
          .eq('id', data.id);
        
        if (updateError) {
          throw updateError;
        }
        
        // تحديث الحالة المحلية
        const updatedCodes = accessCodes.map(c =>
          c.code === code ? { ...c, usageCount: newCount } : c
        );
        setAccessCodes(updatedCodes);
        
        // تحديث التخزين المحلي (للنسخ الاحتياطي)
        localStorage.setItem(`${ACCESS_CODES_STORAGE_KEY}-${teacherId}`, JSON.stringify(updatedCodes));
      }
    } catch (err: any) {
      console.error('Error incrementing usage count:', err);
      setError(err.message);
      
      // في حالة الفشل، نحاول التحديث محلياً
      const updatedCodes = accessCodes.map(c =>
        c.code === code ? { ...c, usageCount: (c.usageCount || 0) + 1 } : c
      );
      setAccessCodes(updatedCodes);
      localStorage.setItem(`${ACCESS_CODES_STORAGE_KEY}-${teacherId}`, JSON.stringify(updatedCodes));
    }
  };

  const generateRandomCode = () => {
    // إنشاء رمز عشوائي مكون من 8 أحرف وأرقام
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // تم إزالة الأحرف المتشابهة
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // التأكد من عدم تكرار الرمز
    const codeExists = accessCodes.some(code => code.code === result);
    if (codeExists) {
      return generateRandomCode(); // إعادة المحاولة
    }
    
    return result;
  };
  
  // الحصول على حد الرموز المسموح به للمعلم
  const getTeacherCodeLimit = async (teacherId: string): Promise<number> => {
    try {
      // محاولة الحصول على الحد من Supabase
      const { data, error } = await supabase
        .from('teachers')
        .select('code_limit')
        .eq('id', teacherId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data && data.code_limit) {
        return data.code_limit;
      }
      
      // إذا لم يتم العثور على الحد في Supabase، نحاول الحصول عليه من التخزين المحلي
      const savedLimits = localStorage.getItem('admin-teacher-code-limits');
      if (savedLimits) {
        const limits = JSON.parse(savedLimits);
        return limits[teacherId] || limits['default'] || 20;
      }
      
      return 20; // الحد الافتراضي
    } catch (err) {
      console.error('Error getting teacher code limit:', err);
      
      // في حالة الفشل، نحاول الحصول على الحد من التخزين المحلي
      const savedLimits = localStorage.getItem('admin-teacher-code-limits');
      if (savedLimits) {
        const limits = JSON.parse(savedLimits);
        return limits[teacherId] || limits['default'] || 20;
      }
      
      return 20; // الحد الافتراضي في حالة الخطأ
    }
  };

  return {
    accessCodes,
    addAccessCode,
    updateAccessCode,
    deleteAccessCode,
    incrementUsageCount,
    generateRandomCode,
    loading,
    error,
    teacherCodeLimit,
    refreshCodes: loadAccessCodes
  };
};

// Helper function to generate sample data
const generateSampleAccessCodes = (teacherId: string): AccessCode[] => {
  const generateRandomCode = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Get teacher's grades
  const teacherGrades = [5, 6]; // Default grades if not available

  return [
    {
      id: '1',
      code: generateRandomCode(),
      grade: teacherGrades[0],
      description: 'رمز دخول لطلاب الصف الخامس - المجموعة أ',
      teacherId,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
      isActive: true,
      usageCount: 5,
      teacherName: 'أستاذة فاطمة أحمد',
      teacherPhone: '0501234567'
    },
    {
      id: '2',
      code: generateRandomCode(),
      grade: teacherGrades[0],
      description: 'رمز دخول لطلاب الصف الخامس - المجموعة ب',
      teacherId,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      isActive: true,
      usageCount: 8,
      teacherName: 'أستاذة فاطمة أحمد',
      teacherPhone: '0501234567'
    },
    {
      id: '3',
      code: generateRandomCode(),
      grade: teacherGrades.length > 1 ? teacherGrades[1] : teacherGrades[0],
      description: 'رمز دخول مؤقت للطلاب الجدد',
      teacherId,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (expired)
      isActive: true,
      usageCount: 3,
      teacherName: 'أستاذة فاطمة أحمد',
      teacherPhone: '0501234567'
    },
    {
      id: '4',
      code: generateRandomCode(),
      grade: teacherGrades.length > 1 ? teacherGrades[1] : teacherGrades[0],
      description: 'رمز دخول للاختبار - غير نشط',
      teacherId,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
      isActive: false,
      usageCount: 0,
      teacherName: 'أستاذة فاطمة أحمد',
      teacherPhone: '0501234567'
    }
  ];
};