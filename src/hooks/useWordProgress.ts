import { useState, useEffect } from 'react';
import { WordProgress, WordKnowledge, MasteryRecord, StudySession } from '../types';

const STORAGE_KEY = 'english-word-progress';
const SESSIONS_KEY = 'english-study-sessions';

export const useWordProgress = () => {
  const [wordProgress, setWordProgress] = useState<WordProgress>({});
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);

  useEffect(() => {
    // Load saved progress
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      setWordProgress(JSON.parse(savedProgress));
    }

    const savedSessions = localStorage.getItem(SESSIONS_KEY);
    if (savedSessions) {
      setStudySessions(JSON.parse(savedSessions));
    }
  }, []);

  const saveProgress = (progress: WordProgress) => {
    setWordProgress(progress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  };

  const saveSessions = (sessions: StudySession[]) => {
    setStudySessions(sessions);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  };

  const initializeWordKnowledge = (wordId: string): WordKnowledge => {
    return {
      wordId,
      pronunciationMastery: 0,
      spellingMastery: 0,
      usageMastery: 0,
      grammarMastery: 0,
      overallMastery: 0,
      lastReviewed: new Date().toISOString(),
      reviewCount: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      streak: 0,
      bestStreak: 0,
      timeSpent: 0,
      difficultyLevel: 'medium',
      needsReview: true,
      masteryHistory: []
    };
  };

  const calculateOverallMastery = (knowledge: WordKnowledge): number => {
    const { pronunciationMastery, spellingMastery, usageMastery, grammarMastery } = knowledge;
    return Math.round((pronunciationMastery + spellingMastery + usageMastery + grammarMastery) / 4);
  };

  const updateWordKnowledge = (
    wordId: string,
    updates: Partial<WordKnowledge>,
    activityType: 'pronunciation' | 'spelling' | 'usage' | 'grammar' | 'mixed' = 'mixed'
  ) => {
    const currentProgress = { ...wordProgress };
    const existing = currentProgress[wordId] || initializeWordKnowledge(wordId);
    
    const updated = { ...existing, ...updates };
    updated.overallMastery = calculateOverallMastery(updated);
    updated.lastReviewed = new Date().toISOString();
    updated.reviewCount += 1;

    // Add to mastery history
    const masteryRecord: MasteryRecord = {
      date: new Date().toISOString(),
      pronunciationScore: updated.pronunciationMastery,
      spellingScore: updated.spellingMastery,
      usageScore: updated.usageMastery,
      grammarScore: updated.grammarMastery,
      overallScore: updated.overallMastery,
      activityType
    };

    updated.masteryHistory = [...updated.masteryHistory, masteryRecord].slice(-20); // Keep last 20 records

    // Determine if needs review
    updated.needsReview = updated.overallMastery < 80;

    currentProgress[wordId] = updated;
    saveProgress(currentProgress);

    // Update current session
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        wordsStudied: [...new Set([...currentSession.wordsStudied, wordId])]
      };
      setCurrentSession(updatedSession);
    }
  };

  const recordCorrectAnswer = (wordId: string, activityType: 'pronunciation' | 'spelling' | 'usage' | 'grammar') => {
    const existing = wordProgress[wordId] || initializeWordKnowledge(wordId);
    const newStreak = existing.streak + 1;
    const newBestStreak = Math.max(newStreak, existing.bestStreak);
    
    // Calculate mastery increase based on activity type
    const masteryIncrease = Math.min(10, 20 - existing.correctAnswers); // Diminishing returns
    const updates: Partial<WordKnowledge> = {
      correctAnswers: existing.correctAnswers + 1,
      streak: newStreak,
      bestStreak: newBestStreak
    };

    switch (activityType) {
      case 'pronunciation':
        updates.pronunciationMastery = Math.min(100, existing.pronunciationMastery + masteryIncrease);
        break;
      case 'spelling':
        updates.spellingMastery = Math.min(100, existing.spellingMastery + masteryIncrease);
        break;
      case 'usage':
        updates.usageMastery = Math.min(100, existing.usageMastery + masteryIncrease);
        break;
      case 'grammar':
        updates.grammarMastery = Math.min(100, existing.grammarMastery + masteryIncrease);
        break;
    }

    updateWordKnowledge(wordId, updates, activityType);
  };

  const recordIncorrectAnswer = (wordId: string, activityType: 'pronunciation' | 'spelling' | 'usage' | 'grammar') => {
    const existing = wordProgress[wordId] || initializeWordKnowledge(wordId);
    
    const updates: Partial<WordKnowledge> = {
      incorrectAnswers: existing.incorrectAnswers + 1,
      streak: 0,
      needsReview: true
    };

    // Slight decrease in mastery for incorrect answers
    const masteryDecrease = 5;
    switch (activityType) {
      case 'pronunciation':
        updates.pronunciationMastery = Math.max(0, existing.pronunciationMastery - masteryDecrease);
        break;
      case 'spelling':
        updates.spellingMastery = Math.max(0, existing.spellingMastery - masteryDecrease);
        break;
      case 'usage':
        updates.usageMastery = Math.max(0, existing.usageMastery - masteryDecrease);
        break;
      case 'grammar':
        updates.grammarMastery = Math.max(0, existing.grammarMastery - masteryDecrease);
        break;
    }

    updateWordKnowledge(wordId, updates, activityType);
  };

  const startStudySession = () => {
    const session: StudySession = {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      wordsStudied: [],
      totalScore: 0,
      activitiesCompleted: [],
      duration: 0
    };
    setCurrentSession(session);
    return session;
  };

  const endStudySession = () => {
    if (currentSession) {
      const endTime = new Date().toISOString();
      const duration = Math.round((new Date(endTime).getTime() - new Date(currentSession.startTime).getTime()) / 1000);
      
      const completedSession = {
        ...currentSession,
        endTime,
        duration
      };

      const updatedSessions = [...studySessions, completedSession];
      saveSessions(updatedSessions);
      setCurrentSession(null);
      
      return completedSession;
    }
    return null;
  };

  const getWordsByMasteryLevel = (level: 'low' | 'medium' | 'high') => {
    const words = Object.values(wordProgress);
    switch (level) {
      case 'low':
        return words.filter(w => w.overallMastery < 40);
      case 'medium':
        return words.filter(w => w.overallMastery >= 40 && w.overallMastery < 80);
      case 'high':
        return words.filter(w => w.overallMastery >= 80);
      default:
        return words;
    }
  };

  const getWordsNeedingReview = () => {
    return Object.values(wordProgress).filter(w => w.needsReview);
  };

  const getStudyStatistics = () => {
    const words = Object.values(wordProgress);
    const totalWords = words.length;
    const masteredWords = words.filter(w => w.overallMastery >= 80).length;
    const wordsInProgress = words.filter(w => w.overallMastery >= 40 && w.overallMastery < 80).length;
    const strugglingWords = words.filter(w => w.overallMastery < 40).length;
    
    const totalStudyTime = studySessions.reduce((total, session) => total + session.duration, 0);
    const averageSessionTime = studySessions.length > 0 ? totalStudyTime / studySessions.length : 0;
    
    const totalCorrect = words.reduce((total, word) => total + word.correctAnswers, 0);
    const totalIncorrect = words.reduce((total, word) => total + word.incorrectAnswers, 0);
    const accuracy = totalCorrect + totalIncorrect > 0 ? (totalCorrect / (totalCorrect + totalIncorrect)) * 100 : 0;

    return {
      totalWords,
      masteredWords,
      wordsInProgress,
      strugglingWords,
      totalStudyTime,
      averageSessionTime,
      accuracy,
      totalSessions: studySessions.length,
      currentStreak: Math.max(...words.map(w => w.streak), 0),
      bestOverallStreak: Math.max(...words.map(w => w.bestStreak), 0)
    };
  };

  const resetProgress = () => {
    setWordProgress({});
    setStudySessions([]);
    setCurrentSession(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSIONS_KEY);
  };

  return {
    wordProgress,
    studySessions,
    currentSession,
    updateWordKnowledge,
    recordCorrectAnswer,
    recordIncorrectAnswer,
    startStudySession,
    endStudySession,
    getWordsByMasteryLevel,
    getWordsNeedingReview,
    getStudyStatistics,
    resetProgress
  };
};