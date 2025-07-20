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

function App() {
  const [gradeAccess, setGradeAccess] = useState<GradeAccess | null>(null);
  const [activeTab, setActiveTab] = useState<string>('subjects');
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
      const connected = await checkSupabaseConnection();
      setIsSupabaseConnected(connected);
    };
    checkConnection();

    // Initialize speech engine
    speechEngine.initialize().catch(console.error);
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
    
    // Set default subject to English for students
    if (!access.isAdmin && !access.isTeacher) {
      const englishSubject = defaultSubjects[0]; // English is the only subject
      if (englishSubject) {
        setSelectedSubject(englishSubject);
      }
    }
  };

  const handleLogout = () => {
    setGradeAccess(null);
    setActiveTab('subjects');
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
        
        {activeTab === 'subjects' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-slate-800 mb-4">
                تعلم اللغة الإنجليزية
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                بطريقة تفاعلية وممتعة للصف {gradeAccess.grade}
              </p>
            </div>
            
            {(() => {
              // Auto-select English subject if not already selected
              if (!selectedSubject) {
                const englishSubject = defaultSubjects[0];
                if (englishSubject) {
                  handleSubjectChange(englishSubject);
                }
              }
              return selectedSubject && (
              <SubjectUnits
                subject={selectedSubject}
                grade={gradeAccess.grade}
                onUnitSelect={handleUnitSelect}
                getUnitProgress={getUnitProgress}
                getSubjectProgress={getSubjectProgress}
              />
              );
            })()}
          </div>
        )}
        
        {activeTab === 'units' && selectedSubject && selectedUnit && (
          <VocabularyUnit
            title={selectedUnit}
            words={selectedWords}
            grammarRules={selectedGrammar}
          />
        )}
        
        {activeTab === 'practice' && selectedWords.length > 0 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                   onClick={() => setActiveTab('flashcards')}>
                <h3 className="text-xl font-bold text-gray-800 mb-2">🎴 البطاقات التعليمية</h3>
                <p className="text-gray-600">تعلم الكلمات بطريقة تفاعلية</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                   onClick={() => setActiveTab('quiz')}>
                <h3 className="text-xl font-bold text-gray-800 mb-2">📝 اختبار سريع</h3>
                <p className="text-gray-600">اختبر معرفتك بالكلمات</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                   onClick={() => setActiveTab('memory')}>
                <h3 className="text-xl font-bold text-gray-800 mb-2">🧠 لعبة الذاكرة</h3>
                <p className="text-gray-600">طابق الكلمات مع معانيها</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                   onClick={() => setActiveTab('pronunciation')}>
                <h3 className="text-xl font-bold text-gray-800 mb-2">🔊 تدريب النطق</h3>
                <p className="text-gray-600">تحسين النطق الصحيح</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                   onClick={() => setActiveTab('grammar')}>
                <h3 className="text-xl font-bold text-gray-800 mb-2">📚 تحدي القواعد</h3>
                <p className="text-gray-600">تعلم قواعد اللغة</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                   onClick={() => setActiveTab('spelling')}>
                <h3 className="text-xl font-bold text-gray-800 mb-2">✍️ تمرين التهجئة</h3>
                <p className="text-gray-600">تحسين مهارات التهجئة</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'flashcards' && selectedWords.length > 0 && (
          <FlashCards 
            words={selectedWords} 
            onScore={handleActivityScore}
            onStreak={handleActivityStreak}
          />
        )}
        
        {activeTab === 'quiz' && selectedWords.length > 0 && (
          <Quiz 
            words={selectedWords} 
            onScore={handleActivityScore}
            onStreak={handleActivityStreak}
          />
        )}
        
        {activeTab === 'memory' && selectedWords.length > 0 && (
          <MemoryGame 
            words={selectedWords} 
            onScore={handleActivityScore}
          />
        )}
        
        {activeTab === 'pronunciation' && (
          <PronunciationPractice 
            onScore={handleActivityScore}
          />
        )}
        
        {activeTab === 'grammar' && (
          <GrammarChallenge 
            onScore={handleActivityScore}
            onStreak={handleActivityStreak}
            grade={gradeAccess.grade}
          />
        )}
        
        {activeTab === 'spelling' && selectedWords.length > 0 && (
          <SpellingExercise 
            words={selectedWords}
            onScore={handleActivityScore}
            onStreak={handleActivityStreak}
          />
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