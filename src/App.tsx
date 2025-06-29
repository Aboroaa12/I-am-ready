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
import ProgressBar from './components/ProgressBar';
import AchievementNotification from './components/AchievementNotification';
import AdminPanel from './components/AdminPanel';
import TeacherDashboard from './components/TeacherDashboard';
import SubjectSelector from './components/SubjectSelector';
import SubjectUnits from './components/SubjectUnits';
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
  const [teacher, setTeacher] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('subjects');
  const [currentActivity, setCurrentActivity] = useState<ActivityType | null>(null);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [showWordReport, setShowWordReport] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<{ name: string; words: VocabularyWord[]; grammar: GrammarRule[] } | null>(null);
  const { progress, achievements, addScore, updateStreak, completeUnit, getSubjectProgress, getUnitProgress } = useProgress(gradeAccess?.code);

  useEffect(() => {
    // التحقق من الاتصال بـ Supabase
    const checkConnection = async () => {
      if (!hasValidSupabaseCredentials()) {
        setIsConnected(false);
        console.warn('⚠️ Supabase credentials are not configured properly');
        return;
      }

      const connected = await checkSupabaseConnection();
      setIsConnected(connected);
      console.log('Supabase connection status:', connected ? 'Connected' : 'Disconnected');
    };
    
    checkConnection();
    
    // Check for grade parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const gradeParam = urlParams.get('grade');
    
    if (gradeParam) {
      const selectedGrade = parseInt(gradeParam, 10);
      // Clear URL parameter after reading it
      window.history.replaceState({}, document.title, window.location.pathname);
      // Set the selected grade for the login screen
      setSelectedGrade(selectedGrade);
    }
  }, []);

  const [selectedGrade, setSelectedGrade] = useState<number | undefined>(undefined);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await speechEngine.initialize();
        console.log('تم تحميل نظام الصوت بنجاح');
      } catch (error) {
        console.warn('فشل في تحميل نظام الصوت:', error);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const newAchievement = achievements.find(a => 
      a.achieved && (!a.achievedDate || 
      new Date(a.achievedDate).getTime() > Date.now() - 5000)
    );
    
    if (newAchievement && newAchievement !== currentAchievement) {
      setCurrentAchievement(newAchievement);
    }
  }, [achievements, currentAchievement]);

  const handleLogin = (access: GradeAccess) => {
    setGradeAccess(access);
    
    // Check if this is a teacher login
    if (access.isTeacher && access.teacherId) {
      const teacherData = getTeacherByCode(access.code);
      if (teacherData) {
        setTeacher(teacherData);
      }
    }
    
    // If admin, set active tab to admin panel
    if (access.isAdmin) {
      setActiveTab('admin');
    } else {
      // For students, start with subjects page
      setActiveTab('subjects');
      // Set English as default subject
      const englishSubject = defaultSubjects.find(s => s.id === 'english');
      if (englishSubject) {
        setCurrentSubject(englishSubject);
      }
    }
  };

  const handleSubjectChange = (subject: Subject) => {
    console.log('Subject changed to:', subject);
    console.log('Subject activities:', subject.activities);
    
    // Ensure the subject has activities, if not, find from default subjects
    let subjectWithActivities = subject;
    if (!subject.activities || subject.activities.length === 0) {
      const defaultSubject = defaultSubjects.find(ds => ds.id === subject.id);
      if (defaultSubject) {
        subjectWithActivities = { ...subject, activities: defaultSubject.activities };
        console.log('Fixed subject with activities:', subjectWithActivities);
      }
    }
    
    setCurrentSubject(subjectWithActivities);
    setActiveTab('subjects'); // Always go to subjects tab when changing subject
    setCurrentActivity(null); // Close any open activity
    setSelectedUnit(null); // Clear any selected unit when changing subject
  };

  const handleUnitSelect = (unitName: string, words: VocabularyWord[], grammar?: GrammarRule[]) => {
    setSelectedUnit({
      name: unitName,
      words,
      grammar: grammar || []
    });
  };

  const getAvailableActivities = (): ActivityType[] => {
    if (!currentSubject) return [];
    return currentSubject.activities || [];
  };

  const isActivityAvailable = (activity: ActivityType): boolean => {
    const availableActivities = getAvailableActivities();
    return availableActivities.includes(activity);
  };

  // إذا لم يتم تسجيل الدخول، عرض شاشة تسجيل الدخول
  if (!gradeAccess) {
    return <LoginScreen onLogin={handleLogin} selectedGrade={selectedGrade} />;
  }

  // إذا كان المستخدم معلماً، عرض لوحة تحكم المعلم
  if (gradeAccess.isTeacher && teacher) {
    return (
      <TeacherDashboard 
        teacher={teacher} 
        onLogout={() => {
          setGradeAccess(null);
          setTeacher(null);
        }} 
      />
    );
  }

  // إذا كان المستخدم مديراً وتم اختيار تبويب admin
  if (gradeAccess.isAdmin && activeTab === 'admin') {
    return (
      <div className={`min-h-screen ${getGradeBackgroundColor(0)}`} dir="rtl">
        <Header progress={progress} gradeAccess={gradeAccess} />
        <Navigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          gradeAccess={gradeAccess}
          currentSubject={currentSubject}
          onLogout={() => setGradeAccess(null)}
        />
        <AdminPanel />
      </div>
    );
  }

  const currentGrade = gradeAccess.grade === 0 ? 5 : gradeAccess.grade; // المدير يرى الصف الخامس افتراضياً
  const currentWords = getVocabularyByGrade(currentGrade);
  const currentUnits = getUnitsByGrade(currentGrade);
  const currentGrammar = getGrammarByGrade(currentGrade);
  const currentQuestions = getQuestionsByGrade(currentGrade);

  // خريطة الوحدات لكل صف
  const getUnitMapping = (grade: number): { [key: string]: string } => {
    const unitMappings: { [key: number]: { [key: string]: string } } = {
      1: {
        'family': 'Family',
        'animals': 'Animals',
        'colors': 'Colors',
        'numbers': 'Numbers',
        'bodyparts': 'Body Parts',
        'food': 'Food',
        'school': 'School'
      },
      2: {
        'home': 'Home',
        'toysandgames': 'Toys and Games',
        'weather': 'Weather',
        'clothes': 'Clothes',
        'actions': 'Actions',
        'transportation': 'Transportation',
        'time': 'Time'
      },
      3: {
        'friendsandfriendship': 'Friends and Friendship',
        'sportsandactivities': 'Sports and Activities',
        'foodandmeals': 'Food and Meals'
      },
      4: {
        'natureandenvironment': 'Nature and Environment',
        'technologyandcommunication': 'Technology and Communication'
      },
      5: {
        'welcome': 'Welcome Back',
        'talent': 'Talent Show',
        'time': 'Then and Now',
        'explore': 'Let\'s Explore!',
        'shops': 'Off to the Shops',
        'adventure': 'Adventure Stories',
        'science': 'Science and Nature',
        'technology': 'Technology and Communication',
        'health': 'Health and Fitness',
        'community': 'Community and Culture'
      },
      6: {
        'wowteam': 'The WOW! Team',
        'freetimefun': 'Free-time fun',
        'technology': 'Technology',
        'places': 'Places'
      },
      9: {
        'globalcitizens': 'Global Citizens',
        'technologytoday': 'Technology Today',
        'healthfitness': 'Health and Fitness',
        'careerpaths': 'Career Paths',
        'culturalexchange': 'Cultural Exchange'
      },
      10: {
        'futureaspirations': 'Future Aspirations',
        'sciencediscovery': 'Science and Discovery',
        'mediacommunication': 'Media and Communication',
        'globalchallenges': 'Global Challenges',
        'artsculture': 'Arts and Culture'
      },
      11: {
        'highereducation': 'Higher Education',
        'globalization': 'Globalization',
        'environmentalsustainability': 'Environmental Sustainability',
        'innovationtechnology': 'Innovation and Technology',
        'literaturearts': 'Literature and Arts'
      },
      12: {
        'newsmedia': 'News and the Media',
        'workcareers': 'Work and Careers',
        'healthsafety': 'Health and Safety',
        'citizenship': 'Citizenship'
      }
    };
    
    return unitMappings[grade] || {};
  };

  const unitMapping = getUnitMapping(currentGrade);

  const getCurrentWords = () => {
    if (activeTab === 'practice') return currentWords;
    const unitName = unitMapping[activeTab];
    return currentWords.filter(word => word.unit === unitName);
  };

  const getCurrentGrammarRules = () => {
    if (activeTab === 'practice') return currentGrammar;
    const unitName = unitMapping[activeTab];
    return currentGrammar.filter(rule => rule.unit === unitName);
  };

  const handleWordPronounce = async (word: string) => {
    try {
      await speechEngine.speak(word, {
        emphasis: true,
        rate: 0.85,
        pitch: 1.0,
        volume: 1.0
      });
      
      addScore(2);
      
      const encouragements = [
        `🔊 ${word} - نطق رائع!`,
        `👂 استمع جيداً لـ ${word}`,
        `⭐ ${word} - أحسنت!`,
        `🎯 نطق ${word} واضح!`
      ];
      
      const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold';
      notification.textContent = randomEncouragement;
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
      console.error('خطأ في تشغيل النطق:', error);
      
      let errorMessage = '❌ خطأ في تشغيل الصوت';
      let errorClass = 'bg-red-500';
      
      // Check if the error is specifically a speech timeout
      if (error instanceof Error && error.message === 'Speech timeout') {
        errorMessage = '⏱️ انتهت مهلة النطق - جرب تحديث الصفحة أو استخدم متصفح Chrome/Edge';
        errorClass = 'bg-orange-500';
      }
      
      const errorNotification = document.createElement('div');
      errorNotification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 ${errorClass} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 font-semibold max-w-md text-center`;
      errorNotification.textContent = errorMessage;
      document.body.appendChild(errorNotification);
      
      setTimeout(() => {
        errorNotification.style.opacity = '0';
        setTimeout(() => {
          if (document.body.contains(errorNotification)) {
            document.body.removeChild(errorNotification);
          }
        }, 300);
      }, 4000); // Show timeout errors longer since they contain more information
    }
  };

  const handleActivityStart = (activity: ActivityType) => {
    // Only start activity if it's available for current subject
    if (isActivityAvailable(activity)) {
      setCurrentActivity(activity);
      setActiveTab('practice');
    }
  };

  const handleActivityClose = () => {
    setCurrentActivity(null);
  };

  const handleLogout = () => {
    setGradeAccess(null);
    setTeacher(null);
    setActiveTab('welcome');
    setCurrentActivity(null);
  };

  const getActivityName = (activity: ActivityType) => {
    const names = {
      flashcards: 'بطاقات المراجعة التفاعلية',
      quiz: 'الاختبار التفاعلي',
      memory: 'لعبة الذاكرة',
      pronunciation: 'تمرين النطق',
      grammar: 'تحدي القواعد',
      spelling: 'تمرين التهجئة',
      'sentence-writing': 'كتابة الجمل الإبداعية',
      'sentence-completion': 'إكمال الجملة التفاعلي',
      'test-exercises': 'اختبارات تفاعلية'
    };
    return names[activity];
  };

  const renderTabContent = () => {
    // Subject selection page
    if (activeTab === 'subjects') {
      return (
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Subject Selector */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                مرحباً بك في منصة التعلم التفاعلية
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                اختر المادة الدراسية التي ترغب في تعلمها
              </p>
              <div className="flex justify-center">
                <SubjectSelector 
                  onSubjectChange={handleSubjectChange}
                  currentSubject={currentSubject}
                />
              </div>
            </div>
          </div>

          {/* Show units for selected subject */}
          {currentSubject && selectedUnit && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setSelectedUnit(null)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← العودة للوحدات
                </button>
                </div>
              <VocabularyUnit
                title={selectedUnit.name}
                words={selectedUnit.words}
                grammarRules={selectedUnit.grammar}
              />
              </div>
          )}

          {/* Show subject units when subject is selected but no unit is chosen */}
          {currentSubject && !selectedUnit && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <SubjectUnits
                subject={currentSubject}
                grade={currentGrade}
                onUnitSelect={handleUnitSelect}
                getUnitProgress={getUnitProgress}
                getSubjectProgress={getSubjectProgress}
              />
            </div>
          )}
        </div>
      );
    }

    // Units page for English subject
    if (activeTab === 'units') {
      return (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-4xl">📚</span>
                <h1 className="text-3xl font-bold text-gray-800">
                  وحدات اللغة الإنجليزية - الصف {currentGrade}
                </h1>
              </div>
              <p className="text-xl text-gray-600">
                اختر الوحدة التي ترغب في دراستها
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(getUnitMapping(currentGrade)).map(([unitId, unitName]) => (
                <div
                  key={unitId}
                  onClick={() => setActiveTab(unitId)}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">📖</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {unitName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      تعلم المفردات والقواعد الخاصة بهذه الوحدة
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'practice') {
      // Check if user has selected a subject
      if (!currentSubject) {
        return (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                يرجى اختيار مادة دراسية أولاً
              </h2>
              <p className="text-gray-600 mb-6">
                لبدء التدريب التفاعلي، يجب عليك اختيار مادة دراسية من صفحة المواد الدراسية
              </p>
              <button
                onClick={() => setActiveTab('subjects')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                اختر المادة الدراسية
              </button>
            </div>
          </div>
        );
      }

      // Show activities for selected subject when no specific activity is selected
      if (!currentActivity) {
        return (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-4xl">{currentSubject.icon}</span>
                  <h2 className="text-2xl font-bold text-gray-800">التدريب التفاعلي - {currentSubject.name}</h2>
                </div>
                <p className="text-gray-600">اختر النشاط التعليمي الذي ترغب في ممارسته</p>
              </div>

              {(() => {
                const availableActivities = getAvailableActivities();
                
                if (availableActivities.length > 0) {
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {availableActivities.map((activity) => (
                        <div
                          key={activity}
                          onClick={() => handleActivityStart(activity)}
                          className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          <div className="text-center">
                            <div className="text-4xl mb-4">
                              {activity === 'flashcards' && '📚'}
                              {activity === 'quiz' && '❓'}
                              {activity === 'memory' && '🧠'}
                              {activity === 'pronunciation' && '🗣️'}
                              {activity === 'grammar' && '📝'}
                              {activity === 'spelling' && '✏️'}
                              {activity === 'sentence-writing' && '📖'}
                              {activity === 'sentence-completion' && '🔤'}
                              {activity === 'test-exercises' && '📋'}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                              {getActivityName(activity)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {activity === 'flashcards' && 'تعلم المفردات بطريقة تفاعلية وممتعة'}
                              {activity === 'quiz' && 'اختبر معلوماتك مع أسئلة متنوعة'}
                              {activity === 'memory' && 'حسن ذاكرتك مع لعبة المطابقة'}
                              {activity === 'pronunciation' && 'تدرب على النطق الصحيح'}
                              {activity === 'grammar' && 'تعلم القواعد بطريقة تفاعلية'}
                              {activity === 'spelling' && 'حسن مهارات التهجئة لديك'}
                              {activity === 'sentence-writing' && 'تدرب على كتابة الجمل'}
                              {activity === 'sentence-completion' && 'أكمل الجمل بالكلمات المناسبة'}
                              {activity === 'test-exercises' && 'اختبارات شاملة لقياس تقدمك'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                } else {
                  return (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🚧</div>
                      <h3 className="text-xl font-bold text-gray-600 mb-2">
                        الأنشطة قيد التطوير
                      </h3>
                      <p className="text-gray-500">
                        ستتوفر أنشطة هذه المادة قريباً
                      </p>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        );
      }

      if (currentActivity === 'test-exercises') {
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">اختبارات تفاعلية</h2>
              <button
                onClick={handleActivityClose}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                العودة للأنشطة
              </button>
            </div>
            <TestExercises
              grade={currentGrade}
              onScore={(points) => addScore(points, currentSubject?.id, selectedUnit?.name)}
              onStreak={(increment) => updateStreak(increment, currentSubject?.id)}
            />
          </div>
        );
      }
      
      if (currentActivity) {
        switch (currentActivity) {
          case 'flashcards':
            return (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">بطاقات المراجعة التفاعلية</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowWordReport(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      📊 تقرير التقدم
                    </button>
                    <button
                      onClick={handleActivityClose}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      العودة للأنشطة
                    </button>
                  </div>
                </div>
                <FlashCards
                  words={currentWords}
                  onScore={(points) => addScore(points, currentSubject?.id, selectedUnit?.name)}
                  onStreak={(increment) => updateStreak(increment, currentSubject?.id)}
                />
              </div>
            );
          case 'quiz':
            return (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">الاختبار التفاعلي</h2>
                  <button
                    onClick={handleActivityClose}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    العودة للأنشطة
                  </button>
                </div>
                <Quiz
                  words={currentWords}
                  onScore={(points) => addScore(points, currentSubject?.id, selectedUnit?.name)}
                  onStreak={(increment) => updateStreak(increment, currentSubject?.id)}
                />
              </div>
            );
          case 'memory':
            return (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">لعبة الذاكرة</h2>
                  <button
                    onClick={handleActivityClose}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    العودة للأنشطة
                  </button>
                </div>
                <MemoryGame
                  words={currentWords}
                  onScore={(points) => addScore(points, currentSubject?.id, selectedUnit?.name)}
                />
              </div>
            );
          case 'pronunciation':
            return (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">تمرين النطق المتقدم</h2>
                  <button
                    onClick={handleActivityClose}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    العودة للأنشطة
                  </button>
                </div>
                <PronunciationPractice onScore={(points) => addScore(points, currentSubject?.id, selectedUnit?.name)} />
              </div>
            );
          case 'grammar':
            return (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">تحدي القواعد</h2>
                  <button
                    onClick={handleActivityClose}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    العودة للأنشطة
                  </button>
                </div>
                <GrammarChallenge
                  onScore={(points) => addScore(points, currentSubject?.id, selectedUnit?.name)}
                  onStreak={(increment) => updateStreak(increment, currentSubject?.id)}
                />
              </div>
            );
          case 'spelling':
            return (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">تمرين التهجئة التفاعلي</h2>
                  <button
                    onClick={handleActivityClose}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    العودة للأنشطة
                  </button>
                </div>
                <SpellingExercise
                  words={currentWords}
                  onScore={(points) => addScore(points, currentSubject?.id, selectedUnit?.name)}
                  onStreak={(increment) => updateStreak(increment, currentSubject?.id)}
                />
              </div>
            );
          case 'sentence-writing':
            return (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">كتابة الجمل الإبداعية</h2>
                  <button
                    onClick={handleActivityClose}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    العودة للأنشطة
                  </button>
                </div>
                <SentenceWriting
                  words={currentWords}
                  onScore={(points) => addScore(points, currentSubject?.id, selectedUnit?.name)}
                  onStreak={(increment) => updateStreak(increment, currentSubject?.id)}
                />
              </div>
            );
          case 'sentence-completion':
            return (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">إكمال الجملة التفاعلي</h2>
                  <button
                    onClick={handleActivityClose}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    العودة للأنشطة
                  </button>
                </div>
                <SentenceCompletion
                  words={currentWords}
                  onScore={(points) => addScore(points, currentSubject?.id, selectedUnit?.name)}
                  onStreak={(increment) => updateStreak(increment, currentSubject?.id)}
                  grade={currentGrade}
                />
              </div>
            );
          default:
            return null;
        }
      }

      return (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">التدريب التفاعلي والأنشطة</h2>
            <p className="text-gray-600 mb-8">اختر النشاط الذي تريد التدرب عليه - {gradeAccess.name}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6 border-r-4 border-blue-500">
            <h3 className="text-xl font-bold text-gray-800 mb-4">نصائح للدراسة الفعالة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <span>راجع الكلمات يومياً لمدة 10-15 دقيقة</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <span>ركز على الجمل الأساسية وحفظها</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔄</span>
                <span>كرر النطق الصحيح للكلمات</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎮</span>
                <span>استخدم الألعاب التفاعلية للمراجعة</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">✍️</span>
                <span>اكتب جملاً من إنشائك باستخدام الكلمات الجديدة</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔊</span>
                <span>استمع للنطق الصحيح واتبعه</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={() => handleActivityStart('test-exercises')}
              className="bg-gradient-to-br from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white p-6 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-3xl mb-3">📝</div>
              <div>اختبارات تفاعلية</div>
              <div className="text-sm opacity-80 mt-2">تدرب على اختبارات مشابهة للاختبارات المدرسية</div>
            </button>
            
            <button
              onClick={() => handleActivityStart('flashcards')}
              className="bg-gradient-to-br from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white p-6 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-3xl mb-3">🎴</div>
              <div>بطاقات المراجعة التفاعلية</div>
              <div className="text-sm opacity-80 mt-2">نظام شامل لتتبع التقدم في النطق والتهجئة والاستخدام والقواعد</div>
            </button>

            <button
              onClick={() => handleActivityStart('sentence-completion')}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-6 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-3xl mb-3">✍️</div>
              <div>إكمال الجملة التفاعلي</div>
              <div className="text-sm opacity-80 mt-2">اختر الكلمات المناسبة لإكمال الجمل بمستويات صعوبة مختلفة</div>
            </button>

            <button
              onClick={() => handleActivityStart('quiz')}
              className="bg-gradient-to-br from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white p-6 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-3xl mb-3">📝</div>
              <div>اختبار سريع</div>
              <div className="text-sm opacity-80 mt-2">اختبر معرفتك بالكلمات</div>
            </button>

            <button
              onClick={() => handleActivityStart('memory')}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-6 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-3xl mb-3">🧠</div>
              <div>لعبة الذاكرة</div>
              <div className="text-sm opacity-80 mt-2">اعثر على الأزواج المتطابقة</div>
            </button>

            <button
              onClick={() => handleActivityStart('pronunciation')}
              className="bg-gradient-to-br from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white p-6 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-3xl mb-3">🔊</div>
              <div>تمرين النطق المتقدم</div>
              <div className="text-sm opacity-80 mt-2">نظام صوتي ذكي عالي الجودة</div>
            </button>

            <button
              onClick={() => handleActivityStart('spelling')}
              className="bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white p-6 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-3xl mb-3">🔤</div>
              <div>تمرين التهجئة</div>
              <div className="text-sm opacity-80 mt-2">تعلم تهجئة الكلمات بطريقة تفاعلية</div>
            </button>

            <button
              onClick={() => handleActivityStart('grammar')}
              className="bg-gradient-to-br from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white p-6 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-3xl mb-3">⚡</div>
              <div>تحدي القواعد</div>
              <div className="text-sm opacity-80 mt-2">تطبيق قواعد اللغة</div>
            </button>

            <button
              onClick={() => handleActivityStart('sentence-writing')}
              className="bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white p-6 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
            >
              <div className="text-3xl mb-3">✍️</div>
              <div>كتابة الجمل الإبداعية</div>
              <div className="text-sm opacity-80 mt-2">اكتب جملاً من إنشائك مع التصحيح الذكي</div>
            </button>
          </div>

          {/* Quick Access to Progress Report */}
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 border border-indigo-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-indigo-800 mb-2">📊 تقرير التقدم الشامل</h3>
                <p className="text-indigo-600">اطلع على تقدمك المفصل في جميع الكلمات والمهارات</p>
              </div>
              <button
                onClick={() => setShowWordReport(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
              >
                عرض التقرير
              </button>
            </div>
          </div>
          
          {/* Connection Status */}
          <div className={`${isConnected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border rounded-xl p-4 text-center`}>
            <p className={`${isConnected ? 'text-green-700' : 'text-yellow-700'}`}>
              <strong>{isConnected ? '✓ متصل بقاعدة البيانات' : '⚠️ وضع غير متصل'}</strong><br />
              {isConnected 
                ? 'تقدمك يتم حفظه ومزامنته تلقائياً'
                : hasValidSupabaseCredentials() 
                  ? 'سيتم حفظ تقدمك محلياً ومزامنته عند توفر الاتصال'
                  : 'يرجى تحديث متغيرات البيئة في ملف .env للاتصال بقاعدة البيانات'
              }
            </p>
          </div>
        </div>
      );
    }

    const unitName = unitMapping[activeTab];
    const words = getCurrentWords();
    const grammar = getCurrentGrammarRules();

    return (
      <VocabularyUnit
        title={unitName || `محتوى ${gradeAccess.name}`}
        words={words}
        grammarRules={grammar}
        onWordPronounce={handleWordPronounce}
      />
    );
  };

  return (
    <div className={`min-h-screen ${getGradeBackgroundColor(currentGrade)}`} dir="rtl">
      <Header progress={progress} gradeAccess={gradeAccess} />
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        gradeAccess={gradeAccess}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 py-8">
        <ProgressBar 
          progress={progress} 
          currentActivity={currentActivity ? getActivityName(currentActivity) : undefined}
        />
        {renderTabContent()}
      </main>

      <AchievementNotification
        achievement={currentAchievement}
        onClose={() => setCurrentAchievement(null)}
      />

      {showWordReport && (
        <WordProgressReport
          words={currentWords}
          onClose={() => setShowWordReport(false)}
        />
      )}
    </div>
  );
}

export default App;