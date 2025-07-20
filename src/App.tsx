import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Header from './components/Header';
import Navigation from './components/Navigation';
import VocabularyUnit from './components/VocabularyUnit';
import FlashCards from './components/FlashCards';
import WordProgressReport from './components/WordProgressReport';
import Quiz from './components/Quiz';
import MemoryGame from './components/MemoryGame';
import PronunciationPractice from './components/PronunciationPractice';
import GrammarChallenge from './components/GrammarChallenge';
import SentenceWriting from './components/SentenceWriting';
import SentenceCompletion from './components/SentenceCompletion';
import SpellingExercise from './components/SpellingExercise';
import TestExercises from './components/TestExercises';
import FreeWriting from './components/FreeWriting';
import ProgressBar from './components/ProgressBar';
import AchievementNotification from './components/AchievementNotification';
import AdminPanel from './components/AdminPanel';
import TeacherDashboard from './components/TeacherDashboard';
import SubjectSelector from './components/SubjectSelector';
import SubjectUnits from './components/SubjectUnits';
import SupportInfo from './components/SupportInfo';
import { getVocabularyByGrade, getUnitsByGrade } from './data/vocabulary';
import { getGrammarByGrade, getQuestionsByGrade } from './data/grammar';
import { getTeacherByCode } from './data/gradeAccess';
import { useProgress } from './hooks/useProgress';
import { Achievement, ActivityType, GradeAccess, Subject, defaultSubjects, VocabularyWord, GrammarRule } from './types';
import { speechEngine } from './utils/speechEngine';
import { getGradeBackgroundColor } from './utils/gradeColors';
import { supabase, checkSupabaseConnection, hasValidSupabaseCredentials } from './lib/supabase';
import { ChevronRight } from 'lucide-react';

function App() {
  const [gradeAccess, setGradeAccess] = useState<GradeAccess | null>(null);
  const [activeTab, setActiveTab] = useState<string>('units');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [selectedWords, setSelectedWords] = useState<VocabularyWord[]>([]);
  const [selectedGrammar, setSelectedGrammar] = useState<GrammarRule[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean | null>(null);

  const { progress, achievements, addScore, updateStreak, completeUnit, getSubjectProgress, getUnitProgress } = useProgress(
    gradeAccess?.studentKeyId || gradeAccess?.teacherId
  );

  useEffect(() => {
    // Check Supabase connection on app start
    const checkConnection = async () => {
      // التحقق من الاتصال بصمت
      const connected = await checkSupabaseConnection().catch(() => false);
      setIsSupabaseConnected(connected);
    };
    
    // تشغيل التحقق من الاتصال
    checkConnection();

    // Initialize speech engine
    speechEngine.initialize().catch(() => {});
  }, []);

  useEffect(() => {
    // Check for new achievements
    const newAchievement = achievements.find(a => 
      a.achieved && (!a.achievedDate ||
      new Date(a.achievedDate).getTime() > Date.now() - 5000)
    );

    if (newAchievement && newAchievement !== currentAchievement) {
      setCurrentAchievement(newAchievement);
      window.setTimeout(() => setCurrentAchievement(null), 5000);
    }
  }, [achievements, currentAchievement]);

  const handleLogin = (access: GradeAccess) => {
    setGradeAccess(access);
    
    // Set default subject to English for all users
    const englishSubject = defaultSubjects[0]; // English is the only subject
    if (englishSubject) {
      setSelectedSubject(englishSubject);
    }
  };

  const handleLogout = () => {
    setGradeAccess(null);
    setActiveTab('units');
    setSelectedSubject(null);
    setSelectedUnit(null);
    setSelectedWords([]);
    setSelectedGrammar([]);
  };

  const handleSubjectChange = (subject: Subject) => {
    setSelectedSubject(subject);
    setSelectedUnit(null);
    setSelectedWords([]);
    setSelectedGrammar([]);
    setActiveTab('subjects');
  };

  const handleUnitSelect = (unitName: string, words: VocabularyWord[], grammar?: GrammarRule[]) => {
    setSelectedUnit(unitName);
    setSelectedWords(words);
    setSelectedGrammar(grammar || []);
    setActiveTab('units');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    if (tab === 'subjects') {
      setSelectedUnit(null);
      setSelectedWords([]);
      setSelectedGrammar([]);
    }
  };

  const handleActivityScore = (points: number) => {
    addScore(points, selectedSubject?.id, selectedUnit || undefined);
  };

  const handleActivityStreak = (increment: boolean) => {
    updateStreak(increment, selectedSubject?.id);
  };

  // Show login screen if not logged in
  if (!gradeAccess) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Show admin panel for admin users
  if (gradeAccess.isAdmin) {
    return <AdminPanel />;
  }

  // Show teacher dashboard for teachers
  if (gradeAccess.isTeacher && gradeAccess.teacherId) {
    const teacher = getTeacherByCode(gradeAccess.code);
    if (teacher) {
      return <TeacherDashboard teacher={teacher} onLogout={handleLogout} />;
    }
  }

  // Main application for students
  return (
    <div className={`min-h-screen ${getGradeBackgroundColor(gradeAccess.grade)}`}>
      <Header progress={progress} gradeAccess={gradeAccess} onLogout={handleLogout} />
      <Navigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        gradeAccess={gradeAccess}
        currentSubject={selectedSubject}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 py-8">
        <ProgressBar progress={progress} currentActivity={activeTab} />
        
        {activeTab === 'units' && !selectedUnit && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-slate-800 mb-4">
                الوحدات الدراسية
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                اختر الوحدة التي تريد دراستها - الصف {gradeAccess.grade}
              </p>
            </div>
            
            <SubjectUnits
              subject={selectedSubject || defaultSubjects[0]}
              grade={gradeAccess.grade}
              onUnitSelect={handleUnitSelect}
              getUnitProgress={getUnitProgress}
              getSubjectProgress={getSubjectProgress}
            />
          </div>
        )}
        
        {activeTab === 'units' && selectedUnit && (
          <VocabularyUnit
            title={selectedUnit}
            words={selectedWords}
            grammarRules={selectedGrammar}
            onBack={() => {
              setSelectedUnit(null);
              setSelectedWords([]);
              setSelectedGrammar([]);
            }}
          />
        )}
        
        {activeTab === 'practice' && selectedWords.length > 0 && (
          <div className="space-y-8">
            {/* Back Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('units')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
                العودة للوحدات الدراسية
              </button>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">
                التدريب التفاعلي
                <span className="block text-lg text-gray-600 mt-2">Interactive Practice</span>
              </h2>
              <p className="text-slate-600">
                اختر نوع التمرين الذي تريد ممارسته
                <span className="block text-sm text-gray-500 mt-1">Choose the type of exercise you want to practice</span>
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                   onClick={() => setActiveTab('flashcards')}>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  🎴 البطاقات التعليمية
                  <span className="block text-sm text-gray-500 mt-1">Flashcards</span>
                </h3>
                <p className="text-gray-600">
                  تعلم الكلمات بطريقة تفاعلية
                  <span className="block text-sm text-gray-500 mt-1">Learn words interactively</span>
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                   onClick={() => setActiveTab('quiz')}>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  📝 اختبار سريع
                  <span className="block text-sm text-gray-500 mt-1">Quick Quiz</span>
                </h3>
                <p className="text-gray-600">
                  اختبر معرفتك بالكلمات
                  <span className="block text-sm text-gray-500 mt-1">Test your vocabulary knowledge</span>
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                   onClick={() => setActiveTab('memory')}>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  🧠 لعبة الذاكرة
                  <span className="block text-sm text-gray-500 mt-1">Memory Game</span>
                </h3>
                <p className="text-gray-600">
                  طابق الكلمات مع معانيها
                  <span className="block text-sm text-gray-500 mt-1">Match words with meanings</span>
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                   onClick={() => setActiveTab('pronunciation')}>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  🔊 تدريب النطق
                  <span className="block text-sm text-gray-500 mt-1">Pronunciation Practice</span>
                </h3>
                <p className="text-gray-600">
                  تحسين النطق الصحيح
                  <span className="block text-sm text-gray-500 mt-1">Improve correct pronunciation</span>
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                   onClick={() => setActiveTab('grammar')}>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  📚 تحدي القواعد
                  <span className="block text-sm text-gray-500 mt-1">Grammar Challenge</span>
                </h3>
                <p className="text-gray-600">
                  تعلم قواعد اللغة
                  <span className="block text-sm text-gray-500 mt-1">Learn language grammar</span>
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                   onClick={() => setActiveTab('spelling')}>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  ✍️ تمرين التهجئة
                  <span className="block text-sm text-gray-500 mt-1">Spelling Exercise</span>
                </h3>
                <p className="text-gray-600">
                  تحسين مهارات التهجئة
                  <span className="block text-sm text-gray-500 mt-1">Improve spelling skills</span>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'practice' && selectedWords.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-yellow-700 mb-4">اختر وحدة أولاً</h3>
              <p className="text-yellow-600 mb-6">
                يجب اختيار وحدة دراسية من تبويب "الوحدات الدراسية" قبل البدء في التدريب
              </p>
              <button
                onClick={() => setActiveTab('units')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                اذهب للوحدات الدراسية
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'flashcards' && selectedWords.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('practice')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
                العودة للتدريب التفاعلي
              </button>
            </div>
            
          <FlashCards 
            words={selectedWords} 
            onScore={handleActivityScore}
            onStreak={handleActivityStreak}
          />
          </div>
        )}
        
        {activeTab === 'quiz' && selectedWords.length > 0 && (
          <div className="space-y-6">
            {/* Back Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('practice')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
                العودة للتدريب التفاعلي
              </button>
            </div>
            
          <Quiz 
            words={selectedWords} 
            onScore={handleActivityScore}
            onStreak={handleActivityStreak}
          />
          </div>
        )}
        
        {activeTab === 'memory' && selectedWords.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('practice')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
                العودة للتدريب التفاعلي
              </button>
            </div>
            
          <MemoryGame 
            words={selectedWords} 
            onScore={handleActivityScore}
          />
          </div>
        )}
        
        {activeTab === 'pronunciation' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('practice')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
                العودة للتدريب التفاعلي
              </button>
            </div>
            
          <PronunciationPractice 
            onScore={handleActivityScore}
          />
          </div>
        )}
        
        {activeTab === 'grammar' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('practice')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
                العودة للتدريب التفاعلي
              </button>
            </div>
            
          <GrammarChallenge 
            onScore={handleActivityScore}
            onStreak={handleActivityStreak}
            grade={gradeAccess.grade}
          />
          </div>
        )}
        
        {activeTab === 'spelling' && selectedWords.length > 0 && (
          <div className="space-y-6">
            {/* Enhanced Back Button */}
            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-rose-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('practice')}
                    className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                    ← العودة للتدريب التفاعلي
                    <span className="text-sm opacity-90 block">Back to Practice</span>
                  </button>
                </div>
                
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="hover:text-blue-600 cursor-pointer" onClick={() => setActiveTab('units')}>الوحدات</span>
                  <ChevronRight className="w-4 h-4" />
                  <span className="hover:text-green-600 cursor-pointer" onClick={() => setActiveTab('practice')}>التدريب</span>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-rose-600 font-semibold">تمرين التهجئة</span>
                </div>
              </div>
            </div>
            
            <SpellingExercise 
              words={selectedWords}
              onScore={handleActivityScore}
              onStreak={handleActivityStreak}
            />
          </div>
        )}
        
        {activeTab === 'free-writing' && (
          <FreeWriting 
            onScore={handleActivityScore}
          />
        )}
        
        {/* Support Information */}
        <div className="mt-12">
          <SupportInfo />
        </div>
      </main>
      
      {/* Achievement Notification */}
      <AchievementNotification 
        achievement={currentAchievement}
        onClose={() => setCurrentAchievement(null)}
      />
    </div>
  );
}

export default App;