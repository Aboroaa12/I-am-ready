import React from 'react';
import { Home, BookOpen, Users, Clock, Telescope, ShoppingBag, GamepadIcon, LogOut, Shield, Zap, Monitor, MapPin, Globe, Laptop, Heart, Briefcase, Languages, Star, FlaskRound as Flask, Newspaper, AlertTriangle, Palette, GraduationCap, Building, Leaf, Lightbulb, BookOpen as Book, Edit } from 'lucide-react';
import { GradeAccess, Subject } from '../types';
import { getGradeGradientColor, getGradeLightColor } from '../utils/gradeColors';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  gradeAccess: GradeAccess;
  currentSubject?: Subject | null;
  onLogout: () => void;
}

const getTabsByGrade = (grade: number, isAdmin: boolean = false, currentSubject?: Subject | null) => {
  // إذا كان المستخدم مديراً، أضف تبويب لوحة التحكم
  const adminTabs = [
    { id: 'admin', label: 'لوحة تحكم المدير', englishLabel: 'Admin Panel', icon: Shield }
  ];

  const baseTabs = [
    { id: 'units', label: 'الوحدات الدراسية', englishLabel: 'Study Units', icon: BookOpen },
    { id: 'practice', label: 'التدريب التفاعلي', englishLabel: 'Interactive Practice', icon: GamepadIcon },
    { id: 'free-writing', label: 'الكتابة الحرة', englishLabel: 'Free Writing', icon: Edit }
  ];

  // إذا كان المستخدم مديراً، أضف تبويب لوحة التحكم في المقدمة
  if (isAdmin) {
    return [...adminTabs, ...baseTabs];
  }
  
  return baseTabs;
};

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, gradeAccess, currentSubject, onLogout }) => {
  const tabs = getTabsByGrade(gradeAccess.grade, gradeAccess.isAdmin, currentSubject);
  const gradeColor = getGradeLightColor(gradeAccess.grade);
  const gradientColor = getGradeGradientColor(gradeAccess.grade);

  return (
    <nav className="bg-white border-b-4 border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Grade Info Header */}
        <div className={`flex items-center justify-between py-3 border-b border-gray-100 ${gradeColor}`}>
          <div className="flex items-center gap-3">
            {gradeAccess.isAdmin ? (
              <Shield className="w-6 h-6 text-purple-600" />
            ) : (
              <BookOpen className="w-6 h-6 text-blue-600" />
            )}
            <div>
              <h2 className="font-bold text-gray-800 text-lg">
                {gradeAccess.isAdmin ? 'المدير العام 👑' : 
                 gradeAccess.isTeacher ? `أستاذ ${gradeAccess.teacherName?.split(' ')[0] || 'المعلم'} 👨‍🏫` :
                 gradeAccess.isStudent ? `${gradeAccess.studentName?.split(' ')[0] || 'الطالب'} 👨‍🎓` :
                 gradeAccess.name}
              </h2>
              {gradeAccess.isAdmin && (
                <p className="text-sm text-purple-600">وصول شامل لجميع الصفوف</p>
              )}
              {gradeAccess.isTeacher && (
                <p className="text-sm text-blue-600">معلم - {gradeAccess.name}</p>
              )}
              {gradeAccess.isStudent && (
                <p className="text-sm text-green-600">{gradeAccess.name}</p>
              )}
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" />
            خروج
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex flex-col items-center gap-2 px-4 py-4 whitespace-nowrap font-semibold transition-all duration-200 min-w-max text-sm
                  ${isActive 
                    ? `bg-gradient-to-r ${gradientColor} text-white transform -translate-y-1 rounded-t-lg` 
                    : `text-gray-600 hover:bg-gradient-to-r hover:${gradientColor} hover:text-white hover:rounded-t-lg`
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <div className="text-center">
                  <div className="font-bold">{tab.label}</div>
                  <div className="text-xs opacity-80">{tab.englishLabel}</div>
                </div>
              </button>
            );
          })}
          
        </div>
      </div>
    </nav>
  );
};

export default Navigation;