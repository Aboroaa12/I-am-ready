import React, { useState, useEffect } from 'react';
import TeacherManagement from './TeacherManagement';
import StudentManagement from './StudentManagement';
import AccessCodeSettings from './AccessCodeSettings';
import VocabularyExtractor from './VocabularyExtractor';
import GrammarExtractor from './GrammarExtractor';
import ProgressTestingPanel from './ProgressTestingPanel';
import { Database, BookOpen, Shield, Users, Settings, Key, Trash2, AlertTriangle, RefreshCw, CheckCircle, Book, Calculator, FlaskRound as Flask, FileText, Bookmark, GraduationCap, Activity, TestTube } from 'lucide-react';
import { supabase, checkSupabaseConnection, deleteAllRecords, getTableCount } from '../lib/supabase';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'teachers' | 'access-codes' | 'vocabulary' | 'grammar' | 'testing'>('overview');
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showTestingPanel, setShowTestingPanel] = useState(false);
  const [databaseStats, setDatabaseStats] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkConnection();
    loadDatabaseStats();
  }, []);

  const checkConnection = async () => {
    const connected = await checkSupabaseConnection();
    setIsConnected(connected);
  };

  const loadDatabaseStats = async () => {
    setLoading(true);
    try {
      const tables = ['teachers', 'students', 'access_codes', 'vocabulary_words', 'grammar_rules', 'quiz_questions'];
      const stats: {[key: string]: number} = {};
      
      for (const table of tables) {
        const count = await getTableCount(table);
        stats[table] = count;
      }
      
      setDatabaseStats(stats);
    } catch (error) {
      console.error('Error loading database stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearTable = async (tableName: string) => {
    if (!confirm(`هل أنت متأكد من حذف جميع البيانات من جدول ${tableName}؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
      return;
    }

    setLoading(true);
    try {
      let totalDeleted = 0;
      
      // Handle students table with foreign key dependencies
      if (tableName === 'students') {
        // Delete dependent records first
        const dependentTables = ['user_progress', 'achievements', 'student_activities'];
        
        for (const depTable of dependentTables) {
          const depResult = await deleteAllRecords(depTable);
          if (depResult.success) {
            totalDeleted += depResult.count;
          } else {
            throw new Error(`فشل في حذف البيانات من جدول ${depTable}: ${depResult.error}`);
          }
        }
        
        // Now delete from students table
        const result = await deleteAllRecords(tableName);
        if (result.success) {
          totalDeleted += result.count;
          alert(`تم حذف ${totalDeleted} سجل إجمالي (${result.count} طالب و ${totalDeleted - result.count} سجل مرتبط) بنجاح`);
        } else {
          throw new Error(result.error);
        }
      } else {
        // Handle other tables normally
        const result = await deleteAllRecords(tableName);
        if (result.success) {
          alert(`تم حذف ${result.count} سجل من جدول ${tableName} بنجاح`);
        } else {
          throw new Error(result.error);
        }
      }
      
      await loadDatabaseStats();
    } catch (error) {
      console.error('Error clearing table:', error);
      alert(`حدث خطأ أثناء حذف البيانات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: Database },
    { id: 'students', label: 'إدارة الطلاب', icon: Users },
    { id: 'teachers', label: 'إدارة المعلمين', icon: GraduationCap },
    { id: 'access-codes', label: 'إعدادات رموز الدخول', icon: Key },
    { id: 'vocabulary', label: 'إدارة المفردات', icon: BookOpen },
    { id: 'grammar', label: 'إدارة القواعد', icon: Book },
    { id: 'testing', label: 'اختبار النظام', icon: TestTube }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-purple-500">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">لوحة تحكم المدير</h1>
                <p className="text-gray-600">إدارة شاملة للمنصة التعليمية</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                isConnected === null ? 'bg-gray-100 text-gray-600' :
                isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {isConnected === null ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                    جاري التحقق...
                  </>
                ) : isConnected ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    متصل بقاعدة البيانات
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    غير متصل
                  </>
                )}
              </div>
              <button
                onClick={checkConnection}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                تحديث الحالة
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600 bg-purple-50'
                      : 'border-transparent text-gray-600 hover:text-purple-600 hover:border-purple-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Database Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  <Database className="w-6 h-6 text-purple-600" />
                  إحصائيات قاعدة البيانات
                </h3>
                <button
                  onClick={loadDatabaseStats}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  تحديث
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(databaseStats).map(([table, count]) => {
                  const tableNames: {[key: string]: string} = {
                    'teachers': 'المعلمين',
                    'students': 'الطلاب',
                    'access_codes': 'رموز الدخول',
                    'vocabulary_words': 'المفردات',
                    'grammar_rules': 'القواعد النحوية',
                    'quiz_questions': 'أسئلة الاختبارات'
                  };

                  return (
                    <div key={table} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-800">{tableNames[table] || table}</h4>
                        <div className="text-2xl font-bold text-blue-600">{count}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">سجل</span>
                        <button
                          onClick={() => handleClearTable(table)}
                          disabled={loading || count === 0}
                          className="bg-red-100 hover:bg-red-200 disabled:bg-gray-100 text-red-700 disabled:text-gray-400 px-3 py-1 rounded text-xs transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          مسح الكل
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Activity className="w-6 h-6 text-green-600" />
                إجراءات سريعة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('students')}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-4 rounded-lg transition-colors flex flex-col items-center gap-2"
                >
                  <Users className="w-8 h-8" />
                  <span className="font-semibold">إدارة الطلاب</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('teachers')}
                  className="bg-green-100 hover:bg-green-200 text-green-700 p-4 rounded-lg transition-colors flex flex-col items-center gap-2"
                >
                  <GraduationCap className="w-8 h-8" />
                  <span className="font-semibold">إدارة المعلمين</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('vocabulary')}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 p-4 rounded-lg transition-colors flex flex-col items-center gap-2"
                >
                  <BookOpen className="w-8 h-8" />
                  <span className="font-semibold">إدارة المفردات</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('grammar')}
                  className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 p-4 rounded-lg transition-colors flex flex-col items-center gap-2"
                >
                  <Book className="w-8 h-8" />
                  <span className="font-semibold">إدارة القواعد</span>
                </button>
                
                <button
                  onClick={() => setShowTestingPanel(true)}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-700 p-4 rounded-lg transition-colors flex flex-col items-center gap-2"
                >
                  <TestTube className="w-8 h-8" />
                  <span className="font-semibold">اختبار النظام</span>
                </button>
              </div>
            </div>

            {/* System Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Settings className="w-6 h-6 text-gray-600" />
                معلومات النظام
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700">حالة الاتصال</h4>
                  <div className={`p-3 rounded-lg ${
                    isConnected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {isConnected ? '✅ متصل بقاعدة البيانات' : '❌ غير متصل بقاعدة البيانات'}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700">إجمالي البيانات</h4>
                  <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
                    📊 {Object.values(databaseStats).reduce((sum, count) => sum + count, 0)} سجل إجمالي
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && <StudentManagement />}
        {activeTab === 'teachers' && <TeacherManagement />}
        {activeTab === 'access-codes' && <AccessCodeSettings />}
        {activeTab === 'vocabulary' && <VocabularyExtractor />}
        {activeTab === 'grammar' && <GrammarExtractor />}
        {activeTab === 'testing' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">اختبار النظام</h3>
              <p className="text-gray-600 mb-6">اختبر وظائف النظام المختلفة للتأكد من عملها بشكل صحيح</p>
              <button
                onClick={() => setShowTestingPanel(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                <TestTube className="w-5 h-5" />
                فتح لوحة الاختبار
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Testing Panel Modal */}
      {showTestingPanel && (
        <ProgressTestingPanel
          onClose={() => setShowTestingPanel(false)}
        />
      )}
    </div>
  );
};

export default AdminPanel;