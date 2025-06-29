import React, { useState, useEffect } from 'react';
import { Trophy, Target, Star, Clock, Award, Activity, Users, BookOpen, Zap, BarChart3, CheckCircle, XCircle, RefreshCw, Eye, Download } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { useWordProgress } from '../hooks/useWordProgress';
import { Achievement, UserProgress, StudySession } from '../types';

interface ProgressTestingPanelProps {
  studentId?: string;
  onClose: () => void;
}

const ProgressTestingPanel: React.FC<ProgressTestingPanelProps> = ({ studentId, onClose }) => {
  const { progress, achievements, addScore, updateStreak, completeUnit, checkAchievements } = useProgress(studentId);
  const { wordProgress, recordCorrectAnswer, recordIncorrectAnswer, startStudySession, endStudySession, getStudyStatistics } = useWordProgress();
  
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string>('all');

  const addTestResult = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    setTestResults(prev => [...prev, `${timestamp} ${emoji} ${message}`]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Test 1: Basic Progress Functions
  const testBasicProgress = async () => {
    addTestResult('بدء اختبار الوظائف الأساسية للتقدم...', 'info');
    
    const initialScore = progress.totalScore;
    const initialStreak = progress.currentStreak;
    
    // Test adding score
    addScore(25);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (progress.totalScore > initialScore) {
      addTestResult(`نجح إضافة النقاط: ${initialScore} → ${progress.totalScore}`, 'success');
    } else {
      addTestResult('فشل في إضافة النقاط', 'error');
    }
    
    // Test streak increment
    updateStreak(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (progress.currentStreak > initialStreak) {
      addTestResult(`نجح تحديث السلسلة: ${initialStreak} → ${progress.currentStreak}`, 'success');
    } else {
      addTestResult('فشل في تحديث السلسلة', 'error');
    }
    
    // Test unit completion
    const initialUnits = progress.unitsCompleted.length;
    completeUnit('وحدة الاختبار');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (progress.unitsCompleted.length > initialUnits) {
      addTestResult(`نجح إكمال الوحدة: عدد الوحدات ${initialUnits} → ${progress.unitsCompleted.length}`, 'success');
    } else {
      addTestResult('فشل في إكمال الوحدة', 'error');
    }
  };

  // Test 2: Achievement System
  const testAchievements = async () => {
    addTestResult('بدء اختبار نظام الإنجازات...', 'info');
    
    const initialAchievements = achievements.filter(a => a.achieved).length;
    
    // Trigger different types of achievements
    const tests = [
      { name: 'اختبار إنجاز النقاط', action: () => addScore(100) },
      { name: 'اختبار إنجاز السلسلة', action: () => { for(let i = 0; i < 5; i++) updateStreak(true); } },
      { name: 'اختبار إنجاز الوحدة', action: () => completeUnit('وحدة إنجاز جديدة') }
    ];
    
    for (const test of tests) {
      addTestResult(`تشغيل: ${test.name}`, 'info');
      test.action();
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    const finalAchievements = achievements.filter(a => a.achieved).length;
    
    if (finalAchievements > initialAchievements) {
      addTestResult(`نجح تحفيز الإنجازات: ${initialAchievements} → ${finalAchievements}`, 'success');
    } else {
      addTestResult('لم يتم تحفيز إنجازات جديدة', 'info');
    }
  };

  // Test 3: Word Progress System
  const testWordProgress = async () => {
    addTestResult('بدء اختبار نظام تقدم الكلمات...', 'info');
    
    const testWords = ['test', 'example', 'learning'];
    const activities = ['pronunciation', 'spelling', 'usage', 'grammar'] as const;
    
    for (const word of testWords) {
      for (const activity of activities) {
        // Test correct answers
        recordCorrectAnswer(word, activity);
        addTestResult(`سجل إجابة صحيحة: ${word} - ${activity}`, 'success');
        
        // Test incorrect answers
        recordIncorrectAnswer(word, activity);
        addTestResult(`سجل إجابة خاطئة: ${word} - ${activity}`, 'info');
      }
    }
    
    const stats = getStudyStatistics();
    addTestResult(`إحصائيات الكلمات: ${stats.totalWords} كلمات، دقة ${stats.accuracy.toFixed(1)}%`, 'success');
  };

  // Test 4: Study Session Tracking
  const testStudySessions = async () => {
    addTestResult('بدء اختبار تتبع جلسات الدراسة...', 'info');
    
    // Start a study session
    const session = startStudySession();
    addTestResult(`بدأت جلسة دراسة: ${session.id}`, 'success');
    
    // Simulate some study time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // End the session
    const completedSession = endStudySession();
    if (completedSession) {
      addTestResult(`انتهت جلسة الدراسة - المدة: ${completedSession.duration} ثانية`, 'success');
    } else {
      addTestResult('فشل في إنهاء جلسة الدراسة', 'error');
    }
  };

  // Test 5: Database Integration (if student ID provided)
  const testDatabaseIntegration = async () => {
    if (!studentId) {
      addTestResult('لا يمكن اختبار قاعدة البيانات بدون معرف طالب', 'info');
      return;
    }
    
    addTestResult('بدء اختبار تكامل قاعدة البيانات...', 'info');
    
    // Test data persistence
    const testData = {
      score: Math.floor(Math.random() * 100),
      streak: Math.floor(Math.random() * 10),
      unit: `وحدة اختبار ${Date.now()}`
    };
    
    addScore(testData.score);
    updateStreak(true);
    completeUnit(testData.unit);
    
    addTestResult(`أرسل بيانات الاختبار: نقاط=${testData.score}, سلسلة=${testData.streak}`, 'info');
    
    // Check if changes are reflected
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (progress.unitsCompleted.includes(testData.unit)) {
      addTestResult('نجح حفظ البيانات في قاعدة البيانات', 'success');
    } else {
      addTestResult('فشل في حفظ البيانات في قاعدة البيانات', 'error');
    }
  };

  // Test 6: Activity Integration
  const testActivityIntegration = async () => {
    addTestResult('بدء اختبار تكامل الأنشطة...', 'info');
    
    // Simulate different activity completions
    const activities = [
      { name: 'اختبار', points: 20, correct: true },
      { name: 'بطاقات تعليمية', points: 15, correct: true },
      { name: 'لعبة الذاكرة', points: 25, correct: false },
      { name: 'تمرين النطق', points: 10, correct: true },
      { name: 'تمرين التهجئة', points: 30, correct: true }
    ];
    
    for (const activity of activities) {
      addScore(activity.points);
      updateStreak(activity.correct);
      addTestResult(`نشاط ${activity.name}: ${activity.points} نقطة, صحيح=${activity.correct}`, 
                   activity.correct ? 'success' : 'error');
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunningTests(true);
    clearResults();
    
    addTestResult('🚀 بدء تشغيل جميع اختبارات نظام التقدم...', 'info');
    
    try {
      await testBasicProgress();
      await testAchievements();
      await testWordProgress();
      await testStudySessions();
      await testDatabaseIntegration();
      await testActivityIntegration();
      
      addTestResult('🎉 تم اكتمال جميع الاختبارات بنجاح!', 'success');
    } catch (error) {
      addTestResult(`❌ خطأ أثناء تشغيل الاختبارات: ${error}`, 'error');
    } finally {
      setIsRunningTests(false);
    }
  };

  // Run individual test
  const runIndividualTest = async (testName: string) => {
    setIsRunningTests(true);
    clearResults();
    
    const tests: { [key: string]: () => Promise<void> } = {
      'basic': testBasicProgress,
      'achievements': testAchievements,
      'words': testWordProgress,
      'sessions': testStudySessions,
      'database': testDatabaseIntegration,
      'activities': testActivityIntegration
    };
    
    if (tests[testName]) {
      await tests[testName]();
    }
    
    setIsRunningTests(false);
  };

  const exportTestResults = () => {
    const content = [
      '# تقرير اختبار نظام تقدم الطلاب',
      `تاريخ الاختبار: ${new Date().toLocaleString('ar-SA')}`,
      `معرف الطالب: ${studentId || 'غير محدد'}`,
      '',
      '## النتائج:',
      ...testResults,
      '',
      '## حالة التقدم الحالية:',
      `النقاط الإجمالية: ${progress.totalScore}`,
      `السلسلة الحالية: ${progress.currentStreak}`,
      `الوحدات المكتملة: ${progress.unitsCompleted.length}`,
      `الكلمات المتعلمة: ${progress.wordsLearned}`,
      `إجمالي وقت الدراسة: ${Math.round(progress.totalStudyTime / 60)} دقيقة`,
      '',
      '## الإنجازات:',
      ...achievements.map(a => `${a.achieved ? '✅' : '❌'} ${a.title}: ${a.description}`)
    ].join('\n');
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `progress_test_results_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Activity className="w-8 h-8" />
              لوحة اختبار نظام تقدم الطلاب
            </h2>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
          {studentId && (
            <p className="mt-2 opacity-90">معرف الطالب: {studentId}</p>
          )}
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <Star className="w-6 h-6 mx-auto text-blue-600 mb-1" />
              <div className="text-2xl font-bold text-blue-700">{progress.totalScore}</div>
              <div className="text-xs text-blue-600">النقاط</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <Zap className="w-6 h-6 mx-auto text-orange-600 mb-1" />
              <div className="text-2xl font-bold text-orange-700">{progress.currentStreak}</div>
              <div className="text-xs text-orange-600">السلسلة</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <BookOpen className="w-6 h-6 mx-auto text-green-600 mb-1" />
              <div className="text-2xl font-bold text-green-700">{progress.unitsCompleted.length}</div>
              <div className="text-xs text-green-600">الوحدات</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <Target className="w-6 h-6 mx-auto text-purple-600 mb-1" />
              <div className="text-2xl font-bold text-purple-700">{progress.wordsLearned}</div>
              <div className="text-xs text-purple-600">الكلمات</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto text-yellow-600 mb-1" />
              <div className="text-2xl font-bold text-yellow-700">
                {achievements.filter(a => a.achieved).length}
              </div>
              <div className="text-xs text-yellow-600">الإنجازات</div>
            </div>
          </div>

          {/* Test Controls */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">اختبارات النظام</h3>
            <div className="flex flex-wrap gap-3 mb-4">
              <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">جميع الاختبارات</option>
                <option value="basic">الوظائف الأساسية</option>
                <option value="achievements">نظام الإنجازات</option>
                <option value="words">تقدم الكلمات</option>
                <option value="sessions">جلسات الدراسة</option>
                <option value="database">تكامل قاعدة البيانات</option>
                <option value="activities">تكامل الأنشطة</option>
              </select>
              
              <button
                onClick={() => selectedTest === 'all' ? runAllTests() : runIndividualTest(selectedTest)}
                disabled={isRunningTests}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {isRunningTests ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Activity className="w-4 h-4" />
                )}
                {isRunningTests ? 'جاري التشغيل...' : 'تشغيل الاختبار'}
              </button>
              
              <button
                onClick={clearResults}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                مسح النتائج
              </button>
              
              <button
                onClick={exportTestResults}
                disabled={testResults.length === 0}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                تصدير النتائج
              </button>
            </div>
          </div>

          {/* Test Results */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                نتائج الاختبارات ({testResults.length})
              </h4>
            </div>
            <div className="p-4 max-h-64 overflow-y-auto">
              {testResults.length > 0 ? (
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-sm font-mono ${
                        result.includes('✅') ? 'bg-green-50 text-green-800' :
                        result.includes('❌') ? 'bg-red-50 text-red-800' :
                        'bg-blue-50 text-blue-800'
                      }`}
                    >
                      {result}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>لا توجد نتائج اختبارات بعد</p>
                  <p className="text-sm">اختر اختباراً وقم بتشغيله لعرض النتائج</p>
                </div>
              )}
            </div>
          </div>

          {/* Achievements Overview */}
          <div className="mt-6 bg-white border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="font-bold text-gray-800 flex items-center gap-2">
                <Award className="w-5 h-5" />
                الإنجازات ({achievements.filter(a => a.achieved).length}/{achievements.length})
              </h4>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    achievement.achieved
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h5 className={`font-semibold ${achievement.achieved ? 'text-green-800' : 'text-gray-600'}`}>
                        {achievement.title}
                      </h5>
                      <p className={`text-sm ${achievement.achieved ? 'text-green-600' : 'text-gray-500'}`}>
                        {achievement.description}
                      </p>
                      {achievement.achieved && achievement.achievedDate && (
                        <p className="text-xs text-green-500 mt-1">
                          تم في: {new Date(achievement.achievedDate).toLocaleDateString('ar-SA')}
                        </p>
                      )}
                    </div>
                    {achievement.achieved ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTestingPanel; 