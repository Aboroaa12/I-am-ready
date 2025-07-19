import { useState, useEffect } from 'react';
import { VocabularyWord, GrammarRule, QuizQuestion } from '../types';
import { 
  getGradeData, 
  getGradeSubjectData, 
  getVocabularyByGrade as getModularVocabulary,
  getGrammarByGrade as getModularGrammar,
  getQuestionsByGrade as getModularQuestions
} from '../data';

export const useModularData = (grade?: number, subject?: string, unit?: string) => {
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [grammar, setGrammar] = useState<GrammarRule[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [grade, subject, unit]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (grade) {
        // Try to load from modular structure first
        const modularVocab = getModularVocabulary(grade);
        const modularGrammar = getModularGrammar(grade);
        const modularQuestions = getModularQuestions(grade);
        
        if (modularVocab.length > 0 || modularGrammar.length > 0) {
          // Use modular data
          setVocabulary(modularVocab);
          setGrammar(modularGrammar);
          setQuestions(modularQuestions);
          console.log(`✅ Loaded modular data for grade ${grade}: ${modularVocab.length} words, ${modularGrammar.length} grammar rules`);
        } else {
          // Fallback to legacy data
          const { getVocabularyByGrade, getGrammarByGrade, getQuestionsByGrade } = await import('../data/vocabulary');
          const legacyVocab = getVocabularyByGrade(grade);
          const legacyGrammar = getGrammarByGrade(grade);
          const legacyQuestions = getQuestionsByGrade(grade);
          
          setVocabulary(legacyVocab);
          setGrammar(legacyGrammar);
          setQuestions(legacyQuestions);
          console.log(`⚠️ Fallback to legacy data for grade ${grade}: ${legacyVocab.length} words, ${legacyGrammar.length} grammar rules`);
        }
      }
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    vocabulary,
    grammar,
    questions,
    loading,
    error,
    refreshData: loadData
  };
};

export const useGradeData = (gradeId: number) => {
  const [gradeData, setGradeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGradeData();
  }, [gradeId]);

  const loadGradeData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = getGradeData(gradeId);
      if (data) {
        setGradeData(data);
        console.log(`✅ Loaded modular grade data for grade ${gradeId}`);
      } else {
        setError(`No data found for grade ${gradeId}`);
      }
    } catch (err: any) {
      console.error('Error loading grade data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    gradeData,
    loading,
    error,
    refreshData: loadGradeData
  };
};