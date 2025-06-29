import { useState, useEffect } from 'react';
import { GrammarRule, QuizQuestion } from '../types';
import { supabase } from '../lib/supabase';
import { getGrammarByGrade, getQuestionsByGrade } from '../data/grammar';

export const useGrammar = (grade?: number) => {
  const [rules, setRules] = useState<GrammarRule[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGrammar();
  }, [grade]);

  const loadGrammar = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load grammar rules from static data first
      let staticRules: GrammarRule[] = [];
      let staticQuestions: QuizQuestion[] = [];
      
      if (grade) {
        staticRules = getGrammarByGrade(grade);
        staticQuestions = getQuestionsByGrade(grade);
      } else {
        // Load all grades if no specific grade is provided
        for (let g = 1; g <= 12; g++) {
          staticRules = [...staticRules, ...getGrammarByGrade(g)];
          staticQuestions = [...staticQuestions, ...getQuestionsByGrade(g)];
        }
      }
      
      // Add unique IDs to static data if they don't have one
      staticRules = staticRules.map((rule, index) => ({
        ...rule,
        id: rule.id || `rule-${rule.grade}-${index}`
      }));
      
      staticQuestions = staticQuestions.map((question, index) => ({
        ...question,
        id: question.id || `question-${question.grade}-${index}`
      }));
      
      // Try to load from Supabase if connected
      try {
        let rulesQuery = supabase.from('grammar_rules').select('*');
        let questionsQuery = supabase.from('quiz_questions').select('*');
        
        if (grade) {
          rulesQuery = rulesQuery.eq('grade', grade);
          questionsQuery = questionsQuery.eq('grade', grade);
        }
        
        const [rulesResult, questionsResult] = await Promise.all([
          rulesQuery,
          questionsQuery
        ]);
        
        if (!rulesResult.error && rulesResult.data && rulesResult.data.length > 0) {
          // Convert data from Supabase format to app format
          const formattedRules: GrammarRule[] = rulesResult.data.map(rule => ({
            id: rule.id,
            title: rule.title,
            explanation: rule.explanation,
            examples: rule.examples,
            unit: rule.unit,
            grade: rule.grade
          }));
          
          setRules(formattedRules);
        } else {
          // If no data found, use static data
          setRules(staticRules);
        }
        
        if (!questionsResult.error && questionsResult.data && questionsResult.data.length > 0) {
          // Convert data from Supabase format to app format
          const formattedQuestions: QuizQuestion[] = questionsResult.data.map(question => ({
            id: question.id,
            question: question.question,
            options: question.options,
            correct: question.correct,
            explanation: question.explanation,
            unit: question.unit,
            grade: question.grade
          }));
          
          setQuestions(formattedQuestions);
        } else {
          // If no data found, use static data
          setQuestions(staticQuestions);
        }
      } catch (err) {
        console.warn('Error loading from Supabase, using static data:', err);
        setRules(staticRules);
        setQuestions(staticQuestions);
      }
    } catch (err: any) {
      console.error('Error loading grammar:', err);
      setError(err.message);
      
      // In case of failure, try to load data from static data
      const staticRules = grade ? getGrammarByGrade(grade) : [];
      const staticQuestions = grade ? getQuestionsByGrade(grade) : [];
      
      setRules(staticRules.map((rule, index) => ({
        ...rule,
        id: rule.id || `rule-${rule.grade}-${index}`
      })));
      
      setQuestions(staticQuestions.map((question, index) => ({
        ...question,
        id: question.id || `question-${question.grade}-${index}`
      })));
    } finally {
      setLoading(false);
    }
  };

  const addRule = async (rule: Omit<GrammarRule, 'id'>) => {
    try {
      // Generate a unique ID for the new rule
      const newId = crypto.randomUUID();
      
      // Add the rule to Supabase
      try {
        const { error } = await supabase.from('grammar_rules').insert({
          id: newId,
          title: rule.title,
          explanation: rule.explanation,
          examples: rule.examples,
          unit: rule.unit,
          grade: rule.grade,
          created_at: new Date().toISOString()
        });
        
        if (error) {
          console.warn('Error adding rule to Supabase:', error);
        }
      } catch (err) {
        console.warn('Failed to add rule to Supabase, adding locally only:', err);
      }
      
      // Add to local state regardless of Supabase result
      const newRule: GrammarRule = {
        id: newId,
        ...rule
      };
      
      setRules(prev => [...prev, newRule]);
      return newRule;
    } catch (err: any) {
      console.error('Error adding grammar rule:', err);
      setError(err.message);
      throw err;
    }
  };

  const addQuestion = async (question: Omit<QuizQuestion, 'id'>) => {
    try {
      // Generate a unique ID for the new question
      const newId = crypto.randomUUID();
      
      // Add the question to Supabase
      try {
        const { error } = await supabase.from('quiz_questions').insert({
          id: newId,
          question: question.question,
          options: question.options,
          correct: question.correct,
          explanation: question.explanation,
          unit: question.unit,
          grade: question.grade,
          created_at: new Date().toISOString()
        });
        
        if (error) {
          console.warn('Error adding question to Supabase:', error);
        }
      } catch (err) {
        console.warn('Failed to add question to Supabase, adding locally only:', err);
      }
      
      // Add to local state regardless of Supabase result
      const newQuestion: QuizQuestion = {
        id: newId,
        ...question
      };
      
      setQuestions(prev => [...prev, newQuestion]);
      return newQuestion;
    } catch (err: any) {
      console.error('Error adding quiz question:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateRule = async (id: string, updates: Partial<Omit<GrammarRule, 'id'>>) => {
    try {
      // Update the rule in Supabase
      try {
        const supabaseUpdates: any = {};
        
        if (updates.title) supabaseUpdates.title = updates.title;
        if (updates.explanation) supabaseUpdates.explanation = updates.explanation;
        if (updates.examples) supabaseUpdates.examples = updates.examples;
        if (updates.unit) supabaseUpdates.unit = updates.unit;
        if (updates.grade) supabaseUpdates.grade = updates.grade;
        
        supabaseUpdates.updated_at = new Date().toISOString();
        
        const { error } = await supabase
          .from('grammar_rules')
          .update(supabaseUpdates)
          .eq('id', id);
        
        if (error) {
          console.warn('Error updating rule in Supabase:', error);
        }
      } catch (err) {
        console.warn('Failed to update rule in Supabase, updating locally only:', err);
      }
      
      // Update local state regardless of Supabase result
      setRules(prev => prev.map(rule => 
        rule.id === id ? { ...rule, ...updates } : rule
      ));
    } catch (err: any) {
      console.error('Error updating grammar rule:', err);
      setError(err.message);
      
      // In case of failure, try to update locally
      setRules(prev => prev.map(rule => 
        rule.id === id ? { ...rule, ...updates } : rule
      ));
    }
  };

  const updateQuestion = async (id: string, updates: Partial<Omit<QuizQuestion, 'id'>>) => {
    try {
      // Update the question in Supabase
      try {
        const supabaseUpdates: any = {};
        
        if (updates.question) supabaseUpdates.question = updates.question;
        if (updates.options) supabaseUpdates.options = updates.options;
        if (updates.correct !== undefined) supabaseUpdates.correct = updates.correct;
        if (updates.explanation) supabaseUpdates.explanation = updates.explanation;
        if (updates.unit) supabaseUpdates.unit = updates.unit;
        if (updates.grade) supabaseUpdates.grade = updates.grade;
        
        supabaseUpdates.updated_at = new Date().toISOString();
        
        const { error } = await supabase
          .from('quiz_questions')
          .update(supabaseUpdates)
          .eq('id', id);
        
        if (error) {
          console.warn('Error updating question in Supabase:', error);
        }
      } catch (err) {
        console.warn('Failed to update question in Supabase, updating locally only:', err);
      }
      
      // Update local state regardless of Supabase result
      setQuestions(prev => prev.map(question => 
        question.id === id ? { ...question, ...updates } : question
      ));
    } catch (err: any) {
      console.error('Error updating quiz question:', err);
      setError(err.message);
      
      // In case of failure, try to update locally
      setQuestions(prev => prev.map(question => 
        question.id === id ? { ...question, ...updates } : question
      ));
    }
  };

  const deleteRule = async (id: string) => {
    try {
      // Delete the rule from Supabase
      try {
        const { error } = await supabase
          .from('grammar_rules')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.warn('Error deleting rule from Supabase:', error);
        }
      } catch (err) {
        console.warn('Failed to delete rule from Supabase, deleting locally only:', err);
      }
      
      // Update local state regardless of Supabase result
      setRules(prev => prev.filter(rule => rule.id !== id));
    } catch (err: any) {
      console.error('Error deleting grammar rule:', err);
      setError(err.message);
      
      // In case of failure, try to delete locally
      setRules(prev => prev.filter(rule => rule.id !== id));
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      // Delete the question from Supabase
      try {
        const { error } = await supabase
          .from('quiz_questions')
          .delete()
          .eq('id', id);
        
        if (error) {
          console.warn('Error deleting question from Supabase:', error);
        }
      } catch (err) {
        console.warn('Failed to delete question from Supabase, deleting locally only:', err);
      }
      
      // Update local state regardless of Supabase result
      setQuestions(prev => prev.filter(question => question.id !== id));
    } catch (err: any) {
      console.error('Error deleting quiz question:', err);
      setError(err.message);
      
      // In case of failure, try to delete locally
      setQuestions(prev => prev.filter(question => question.id !== id));
    }
  };

  return {
    rules,
    questions,
    loading,
    error,
    addRule,
    addQuestion,
    updateRule,
    updateQuestion,
    deleteRule,
    deleteQuestion,
    refreshGrammar: loadGrammar
  };
};