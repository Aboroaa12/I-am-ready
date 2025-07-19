import React, { useState, useEffect } from 'react';
import { Book, ChevronDown } from 'lucide-react';
import { Subject, defaultSubjects } from '../types';
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
    // Only load English subject
    setSubjects([defaultSubjects[0]]); // English is the first and only subject
    setLoading(false);
    
    // Set English as default if no current subject
    if (!currentSubject) {
      onSubjectChange(defaultSubjects[0]);
    }
  }, []);

  const getSubjectBgColor = (color: string) => {
    if (color.includes('blue')) return 'bg-blue-100';
    return 'bg-gray-100';
  };

  const getSubjectTextColor = (color: string) => {
    if (color.includes('blue')) return 'text-blue-800';
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
            <span>اللغة الإنجليزية</span>
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