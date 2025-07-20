import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// تهيئة عميل Supabase باستخدام متغيرات البيئة
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// التحقق من وجود المتغيرات المطلوبة
const hasValidCredentials = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url_here' && 
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.startsWith('eyJ');

if (!hasValidCredentials) {
  console.warn('⚠️ Supabase credentials are missing or invalid. Please update your .env file with valid credentials.');
  console.warn('📝 Instructions:');
  console.warn('1. Go to your Supabase project dashboard');
  console.warn('2. Navigate to Settings → API');
  console.warn('3. Copy your Project URL and anon/public key');
  console.warn('4. Update the .env file with these values');
  console.warn('5. Restart your development server');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// دالة مساعدة للتحقق من حالة الاتصال مع معالجة أفضل للأخطاء
export const checkSupabaseConnection = async (): Promise<boolean> => {
  // إذا لم تكن المتغيرات صحيحة، ارجع false مباشرة
  if (!hasValidCredentials) {
    console.log('Supabase connection skipped: Invalid or missing credentials');
    return false;
  }

  try {
    // استخدام timeout قصير جداً للتحقق من الاتصال
    const timeoutPromise = new Promise<never>((_, reject) => {
      window.setTimeout(() => reject(new Error('Connection timeout')), 1000);
    });

    // استخدام استعلام بسيط للتحقق من الاتصال
    const connectionPromise = supabase.from('health_check').select('*').limit(1);
    
    // استخدام Promise.race مع timeout
    const result = await Promise.race([
      connectionPromise,
      timeoutPromise
    ]);
    
    if (result.error) {
      console.log('Supabase connection failed, working in offline mode');
      return false;
    }
    
    console.log('Supabase connection successful');
    return true;
  } catch (error: any) {
    // تسجيل بسيط للخطأ والعمل في وضع عدم الاتصال
    console.log('Working in offline mode - Supabase unavailable');
    return false;
  }
};

// دالة للتحقق من صحة المتغيرات
export const hasValidSupabaseCredentials = (): boolean => {
  return hasValidCredentials;
};

// دالة للتحقق من وجود جدول أو سجل معين
export const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('count', { count: 'exact', head: true });
    
    return !error;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};

// دالة للتحقق من عدد السجلات في جدول معين
export const getTableCount = async (tableName: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      throw error;
    }
    
    return count || 0;
  } catch (error) {
    console.error(`Error getting count for table ${tableName}:`, error);
    return 0;
  }
};

// دالة لحذف جميع السجلات من جدول معين
export const deleteAllRecords = async (tableName: string): Promise<{ success: boolean; count: number; error?: string }> => {
  try {
    // أولاً، نحصل على عدد السجلات قبل الحذف
    const beforeCount = await getTableCount(tableName);
    
    // ثم نحذف جميع السجلات
    const { error } = await supabase
      .from(tableName)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // حذف جميع السجلات
    
    if (error) {
      return { success: false, count: 0, error: error.message };
    }
    
    // نتحقق من عدد السجلات بعد الحذف
    const afterCount = await getTableCount(tableName);
    const deletedCount = beforeCount - afterCount;
    
    return { 
      success: afterCount === 0, 
      count: deletedCount
    };
  } catch (error: any) {
    return { 
      success: false, 
      count: 0, 
      error: error.message || 'حدث خطأ غير معروف' 
    };
  }
};