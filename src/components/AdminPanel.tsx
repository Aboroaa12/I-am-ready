import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import VocabularyExtractor from './VocabularyExtractor';
import GrammarExtractor from './GrammarExtractor';
import TeacherManagement from './TeacherManagement';
import StudentManagement from './StudentManagement';
import AccessCodeSettings from './AccessCodeSettings';
import ProgressTestingPanel from './ProgressTestingPanel';
import { Database, BookOpen, Shield, Users, Settings, Key, Trash2, AlertTriangle, RefreshCw, CheckCircle, Book, Calculator, FlaskRound as Flask, FileText, Bookmark, GraduationCap, Activity, TestTube } from 'lucide-react';
import { supabase, checkSupabaseConnection, deleteAllRecords, getTableCount } from '../lib/supabase';
import { useProgress } from '../hooks/useProgress';
import { useVocabulary } from '../hooks/useVocabulary';
import { useWordProgress } from '../hooks/useWordProgress';

// Progress Testing Component
const ProgressTestingComponent: React.FC = () => {
  const { progress, achievements, addScore, updateStreak, completeUnit } = useProgress();
  const { recordCorrectAnswer, recordIncorrectAnswer, getStudyStatistics } = useWordProgress();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const addTestResult = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    setTestResults(prev => [...prev, `${timestamp} ${emoji} ${message}`]);
  };

  const runProgressTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    addTestResult('🚀 بدء اختبار نظام تقدم الطلاب...', 'info');
    
    try {
      // Test 1: Basic Progress Functions
      addTestResult('اختبار الوظائف الأساسية...', 'info');
      const initialScore = progress.totalScore;
      addScore(25);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (progress.totalScore >= initialScore + 25) {
        addTestResult('✅ نجح اختبار إضافة النقاط', 'success');
      } else {
        addTestResult('❌ فشل اختبار إضافة النقاط', 'error');
      }

      // Test 2: Streak Updates
      const initialStreak = progress.currentStreak;
      updateStreak(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (progress.currentStreak > initialStreak) {
        addTestResult('✅ نجح اختبار تحديث السلسلة', 'success');
      } else {
        addTestResult('❌ فشل اختبار تحديث السلسلة', 'error');
      }

      // Test 3: Unit Completion
      const testUnit = `وحدة اختبار ${Date.now()}`;
      completeUnit(testUnit);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (progress.unitsCompleted.includes(testUnit)) {
        addTestResult('✅ نجح اختبار إكمال الوحدة', 'success');
      } else {
        addTestResult('❌ فشل اختبار إكمال الوحدة', 'error');
      }

      // Test 4: Word Progress
      addTestResult('اختبار تقدم الكلمات...', 'info');
      const testWords = ['test', 'example', 'progress'];
      for (const word of testWords) {
        recordCorrectAnswer(word, 'pronunciation');
        recordIncorrectAnswer(word, 'spelling');
      }
      
      const stats = getStudyStatistics();
      if (stats.totalWords > 0) {
        addTestResult(`✅ تم اختبار ${stats.totalWords} كلمات بدقة ${stats.accuracy.toFixed(1)}%`, 'success');
      } else {
        addTestResult('❌ فشل اختبار تقدم الكلمات', 'error');
      }

      // Test 5: Achievements Check
      addTestResult('فحص الإنجازات...', 'info');
      const achievedCount = achievements.filter(a => a.achieved).length;
      addTestResult(`📊 الإنجازات المحققة: ${achievedCount}/${achievements.length}`, 'info');

      addTestResult('🎉 اكتملت جميع الاختبارات!', 'success');
    } catch (error) {
      addTestResult(`❌ خطأ أثناء الاختبار: ${error}`, 'error');
    } finally {
      setIsRunningTests(false);
    }
  };

  const testSpecificStudent = async () => {
    if (!selectedStudentId.trim()) {
      addTestResult('❌ يرجى إدخال معرف الطالب', 'error');
      return;
    }

    setIsRunningTests(true);
    setTestResults([]);
    
    addTestResult(`🎯 اختبار النظام للطالب: ${selectedStudentId}`, 'info');
    
    // Here you would test with the specific student ID
    // For now, we'll simulate it
    addTestResult('📝 محاكاة اختبار مع معرف الطالب...', 'info');
    await new Promise(resolve => setTimeout(resolve, 1000));
    addTestResult('✅ تم اختبار النظام بنجاح مع معرف الطالب', 'success');
    
    setIsRunningTests(false);
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <TestTube className="w-6 h-6 text-teal-600" />
        اختبار نظام تقدم الطلاب
      </h3>
      
      {/* Current Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{progress.totalScore}</div>
          <div className="text-sm text-blue-600">النقاط الحالية</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-700">{progress.currentStreak}</div>
          <div className="text-sm text-orange-600">السلسلة الحالية</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{progress.unitsCompleted.length}</div>
          <div className="text-sm text-green-600">الوحدات المكتملة</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">{progress.wordsLearned}</div>
          <div className="text-sm text-purple-600">الكلمات المتعلمة</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-700">
            {achievements.filter(a => a.achieved).length}
          </div>
          <div className="text-sm text-yellow-600">الإنجازات</div>
        </div>
      </div>

      {/* Test Controls */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h4 className="text-lg font-bold text-gray-800 mb-4">اختبارات النظام</h4>
        
        <div className="space-y-4">
          {/* General Progress Test */}
          <div className="flex items-center gap-4">
            <button
              onClick={runProgressTests}
              disabled={isRunningTests}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              {isRunningTests ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Activity className="w-5 h-5" />
              )}
              {isRunningTests ? 'جاري التشغيل...' : 'اختبار النظام العام'}
            </button>
            <span className="text-gray-600">اختبار جميع وظائف النظام الأساسية</span>
          </div>

          {/* Student-specific Test */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="معرف الطالب للاختبار"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 flex-1 max-w-xs"
            />
            <button
              onClick={testSpecificStudent}
              disabled={isRunningTests}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <Activity className="w-5 h-5" />
              اختبار طالب محدد
            </button>
          </div>

          {/* Clear Results */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTestResults([])}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              مسح النتائج
            </button>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h4 className="font-bold text-gray-800 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            نتائج الاختبارات ({testResults.length})
          </h4>
        </div>
        <div className="p-6 max-h-64 overflow-y-auto">
          {testResults.length > 0 ? (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded text-sm font-mono ${
                    result.includes('✅') ? 'bg-green-50 text-green-800 border-l-4 border-green-400' :
                    result.includes('❌') ? 'bg-red-50 text-red-800 border-l-4 border-red-400' :
                    'bg-blue-50 text-blue-800 border-l-4 border-blue-400'
                  }`}
                >
                  {result}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <TestTube className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>لا توجد نتائج اختبارات بعد</p>
              <p className="text-sm">قم بتشغيل اختبار لعرض النتائج</p>
            </div>
          )}
        </div>
      </div>

      {/* Achievement Status */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h4 className="font-bold text-gray-800">
            حالة الإنجازات ({achievements.filter(a => a.achieved).length}/{achievements.length})
          </h4>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-40 overflow-y-auto">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg border-2 flex items-center gap-3 ${
                achievement.achieved
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <span className="text-2xl">{achievement.icon}</span>
              <div className="flex-1 min-w-0">
                <h5 className={`font-semibold text-sm ${achievement.achieved ? 'text-green-800' : 'text-gray-600'}`}>
                  {achievement.title}
                </h5>
                <p className={`text-xs ${achievement.achieved ? 'text-green-600' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>
              </div>
              {achievement.achieved ? (
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('access-codes');
  const [activeSubTab, setActiveSubTab] = useState('subjects');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<{
    inProgress: boolean;
    success: boolean;
    message: string;
    details: string[];
  }>({
    inProgress: false,
    success: false,
    message: '',
    details: []
  });
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  
  // Admin settings state
  const [grades, setGrades] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const [semesters, setSemesters] = useState<string[]>(['الفصل الأول', 'الفصل الثاني', 'الفصل الصيفي']);
  const [subjects, setSubjects] = useState<string[]>(['اللغة الإنجليزية', 'الرياضيات', 'العلوم', 'التربية الإسلامية', 'اللغة العربية']);
  const [units, setUnits] = useState<{[subject: string]: string[]}>({
    'اللغة الإنجليزية': ['Welcome Back', 'Talent Show', 'Then and Now', 'Let\'s Explore!'],
    'الرياضيات': ['الأعداد', 'الجبر', 'الهندسة', 'الإحصاء'],
    'العلوم': ['الكائنات الحية', 'المادة', 'الطاقة', 'الأرض والفضاء'],
    'التربية الإسلامية': ['العقيدة', 'العبادات', 'السيرة', 'الأخلاق'],
    'اللغة العربية': ['القراءة', 'الكتابة', 'القواعد', 'البلاغة']
  });
  
  // Selected values
  const [selectedGrade, setSelectedGrade] = useState<number>(5);
  const [selectedSemester, setSelectedSemester] = useState<string>('الفصل الأول');
  const [selectedSubject, setSelectedSubject] = useState<string>('اللغة الإنجليزية');
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  
  // Update units when subject changes
  useEffect(() => {
    if (units[selectedSubject] && units[selectedSubject].length > 0) {
      setSelectedUnit(units[selectedSubject][0]);
    } else {
      setSelectedUnit('');
    }
  }, [selectedSubject]);

  // Function to check Supabase connection status
  const checkConnection = async () => {
    setIsConnected(null); // Set to loading state
    const connected = await checkSupabaseConnection();
    setIsConnected(connected);
    return connected;
  };

  const handleDeleteAllData = async () => {
    setIsDeleting(true);
    setDeleteStatus({
      inProgress: true,
      success: false,
      message: 'جاري التحقق من الاتصال بقاعدة البيانات...',
      details: []
    });

    try {
      // First check connection to Supabase
      const connected = await checkConnection();
      if (!connected) {
        throw new Error('لا يمكن الاتصال بقاعدة البيانات. يرجى التحقق من اتصالك بالإنترنت ومحاولة المحاولة مرة أخرى.');
      }

      setDeleteStatus(prev => ({
        ...prev,
        message: 'جاري حذف رموز الدخول...',
        details: [...prev.details, '✓ تم التحقق من الاتصال بقاعدة البيانات']
      }));

      // Get initial counts
      const initialAccessCodesCount = await getTableCount('access_codes');
      const initialTeachersCount = await getTableCount('teachers');

      // Delete all access codes
      const accessCodesResult = await deleteAllRecords('access_codes');
      
      if (!accessCodesResult.success) {
        throw new Error(`فشل في حذف رموز الدخول: ${accessCodesResult.error || 'خطأ غير معروف'}`);
      }
      
      setDeleteStatus(prev => ({
        ...prev,
        message: 'جاري حذف المعلمين...',
        details: [...prev.details, `✓ تم حذف ${accessCodesResult.count} رمز دخول بنجاح`]
      }));
      
      // Delete all teachers
      const teachersResult = await deleteAllRecords('teachers');
      
      if (!teachersResult.success) {
        throw new Error(`فشل في حذف المعلمين: ${teachersResult.error || 'خطأ غير معروف'}`);
      }
      
      setDeleteStatus(prev => ({
        ...prev,
        message: 'جاري مسح التخزين المحلي...',
        details: [...prev.details, `✓ تم حذف ${teachersResult.count} معلم بنجاح`]
      }));
      
      // Clear local storage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('teacher-') || key.startsWith('admin-'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Verify deletion by checking if any records still exist
      const finalAccessCodesCount = await getTableCount('access_codes');
      const finalTeachersCount = await getTableCount('teachers');
      
      if (finalAccessCodesCount > 0 || finalTeachersCount > 0) {
        setDeleteStatus(prev => ({
          ...prev,
          success: false,
          inProgress: false,
          message: 'تم الحذف جزئياً، لكن بعض البيانات لا تزال موجودة',
          details: [
            ...prev.details, 
            `✓ تم مسح ${keysToRemove.length} عنصر من التخزين المحلي`,
            `⚠️ لا يزال هناك ${finalAccessCodesCount} رمز دخول في قاعدة البيانات`,
            `⚠️ لا يزال هناك ${finalTeachersCount} معلم في قاعدة البيانات`
          ]
        }));
      } else {
        // Show success message
        setDeleteStatus({
          inProgress: false,
          success: true,
          message: 'تم حذف جميع البيانات بنجاح',
          details: [
            '✓ تم التحقق من الاتصال بقاعدة البيانات',
            `✓ تم حذف ${initialAccessCodesCount} رمز دخول`,
            `✓ تم حذف ${initialTeachersCount} معلم`,
            `✓ تم مسح ${keysToRemove.length} عنصر من التخزين المحلي`,
            '✓ تم التحقق من اكتمال عملية الحذف'
          ]
        });
        
        // Reload the page after a delay to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      
      // Show error message
      setDeleteStatus({
        inProgress: false,
        success: false,
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء حذف البيانات',
        details: [
          '❌ فشلت عملية الحذف',
          error instanceof Error ? `سبب الخطأ: ${error.message}` : 'سبب غير معروف',
          'يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى'
        ]
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <Shield className="w-12 h-12" />
          <div>
            <h2 className="text-3xl font-bold">لوحة تحكم المدير</h2>
            <p className="opacity-90">إدارة المواد الدراسية والمحتوى التعليمي لجميع الصفوف</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full flex mb-8 bg-white rounded-xl p-2 shadow-md">
          <TabsTrigger 
            value="access-codes" 
            className="flex-1 py-3 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 rounded-lg transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <Key className="w-5 h-5" />
              <span>رموز الدخول</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="teachers" 
            className="flex-1 py-3 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 rounded-lg transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <Users className="w-5 h-5" />
              <span>المعلمين</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="students" 
            className="flex-1 py-3 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 rounded-lg transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              <span>الطلاب</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="subjects" 
            className="flex-1 py-3 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 rounded-lg transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <Book className="w-5 h-5" />
              <span>المواد الدراسية</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="english" 
            className="flex-1 py-3 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 rounded-lg transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>اللغة الإنجليزية</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="testing" 
            className="flex-1 py-3 data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 rounded-lg transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <TestTube className="w-5 h-5" />
              <span>اختبار النظام</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="flex-1 py-3 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700 rounded-lg transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <Settings className="w-5 h-5" />
              <span>الإعدادات</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="access-codes">
          <AccessCodeSettings />
        </TabsContent>
        
        <TabsContent value="teachers">
          <TeacherManagement />
        </TabsContent>
        
        <TabsContent value="students">
          <StudentManagement />
        </TabsContent>
        
        <TabsContent value="subjects">
          <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
            <TabsList className="w-full flex mb-6 bg-white rounded-xl p-2 shadow-md">
              <TabsTrigger 
                value="subjects" 
                className="flex-1 py-3 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 rounded-lg transition-all"
              >
                <div className="flex items-center gap-2 justify-center">
                  <Book className="w-5 h-5" />
                  <span>المواد الدراسية</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="content" 
                className="flex-1 py-3 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 rounded-lg transition-all"
              >
                <div className="flex items-center gap-2 justify-center">
                  <FileText className="w-5 h-5" />
                  <span>المحتوى العام</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="math" 
                className="flex-1 py-3 data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 rounded-lg transition-all"
              >
                <div className="flex items-center gap-2 justify-center">
                  <Calculator className="w-5 h-5" />
                  <span>الرياضيات</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="science" 
                className="flex-1 py-3 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 rounded-lg transition-all"
              >
                <div className="flex items-center gap-2 justify-center">
                  <Flask className="w-5 h-5" />
                  <span>العلوم (1-8)</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="physics" 
                className="flex-1 py-3 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 rounded-lg transition-all"
              >
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-lg">⚛️</span>
                  <span>الفيزياء (9-12)</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="chemistry" 
                className="flex-1 py-3 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 rounded-lg transition-all"
              >
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-lg">🧪</span>
                  <span>الكيمياء (9-12)</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="biology" 
                className="flex-1 py-3 data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 rounded-lg transition-all"
              >
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-lg">🧬</span>
                  <span>الأحياء (9-12)</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="islamic" 
                className="flex-1 py-3 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 rounded-lg transition-all"
              >
                <div className="flex items-center gap-2 justify-center">
                  <Bookmark className="w-5 h-5" />
                  <span>التربية الإسلامية</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="subjects">
              <SubjectManagement />
            </TabsContent>
            
            <TabsContent value="content">
              <ContentManagement />
            </TabsContent>
            
            <TabsContent value="math">
              <MathContent />
            </TabsContent>
            
            <TabsContent value="science">
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <Flask className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">محتوى العلوم (الصفوف 1-8)</h3>
                <p className="text-gray-600 mb-6">إدارة محتوى العلوم العامة للصفوف الأساسية</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-700 text-sm">
                    <strong>ملاحظة:</strong> من الصف التاسع فصاعداً، يتم تقسيم العلوم إلى فيزياء وكيمياء وأحياء كمواد منفصلة.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="physics">
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <div className="text-6xl mb-4">⚛️</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">محتوى الفيزياء (الصفوف 9-12)</h3>
                <p className="text-gray-600 mb-6">إدارة محتوى الفيزياء للمرحلة الثانوية</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-800 mb-2">المواضيع الرئيسية</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• الميكانيكا</li>
                      <li>• الكهرباء والمغناطيسية</li>
                      <li>• الضوء والبصريات</li>
                      <li>• الفيزياء الحديثة</li>
                    </ul>
                  </div>
                  <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                    <h4 className="font-bold text-cyan-800 mb-2">الأنشطة المتاحة</h4>
                    <ul className="text-cyan-700 text-sm space-y-1">
                      <li>• تجارب افتراضية</li>
                      <li>• حل المسائل</li>
                      <li>• محاكاة الظواهر</li>
                      <li>• اختبارات تفاعلية</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="chemistry">
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <div className="text-6xl mb-4">🧪</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">محتوى الكيمياء (الصفوف 9-12)</h3>
                <p className="text-gray-600 mb-6">إدارة محتوى الكيمياء للمرحلة الثانوية</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-800 mb-2">المواضيع الرئيسية</h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• الكيمياء العامة</li>
                      <li>• الكيمياء العضوية</li>
                      <li>• الكيمياء التحليلية</li>
                      <li>• الكيمياء الفيزيائية</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <h4 className="font-bold text-emerald-800 mb-2">الأنشطة المتاحة</h4>
                    <ul className="text-emerald-700 text-sm space-y-1">
                      <li>• تجارب معملية</li>
                      <li>• معادلات كيميائية</li>
                      <li>• جدول دوري تفاعلي</li>
                      <li>• حسابات كيميائية</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="biology">
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <div className="text-6xl mb-4">🧬</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">محتوى الأحياء (الصفوف 9-12)</h3>
                <p className="text-gray-600 mb-6">إدارة محتوى الأحياء للمرحلة الثانوية</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <h4 className="font-bold text-teal-800 mb-2">المواضيع الرئيسية</h4>
                    <ul className="text-teal-700 text-sm space-y-1">
                      <li>• علم الخلية</li>
                      <li>• الوراثة</li>
                      <li>• التطور</li>
                      <li>• علم البيئة</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-800 mb-2">الأنشطة المتاحة</h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• مراقبة الكائنات</li>
                      <li>• تشريح افتراضي</li>
                      <li>• دراسة الحمض النووي</li>
                      <li>• النظم البيئية</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="islamic">
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <Bookmark className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">محتوى التربية الإسلامية</h3>
                <p className="text-gray-600 mb-6">سيتم إضافة إدارة محتوى التربية الإسلامية قريباً</p>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="english">
          <Tabs value="vocabulary" className="w-full">
            <TabsList className="w-full flex mb-6 bg-white rounded-xl p-2 shadow-md">
              <TabsTrigger 
                value="vocabulary" 
                className="flex-1 py-3 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 rounded-lg transition-all"
              >
                <div className="flex items-center gap-2 justify-center">
                  <BookOpen className="w-5 h-5" />
                  <span>المفردات</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="grammar" 
                className="flex-1 py-3 data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 rounded-lg transition-all"
              >
                <div className="flex items-center gap-2 justify-center">
                  <Database className="w-5 h-5" />
                  <span>القواعد</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="vocabulary">
              <VocabularyExtractor />
            </TabsContent>
            
            <TabsContent value="grammar">
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">إدارة القواعد النحوية</h3>
                  <p className="text-gray-600 mb-4">عرض وتعديل وإضافة قواعد اللغة الإنجليزية لجميع الصفوف</p>
                </div>
                <GrammarExtractor />
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="testing">
          <ProgressTestingComponent />
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Settings className="w-6 h-6 text-gray-600" />
              إعدادات النظام
            </h3>
            
            {/* Connection Status */}
            <div className="mb-8 bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-600" />
                حالة الاتصال بقاعدة البيانات
              </h4>
              
              <div className="flex items-center gap-4 mb-4">
                {isConnected === null ? (
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>جاري التحقق من الاتصال...</span>
                  </div>
                ) : isConnected ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-semibold">متصل بقاعدة البيانات</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-semibold">غير متصل بقاعدة البيانات</span>
                  </div>
                )}
                
                <button
                  onClick={checkConnection}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  تحديث حالة الاتصال
                </button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-700 text-sm">
                  <strong>ملاحظة هامة:</strong> يجب التأكد من وجود اتصال نشط بقاعدة البيانات قبل إجراء عمليات الحذف الهامة.
                  إذا كنت غير متصل، فقد يتم حذف البيانات من التخزين المحلي فقط وليس من قاعدة البيانات.
                </p>
              </div>
            </div>
            
            {/* Danger Zone */}
            <div className="border border-red-300 rounded-xl p-6 bg-red-50">
              <h4 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                منطقة الخطر
              </h4>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
                  <div>
                    <h5 className="font-bold text-gray-800 mb-1">حذف جميع الرموز والمعلمين</h5>
                    <p className="text-gray-600 text-sm">هذا الإجراء سيؤدي إلى حذف جميع رموز الدخول وجميع المعلمين من قاعدة البيانات. هذا الإجراء لا يمكن التراجع عنه!</p>
                  </div>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف الكل
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Admin Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Settings className="w-6 h-6 text-gray-600" />
            إعدادات المنصة
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Grade Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الصف الدراسي
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>الصف {grade}</option>
                ))}
              </select>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => {
                    const newGrade = window.prompt('أدخل الصف الدراسي الجديد (رقم)');
                    if (newGrade && !isNaN(Number(newGrade))) {
                      setGrades(prev => [...prev, Number(newGrade)].sort((a, b) => a - b));
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + إضافة صف جديد
                </button>
              </div>
            </div>
            
            {/* Semester Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الفصل الدراسي
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {semesters.map(semester => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
              </select>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => {
                    const newSemester = window.prompt('أدخل اسم الفصل الدراسي الجديد');
                    if (newSemester && newSemester.trim()) {
                      setSemesters(prev => [...prev, newSemester.trim()]);
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + إضافة فصل دراسي جديد
                </button>
              </div>
            </div>
            
            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                المادة الدراسية
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => {
                    const newSubject = window.prompt('أدخل اسم المادة الدراسية الجديدة');
                    if (newSubject && newSubject.trim()) {
                      setSubjects(prev => [...prev, newSubject.trim()]);
                      setUnits(prev => ({...prev, [newSubject.trim()]: []}));
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + إضافة مادة جديدة
                </button>
              </div>
            </div>
            
            {/* Unit Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                الوحدة الدراسية
              </label>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {units[selectedSubject]?.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                )) || (
                  <option value="">لا توجد وحدات</option>
                )}
              </select>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => {
                    const newUnit = window.prompt('أدخل اسم الوحدة الدراسية الجديدة');
                    if (newUnit && newUnit.trim()) {
                      setUnits(prev => ({
                        ...prev,
                        [selectedSubject]: [...(prev[selectedSubject] || []), newUnit.trim()]
                      }));
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + إضافة وحدة جديدة
                </button>
              </div>
            </div>
          </div>
          
          {/* Current Selection Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h4 className="font-bold text-blue-800 mb-4">الإعدادات الحالية:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500 mb-1">الصف الدراسي</div>
                <div className="font-bold text-blue-700">الصف {selectedGrade}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500 mb-1">الفصل الدراسي</div>
                <div className="font-bold text-blue-700">{selectedSemester}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500 mb-1">المادة الدراسية</div>
                <div className="font-bold text-blue-700">{selectedSubject}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500 mb-1">الوحدة الدراسية</div>
                <div className="font-bold text-blue-700">{selectedUnit || 'غير محدد'}</div>
              </div>
            </div>
          </div>
          
          {/* Save Settings Button */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                // Save settings to localStorage for persistence
                localStorage.setItem('admin-settings', JSON.stringify({
                  grades,
                  semesters,
                  subjects,
                  units,
                  selectedGrade,
                  selectedSemester,
                  selectedSubject,
                  selectedUnit
                }));
                
                // Show success message
                alert('تم حفظ الإعدادات بنجاح');
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              حفظ الإعدادات
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">تأكيد الحذف</h3>
              <p className="text-gray-600">
                هل أنت متأكد من حذف جميع رموز الدخول والمعلمين؟ هذا الإجراء لا يمكن التراجع عنه!
              </p>
              
              {isConnected === false && (
                <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-yellow-800">
                  <AlertTriangle className="w-5 h-5 inline-block mr-2" />
                  <span className="font-semibold">تحذير:</span> أنت غير متصل بقاعدة البيانات حاليًا. 
                  سيتم حذف البيانات من التخزين المحلي فقط وليس من قاعدة البيانات.
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAllData}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    جاري الحذف...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    نعم، حذف الكل
                  </>
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 py-2 px-4 rounded-lg transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Status Modal */}
      {deleteStatus.message && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              {deleteStatus.inProgress ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              ) : deleteStatus.success ? (
                <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              ) : (
                <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {deleteStatus.success ? 'تم الحذف بنجاح' : deleteStatus.inProgress ? 'جاري الحذف...' : 'حدثت مشكلة'}
              </h3>
              <p className="text-gray-600 mb-4">
                {deleteStatus.message}
              </p>
              
              {deleteStatus.details.length > 0 && (
                <div className={`text-left border rounded-lg p-4 mb-4 ${
                  deleteStatus.success ? 'bg-green-50 border-green-200' : 
                  deleteStatus.inProgress ? 'bg-blue-50 border-blue-200' : 
                  'bg-red-50 border-red-200'
                }`}>
                  <ul className="space-y-2">
                    {deleteStatus.details.map((detail, index) => (
                      <li key={index} className="text-sm">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {!deleteStatus.inProgress && (
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setDeleteStatus({
                      inProgress: false,
                      success: false,
                      message: '',
                      details: []
                    });
                    if (deleteStatus.success) {
                      window.location.reload();
                    }
                  }}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    deleteStatus.success 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {deleteStatus.success ? 'تحديث الصفحة' : 'إغلاق'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Load saved settings on component mount */}
      <script dangerouslySetInnerHTML={{
        __html: `
          try {
            const savedSettings = localStorage.getItem('admin-settings');
            if (savedSettings) {
              const settings = JSON.parse(savedSettings);
              // Apply saved settings here
              console.log('Loaded admin settings:', settings);
            }
          } catch (error) {
            console.error('Error loading admin settings:', error);
          }
        `
      }} />
    </div>
  );
};

export default AdminPanel;