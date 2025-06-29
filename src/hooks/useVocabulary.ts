import { useState, useEffect } from 'react';
import { VocabularyWord } from '../types';
import { supabase } from '../lib/supabase';
import { getVocabularyByGrade, getAllVocabulary } from '../data/vocabulary';

export const useVocabulary = (grade?: number) => {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVocabulary();
  }, [grade]);

  const loadVocabulary = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // محاولة تحميل المفردات من Supabase
      let query = supabase.from('vocabulary_words').select('*');
      
      if (grade) {
        query = query.eq('grade', grade);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // تحويل البيانات من تنسيق Supabase إلى تنسيق التطبيق
        const formattedWords: VocabularyWord[] = data.map(word => ({
          id: word.id,
          english: word.english,
          arabic: word.arabic,
          unit: word.unit,
          pronunciation: word.pronunciation || undefined,
          grade: word.grade,
          partOfSpeech: word.part_of_speech as any || undefined,
          exampleSentence: word.example_sentence || undefined,
          difficulty: word.difficulty as any || undefined
        }));
        
        setWords(formattedWords);
      } else {
        // إذا لم يتم العثور على بيانات في Supabase، استخدم البيانات الثابتة
        const staticWords = grade ? getVocabularyByGrade(grade) : getAllVocabulary();
        setWords(staticWords);
      }
    } catch (err: any) {
      console.error('Error loading vocabulary:', err);
      setError(err.message);
      
      // في حالة الفشل، نحاول تحميل البيانات من البيانات الثابتة
      const staticWords = grade ? getVocabularyByGrade(grade) : getAllVocabulary();
      setWords(staticWords);
    } finally {
      setLoading(false);
    }
  };

  const addWord = async (word: Omit<VocabularyWord, 'id'>) => {
    try {
      // إضافة الكلمة إلى Supabase
      const { data, error } = await supabase.from('vocabulary_words').insert({
        english: word.english,
        arabic: word.arabic,
        unit: word.unit,
        pronunciation: word.pronunciation,
        grade: word.grade,
        part_of_speech: word.partOfSpeech,
        example_sentence: word.exampleSentence,
        difficulty: word.difficulty,
        created_at: new Date().toISOString()
      }).select();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // تحويل البيانات من تنسيق Supabase إلى تنسيق التطبيق
        const newWord: VocabularyWord = {
          id: data[0].id,
          english: data[0].english,
          arabic: data[0].arabic,
          unit: data[0].unit,
          pronunciation: data[0].pronunciation || undefined,
          grade: data[0].grade,
          partOfSpeech: data[0].part_of_speech as any || undefined,
          exampleSentence: data[0].example_sentence || undefined,
          difficulty: data[0].difficulty as any || undefined
        };
        
        // تحديث الحالة المحلية
        setWords(prev => [...prev, newWord]);
        
        return newWord;
      }
    } catch (err: any) {
      console.error('Error adding word:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateWord = async (id: string, updates: Partial<Omit<VocabularyWord, 'id'>>) => {
    try {
      // تحديث الكلمة في Supabase
      const supabaseUpdates: any = {};
      
      if (updates.english) supabaseUpdates.english = updates.english;
      if (updates.arabic) supabaseUpdates.arabic = updates.arabic;
      if (updates.unit) supabaseUpdates.unit = updates.unit;
      if (updates.pronunciation !== undefined) supabaseUpdates.pronunciation = updates.pronunciation;
      if (updates.grade) supabaseUpdates.grade = updates.grade;
      if (updates.partOfSpeech !== undefined) supabaseUpdates.part_of_speech = updates.partOfSpeech;
      if (updates.exampleSentence !== undefined) supabaseUpdates.example_sentence = updates.exampleSentence;
      if (updates.difficulty !== undefined) supabaseUpdates.difficulty = updates.difficulty;
      
      supabaseUpdates.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('vocabulary_words')
        .update(supabaseUpdates)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // تحديث الحالة المحلية
      setWords(prev => prev.map(word => 
        word.id === id ? { ...word, ...updates } : word
      ));
    } catch (err: any) {
      console.error('Error updating word:', err);
      setError(err.message);
      
      // في حالة الفشل، نحاول التحديث محلياً
      setWords(prev => prev.map(word => 
        word.id === id ? { ...word, ...updates } : word
      ));
    }
  };

  const deleteWord = async (id: string) => {
    try {
      // حذف الكلمة من Supabase
      const { error } = await supabase
        .from('vocabulary_words')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // تحديث الحالة المحلية
      setWords(prev => prev.filter(word => word.id !== id));
    } catch (err: any) {
      console.error('Error deleting word:', err);
      setError(err.message);
      
      // في حالة الفشل، نحاول الحذف محلياً
      setWords(prev => prev.filter(word => word.id !== id));
    }
  };

  return {
    words,
    loading,
    error,
    addWord,
    updateWord,
    deleteWord,
    refreshWords: loadVocabulary
  };
};