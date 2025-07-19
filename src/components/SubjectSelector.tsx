import React, { useState, useEffect } from 'react';
import { Book, ChevronDown } from 'lucide-react';
import { Subject, defaultSubjects } from '../types';
import { supabase } from '../lib/supabase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/DropdownMenu';

interface SubjectSelectorProps {
  onSubjectChange: (subject: Subject) => void;
  currentSubject?: Subject | null;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ onSubjectChange, currentSubject }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    setLoading(true);
    try {
      // Try to load subjects from Supabase
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
          const defaultSubjectsList = getSubjectsForGrade(currentSubject?.grade || 5);
          // Find the default subject to get activities
          const defaultSubject = defaultSubjects.find(ds => ds.id === subject.id);
          
          return {
            id: subject.id,
            name: subject.name,
            nameEn: subject.name_en,
            icon: subject.icon,
            color: subject.color,
            description: subject.description,
            isActive: subject.is_active,
            activities: defaultSubject?.activities || [], // Ensure activities are included
            createdAt: subject.created_at,
            updatedAt: subject.updated_at
          };
        });
        
        console.log('Formatted subjects from Supabase:', formattedSubjects);
        setSubjects(formattedSubjects);
        
        // If no current subject is set, select the first one
        if (!currentSubject && formattedSubjects.length > 0) {
          onSubjectChange(formattedSubjects[0]);
        }
      } else {
        // If no data found, use default subjects
        const defaultSubjectsList = getSubjectsForGrade(currentSubject?.grade || 5);
        console.log('Using default subjects:', defaultSubjectsList);
        setSubjects(defaultSubjectsList);
        
        // If no current subject is set, select the first one
        if (!currentSubject && defaultSubjectsList.length > 0) {
          onSubjectChange(defaultSubjectsList[0]);
        }
      }
    } catch (err) {
      console.error('Error loading subjects:', err);
      // Always use default subjects as fallback to ensure activities are included
      const defaultSubjectsList = getSubjectsForGrade(currentSubject?.grade || 5);
      console.log('Error fallback - using default subjects:', defaultSubjectsList);
      setSubjects(defaultSubjectsList);
      
      // If no current subject is set, select the first one
      if (!currentSubject && defaultSubjectsList.length > 0) {
        onSubjectChange(defaultSubjectsList[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSubjects = (): Subject[] => {
    return defaultSubjects;
  };

  const getSubjectsForGrade = (grade: number): Subject[] => {
    // For grades 9-12, replace general science with specific science subjects
    if (grade >= 9) {
      return defaultSubjects.filter(subject => subject.id !== 'science');
    } else {
      // For grades 1-8, exclude specific science subjects
      return defaultSubjects.filter(subject => 
        !['physics', 'chemistry', 'biology'].includes(subject.id)
      );
    }
  };

  const getSubjectBgColor = (color: string) => {
    if (color.includes('blue')) return 'bg-blue-100';
    if (color.includes('green')) return 'bg-green-100';
    if (color.includes('purple')) return 'bg-purple-100';
    if (color.includes('emerald')) return 'bg-emerald-100';
    if (color.includes('amber')) return 'bg-amber-100';
    if (color.includes('cyan')) return 'bg-cyan-100';
    if (color.includes('teal')) return 'bg-teal-100';
    if (color.includes('red')) return 'bg-red-100';
    if (color.includes('pink')) return 'bg-pink-100';
    return 'bg-gray-100';
  };

  const getSubjectTextColor = (color: string) => {
    if (color.includes('blue')) return 'text-blue-800';
    if (color.includes('green')) return 'text-green-800';
    if (color.includes('purple')) return 'text-purple-800';
    if (color.includes('emerald')) return 'text-emerald-800';
    if (color.includes('amber')) return 'text-amber-800';
    if (color.includes('cyan')) return 'text-cyan-800';
    if (color.includes('teal')) return 'text-teal-800';
    if (color.includes('red')) return 'text-red-800';
    if (color.includes('pink')) return 'text-pink-800';
    return 'text-gray-800';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            <span>جاري التحميل...</span>
          </div>
        ) : currentSubject ? (
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentSubject.icon}</span>
            <span>{currentSubject.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            <span>اختر المادة</span>
          </div>
        )}
        <ChevronDown className="w-4 h-4 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {subjects.map((subject) => (
          <DropdownMenuItem
            key={subject.id}
            onClick={() => onSubjectChange(subject)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-3 w-full">
              <div className={`p-2 rounded-lg ${getSubjectBgColor(subject.color)}`}>
                <span className="text-xl">{subject.icon}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">{subject.name}</span>
                <span className="text-xs text-gray-500">{subject.nameEn}</span>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SubjectSelector;