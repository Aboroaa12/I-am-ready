import { useState, useEffect } from 'react';
import { UserProgress, Achievement, WordProgress, StudySession } from '../types';
import { supabase } from '../lib/supabase';

const DEFAULT_PROGRESS: UserProgress = {
  totalScore: 0,
  currentStreak: 0,
  unitsCompleted: [],
  wordsLearned: 0,
  lastStudyDate: new Date().toISOString(),
  wordProgress: {},
  studySessions: [],
  totalStudyTime: 0
};

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_word',
    title: 'أول كلمة',
    description: 'تعلمت أول كلمة!',
    icon: '🌟',
    achieved: false
  },
  {
    id: 'streak_5',
    title: 'متتالية 5',
    description: 'حققت 5 إجابات صحيحة متتالية',
    icon: '🔥',
    achieved: false
  },
  {
    id: 'streak_10',
    title: 'متتالية 10',
    description: 'حققت 10 إجابات صحيحة متتالية',
    icon: '⚡',
    achieved: false
  },
  {
    id: 'unit_complete',
    title: 'وحدة مكتملة',
    description: 'أكملت وحدة كاملة',
    icon: '🏆',
    achieved: false
  },
  {
    id: 'score_100',
    title: 'مائة نقطة',
    description: 'حققت 100 نقطة',
    icon: '💯',
    achieved: false
  },
  {
    id: 'score_500',
    title: 'خمسمائة نقطة',
    description: 'حققت 500 نقطة',
    icon: '🎯',
    achieved: false
  },
  {
    id: 'score_1000',
    title: 'ألف نقطة',
    description: 'حققت 1000 نقطة',
    icon: '👑',
    achieved: false
  },
  {
    id: 'daily_streak_7',
    title: 'أسبوع من التعلم',
    description: 'تعلمت لمدة 7 أيام متتالية',
    icon: '📅',
    achieved: false
  },
  {
    id: 'master_10_words',
    title: 'إتقان 10 كلمات',
    description: 'أتقنت 10 كلمات بنسبة 80% أو أكثر',
    icon: '📚',
    achieved: false
  },
  {
    id: 'perfect_quiz',
    title: 'اختبار مثالي',
    description: 'حققت 100% في اختبار',
    icon: '🎖️',
    achieved: false
  }
];

export const useProgress = (studentId?: string) => {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProgress();
  }, [studentId]);

  const loadProgress = async () => {
    setLoading(true);
    setError(null);
    
    // Clear any old localStorage data if we have a studentId (using code-based identification)
    if (studentId && localStorage.getItem('english-learning-progress')) {
      console.log('Clearing old localStorage progress data for code-based identification');
      localStorage.removeItem('english-learning-progress');
      localStorage.removeItem('english-learning-achievements');
    }
    
    try {
      if (studentId) {
        // محاولة تحميل التقدم من Supabase
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('student_id', studentId)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // تحويل البيانات من تنسيق Supabase إلى تنسيق التطبيق
          const formattedProgress: UserProgress = {
            totalScore: data.total_score,
            currentStreak: data.current_streak,
            unitsCompleted: data.units_completed,
            wordsLearned: data.words_learned,
            lastStudyDate: data.last_study_date,
            wordProgress: data.word_progress as WordProgress,
            studySessions: data.study_sessions,
            totalStudyTime: data.total_study_time,
            studentId: data.student_id
          };
          
          setProgress(formattedProgress);
        } else {
          // إذا لم يتم العثور على بيانات، نقوم بإنشاء تقدم جديد
          const newProgress = {
            ...DEFAULT_PROGRESS,
            studentId
          };
          
          console.log('Creating new progress for student:', studentId, newProgress);
          
          // إضافة التقدم إلى Supabase
          await supabase.from('user_progress').insert({
            id: crypto.randomUUID(),
            student_id: studentId,
            total_score: newProgress.totalScore,
            current_streak: newProgress.currentStreak,
            units_completed: newProgress.unitsCompleted,
            words_learned: newProgress.wordsLearned,
            last_study_date: newProgress.lastStudyDate,
            word_progress: newProgress.wordProgress,
            study_sessions: newProgress.studySessions,
            total_study_time: newProgress.totalStudyTime,
            created_at: new Date().toISOString()
          });
          
          setProgress(newProgress);
        }
        
        // تحميل الإنجازات من Supabase
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('achievements')
          .select('*')
          .eq('student_id', studentId);
        
        if (achievementsError) {
          console.error('Error loading achievements:', achievementsError);
        } else if (achievementsData && achievementsData.length > 0) {
          // تحويل البيانات من تنسيق Supabase إلى تنسيق التطبيق
          const formattedAchievements: Achievement[] = achievementsData.map(achievement => ({
            id: achievement.achievement_id,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            achieved: achievement.achieved,
            achievedDate: achievement.achieved_date
          }));
          
          setAchievements(formattedAchievements);
        } else {
          // إذا لم يتم العثور على إنجازات، نقوم بإضافة الإنجازات الافتراضية
          for (const achievement of ACHIEVEMENTS) {
            await supabase.from('achievements').insert({
              id: crypto.randomUUID(),
              student_id: studentId,
              achievement_id: achievement.id,
              title: achievement.title,
              description: achievement.description,
              icon: achievement.icon,
              achieved: achievement.achieved,
              achieved_date: achievement.achievedDate,
              created_at: new Date().toISOString()
            });
          }
          
          setAchievements(ACHIEVEMENTS);
        }
      } else {
        // إذا لم يتم تحديد معرف الطالب، نحاول تحميل التقدم من التخزين المحلي
        const saved = localStorage.getItem('english-learning-progress');
        if (saved) {
          try {
            const parsedProgress = JSON.parse(saved);
            console.log('Loaded progress from localStorage:', parsedProgress);
            // Ensure all required fields exist
            setProgress({
              ...DEFAULT_PROGRESS,
              ...parsedProgress,
              wordProgress: parsedProgress.wordProgress || {},
              studySessions: parsedProgress.studySessions || [],
              totalStudyTime: parsedProgress.totalStudyTime || 0
            });
          } catch (error) {
            console.error('Error parsing saved progress:', error);
            setProgress(DEFAULT_PROGRESS);
          }
        } else {
          console.log('No saved progress found, using default progress:', DEFAULT_PROGRESS);
          setProgress(DEFAULT_PROGRESS);
        }

        const savedAchievements = localStorage.getItem('english-learning-achievements');
        if (savedAchievements) {
          try {
            setAchievements(JSON.parse(savedAchievements));
          } catch (error) {
            console.error('Error parsing saved achievements:', error);
            setAchievements(ACHIEVEMENTS);
          }
        }
      }
    } catch (err: any) {
      console.error('Error loading progress:', err);
      setError(err.message);
      
      // في حالة الفشل، نحاول تحميل التقدم من التخزين المحلي
      const saved = localStorage.getItem('english-learning-progress');
      if (saved) {
        try {
          const parsedProgress = JSON.parse(saved);
          setProgress({
            ...DEFAULT_PROGRESS,
            ...parsedProgress,
            wordProgress: parsedProgress.wordProgress || {},
            studySessions: parsedProgress.studySessions || [],
            totalStudyTime: parsedProgress.totalStudyTime || 0
          });
        } catch (error) {
          console.error('Error parsing saved progress:', error);
          setProgress(DEFAULT_PROGRESS);
        }
      }

      const savedAchievements = localStorage.getItem('english-learning-achievements');
      if (savedAchievements) {
        try {
          setAchievements(JSON.parse(savedAchievements));
        } catch (error) {
          console.error('Error parsing saved achievements:', error);
          setAchievements(ACHIEVEMENTS);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (newProgress: UserProgress) => {
    setProgress(newProgress);
    
    try {
      if (studentId) {
        // تحديث التقدم في Supabase
        const { error } = await supabase
          .from('user_progress')
          .update({
            total_score: newProgress.totalScore,
            current_streak: newProgress.currentStreak,
            units_completed: newProgress.unitsCompleted,
            words_learned: newProgress.wordsLearned,
            last_study_date: newProgress.lastStudyDate,
            word_progress: newProgress.wordProgress,
            study_sessions: newProgress.studySessions,
            total_study_time: newProgress.totalStudyTime,
            updated_at: new Date().toISOString()
          })
          .eq('student_id', studentId);
        
        if (error) {
          throw error;
        }
      } else {
        // حفظ التقدم في التخزين المحلي
        localStorage.setItem('english-learning-progress', JSON.stringify(newProgress));
      }
    } catch (err: any) {
      console.error('Error saving progress:', err);
      setError(err.message);
      
      // في حالة الفشل، نحاول الحفظ في التخزين المحلي
      localStorage.setItem('english-learning-progress', JSON.stringify(newProgress));
    }
  };

  const addScore = (points: number, subject?: string, unit?: string) => {
    const newProgress = {
      ...progress,
      totalScore: progress.totalScore + points,
      lastStudyDate: new Date().toISOString()
    };
    
    // Add study session for tracking
    const newSession: StudySession = {
      id: crypto.randomUUID(),
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      wordsStudied: [],
      totalScore: points,
      activitiesCompleted: [subject || 'unknown'],
      duration: 0,
      studentId: studentId
    };
    
    newProgress.studySessions = [...(progress.studySessions || []), newSession];
    
    setProgress(newProgress);
    saveProgress(newProgress);
    checkAchievements(newProgress);
  };

  const updateStreak = (increment: boolean, subject?: string) => {
    const newStreak = increment ? progress.currentStreak + 1 : 0;
    const newProgress = {
      ...progress,
      currentStreak: newStreak
    };
    setProgress(newProgress);
    saveProgress(newProgress);
    checkAchievements(newProgress);
  };

  const completeUnit = (unitName: string, subject?: string) => {
    const unitKey = subject ? `${subject}:${unitName}` : unitName;
    if (!progress.unitsCompleted.includes(unitKey)) {
      const newProgress = {
        ...progress,
        unitsCompleted: [...progress.unitsCompleted, unitKey]
      };
      setProgress(newProgress);
      saveProgress(newProgress);
      checkAchievements(newProgress);
    }
  };

  const getSubjectProgress = (subjectId: string) => {
    const subjectSessions = (progress.studySessions || []).filter(session => 
      session.activitiesCompleted.includes(subjectId)
    );
    const subjectScore = subjectSessions.reduce((total, session) => total + (session.totalScore || 0), 0);
    const subjectUnits = progress.unitsCompleted.filter(unit => unit.startsWith(`${subjectId}:`));
    
    return {
      totalScore: subjectScore,
      unitsCompleted: subjectUnits.length,
      sessionsCount: subjectSessions.length,
      lastStudyDate: subjectSessions.length > 0 ? subjectSessions[subjectSessions.length - 1].startTime : null
    };
  };

  const getUnitProgress = (subjectId: string, unitName: string) => {
    const unitKey = `${subjectId}:${unitName}`;
    const isCompleted = progress.unitsCompleted.includes(unitKey);
    const unitSessions = (progress.studySessions || []).filter(session => 
      session.activitiesCompleted.includes(subjectId)
    );
    const unitScore = unitSessions.reduce((total, session) => total + (session.totalScore || 0), 0);
    
    return {
      isCompleted,
      totalScore: unitScore,
      sessionsCount: unitSessions.length,
      lastStudyDate: unitSessions.length > 0 ? unitSessions[unitSessions.length - 1].startTime : null
    };
  };

  const checkAchievements = async (currentProgress: UserProgress) => {
    const updatedAchievements = achievements.map(achievement => {
      if (achievement.achieved) return achievement;

      let shouldAchieve = false;
      switch (achievement.id) {
        case 'first_word':
          shouldAchieve = currentProgress.wordsLearned > 0;
          break;
        case 'streak_5':
          shouldAchieve = currentProgress.currentStreak >= 5;
          break;
        case 'streak_10':
          shouldAchieve = currentProgress.currentStreak >= 10;
          break;
        case 'unit_complete':
          shouldAchieve = currentProgress.unitsCompleted.length > 0;
          break;
        case 'score_100':
          shouldAchieve = currentProgress.totalScore >= 100;
          break;
        case 'score_500':
          shouldAchieve = currentProgress.totalScore >= 500;
          break;
        case 'score_1000':
          shouldAchieve = currentProgress.totalScore >= 1000;
          break;
        case 'master_10_words':
          const masteredWords = Object.values(currentProgress.wordProgress || {})
            .filter(word => word.overallMastery >= 80).length;
          shouldAchieve = masteredWords >= 10;
          break;
        case 'daily_streak_7':
          // This would need more complex logic to track daily study sessions
          shouldAchieve = currentProgress.studySessions.length >= 7;
          break;
        case 'perfect_quiz':
          // This would be triggered from quiz components
          shouldAchieve = false; // Will be set externally
          break;
      }

      if (shouldAchieve && !achievement.achieved) {
        const updatedAchievement = {
          ...achievement,
          achieved: true,
          achievedDate: new Date().toISOString()
        };
        
        // تحديث الإنجاز في Supabase إذا كان هناك معرف للطالب
        if (studentId) {
          supabase
            .from('achievements')
            .update({
              achieved: true,
              achieved_date: new Date().toISOString()
            })
            .eq('student_id', studentId)
            .eq('achievement_id', achievement.id)
            .then(({ error }) => {
              if (error) {
                console.error('Error updating achievement:', error);
              }
            });
        }
        
        return updatedAchievement;
      }

      return achievement;
    });

    setAchievements(updatedAchievements);
    
    if (!studentId) {
      // حفظ الإنجازات في التخزين المحلي إذا لم يكن هناك معرف للطالب
      localStorage.setItem('english-learning-achievements', JSON.stringify(updatedAchievements));
    }
  };

  const resetProgress = async () => {
    setProgress(DEFAULT_PROGRESS);
    setAchievements(ACHIEVEMENTS);
    
    try {
      if (studentId) {
        // إعادة تعيين التقدم في Supabase
        await supabase
          .from('user_progress')
          .update({
            total_score: 0,
            current_streak: 0,
            units_completed: [],
            words_learned: 0,
            last_study_date: new Date().toISOString(),
            word_progress: {},
            study_sessions: [],
            total_study_time: 0,
            updated_at: new Date().toISOString()
          })
          .eq('student_id', studentId);
        
        // إعادة تعيين الإنجازات في Supabase
        await supabase
          .from('achievements')
          .update({
            achieved: false,
            achieved_date: null
          })
          .eq('student_id', studentId);
      } else {
        // إعادة تعيين التقدم في التخزين المحلي
        localStorage.removeItem('english-learning-progress');
        localStorage.removeItem('english-learning-achievements');
      }
    } catch (err: any) {
      console.error('Error resetting progress:', err);
      setError(err.message);
      
      // في حالة الفشل، نحاول إعادة التعيين محلياً
      localStorage.removeItem('english-learning-progress');
      localStorage.removeItem('english-learning-achievements');
    }
  };

  return {
    progress,
    achievements,
    loading,
    error,
    addScore,
    updateStreak,
    completeUnit,
    resetProgress,
    checkAchievements,
    getSubjectProgress,
    getUnitProgress
  };
};