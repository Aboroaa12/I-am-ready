import React from 'react';
import { BookOpen, Star, Zap, LogOut } from 'lucide-react';
import { UserProgress, GradeAccess } from '../types';
import { getGradeGradientColor } from '../utils/gradeColors';
import SupabaseConnectionStatus from './SupabaseConnectionStatus';

interface HeaderProps {
  progress: UserProgress;
  gradeAccess?: GradeAccess;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ progress, gradeAccess, onLogout }) => {
  const getGradeColor = () => {
    if (!gradeAccess) return 'from-purple-600 via-blue-600 to-teal-600';
    return `${getGradeGradientColor(gradeAccess.grade)}`;
  };

  return (
    <header className={`bg-gradient-to-r ${getGradeColor()} text-white`}>
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-right mb-6 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center justify-center md:justify-start gap-3">
              <BookOpen className="w-12 h-12" />
              أنا مستعد
            </h1>
            {gradeAccess?.isStudent ? (
              <div className="text-xl opacity-90">
                <p className="mb-1">مرحباً {gradeAccess.studentName} 👋</p>
                <p className="text-lg">دليل شامل لتعلم اللغة الإنجليزية - {gradeAccess.name}</p>
              </div>
            ) : (
              <p className="text-xl opacity-90">
                {gradeAccess ? `دليل شامل لتعلم اللغة الإنجليزية - ${gradeAccess.name}` : 'للصفوف من الخامس إلى الثاني عشر'}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-6 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span className="text-2xl font-bold">{progress.totalScore}</span>
                </div>
                <span className="text-sm opacity-80">النقاط</span>
              </div>
              
              <div className="w-px h-12 bg-white/20"></div>
              
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-orange-300" />
                  <span className="text-2xl font-bold">{progress.currentStreak}</span>
                </div>
                <span className="text-sm opacity-80">متتالية</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <SupabaseConnectionStatus className="text-white/80" />
              
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold backdrop-blur-sm"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                  خروج
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;